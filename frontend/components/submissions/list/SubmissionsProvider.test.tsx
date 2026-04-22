import { renderHook } from '@testing-library/react';

import { useSubmissionsFilters } from './SubmissionsFilteringProvider';
import { SubmissionsProvider, useSubmissionsData } from './SubmissionsProvider';

jest.mock('./SubmissionsFilteringProvider');
jest.mock('@/lib/hooks/useSubmissions');

const mockUseSubmissionsFilters = useSubmissionsFilters as jest.MockedFunction<typeof useSubmissionsFilters>;

const defaultFilters = {
  filters: {
    status: '' as const,
    brokerId: '',
    companySearch: '',
    companySearchInput: '',
    hasDocuments: false,
    hasActiveFilters: false,
    page: 1,
  },
  actions: {} as ReturnType<typeof useSubmissionsFilters>['actions'],
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SubmissionsProvider>{children}</SubmissionsProvider>
);

beforeEach(() => {
  mockUseSubmissionsFilters.mockReturnValue(defaultFilters);
  const { useSubmissionsList } = jest.requireMock('@/lib/hooks/useSubmissions');
  useSubmissionsList.mockReturnValue({ data: undefined, isFetching: false, isError: false });
});

describe('useSubmissionsData', () => {
  it('throws when used outside provider', () => {
    expect(() => renderHook(() => useSubmissionsData())).toThrow(
      'useSubmissionsData must be used within SubmissionsProvider',
    );
  });

  it('exposes default values when query has no data', () => {
    const { result } = renderHook(() => useSubmissionsData(), { wrapper });
    expect(result.current.results).toBeUndefined();
    expect(result.current.isFetching).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.isEmpty).toBe(false);
    expect(result.current.totalPages).toBe(0);
    expect(result.current.hasPreviousPage).toBe(false);
    expect(result.current.hasNextPage).toBe(false);
  });

  it('exposes results and pagination from query data', () => {
    const { useSubmissionsList } = jest.requireMock('@/lib/hooks/useSubmissions');
    useSubmissionsList.mockReturnValue({
      data: {
        results: [{ id: 1 }],
        totalPages: 3,
        next: '/submissions/?page=2',
        previous: null,
      },
      isFetching: false,
      isError: false,
    });
    const { result } = renderHook(() => useSubmissionsData(), { wrapper });
    expect(result.current.results).toEqual([{ id: 1 }]);
    expect(result.current.totalPages).toBe(3);
    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.hasPreviousPage).toBe(false);
  });

  it('isEmpty is true when results are empty and not fetching', () => {
    const { useSubmissionsList } = jest.requireMock('@/lib/hooks/useSubmissions');
    useSubmissionsList.mockReturnValue({
      data: { results: [], totalPages: 0, next: null, previous: null },
      isFetching: false,
      isError: false,
    });
    const { result } = renderHook(() => useSubmissionsData(), { wrapper });
    expect(result.current.isEmpty).toBe(true);
  });

  it('isEmpty is false while fetching even with empty results', () => {
    const { useSubmissionsList } = jest.requireMock('@/lib/hooks/useSubmissions');
    useSubmissionsList.mockReturnValue({
      data: { results: [], totalPages: 0, next: null, previous: null },
      isFetching: true,
      isError: false,
    });
    const { result } = renderHook(() => useSubmissionsData(), { wrapper });
    expect(result.current.isEmpty).toBe(false);
  });

  it('exposes isError when query fails', () => {
    const { useSubmissionsList } = jest.requireMock('@/lib/hooks/useSubmissions');
    useSubmissionsList.mockReturnValue({
      data: undefined,
      isFetching: false,
      isError: true,
    });
    const { result } = renderHook(() => useSubmissionsData(), { wrapper });
    expect(result.current.isError).toBe(true);
  });
});
