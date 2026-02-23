import 'server-only';

import { promises as fs } from 'fs';
import path from 'path';
import type { ComponentType } from 'react';
import { getYouTubeVideoId } from './media';
import { ensureUniqueProjectAccentColors } from './projectAccentColors';
import { PROJECT_DISPLAY_CONFIG } from '@/content/project-display';

export interface ProjectSection {
  title: string;
  insight: string;
  description: string;
  media?: string;
  caption?: string;
  mediaItems?: ProjectSectionMedia[];
  layout?: 'image-left' | 'image-right';
}

export interface ProjectSectionMedia {
  src: string;
  caption?: string;
}

export interface ProjectSubpage {
  id: string;
  slug: string;
  title: string;
  description: string;
  heroMedia?: string;
  sections?: ProjectSection[];
  order: number;
}

export interface ProjectMetric {
  label: string;
  value: string;
  icon?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  tags: string[];
  heroImage: string;
  gallery: string[];
  videoDemo?: string;
  technologies: string[];
  metrics?: ProjectMetric[];
  links: {
    github?: string;
    paper?: string;
    demo?: string;
    external?: string;
    documentation?: string;
    slides?: string;
    videos?: string;
    teamsite?: string;
    datarepo?: string;
    competition?: string;
    diagram?: string;
    channel?: string;
    postprocessor?: string;
    mpc?: string;
    notebooks?: string;
  };
  dates: {
    start: string;
    end: string;
  };
  featured: boolean;
  draft?: boolean;
  order: number;
  accentColor?: string;
  sections?: ProjectSection[];
  subpages?: ProjectSubpage[];
}

export type ProjectCardData = Pick<
  Project,
  'id' | 'slug' | 'title' | 'shortDescription' | 'tags' | 'heroImage' | 'featured' | 'order' | 'accentColor'
>;

type ProjectMDXModule = {
  default: ComponentType<Record<string, unknown>>;
  project?: Partial<Project>;
};

type ProjectSubpageMDXModule = {
  default: ComponentType<Record<string, unknown>>;
  meta?: Partial<ProjectSubpage> & { heroMedia?: string };
};

type NarrativeParseResult = {
  overview: string;
  sections: ProjectSection[];
};

type ProjectQueryOptions = {
  includeDrafts?: boolean;
};

const PROJECTS_ROOT = path.join(process.cwd(), 'src', 'content', 'projects');

let cache: {
  bySlug: Map<string, Project>;
  projectComponents: Map<string, ComponentType<Record<string, unknown>>>;
  subpageComponents: Map<string, Map<string, ComponentType<Record<string, unknown>>>>;
} | null = null;

function toProjectCardData(project: Project): ProjectCardData {
  const cardSummary =
    project.shortDescription ||
    deriveCardSummary(
      project.fullDescription ||
        project.sections?.[0]?.description ||
        project.sections?.[0]?.insight ||
        ''
    );

  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    shortDescription: cardSummary,
    tags: project.tags,
    heroImage: project.heroImage,
    featured: project.featured,
    order: project.order,
    accentColor: project.accentColor,
  };
}

function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ');
}

function extractBodyAfterNamedExport(
  source: string,
  exportName: 'project' | 'meta'
): string {
  const marker = `export const ${exportName} =`;
  const markerIndex = source.indexOf(marker);
  if (markerIndex < 0) return source.trim();

  const startObjIndex = source.indexOf('{', markerIndex);
  if (startObjIndex < 0) return source.trim();

  let depth = 0;
  let inString = false;
  let quote = '';
  let escaped = false;
  let endObjIndex = -1;

  for (let i = startObjIndex; i < source.length; i += 1) {
    const ch = source[i];

    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === '\\') {
        escaped = true;
        continue;
      }
      if (ch === quote) {
        inString = false;
        quote = '';
      }
      continue;
    }

    if (ch === '"' || ch === '\'') {
      inString = true;
      quote = ch;
      continue;
    }

    if (ch === '{') depth += 1;
    if (ch === '}') {
      depth -= 1;
      if (depth === 0) {
        endObjIndex = i;
        break;
      }
    }
  }

  if (endObjIndex < 0) return source.trim();
  return source.slice(endObjIndex + 1).trim();
}

