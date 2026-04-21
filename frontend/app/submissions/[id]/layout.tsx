'use client';

import { SubmissionDetailProvider } from '@/components/submissionDetail/SubmissionDetailProvider';

export default function SubmissionDetailLayout({ children }: { children: React.ReactNode }) {
  return <SubmissionDetailProvider>{children}</SubmissionDetailProvider>;
}
