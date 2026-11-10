import { useEffect, useState } from 'react';
import { useGetCategories } from '../hooks/category/useGetCategories.js';
import { useCreateProduct, useDeleteProduct, useUpdateProduct } from '../hooks/product/useCreateProduct.js';
import { useGetAdminProducts } from '../hooks/product/useGetProducts.js';
import { getApiErrorMessage } from '../lib/getApiErrorMessage.js';
import { Button, Card, Field, Input, PageHeader, Select, StatusNote, Textarea } from './ui.jsx';

const MAX_PHOTOS = 8;

const EMPTY_FIELDS = {
  categoryId: '',
  title: '',
  subTitle: '',
  description: '',
  price: '',
  dosePerPiece: '',
  piecesPerBar: '24',
  howMuchToTakeText: '',
  whereToTakeText: '',
  ingredientsText: '',
};

const EMPTY_FILES = {
  whereToTakeImage: null,
  ingredientsImage: null,
};

const SECTION_HINT = 'Separate sections with a blank line. The first line of a section shows in bold.';

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
    dosePerPiece: product.dosePerPiece || '',
    piecesPerBar: product.piecesPerBar ? String(product.piecesPerBar) : '24',
    howMuchToTakeText: product.howMuchToTake?.text || '',
    whereToTakeText: product.whereToTake?.text || '',
    ingredientsText: product.ingredients?.text || '',
  };
}

function existingImages(product) {
  return {
    whereToTakeImage: product?.whereToTake?.image?.url || '',
    ingredientsImage: product?.ingredients?.image?.url || '',
  };
}

function buildFormData(fields, files, photos, isEdit) {
  const formData = new FormData();
  const data = {
    categoryId: fields.categoryId,
    title: fields.title.trim(),
    subTitle: fields.subTitle.trim(),
    description: fields.description.trim(),
    price: Number(fields.price),
    dosePerPiece: fields.dosePerPiece.trim(),
    piecesPerBar: Number(fields.piecesPerBar),
    howMuchToTakeText: fields.howMuchToTakeText.trim(),
    whereToTakeText: fields.whereToTakeText.trim(),
    ingredientsText: fields.ingredientsText.trim(),
    subDescriptions: [],
  };
  if (isEdit) data.keepImages = photos.kept.map((image) => image.publicId);
  formData.append('data', JSON.stringify(data));
  photos.added.forEach((file) => formData.append('image', file));
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
  const preview = Boolean(file || existingUrl);

  return (
    <div>
      <span className="mb-1.5 block font-circe text-[11px] font-semibold tracking-[0.12em] text-[#7A8BA3] uppercase">
        {label}
      </span>
      <div className="flex items-center gap-3 rounded-xl border border-[#D7DEE8] bg-[#FBF9F4] p-2.5">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#EFEBE3]">
          {file ? (
            <FilePreview file={file} className="h-full w-full object-cover" />
          ) : existingUrl ? (
            <img src={existingUrl} alt="" className="h-full w-full object-cover" />
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

function FilePreview({ file, className }) {
  const [preview, setPreview] = useState({ file: null, url: '' });

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = () => setPreview({ file, url: String(reader.result || '') });
    reader.readAsDataURL(file);
    return () => reader.abort();
  }, [file]);

  return preview.file === file && preview.url ? <img src={preview.url} alt="" className={className} /> : null;
}

function PhotoTile({ cover, onRemove, children }) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-lg bg-[#EFEBE3]">
      {children}
      {cover && (
        <span className="absolute left-1 top-1 rounded bg-[#1A2744] px-1.5 py-0.5 font-circe text-[9px] font-semibold text-white">
          Cover
        </span>
      )}
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove photo"
        className="absolute right-1 top-1 inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#1A2744] shadow hover:bg-white"
      >
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
  );
}

function GalleryField({ photos, onChange }) {
  const total = photos.kept.length + photos.added.length;
  const room = MAX_PHOTOS - total;

  const addFiles = (fileList) => {
    const picked = Array.from(fileList || []).slice(0, Math.max(0, room));
    if (picked.length) onChange({ ...photos, added: [...photos.added, ...picked] });
  };

  return (
    <div>
      <span className="mb-1.5 block font-circe text-[11px] font-semibold tracking-[0.12em] text-[#7A8BA3] uppercase">
        Product photos
      </span>
      <div className="grid grid-cols-4 gap-2 rounded-xl border border-[#D7DEE8] bg-[#FBF9F4] p-2.5">
        {photos.kept.map((image, index) => (
          <PhotoTile
            key={image.publicId}
            cover={index === 0}
            onRemove={() => onChange({ ...photos, kept: photos.kept.filter((item) => item.publicId !== image.publicId) })}
          >
            <img src={image.url} alt="" className="h-full w-full object-cover" />
          </PhotoTile>
        ))}
        {photos.added.map((file, index) => (
          <PhotoTile
            key={`${file.name}-${file.lastModified}-${index}`}
            cover={photos.kept.length === 0 && index === 0}
            onRemove={() => onChange({ ...photos, added: photos.added.filter((_, i) => i !== index) })}
          >
            <FilePreview file={file} className="h-full w-full object-cover" />
          </PhotoTile>
        ))}
        {room > 0 && (
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#C9D3E1] bg-white text-center font-circe text-[11px] font-semibold text-[#4372B8] hover:bg-[#F7F4EE]">
            <span className="text-lg leading-none">+</span>
            <span className="mt-1">Add</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(event) => {
                addFiles(event.target.files);
                event.target.value = '';
              }}
            />
          </label>
        )}
      </div>
      <p className="mt-1.5 font-circe text-xs text-[#7A8BA3]">
        The first photo is the cover on the shop card. Up to {MAX_PHOTOS} photos show as thumbnails on the product page.
      </p>
    </div>
  );
}

