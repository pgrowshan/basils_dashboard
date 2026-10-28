import { useState } from 'react';
import { useCreateCategory } from '../hooks/category/useCreateCategory.js';
import { useGetCategories } from '../hooks/category/useGetCategories.js';
import { getApiErrorMessage } from '../lib/getApiErrorMessage.js';

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useGetCategories();
  const createCategory = useCreateCategory();
  const [title, setTitle] = useState('');
  const [categoryTitleColor, setCategoryTitleColor] = useState('#4372B8');
  const [image, setImage] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!image) return;
    const formData = new FormData();
    formData.append('title', title);
    formData.append('categoryTitleColor', categoryTitleColor);
    formData.append('image', image);
    createCategory.mutate(formData, {
      onSuccess: () => {
        setTitle('');
        setImage(null);
        event.target.reset();
      },
    });
  };

  return (
    <section>
      <h2 className="font-gelica text-3xl">Categories</h2>
      <form onSubmit={handleSubmit} className="mt-5 grid gap-3 bg-white p-5">
        <input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Category title" className="border border-[#D7DEE8] px-3 py-2 font-['Circe']" />
        <label className="flex items-center gap-3 font-['Circe'] text-sm">
          Title color
          <input type="color" value={categoryTitleColor} onChange={(event) => setCategoryTitleColor(event.target.value)} />
        </label>
        <input required type="file" accept="image/*" onChange={(event) => setImage(event.target.files?.[0] || null)} className="font-['Circe'] text-sm" />
        {createCategory.isError && <p className="font-['Circe'] text-sm text-red-600">{getApiErrorMessage(createCategory.error)}</p>}
        {createCategory.isSuccess && <p className="font-['Circe'] text-sm text-[#3E5A30]">Category created.</p>}
        <button type="submit" disabled={createCategory.isPending} className="w-fit cursor-pointer bg-[#4372B8] px-4 py-2 font-['Circe'] text-white disabled:opacity-50">
          {createCategory.isPending ? 'Saving...' : 'Add category'}
        </button>
      </form>

      <div className="mt-6 grid gap-3">
        {isLoading && <p className="font-['Circe'] text-sm">Loading categories...</p>}
        {categories.map((category) => (
          <article key={category._id} className="flex items-center gap-4 bg-white p-3">
            {category.image?.url && <img src={category.image.url} alt="" className="h-16 w-16 object-cover" />}
            <div>
              <p className="font-['Circe'] font-semibold" style={{ color: category.categoryTitleColor }}>{category.title}</p>
              <p className="font-['Circe'] text-xs text-[#7A8BA3]">{category._id}</p>
            </div>
          </article>
        ))}
        {!isLoading && categories.length === 0 && <p className="font-['Circe'] text-sm text-[#5C6B82]">No categories yet.</p>}
      </div>
    </section>
  );
}
