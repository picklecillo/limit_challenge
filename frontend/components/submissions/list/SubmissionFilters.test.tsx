import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SubmissionFilters } from './SubmissionFilters';
import { useSubmissions } from './SubmissionsProvider';

jest.mock('./SubmissionsProvider');

const mockUseSubmissions = useSubmissions as jest.MockedFunction<typeof useSubmissions>;

const defaultContext = {
  status: '' as const,
  brokerId: '',
  companySearchInput: '',
  hasDocuments: false,
  hasActiveFilters: false,
  brokers: [],
  onStatusChange: jest.fn(),
  onBrokerChange: jest.fn(),
  onCompanySearchChange: jest.fn(),
  onHasDocumentsChange: jest.fn(),
  onClearFilters: jest.fn(),
} as unknown as ReturnType<typeof useSubmissions>;

beforeEach(() => {
  mockUseSubmissions.mockReturnValue(defaultContext);
});

describe('SubmissionFilters', () => {
  it('renders status, broker, company search fields and has documents checkbox', () => {
    render(<SubmissionFilters />);
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
    expect(screen.getByLabelText('Broker')).toBeInTheDocument();
    expect(screen.getByLabelText('Company search')).toBeInTheDocument();
    expect(screen.getByLabelText('Has documents')).toBeInTheDocument();
  });

  it('clear filters button is disabled when no active filters', () => {
    render(<SubmissionFilters />);
    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeDisabled();
  });

  it('clear filters button is enabled when hasActiveFilters is true', () => {
    mockUseSubmissions.mockReturnValue({ ...defaultContext, hasActiveFilters: true });
    render(<SubmissionFilters />);
    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeEnabled();
  });

  it('calls onClearFilters when clear button clicked', async () => {
    const onClearFilters = jest.fn();
    mockUseSubmissions.mockReturnValue({ ...defaultContext, hasActiveFilters: true, onClearFilters });
    render(<SubmissionFilters />);
    await userEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(onClearFilters).toHaveBeenCalledTimes(1);
  });

  it('calls onCompanySearchChange when typing in company search', async () => {
    const onCompanySearchChange = jest.fn();
    mockUseSubmissions.mockReturnValue({ ...defaultContext, onCompanySearchChange });
    render(<SubmissionFilters />);
    await userEvent.type(screen.getByLabelText('Company search'), 'a');
    expect(onCompanySearchChange).toHaveBeenCalledWith('a');
  });

  it('calls onHasDocumentsChange when checkbox toggled', async () => {
    const onHasDocumentsChange = jest.fn();
    mockUseSubmissions.mockReturnValue({ ...defaultContext, onHasDocumentsChange });
    render(<SubmissionFilters />);
    await userEvent.click(screen.getByLabelText('Has documents'));
    expect(onHasDocumentsChange).toHaveBeenCalledWith(true);
  });

  it('renders broker options from context when dropdown opened', async () => {
    mockUseSubmissions.mockReturnValue({
      ...defaultContext,
      brokers: [
        { id: 1, name: 'Acme Brokerage', primaryContactEmail: null },
        { id: 2, name: 'Globe Brokers', primaryContactEmail: null },
      ],
    });
    render(<SubmissionFilters />);
    await userEvent.click(screen.getByLabelText('Broker'));
    expect(screen.getByRole('option', { name: 'Acme Brokerage' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Globe Brokers' })).toBeInTheDocument();
  });

  it('reflects companySearchInput value', () => {
    mockUseSubmissions.mockReturnValue({ ...defaultContext, companySearchInput: 'globex' });
    render(<SubmissionFilters />);
    expect(screen.getByLabelText('Company search')).toHaveValue('globex');
  });

  it('reflects hasDocuments checked state', () => {
    mockUseSubmissions.mockReturnValue({ ...defaultContext, hasDocuments: true });
    render(<SubmissionFilters />);
    expect(screen.getByLabelText('Has documents')).toBeChecked();
  });
});
