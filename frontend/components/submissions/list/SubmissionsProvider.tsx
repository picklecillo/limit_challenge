'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useBrokerOptions } from '@/lib/hooks/useBrokerOptions';
import { useSubmissionsList } from '@/lib/hooks/useSubmissions';
import { Broker, PaginatedResponse, SubmissionListItem, SubmissionStatus } from '@/lib/types';
import { UseQueryResult } from '@tanstack/react-query';

interface SubmissionsContextValue {
  status: SubmissionStatus | '';
  brokerId: string;
  companySearchInput: string;
  hasDocuments: boolean;
  hasActiveFilters: boolean;
  page: number;
  brokers: Broker[];
  results: SubmissionListItem[] | undefined;
  isEmpty: boolean;
  submissionsQuery: UseQueryResult<PaginatedResponse<SubmissionListItem>>;
  onStatusChange: (value: string) => void;
  onBrokerChange: (value: string) => void;
  onCompanySearchChange: (value: string) => void;
  onHasDocumentsChange: (value: boolean) => void;
  onClearFilters: () => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

const SubmissionsContext = createContext<SubmissionsContextValue | null>(null);

export function useSubmissions() {
  const ctx = useContext(SubmissionsContext);
  if (!ctx) throw new Error('useSubmissions must be used within SubmissionsProvider');
  return ctx;
}

export function SubmissionsProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const status = (searchParams.get('status') ?? '') as SubmissionStatus | '';
  const brokerId = searchParams.get('brokerId') ?? '';
  const companySearch = searchParams.get('companySearch') ?? '';
  const hasDocuments = searchParams.get('hasDocuments') === 'true';
  const page = parseInt(searchParams.get('page') ?? '1', 10);

  const [companySearchInput, setCompanySearchInput] = useState(companySearch);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCompanySearchInput(companySearch);
  }, [companySearch]);

  const setFilter = useCallback(
    (updates: Record<string, string>, resetPage = true) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      if (resetPage) params.delete('page');
      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router],
  );

  const onStatusChange = useCallback((value: string) => setFilter({ status: value }), [setFilter]);
  const onBrokerChange = useCallback((value: string) => setFilter({ brokerId: value }), [setFilter]);
  const onHasDocumentsChange = useCallback(
    (value: boolean) => setFilter({ hasDocuments: value ? 'true' : '' }),
    [setFilter],
  );
  const onCompanySearchChange = useCallback(
    (value: string) => {
      setCompanySearchInput(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setFilter({ companySearch: value });
      }, 300);
    },
    [setFilter],
  );
  const onClearFilters = useCallback(() => {
    setCompanySearchInput('');
    router.replace(pathname);
  }, [router, pathname]);

  const onPreviousPage = useCallback(
    () => setFilter({ page: String(page - 1) }, false),
    [setFilter, page],
  );
  
  const onNextPage = useCallback(
    () => setFilter({ page: String(page + 1) }, false),
    [setFilter, page],
  );

  const filters = useMemo(
    () => ({
      status: status || undefined,
      brokerId: brokerId || undefined,
      companySearch: companySearch || undefined,
      hasDocuments: hasDocuments || undefined,
      page,
    }),
    [status, brokerId, companySearch, hasDocuments, page],
  );

  const submissionsQuery = useSubmissionsList(filters);
  const brokerQuery = useBrokerOptions();

  const hasActiveFilters = !!(status || brokerId || companySearch || hasDocuments);
  const results = submissionsQuery.data?.results;
  const isEmpty = !submissionsQuery.isFetching && results?.length === 0;

  const value = useMemo<SubmissionsContextValue>(
    () => ({
      status,
      brokerId,
      companySearchInput,
      hasDocuments,
      hasActiveFilters,
      page,
      brokers: brokerQuery.data ?? [],
      results,
      isEmpty,
      submissionsQuery,
      onStatusChange,
      onBrokerChange,
      onCompanySearchChange,
      onHasDocumentsChange,
      onClearFilters,
      onPreviousPage,
      onNextPage,
    }),
    [
      status,
      brokerId,
      companySearchInput,
      hasDocuments,
      hasActiveFilters,
      page,
      brokerQuery.data,
      results,
      isEmpty,
      submissionsQuery,
      onStatusChange,
      onBrokerChange,
      onCompanySearchChange,
      onHasDocumentsChange,
      onClearFilters,
      onPreviousPage,
      onNextPage,
    ],
  );

  return (
    <SubmissionsContext.Provider value={value}>
      {children}
    </SubmissionsContext.Provider>
  );
}
