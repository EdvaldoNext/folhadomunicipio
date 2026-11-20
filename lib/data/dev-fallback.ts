import type { Category, PostSummary, PostWithRelations } from '@/lib/types';

/** Dados locais usados só em desenvolvimento quando o Turso está inacessível. */
export const DEV_CATEGORIES: Category[] = [
  { id: 'dev-1', name: 'Política', slug: 'politica', color_code: '#991B1B', display_order: 1 },
  { id: 'dev-2', name: 'Cidades', slug: 'cidades', color_code: '#7F1D1D', display_order: 2 },
  { id: 'dev-3', name: 'Polícia', slug: 'policia', color_code: '#B91C1C', display_order: 3 },
  { id: 'dev-4', name: 'Agronegócio', slug: 'agronegocio', color_code: '#44403C', display_order: 4 },
  { id: 'dev-5', name: 'Esportes', slug: 'esportes', color_code: '#18181B', display_order: 5 },
  { id: 'dev-6', name: 'Entretenimento', slug: 'entretenimento', color_code: '#9F1239', display_order: 6 },
];

const DEV_AUTHORS = {
  ayla: {
    id: 'dev-author',
    name: 'Ayla Ferreira',
    slug: 'ayla-ferreira',
    avatar_url: 'https://i.pravatar.cc/300?img=47',
    role: 'editor' as const,
  },
  carlos: {
    id: 'dev-carlos',
    name: 'Carlos Mendes',
    slug: 'carlos-mendes',
    avatar_url: 'https://i.pravatar.cc/300?img=12',
    role: 'journalist' as const,
  },
  marina: {
    id: 'dev-marina',
    name: 'Marina Souza',
    slug: 'marina-souza',
    avatar_url: 'https://i.pravatar.cc/300?img=32',
    role: 'columnist' as const,
  },
};