function extractImageSource(line: string): string | null {
  const directImageMatch = line.match(/^!\[[^\]]*]\(([^)]+)\)$/);
  if (directImageMatch?.[1]) {
    return directImageMatch[1].trim();
  }

  const linkedImageMatch = line.match(/^\[!\[[^\]]*]\(([^)]+)\)\]\([^)]+\)$/);
  if (linkedImageMatch?.[1]) {
    return linkedImageMatch[1].trim();
  }

  return null;
}

function extractYouTubeSource(line: string): string | null {
  const bareUrl = line.match(/^(https?:\/\/\S+)$/);
  if (bareUrl?.[1] && getYouTubeVideoId(bareUrl[1])) {
    return bareUrl[1];
  }

  const markdownLink = line.match(/^\[[^\]]*]\(([^)]+)\)$/);
  if (markdownLink?.[1] && getYouTubeVideoId(markdownLink[1])) {
    return markdownLink[1];
  }

  return null;
}

function extractMediaSource(line: string): string | null {
  return extractImageSource(line) || extractYouTubeSource(line);
}

function parseSectionsFromBody(body: string): NarrativeParseResult {
  const normalized = body.replace(/\r\n/g, '\n').trim();
  if (!normalized) {
    return { overview: '', sections: [] };
  }

  const firstSectionIndex = normalized.search(/^##\s+/m);
  const overview = firstSectionIndex >= 0 ? normalized.slice(0, firstSectionIndex).trim() : normalized;
  const sections: ProjectSection[] = [];
  if (firstSectionIndex < 0) {
    return { overview, sections };
  }

  const sectionSource = normalized.slice(firstSectionIndex);
  const headingRegex = /^##\s+(.+)$/gm;
  const headingMatches = Array.from(sectionSource.matchAll(headingRegex));

  for (let index = 0; index < headingMatches.length; index += 1) {
    const heading = headingMatches[index];
    const title = (heading[1] || '').trim();
    const headingStart = heading.index ?? 0;
    const headingLineEnd = sectionSource.indexOf('\n', headingStart);
    const contentStart = headingLineEnd >= 0 ? headingLineEnd + 1 : sectionSource.length;
    const nextHeadingStart =
      index + 1 < headingMatches.length
        ? (headingMatches[index + 1].index ?? sectionSource.length)
        : sectionSource.length;
    const block = sectionSource.slice(contentStart, nextHeadingStart).trim();
    const lines = block ? block.split('\n') : [];

    let insight = '';
    const firstContentLineIndex = lines.findIndex((line) => line.trim().length > 0);
    if (firstContentLineIndex >= 0) {
      const line = lines[firstContentLineIndex].trim();
      const inlineInsightMatch = line.match(/^(?:\*\*)?\s*Insight\s*:(?:\*\*)?\s*(.*)$/i);
      if (inlineInsightMatch) {
        insight = inlineInsightMatch[1].trim();
        lines.splice(firstContentLineIndex, 1);
        if (!insight) {
          const nextContentLineIndex = lines.findIndex((entry) => entry.trim().length > 0);
          if (nextContentLineIndex >= 0) {
            insight = lines[nextContentLineIndex].trim();
            lines.splice(nextContentLineIndex, 1);
          }
        }
      }
    }

    const mediaItems: ProjectSectionMedia[] = [];
    for (let i = 0; i < lines.length; ) {
      const trimmed = lines[i].trim();
      const media = extractMediaSource(trimmed);
      if (!media) {
        i += 1;
        continue;
      }

      let caption: string | undefined;
      let nextNonEmptyIndex = i + 1;
      while (nextNonEmptyIndex < lines.length && lines[nextNonEmptyIndex].trim() === '') {
        nextNonEmptyIndex += 1;
      }
      if (nextNonEmptyIndex < lines.length) {
        const captionMatch = lines[nextNonEmptyIndex].trim().match(/^\*([^*].*?)\*$/);
        if (captionMatch) {
          caption = captionMatch[1].trim();
        }
      }

      lines.splice(i, 1);
      if (caption && nextNonEmptyIndex > i) {
        lines.splice(nextNonEmptyIndex - 1, 1);
      }

      mediaItems.push(caption ? { src: media, caption } : { src: media });
    }

    // Backward-compatible fallback: if no inline media caption was found,
    // treat a trailing italic line as caption for the last media item in section.
    if (mediaItems.length > 0 && !mediaItems.some((item) => item.caption)) {
      for (let i = lines.length - 1; i >= 0; i -= 1) {
        const line = lines[i].trim();
        if (!line) continue;
        const captionMatch = line.match(/^\*([^*].*?)\*$/);
        if (captionMatch) {
          mediaItems[mediaItems.length - 1].caption = captionMatch[1].trim();
          lines.splice(i, 1);
        }
        break;
      }
    }

    const description = lines.join('\n').trim();

    const section: ProjectSection = {
      title,
      insight,
      description,
      layout: index % 2 === 0 ? 'image-right' : 'image-left',
    };
    if (mediaItems.length > 0) {
      section.mediaItems = mediaItems;
      section.media = mediaItems[0].src;
      if (mediaItems[0].caption) {
        section.caption = mediaItems[0].caption;
      }
    }
    sections.push(section);
  }

  return { overview, sections };
}

function stripMarkdownForSummary(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\$([^$]+)\$/g, '$1')
    .replace(/^>\s*/gm, '')
    .replace(/[*_~#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function deriveCardSummary(markdown: string): string {
  if (!markdown) return '';
  const firstParagraph =
    markdown
      .split(/\n\s*\n/)
      .map((chunk) => chunk.trim())
      .find((chunk) => chunk.length > 0) || '';
  const plain = stripMarkdownForSummary(firstParagraph);
  const maxLength = 160;
  if (plain.length <= maxLength) return plain;
  const truncated = plain.slice(0, maxLength);
  return `${truncated.replace(/\s+\S*$/, '').trim()}...`;
}

async function parseProjectNarrative(
  slug: string,
  entry: 'index' | 'content'
): Promise<NarrativeParseResult> {
  const filepath = path.join(PROJECTS_ROOT, slug, `${entry}.mdx`);
  const source = (await fs.readFile(filepath, 'utf8')).replace(/^\uFEFF/, '');
  const body = extractBodyAfterNamedExport(source, 'project');
  return parseSectionsFromBody(body);
}

async function parseSubpageNarrative(
  slug: string,
  subpageSlug: string
): Promise<NarrativeParseResult> {
  const filepath = path.join(PROJECTS_ROOT, slug, 'subpages', `${subpageSlug}.mdx`);
  const source = (await fs.readFile(filepath, 'utf8')).replace(/^\uFEFF/, '');
  const body = extractBodyAfterNamedExport(source, 'meta');
  return parseSectionsFromBody(body);
}

function normalizeProject(
  raw: Partial<Project> | undefined,
  slug: string,
  narrative: NarrativeParseResult
): Project {
  const displayConfig = PROJECT_DISPLAY_CONFIG[slug];
  const sections =
    narrative.sections.length > 0 ? narrative.sections : (raw?.sections || []);
  const fullDescription = narrative.overview || raw?.fullDescription || '';
  const shortDescription = raw?.shortDescription?.trim() || '';

  return {
    id: raw?.id || slug,
    slug,
    title: raw?.title || slugToTitle(slug),
    shortDescription,
    fullDescription,
    tags: raw?.tags || [],
    heroImage: raw?.heroImage || '',
    gallery: raw?.gallery || [],
    videoDemo: raw?.videoDemo,
    technologies: raw?.technologies || [],
    metrics: raw?.metrics,
    links: raw?.links || {},
    dates: raw?.dates || { start: '', end: '' },
    featured: displayConfig?.featured ?? raw?.featured ?? false,
    draft: raw?.draft ?? false,
    order: displayConfig?.order ?? raw?.order ?? Number.MAX_SAFE_INTEGER,
    accentColor: raw?.accentColor,
    sections,
    subpages: [],
  };
}

function normalizeSubpage(
  raw: (Partial<ProjectSubpage> & { heroMedia?: string }) | undefined,
  slug: string,
  narrative: NarrativeParseResult
): ProjectSubpage {
  const sections =
    narrative.sections.length > 0 ? narrative.sections : (raw?.sections || []);
  const description = narrative.overview || raw?.description || '';

  return {
    id: raw?.id || slug,
    slug,
    title: raw?.title || slugToTitle(slug),
    description,
    heroMedia:
      raw?.heroMedia ||
      sections.find((section) => section.mediaItems && section.mediaItems.length > 0)?.mediaItems?.[0]
        ?.src ||
      sections.find((section) => section.media)?.media,
    sections,
    order: raw?.order ?? Number.MAX_SAFE_INTEGER,
  };
}

async function fileExists(filepath: string): Promise<boolean> {
  try {
    await fs.access(filepath);
    return true;
  } catch {
    return false;
  }
}

async function resolveProjectEntry(slug: string): Promise<'index' | 'content' | null> {
  const indexPath = path.join(PROJECTS_ROOT, slug, 'index.mdx');
  const contentPath = path.join(PROJECTS_ROOT, slug, 'content.mdx');
  if (await fileExists(indexPath)) return 'index';
  if (await fileExists(contentPath)) return 'content';
  return null;
}

async function loadProjectModule(
  slug: string,
  entry: 'index' | 'content'
): Promise<ProjectMDXModule> {
  return (await import(`../content/projects/${slug}/${entry}.mdx`)) as ProjectMDXModule;
}

async function loadSubpageModule(
  projectSlug: string,
  subpageSlug: string
): Promise<ProjectSubpageMDXModule> {
  return (await import(
    `../content/projects/${projectSlug}/subpages/${subpageSlug}.mdx`
  )) as ProjectSubpageMDXModule;
}

async function hydrateCache() {
  if (cache) return cache;

  const bySlug = new Map<string, Project>();
  const projectComponents = new Map<string, ComponentType<Record<string, unknown>>>();
  const subpageComponents = new Map<string, Map<string, ComponentType<Record<string, unknown>>>>();

  const entries = await fs.readdir(PROJECTS_ROOT, { withFileTypes: true });
  const projectSlugs = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);

  await Promise.all(
    projectSlugs.map(async (slug) => {
      const entry = await resolveProjectEntry(slug);
      if (!entry) return;

      const [projectModule, narrative] = await Promise.all([
        loadProjectModule(slug, entry),
        parseProjectNarrative(slug, entry),
      ]);
      const project = normalizeProject(projectModule.project, slug, narrative);
      projectComponents.set(slug, projectModule.default);

      const subpagesDir = path.join(PROJECTS_ROOT, slug, 'subpages');
      const hasSubpagesDir = await fileExists(subpagesDir);
      const subpages: ProjectSubpage[] = [];
      const subpageMap = new Map<string, ComponentType<Record<string, unknown>>>();

      if (hasSubpagesDir) {
        const subpageEntries = await fs.readdir(subpagesDir, { withFileTypes: true });
        const subpageSlugs = subpageEntries
          .filter((entry) => entry.isFile() && entry.name.endsWith('.mdx'))
          .map((entry) => entry.name.replace(/\.mdx$/, ''));

        await Promise.all(
          subpageSlugs.map(async (subpageSlug) => {
            const [subpageModule, narrative] = await Promise.all([
              loadSubpageModule(slug, subpageSlug),
              parseSubpageNarrative(slug, subpageSlug),
            ]);
            const subpage = normalizeSubpage(subpageModule.meta, subpageSlug, narrative);
            subpages.push(subpage);
            subpageMap.set(subpageSlug, subpageModule.default);
          })
        );
      }

      project.subpages = subpages.sort((a, b) => a.order - b.order);
      if (subpageMap.size > 0) {
        subpageComponents.set(slug, subpageMap);
      }

      bySlug.set(slug, project);
    })
  );

  const accentColors = ensureUniqueProjectAccentColors(
    Array.from(bySlug.values()).map((project) => ({
      slug: project.slug,
      accentColor: project.accentColor,
    }))
  );
  accentColors.forEach((accentColor, slug) => {
    const project = bySlug.get(slug);
    if (project) {
      project.accentColor = accentColor;
    }
  });

  cache = { bySlug, projectComponents, subpageComponents };
  return cache;
}

function shouldIncludeDraftProjects(): boolean {
  const override = process.env.INCLUDE_DRAFT_PROJECTS;
  if (override === 'true') return true;
  if (override === 'false') return false;
  return false;
}

function resolveIncludeDrafts(options?: ProjectQueryOptions): boolean {
  return options?.includeDrafts ?? shouldIncludeDraftProjects();
}

function isProjectVisible(project: Project, includeDrafts: boolean): boolean {
  return includeDrafts || !project.draft;
}

export async function getProjects(options?: ProjectQueryOptions): Promise<Project[]> {
  const includeDrafts = resolveIncludeDrafts(options);
  const data = await hydrateCache();
  return Array.from(data.bySlug.values())
    .filter((project) => isProjectVisible(project, includeDrafts))
    .sort((a, b) => {
      if (a.featured !== b.featured) {
        return a.featured ? -1 : 1;
      }
      return a.order - b.order;
    });
}

export async function getProjectCards(options?: ProjectQueryOptions): Promise<ProjectCardData[]> {
  const projects = await getProjects(options);
  return projects.map(toProjectCardData);
}

export async function getProjectBySlug(
  slug: string,
  options?: ProjectQueryOptions
): Promise<Project | undefined> {
  const includeDrafts = resolveIncludeDrafts(options);
  const data = await hydrateCache();
  const project = data.bySlug.get(slug);
  if (!project || !isProjectVisible(project, includeDrafts)) return undefined;
  return project;
}

export async function getFeaturedProjects(
  limit: number = 3,
  options?: ProjectQueryOptions
): Promise<Project[]> {
  const projects = await getProjects(options);
  return projects.filter((p) => p.featured).slice(0, limit);
}

export async function getFeaturedProjectCards(
  limit: number = 3,
  options?: ProjectQueryOptions
): Promise<ProjectCardData[]> {
  const projects = await getProjects(options);
  return projects.filter((p) => p.featured).slice(0, limit).map(toProjectCardData);
}

export async function getProjectSlugs(options?: ProjectQueryOptions): Promise<string[]> {
  const projects = await getProjects(options);
  return projects.map((p) => p.slug);
}

export async function getProjectSubpage(
  projectSlug: string,
  subpageSlug: string,
  options?: ProjectQueryOptions
): Promise<ProjectSubpage | undefined> {
  const project = await getProjectBySlug(projectSlug, options);
  return project?.subpages?.find((sp) => sp.slug === subpageSlug);
}

export async function getSubpageParamsList(
  options?: ProjectQueryOptions
): Promise<Array<{ slug: string; subpage: string }>> {
  const projects = await getProjects(options);
  return projects.flatMap((project) =>
    (project.subpages || []).map((subpage) => ({
      slug: project.slug,
      subpage: subpage.slug,
    }))
  );
}

export async function getProjectMDXContent(
  slug: string,
  options?: ProjectQueryOptions
): Promise<ComponentType<Record<string, unknown>> | null> {
  const project = await getProjectBySlug(slug, options);
  if (!project) return null;
  const data = await hydrateCache();
  return data.projectComponents.get(slug) || null;
}

export async function getProjectSubpageMDXContent(
  projectSlug: string,
  subpageSlug: string,
  options?: ProjectQueryOptions
): Promise<ComponentType<Record<string, unknown>> | null> {
  const project = await getProjectBySlug(projectSlug, options);
  if (!project) return null;
  const data = await hydrateCache();
  const projectSubpages = data.subpageComponents.get(projectSlug);
  if (!projectSubpages) return null;
  return projectSubpages.get(subpageSlug) || null;
}
