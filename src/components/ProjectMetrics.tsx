'use client';

import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/animations';
import { ProjectMetric } from '@/lib/projects';

interface ProjectMetricsProps {
  metrics: ProjectMetric[];
}

export function ProjectMetrics({ metrics }: ProjectMetricsProps) {
  if (!metrics || metrics.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-16 py-12 border-y border-white/10"
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.3 }}
    >
      {metrics.map((metric, idx) => (
        <motion.div
          key={idx}
          variants={staggerItem}
          className="group p-6 rounded-lg bg-white/10 backdrop-blur-sm border border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-glow cursor-default"
        >
          <div className="flex items-start gap-3 mb-3">
            {metric.icon && (
              <span className="text-2xl flex-shrink-0 group-hover:animate-float">
                {metric.icon}
              </span>
            )}
            <div className="flex-1">
              <p className="text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-1">
                {metric.label}
              </p>
              <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                {metric.value}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
