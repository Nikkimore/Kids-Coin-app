import { auth } from '@/auth';
import { Page } from '@/components/PageLayout';
import { KissCoinGame } from '@/components/KissCoinGame';
import { TopBar, Marble } from '@worldcoin/mini-apps-ui-kit-react';
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
      <Page.Header className="p-0">
        <TopBar
          title="Balloon Kiss"
          startAdornment={
            <div className="w-9 h-9 rounded-2xl overflow-hidden border border-rose-200 shadow-sm shrink-0">
              <Image
                src="/kiss-balloon-icon-v2.jpg"
                alt="Balloon Kiss"
                width={36}
                height={36}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          }
          endAdornment={
            <div className="flex items-center gap-2">
              {session?.user ? (
                <>
                  <p className="text-sm font-semibold capitalize text-gray-700">
                    {session.user.username || 'Pilot'}
                  </p>
                  <Marble src={session.user.profilePictureUrl} className="w-8 h-8" />
                </>
              ) : (
                <div className="scale-90">
                  <AuthButton />
                </div>
              )}
            </div>
          }
        />
      </Page.Header>
      <Page.Main className="flex flex-col items-center justify-start gap-4 mb-8">
        <KissCoinGame />
      </Page.Main>
    </Page>
  );
}
