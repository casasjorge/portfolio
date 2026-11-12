'use client';

import { motion, Variants } from 'framer-motion';
import { fadeIn, fadeInUp, standardDuration, standardEase } from '@/lib/animations';

interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
  variant?: 'fadeInUp' | 'fadeIn';
  className?: string;
}

export function AnimatedSection({
  children,
  delay = 0,
  variant = 'fadeInUp',
  className = '',
}: AnimatedSectionProps) {
  const variants: Record<'fadeInUp' | 'fadeIn', Variants> = {
    fadeInUp,
    fadeIn,
  };

  return (
    <motion.div
      variants={variants[variant]}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: standardDuration, delay, ease: standardEase }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
