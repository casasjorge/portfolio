'use client';

import { AnimatedSection } from '@/components/AnimatedSection';
import { EmptyState } from '@/components/EmptyState';
import { Container } from '@/components/LayoutPrimitives';
import { ProjectFilters } from '@/components/ProjectFilters';
import { ProjectGrid } from '@/components/ProjectGrid';
import { MainTabHero } from '@/components/MainTabHero';
import { PageShell } from '@/components/PageShell';
import { ProjectCardData } from '@/lib/projects';
import { MAIN_TAB_HERO_MEDIA } from '@/lib/site';
import { useProjectTagFilters } from '@/lib/useProjectTagFilters';

interface ProjectsPageClientProps {
  projects: ProjectCardData[];
}

export default function ProjectsPageClient({ projects }: ProjectsPageClientProps) {
  const { allTags, filteredProjects, selectedTag, setSelectedTag } = useProjectTagFilters(projects);

  return (
    <PageShell>
        {/* Header */}
        <MainTabHero
          title={<span className="gradient-text">All Projects</span>}
          description="A collection of my research, engineering projects, and technical explorations spanning astrophysics, optimization, and aerospace."
          mediaSrc={MAIN_TAB_HERO_MEDIA.projects}
          mediaClassName="object-cover opacity-30 dark:opacity-35 brightness-110 dark:brightness-100"
          descriptionClassName="text-lg text-gray-300 max-w-2xl"
        />

        {/* Filter Tags */}
        <Container as="section" className="py-10">
          <AnimatedSection>
            <ProjectFilters tags={allTags} selectedTag={selectedTag} onSelectTag={setSelectedTag} />
          </AnimatedSection>
        </Container>

        {/* Projects Grid */}
        <Container as="section" className="pt-0 pb-12">
          <ProjectGrid
            key={selectedTag ?? 'all'}
            projects={filteredProjects}
            trigger="mount"
          />
          
          {filteredProjects.length === 0 && (
            <EmptyState message="No projects found for this tag." />
          )}
        </Container>
    </PageShell>
  );
}
