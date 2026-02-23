interface AccentProjectLike {
  slug: string;
  accentColor?: string;
}

const GOLDEN_ANGLE_DEG = 137.50776405003785;
const DEFAULT_MIN_LAB_DISTANCE = 22;
const MAX_COLOR_ATTEMPTS = 160;

type Rgb = { r: number; g: number; b: number };
type Lab = { l: number; a: number; b: number };

function fnv1aHash(value: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function normalizeHexColor(input?: string): string | null {
  if (!input) return null;
  const hex = input.trim();
  const shortMatch = hex.match(/^#([0-9a-fA-F]{3})$/);
  if (shortMatch) {
    const [r, g, b] = shortMatch[1].split('');
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }

  const longMatch = hex.match(/^#([0-9a-fA-F]{6})$/);
  if (longMatch) return `#${longMatch[1].toLowerCase()}`;

  return null;
}

function hexToRgb(hex: string): Rgb {
  return {
    r: Number.parseInt(hex.slice(1, 3), 16),
    g: Number.parseInt(hex.slice(3, 5), 16),
    b: Number.parseInt(hex.slice(5, 7), 16),
  };
}

function srgbToLinear(channel: number): number {
  const c = channel / 255;
  if (c <= 0.04045) return c / 12.92;
  return ((c + 0.055) / 1.055) ** 2.4;
}

function rgbToLab({ r, g, b }: Rgb): Lab {
  const rl = srgbToLinear(r);
  const gl = srgbToLinear(g);
  const bl = srgbToLinear(b);

  // sRGB D65
  const x = rl * 0.4124564 + gl * 0.3575761 + bl * 0.1804375;
  const y = rl * 0.2126729 + gl * 0.7151522 + bl * 0.072175;
  const z = rl * 0.0193339 + gl * 0.119192 + bl * 0.9503041;

  const xr = x / 0.95047;
  const yr = y / 1.0;
  const zr = z / 1.08883;

  const f = (t: number) =>
    t > 0.008856451679035631 ? Math.cbrt(t) : (903.2962962962963 * t + 16) / 116;

  const fx = f(xr);
  const fy = f(yr);
  const fz = f(zr);

  return {
    l: 116 * fy - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz),
  };
}

function labDistance(a: Lab, b: Lab): number {
  const dl = a.l - b.l;
  const da = a.a - b.a;
  const db = a.b - b.b;
  return Math.sqrt(dl * dl + da * da + db * db);
}

function hslToHex(hDeg: number, sPct: number, lPct: number): string {
  const h = ((hDeg % 360) + 360) % 360 / 360;
  const s = Math.max(0, Math.min(1, sPct / 100));
  const l = Math.max(0, Math.min(1, lPct / 100));

  const hueToRgb = (p: number, q: number, t: number): number => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };

  let r: number;
  let g: number;
  let b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hueToRgb(p, q, h + 1 / 3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1 / 3);
  }

  const toHex = (value: number) =>
    Math.round(value * 255)
      .toString(16)
      .padStart(2, '0');

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function generateCandidateAccent(slug: string, attempt: number): string {
  const baseSeed = fnv1aHash(slug);
  const rng = mulberry32(baseSeed ^ Math.imul(attempt + 1, 0x9e3779b1));
  const hueJitter = (rng() - 0.5) * 22;
  const hue = (baseSeed % 360) + attempt * GOLDEN_ANGLE_DEG + hueJitter;
  const saturation = 62 + rng() * 20; // vivid but not neon
  const lightness = 52 + rng() * 14; // balanced for dark + light themes
  return hslToHex(hue, saturation, lightness);
}

function isDistinctEnough(
  candidateHex: string,
  usedHexes: string[],
  usedLabs: Lab[],
  minDistance: number
): boolean {
  if (usedHexes.includes(candidateHex)) return false;
  if (usedLabs.length === 0) return true;

  const candidateLab = rgbToLab(hexToRgb(candidateHex));
  for (const lab of usedLabs) {
    if (labDistance(candidateLab, lab) < minDistance) return false;
  }
  return true;
}

function pickDistinctAccent(slug: string, usedHexes: string[], usedLabs: Lab[]): string {
  let minDistance = DEFAULT_MIN_LAB_DISTANCE;

  for (let attempt = 0; attempt < MAX_COLOR_ATTEMPTS; attempt += 1) {
    // Gradually relax the threshold if the palette becomes crowded.
    if (attempt > 0 && attempt % 40 === 0) {
      minDistance = Math.max(12, minDistance - 4);
    }
    const candidate = generateCandidateAccent(slug, attempt);
    if (isDistinctEnough(candidate, usedHexes, usedLabs, minDistance)) {
      return candidate;
    }
  }

  // Final fallback: exact uniqueness only (still deterministic).
  for (let attempt = MAX_COLOR_ATTEMPTS; attempt < MAX_COLOR_ATTEMPTS + 400; attempt += 1) {
    const candidate = generateCandidateAccent(slug, attempt);
    if (!usedHexes.includes(candidate)) return candidate;
  }

  // Practically unreachable with current project counts.
  return generateCandidateAccent(slug, MAX_COLOR_ATTEMPTS + 401);
}

export function ensureUniqueProjectAccentColors<T extends AccentProjectLike>(
  projects: T[]
): Map<string, string> {
  const usedHexes: string[] = [];
  const usedLabs: Lab[] = [];
  const colorBySlug = new Map<string, string>();

  const sortedProjects = [...projects].sort((a, b) => a.slug.localeCompare(b.slug));

  for (const project of sortedProjects) {
    const normalizedExplicit = normalizeHexColor(project.accentColor);
    const chosen =
      normalizedExplicit &&
      isDistinctEnough(normalizedExplicit, usedHexes, usedLabs, DEFAULT_MIN_LAB_DISTANCE)
        ? normalizedExplicit
        : pickDistinctAccent(project.slug, usedHexes, usedLabs);

    usedHexes.push(chosen);
    usedLabs.push(rgbToLab(hexToRgb(chosen)));
    colorBySlug.set(project.slug, chosen);
  }

  return colorBySlug;
}

