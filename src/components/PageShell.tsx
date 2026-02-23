'use client';

import type { CSSProperties, ReactNode } from 'react';
import { Footer } from '@/components/Footer';
import { ThemeToggle } from '@/components/ThemeToggle';
import { clsx } from '@/lib/utils';

interface PageShellProps {
  children: ReactNode;
  topSlot?: ReactNode;
  rootClassName?: string;
  mainClassName?: string;
  rootStyle?: CSSProperties;
}

export function PageShell({
  children,
  topSlot,
  rootClassName,
  mainClassName,
  rootStyle,
}: PageShellProps) {
  return (
    <div className={clsx('min-h-screen flex flex-col', rootClassName)} style={rootStyle}>
      {topSlot && <div className="mt-[var(--nav-height)]">{topSlot}</div>}
      <main className={clsx('flex-1', mainClassName)}>{children}</main>
      <section
        aria-label="Theme controls"
        className="relative z-10 hidden w-full items-center justify-end md:flex md:py-4 md:pr-4 lg:py-6 lg:pr-6"
      >
        <ThemeToggle />
      </section>
      <Footer />
    </div>
  );
}
