'use client';

import Link from 'next/link';
import { Container } from '@/components/LayoutPrimitives';
import { RESUME_PATH, SOCIAL_LINKS } from '@/lib/site';
import { uiLinkStyles } from '@/lib/ui';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-darker/50 backdrop-blur mt-20">
      <Container className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold gradient-text mb-2 font-display">Jorge Casas</h3>
            <p className="text-sm text-gray-400">
              Computational astrophysicist & mechanical engineer exploring the cosmos and designing solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">Quick Links</h4>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 max-w-xs">
              <li>
                <Link href="/" className={uiLinkStyles.footer}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/projects" className={uiLinkStyles.footer}>
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/#about" className={uiLinkStyles.footer}>
                  About
                </Link>
              </li>
              <li>
                <a
                  href={RESUME_PATH}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={uiLinkStyles.footer}
                >
                  View Resume
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">Follow</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={uiLinkStyles.footer}
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={uiLinkStyles.footer}
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200/80 dark:border-white/10 pt-8">
          <p className="text-xs text-gray-500 text-center">
            © {currentYear} Jorge Casas. Built with Next.js, deployed via GitHub Pages.
          </p>
        </div>
      </Container>
    </footer>
  );
}


