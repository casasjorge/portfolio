'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { AnimatedSection } from '@/components/AnimatedSection';
import { Container, SectionBlock } from '@/components/LayoutPrimitives';
import { ProjectGrid } from '@/components/ProjectGrid';
import { MagneticButton } from '@/components/MagneticButton';
import { PageShell } from '@/components/PageShell';
import { heroReveal, heroStagger, standardDuration, standardEase } from '@/lib/animations';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ProjectCardData } from '@/lib/projects';
import { CONTACT_EMAIL, CV_PATH, MAIN_TAB_HERO_MEDIA, RESUME_PATH, SOCIAL_LINKS } from '@/lib/site';
import { uiButtonStyles } from '@/lib/ui';

const ROLE_TITLES = [
  'Computational Astrophysicist',
  'Aerospace & Propulsion Engineer',
  'Orbital Dynamics Researcher',
  'Systems Engineer',
  'Mechanical Engineer',
  'Science & Technical Communicator',
];

interface HomeClientProps {
  featuredProjects: ProjectCardData[];
}

export default function HomeClient({ featuredProjects }: HomeClientProps) {
  const [titleIndex, setTitleIndex] = useState(0);
  const [showHeroVideo, setShowHeroVideo] = useState(false);
  const [aboutImageStyle, setAboutImageStyle] = useState<{ width: string; height: string } | undefined>(undefined);
  const [emailCopyState, setEmailCopyState] = useState<'idle' | 'copied' | 'error'>('idle');
  const aboutRowRef = useRef<HTMLDivElement | null>(null);
  const aboutTextRef = useRef<HTMLDivElement | null>(null);
  const heroCtaWrapperClass = 'w-full sm:w-56';
  const heroCtaButtonClass = 'w-full';
  const homeSectionStyle = { paddingTop: '2.25rem', paddingBottom: '2.25rem' };
  const scrollToSection = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (!target) return;

    const rootStyles = window.getComputedStyle(document.documentElement);
    const navHeightVar = rootStyles.getPropertyValue('--nav-height').trim();
    const rootFontSize = Number.parseFloat(rootStyles.fontSize) || 16;
    const navHeightPx = navHeightVar.endsWith('rem')
      ? Number.parseFloat(navHeightVar) * rootFontSize
      : Number.parseFloat(navHeightVar) || 64;
    const offsetPx = navHeightPx;
    const top = Math.max(0, window.scrollY + target.getBoundingClientRect().top - offsetPx);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.scrollTo({
      top,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };
  const copyEmailToClipboard = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(CONTACT_EMAIL);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = CONTACT_EMAIL;
        textArea.setAttribute('readonly', '');
        textArea.style.position = 'absolute';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setEmailCopyState('copied');
    } catch {
      setEmailCopyState('error');
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % ROLE_TITLES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (emailCopyState === 'idle') return;
    const timeoutId = window.setTimeout(() => setEmailCopyState('idle'), 2200);
    return () => window.clearTimeout(timeoutId);
  }, [emailCopyState]);

  useEffect(() => {
    const connection = (navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }).connection;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const isSlow =
      connection?.saveData ||
      connection?.effectiveType === 'slow-2g' ||
      connection?.effectiveType === '2g' ||
      connection?.effectiveType === '3g';

    if (isSlow || prefersReducedMotion) {
      return;
    }

    const id = window.setTimeout(() => setShowHeroVideo(true), 150);

    return () => {
      window.clearTimeout(id);
    };
  }, []);

  useLayoutEffect(() => {
    const row = aboutRowRef.current;
    const textColumn = aboutTextRef.current;
    if (!textColumn || !row) return;
    const ROW_GAP_PX = 24; // Tailwind gap-6
    const MIN_TEXT_WIDTH_PX = 288; // Tailwind 18rem

    const updateImageSize = () => {
      if (!window.matchMedia('(min-width: 768px)').matches) {
        setAboutImageStyle(undefined);
        return;
      }

      const textHeight = Math.round(textColumn.getBoundingClientRect().height);
      const rowWidth = Math.round(row.getBoundingClientRect().width);
      const maxByRow = Math.max(260, rowWidth - ROW_GAP_PX - MIN_TEXT_WIDTH_PX);
      const next = Math.min(textHeight, maxByRow);
      if (next <= 0) return;

      setAboutImageStyle((prev) => {
        const nextStyle = { width: `${next}px`, height: `${next}px` };
        if (prev?.width === nextStyle.width && prev?.height === nextStyle.height) return prev;
        return nextStyle;
      });
    };

    updateImageSize();

    const observer = new ResizeObserver(updateImageSize);
    observer.observe(textColumn);
    window.addEventListener('resize', updateImageSize);
    document.fonts?.ready.then(updateImageSize).catch(() => undefined);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateImageSize);
    };
  }, []);

  const emailCopyFeedback =
    emailCopyState === 'copied'
      ? 'Email copied to clipboard.'
      : emailCopyState === 'error'
        ? 'Unable to copy automatically. Please copy the email manually.'
        : null;

  return (
    <PageShell>
        {/* Hero Section */}
        <motion.section
          className="min-h-screen relative overflow-hidden flex flex-col justify-center"
          variants={heroStagger}
          initial="initial"
          animate="animate"
        >
          {/* Hero Background Media - Full Bleed */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(34,211,238,0.18),_transparent_58%),linear-gradient(180deg,_rgba(15,23,42,0.72),_rgba(2,6,23,0.92))]" />
          {showHeroVideo ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              poster={MAIN_TAB_HERO_MEDIA.homePoster}
              className="absolute inset-0 w-full h-full object-cover opacity-40 -z-10"
              aria-hidden="true"
            >
              <source src={MAIN_TAB_HERO_MEDIA.homeWebm} type="video/webm" />
              <source src={MAIN_TAB_HERO_MEDIA.home} type="video/mp4" />
            </video>
          ) : null}

          {/* Content Container - Centered with max-width */}
          <Container className="w-full py-20">
            <motion.div variants={heroReveal} className="max-w-4xl text-center sm:text-left">
              <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight">
                Hi, I&apos;m Jorge
              </h1>
              <div className="mt-6 md:mt-8 flex min-h-[4rem] items-center justify-center sm:justify-start">
                <motion.div
                  key={titleIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: standardDuration, ease: standardEase }}
                  className="w-full text-xl md:text-2xl leading-tight text-cyan-300 font-semibold"
                >
                  {ROLE_TITLES[titleIndex]}
                </motion.div>
              </div>
            </motion.div>

          <motion.div variants={heroReveal} className="mt-6 md:mt-8 flex flex-wrap items-center gap-4">
            <MagneticButton className={heroCtaWrapperClass}>
              <Link
                href="/projects"
                className={`${uiButtonStyles.primaryLg} ${heroCtaButtonClass}`}
              >
                Explore Projects
              </Link>
            </MagneticButton>
            <MagneticButton className={heroCtaWrapperClass}>
              <a
                href={RESUME_PATH}
                target="_blank"
                rel="noopener noreferrer"
                className={`${uiButtonStyles.outlineLg} ${heroCtaButtonClass}`}
              >
                View Resume
              </a>
            </MagneticButton>
          </motion.div>
          </Container>

          <motion.div
            variants={heroReveal}
            className="absolute inset-x-0 bottom-6 z-20 flex justify-center sm:bottom-8"
          >
            <motion.button
              type="button"
              aria-label="Scroll to About Me"
              onClick={() => scrollToSection('about')}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/40 bg-slate-950/45 text-cyan-200 backdrop-blur transition-colors hover:border-cyan-300/70 hover:bg-cyan-500/20"
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
                className="h-4 w-4"
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.button>
          </motion.div>
        </motion.section>

        {/* About Section */}
        <SectionBlock id="about" spacing="tight" style={homeSectionStyle}>
          <AnimatedSection>
            <h2 className="text-4xl font-bold mb-6">About Me</h2>
          </AnimatedSection>

          <div ref={aboutRowRef} className="flex flex-col md:flex-row gap-6 md:items-stretch">
            <div
              className="relative w-full aspect-square rounded-lg overflow-hidden bg-white/5 md:shrink-0 md:w-[320px] md:h-[320px]"
              style={aboutImageStyle}
            >
              <Image
                src="/projects/columbia-hybrid-rocket/jorge-portrait.jpg"
                alt="Jorge"
                fill
                className="object-cover object-center"
                priority
                sizes="(max-width: 768px) 100vw, 45vw"
              />
            </div>

            <AnimatedSection delay={0.1} className="md:flex-1 md:min-w-[18rem]">
              <div ref={aboutTextRef}>
              <p className="text-gray-300 mb-4">
                As a first-generation graduate of Columbia University, I am a computational astrophysicist drawn to the dynamics of how energy moves through complex systems. My research explores gravitational interactions in multi-body systems, examining how chaotic three-body encounters can generate velocity amplification and orbital scattering beyond classical two-body limits. I build numerical tools to navigate high-dimensional phase space and to better understand how structure emerges from systems that are inherently unstable.
              </p>
              <p className="text-gray-300 mb-6">
                Alongside this work, I remain deeply engaged in propulsion, advanced manufacturing, and technical infrastructure. Designing rocket hardware, modeling thermal systems, and refining machining workflows have shaped my belief that theory should always answer to physical constraint. Whether studying orbital mechanics or combustion chambers, I am motivated by the same question: how does energy move, and how can we build tools that make complex systems clearer and more controllable?
              </p>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection delay={0.2} className="mt-10 flex w-full justify-center">
            <motion.button
              type="button"
              aria-label="Scroll to Featured Projects"
              onClick={() => scrollToSection('featured-projects')}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/40 bg-slate-950/45 text-cyan-200 backdrop-blur transition-colors hover:border-cyan-300/70 hover:bg-cyan-500/20"
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
                className="h-4 w-4"
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.button>
          </AnimatedSection>
        </SectionBlock>

        {/* Featured Projects Section */}
        <SectionBlock spacing="tight" id="featured-projects" style={homeSectionStyle}>
          <AnimatedSection>
            <h2 className="text-4xl font-bold mb-4 font-display">Featured Work</h2>
            <p className="text-gray-400 mb-12 max-w-2xl">
              Selected projects showcasing my expertise in optimization, simulation, and systems design.
            </p>
          </AnimatedSection>

          <ProjectGrid projects={featuredProjects} />

          <AnimatedSection delay={0.2}>
            <div className="mt-12 text-center">
              <MagneticButton>
                <Link
                  href="/projects"
                  className={uiButtonStyles.softLg}
                >
                  View All Projects &rarr;
                </Link>
              </MagneticButton>
            </div>
          </AnimatedSection>
        </SectionBlock>

        {/* CTA Section */}
        <SectionBlock spacing="tight" id="contact" style={homeSectionStyle}>
          <AnimatedSection>
            <div className="glass-morphism ambient-panel rounded-xl px-6 pt-6 pb-5 text-center sm:px-8 sm:pt-8 sm:pb-5">
              <h2 className="text-3xl font-bold mb-3">Let's get in Contact!</h2>
              <p className="mx-auto mb-7 max-w-2xl text-gray-300">
                Explore my resume, CV, and professional profiles below. I’m always happy to connect about research, engineering projects, or technical collaborations.
              </p>
              <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4">
                <div className="grid w-full max-w-lg grid-cols-2 gap-2 sm:grid-cols-4">
                  <a
                    href={RESUME_PATH}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-w-0 items-center justify-center rounded-lg border border-cyan-400/45 bg-cyan-500/10 px-2 py-2 text-xs font-semibold text-cyan-200 transition-colors hover:border-cyan-300/70 hover:bg-cyan-500/20"
                  >
                    <span className="truncate">Resume</span>
                  </a>
                  <a
                    href={CV_PATH}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-w-0 items-center justify-center rounded-lg border border-cyan-400/45 bg-cyan-500/10 px-2 py-2 text-xs font-semibold text-cyan-200 transition-colors hover:border-cyan-300/70 hover:bg-cyan-500/20"
                  >
                    <span className="truncate">CV</span>
                  </a>
                  <a
                    href={SOCIAL_LINKS.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-w-0 items-center justify-center gap-1 rounded-lg border border-cyan-400/45 bg-cyan-500/10 px-2 py-2 text-xs font-semibold text-cyan-200 transition-colors hover:border-cyan-300/70 hover:bg-cyan-500/20"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-3.5 w-3.5 shrink-0">
                      <path d="M12 2a10 10 0 0 0-3.162 19.487c.5.092.683-.217.683-.483 0-.237-.009-.866-.014-1.699-2.782.605-3.369-1.341-3.369-1.341-.455-1.156-1.111-1.464-1.111-1.464-.908-.62.069-.608.069-.608 1.004.071 1.532 1.031 1.532 1.031.892 1.529 2.341 1.087 2.91.832.09-.646.349-1.087.635-1.337-2.221-.253-4.555-1.111-4.555-4.944 0-1.092.39-1.985 1.03-2.685-.103-.253-.446-1.272.098-2.651 0 0 .84-.269 2.75 1.025A9.577 9.577 0 0 1 12 6.845c.85.004 1.706.115 2.505.338 1.909-1.294 2.748-1.025 2.748-1.025.545 1.379.202 2.398.1 2.651.64.7 1.029 1.593 1.029 2.685 0 3.842-2.338 4.688-4.566 4.937.359.31.679.92.679 1.855 0 1.339-.012 2.419-.012 2.748 0 .268.18.58.688.482A10.002 10.002 0 0 0 12 2Z" />
                    </svg>
                    <span className="truncate">GitHub</span>
                  </a>
                  <a
                    href={SOCIAL_LINKS.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-w-0 items-center justify-center gap-1 rounded-lg border border-cyan-400/45 bg-cyan-500/10 px-2 py-2 text-xs font-semibold text-cyan-200 transition-colors hover:border-cyan-300/70 hover:bg-cyan-500/20"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-3.5 w-3.5 shrink-0">
                      <path d="M6.94 8.5H3.56V20h3.38V8.5Zm-1.69-5.42A1.96 1.96 0 1 0 5.25 7a1.96 1.96 0 0 0 0-3.92ZM20.44 13.4c0-3.1-1.65-4.54-3.85-4.54a3.33 3.33 0 0 0-3 1.66V8.5h-3.37V20h3.37v-6.03c0-1.58.3-3.1 2.26-3.1 1.94 0 1.97 1.81 1.97 3.2V20h3.37l-.01-6.6Z" />
                    </svg>
                    <span className="truncate">LinkedIn</span>
                  </a>
                </div>

                <button
                  type="button"
                  onClick={copyEmailToClipboard}
                  className="group inline-flex w-full max-w-lg flex-col items-center justify-center gap-1.5 rounded-lg border border-cyan-400/40 bg-slate-950/40 px-4 py-3 text-cyan-200 backdrop-blur transition-colors hover:border-cyan-300/70 hover:bg-cyan-500/10"
                  aria-label={`Copy email address ${CONTACT_EMAIL} to clipboard`}
                >
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-300/90 sm:text-xs">
                    {emailCopyState === 'copied'
                      ? 'Copied To Clipboard'
                      : emailCopyState === 'error'
                        ? 'Copy Failed'
                        : 'Click To Copy Email'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold sm:text-base">
                    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-3.5 w-3.5 sm:h-4 sm:w-4">
                      <path
                        d="M3.75 5.5A1.75 1.75 0 0 1 5.5 3.75h9A1.75 1.75 0 0 1 16.25 5.5v9A1.75 1.75 0 0 1 14.5 16.25h-9A1.75 1.75 0 0 1 3.75 14.5v-9Z"
                        stroke="currentColor"
                        strokeWidth="1.4"
                      />
                      <path
                        d="M4.5 6.25 10 10l5.5-3.75"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{CONTACT_EMAIL}</span>
                    <span
                      className="relative inline-flex h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4"
                      aria-hidden="true"
                    >
                      <AnimatePresence initial={false}>
                        {emailCopyState === 'copied' ? (
                          <motion.svg
                            key="email-copy-check"
                            viewBox="0 0 20 20"
                            fill="none"
                            className="absolute inset-0 h-full w-full text-cyan-300"
                            initial={{ opacity: 0, scale: 0.75, rotate: -12 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.75, rotate: 12 }}
                            transition={{ duration: 0.22, ease: standardEase }}
                          >
                            <motion.path
                              d="M5 10.25 8.25 13.5 15 6.75"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              exit={{ pathLength: 0 }}
                              transition={{ duration: 0.22, ease: standardEase }}
                            />
                          </motion.svg>
                        ) : null}
                      </AnimatePresence>
                    </span>
                  </span>
                </button>

                <div className="relative h-5 w-full max-w-lg overflow-hidden sm:h-6" aria-live="polite">
                  <AnimatePresence initial={false} mode="wait">
                    {emailCopyFeedback ? (
                      <motion.p
                        key={emailCopyState}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2, ease: standardEase }}
                        className="absolute inset-0 text-center text-xs text-cyan-300/90 sm:text-sm"
                      >
                        {emailCopyFeedback}
                      </motion.p>
                    ) : null}
                  </AnimatePresence>
                </div>

              </div>
            </div>
          </AnimatedSection>
        </SectionBlock>
    </PageShell>
  );
}
