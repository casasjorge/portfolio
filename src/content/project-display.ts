export interface ProjectDisplayConfigEntry {
  featured: boolean;
  order: number;
}

// Centralized display controls for project cards/lists.
// Adjust `featured` and `order` here instead of editing each project MDX file.
export const PROJECT_DISPLAY_CONFIG: Record<string, ProjectDisplayConfigEntry> = {
  'three-body-gravitational-slingshots': { featured: true, order: 1 },
  'cool-worlds-science-communication': { featured: true, order: 2 },
  'astrostatistics-bayesian-modeling': { featured: true, order: 3 },
  'asteroid-orbit-determination': { featured: false, order: 4 },
  'regenerative-liquid-rocket-engine': { featured: false, order: 5 },
  'columbia-hybrid-rocket': { featured: false, order: 6 },
  'farout-propulsion-mentorship': { featured: false, order: 7 },
  'advanced-machining-fundamentals': { featured: false, order: 8 },
  'cnc-lab-modernization': { featured: false, order: 9 },
  'home-lab-networking': { featured: false, order: 10 },
};
