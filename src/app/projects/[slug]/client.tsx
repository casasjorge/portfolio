'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { AnimatedSection } from '@/components/AnimatedSection';
import { ProjectContentShell } from '@/components/ProjectContentShell';
import { ProjectSectionList } from '@/components/ProjectSectionList';
import { Lightbox } from '@/components/Lightbox';
import { BlurImage } from '@/components/BlurImage';
import { layoutClassNames } from '@/components/LayoutPrimitives';
import { PageShell } from '@/components/PageShell';
import { ProjectHeroMedia } from '@/components/ProjectHeroMedia';
import { MarkdownText } from '@/components/MarkdownText';
import { fadeInUp, standardDuration, standardEase } from '@/lib/animations';
import { isVideoMedia, isYouTubeUrl } from '@/lib/media';
import { Project } from '@/lib/projects';
import { Writing } from '@/lib/writing';
import { formatDate, getDuration, accentVars } from '@/lib/utils';
import { useLightbox } from '@/lib/useLightbox';
import { uiButtonStyles, uiLinkStyles, uiTextStyles } from '@/lib/ui';

interface ProjectDetailClientProps {
  project: Project;
  relatedWritings?: Writing[];
  children?: React.ReactNode;
}

export default function ProjectDetailClient({
  project,
  relatedWritings = [],
  children,
}: ProjectDetailClientProps) {
  const hasSubpageNav = Boolean(project.subpages && project.subpages.length > 0);
  const lightboxImages = useMemo(() => {
    const sectionImages = (project.sections ?? [])
      .flatMap((section) => {
        if (section.mediaItems && section.mediaItems.length > 0) {
          return section.mediaItems.map((item) => item.src);
        }
        return section.media ? [section.media] : [];
      })
      .filter((media) => !isVideoMedia(media) && !isYouTubeUrl(media));
    const galleryImages = (project.gallery ?? []).filter(
      (media) => !isVideoMedia(media) && !isYouTubeUrl(media)
    );
    return Array.from(new Set([...sectionImages, ...galleryImages]));
  }, [project.gallery, project.sections]);
  const {
    lightboxIndex,
    setLightboxIndex,
    isLightboxOpen,
    setIsLightboxOpen,
    openLightboxBySrc,
  } = useLightbox(lightboxImages);

  const linkItems = [
    { key: 'github', label: 'View on GitHub', variant: 'solid' },
    { key: 'paper', label: 'Read Paper', variant: 'outline' },
    { key: 'demo', label: 'Live Demo', variant: 'outline' },
    { key: 'documentation', label: 'Documentation', variant: 'outline' },
    { key: 'videos', label: 'Videos', variant: 'outline' },
    { key: 'teamsite', label: 'Team Site', variant: 'outline' },
    { key: 'datarepo', label: 'Data Repo', variant: 'outline' },
    { key: 'competition', label: 'Competition', variant: 'outline' },
    { key: 'diagram', label: 'Diagram', variant: 'outline' },
    { key: 'postprocessor', label: 'Post-Processor', variant: 'outline' },
    { key: 'mpc', label: 'MPC Archive', variant: 'outline' },
    { key: 'notebooks', label: 'Notebooks', variant: 'outline' },
    { key: 'external', label: 'External Link', variant: 'outline' },
  ] as const;

  const getWritingPdf = (writing: Writing) =>
    typeof writing.links?.pdf === 'string' && writing.links.pdf.trim().length > 0
      ? writing.links.pdf
      : null;
  const channelHref =
    typeof project.links?.channel === 'string' && project.links.channel.trim().length > 0
      ? project.links.channel
      : null;
  const visibleLinkItems = linkItems.filter((item) => {
    const val = project.links?.[item.key];
    return typeof val === 'string' && val.trim().length > 0;
  });

  return (
    <PageShell rootStyle={accentVars(project.accentColor)}>
        {/* Hero Image */}
        {project.heroImage ? (
          <ProjectHeroMedia
            media={project.heroImage}
            alt={project.title}
            priority
            withTopOffset={!hasSubpageNav}
          />
        ) : (
          <div
            className={`relative w-full h-80 md:h-[430px] overflow-hidden ${
              hasSubpageNav ? '' : 'mt-[var(--nav-height)]'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/[0.02]" />
          </div>
        )}

        {/* Content */}
        <ProjectContentShell
          className={layoutClassNames.projectContentExtended}
        >
          {/* Breadcrumb and Back Link */}
          <AnimatedSection>
            <Link
              href="/projects"
              className={`${uiLinkStyles.accent} mb-8 inline-block`}
            >
              {'<'} Back to Projects
            </Link>
          </AnimatedSection>

          {/* Overview Panel */}
          <motion.div variants={fadeInUp} className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">{project.title}</h1>
            <MarkdownText
              content={project.shortDescription}
              className="reading-width"
              paragraphClassName={`${uiTextStyles.lead} mb-0`}
            />

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.02] text-xs md:text-sm">
                <span className="text-gray-400">Duration:</span>{' '}
                <span className="font-semibold">{getDuration(project.dates.start, project.dates.end)}</span>
              </span>
              <span className="px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.02] text-xs md:text-sm">
                <span className="text-gray-400">Started:</span>{' '}
                <span className="font-semibold">{formatDate(project.dates.start)}</span>
              </span>
              <span className="px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.02] text-xs md:text-sm">
                <span className="text-gray-400">Completed:</span>{' '}
                <span className="font-semibold">{formatDate(project.dates.end)}</span>
              </span>
              <span className="px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.02] text-xs md:text-sm">
                <span className="text-gray-400">Category:</span>{' '}
                <span className="font-semibold capitalize">{project.tags[0]}</span>
              </span>
            </div>
          </motion.div>

          {/* Full Description / Narrative Sections */}
          {project.sections && project.sections.length > 0 ? (
            // Scrollytelling Layout
            <div className="mb-24">
              <motion.div variants={fadeInUp} className="mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Project Narrative</h2>
                <div className="w-16 h-1 accent-bar mb-6" />
                {children || (
                  <MarkdownText
                    content={project.fullDescription}
                    paragraphClassName={uiTextStyles.bodyParagraph}
                  />
                )}
              </motion.div>

              <ProjectSectionList
                sections={project.sections}
                onOpenImage={openLightboxBySrc}
                className="space-y-16 mt-16"
              />
            </div>
          ) : (
            // Fallback: Original Layout
            <motion.div variants={fadeInUp} className="mb-12 max-w-3xl">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              {children || (
                <MarkdownText
                  content={project.fullDescription}
                  paragraphClassName={uiTextStyles.bodyParagraph}
                />
              )}
            </motion.div>
          )}

          {/* Related Writings */}
          {(relatedWritings.length > 0 || channelHref) && (
            <motion.div variants={fadeInUp} className="mb-12 pt-4 border-t border-white/10">
              <p className="text-xs md:text-sm uppercase tracking-wider text-gray-400 mb-3">
                {relatedWritings.length > 0
                  ? channelHref
                    ? 'Related Writings & Resources'
                    : 'Related Writings'
                  : 'Related Resources'}
              </p>
              <div className="space-y-3">
                {relatedWritings.map((writing) => {
                  const pdfHref = getWritingPdf(writing);

                  return (
                    <div
                      key={writing.id}
                      className="rounded-lg border border-cyan-500/25 bg-white/[0.02] p-3 md:p-4"
                    >
                      <p className="font-semibold mb-2 text-sm md:text-base">{writing.title}</p>
                      <div className="flex flex-wrap gap-2">
                        {pdfHref && (
                          <>
                            <a
                              href={pdfHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={uiButtonStyles.outlineSm}
                            >
                              View Writing
                            </a>
                            <a
                              href={pdfHref}
                              download
                              className={uiButtonStyles.primarySm}
                            >
                              Download Writing
                            </a>
                          </>
                        )}
                        <Link
                          href={`/writing#${writing.slug}`}
                          className={uiButtonStyles.outlineSm}
                        >
                          Writing Tab
                        </Link>
                      </div>
                    </div>
                  );
                })}
                {channelHref && (
                  <div className="rounded-lg border border-cyan-500/25 bg-white/[0.02] p-3 md:p-4">
                    <p className="font-semibold mb-2 text-sm md:text-base">Channel</p>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={channelHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={uiButtonStyles.outlineSm}
                      >
                        Visit Channel
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Technologies */}
          <motion.div variants={fadeInUp} className="mb-12">
            <h2 className="text-2xl font-bold mb-6 font-display">Technologies & Tools</h2>
            <div className="flex flex-wrap gap-3">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 accent-tag rounded-full text-sm font-medium transition-all"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Gallery */}
          {project.gallery.length > 0 && (
            <motion.div variants={fadeInUp} className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                {project.gallery.map((image, idx) => (
                  <motion.div
                    key={idx}
                    className="relative aspect-[4/3] rounded-lg overflow-hidden"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: standardDuration, ease: standardEase, delay: idx * 0.1 }}
                  >
                    {isVideoMedia(image) ? (
                      <video className="h-full w-full object-cover" controls playsInline>
                        <source src={image} />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openLightboxBySrc(image)}
                        className="relative w-full h-full cursor-zoom-in"
                        aria-label="Open gallery image"
                      >
                        <BlurImage
                          src={image}
                          alt={`${project.title} image ${idx + 1}`}
                          fill
                          className="object-cover hover:scale-110 transition-transform duration-300"
                        />
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Video Demo */}
          {project.videoDemo && (
            <motion.div variants={fadeInUp} className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Demo Video</h2>
              <div className="relative aspect-video rounded-lg overflow-hidden bg-black/50">
                <video
                  controls
                  className="w-full h-full"
                  poster="/video-poster.png"
                >
                  <source src={project.videoDemo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </motion.div>
          )}

          {/* Links */}
          {visibleLinkItems.length > 0 && (
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 mb-12">
              {visibleLinkItems.map((item) => (
                <a
                  key={item.key}
                  href={project.links[item.key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    item.variant === 'solid'
                      ? uiButtonStyles.primaryMd
                      : uiButtonStyles.outlineMd
                  }
                >
                  {item.label}
                </a>
              ))}
            </motion.div>
          )}
        </ProjectContentShell>

      <Lightbox
        images={lightboxImages}
        index={lightboxIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onIndexChange={setLightboxIndex}
      />
    </PageShell>
  );
}
