import { useEffect, useState } from 'react';
import { useGetCategories } from '../hooks/category/useGetCategories.js';
import { useCreateProduct, useDeleteProduct, useUpdateProduct } from '../hooks/product/useCreateProduct.js';
import { useGetAdminProducts } from '../hooks/product/useGetProducts.js';
import { getApiErrorMessage } from '../lib/getApiErrorMessage.js';
import { Button, Card, Field, Input, PageHeader, Select, StatusNote, Textarea } from './ui.jsx';

const EMPTY_FIELDS = {
  categoryId: '',
  title: '',
  subTitle: '',
  description: '',
  price: '',
  howMuchToTakeText: '',
  whereToTakeText: '',
  ingredientsText: '',
};

const EMPTY_FILES = {
  image: null,
  howMuchToTakeImage: null,
  whereToTakeImage: null,
  ingredientsImage: null,
};

function money(amount) {
  return `$${Number(amount || 0).toFixed(2)}`;
}

function formatWhen(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}

function fieldsFromProduct(product) {
  if (!product) return EMPTY_FIELDS;
  return {
    categoryId: product.categoryId || '',
    title: product.title || '',
    subTitle: product.subTitle || '',
    description: product.description || '',
    price: product.price === 0 || product.price ? String(product.price) : '',
    howMuchToTakeText: product.howMuchToTake?.text || '',
    whereToTakeText: product.whereToTake?.text || '',
    ingredientsText: product.ingredients?.text || '',
  };
}

function existingImages(product) {
  return {
    image: product?.image?.[0]?.url || '',
    howMuchToTakeImage: product?.howMuchToTake?.image?.url || '',
    whereToTakeImage: product?.whereToTake?.image?.url || '',
    ingredientsImage: product?.ingredients?.image?.url || '',
  };
}

function buildFormData(fields, files) {
  const formData = new FormData();
  formData.append('data', JSON.stringify({
    categoryId: fields.categoryId,
    title: fields.title.trim(),
    subTitle: fields.subTitle.trim(),
    description: fields.description.trim(),
    price: Number(fields.price),
    howMuchToTakeText: fields.howMuchToTakeText.trim(),
    whereToTakeText: fields.whereToTakeText.trim(),
    ingredientsText: fields.ingredientsText.trim(),
    subDescriptions: [],
  }));
  if (files.image) formData.append('image', files.image);
  if (files.howMuchToTakeImage) formData.append('howMuchToTakeImage', files.howMuchToTakeImage);
  if (files.whereToTakeImage) formData.append('whereToTakeImage', files.whereToTakeImage);
  if (files.ingredientsImage) formData.append('ingredientsImage', files.ingredientsImage);
  return formData;
}

