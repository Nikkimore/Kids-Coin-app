import { Page } from '@/components/PageLayout';

export default function AboutPage() {
  return (
    <>
      <Page.Header>
        <h1 className="text-lg font-semibold">About Kiss Coin</h1>
      </Page.Header>
      <Page.Main className="items-start gap-4 text-left mb-16">
        <p className="text-sm text-gray-600">
          Kiss Coin is a heart-catching mini game built for World App. Catch 3
          falling hearts to earn 1 Kiss Coin.
        </p>
        <p className="text-sm font-semibold text-pink-600">
          Kiss Coins are an in-app currency for fun only — they have no
          real-world value and cannot be exchanged, transferred, or cashed
          out.
        </p>
        <p className="text-sm text-gray-600">
          Your Kiss Coin balance is stored on this device only, tied to your
          World ID wallet address.
        </p>
      </Page.Main>
    </>
  );
}
