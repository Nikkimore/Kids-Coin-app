import { auth } from '@/auth';
import { Page } from '@/components/PageLayout';
import { KissCoinGame } from '@/components/KissCoinGame';
import { Marble, TopBar } from '@worldcoin/mini-apps-ui-kit-react';

export default async function Home() {
  const session = await auth();

  return (
    <>
      <Page.Header className="p-0">
        <TopBar
          title="Kiss Coin"
          endAdornment={
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold capitalize">
                {session?.user.username}
              </p>
              {session?.user.profilePictureUrl ? (
                <Marble src={session.user.profilePictureUrl} className="w-12" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-100 bg-gray-100 text-sm font-semibold uppercase text-gray-500">
                  {session?.user.username?.[0] ?? '?'}
                </div>
              )}
            </div>
          }
        />
      </Page.Header>
      <Page.Main className="flex flex-col items-center justify-start gap-4 mb-16">
        <KissCoinGame walletAddress={session?.user.walletAddress} />
      </Page.Main>
    </>
  );
}
