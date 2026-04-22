import { act, renderHook } from '@testing-library/react';

import { SubmissionsFilteringProvider, useSubmissionsFilters } from './SubmissionsFilteringProvider';

const mockReplace = jest.fn();
let mockSearchParamsValue = new URLSearchParams();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => '/submissions',
  useSearchParams: () => mockSearchParamsValue,
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SubmissionsFilteringProvider>{children}</SubmissionsFilteringProvider>
);

beforeEach(() => {
  mockReplace.mockClear();
  mockSearchParamsValue = new URLSearchParams();
});

describe('useSubmissionsFilters', () => {
  it('throws when used outside provider', () => {
    expect(() => renderHook(() => useSubmissionsFilters())).toThrow(
      'useSubmissionsFilters must be used within SubmissionsFilteringProvider',
    );
  });

  it('exposes default values when URL has no params', () => {
    const { result } = renderHook(() => useSubmissionsFilters(), { wrapper });
    expect(result.current.filters.status).toBe('');
    expect(result.current.filters.brokerId).toBe('');
    expect(result.current.filters.companySearchInput).toBe('');
    expect(result.current.filters.hasDocuments).toBe(false);
    expect(result.current.filters.page).toBe(1);
    expect(result.current.filters.hasActiveFilters).toBe(false);
  });

  it('reads status, brokerId, companySearch, hasDocuments, page from URL', () => {
    mockSearchParamsValue = new URLSearchParams(
      'status=in_review&brokerId=5&companySearch=acme&hasDocuments=true&page=3',
    );
    const { result } = renderHook(() => useSubmissionsFilters(), { wrapper });
    expect(result.current.filters.status).toBe('in_review');
    expect(result.current.filters.brokerId).toBe('5');
    expect(result.current.filters.companySearchInput).toBe('acme');
    expect(result.current.filters.companySearch).toBe('acme');
    expect(result.current.filters.hasDocuments).toBe(true);
    expect(result.current.filters.page).toBe(3);
  });

  it('hasActiveFilters is true when any filter set', () => {
    mockSearchParamsValue = new URLSearchParams('status=new');
    const { result } = renderHook(() => useSubmissionsFilters(), { wrapper });
    expect(result.current.filters.hasActiveFilters).toBe(true);
  });

  it('actions.onStatusChange calls router.replace with status param', () => {
    const { result } = renderHook(() => useSubmissionsFilters(), { wrapper });
    act(() => result.current.actions.onStatusChange('closed'));
    expect(mockReplace).toHaveBeenCalledWith('/submissions?status=closed');
  });

  it('actions.onStatusChange with empty value removes status param', () => {
    mockSearchParamsValue = new URLSearchParams('status=new');
    const { result } = renderHook(() => useSubmissionsFilters(), { wrapper });
    act(() => result.current.actions.onStatusChange(''));
    expect(mockReplace).toHaveBeenCalledWith('/submissions?');
  });

  it('actions.onHasDocumentsChange sets hasDocuments param when true', () => {
    const { result } = renderHook(() => useSubmissionsFilters(), { wrapper });
    act(() => result.current.actions.onHasDocumentsChange(true));
    expect(mockReplace).toHaveBeenCalledWith('/submissions?hasDocuments=true');
  });

  it('actions.onHasDocumentsChange removes hasDocuments param when false', () => {
    mockSearchParamsValue = new URLSearchParams('hasDocuments=true');
    const { result } = renderHook(() => useSubmissionsFilters(), { wrapper });
    act(() => result.current.actions.onHasDocumentsChange(false));
    expect(mockReplace).toHaveBeenCalledWith('/submissions?');
  });

  it('actions.onBrokerChange calls router.replace with brokerId param', () => {
    const { result } = renderHook(() => useSubmissionsFilters(), { wrapper });
    act(() => result.current.actions.onBrokerChange('7'));
    expect(mockReplace).toHaveBeenCalledWith('/submissions?brokerId=7');
  });

  it('actions.onStatusChange resets page', () => {
    mockSearchParamsValue = new URLSearchParams('page=3');
    const { result } = renderHook(() => useSubmissionsFilters(), { wrapper });
    act(() => result.current.actions.onStatusChange('new'));
    expect(mockReplace).toHaveBeenCalledWith('/submissions?status=new');
  });

  it('actions.onCompanySearchChange updates companySearchInput immediately', () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useSubmissionsFilters(), { wrapper });
    act(() => result.current.actions.onCompanySearchChange('globex'));
    expect(result.current.filters.companySearchInput).toBe('globex');
    jest.useRealTimers();
  });

  it('actions.onCompanySearchChange calls router.replace after debounce', () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useSubmissionsFilters(), { wrapper });
    act(() => result.current.actions.onCompanySearchChange('globex'));
    expect(mockReplace).not.toHaveBeenCalled();
    act(() => jest.advanceTimersByTime(300));
    expect(mockReplace).toHaveBeenCalledWith('/submissions?companySearch=globex');
    jest.useRealTimers();
  });

  it('actions.onClearFilters calls router.replace with bare pathname', () => {
    mockSearchParamsValue = new URLSearchParams('status=new&brokerId=3');
    const { result } = renderHook(() => useSubmissionsFilters(), { wrapper });
    act(() => result.current.actions.onClearFilters());
    expect(mockReplace).toHaveBeenCalledWith('/submissions');
  });

  it('actions.onClearFilters resets companySearchInput', () => {
    mockSearchParamsValue = new URLSearchParams('companySearch=acme');
    const { result } = renderHook(() => useSubmissionsFilters(), { wrapper });
    act(() => result.current.actions.onClearFilters());
    expect(result.current.filters.companySearchInput).toBe('');
  });

  it('actions.onPreviousPage decrements page without resetting other params', () => {
    mockSearchParamsValue = new URLSearchParams('status=new&page=3');
    const { result } = renderHook(() => useSubmissionsFilters(), { wrapper });
    act(() => result.current.actions.onPreviousPage());
    expect(mockReplace).toHaveBeenCalledWith('/submissions?status=new&page=2');
  });

  it('actions.onNextPage increments page without resetting other params', () => {
    mockSearchParamsValue = new URLSearchParams('status=new&page=2');
    const { result } = renderHook(() => useSubmissionsFilters(), { wrapper });
    act(() => result.current.actions.onNextPage());
    expect(mockReplace).toHaveBeenCalledWith('/submissions?status=new&page=3');
  });
});
