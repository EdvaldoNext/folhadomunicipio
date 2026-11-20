import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Sidebar } from '@/components/common/Sidebar';
import { AdBanner } from '@/components/features/AdBanner';
import { HeroGrid } from '@/components/features/HeroGrid';
import { NewsCard } from '@/components/features/NewsCard';
import { getCategories, getCategoryBySlug } from '@/lib/data/categories';
import { getPostsByCategory } from '@/lib/data/posts';

export const revalidate = 60;
export const dynamicParams = true;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const categories = await getCategories();
    return categories.map((category) => ({ slug: category.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: 'Editoria não encontrada' };
  }

  return {
    title: category.name,
    description: `Últimas notícias de ${category.name} na Folha do Município.`,
    alternates: { canonical: `/editoria/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const posts = await getPostsByCategory(slug, 12);
  const [main, ...rest] = posts;
  const secondary = rest.slice(0, 3);
  const others = rest.slice(3);

  return (
    <>
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <div className="mb-6">
          <AdBanner placement="header_top" />
        </div>

        <div
          className="mb-6 border-b-4 pb-3"
          style={{ borderColor: category.color_code ?? '#991B1B' }}
        >
          <h1
            className="font-display text-3xl font-extrabold uppercase tracking-wide"
            style={{ color: category.color_code ?? '#991B1B' }}
          >
            {category.name}
          </h1>
        </div>

        <div className="grid gap-10 lg:grid-cols-4">
          <div className="lg:col-span-3">
            {posts.length > 0 ? (
              <div className="flex flex-col gap-10">
                <HeroGrid main={main ?? null} secondary={secondary} />
                {others.length > 0 ? (
                  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {others.map((post) => (
                      <NewsCard key={post.id} post={post} />
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="py-12 text-center text-gray-500">
                Nenhuma notícia publicada nesta editoria ainda.
              </p>
            )}
          </div>

          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
