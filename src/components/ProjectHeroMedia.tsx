'use client';

import { BlurImage } from '@/components/BlurImage';

interface ProjectHeroMediaProps {
  media: string;
  alt: string;
  priority?: boolean;
  withTopOffset?: boolean;
  onOpen?: (src: string) => void;
}

export function ProjectHeroMedia({
  media,
  alt,
  priority = false,
  withTopOffset = true,
  onOpen,
}: ProjectHeroMediaProps) {
  const isVideo = /\.(mp4|mov|webm)$/i.test(media);

  return (
    <div
      className={`relative w-full h-80 md:h-[430px] overflow-hidden ${
        withTopOffset ? 'mt-[var(--nav-height)]' : ''
      }`}
    >
      {isVideo ? (
        <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
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
            className="object-cover"
            priority={priority}
          />
        </button>
      ) : (
        <BlurImage
          src={media}
          alt={alt}
          fill
          className="object-cover"
          priority={priority}
        />
      )}
    </div>
  );
}
