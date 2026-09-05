import { auth } from '@/auth';
import { Page } from '@/components/PageLayout';
import { KissCoinGame } from '@/components/KissCoinGame';
import { WalletVerification } from '@/components/WalletVerification';
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
      <Page.Header className="py-2.5 px-4 bg-black/90 backdrop-blur-xl border-b border-zinc-800/80 shadow-xs">
        <div className="flex items-center justify-between w-full max-w-md mx-auto gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.35)] ring-1 ring-rose-500/30 shrink-0">
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
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 drop-shadow-[0_0_12px_rgba(244,63,94,0.45)] truncate">
              Balloon Kiss <span className="inline-block text-lg">🎈</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <WalletVerification mode="compact" />
          </div>
        </div>
      </Page.Header>
      <Page.Main className="flex flex-col items-center justify-start gap-2 mb-6 bg-black">
        <KissCoinGame />
      </Page.Main>
    </Page>
  );
}
