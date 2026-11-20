import { notFound } from 'next/navigation';
import { CategoryForm } from '@/components/admin/CategoryForm';
import { getCategoryById } from '@/lib/data/admin/categories';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params;
  const category = await getCategoryById(id);
  if (!category) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">Editar editoria</h1>
      <CategoryForm category={category} />
    </div>
  );
}
