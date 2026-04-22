import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { StatusFilter } from './StatusFilter';
import { useSubmissionsFilters } from '../SubmissionsFilteringProvider';

jest.mock('../SubmissionsFilteringProvider');

const mockUseSubmissionsFilters = useSubmissionsFilters as jest.MockedFunction<typeof useSubmissionsFilters>;

const defaultContext = {
  filters: { status: '' as const },
  actions: { onStatusChange: jest.fn() },
} as unknown as ReturnType<typeof useSubmissionsFilters>;

beforeEach(() => {
  mockUseSubmissionsFilters.mockReturnValue(defaultContext);
});

describe('StatusFilter', () => {
  it('renders status select', () => {
    render(<StatusFilter />);
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
  });

  it('renders all status options when opened', async () => {
    render(<StatusFilter />);
    await userEvent.click(screen.getByLabelText('Status'));
    expect(screen.getByRole('option', { name: 'All statuses' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'New' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'In Review' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Closed' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Lost' })).toBeInTheDocument();
  });

  it('calls onStatusChange with selected value', async () => {
    const onStatusChange = jest.fn();
    mockUseSubmissionsFilters.mockReturnValue({
      ...defaultContext,
      actions: { ...defaultContext.actions, onStatusChange },
    });
    render(<StatusFilter />);
    await userEvent.click(screen.getByLabelText('Status'));
    await userEvent.click(screen.getByRole('option', { name: 'Closed' }));
    expect(onStatusChange).toHaveBeenCalledWith('closed');
  });

  it('reflects current status value', async () => {
    mockUseSubmissionsFilters.mockReturnValue({
      ...defaultContext,
      filters: { ...defaultContext.filters, status: 'in_review' },
    });
    render(<StatusFilter />);
    expect(screen.getByLabelText('Status')).toHaveTextContent('In Review');
  });
});
