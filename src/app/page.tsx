import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { AuthButton } from '@/components/AuthButton';

export default async function LandingPage() {
  const session = await auth();
  if (session?.user) {
    redirect('/home');
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-gradient-to-b from-pink-50 to-white px-6 text-center">
      <div className="text-6xl">💗</div>
      <h1 className="text-2xl font-semibold">Kiss Coin</h1>
      <p className="max-w-xs text-sm text-gray-500">
        Catch falling hearts and earn Kiss Coins! Sign in with your World ID
        wallet in World App to start playing.
      </p>
      <AuthButton />
    </main>
  );
}
