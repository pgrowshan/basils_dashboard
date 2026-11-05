import { useState } from 'react';
import { useGetCategories } from '../hooks/category/useGetCategories.js';
import { useCreateProduct } from '../hooks/product/useCreateProduct.js';
import { useGetProducts } from '../hooks/product/useGetProducts.js';
import { getApiErrorMessage } from '../lib/getApiErrorMessage.js';
import { Button, Card, EmptyState, Field, Input, PageHeader, Select, StatusNote, Textarea } from './ui.jsx';

const EMPTY = {
  categoryId: '',
  title: '',
  subTitle: '',
  description: '',
  price: '',
  howMuchToTakeText: '',
  whereToTakeText: '',
  ingredientsText: '',
};

export default function ProductsPage() {
  const { data: categories = [] } = useGetCategories();
  const { data: products = [], isLoading } = useGetProducts();
  const createProduct = useCreateProduct();
  const [fields, setFields] = useState(EMPTY);
  const [files, setFiles] = useState({
    image: null,
    howMuchToTakeImage: null,
    whereToTakeImage: null,
    ingredientsImage: null,
  });

  const setField = (event) => {
    const { name, value } = event.target;
    setFields((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('data', JSON.stringify({
      ...fields,
      price: Number(fields.price),
      subDescriptions: [],
    }));
    formData.append('image', files.image);
    formData.append('howMuchToTakeImage', files.howMuchToTakeImage);
    formData.append('whereToTakeImage', files.whereToTakeImage);
    formData.append('ingredientsImage', files.ingredientsImage);

    createProduct.mutate(formData, {
      onSuccess: () => {
        setFields(EMPTY);
        setFiles({ image: null, howMuchToTakeImage: null, whereToTakeImage: null, ingredientsImage: null });
        event.target.reset();
      },
    });
  };

  return (
    <section className="grid gap-5">
      <PageHeader
        eyebrow="Catalog"
        title="Products"
        description="New bars appear on the shop after you save them."
      />

      <Card>
        <form onSubmit={handleSubmit} className="grid gap-4">
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
          <Field label="Main image">
            <Input required type="file" accept="image/*" onChange={(event) => setFiles((current) => ({ ...current, image: event.target.files?.[0] || null }))} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="How much to take">
              <Input required name="howMuchToTakeText" value={fields.howMuchToTakeText} onChange={setField} placeholder="Text" />
              <Input required type="file" accept="image/*" className="mt-2" onChange={(event) => setFiles((current) => ({ ...current, howMuchToTakeImage: event.target.files?.[0] || null }))} />
            </Field>
            <Field label="Where to use">
              <Input required name="whereToTakeText" value={fields.whereToTakeText} onChange={setField} placeholder="Text" />
              <Input required type="file" accept="image/*" className="mt-2" onChange={(event) => setFiles((current) => ({ ...current, whereToTakeImage: event.target.files?.[0] || null }))} />
            </Field>
            <Field label="Ingredients">
              <Input required name="ingredientsText" value={fields.ingredientsText} onChange={setField} placeholder="Text" />
              <Input required type="file" accept="image/*" className="mt-2" onChange={(event) => setFiles((current) => ({ ...current, ingredientsImage: event.target.files?.[0] || null }))} />
            </Field>
          </div>
          {createProduct.isError && <StatusNote tone="danger">{getApiErrorMessage(createProduct.error)}</StatusNote>}
          {createProduct.isSuccess && <StatusNote tone="success">Product created. It is now on the shop.</StatusNote>}
          <Button type="submit" disabled={createProduct.isPending || categories.length === 0} className="w-full sm:w-fit">
            {createProduct.isPending ? 'Saving...' : 'Add product'}
          </Button>
        </form>
      </Card>

      {isLoading && <StatusNote>Loading products...</StatusNote>}
      <div className="grid gap-3">
        {products.map((product) => (
          <article key={product._id} className="flex items-center gap-4 rounded-2xl border border-[#E6E1D6] bg-white p-3 sm:p-4">
            {product.image?.[0]?.url && <img src={product.image[0].url} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover sm:h-16 sm:w-16" />}
            <div className="min-w-0">
              <p className="truncate font-['Circe'] font-semibold">{product.title}</p>
              <p className="font-['Circe'] text-sm text-[#5C6B82]">${Number(product.price).toFixed(2)}</p>
            </div>
          </article>
        ))}
      </div>
      {!isLoading && products.length === 0 && <EmptyState>No products yet.</EmptyState>}
    </section>
  );
}