/** Espelha o conteúdo de exemplo para manter o visual quando o banco demora. */
const DEV_POSTS: PostSummary[] = [
  {
    id: 'dev-1',
    title: 'Assembleia aprova pacote de investimentos em infraestrutura para o interior',
    subtitle: 'Projeto destina recursos para recuperação de rodovias e construção de pontes em 40 municípios.',
    slug: 'assembleia-aprova-pacote-investimentos-infraestrutura',
    cover_image: 'https://picsum.photos/seed/politica-infra/1200/675',
    published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    views_count: 0,
    featured_position: 'main',
    category: DEV_CATEGORIES[0],
    author: DEV_AUTHORS.ayla,
  },
  {
    id: 'dev-2',
    title: 'Prefeitura anuncia mutirão de limpeza e revitalização do centro histórico',
    subtitle: 'Ação começa no próximo sábado e inclui pintura de fachadas, poda de árvores e recuperação de calçadas.',
    slug: 'prefeitura-mutirao-limpeza-centro-historico',
    cover_image: 'https://picsum.photos/seed/cidades-centro/1200/675',
    published_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    views_count: 0,
    featured_position: 'secondary',
    category: DEV_CATEGORIES[1],
    author: DEV_AUTHORS.ayla,
  },
  {
    id: 'dev-3',
    title: 'Polícia Civil desarticula quadrilha especializada em furto de defensivos agrícolas',
    subtitle: 'Operação cumpriu 12 mandados e recuperou carga avaliada em R$ 3 milhões.',
    slug: 'policia-desarticula-quadrilha-furto-defensivos',
    cover_image: 'https://picsum.photos/seed/policia-operacao/1200/675',
    published_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    views_count: 0,
    featured_position: 'secondary',
    category: DEV_CATEGORIES[2],
    author: DEV_AUTHORS.ayla,
  },
  {
    id: 'dev-4',
    title: 'Safra de soja bate recorde e movimenta economia dos municípios produtores',
    subtitle: 'Produtividade média superou expectativas mesmo com instabilidade climática no início do plantio.',
    slug: 'safra-soja-bate-recorde-economia',
    cover_image: 'https://picsum.photos/seed/agro-soja/1200/675',
    published_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    views_count: 0,
    featured_position: 'secondary',
    category: DEV_CATEGORIES[3],
    author: DEV_AUTHORS.ayla,
  },
  {
    id: 'dev-5',
    title: 'Festival de inverno anuncia atrações nacionais e espera 50 mil visitantes',
    subtitle: 'Evento gratuito terá shows, feira gastronômica e apresentações teatrais durante três dias.',
    slug: 'festival-inverno-atracoes-nacionais',
    cover_image: 'https://picsum.photos/seed/entretenimento-festival/1200/675',
    published_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    views_count: 0,
    featured_position: 'carousel',
    category: DEV_CATEGORIES[5],
    author: DEV_AUTHORS.ayla,
  },
  {
    id: 'dev-6',
    title: 'Análise: o xadrez político por trás da disputa pela presidência da Câmara',
    subtitle: 'Bastidores revelam articulações que podem redesenhar o mapa de alianças para as eleições.',
    slug: 'analise-xadrez-politico-presidencia-camara',
    cover_image: 'https://picsum.photos/seed/politica-camara/1200/675',
    published_at: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
    views_count: 0,
    featured_position: 'carousel',
    category: DEV_CATEGORIES[0],
    author: DEV_AUTHORS.ayla,
  },
  {
    id: 'dev-7',
    title: 'Time da capital garante vaga na final do estadual após virada histórica',
    subtitle: 'Equipe saiu perdendo por dois gols e virou nos minutos finais diante de 25 mil torcedores.',
    slug: 'time-capital-vaga-final-estadual-virada',
    cover_image: 'https://picsum.photos/seed/esporte-futebol/1200/675',
    published_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    views_count: 0,
    featured_position: 'none',
    category: DEV_CATEGORIES[4],
    author: DEV_AUTHORS.ayla,
  },
  {
    id: 'dev-8',
    title: 'Obras do novo hospital regional atingem 70% de execução',
    subtitle: 'Unidade terá 200 leitos e deve atender moradores de 15 municípios da região.',
    slug: 'obras-hospital-regional-70-por-cento',
    cover_image: 'https://picsum.photos/seed/cidades-hospital/1200/675',
    published_at: new Date(Date.now() - 32 * 60 * 60 * 1000).toISOString(),
    views_count: 0,
    featured_position: 'none',
    category: DEV_CATEGORIES[1],
    author: DEV_AUTHORS.ayla,
  },
  {
    id: 'dev-9',
    title: 'Operação nas rodovias flagra 45 motoristas embriagados no fim de semana',
    subtitle: 'Blitz da lei seca abordou mais de 1,2 mil veículos em pontos estratégicos.',
    slug: 'operacao-rodovias-motoristas-embriagados',
    cover_image: 'https://picsum.photos/seed/policia-blitz/1200/675',
    published_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    views_count: 0,
    featured_position: 'none',
    category: DEV_CATEGORIES[2],
    author: DEV_AUTHORS.ayla,
  },
  {
    id: 'dev-10',
    title: 'Exportações do agronegócio crescem 18% e puxam balança comercial do estado',
    subtitle: 'China segue como principal destino, mas novos mercados no Oriente Médio ganham espaço.',
    slug: 'exportacoes-agronegocio-crescem-balanca',
    cover_image: 'https://picsum.photos/seed/agro-export/1200/675',
    published_at: new Date(Date.now() - 54 * 60 * 60 * 1000).toISOString(),
    views_count: 0,
    featured_position: 'none',
    category: DEV_CATEGORIES[3],
    author: DEV_AUTHORS.ayla,
  },
  {
    id: 'dev-11',
    title: 'Corrida de rua reúne 5 mil atletas e movimenta domingo na capital',
    subtitle: 'Prova teve percursos de 5 km, 10 km e meia maratona, com participação recorde.',
    slug: 'corrida-rua-reune-atletas-capital',
    cover_image: 'https://picsum.photos/seed/esporte-corrida/1200/675',
    published_at: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    views_count: 0,
    featured_position: 'none',
    category: DEV_CATEGORIES[4],
    author: DEV_AUTHORS.ayla,
  },
  {
    id: 'dev-12',
    title: 'Cinema ao ar livre volta à praça com sessões gratuitas todo fim de semana',
    subtitle: 'Projeto cultural exibe clássicos nacionais e filmes infantis até o fim do mês.',
    slug: 'cinema-ar-livre-praca-sessoes-gratuitas',
    cover_image: 'https://picsum.photos/seed/entretenimento-cinema/1200/675',
    published_at: new Date(Date.now() - 84 * 60 * 60 * 1000).toISOString(),
    views_count: 0,
    featured_position: 'none',
    category: DEV_CATEGORIES[5],
    author: DEV_AUTHORS.marina,
  },
  {
    id: 'dev-13',
    title: 'Nova linha de ônibus liga os bairros da zona norte ao centro',
    subtitle: 'Itinerário começa a funcionar na segunda-feira, com tarifa única e horários até as 23h.',
    slug: 'nova-linha-onibus-zona-norte-centro',
    cover_image: 'https://picsum.photos/seed/cidades-onibus/1200/675',
    published_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    views_count: 420,
    featured_position: 'none',
    category: DEV_CATEGORIES[1],
    author: DEV_AUTHORS.carlos,
  },
  {
    id: 'dev-14',
    title: 'Feira livre do sábado ganha barracas cobertas e novos banheiros',
    subtitle: 'Reforma atende pedidos de feirantes e deve beneficiar cerca de 80 bancas.',
    slug: 'feira-sabado-barracas-cobertas',
    cover_image: 'https://picsum.photos/seed/cidades-feira/1200/675',
    published_at: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    views_count: 310,
    featured_position: 'none',
    category: DEV_CATEGORIES[1],
    author: DEV_AUTHORS.carlos,
  },
  {
    id: 'dev-15',
    title: 'Escola municipal reabre após reforma do pátio e das salas de aula',
    subtitle: 'Unidade recebe 600 alunos na segunda, com biblioteca e quadra coberta.',
    slug: 'escola-municipal-reabre-apos-reforma',
    cover_image: 'https://picsum.photos/seed/cidades-escola/1200/675',
    published_at: new Date(Date.now() - 60 * 60 * 60 * 1000).toISOString(),
    views_count: 260,
    featured_position: 'none',
    category: DEV_CATEGORIES[1],
    author: DEV_AUTHORS.ayla,
  },
  {
    id: 'dev-16',
    title: 'Praça da matriz recebe iluminação nova e bancos restaurados',
    subtitle: 'Obra faz parte do pacote de revitalização dos espaços públicos do centro.',
    slug: 'praca-matriz-iluminacao-nova',
    cover_image: 'https://picsum.photos/seed/cidades-praca/1200/675',
    published_at: new Date(Date.now() - 90 * 60 * 60 * 1000).toISOString(),
    views_count: 180,
    featured_position: 'none',
    category: DEV_CATEGORIES[1],
    author: DEV_AUTHORS.carlos,
  },
  {
    id: 'dev-17',
    title: 'PM apreende armas e drogas em operação no bairro industrial',
    subtitle: 'Três pessoas foram presas e o material foi encaminhado à Polícia Civil.',
    slug: 'pm-apreende-armas-bairro-industrial',
    cover_image: 'https://picsum.photos/seed/policia-armas/1200/675',
    published_at: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    views_count: 890,
    featured_position: 'none',
    category: DEV_CATEGORIES[2],
    author: DEV_AUTHORS.carlos,
  },
  {
    id: 'dev-18',
    title: 'Delegacia registra queda de furtos no comércio no último mês',
    subtitle: 'Número de ocorrências caiu 22% depois do reforço do patrulhamento noturno.',
    slug: 'delegacia-queda-furtos-comercio',
    cover_image: 'https://picsum.photos/seed/policia-comercio/1200/675',
    published_at: new Date(Date.now() - 40 * 60 * 60 * 1000).toISOString(),
    views_count: 240,
    featured_position: 'none',
    category: DEV_CATEGORIES[2],
    author: DEV_AUTHORS.ayla,
  },
  {
    id: 'dev-19',
    title: 'Homem é preso após tentativa de roubo a farmácia no centro',
    subtitle: 'Câmeras do comércio ajudaram a identificar o suspeito em menos de duas horas.',
    slug: 'preso-tentativa-roubo-farmacia-centro',
    cover_image: 'https://picsum.photos/seed/policia-farmacia/1200/675',
    published_at: new Date(Date.now() - 66 * 60 * 60 * 1000).toISOString(),
    views_count: 510,
    featured_position: 'none',
    category: DEV_CATEGORIES[2],
    author: DEV_AUTHORS.carlos,
  },
  {
    id: 'dev-20',
    title: 'Polícia recupera motos furtadas em depósito clandestino',
    subtitle: 'Oito veículos foram devolvidos aos donos depois da operação desta madrugada.',
    slug: 'policia-recupera-motos-deposito',
    cover_image: 'https://picsum.photos/seed/policia-motos/1200/675',
    published_at: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
    views_count: 370,
    featured_position: 'none',
    category: DEV_CATEGORIES[2],
    author: DEV_AUTHORS.carlos,
  },
  {
    id: 'dev-21',
    title: 'Produtores de leite cobram preço mínimo e apoio na entressafra',
    subtitle: 'Reunião na cooperativa reuniu cerca de 200 criadores da região.',
    slug: 'produtores-leite-preco-minimo',
    cover_image: 'https://picsum.photos/seed/agro-leite/1200/675',
    published_at: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    views_count: 190,
    featured_position: 'none',
    category: DEV_CATEGORIES[3],
    author: DEV_AUTHORS.ayla,
  },
  {
    id: 'dev-22',
    title: 'Feira agropecuária espera 20 mil visitantes neste fim de semana',
    subtitle: 'Programação inclui leilão, shows e exposição de máquinas.',
    slug: 'feira-agropecuaria-20-mil-visitantes',
    cover_image: 'https://picsum.photos/seed/agro-feira/1200/675',
    published_at: new Date(Date.now() - 44 * 60 * 60 * 1000).toISOString(),
    views_count: 280,
    featured_position: 'none',
    category: DEV_CATEGORIES[3],
    author: DEV_AUTHORS.carlos,
  },
  {
    id: 'dev-23',
    title: 'Chuva atrasa o plantio do milho safrinha em municípios produtores',
    subtitle: 'Técnicos recomendam esperar a janela de sol da próxima semana.',
    slug: 'chuva-atrasa-plantio-milho-safrinha',
    cover_image: 'https://picsum.photos/seed/agro-milho/1200/675',
    published_at: new Date(Date.now() - 70 * 60 * 60 * 1000).toISOString(),
    views_count: 150,
    featured_position: 'none',
    category: DEV_CATEGORIES[3],
    author: DEV_AUTHORS.ayla,
  },
  {
    id: 'dev-24',
    title: 'Cooperativa inaugura silo para pequenos produtores da região',
    subtitle: 'Estrutura tem capacidade para 8 mil toneladas e reduz a fila na colheita.',
    slug: 'cooperativa-inaugura-silo-pequenos-produtores',
    cover_image: 'https://picsum.photos/seed/agro-silo/1200/675',
    published_at: new Date(Date.now() - 100 * 60 * 60 * 1000).toISOString(),
    views_count: 210,
    featured_position: 'none',
    category: DEV_CATEGORIES[3],
    author: DEV_AUTHORS.carlos,
  },
  {
    id: 'dev-25',
    title: 'Vôlei feminino avança à semifinal da liga regional',
    subtitle: 'Time da cidade venceu por 3 sets a 1 e decide a vaga em casa.',
    slug: 'volei-feminino-semifinal-liga-regional',
    cover_image: 'https://picsum.photos/seed/esporte-volei/1200/675',
    published_at: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
    views_count: 640,
    featured_position: 'none',
    category: DEV_CATEGORIES[4],
    author: DEV_AUTHORS.marina,
  },
  {
    id: 'dev-26',
    title: 'Atleta da cidade conquista ouro no estadual de natação',
    subtitle: 'Prova dos 100 metros livre teve recorde da competição.',
    slug: 'atleta-ouro-estadual-natacao',
    cover_image: 'https://picsum.photos/seed/esporte-natacao/1200/675',
    published_at: new Date(Date.now() - 50 * 60 * 60 * 1000).toISOString(),
    views_count: 330,
    featured_position: 'none',
    category: DEV_CATEGORIES[4],
    author: DEV_AUTHORS.carlos,
  },
  {
    id: 'dev-27',
    title: 'Estádio municipal recebe gramado novo antes do clássico',
    subtitle: 'Troca do campo termina nesta sexta e o jogo de domingo está mantido.',
    slug: 'estadio-municipal-gramado-novo-classico',
    cover_image: 'https://picsum.photos/seed/esporte-estadio/1200/675',
    published_at: new Date(Date.now() - 80 * 60 * 60 * 1000).toISOString(),
    views_count: 720,
    featured_position: 'none',
    category: DEV_CATEGORIES[4],
    author: DEV_AUTHORS.ayla,
  },
  {
    id: 'dev-28',
    title: 'Basquete sub-17 estreia com vitória fora de casa',
    subtitle: 'Equipe abriu o estadual com 68 a 54 e volta a jogar no ginásio municipal.',
    slug: 'basquete-sub17-estreia-vitoria',
    cover_image: 'https://picsum.photos/seed/esporte-basquete/1200/675',
    published_at: new Date(Date.now() - 110 * 60 * 60 * 1000).toISOString(),
    views_count: 140,
    featured_position: 'none',
    category: DEV_CATEGORIES[4],
    author: DEV_AUTHORS.carlos,
  },
  {
    id: 'dev-29',
    title: 'Teatro municipal estreia comédia com elenco local',
    subtitle: 'Sessões são gratuitas de quinta a domingo, com retirada de ingresso na bilheteria.',
    slug: 'teatro-municipal-estreia-comedia',
    cover_image: 'https://picsum.photos/seed/entretenimento-teatro/1200/675',
    published_at: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    views_count: 275,
    featured_position: 'none',
    category: DEV_CATEGORIES[5],
    author: DEV_AUTHORS.marina,
  },
  {
    id: 'dev-30',
    title: 'Banda da cidade lança clipe gravado na praça central',
    subtitle: 'Vídeo já passa de 50 mil visualizações e a banda faz show gratuito no sábado.',
    slug: 'banda-cidade-clipe-praca-central',
    cover_image: 'https://picsum.photos/seed/entretenimento-banda/1200/675',
    published_at: new Date(Date.now() - 56 * 60 * 60 * 1000).toISOString(),
    views_count: 860,
    featured_position: 'none',
    category: DEV_CATEGORIES[5],
    author: DEV_AUTHORS.marina,
  },
  {
    id: 'dev-31',
    title: 'Festival de comida de rua ocupa o calçadão neste fim de semana',
    subtitle: 'Mais de 40 cozinhas participam, com música ao vivo a partir das 18h.',
    slug: 'festival-comida-rua-calcadao',
    cover_image: 'https://picsum.photos/seed/entretenimento-comida/1200/675',
    published_at: new Date(Date.now() - 76 * 60 * 60 * 1000).toISOString(),
    views_count: 540,
    featured_position: 'none',
    category: DEV_CATEGORIES[5],
    author: DEV_AUTHORS.ayla,
  },
  {
    id: 'dev-32',
    title: 'Exposição de fotos antigas fica em cartaz no museu até o fim do mês',
    subtitle: 'Mostra reúne 80 imagens do centro da cidade entre as décadas de 1950 e 1980.',
    slug: 'exposicao-fotos-antigas-museu',
    cover_image: 'https://picsum.photos/seed/entretenimento-museu/1200/675',
    published_at: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString(),
    views_count: 160,
    featured_position: 'none',
    category: DEV_CATEGORIES[5],
    author: DEV_AUTHORS.marina,
  },
  {
    id: 'dev-33',
    title: 'Câmara vota na terça o reajuste do funcionalismo municipal',
    subtitle: 'Proposta prevê correção de 5% e divide a base do governo e a oposição.',
    slug: 'camara-vota-reajuste-funcionalismo',
    cover_image: 'https://picsum.photos/seed/politica-reajuste/1200/675',
    published_at: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
    views_count: 610,
    featured_position: 'none',
    category: DEV_CATEGORIES[0],
    author: DEV_AUTHORS.ayla,
  },
  {
    id: 'dev-34',
    title: 'Prefeito entrega relatório das obras concluídas no último ano',
    subtitle: 'Documento lista escolas, postos de saúde e ruas pavimentadas em 12 bairros.',
    slug: 'prefeito-relatorio-obras-ultimo-ano',
    cover_image: 'https://picsum.photos/seed/politica-obras/1200/675',
    published_at: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
    views_count: 240,
    featured_position: 'none',
    category: DEV_CATEGORIES[0],
    author: DEV_AUTHORS.carlos,
  },
  {
    id: 'dev-35',
    title: 'Oposição protocola pedido de CPI da iluminação pública',
    subtitle: 'Vereadores querem explicar contratos e o atraso na troca dos postes do centro.',
    slug: 'oposicao-cpi-iluminacao-publica',
    cover_image: 'https://picsum.photos/seed/politica-cpi/1200/675',
    published_at: new Date(Date.now() - 52 * 60 * 60 * 1000).toISOString(),
    views_count: 480,
    featured_position: 'none',
    category: DEV_CATEGORIES[0],
    author: DEV_AUTHORS.ayla,
  },
  {
    id: 'dev-36',
    title: 'Vereadores aprovam calendário de audiências nos bairros',
    subtitle: 'Encontros começam na próxima semana e vão ouvir moradores sobre saúde e transporte.',
    slug: 'vereadores-calendario-audiencias-bairros',
    cover_image: 'https://picsum.photos/seed/politica-audiencias/1200/675',
    published_at: new Date(Date.now() - 78 * 60 * 60 * 1000).toISOString(),
    views_count: 190,
    featured_position: 'none',
    category: DEV_CATEGORIES[0],
    author: DEV_AUTHORS.carlos,
  },
  {
    id: 'dev-37',
    title: 'Coluna: o que a safra recorde diz sobre o caixa das prefeituras',
    subtitle: 'Mais produção nem sempre vira mais imposto. O efeito chega com atraso ao município.',
    slug: 'coluna-safra-recorde-caixa-prefeituras',
    cover_image: 'https://picsum.photos/seed/coluna-safra/1200/675',
    published_at: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    views_count: 305,
    featured_position: 'carousel',
    category: DEV_CATEGORIES[3],
    author: DEV_AUTHORS.marina,
  },
  {
    id: 'dev-38',
    title: 'Coluna: o clássico do fim de semana vale mais do que três pontos',
    subtitle: 'A cidade para no domingo. O jogo virou o encontro da semana.',
    slug: 'coluna-classico-vale-mais-que-tres-pontos',
    cover_image: 'https://picsum.photos/seed/coluna-classico/1200/675',
    published_at: new Date(Date.now() - 46 * 60 * 60 * 1000).toISOString(),
    views_count: 410,
    featured_position: 'carousel',
    category: DEV_CATEGORIES[4],
    author: DEV_AUTHORS.marina,
  },
];

