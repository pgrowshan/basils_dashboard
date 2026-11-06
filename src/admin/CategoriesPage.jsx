import { useState } from 'react';
import { useCreateCategory } from '../hooks/category/useCreateCategory.js';
import { useGetCategories } from '../hooks/category/useGetCategories.js';
import { getApiErrorMessage } from '../lib/getApiErrorMessage.js';
import { Button, Card, EmptyState, Field, Input, PageHeader, StatusNote } from './ui.jsx';

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
    <section className="grid gap-5">
      <PageHeader
        eyebrow="Catalog"
        title="Categories"
        description="These titles and colors appear on shop cards and filters."
      />

      <Card>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <Field label="Category title">
            <Input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Microdose" />
          </Field>
          <Field label="Title color">
            <div className="flex items-center gap-3">
              <input type="color" value={categoryTitleColor} onChange={(event) => setCategoryTitleColor(event.target.value)} className="h-11 w-14 cursor-pointer rounded-xl border border-[#D7DEE8]" />
              <span className="font-circe text-sm text-[#5C6B82]">{categoryTitleColor}</span>
            </div>
          </Field>
          <Field label="Image" hint={image ? image.name : 'PNG or JPG'}>
            <Input required type="file" accept="image/*" onChange={(event) => setImage(event.target.files?.[0] || null)} />
          </Field>
          {createCategory.isError && <StatusNote tone="danger">{getApiErrorMessage(createCategory.error)}</StatusNote>}
          {createCategory.isSuccess && <StatusNote tone="success">Category created.</StatusNote>}
          <Button type="submit" disabled={createCategory.isPending} className="w-full sm:w-fit">
            {createCategory.isPending ? 'Saving...' : 'Add category'}
          </Button>
        </form>
      </Card>

      {isLoading && <StatusNote>Loading categories...</StatusNote>}
      <div className="grid gap-3">
        {categories.map((category) => (
          <article key={category._id} className="flex items-center gap-4 rounded-2xl border border-[#E6E1D6] bg-white p-3 sm:p-4">
            {category.image?.url && <img src={category.image.url} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover sm:h-16 sm:w-16" />}
            <div className="min-w-0">
              <p className="truncate font-circe font-semibold" style={{ color: category.categoryTitleColor }}>{category.title}</p>
              <p className="truncate font-circe text-xs text-[#7A8BA3]">{category._id}</p>
            </div>
          </article>
        ))}
      </div>
      {!isLoading && categories.length === 0 && <EmptyState>No categories yet.</EmptyState>}
    </section>
  );
}
