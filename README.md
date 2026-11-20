# Folha do Município

Portal de notícias regional que eu construí para a redação publicar, o comercial vender espaço e o leitor abrir a matéria sem esperar.

Não é um CRUD de blog. Tem home, editoria, matéria, painel da redação, banners, autores, contato, pedido de mídia kit e um recorte de audiência.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Turso (libSQL) · Zod · Resend

## Por que esse projeto

Um jornal local publica o dia inteiro. Esperar um build completo a cada nota não funciona. A matéria usa revalidação de 60 segundos e `dynamicParams`: a primeira visita gera a página, as seguintes saem do cache. Se o slug não existe, a rota chama `notFound()` em vez de quebrar a tela.

O HTML vem do editor. Antes de renderizar, `sanitize-html` deixa só as tags que a redação usa (`p`, `h2`, `h3`, listas, link, imagem). Anúncio entra depois do 3º e do 7º parágrafo, com altura reservada para o texto não pular quando o banner carrega. A capa da matéria principal vai com `priority`, porque ela é o que o leitor vê primeiro.

O painel não guarda token no `localStorage`. A sessão fica num cookie `HttpOnly`, `Secure` e `SameSite=Strict`, assinado com HMAC (`SESSION_SECRET`). Senha com scrypt e comparação em tempo constante. Cada Server Action do painel, do contato e do mídia kit confere a origem da requisição.

## O que está pronto

- Home com manchete, destaques, últimas e mais lidas
- Matéria em `/[editoria]/[slug]`, com canonical, Open Graph e JSON-LD `NewsArticle`
- Editorias, Quem somos, Contato e Anuncie
- Painel em `/admin`: posts, autores, categorias, banners, redação, comercial e analytics
- Upload da imagem da capa
- Formulários de contato e de mídia kit, gravados no Turso
- Quase tudo é Server Component. Cliente só onde tem clique: menu, compartilhar, carrossel

## Como rodar

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

Crie um `.env.local` na raiz. Nada disso vai para o cliente, exceto o que começa com `NEXT_PUBLIC_`.

```env
TURSO_DATABASE_URL=libsql://seu-banco.turso.io
TURSO_AUTH_TOKEN=token-do-banco
SESSION_SECRET=uma-chave-com-pelo-menos-32-caracteres
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GA4_PROPERTY_ID=000000000
NEXT_PUBLIC_USE_DEV_ONLY=false
```

O schema está em `turso/schema.sql`.

### Primeiro editor

```bash
$env:EDITOR_EMAIL="redacao@folhadomunicipio.com.br"
$env:EDITOR_PASSWORD="uma-senha-forte"
npm run db:create-editor
```

Depois entre em [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

Imagens enviadas pelo painel ficam em `public/uploads`.
