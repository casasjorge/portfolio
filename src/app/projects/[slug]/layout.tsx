import { ProjectSubpageNav } from '@/components/ProjectSubpageNav';
import { getProjectBySlug } from '@/lib/projects';

export default async function ProjectSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const project = await getProjectBySlug(params.slug);
  const hasSubpages = Boolean(project?.subpages && project.subpages.length > 0);

  return (
    <>
      {hasSubpages ? (
        <>
          <div className="h-[var(--nav-height)]" aria-hidden="true" />
          <ProjectSubpageNav projectSlug={params.slug} subpages={project?.subpages || []} />
        </>
      ) : null}
      {children}
    </>
  );
}
