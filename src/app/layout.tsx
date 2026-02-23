import type { Metadata } from 'next';
import { Libre_Baskerville, Work_Sans } from 'next/font/google';
import { ContentPreloader } from '@/components/ContentPreloader';
import { SpeculationRules } from '@/components/SpeculationRules';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ScrollProgress } from '@/components/ScrollProgress';
import { Navigation } from '@/components/Navigation';
import { getPreloadManifest } from '@/lib/preloadManifest';
import { SITE_URL } from '@/lib/site';
import 'katex/dist/katex.min.css';
import './globals.css';

const displayFont = Libre_Baskerville({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '700'],
});

const bodyFont = Work_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600'],
});

const preloadManifest = getPreloadManifest();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Jorge Casas — Astrophysicist & Engineer',
  description: 'Portfolio showcasing research in astrophysics, exoplanets, trajectory optimization, and engineering projects.',
  keywords: ['astrophysics', 'engineering', 'portfolio', 'research', 'exoplanets'],
  authors: [{ name: 'Jorge Casas' }],
  openGraph: {
    title: 'Jorge Casas — Astrophysicist & Engineer',
    description: 'Portfolio of computational astrophysics and engineering projects',
    type: 'website',
    locale: 'en_US',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${bodyFont.variable} font-body`}>
        <ThemeProvider>
          <SpeculationRules />
          <ContentPreloader routes={preloadManifest.routeCandidates} />
          <ScrollProgress />
          <Navigation />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
