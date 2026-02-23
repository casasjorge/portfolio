'use client';

import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Container } from '@/components/LayoutPrimitives';
import { ProjectSubpage } from '@/lib/projects';
import { uiSubpageNavStyles } from '@/lib/ui';
import { clsx } from '@/lib/utils';

interface ProjectSubpageNavProps {
  projectSlug: string;
  subpages: ProjectSubpage[];
  activeSubpageSlug?: string;
}

function DropdownChevron({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={clsx(
        'ml-2 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-current transition-transform duration-200',
        open && 'rotate-180'
      )}
    >
      <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
        <path
          d="M5 7.5L10 12.5L15 7.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function ProjectSubpageNav({
  projectSlug,
  subpages,
  activeSubpageSlug,
}: ProjectSubpageNavProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false);
  const [desktopOverflow, setDesktopOverflow] = useState(false);
  const [isHiddenOnScroll, setIsHiddenOnScroll] = useState(false);
  const desktopMeasureRef = useRef<HTMLDivElement | null>(null);
  const selectedSegment = useSelectedLayoutSegment();
  const resolvedActiveSubpageSlug =
    activeSubpageSlug ?? (typeof selectedSegment === 'string' ? selectedSegment : undefined);

  if (!subpages || subpages.length === 0) {
    return null;
  }

  const orderedSubpages = useMemo(
    () => [...subpages].sort((a, b) => a.order - b.order),
    [subpages]
  );

  const activeLabel =
    resolvedActiveSubpageSlug
      ? orderedSubpages.find((subpage) => subpage.slug === resolvedActiveSubpageSlug)?.title || 'Overview'
      : 'Overview';

  useEffect(() => {
    const checkOverflow = () => {
      const row = desktopMeasureRef.current;
      if (!row) return;
      const doesOverflow = row.scrollWidth > row.clientWidth + 1;
      setDesktopOverflow(doesOverflow);
      if (!doesOverflow) {
        setIsDesktopDropdownOpen(false);
      }
    };

    const runCheck = () => {
      requestAnimationFrame(checkOverflow);
    };

    runCheck();

    const observer =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(runCheck)
        : null;
    if (observer && desktopMeasureRef.current) {
      observer.observe(desktopMeasureRef.current);
    }

    window.addEventListener('resize', runCheck);

    const fonts = (document as Document & {
      fonts?: { ready?: Promise<unknown> };
    }).fonts;
    fonts?.ready?.then(runCheck).catch(() => undefined);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', runCheck);
    };
  }, [orderedSubpages]);

  useEffect(() => {
    // Keep the subpage nav visible while a menu/dropdown is open.
    if (isMobileOpen || isDesktopDropdownOpen) {
      setIsHiddenOnScroll(false);
    }
  }, [isDesktopDropdownOpen, isMobileOpen]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateVisibility = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      // Keep visible near the top and while interacting with nav menus.
      if (currentScrollY <= 96 || isMobileOpen || isDesktopDropdownOpen) {
        setIsHiddenOnScroll(false);
        lastScrollY = currentScrollY;
        ticking = false;
        return;
      }

      if (Math.abs(delta) >= 8) {
        setIsHiddenOnScroll(delta > 0);
        lastScrollY = currentScrollY;
      }

      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateVisibility);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isDesktopDropdownOpen, isMobileOpen]);

  const getDropdownLinkClass = (isActive: boolean) =>
    isActive ? uiSubpageNavStyles.dropdownLinkActive : uiSubpageNavStyles.dropdownLink;

  return (
    <div
      className={clsx(
        uiSubpageNavStyles.wrapper,
        'sticky top-[var(--nav-height)] transition-[transform,opacity] duration-300 motion-reduce:transition-none',
        isHiddenOnScroll && '-translate-y-full opacity-0 pointer-events-none'
      )}
    >
      <div
        ref={desktopMeasureRef}
        className={uiSubpageNavStyles.measureRow}
        aria-hidden="true"
      >
        <span className={uiSubpageNavStyles.measureItem}>Overview</span>
        {orderedSubpages.map((subpage) => (
          <span
            key={`measure-${subpage.slug}`}
            className={uiSubpageNavStyles.measureItem}
          >
            {subpage.title}
          </span>
        ))}
      </div>

      <Container className={uiSubpageNavStyles.mobileContainer}>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsMobileOpen((prev) => !prev)}
            className={uiSubpageNavStyles.dropdownTrigger}
            aria-expanded={isMobileOpen}
            aria-controls="subpage-mobile-menu"
          >
            <span className="truncate">{activeLabel}</span>
            <DropdownChevron open={isMobileOpen} />
          </button>

          {isMobileOpen && (
            <div
              id="subpage-mobile-menu"
              className={uiSubpageNavStyles.dropdownPanel}
            >
                <Link
                  href={`/projects/${projectSlug}/`}
                  className={getDropdownLinkClass(!resolvedActiveSubpageSlug)}
                  onClick={() => setIsMobileOpen(false)}
                >
                  Overview
              </Link>

              {orderedSubpages.map((subpage) => {
                const isActive = subpage.slug === resolvedActiveSubpageSlug;
                return (
                  <Link
                    key={subpage.slug}
                    href={`/projects/${projectSlug}/${subpage.slug}/`}
                    className={getDropdownLinkClass(isActive)}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {subpage.title}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </Container>

      {desktopOverflow ? (
        <Container className={uiSubpageNavStyles.desktopContainer}>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDesktopDropdownOpen((prev) => !prev)}
              className={uiSubpageNavStyles.dropdownTrigger}
              aria-expanded={isDesktopDropdownOpen}
              aria-controls="subpage-desktop-menu"
            >
              <span className="truncate">{activeLabel}</span>
              <DropdownChevron open={isDesktopDropdownOpen} />
            </button>

            {isDesktopDropdownOpen && (
              <div
                id="subpage-desktop-menu"
                className={uiSubpageNavStyles.dropdownPanel}
              >
                <Link
                  href={`/projects/${projectSlug}/`}
                  className={getDropdownLinkClass(!resolvedActiveSubpageSlug)}
                  onClick={() => setIsDesktopDropdownOpen(false)}
                >
                  Overview
                </Link>

                {orderedSubpages.map((subpage) => {
                  const isActive = subpage.slug === resolvedActiveSubpageSlug;
                  return (
                    <Link
                      key={subpage.slug}
                      href={`/projects/${projectSlug}/${subpage.slug}/`}
                      className={getDropdownLinkClass(isActive)}
                      onClick={() => setIsDesktopDropdownOpen(false)}
                    >
                      {subpage.title}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </Container>
      ) : (
        <div className={uiSubpageNavStyles.tabsRow}>
          <Link
            href={`/projects/${projectSlug}/`}
            className={!resolvedActiveSubpageSlug ? uiSubpageNavStyles.tabActive : uiSubpageNavStyles.tab}
          >
            Overview
          </Link>

          {orderedSubpages.map((subpage) => {
            const isActive = subpage.slug === resolvedActiveSubpageSlug;
            return (
              <Link
                key={subpage.slug}
                href={`/projects/${projectSlug}/${subpage.slug}/`}
                className={isActive ? uiSubpageNavStyles.tabActive : uiSubpageNavStyles.tab}
              >
                {subpage.title}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
