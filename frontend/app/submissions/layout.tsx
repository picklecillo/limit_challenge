import { SubmissionFiltersProvider } from '@/components/submissionFilters/SubmissionFiltersProvider';

export default function SubmissionsLayout({ children }: { children: React.ReactNode }) {
  return <SubmissionFiltersProvider>{children}</SubmissionFiltersProvider>;
}
