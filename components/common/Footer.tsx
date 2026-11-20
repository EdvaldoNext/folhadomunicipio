import Link from 'next/link';
import { getCategories } from '@/lib/data/categories';
import { SITE_NAME } from '@/lib/site';

export async function Footer() {
  const categories = await getCategories();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t-4 border-accent-600 bg-brand-900 text-brand-100">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-black tracking-tight text-white">
            Folha do <span className="text-accent-400">Município</span>
          </p>
          <p className="mt-4 max-w-xs text-sm text-brand-200">
            Onde a notícia ganha voz. Jornalismo regional com credibilidade,
            agilidade e compromisso com a verdade.
          </p>
        </div>

        <nav aria-label="Editorias no rodapé">
          <h2 className="font-display text-sm font-bold uppercase tracking-widest text-accent-400">
            Editorias
          </h2>
          <ul className="mt-3 grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/editoria/${category.slug}`}
                  className="text-sm hover:text-accent-400"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-widest text-accent-400">
            Institucional
          </h2>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li>
              <Link href="/sobre" className="hover:text-accent-400">
                Quem somos
              </Link>
            </li>
            <li>
              <Link href="/contato" className="hover:text-accent-400">
                Contato e pauta
              </Link>
            </li>
            <li>
              <Link href="/anuncie" className="hover:text-accent-400">
                Anuncie conosco
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-brand-300">
        © {year} {SITE_NAME}. Todos os direitos reservados.
      </div>
    </footer>
  );
}
