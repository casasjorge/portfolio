'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/AnimatedSection';
import { ProjectContentShell } from '@/components/ProjectContentShell';
import { ProjectSectionList } from '@/components/ProjectSectionList';
import { SectionBlock, layoutClassNames } from '@/components/LayoutPrimitives';
import { Lightbox } from '@/components/Lightbox';
import { PageShell } from '@/components/PageShell';
import { ProjectHeroMedia } from '@/components/ProjectHeroMedia';
import { MarkdownText } from '@/components/MarkdownText';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { isVideoMedia, isYouTubeUrl } from '@/lib/media';
import { Project, ProjectSubpage } from '@/lib/projects';
import { useMemo } from 'react';
import { useLightbox } from '@/lib/useLightbox';
import { uiButtonStyles, uiTextStyles } from '@/lib/ui';

interface ProjectSubpageClientProps {
  project: Project;
  subpage: ProjectSubpage;
  children?: React.ReactNode;
}

function ProjectSubpageClient({ project, subpage, children }: ProjectSubpageClientProps) {
  const hasSubpageNav = Boolean(project.subpages && project.subpages.length > 0);
  const firstSectionMedia =
    subpage.sections?.find((section) =>
      Boolean((section.mediaItems && section.mediaItems.length > 0) || section.media)
    );
  const heroMedia =
    subpage.heroMedia ??
    firstSectionMedia?.mediaItems?.[0]?.src ??
    firstSectionMedia?.media ??
    project.heroImage;

  const lightboxImages = useMemo(() => {
    const images: string[] = [];
    if (subpage.sections) {
      subpage.sections.forEach((section) => {
        if (section.mediaItems && section.mediaItems.length > 0) {
          section.mediaItems.forEach((item) => {
            if (!isVideoMedia(item.src) && !isYouTubeUrl(item.src)) {
              images.push(item.src);
            }
          });
        } else if (section.media && !isVideoMedia(section.media) && !isYouTubeUrl(section.media)) {
          images.push(section.media);
        }
      });
    }
    return images;
  }, [subpage]);
  const {
    lightboxIndex,
    setLightboxIndex,
    isLightboxOpen,
    setIsLightboxOpen,
    openLightboxBySrc,
  } = useLightbox(lightboxImages);

  return (
    <PageShell>
        {/* Hero Image */}
        {heroMedia && (
          <ProjectHeroMedia
            media={heroMedia}
            alt={subpage.title}
            priority
            withTopOffset={!hasSubpageNav}
          />
        )}

        {/* Header */}
        <ProjectContentShell
          motionKey={subpage.id}
          className={layoutClassNames.projectContentStandard}
        >
          <motion.div variants={fadeInUp}>
            <div className="mb-2 text-sm text-cyan-400 font-semibold uppercase tracking-wider">
              {project.title}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">{subpage.title}</h1>
            <MarkdownText
              content={subpage.description}
              paragraphClassName={`${uiTextStyles.lead} max-w-3xl mb-0`}
            />
          </motion.div>
        </ProjectContentShell>

        {/* Subpage Authored Content */}
        {children && (
          <SectionBlock>
            {children}
          </SectionBlock>
        )}

        {/* Legacy Structured Subpage Sections */}
        {(!children && subpage.sections && subpage.sections.length > 0) && (
          <SectionBlock>
            <ProjectSectionList
              sections={subpage.sections}
              onOpenImage={openLightboxBySrc}
              className="space-y-20"
            />
          </SectionBlock>
        )}

        {/* Back to Project Link */}
        <motion.section className={layoutClassNames.sectionTight} variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>
          <AnimatedSection>
            <Link href={`/projects/${project.slug}/`} className={uiButtonStyles.outlineMd}>
              {'<'} Back to {project.title}
            </Link>
          </AnimatedSection>
        </motion.section>
      {/* Lightbox */}
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

export default ProjectSubpageClient;
