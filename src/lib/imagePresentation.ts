const WHITE_BG_VALUES = new Set(['white', 'light']);

export type ProjectImageMode =
  | 'hero'
  | 'technical-diagram'
  | 'full-width-evidence'
  | 'detail-crop'
  | 'portrait'
  | 'gallery'
  | 'video-still';

export type ProjectImageModeMap = Record<string, ProjectImageMode>;
const PROJECT_IMAGE_MODES = new Set<ProjectImageMode>([
  'hero',
  'technical-diagram',
  'full-width-evidence',
  'detail-crop',
  'portrait',
  'gallery',
  'video-still',
]);

function isProjectImageMode(value: string | null): value is ProjectImageMode {
  return value !== null && PROJECT_IMAGE_MODES.has(value as ProjectImageMode);
}

export function getProjectImageMode(
  src: string,
  modes: ProjectImageModeMap = {},
  fallback: ProjectImageMode = 'gallery'
): ProjectImageMode {
  try {
    const parsed = new URL(src, 'http://localhost');
    const mappedMode = modes[parsed.pathname];
    const queryMode = parsed.searchParams.get('mode');
    return mappedMode ?? (isProjectImageMode(queryMode) ? queryMode : fallback);
  } catch {
    return fallback;
  }
}

export function shouldUseWhiteImageBg(src?: string | null): boolean {
  if (!src) return false;

  try {
    const parsed = new URL(src, 'http://localhost');
    const bg = parsed.searchParams.get('bg');
    if (bg && WHITE_BG_VALUES.has(bg.toLowerCase())) {
      return true;
    }

    const whiteBg = parsed.searchParams.get('whiteBg');
    if (whiteBg && ['1', 'true', 'yes'].includes(whiteBg.toLowerCase())) {
      return true;
    }
  } catch {
    // Ignore parse failures and fallback to simple token matching.
  }

  return /(?:[?#&]|^)white-bg(?:[=&]|$)/i.test(src);
}
