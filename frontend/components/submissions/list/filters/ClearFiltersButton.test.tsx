import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ClearFiltersButton } from './ClearFiltersButton';
import { useSubmissions } from '../SubmissionsProvider';

jest.mock('../SubmissionsProvider');

const mockUseSubmissions = useSubmissions as jest.MockedFunction<typeof useSubmissions>;

const defaultContext = {
  hasActiveFilters: false,
  onClearFilters: jest.fn(),
} as unknown as ReturnType<typeof useSubmissions>;

beforeEach(() => {
  mockUseSubmissions.mockReturnValue(defaultContext);
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
    mockUseSubmissions.mockReturnValue({ ...defaultContext, hasActiveFilters: true });
    render(<ClearFiltersButton />);
    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeEnabled();
  });

  it('calls onClearFilters when clicked', async () => {
    const onClearFilters = jest.fn();
    mockUseSubmissions.mockReturnValue({ ...defaultContext, hasActiveFilters: true, onClearFilters });
    render(<ClearFiltersButton />);
    await userEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(onClearFilters).toHaveBeenCalledTimes(1);
  });
});
