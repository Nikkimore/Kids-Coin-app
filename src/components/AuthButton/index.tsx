'use client';

import { Button, LiveFeedback } from '@worldcoin/mini-apps-ui-kit-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { signInWithWallet, WalletAuthError } from '@/auth/wallet-auth';

type SignInState = 'idle' | 'pending' | 'success' | 'failed';

export function AuthButton() {
  const router = useRouter();
  const [state, setState] = useState<SignInState>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setState('pending');
    setError(null);
    try {
      await signInWithWallet();
      setState('success');
      router.push('/home');
      router.refresh();
    } catch (err) {
      setState('failed');
      setError(
        err instanceof WalletAuthError
          ? err.message
          : 'Something went wrong. Please try again.',
      );
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <LiveFeedback
        state={state === 'idle' ? undefined : state}
        label={{ pending: 'Signing in…', success: 'Signed in!', failed: 'Try again' }}
      >
        <Button onClick={handleSignIn} disabled={state === 'pending'} size="lg">
          Sign in with World ID
        </Button>
      </LiveFeedback>
      {error && <p className="max-w-xs text-center text-sm text-red-500">{error}</p>}
    </div>
  );
}
