import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Balloon Kiss',
  description: 'Privacy Policy for Balloon Kiss Mini App on World App',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-gray-200 px-5 py-8 max-w-2xl mx-auto font-sans leading-relaxed">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-400 hover:text-pink-300 transition-colors uppercase tracking-wider"
        >
          &larr; Back to Game
        </Link>
      </div>

      <h1 className="text-2xl font-black text-white mb-2">Privacy Policy</h1>
      <p className="text-xs text-gray-400 mb-6">Last updated: September 24, 2026</p>

      <section className="space-y-6 text-sm">
        <div>
          <h2 className="text-base font-bold text-white mb-2">1. Overview</h2>
          <p className="text-gray-300">
            Balloon Kiss (&quot;we&quot;, &quot;our&quot;, or &quot;the app&quot;) is a mini-app designed for the World App ecosystem. We respect your privacy and are committed to protecting any data processed when you play our game or interact with our features.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-white mb-2">2. Information We Process</h2>
          <ul className="list-disc list-inside space-y-1.5 text-gray-300">
            <li>
              <strong className="text-white">World ID Verification:</strong> We use World ID to verify unique human personhood via zero-knowledge proofs. We do not receive, collect, or store your biometric data, real name, or personal identity documents.
            </li>
            <li>
              <strong className="text-white">Wallet Address:</strong> If you connect your World App wallet or execute payments (such as sponsoring the sky banner), your public wallet address and transaction hash are processed on World Chain to verify transactions.
            </li>
            <li>
              <strong className="text-white">Gameplay & High Scores:</strong> High scores and in-game coin tallies are stored locally in your browser storage (localStorage) or anonymously linked to your World ID nullifier hash.
            </li>
            <li>
              <strong className="text-white">Public Banners:</strong> Messages submitted to the sky banner are publicly visible to other players and should not contain personal identifiable information.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-bold text-white mb-2">3. How We Use Information</h2>
          <p className="text-gray-300">
            Any data processed is strictly used to:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-300 mt-1.5">
            <li>Authenticate verified human players and prevent automated botting.</li>
            <li>Process optional in-game WLD transactions for banner sponsorship.</li>
            <li>Display leaderboard scores and high-scorer messages.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-bold text-white mb-2">4. Third-Party Services</h2>
          <p className="text-gray-300">
            We integrate with Worldcoin MiniKit and World Chain APIs. These services operate under their own privacy practices and terms, which can be viewed at <a href="https://world.org/privacy" target="_blank" rel="noopener noreferrer" className="text-pink-400 underline">world.org/privacy</a>.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-white mb-2">5. Data Retention & Deletion</h2>
          <p className="text-gray-300">
            We do not maintain centralized accounts with passwords or emails. You can clear your game scores at any time by clearing your browser/app storage cache.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-white mb-2">6. Contact Us</h2>
          <p className="text-gray-300">
            If you have questions about this Privacy Policy, you can reach out via GitHub or through our developer listing on World Developer Portal.
          </p>
        </div>
      </section>

      <div className="mt-10 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
        &copy; 2026 Balloon Kiss &bull; Built for World App
      </div>
    </div>
  );
}
