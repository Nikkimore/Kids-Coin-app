import { auth } from '@/auth';
import { Page } from '@/components/PageLayout';
import { KissCoinGame } from '@/components/KissCoinGame';
import { Marble } from '@worldcoin/mini-apps-ui-kit-react';
import { AuthButton } from '@/components/AuthButton';
import Image from 'next/image';

export default async function Home() {
  let session = null;
  try {
    session = await auth();
    if (!session || typeof session !== 'object' || !('user' in session)) {
      session = null;
    }
  } catch {
    session = null;
  }

  return (
    <Page>
      <Page.Header className="py-2.5 px-4 bg-white/80 backdrop-blur-xl border-b border-pink-200/50 shadow-xs">
        <div className="flex items-center justify-between w-full max-w-md mx-auto gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-rose-300 shadow-md ring-2 ring-pink-100 shrink-0">
              <Image
                src="/kiss-balloon-icon-v2.jpg"
                alt="Balloon Kiss"
                width={40}
                height={40}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>

          <div className="flex-1 text-center min-w-0">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-pink-500 to-amber-500 drop-shadow-xs truncate">
              Balloon Kiss <span className="inline-block text-lg">🎈</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {session?.user ? (
              <div className="flex items-center gap-1.5 bg-white/90 border border-rose-200 rounded-full py-1 px-2.5 shadow-xs">
                <p className="text-xs font-bold capitalize text-slate-700 max-w-[80px] truncate">
                  {session.user.username || 'Pilot'}
                </p>
                <Marble src={session.user.profilePictureUrl} className="w-6 h-6 rounded-full" />
              </div>
            ) : (
              <div className="scale-90">
                <AuthButton />
              </div>
            )}
          </div>
        </div>
      </Page.Header>
      <Page.Main className="flex flex-col items-center justify-start gap-2 mb-6">
        <KissCoinGame />
      </Page.Main>
    </Page>
  );
}
