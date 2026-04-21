'use client';

import { createContext, useCallback, useContext, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { useSubmissionDetail } from '@/lib/hooks/useSubmissions';
import { SubmissionDetail } from '@/lib/types';
import { UseQueryResult } from '@tanstack/react-query';

interface SubmissionDetailContextValue {
  submissionId: string;
  query: UseQueryResult<SubmissionDetail>;
  onBack: () => void;
}

const SubmissionDetailContext = createContext<SubmissionDetailContextValue | null>(null);

export function useSubmissionDetailContext() {
  const ctx = useContext(SubmissionDetailContext);
  if (!ctx) throw new Error('useSubmissionDetailContext must be used within SubmissionDetailProvider');
  return ctx;
}

export function SubmissionDetailProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const submissionId = params?.id ?? '';

  const query = useSubmissionDetail(submissionId);

  const onBack = useCallback(() => {
    if (window.history.length <= 1) {
      router.replace('/submissions');
    } else {
      router.back();
    }
  }, [router]);

  const value = useMemo<SubmissionDetailContextValue>(
    () => ({ submissionId, query, onBack }),
    [submissionId, query, onBack],
  );

  return (
    <SubmissionDetailContext.Provider value={value}>
      {children}
    </SubmissionDetailContext.Provider>
  );
}
