'use client';

import { SubmissionDetailProvider } from '@/components/submissions/detail/SubmissionDetailProvider';

export default function SubmissionDetailLayout({ children }: { children: React.ReactNode }) {
  return <SubmissionDetailProvider>{children}</SubmissionDetailProvider>;
}
