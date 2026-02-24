'use client';

import { motion } from 'framer-motion';
import { Writing } from '@/lib/writing';
import { staggerItem } from '@/lib/animations';
import { uiButtonStyles, uiLinkStyles } from '@/lib/ui';

const typeLabels: Record<Writing['type'], string> = {
  research: 'Research Paper',
  technical: 'Technical Report',
  essay: 'Essay',
  project: 'Project',
};

const statusColors: Record<Writing['status'], string> = {
  published: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
  preprint: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
  'in-progress': 'bg-blue-500/20 text-blue-300 border-blue-400/30',
};

function formatProjectLabel(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function WritingCard({ writing }: { writing: Writing }) {
  const hasPdf = typeof writing.links.pdf === 'string' && writing.links.pdf.trim().length > 0;
  const hasLinks = Object.values(writing.links).some(
    (v) => typeof v === 'string' && v.trim().length > 0
  );
  const relatedProjects = (writing.relatedProjects || []).filter((slug) => slug.trim().length > 0);
  const hasPrimaryActions = hasPdf || relatedProjects.length > 0;
  const compactPrimaryActionClass = 'w-full min-w-0 justify-center sm:w-auto';
  const mobileFullRowActionClass = 'col-span-2 w-full min-w-0 justify-center sm:col-auto sm:w-auto';

  return (
    <motion.article
      id={writing.slug}
      variants={staggerItem}
      className="cv-auto glass-morphism p-6 md:p-8 border border-white/10 hover:border-cyan-400/20 transition-all duration-300 group scroll-mt-28"
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          {typeLabels[writing.type]}
        </span>
        <span
          className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[writing.status]}`}
        >
          {writing.status}
        </span>
      </div>

      <h3 className="text-xl md:text-2xl font-bold mb-3 font-display group-hover:text-cyan-400 transition-colors">
        {writing.title}
      </h3>

      <p className="text-gray-400 leading-relaxed mb-4 text-sm md:text-base">
        {writing.abstract}
      </p>

      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
        <span>{writing.date}</span>
        <span className="text-gray-600">-</span>
        {writing.tags.map((tag) => (
          <span key={tag} className="px-2 py-0.5 bg-white/5 rounded-full border border-white/10">
            {tag}
          </span>
        ))}
      </div>

      {hasPrimaryActions && (
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
            {hasPdf && (
              <>
                <a
                  href={writing.links.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${uiButtonStyles.writingOutline} ${compactPrimaryActionClass}`}
                >
                  View Writing
                </a>
                <a
                  href={writing.links.pdf}
                  download
                  className={`${uiButtonStyles.writingPrimary} ${compactPrimaryActionClass}`}
                >
                  Download Writing
                </a>
              </>
            )}
            {relatedProjects.map((projectSlug) => (
              <a
                key={projectSlug}
                href={`/projects/${projectSlug}`}
                className={`${uiButtonStyles.writingOutline} ${mobileFullRowActionClass}`}
              >
                View Project: {formatProjectLabel(projectSlug)}
              </a>
            ))}
          </div>
        </div>
      )}

      {hasLinks && (
        <div className="flex flex-wrap gap-3 mt-3">
          {writing.links.arxiv && (
            <a
              href={writing.links.arxiv}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-xs font-semibold ${uiLinkStyles.accent}`}
            >
              arXiv -&gt;
            </a>
          )}
          {writing.links.doi && (
            <a
              href={writing.links.doi}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-xs font-semibold ${uiLinkStyles.accent}`}
            >
              DOI -&gt;
            </a>
          )}
          {writing.links.external && (
            <a
              href={writing.links.external}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-xs font-semibold ${uiLinkStyles.accent}`}
            >
              View -&gt;
            </a>
          )}
        </div>
      )}
    </motion.article>
  );
}
