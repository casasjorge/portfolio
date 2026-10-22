'use client';

import { BlurImage } from '@/components/BlurImage';
import type { ProjectImageMode } from '@/lib/imagePresentation';
import { useReducedMotion } from 'framer-motion';

interface ProjectHeroMediaProps {
  media: string;
  alt: string;
  priority?: boolean;
  withTopOffset?: boolean;
  onOpen?: (src: string) => void;
  mode?: ProjectImageMode;
}

export function ProjectHeroMedia({
  media,
  alt,
  priority = false,
  withTopOffset = true,
  onOpen,
  mode = 'hero',
}: ProjectHeroMediaProps) {
  const prefersReducedMotion = useReducedMotion();
  const isVideo = /\.(mp4|mov|webm)$/i.test(media);
  const isTechnical = mode === 'technical-diagram';
  const isPortrait = mode === 'portrait';
  const fitClass =
    isTechnical || isPortrait
      ? 'object-contain'
      : 'object-cover';
  const frameClass =
    isTechnical || isPortrait
      ? 'bg-[var(--surface-paper)]'
      : 'bg-[var(--surface-muted)]';
  const sizeClass = isTechnical
    ? 'mx-auto aspect-video w-full max-w-6xl'
    : isPortrait
      ? 'mx-auto aspect-[4/5] w-full max-w-3xl'
      : 'h-80 w-full md:h-[430px]';

  return (
    <div
      className={`relative overflow-hidden ${sizeClass} ${frameClass} ${
        withTopOffset ? 'mt-[var(--nav-height)]' : ''
      }`}
    >
      {isVideo ? (
        <video
          className="w-full h-full object-cover"
          autoPlay={!prefersReducedMotion}
          loop={!prefersReducedMotion}
          controls={prefersReducedMotion ?? false}
          muted
          playsInline
        >
          <source src={media} />
          Your browser does not support the video tag.
        </video>
      ) : onOpen ? (
        <button
          type="button"
          onClick={() => onOpen(media)}
          className="relative block h-full w-full cursor-zoom-in"
          aria-label={`Open ${alt} hero image`}
        >
          <BlurImage
            src={media}
            alt={alt}
            fill
            className={fitClass}
            priority={priority}
          />
        </button>
      ) : (
        <BlurImage
          src={media}
          alt={alt}
          fill
          className={fitClass}
          priority={priority}
        />
      )}
    </div>
  );
}