function ConfirmDialog({ title, body, confirmLabel, busy, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
        <p className="font-circe text-[11px] font-semibold tracking-[0.16em] text-[#8A97A8] uppercase">Confirm</p>
        <h3 className="mt-1 font-gelica text-xl text-[#1A2744]">{title}</h3>
        <p className="mt-3 font-circe text-sm leading-relaxed text-[#5C6B82]">{body}</p>
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose} disabled={busy}>Back</Button>
          <Button type="button" variant="danger" onClick={onConfirm} disabled={busy}>
            {busy ? 'Deleting…' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ImageField({ label, hint, file, existingUrl, onChange }) {
  const [preview, setPreview] = useState(existingUrl || '');

  useEffect(() => {
    if (!file) {
      setPreview(existingUrl || '');
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file, existingUrl]);

  return (
    <div>
      <span className="mb-1.5 block font-circe text-[11px] font-semibold tracking-[0.12em] text-[#7A8BA3] uppercase">
        {label}
      </span>
      <div className="flex items-center gap-3 rounded-xl border border-[#D7DEE8] bg-[#FBF9F4] p-2.5">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#EFEBE3]">
          {preview ? (
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center font-circe text-[10px] text-[#8A97A8]">Photo</div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <label className="inline-flex cursor-pointer items-center rounded-lg border border-[#D7DEE8] bg-white px-3 py-1.5 font-circe text-xs font-semibold text-[#1A2744] hover:bg-[#F7F4EE]">
            {preview ? 'Replace' : 'Choose photo'}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => onChange(event.target.files?.[0] || null)}
            />
          </label>
          <p className="mt-1 truncate font-circe text-[11px] text-[#8A97A8]">
            {file?.name || hint || 'PNG or JPG'}
          </p>
        </div>
      </div>
    </div>
  );
}

function ProductEditor({ product, categories, busy, error, onClose, onSubmit }) {
  const isEdit = Boolean(product);
  const [fields, setFields] = useState(() => fieldsFromProduct(product));
  const [files, setFiles] = useState(EMPTY_FILES);
  const [localError, setLocalError] = useState('');
  const images = existingImages(product);

  const setField = (event) => {
    const { name, value } = event.target;
    setFields((current) => ({ ...current, [name]: value }));
  };

  const setFile = (name, file) => {
    setFiles((current) => ({ ...current, [name]: file }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLocalError('');
    if (!isEdit) {
      const missing = ['image', 'howMuchToTakeImage', 'whereToTakeImage', 'ingredientsImage']
        .filter((key) => !files[key]);
      if (missing.length) {
        setLocalError('Add a shop photo and the three detail photos before saving.');
        return;
      }
    }
    onSubmit(buildFormData(fields, files));
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <button type="button" aria-label="Close editor" className="absolute inset-0 cursor-pointer" onClick={() => !busy && onClose()} />
      <aside className="relative flex h-full w-full max-w-xl flex-col bg-[#F4F1EA] shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-[#E6E1D6] bg-white px-5 py-4">
          <div>
            <p className="font-circe text-[11px] font-semibold tracking-[0.16em] text-[#4372B8] uppercase">
              {isEdit ? 'Edit product' : 'New product'}
            </p>
            <h3 className="mt-1 font-gelica text-xl text-[#1A2744]">
              {isEdit ? product.title : 'Add a bar to the shop'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-[#D7DEE8] text-[#1A2744] hover:bg-[#F7F4EE]"
            aria-label="Close"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
            <section className="space-y-4">
              <p className="font-circe text-[11px] font-semibold tracking-[0.14em] text-[#8A97A8] uppercase">Shop listing</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Category">
                  <Select required name="categoryId" value={fields.categoryId} onChange={setField}>
                    <option value="">Choose a category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>{category.title}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Price">
                  <Input required name="price" type="number" min="0" step="0.01" value={fields.price} onChange={setField} placeholder="65.00" />
                </Field>
              </div>
              <Field label="Title">
                <Input required name="title" value={fields.title} onChange={setField} placeholder="3g Blueberry Dark Chocolate" />
              </Field>
              <Field label="Subtitle">
                <Input required name="subTitle" value={fields.subTitle} onChange={setField} placeholder="3g bar" />
              </Field>
              <Field label="Description">
                <Textarea required name="description" value={fields.description} onChange={setField} placeholder="What makes this bar special" />
              </Field>
              <ImageField
                label="Shop photo"
                hint={isEdit ? 'Leave empty to keep the current photo' : 'Shown on the shop card'}
                file={files.image}
                existingUrl={images.image}
                onChange={(file) => setFile('image', file)}
              />
            </section>

            <section className="space-y-4">
              <div>
                <p className="font-circe text-[11px] font-semibold tracking-[0.14em] text-[#8A97A8] uppercase">Product details</p>
                <p className="mt-1 font-circe text-xs text-[#7A8BA3]">These appear on the product page. Replace a photo only if it needs updating.</p>
              </div>
              <Field label="How much to take">
                <Input required name="howMuchToTakeText" value={fields.howMuchToTakeText} onChange={setField} placeholder="One square, then wait" />
              </Field>
              <ImageField
                label="How much photo"
                hint={isEdit ? 'Optional replace' : 'Required'}
                file={files.howMuchToTakeImage}
                existingUrl={images.howMuchToTakeImage}
                onChange={(file) => setFile('howMuchToTakeImage', file)}
              />
              <Field label="Where to use">
                <Input required name="whereToTakeText" value={fields.whereToTakeText} onChange={setField} placeholder="Evening, with tea" />
              </Field>
              <ImageField
                label="Where photo"
                hint={isEdit ? 'Optional replace' : 'Required'}
                file={files.whereToTakeImage}
                existingUrl={images.whereToTakeImage}
                onChange={(file) => setFile('whereToTakeImage', file)}
              />
              <Field label="Ingredients">
                <Input required name="ingredientsText" value={fields.ingredientsText} onChange={setField} placeholder="Cacao, blueberry" />
              </Field>
              <ImageField
                label="Ingredients photo"
                hint={isEdit ? 'Optional replace' : 'Required'}
                file={files.ingredientsImage}
                existingUrl={images.ingredientsImage}
                onChange={(file) => setFile('ingredientsImage', file)}
              />
            </section>

            {localError && <StatusNote tone="danger">{localError}</StatusNote>}
            {error && <StatusNote tone="danger">{error}</StatusNote>}
          </div>

          <div className="flex gap-2 border-t border-[#E6E1D6] bg-white px-5 py-4">
            <Button type="button" variant="secondary" onClick={onClose} disabled={busy} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={busy || categories.length === 0} className="flex-1">
              {busy ? 'Saving…' : isEdit ? 'Save changes' : 'Add product'}
            </Button>
          </div>
        </form>
      </aside>
    </div>
  );
}

export default function ProductsPage() {
  const { data: categories = [] } = useGetCategories();
  const [search, setSearch] = useState('');
  const [q, setQ] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [page, setPage] = useState(1);
  const [editor, setEditor] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setQ(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [q, categoryId]);

  useEffect(() => {
    document.body.style.overflow = editor || pendingDelete ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [editor, pendingDelete]);

  const params = { page, limit: 20, q, categoryId };
  const { data, isLoading, isError, error, isFetching } = useGetAdminProducts(params);
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const removeProduct = useDeleteProduct();

  const products = data?.products || [];
  const counts = data?.counts || { all: 0 };
  const meta = data?.meta || { page: 1, limit: 20, total: 0, pages: 1 };
  const saving = createProduct.isPending || updateProduct.isPending;
  const categoryName = (id) => categories.find((category) => category._id === id)?.title || 'Uncategorized';
  const saveMutation = editor?._id ? updateProduct : createProduct;
  const saveError = editor && saveMutation.isError ? getApiErrorMessage(saveMutation.error) : '';

  const openEditor = (product) => {
    createProduct.reset();
    updateProduct.reset();
    setNotice('');
    setEditor(product);
  };

  const openCreate = () => {
    if (!categories.length) return;
    openEditor({});
  };

  const handleSave = (formData) => {
    if (editor?._id) {
      updateProduct.mutate({ id: editor._id, formData }, {
        onSuccess: () => {
          setEditor(null);
          setNotice('Product updated. The shop already shows the new details.');
        },
      });
      return;
    }
    createProduct.mutate(formData, {
      onSuccess: () => {
        setEditor(null);
        setNotice('Product added. It is now on the shop.');
      },
    });
  };

  return (
    <section className="grid gap-5">
      <PageHeader
        eyebrow="Catalog"
        title="Products"
        description="Add a bar, change price or photos, or take one off the shop. Existing orders keep the item they bought."
        action={(
          <Button type="button" onClick={openCreate} disabled={!categories.length} className="w-full sm:w-fit">
            Add product
          </Button>
        )}
      />

      {!categories.length && (
        <StatusNote tone="danger">Add a category first. Every product needs one.</StatusNote>
      )}
      {isError && <StatusNote tone="danger">{getApiErrorMessage(error)}</StatusNote>}
      {removeProduct.isError && <StatusNote tone="danger">{getApiErrorMessage(removeProduct.error)}</StatusNote>}
      {notice && <StatusNote tone="success">{notice}</StatusNote>}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setCategoryId('')}
            className={`cursor-pointer rounded-full px-3 py-1.5 font-circe text-xs font-semibold transition ${
              !categoryId ? 'bg-[#1A2744] text-white' : 'border border-[#E7E2D6] bg-white text-[#5C6B82] hover:text-[#1A2744]'
            }`}
          >
            All
            <span className="ml-1.5 tabular-nums opacity-70">{counts.all ?? 0}</span>
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              type="button"
              onClick={() => setCategoryId(category._id)}
              className={`cursor-pointer rounded-full px-3 py-1.5 font-circe text-xs font-semibold transition ${
                categoryId === category._id
                  ? 'bg-[#1A2744] text-white'
                  : 'border border-[#E7E2D6] bg-white text-[#5C6B82] hover:text-[#1A2744]'
              }`}
            >
              {category.title}
              <span className="ml-1.5 tabular-nums opacity-70">{counts[category._id] ?? 0}</span>
            </button>
          ))}
        </div>
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search title or description"
          className="sm:max-w-sm"
        />
      </div>

      <Card className="overflow-hidden p-0 sm:p-0">
        <div className="flex items-center justify-between border-b border-[#F0EBE0] px-4 py-3 sm:px-5">
          <p className="font-circe text-sm text-[#6B7A90]">
            {isLoading ? 'Loading…' : `${meta.total} product${meta.total === 1 ? '' : 's'}`}
            {isFetching && !isLoading ? ' · updating' : ''}
          </p>
          <p className="font-circe text-xs text-[#8A97A8]">Page {meta.page} of {meta.pages || 1}</p>
        </div>

        <ul className="divide-y divide-[#F0EBE0]">
          {products.map((product) => (
            <li key={product._id} className="flex items-start gap-3 px-4 py-3 sm:items-center sm:gap-4 sm:px-5">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#EFEBE3] sm:h-[72px] sm:w-[72px]">
                {product.image?.[0]?.url ? (
                  <img src={product.image[0].url} alt="" className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-circe font-semibold text-[#1A2744]">{product.title}</p>
                <p className="mt-0.5 truncate font-circe text-[12px] text-[#8A97A8]">
                  {product.subTitle}
                  {product.subTitle ? ' · ' : ''}
                  {categoryName(product.categoryId)}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2 sm:hidden">
                  <p className="font-circe text-sm font-semibold tabular-nums">{money(product.price)}</p>
                  <Button type="button" size="sm" variant="secondary" onClick={() => openEditor(product)}>
                    Edit
                  </Button>
                  <Button type="button" size="sm" variant="danger" onClick={() => setPendingDelete(product)}>
                    Delete
                  </Button>
                </div>
              </div>
              <div className="hidden shrink-0 items-center gap-3 sm:flex">
                <div className="text-right">
                  <p className="font-circe font-semibold tabular-nums text-[#1A2744]">{money(product.price)}</p>
                  <p className="mt-0.5 font-circe text-[11px] text-[#8A97A8]">Updated {formatWhen(product.updatedAt)}</p>
                </div>
                <Button type="button" size="sm" variant="secondary" onClick={() => openEditor(product)}>
                  Edit
                </Button>
                <Button type="button" size="sm" variant="danger" onClick={() => setPendingDelete(product)}>
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>

        {!isLoading && products.length === 0 && (
          <div className="px-4 py-12 text-center">
            <p className="font-gelica text-lg text-[#1A2744]">No products in this view</p>
            <p className="mt-2 font-circe text-sm text-[#6B7A90]">
              {q || categoryId ? 'Try another search or category.' : 'Add the first bar to put it on the shop.'}
            </p>
            {!q && !categoryId && categories.length > 0 && (
              <Button type="button" className="mt-4" onClick={openCreate}>Add product</Button>
            )}
          </div>
        )}

        {meta.pages > 1 && (
          <div className="flex items-center justify-between gap-3 border-t border-[#F0EBE0] px-4 py-3 sm:px-5">
            <Button type="button" size="sm" variant="secondary" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>
              Previous
            </Button>
            <p className="font-circe text-xs text-[#8A97A8]">
              {((meta.page - 1) * meta.limit) + 1}–{Math.min(meta.page * meta.limit, meta.total)} of {meta.total}
            </p>
            <Button type="button" size="sm" variant="secondary" disabled={page >= meta.pages} onClick={() => setPage((value) => value + 1)}>
              Next
            </Button>
          </div>
        )}
      </Card>

      {editor && (
        <ProductEditor
          product={editor._id ? editor : null}
          categories={categories}
          busy={saving}
          error={saveError}
          onClose={() => !saving && setEditor(null)}
          onSubmit={handleSave}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          title={`Delete ${pendingDelete.title}?`}
          body="This removes it from the shop. Orders that already include this bar keep it."
          confirmLabel="Delete product"
          busy={removeProduct.isPending}
          onClose={() => !removeProduct.isPending && setPendingDelete(null)}
          onConfirm={() => {
            removeProduct.mutate(pendingDelete._id, {
              onSuccess: () => {
                setPendingDelete(null);
                setNotice('Product removed from the shop.');
              },
            });
          }}
        />
      )}
    </section>
  );
}
