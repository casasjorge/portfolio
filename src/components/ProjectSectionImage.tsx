'use client';

import { useState } from 'react';
import { MarkdownText } from '@/components/MarkdownText';
import { shouldUseWhiteImageBg, type ProjectImageMode } from '@/lib/imagePresentation';
import {
  getYouTubeEmbedUrl,
  getYouTubeThumbnailUrl,
  getYouTubeVideoId,
  isVideoMedia,
} from '@/lib/media';
import { uiTextStyles } from '@/lib/ui';

interface ProjectSectionImageProps {
  src: string;
  alt: string;
  caption?: string;
  onOpen?: (src: string) => void;
  mode?: ProjectImageMode;
}

export function ProjectSectionImage({
  src,
  alt,
  caption,
  onOpen,
  mode = 'full-width-evidence',
}: ProjectSectionImageProps) {
  const [isYouTubePlaying, setIsYouTubePlaying] = useState(false);
  const isVideo = isVideoMedia(src);
  const youTubeId = getYouTubeVideoId(src);
  const hasYouTube = Boolean(youTubeId);
  const useWhiteBg = shouldUseWhiteImageBg(src);
  const isTechnicalImage = mode === 'technical-diagram';
  const isDetailCrop = mode === 'detail-crop';
  const isPortrait = mode === 'portrait';
  const imageFrameClass = isTechnicalImage || mode === 'full-width-evidence'
    ? 'rounded-[1.25rem] border border-[var(--border-subtle)] bg-[var(--surface-paper)] p-2'
    : 'rounded-[1.25rem]';
  const imageClass = isDetailCrop
    ? 'block h-full w-full object-cover'
    : isPortrait
      ? 'block h-auto max-h-[42rem] w-auto max-w-full object-contain mx-auto'
      : mode === 'video-still'
        ? 'block aspect-video h-auto w-full object-cover'
        : 'block h-auto w-full object-contain';

  return (
    <div className="space-y-3 w-full flex flex-col items-center">
      {hasYouTube ? (
        isYouTubePlaying && youTubeId ? (
          <div className="relative w-full overflow-hidden rounded-[1.25rem] aspect-video bg-black">
            <iframe
              className="absolute inset-0 h-full w-full"
              src={getYouTubeEmbedUrl(youTubeId)}
              title={alt}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsYouTubePlaying(true)}
            className="relative block w-full text-left rounded-[1.25rem] overflow-hidden cursor-pointer group"
            aria-label={`Play video: ${alt}`}
          >
            {youTubeId && (
              <img
                src={getYouTubeThumbnailUrl(youTubeId)}
                alt={alt}
                loading="lazy"
                className="block w-full h-auto aspect-video object-cover"
              />
            )}
            <span className="absolute inset-0 bg-black/35 group-hover:bg-black/25 transition-colors" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/90 text-slate-900 px-4 py-2 text-sm font-semibold">
                <span aria-hidden="true">{'>'}</span>
                Play on YouTube
              </span>
            </span>
          </button>
        )
      ) : isVideo ? (
        <video
          className={`block w-full h-auto rounded-[1.25rem] bg-black ${mode === 'video-still' ? 'aspect-video object-contain' : ''}`}
          controls
          playsInline
        >
          <source src={src} />
          Your browser does not support the video tag.
        </video>
      ) : (
        <button
          type="button"
          onClick={() => onOpen?.(src)}
          disabled={!onOpen}
          className={`block w-full text-left cursor-zoom-in disabled:cursor-default ${isDetailCrop ? 'aspect-[4/3] overflow-hidden' : ''} ${imageFrameClass}`}
          aria-label={`Open image: ${alt}`}
        >
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className={`${imageClass} ${useWhiteBg ? 'bg-white' : ''}`.trim()}
          />
        </button>
      )}
      {caption && (
        <MarkdownText
          content={caption}
          paragraphClassName={`${uiTextStyles.caption} mb-0`}
        />
      )}
    </div>
  );
}
