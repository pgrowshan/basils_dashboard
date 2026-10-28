import { useState } from 'react';
import { useGetCategories } from '../hooks/category/useGetCategories.js';
import { useCreateProduct } from '../hooks/product/useCreateProduct.js';
import { useGetProducts } from '../hooks/product/useGetProducts.js';
import { getApiErrorMessage } from '../lib/getApiErrorMessage.js';

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
    <section>
      <h2 className="font-gelica text-3xl">Products</h2>
      <form onSubmit={handleSubmit} className="mt-5 grid gap-3 bg-white p-5">
        <select required name="categoryId" value={fields.categoryId} onChange={setField} className="border border-[#D7DEE8] px-3 py-2 font-['Circe']">
          <option value="">Choose a category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>{category.title}</option>
          ))}
        </select>
        <input required name="title" value={fields.title} onChange={setField} placeholder="Title" className="border border-[#D7DEE8] px-3 py-2 font-['Circe']" />
        <input required name="subTitle" value={fields.subTitle} onChange={setField} placeholder="Subtitle" className="border border-[#D7DEE8] px-3 py-2 font-['Circe']" />
        <textarea required name="description" value={fields.description} onChange={setField} placeholder="Description" className="min-h-24 border border-[#D7DEE8] px-3 py-2 font-['Circe']" />
        <input required name="price" type="number" min="0" step="0.01" value={fields.price} onChange={setField} placeholder="Price" className="border border-[#D7DEE8] px-3 py-2 font-['Circe']" />
        <label className="font-['Circe'] text-sm">Main image<input required type="file" accept="image/*" onChange={(event) => setFiles((current) => ({ ...current, image: event.target.files?.[0] || null }))} /></label>
        <label className="font-['Circe'] text-sm">How much to take<input required name="howMuchToTakeText" value={fields.howMuchToTakeText} onChange={setField} placeholder="Text" className="mt-1 block w-full border border-[#D7DEE8] px-3 py-2" /><input required type="file" accept="image/*" onChange={(event) => setFiles((current) => ({ ...current, howMuchToTakeImage: event.target.files?.[0] || null }))} /></label>
        <label className="font-['Circe'] text-sm">Where to use<input required name="whereToTakeText" value={fields.whereToTakeText} onChange={setField} placeholder="Text" className="mt-1 block w-full border border-[#D7DEE8] px-3 py-2" /><input required type="file" accept="image/*" onChange={(event) => setFiles((current) => ({ ...current, whereToTakeImage: event.target.files?.[0] || null }))} /></label>
        <label className="font-['Circe'] text-sm">Ingredients<input required name="ingredientsText" value={fields.ingredientsText} onChange={setField} placeholder="Text" className="mt-1 block w-full border border-[#D7DEE8] px-3 py-2" /><input required type="file" accept="image/*" onChange={(event) => setFiles((current) => ({ ...current, ingredientsImage: event.target.files?.[0] || null }))} /></label>
        {createProduct.isError && <p className="font-['Circe'] text-sm text-red-600">{getApiErrorMessage(createProduct.error)}</p>}
        {createProduct.isSuccess && <p className="font-['Circe'] text-sm text-[#3E5A30]">Product created. It is now on the shop.</p>}
        <button type="submit" disabled={createProduct.isPending || categories.length === 0} className="w-fit cursor-pointer bg-[#4372B8] px-4 py-2 font-['Circe'] text-white disabled:opacity-50">
          {createProduct.isPending ? 'Saving...' : 'Add product'}
        </button>
      </form>

      <div className="mt-6 grid gap-3">
        {isLoading && <p className="font-['Circe'] text-sm">Loading products...</p>}
        {products.map((product) => (
          <article key={product._id} className="flex items-center gap-4 bg-white p-3">
            {product.image?.[0]?.url && <img src={product.image[0].url} alt="" className="h-16 w-16 object-cover" />}
            <div>
              <p className="font-['Circe'] font-semibold">{product.title}</p>
              <p className="font-['Circe'] text-sm text-[#5C6B82]">${Number(product.price).toFixed(2)}</p>
            </div>
          </article>
        ))}
        {!isLoading && products.length === 0 && <p className="font-['Circe'] text-sm text-[#5C6B82]">No products yet.</p>}
      </div>
    </section>
  );
}
