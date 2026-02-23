'use client';

import { motion } from 'framer-motion';
import { ProjectCardData } from '@/lib/projects';
import { ProjectCard } from './ProjectCard';
import { staggerContainer } from '@/lib/animations';

interface ProjectGridProps {
  projects: ProjectCardData[];
  trigger?: 'mount' | 'inView';
  cardEffect?: 'tilt' | 'none';
  activeCategory?: string | null;
}

export function ProjectGrid({
  projects,
  trigger = 'inView',
  cardEffect = 'tilt',
  activeCategory = null,
}: ProjectGridProps) {
  const animationProps =
    trigger === 'mount'
      ? { animate: 'animate' as const }
      : {
          whileInView: 'animate' as const,
          viewport: { once: true, amount: 0.08 },
        };

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      {...animationProps}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} effect={cardEffect} activeCategory={activeCategory} />
      ))}
    </motion.div>
  );
}
