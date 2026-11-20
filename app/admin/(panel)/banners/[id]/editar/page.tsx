import { notFound } from 'next/navigation';
import { BannerForm } from '@/components/admin/BannerForm';
import { getBannerById } from '@/lib/data/admin/banners';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBannerPage({ params }: Props) {
  const { id } = await params;
  const banner = await getBannerById(id);
  if (!banner) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">Editar anúncio</h1>
      <BannerForm banner={banner} />
    </div>
  );
}
