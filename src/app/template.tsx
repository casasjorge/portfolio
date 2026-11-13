'use client';

import { motion } from 'framer-motion';
import { standardDuration, standardEase } from '@/lib/animations';

/**
 * Next.js App Router `template.tsx` re-mounts on every route change,
 * giving us a natural hook for page-enter animations.
 * Kept intentionally lightweight to avoid compounding with
 * per-section animations.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ y: 8 }}
      animate={{ y: 0 }}
      transition={{ duration: standardDuration * 0.8, ease: standardEase }}
      style={{ willChange: 'transform' }}
    >
      {children}
    </motion.div>
  );
}
