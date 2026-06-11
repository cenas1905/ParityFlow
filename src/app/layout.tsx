import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'ParityFlow — Sell More With Localized Pricing',
  description: 'Add purchasing power parity discounts to your SaaS in 2 minutes. Increase conversions from emerging markets by up to 40%.',
  keywords: 'PPP, purchasing power parity, localized pricing, SaaS discounts',
  openGraph: {
    title: 'ParityFlow',
    description: 'Sell more with localized pricing',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${outfit.variable}`}>
      <body className="bg-[#09090b] text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  );
}
