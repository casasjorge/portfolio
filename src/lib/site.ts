export interface NavItem {
  href: string;
  label: string;
}

export const SITE_URL = 'https://jorgecasas.com';
export const RESUME_PATH = '/about/Resume_Jorge_Casas_2026.pdf';
export const CV_PATH = '/about/CV_Jorge_Casas_2026.pdf';
export const CONTACT_EMAIL = 'jac2440@columbia.edu';
export const CONTACT_EMAIL_HREF = `mailto:${CONTACT_EMAIL}`;

export const SOCIAL_LINKS = {
  github: 'https://github.com/casasjorge',
  linkedin: 'https://www.linkedin.com/in/jac2440/',
} as const;

export const MAIN_NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/writing', label: 'Writing' },
  { href: '/#about', label: 'About' },
  { href: '/#contact', label: 'Contact' },
];

export const PRELOAD_ROUTES = ['/projects', '/writing'] as const;
export const SPECULATION_ROUTES = ['/projects/', '/writing/'] as const;

export const MAIN_TAB_HERO_MEDIA = {
  home: '/heroes/main-tabs/home-hero.mp4',
  homeWebm: '/heroes/main-tabs/home-hero.webm',
  homePoster: '/heroes/main-tabs/home-hero-poster.jpg',
  projects: '/heroes/main-tabs/projects-hero.png',
  writing: '/heroes/main-tabs/writing-hero.png',
} as const;
