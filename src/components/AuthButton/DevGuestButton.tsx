'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

/**
 * Only renders in `next dev` — process.env.NODE_ENV is inlined at build
 * time, so this branch (and the dev-guest sign-in it triggers) is dead-code
 * eliminated from any production build.
 */
export function DevGuestButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (process.env.NODE_ENV !== 'development') return null;

  const handleClick = async () => {
    setLoading(true);
    await signIn('dev-guest', { redirect: false });
    router.push('/home');
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="text-xs font-medium text-gray-400 underline disabled:opacity-50"
    >
      {loading ? 'Loading…' : 'Continue as Guest (dev only — not in World App)'}
    </button>
  );
}
