'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { SubmissionStatus } from '@/lib/types';

interface FilterState {
  status: SubmissionStatus | '';
  brokerId: string;
  companySearch: string;
  companySearchInput: string;
  hasDocuments: boolean;
  createdFrom: string;
  hasActiveFilters: boolean;
  page: number;
}

interface FilterActions {
  onStatusChange: (value: string) => void;
  onBrokerChange: (value: string) => void;
  onCompanySearchChange: (value: string) => void;
  onHasDocumentsChange: (value: boolean) => void;
  onCreatedFromChange: (value: string) => void;
  onClearFilters: () => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

interface SubmissionsFilteringContextValue {
  filters: FilterState;
  actions: FilterActions;
}

const SubmissionsFilteringContext = createContext<SubmissionsFilteringContextValue | null>(null);

export function useSubmissionsFilters() {
  const ctx = useContext(SubmissionsFilteringContext);
  if (!ctx) throw new Error('useSubmissionsFilters must be used within SubmissionsFilteringProvider');
  return ctx;
}

export function SubmissionsFilteringProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const status = (searchParams.get('status') ?? '') as SubmissionStatus | '';
  const brokerId = searchParams.get('brokerId') ?? '';
  const companySearch = searchParams.get('companySearch') ?? '';
  const hasDocuments = searchParams.get('hasDocuments') === 'true';
  const createdFrom = searchParams.get('createdFrom') ?? '';
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
  const onCreatedFromChange = useCallback((value: string) => setFilter({ createdFrom: value }), [setFilter]);
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

  const hasActiveFilters = !!(status || brokerId || companySearch || hasDocuments || createdFrom);

  const filters = useMemo<FilterState>(
    () => ({ status, brokerId, companySearch, companySearchInput, hasDocuments, createdFrom, hasActiveFilters, page }),
    [status, brokerId, companySearch, companySearchInput, hasDocuments, createdFrom, hasActiveFilters, page],
  );

  const actions = useMemo<FilterActions>(
    () => ({
      onStatusChange,
      onBrokerChange,
      onCompanySearchChange,
      onHasDocumentsChange,
      onCreatedFromChange,
      onClearFilters,
      onPreviousPage,
      onNextPage,
    }),
    [
      onStatusChange,
      onBrokerChange,
      onCompanySearchChange,
      onHasDocumentsChange,
      onCreatedFromChange,
      onClearFilters,
      onPreviousPage,
      onNextPage,
    ],
  );

  const value = useMemo<SubmissionsFilteringContextValue>(
    () => ({ filters, actions }),
    [filters, actions],
  );

  return (
    <SubmissionsFilteringContext.Provider value={value}>
      {children}
    </SubmissionsFilteringContext.Provider>
  );
}
