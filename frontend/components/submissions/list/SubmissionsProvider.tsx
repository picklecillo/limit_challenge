'use client';

import { createContext, useContext, useMemo } from 'react';

import { useSubmissionsList } from '@/lib/hooks/useSubmissions';
import { SubmissionListItem } from '@/lib/types';

import { useSubmissionsFilters } from './SubmissionsFilteringProvider';

interface SubmissionsDataContextValue {
  results: SubmissionListItem[] | undefined;
  isFetching: boolean;
  isError: boolean;
  isEmpty: boolean;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

const SubmissionsDataContext = createContext<SubmissionsDataContextValue | null>(null);

export function useSubmissionsData() {
  const ctx = useContext(SubmissionsDataContext);
  if (!ctx) throw new Error('useSubmissionsData must be used within SubmissionsProvider');
  return ctx;
}

export function SubmissionsProvider({ children }: { children: React.ReactNode }) {
  const { filters } = useSubmissionsFilters();

  const queryFilters = useMemo(
    () => ({
      status: filters.status || undefined,
      brokerId: filters.brokerId || undefined,
      companySearch: filters.companySearch || undefined,
      hasDocuments: filters.hasDocuments || undefined,
      page: filters.page,
    }),
    [filters.status, filters.brokerId, filters.companySearch, filters.hasDocuments, filters.page],
  );

  const query = useSubmissionsList(queryFilters);
  const results = query.data?.results;
  const isEmpty = !query.isFetching && results?.length === 0;

  const value = useMemo<SubmissionsDataContextValue>(
    () => ({
      results,
      isFetching: query.isFetching,
      isError: query.isError,
      isEmpty: isEmpty ?? false,
      totalPages: query.data?.totalPages ?? 0,
      hasPreviousPage: !!query.data?.previous,
      hasNextPage: !!query.data?.next,
    }),
    [results, query.isFetching, query.isError, isEmpty, query.data],
  );

  return (
    <SubmissionsDataContext.Provider value={value}>
      {children}
    </SubmissionsDataContext.Provider>
  );
}
