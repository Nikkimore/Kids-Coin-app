import { auth } from '@/auth';
import ClientProviders from '@/providers';
import '@worldcoin/mini-apps-ui-kit-react/styles.css';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Rubik } from 'next/font/google';
import './globals.css';

const rubik = Rubik({
  variable: '--font-rubik',
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
});

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Balloon Kiss | World App Mini App',
  description: 'Play Balloon Kiss on World App! Catch kisses to earn scarce $KISS coins, stay alive with yellow hearts, and fly your sky banner.',
  icons: {
    icon: [
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
      { url: '/kiss-balloon-icon-v2.jpg', sizes: '1024x1024', type: 'image/jpeg' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '512x512', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body className={`${rubik.variable} ${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <ClientProviders session={session}>{children}</ClientProviders>
      </body>
    </html>
  );
}
