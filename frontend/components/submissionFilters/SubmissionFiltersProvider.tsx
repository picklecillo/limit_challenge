'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useBrokerOptions } from '@/lib/hooks/useBrokerOptions';
import { useSubmissionsList } from '@/lib/hooks/useSubmissions';
import { Broker, PaginatedResponse, SubmissionListItem, SubmissionStatus } from '@/lib/types';
import { UseQueryResult } from '@tanstack/react-query';

interface SubmissionFiltersContextValue {
  status: SubmissionStatus | '';
  brokerId: string;
  companySearchInput: string;
  page: number;
  brokers: Broker[];
  submissionsQuery: UseQueryResult<PaginatedResponse<SubmissionListItem>>;
  onStatusChange: (value: string) => void;
  onBrokerChange: (value: string) => void;
  onCompanySearchChange: (value: string) => void;
  onClearFilters: () => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

const SubmissionFiltersContext = createContext<SubmissionFiltersContextValue | null>(null);

export function useSubmissionFilters() {
  const ctx = useContext(SubmissionFiltersContext);
  if (!ctx) throw new Error('useSubmissionFilters must be used within SubmissionFiltersProvider');
  return ctx;
}

export function SubmissionFiltersProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const status = (searchParams.get('status') ?? '') as SubmissionStatus | '';
  const brokerId = searchParams.get('brokerId') ?? '';
  const companySearch = searchParams.get('companySearch') ?? '';
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
      page,
    }),
    [status, brokerId, companySearch, page],
  );

  const submissionsQuery = useSubmissionsList(filters);
  const brokerQuery = useBrokerOptions();

  const value = useMemo<SubmissionFiltersContextValue>(
    () => ({
      status,
      brokerId,
      companySearchInput,
      page,
      brokers: brokerQuery.data ?? [],
      submissionsQuery,
      onStatusChange,
      onBrokerChange,
      onCompanySearchChange,
      onClearFilters,
      onPreviousPage,
      onNextPage,
    }),
    [
      status,
      brokerId,
      companySearchInput,
      page,
      brokerQuery.data,
      submissionsQuery,
      onStatusChange,
      onBrokerChange,
      onCompanySearchChange,
      onClearFilters,
      onPreviousPage,
      onNextPage,
    ],
  );

  return (
    <SubmissionFiltersContext.Provider value={value}>
      {children}
    </SubmissionFiltersContext.Provider>
  );
}
