export const uiLinkStyles = {
  nav: 'text-sm font-medium text-[var(--text-primary)] hover:text-[var(--accent-copper)] transition-colors',
  navResume:
    'ml-4 whitespace-nowrap px-4 py-2 text-xs font-semibold tracking-[0.16em] uppercase border border-[var(--accent-copper)] text-[var(--accent-copper)] rounded-full hover:bg-[var(--surface-muted)] transition-colors',
  navResumeMobile:
    'text-sm font-medium text-[var(--accent-copper)] hover:underline underline-offset-4 transition-colors',
  footer:
    'text-sm text-[var(--text-secondary)] hover:text-[var(--accent-copper)] transition-colors',
  accent:
    'text-[var(--accent-copper)] hover:underline underline-offset-4 transition-colors',
} as const;

const markdownBody = 'text-[1.02rem] leading-8 text-[var(--text-primary)]';
const subpageTabBase =
  'inline-flex h-12 items-center px-4 whitespace-nowrap text-sm font-medium border-b-2 transition-colors';

export const uiTextStyles = {
  body: markdownBody,
  bodyParagraph: `${markdownBody} mb-4`,
  bodyList: `list-disc list-inside ${markdownBody} mb-4 space-y-1`,
  bodyListOrdered: `list-decimal list-inside ${markdownBody} mb-4 space-y-1`,
  bodyListItem: markdownBody,
  lead: 'text-lg leading-8 text-[var(--text-primary)]',
  insight: 'text-lg leading-8 font-semibold text-[var(--accent-copper)]',
  caption: 'text-sm text-[var(--text-secondary)] italic text-center',
  strong: 'font-semibold text-slate-900 dark:text-white',
  emphasis: 'italic text-[var(--accent-copper)]',
  link: 'text-[var(--accent-copper)] hover:opacity-80 underline underline-offset-2 transition-colors',
  blockquote: 'border-l-2 border-[var(--accent-copper)] pl-4 my-6 italic text-[var(--text-secondary)]',
} as const;

export const uiSubpageNavStyles = {
  wrapper:
    'relative z-40 border-b border-[var(--border-subtle)] bg-[var(--surface-paper)]',
  measureRow:
    'hidden lg:flex absolute inset-x-0 top-0 h-12 items-center gap-1 px-6 xl:px-10 whitespace-nowrap overflow-hidden invisible pointer-events-none',
  measureItem: `${subpageTabBase}`,
  tabsRow: 'hidden lg:flex w-full items-center justify-center gap-1 px-6 xl:px-10',
  tab: `${subpageTabBase} border-transparent text-slate-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200 hover:border-slate-300 dark:hover:border-white/20`,
  tabActive: `${subpageTabBase} text-[var(--accent-copper)] border-[var(--accent-copper)]`,
  dropdownTrigger:
    'w-full inline-flex items-center justify-between gap-2 rounded-full border border-[var(--accent-copper)] bg-[var(--surface-paper)] px-4 py-2 text-sm font-medium text-[var(--accent-copper)] transition-colors hover:bg-[var(--surface-muted)]',
  dropdownPanel:
    'absolute top-full left-0 right-0 z-50 mt-2 min-w-[14rem] glass-morphism p-2',
  dropdownLink:
    'block w-full rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-white/10 dark:text-slate-200 dark:hover:bg-white/10',
  dropdownLinkActive: 'block w-full rounded-md bg-[var(--accent-copper)] px-3 py-2 text-sm font-medium text-white',
  mobileContainer: 'py-2 lg:hidden',
  desktopContainer: 'hidden lg:block py-2',
} as const;

const buttonBase =
  'inline-flex items-center justify-center rounded-lg font-semibold whitespace-nowrap transition-all duration-300';

export const uiButtonStyles = {
  primaryLg:
    `${buttonBase} h-12 px-12 border-2 border-[var(--button-primary-bg)] bg-[var(--button-primary-bg)] text-[var(--button-primary-fg)] hover:bg-[var(--button-primary-hover)]`,
  outlineLg:
    `${buttonBase} h-12 px-12 border-2 border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[var(--surface-muted)] hover:border-[var(--accent-copper)]`,
  softLg:
    `${buttonBase} h-12 px-12 border border-[var(--accent-copper)] bg-[var(--surface-muted)] text-[var(--text-primary)] hover:bg-[var(--surface-paper)]`,
  primaryMd:
    `${buttonBase} px-6 py-3 bg-[var(--button-primary-bg)] text-[var(--button-primary-fg)] hover:bg-[var(--button-primary-hover)]`,
  outlineMd:
    `${buttonBase} px-6 py-3 border border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[var(--surface-muted)] hover:border-[var(--accent-copper)]`,
  primarySm:
    'inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-[var(--button-primary-bg)] text-[var(--button-primary-fg)] text-xs font-semibold rounded-md hover:bg-[var(--button-primary-hover)] transition-all duration-300',
  outlineSm:
    'inline-flex items-center justify-center gap-2 px-3 py-1.5 border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs font-semibold rounded-md hover:bg-[var(--surface-muted)] hover:border-[var(--accent-copper)] transition-all duration-300',
  writingPrimary:
    'inline-flex items-center justify-center gap-2 px-4 py-2 bg-[var(--button-primary-bg)] text-[var(--button-primary-fg)] text-xs font-semibold rounded-lg hover:bg-[var(--button-primary-hover)] transition-all duration-300',
  writingOutline:
    'inline-flex items-center justify-center gap-2 px-4 py-2 border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs font-semibold rounded-lg hover:bg-[var(--surface-muted)] hover:border-[var(--accent-copper)] transition-all duration-300',
} as const;
