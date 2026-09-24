'use client';
import { MiniKitProvider } from '@worldcoin/minikit-js/minikit-provider';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';

// Define props for ClientProviders
interface ClientProvidersProps {
  children: ReactNode;
  session: Session | null;
}

export default function ClientProviders({
  children,
  session,
}: ClientProvidersProps) {
  const safeSession =
    session && typeof session === 'object' && 'user' in session ? session : null;

  return (
    <MiniKitProvider props={{ appId: process.env.NEXT_PUBLIC_APP_ID || 'app_50930aa723f8df87d769869a70d29693' }}>
      <SessionProvider session={safeSession}>{children}</SessionProvider>
    </MiniKitProvider>
  );
}
