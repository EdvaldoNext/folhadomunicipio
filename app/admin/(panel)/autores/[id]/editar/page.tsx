import { notFound } from 'next/navigation';
import { AuthorForm } from '@/components/admin/AuthorForm';
import { getAuthorById } from '@/lib/data/admin/authors';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditAuthorPage({ params }: Props) {
  const { id } = await params;
  const author = await getAuthorById(id);
  if (!author) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">Editar autor</h1>
      <AuthorForm author={author} />
    </div>
  );
}
