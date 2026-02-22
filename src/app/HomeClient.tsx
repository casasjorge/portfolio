'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { AnimatedSection } from '@/components/AnimatedSection';
import { Container, SectionBlock } from '@/components/LayoutPrimitives';
import { ProjectGrid } from '@/components/ProjectGrid';
import { MagneticButton } from '@/components/MagneticButton';
import { PageShell } from '@/components/PageShell';
import { heroReveal, heroStagger, standardDuration, standardEase } from '@/lib/animations';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ProjectCardData } from '@/lib/projects';
import { CONTACT_EMAIL_HREF, MAIN_TAB_HERO_MEDIA, RESUME_PATH, SOCIAL_LINKS } from '@/lib/site';
import { uiButtonStyles, uiLinkStyles } from '@/lib/ui';

const ROLE_TITLES = [
  'Computational Astrophysicist',
  'Computational Physicist',
  'Mechanical Engineer',
  'Aerospace Engineer',
  'Propulsion Engineer',
  'Orbital Dynamics Researcher',
  'Flight Dynamics Analyst',
  'Numerical Simulation Developer',
  'Multiphysics Modeler',
  'Finite Element Analyst',
  'Thermal Systems Analyst',
  'Manufacturing Engineer',
  'Design for Manufacturing Engineer',
  'CAD/CAM Designer',
  'Rapid Prototyping Specialist',
  'CNC Machinist',
  'Welder',
  'Instrumentation Engineer',
  'Test Engineer',
  'R&D Engineer',
  'Systems Engineer',
  'Data Scientist',
  'Machine Learning Engineer',
  'Data Analyst',
  'Research Data Engineer',
  'Video Editor',
  'Technical Content Creator',
  'Science Communicator',
  'Technical Communicator',
];

interface HomeClientProps {
  featuredProjects: ProjectCardData[];
}

export default function HomeClient({ featuredProjects }: HomeClientProps) {
  const [titleIndex, setTitleIndex] = useState(0);
  const [showHeroVideo, setShowHeroVideo] = useState(false);
  const [aboutImageStyle, setAboutImageStyle] = useState<{ width: string; height: string } | undefined>(undefined);
  const aboutRowRef = useRef<HTMLDivElement | null>(null);
  const aboutTextRef = useRef<HTMLDivElement | null>(null);
  const heroCtaWrapperClass = 'w-full sm:w-56';
  const heroCtaButtonClass = 'w-full';
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % ROLE_TITLES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

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
            <h1 className="text-6xl md:text-7xl font-bold mb-6 text-slate-900 dark:text-white leading-tight">Hi, I&apos;m Jorge</h1>
            <motion.div
              key={titleIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: standardDuration, ease: standardEase }}
              className="text-xl md:text-2xl text-cyan-300 font-semibold"
            >
              {ROLE_TITLES[titleIndex]}
            </motion.div>
          </motion.div>

          <motion.div variants={heroReveal} className="mt-12 flex flex-wrap items-center gap-4">
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
                download
                className={`${uiButtonStyles.outlineLg} ${heroCtaButtonClass}`}
              >
                Download Resume
              </a>
            </MagneticButton>
            <MagneticButton className={heroCtaWrapperClass}>
              <button
                type="button"
                onClick={() => scrollToSection('about')}
                className={`${uiButtonStyles.outlineLg} ${heroCtaButtonClass}`}
              >
                Learn More
              </button>
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
        <SectionBlock id="about">
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
                As a first-generation graduate of Columbia University, I am a computational astrophysicist focused on gravitational dynamics and energy transfer in multi-body systems. My research investigates how chaotic three-body interactions enable velocity amplification and orbital scattering beyond classical two-body limits. I develop numerical tools to explore high-dimensional phase space and to better understand how structure emerges within systems that are inherently unstable.
              </p>
              <p className="text-gray-300 mb-6">
                Alongside my research, I maintain a strong interest in propulsion, advanced manufacturing, and technical infrastructure. Designing rocket hardware, modeling thermal systems, and modernizing machining workflows have reinforced a perspective that theory must remain accountable to physical constraint. Across domains, I am motivated by understanding how energy moves through complex systems - whether in orbital mechanics, combustion chambers, or engineered structures - and by building tools that make those systems more legible.
              </p>
              <div className="flex gap-4">
                <Link
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={uiLinkStyles.accent}
                >
                  GitHub
                </Link>
                <Link
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={uiLinkStyles.accent}
                >
                  LinkedIn
                </Link>
              </div>
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
        <SectionBlock spacing="tight" id="featured-projects">
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
        <SectionBlock spacing="tight" id="contact">
          <AnimatedSection>
            <div className="glass-morphism ambient-panel p-12 rounded-xl text-center">
              <h2 className="text-3xl font-bold mb-4">Want to get in contact?</h2>
              <p className="text-gray-300 mb-6">
                I&apos;m open to discussions about research, engineering projects, or technical collaborations.
              </p>
              <MagneticButton>
                <Link
                  href={CONTACT_EMAIL_HREF}
                  className={uiButtonStyles.primaryLg}
                >
                  Get in Touch
                </Link>
              </MagneticButton>
            </div>
          </AnimatedSection>
        </SectionBlock>
    </PageShell>
  );
}
