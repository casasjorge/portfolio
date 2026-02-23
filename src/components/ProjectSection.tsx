'use client';

import { motion } from 'framer-motion';
import { standardDuration, standardEase } from '@/lib/animations';
import { MarkdownText } from '@/components/MarkdownText';
import { uiTextStyles } from '@/lib/ui';

interface ProjectSectionProps {
  title: string;
  insight: string;
  description: string;
  children?: React.ReactNode;
  layout?: 'image-left' | 'image-right';
  delay?: number;
}

export function ProjectSection({
  title,
  insight,
  description,
  children,
  layout = 'image-right',
  delay = 0,
}: ProjectSectionProps) {
  const isImageRight = layout === 'image-right';
  const hasMedia = Boolean(children);
  const textColumnClass = hasMedia
    ? isImageRight
      ? 'md:col-start-1 md:pr-8'
      : 'md:col-start-2 md:pl-8'
    : '';
  const mediaColumnClass = isImageRight ? 'md:col-start-2' : 'md:col-start-1';

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: standardDuration, ease: standardEase, delay }}
      className="mb-20 md:mb-24"
    >
      <div
        className={`grid grid-cols-1 gap-8 md:gap-12 ${hasMedia ? 'md:grid-cols-2 md:gap-y-0' : ''}`}
      >
        {/* Heading + Insight */}
        <motion.div
          initial={{ opacity: 0, x: isImageRight ? -20 : 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: standardDuration, ease: standardEase, delay: delay + 0.1 }}
          className={`${hasMedia ? 'order-1 md:row-start-1' : ''} ${textColumnClass}`.trim()}
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-3">{title}</h3>
          <MarkdownText
            content={insight}
            paragraphClassName={`${uiTextStyles.insight} mb-4 md:mb-6`}
          />
        </motion.div>

        {/* Media Content */}
        {hasMedia && (
          <motion.div
            initial={{ opacity: 0, x: isImageRight ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: standardDuration, ease: standardEase, delay: delay + 0.2 }}
            className={`order-2 md:order-none md:row-start-1 md:row-span-2 ${mediaColumnClass} flex items-center justify-center md:self-center`.trim()}
          >
            {children}
          </motion.div>
        )}

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, x: isImageRight ? -20 : 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: standardDuration, ease: standardEase, delay: delay + 0.15 }}
          className={`${hasMedia ? 'order-3 md:row-start-2' : ''} ${textColumnClass}`.trim()}
        >
          <MarkdownText
            content={description}
            paragraphClassName={uiTextStyles.bodyParagraph}
          />
        </motion.div>
      </div>
    </motion.section>
  );
}
