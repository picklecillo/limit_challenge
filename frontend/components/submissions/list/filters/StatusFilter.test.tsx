import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { StatusFilter } from './StatusFilter';
import { useSubmissions } from '../SubmissionsProvider';

jest.mock('../SubmissionsProvider');

const mockUseSubmissions = useSubmissions as jest.MockedFunction<typeof useSubmissions>;

const defaultContext = {
  status: '' as const,
  onStatusChange: jest.fn(),
} as unknown as ReturnType<typeof useSubmissions>;

beforeEach(() => {
  mockUseSubmissions.mockReturnValue(defaultContext);
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
    mockUseSubmissions.mockReturnValue({ ...defaultContext, onStatusChange });
    render(<StatusFilter />);
    await userEvent.click(screen.getByLabelText('Status'));
    await userEvent.click(screen.getByRole('option', { name: 'Closed' }));
    expect(onStatusChange).toHaveBeenCalledWith('closed');
  });

  it('reflects current status value', async () => {
    mockUseSubmissions.mockReturnValue({ ...defaultContext, status: 'in_review' });
    render(<StatusFilter />);
    expect(screen.getByLabelText('Status')).toHaveTextContent('In Review');
  });
});
