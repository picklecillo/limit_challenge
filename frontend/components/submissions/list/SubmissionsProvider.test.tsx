import { act, renderHook } from '@testing-library/react';

import { SubmissionsProvider, useSubmissions } from './SubmissionsProvider';

const mockReplace = jest.fn();
let mockSearchParamsValue = new URLSearchParams();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => '/submissions',
  useSearchParams: () => mockSearchParamsValue,
}));

jest.mock('@/lib/hooks/useSubmissions', () => ({
  useSubmissionsList: jest.fn(() => ({ data: undefined, isFetching: false })),
}));

jest.mock('@/lib/hooks/useBrokerOptions', () => ({
  useBrokerOptions: jest.fn(() => ({
    data: [{ id: 1, name: 'Acme', primaryContactEmail: null }],
  })),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SubmissionsProvider>{children}</SubmissionsProvider>
);

beforeEach(() => {
  mockReplace.mockClear();
  mockSearchParamsValue = new URLSearchParams();
});

describe('useSubmissions', () => {
  it('throws when used outside provider', () => {
    expect(() => renderHook(() => useSubmissions())).toThrow(
      'useSubmissions must be used within SubmissionsProvider',
    );
  });

  it('exposes default values when URL has no params', () => {
    const { result } = renderHook(() => useSubmissions(), { wrapper });
    expect(result.current.status).toBe('');
    expect(result.current.brokerId).toBe('');
    expect(result.current.companySearchInput).toBe('');
    expect(result.current.hasDocuments).toBe(false);
    expect(result.current.page).toBe(1);
  });

  it('reads status, brokerId, companySearch, hasDocuments, page from URL', () => {
    mockSearchParamsValue = new URLSearchParams(
      'status=in_review&brokerId=5&companySearch=acme&hasDocuments=true&page=3',
    );
    const { result } = renderHook(() => useSubmissions(), { wrapper });
    expect(result.current.status).toBe('in_review');
    expect(result.current.brokerId).toBe('5');
    expect(result.current.companySearchInput).toBe('acme');
    expect(result.current.hasDocuments).toBe(true);
    expect(result.current.page).toBe(3);
  });

  it('exposes brokers from useBrokerOptions', () => {
    const { result } = renderHook(() => useSubmissions(), { wrapper });
    expect(result.current.brokers).toEqual([{ id: 1, name: 'Acme', primaryContactEmail: null }]);
  });

  it('onStatusChange calls router.replace with status param', () => {
    const { result } = renderHook(() => useSubmissions(), { wrapper });
    act(() => result.current.onStatusChange('closed'));
    expect(mockReplace).toHaveBeenCalledWith('/submissions?status=closed');
  });

  it('onStatusChange with empty value removes status param', () => {
    mockSearchParamsValue = new URLSearchParams('status=new');
    const { result } = renderHook(() => useSubmissions(), { wrapper });
    act(() => result.current.onStatusChange(''));
    expect(mockReplace).toHaveBeenCalledWith('/submissions?');
  });

  it('onHasDocumentsChange sets hasDocuments param when true', () => {
    const { result } = renderHook(() => useSubmissions(), { wrapper });
    act(() => result.current.onHasDocumentsChange(true));
    expect(mockReplace).toHaveBeenCalledWith('/submissions?hasDocuments=true');
  });

  it('onHasDocumentsChange removes hasDocuments param when false', () => {
    mockSearchParamsValue = new URLSearchParams('hasDocuments=true');
    const { result } = renderHook(() => useSubmissions(), { wrapper });
    act(() => result.current.onHasDocumentsChange(false));
    expect(mockReplace).toHaveBeenCalledWith('/submissions?');
  });

  it('onBrokerChange calls router.replace with brokerId param', () => {
    const { result } = renderHook(() => useSubmissions(), { wrapper });
    act(() => result.current.onBrokerChange('7'));
    expect(mockReplace).toHaveBeenCalledWith('/submissions?brokerId=7');
  });

  it('onStatusChange resets page', () => {
    mockSearchParamsValue = new URLSearchParams('page=3');
    const { result } = renderHook(() => useSubmissions(), { wrapper });
    act(() => result.current.onStatusChange('new'));
    expect(mockReplace).toHaveBeenCalledWith('/submissions?status=new');
  });

  it('onCompanySearchChange updates companySearchInput immediately', () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useSubmissions(), { wrapper });
    act(() => result.current.onCompanySearchChange('globex'));
    expect(result.current.companySearchInput).toBe('globex');
    jest.useRealTimers();
  });

  it('onCompanySearchChange calls router.replace after debounce', () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useSubmissions(), { wrapper });
    act(() => result.current.onCompanySearchChange('globex'));
    expect(mockReplace).not.toHaveBeenCalled();
    act(() => jest.advanceTimersByTime(300));
    expect(mockReplace).toHaveBeenCalledWith('/submissions?companySearch=globex');
    jest.useRealTimers();
  });

  it('onClearFilters calls router.replace with bare pathname', () => {
    mockSearchParamsValue = new URLSearchParams('status=new&brokerId=3');
    const { result } = renderHook(() => useSubmissions(), { wrapper });
    act(() => result.current.onClearFilters());
    expect(mockReplace).toHaveBeenCalledWith('/submissions');
  });

  it('onClearFilters resets companySearchInput', () => {
    mockSearchParamsValue = new URLSearchParams('companySearch=acme');
    const { result } = renderHook(() => useSubmissions(), { wrapper });
    act(() => result.current.onClearFilters());
    expect(result.current.companySearchInput).toBe('');
  });

  it('onPreviousPage decrements page without resetting other params', () => {
    mockSearchParamsValue = new URLSearchParams('status=new&page=3');
    const { result } = renderHook(() => useSubmissions(), { wrapper });
    act(() => result.current.onPreviousPage());
    expect(mockReplace).toHaveBeenCalledWith('/submissions?status=new&page=2');
  });

  it('onNextPage increments page without resetting other params', () => {
    mockSearchParamsValue = new URLSearchParams('status=new&page=2');
    const { result } = renderHook(() => useSubmissions(), { wrapper });
    act(() => result.current.onNextPage());
    expect(mockReplace).toHaveBeenCalledWith('/submissions?status=new&page=3');
  });
});
