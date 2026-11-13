'use client';

import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/AnimatedSection';
import { EmptyState } from '@/components/EmptyState';
import { SectionBlock } from '@/components/LayoutPrimitives';
import { WritingCard } from '@/components/WritingCard';
import { MainTabHero } from '@/components/MainTabHero';
import { staggerContainer } from '@/lib/animations';
import { Writing } from '@/lib/writing';
import { PageShell } from '@/components/PageShell';
import { MAIN_TAB_HERO_MEDIA } from '@/lib/site';

export default function WritingPageClient({ writings }: { writings: Writing[] }) {
  return (
    <PageShell>
        {/* Header */}
        <MainTabHero
          title="Writing & Research"
          description="Research papers, technical reports, and essays across astrophysics, propulsion engineering, and computational methods."
          mediaSrc={MAIN_TAB_HERO_MEDIA.writing}
          mediaClassName="object-cover object-left opacity-55 dark:opacity-40 brightness-95 dark:brightness-100"
          titleClassName="text-5xl md:text-6xl font-bold mb-6 font-display"
        />

        {/* Writing List */}
        <SectionBlock style={{ paddingTop: '2.5rem' }}>
          {writings.length > 0 ? (
            <motion.div
              className="space-y-6"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {writings.map((w) => (
                <WritingCard key={w.id} writing={w} />
              ))}
            </motion.div>
          ) : (
            <AnimatedSection>
              <EmptyState
                message="Publications coming soon."
                messageClassName="text-gray-500 text-lg"
              />
            </AnimatedSection>
          )}
        </SectionBlock>
    </PageShell>
  );
}
