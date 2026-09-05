import { KissCoinGame } from '@/components/KissCoinGame';

export default function Home() {
  return (
    <main className="w-full h-dvh max-h-dvh flex flex-col bg-black text-white p-2 pb-2.5 overflow-hidden select-none">
      <KissCoinGame />
    </main>
  );
}
