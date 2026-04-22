'use client';

import { SubmissionsFilteringProvider } from '@/components/submissions/list/SubmissionsFilteringProvider';
import { SubmissionsProvider } from '@/components/submissions/list/SubmissionsProvider';

export default function SubmissionsLayout({ children }: { children: React.ReactNode }) {
  return (
    <SubmissionsFilteringProvider>
      <SubmissionsProvider>
        {children}
      </SubmissionsProvider>
    </SubmissionsFilteringProvider>
  );
}