export function getDevLatestPosts(limit = 10): PostSummary[] {
  return [...DEV_POSTS]
    .sort((a, b) => b.published_at.localeCompare(a.published_at))
    .slice(0, limit);
}

export function getDevMostRead(limit = 5): PostSummary[] {
  return [...DEV_POSTS].sort((a, b) => b.views_count - a.views_count).slice(0, limit);
}

export function getDevCarouselPosts(limit = 4): PostSummary[] {
  return DEV_POSTS.filter((post) => post.featured_position === 'carousel').slice(0, limit);
}

export function getDevPostsByCategory(
  categorySlug: string,
  limit = 12,
  offset = 0
): PostSummary[] {
  return DEV_POSTS.filter((post) => post.category.slug === categorySlug)
    .sort((a, b) => b.published_at.localeCompare(a.published_at))
    .slice(offset, offset + limit);
}

const AUTHOR_BIOS: Record<string, string> = {
  'dev-author': 'Editora-chefe da Folha do Município. Cobre política e o cotidiano das cidades da região.',
  'dev-carlos': 'Repórter. Acompanha segurança pública, esportes e o agronegócio.',
  'dev-marina': 'Colunista de cultura, esportes e comportamento.',
};

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function mockArticleHtml(post: PostSummary): string {
  const title = escapeHtml(post.title);
  const lead = escapeHtml(post.subtitle ?? post.title);
  const section = escapeHtml(post.category.name);

  return [
    `<p>${lead}</p>`,
    `<p>A reportagem da Folha do Município acompanhou o assunto na editoria de ${section} e ouviu moradores, autoridades e especialistas ao longo do dia.</p>`,
    '<h2>O que já se sabe</h2>',
    `<p>${title}. As informações reunidas até agora indicam que o desdobramento deve ser sentido nos próximos dias.</p>`,
    '<p>Equipes da redação confirmaram horários, locais e os nomes citados com mais de uma fonte antes da publicação.</p>',
    '<h2>Quem é afetado</h2>',
    `<p>Moradores e trabalhadores ligados a ${section.toLowerCase()} são os primeiros a sentir o efeito. Comerciantes e serviços públicos da região também entram na conta.</p>`,
    '<p>“Ainda estamos organizando os detalhes, mas a população será avisada a cada novidade”, disse uma das pessoas ouvidas pela reportagem.</p>',
    '<h2>Próximos passos</h2>',
    '<p>A Folha do Município segue o caso e publica atualização assim que houver confirmação oficial.</p>',
  ].join('');
}

