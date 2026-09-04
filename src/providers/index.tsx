'use client';

import { MiniKitProvider } from '@worldcoin/minikit-js/minikit-provider';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { type ReactNode, useEffect } from 'react';

export default function ClientProviders({
  session,
  children,
}: {
  session: Session | null;
  children: ReactNode;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('eruda').then(({ default: eruda }) => eruda.init());
    }
  }, []);

  return (
    <MiniKitProvider props={{ appId: process.env.NEXT_PUBLIC_APP_ID ?? '' }}>
      <SessionProvider session={session}>{children}</SessionProvider>
    </MiniKitProvider>
  );
}
