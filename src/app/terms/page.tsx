import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | Balloon Kiss',
  description: 'Terms of Service for Balloon Kiss Mini App on World App',
};

export default function TermsOfServicePage() {
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

      <h1 className="text-2xl font-black text-white mb-2">Terms of Service</h1>
      <p className="text-xs text-gray-400 mb-6">Last updated: September 24, 2026</p>

      <section className="space-y-6 text-sm">
        <div>
          <h2 className="text-base font-bold text-white mb-2">1. Acceptance of Terms</h2>
          <p className="text-gray-300">
            By accessing or playing Balloon Kiss (&quot;the game&quot; or &quot;mini-app&quot;) within the World App or web browsers, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use the application.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-white mb-2">2. In-Game Tokens & Virtual Items</h2>
          <p className="text-gray-300">
            In-game &quot;Kiss Coins&quot; or points earned during gameplay are virtual entertainment metrics intended solely for tracking player skill, streaks, and arcade achievements. They do not constitute financial securities, fiat currency, or guaranteed monetary value unless explicitly designated under supported on-chain protocols.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-white mb-2">3. Banner Sponsorship & Payments</h2>
          <p className="text-gray-300">
            Optional payments made in WLD on World Chain to override or sponsor the sky banner are voluntary. Blockchain transactions are immutable and non-refundable once confirmed on-chain.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-white mb-2">4. User Content & Conduct</h2>
          <p className="text-gray-300">
            When submitting messages to the public sky banner, you agree not to submit content that is:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-300 mt-1.5">
            <li>Unlawful, harassing, defamatory, vulgar, or hate speech.</li>
            <li>Promoting fraudulent schemes or deceptive investment solicitations.</li>
            <li>Violating the rights of any third party.</li>
          </ul>
          <p className="text-gray-300 mt-1.5">
            We reserve the right to moderate, hide, or reset any banner message that violates community standards.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-white mb-2">5. Disclaimer of Warranties</h2>
          <p className="text-gray-300">
            The game is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind. We do not guarantee uninterrupted or error-free gameplay, nor are we liable for network delays on third-party blockchain networks.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-white mb-2">6. Changes to Terms</h2>
          <p className="text-gray-300">
            We reserve the right to modify these terms at any time. Continued use of the game following any updates signifies your acceptance of the revised terms.
          </p>
        </div>
      </section>

      <div className="mt-10 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
        &copy; 2026 Balloon Kiss &bull; Built for World App
      </div>
    </div>
  );
}