export function getDevPostBySlug(slug: string): PostWithRelations | null {
  const post = DEV_POSTS.find((item) => item.slug === slug);
  if (!post) return null;

  const publishedAt = post.published_at;
  return {
    ...post,
    content: mockArticleHtml(post),
    cover_caption: 'Imagem de ilustração. Foto: arquivo',
    author_id: post.author.id,
    category_id: post.category.id,
    tags: [post.category.name.toLowerCase()],
    status: 'published',
    allow_comments: true,
    created_at: publishedAt,
    updated_at: publishedAt,
    author: {
      ...post.author,
      bio: AUTHOR_BIOS[post.author.id] ?? null,
      instagram: null,
      twitter: null,
      email: null,
    },
  };
}

export function getDevHomePostsData() {
  const main = DEV_POSTS.find((post) => post.featured_position === 'main') ?? null;
  const secondary = DEV_POSTS.filter((post) => post.featured_position === 'secondary').slice(0, 3);
  const carousel = DEV_POSTS.filter((post) => post.featured_position === 'carousel').slice(0, 4);
  const mostRead = [...DEV_POSTS].sort((a, b) => b.views_count - a.views_count).slice(0, 5);

  const postsByCategorySlug: Record<string, PostSummary[]> = {};
  for (const category of DEV_CATEGORIES) {
    postsByCategorySlug[category.slug] = DEV_POSTS.filter(
      (post) => post.category.slug === category.slug
    )
      .sort((a, b) => b.published_at.localeCompare(a.published_at))
      .slice(0, 4);
  }

  return { main, secondary, carousel, mostRead, postsByCategorySlug };
}
