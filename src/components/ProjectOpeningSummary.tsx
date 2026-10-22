import type { ProjectOpeningSummary as ProjectOpeningSummaryData } from '@/lib/projects';

interface ProjectOpeningSummaryProps {
  summary: ProjectOpeningSummaryData;
}

const summaryLabels: Array<keyof ProjectOpeningSummaryData> = [
  'problem',
  'role',
  'method',
  'result',
  'status',
];

const labelText: Record<keyof ProjectOpeningSummaryData, string> = {
  problem: 'Problem',
  role: 'Role',
  method: 'Method',
  result: 'Result',
  status: 'Status',
};

export function ProjectOpeningSummary({ summary }: ProjectOpeningSummaryProps) {
  return (
    <section
      aria-label="Project summary"
      className="editorial-panel mt-8 grid gap-5 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-5"
    >
      {summaryLabels.map((key) => (
        <dl key={key}>
          <dt className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[var(--accent-copper)]">
            {labelText[key]}
          </dt>
          <dd className="mt-2 text-sm leading-6 text-[var(--text-primary)]">{summary[key]}</dd>
        </dl>
      ))}
    </section>
  );
}
