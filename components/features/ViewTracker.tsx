'use client';

import { useEffect } from 'react';

interface ViewTrackerProps {
  slug: string;
}

/**
 * Registra a visualização da notícia a partir do navegador.
 * Necessário porque a página é estática (ISR) — o servidor não roda a cada acesso.
 */
export function ViewTracker({ slug }: ViewTrackerProps) {
  useEffect(() => {
    void fetch('/api/views', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ slug }),
    }).catch((error: unknown) => {
      console.error('[ViewTracker]', error);
    });
  }, [slug]);

  return null;
}