function ProductEditor({ product, categories, busy, error, onClose, onSubmit }) {
  const isEdit = Boolean(product);
  const [fields, setFields] = useState(() => fieldsFromProduct(product));
  const [files, setFiles] = useState(EMPTY_FILES);
  const [photos, setPhotos] = useState(() => ({
    kept: (product?.image || []).filter((image) => image?.url && image?.publicId),
    added: [],
  }));
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
    if (photos.kept.length + photos.added.length === 0) {
      setLocalError('Add at least one product photo.');
      return;
    }
    if (!isEdit) {
      const missing = ['whereToTakeImage', 'ingredientsImage']
        .filter((key) => !files[key]);
      if (missing.length) {
        setLocalError('Add the Where to use and Ingredients photos before saving.');
        return;
      }
    }
    onSubmit(buildFormData(fields, files, photos, isEdit));
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
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Dose per piece" hint="Like 125mg or 0.25g. Drives the dose chart.">
                  <Input
                    required
                    name="dosePerPiece"
                    value={fields.dosePerPiece}
                    onChange={setField}
                    placeholder="125mg"
                    pattern="\s*\d+(\.\d+)?\s*(mg|MG|Mg|g|G)\s*"
                    title="Use a number with mg or g, like 125mg or 0.25g"
                  />
                </Field>
                <Field label="Pieces per bar" hint="Shown as “24 PIECES / BAR”">
                  <Input required name="piecesPerBar" type="number" min="1" step="1" value={fields.piecesPerBar} onChange={setField} placeholder="24" />
                </Field>
              </div>
              <GalleryField photos={photos} onChange={setPhotos} />
            </section>

            <section className="space-y-4">
              <div>
                <p className="font-circe text-[11px] font-semibold tracking-[0.14em] text-[#8A97A8] uppercase">Product details</p>
                <p className="mt-1 font-circe text-xs text-[#7A8BA3]">These appear on the product page. Replace a photo only if it needs updating.</p>
              </div>
              <Field label="How much to take" hint={`${SECTION_HINT} The dose chart beside it is built from Dose per piece and Pieces per bar.`}>
                <Textarea
                  required
                  name="howMuchToTakeText"
                  value={fields.howMuchToTakeText}
                  onChange={setField}
                  className="min-h-40"
                  placeholder={'Microdose (50mg to 250mg)\nThis sub-perceptual amount is designed to work in the background.\n\nHalf dose (500mg to 1g)\nA subtle but noticeable body high.'}
                />
              </Field>
              <Field label="Where to use" hint={SECTION_HINT}>
                <Textarea
                  required
                  name="whereToTakeText"
                  value={fields.whereToTakeText}
                  onChange={setField}
                  className="min-h-32"
                  placeholder={'At home\nSomewhere quiet and familiar, with a friend nearby.\n\nOutdoors\nA calm park or trail on a clear day.'}
                />
              </Field>
              <ImageField
                label="Where photo"
                hint={isEdit ? 'Optional replace' : 'Required'}
                file={files.whereToTakeImage}
                existingUrl={images.whereToTakeImage}
                onChange={(file) => setFile('whereToTakeImage', file)}
              />
              <Field label="Ingredients" hint={SECTION_HINT}>
                <Textarea
                  required
                  name="ingredientsText"
                  value={fields.ingredientsText}
                  onChange={setField}
                  className="min-h-32"
                  placeholder={'Chocolate\nSingle-origin cacao, raw cane sugar.\n\nMushrooms\n3g dried psilocybe cubensis per bar.'}
                />
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

  const viewKey = `${q}|${categoryId}`;
  const [lastViewKey, setLastViewKey] = useState(viewKey);
  if (lastViewKey !== viewKey) {
    setLastViewKey(viewKey);
    setPage(1);
  }

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
