'use client';

import { motion } from 'framer-motion';
import { heroReveal, heroStagger } from '@/lib/animations';
import { BlurImage } from '@/components/BlurImage';
import { Container } from '@/components/LayoutPrimitives';

interface MainTabHeroProps {
  title: React.ReactNode;
  description: React.ReactNode;
  mediaSrc: string;
  priority?: boolean;
  mediaClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export function MainTabHero({
  title,
  description,
  mediaSrc,
  priority = false,
  mediaClassName = 'object-cover opacity-55 dark:opacity-40 brightness-95 dark:brightness-100',
  titleClassName = 'text-5xl md:text-6xl font-bold mb-6',
  descriptionClassName = 'text-lg text-gray-400 max-w-2xl',
}: MainTabHeroProps) {
  return (
    <motion.section
      className="page-header relative overflow-hidden"
      variants={heroStagger}
      initial="initial"
      animate="animate"
    >
      <div className="absolute inset-0 -z-10">
        <BlurImage
          src={mediaSrc}
          alt=""
          fill
          priority={priority}
          className={mediaClassName}
        />
      </div>
      <Container>
        <motion.div variants={heroReveal}>
          <h1 className={titleClassName}>{title}</h1>
          <p className={descriptionClassName}>{description}</p>
        </motion.div>
      </Container>
    </motion.section>
  );
}
