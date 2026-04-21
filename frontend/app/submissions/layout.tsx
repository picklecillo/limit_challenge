'use client';

import { SubmissionsProvider } from '@/components/submissions/list/SubmissionsProvider';

export default function SubmissionsLayout({ children }: { children: React.ReactNode }) {
  return <SubmissionsProvider>{children}</SubmissionsProvider>;
}
