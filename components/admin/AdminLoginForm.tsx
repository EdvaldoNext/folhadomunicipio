'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FieldLabel } from '@/components/admin/FieldLabel';
import { loginEditorial } from '@/lib/actions/admin/auth';

/** Limpa valores que o gerenciador de senhas do navegador injeta no DOM. */
function wipeInput(el: HTMLInputElement | null) {
  if (!el) return;
  el.value = '';
  el.setAttribute('readonly', 'readonly');
}

export function AdminLoginForm() {
  const router = useRouter();
  const fieldId = useId().replace(/:/g, '');
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const showTimer = window.setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const wipeAll = () => {
      wipeInput(emailRef.current);
      wipeInput(passwordRef.current);
    };

    wipeAll();
    const timers = [0, 50, 150, 400, 800].map((ms) => window.setTimeout(wipeAll, ms));
    return () => timers.forEach(clearTimeout);
  }, [mounted]);

  function enableInput(event: React.FocusEvent<HTMLInputElement>) {
    event.currentTarget.removeAttribute('readonly');
  }

  function clearFields() {
    wipeInput(emailRef.current);
    wipeInput(passwordRef.current);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const submittedEmail = emailRef.current?.value.trim() ?? '';
    const submittedPassword = passwordRef.current?.value ?? '';

    if (!submittedEmail || !submittedPassword) {
      setError('Informe e-mail e senha.');
      return;
    }

    clearFields();
    setLoading(true);

    const result = await loginEditorial(submittedEmail, submittedPassword);
    if ('error' in result) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push('/admin');
    router.refresh();
  }

  if (!mounted) {
    return (
      <div className="flex w-full max-w-sm flex-col gap-4" aria-hidden="true">
        <div className="h-[4.25rem] animate-pulse rounded-lg bg-gray-100" />
        <div className="h-[4.25rem] animate-pulse rounded-lg bg-gray-100" />
        <div className="h-10 animate-pulse rounded-lg bg-gray-100" />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-4"
      autoComplete="off"
      data-lpignore="true"
      data-1p-ignore
    >
      <div>
        <FieldLabel
          htmlFor={`${fieldId}-email`}
          tooltip="E-mail da conta editorial com permissão de administrador ou editor."
          className="text-gray-700"
        >
          E-mail
        </FieldLabel>
        <input
          ref={emailRef}
          id={`${fieldId}-email`}
          name={`${fieldId}-email`}
          type="text"
          inputMode="email"
          required
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          readOnly
          defaultValue=""
          data-lpignore="true"
          data-1p-ignore
          data-bwignore
          onFocus={enableInput}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
        />
      </div>
      <div>
        <FieldLabel
          htmlFor={`${fieldId}-password`}
          tooltip="Senha da conta editorial. Apenas usuários com perfil admin ou editor conseguem acessar o painel."
          className="text-gray-700"
        >
          Senha
        </FieldLabel>
        <input
          ref={passwordRef}
          id={`${fieldId}-password`}
          name={`${fieldId}-password`}
          type="password"
          required
          autoComplete="off"
          readOnly
          defaultValue=""
          data-lpignore="true"
          data-1p-ignore
          data-bwignore
          onFocus={enableInput}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
        />
      </div>
      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-accent-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-600/90 disabled:opacity-60"
      >
        {loading ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  );
}
