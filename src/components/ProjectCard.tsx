'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { ProjectCardData } from '@/lib/projects';
import { staggerItem, hoverLift } from '@/lib/animations';
import { accentVars } from '@/lib/utils';
import { BlurImage } from '@/components/BlurImage';
import { TiltCard } from '@/components/TiltCard';
import { getCanonicalLabels } from '@/lib/canonicalTags';
import { MarkdownText } from '@/components/MarkdownText';

interface ProjectCardProps {
  project: ProjectCardData;
  variant?: 'compact' | 'featured';
  effect?: 'tilt' | 'none';
  activeCategory?: string | null;
}

export function ProjectCard({
  project,
  variant = 'compact',
  effect = 'tilt',
  activeCategory = null,
}: ProjectCardProps) {
  const isFeatured = variant === 'featured';
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const tagStripRef = useRef<HTMLDivElement | null>(null);
  const [isSingleLineTitle, setIsSingleLineTitle] = useState(false);
  const [showTagOverflowIndicator, setShowTagOverflowIndicator] = useState(false);
  const canonicalLabels = getCanonicalLabels(project.tags);
  const formatTagLabel = (tag: string) => tag.replace(/-/g, ' ').trim().toLowerCase();
  const primaryCategoryTag =
    (activeCategory && canonicalLabels.includes(activeCategory) ? activeCategory : canonicalLabels[0]) ||
    formatTagLabel(project.tags[0] || 'project');
  const additionalTagLabels = project.tags
    .map(formatTagLabel)
    .filter((tag, index, tags) => tags.indexOf(tag) === index)
    .filter((tag) => tag !== primaryCategoryTag);
  const allCategoryTags = [primaryCategoryTag, ...additionalTagLabels];
  const tagOverflowMeasureKey = allCategoryTags.join('|');

  useEffect(() => {
    const measureTitleLines = () => {
      const el = titleRef.current;
      if (!el) return;
      const computed = window.getComputedStyle(el);
      let lineHeight = Number.parseFloat(computed.lineHeight);
      if (!Number.isFinite(lineHeight) || lineHeight <= 0) {
        const fontSize = Number.parseFloat(computed.fontSize);
        lineHeight = Number.isFinite(fontSize) && fontSize > 0 ? fontSize * 1.2 : 0;
      }
      if (lineHeight <= 0) return;
      const titleHeight = el.getBoundingClientRect().height;
      const lineCount = Math.round(titleHeight / lineHeight);
      setIsSingleLineTitle(lineCount <= 1);
    };

    measureTitleLines();

    const observer =
      typeof ResizeObserver !== 'undefined' && titleRef.current
        ? new ResizeObserver(measureTitleLines)
        : null;
    if (observer && titleRef.current) {
      observer.observe(titleRef.current);
    }

    window.addEventListener('resize', measureTitleLines);
    const fonts = (document as Document & { fonts?: { ready?: Promise<unknown> } }).fonts;
    fonts?.ready?.then(measureTitleLines).catch(() => undefined);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measureTitleLines);
    };
  }, [project.title]);

  useEffect(() => {
    const measureTagOverflow = () => {
      const el = tagStripRef.current;
      if (!el) {
        setShowTagOverflowIndicator(false);
        return;
      }
      setShowTagOverflowIndicator(el.scrollWidth - el.clientWidth > 1);
    };

    measureTagOverflow();

    const observer =
      typeof ResizeObserver !== 'undefined' && tagStripRef.current
        ? new ResizeObserver(measureTagOverflow)
        : null;
    if (observer && tagStripRef.current) {
      observer.observe(tagStripRef.current);
    }

    window.addEventListener('resize', measureTagOverflow);
    const fonts = (document as Document & { fonts?: { ready?: Promise<unknown> } }).fonts;
    fonts?.ready?.then(measureTagOverflow).catch(() => undefined);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measureTagOverflow);
    };
  }, [tagOverflowMeasureKey]);

  const card = (
      <motion.div
        variants={staggerItem}
        whileHover="hover"
        whileTap="tap"
        style={accentVars(project.accentColor)}
        className={`group cv-auto glass-morphism ambient-panel overflow-hidden transition-all duration-300 accent-glow border border-white/10 hover:border-white/20 will-change-transform ${
          isFeatured ? 'col-span-1 md:col-span-2' : ''
        }`}
      >
      <Link href={`/projects/${project.slug}`} className="block w-full text-left">
        <motion.div variants={hoverLift} className="relative overflow-hidden aspect-video">
          {project.heroImage ? (
            <BlurImage
              src={project.heroImage}
              alt={project.title}
              fill
              className="object-cover brightness-110 transition-transform duration-300 group-hover:scale-110"
              sizes={isFeatured ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/[0.02] flex items-center justify-center">
              <span className="text-4xl opacity-20 font-display font-bold accent-text">
                {project.title.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/12 group-hover:bg-black/20 transition-colors" />
        </motion.div>

        <div className="p-7 flex flex-col items-start">
          <h3
            ref={titleRef}
            className="w-full text-left text-lg leading-6 font-bold mb-2 group-hover:accent-text transition-colors font-display line-clamp-2"
          >
            {project.title}
          </h3>
          <MarkdownText
            content={project.shortDescription}
            paragraphClassName={`text-sm leading-6 text-gray-300 mb-4 text-left ${
              isSingleLineTitle ? 'line-clamp-3 min-h-[4.5rem]' : 'line-clamp-2 min-h-[3rem]'
            }`}
          />
          <div className="w-full self-start mb-5 text-left">
            <div className="flex w-full items-center gap-0.5 overflow-hidden whitespace-nowrap text-xs leading-tight">
              <span className="shrink-0 font-semibold text-slate-900 dark:text-white">Category:</span>
              <div
                ref={tagStripRef}
                className="min-w-0 flex flex-1 items-center gap-0.5 overflow-hidden"
                title={allCategoryTags.join(', ')}
              >
                {allCategoryTags.map((tag) => (
                  <span
                    key={tag}
                    className="shrink-0 max-w-[45%] truncate rounded-full px-3 py-1.5 accent-tag transition-all"
                    title={tag}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {showTagOverflowIndicator && (
                <span
                  className="shrink-0 accent-text"
                  aria-label={`${additionalTagLabels.length} additional tags`}
                  title={`more tags: ${additionalTagLabels.join(', ')}`}
                >
                  ...
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 accent-text transition-colors">
            <span className="text-xs font-semibold">View Project</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  );

  if (effect === 'none') {
    return card;
  }

  return <TiltCard>{card}</TiltCard>;
}
