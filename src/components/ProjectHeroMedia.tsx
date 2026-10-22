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
  const fitClass =
    mode === 'technical-diagram' || mode === 'portrait'
      ? 'object-contain p-4'
      : 'object-cover';
  const frameClass =
    mode === 'technical-diagram' || mode === 'portrait'
      ? 'bg-[var(--surface-paper)]'
      : 'bg-[var(--surface-muted)]';

  return (
    <div
      className={`relative w-full h-80 md:h-[430px] overflow-hidden ${frameClass} ${
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
