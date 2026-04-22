import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ClearFiltersButton } from './ClearFiltersButton';
import { useSubmissionsFilters } from '../SubmissionsFilteringProvider';

jest.mock('../SubmissionsFilteringProvider');

const mockUseSubmissionsFilters = useSubmissionsFilters as jest.MockedFunction<typeof useSubmissionsFilters>;

const defaultContext = {
  filters: { hasActiveFilters: false },
  actions: { onClearFilters: jest.fn() },
} as unknown as ReturnType<typeof useSubmissionsFilters>;

beforeEach(() => {
  mockUseSubmissionsFilters.mockReturnValue(defaultContext);
});

describe('ClearFiltersButton', () => {
  it('renders clear filters button', () => {
    render(<ClearFiltersButton />);
    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeInTheDocument();
  });

  it('is disabled when hasActiveFilters is false', () => {
    render(<ClearFiltersButton />);
    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeDisabled();
  });

  it('is enabled when hasActiveFilters is true', () => {
    mockUseSubmissionsFilters.mockReturnValue({
      ...defaultContext,
      filters: { ...defaultContext.filters, hasActiveFilters: true },
    });
    render(<ClearFiltersButton />);
    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeEnabled();
  });

  it('calls onClearFilters when clicked', async () => {
    const onClearFilters = jest.fn();
    mockUseSubmissionsFilters.mockReturnValue({
      ...defaultContext,
      filters: { ...defaultContext.filters, hasActiveFilters: true },
      actions: { ...defaultContext.actions, onClearFilters },
    });
    render(<ClearFiltersButton />);
    await userEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(onClearFilters).toHaveBeenCalledTimes(1);
  });
});
