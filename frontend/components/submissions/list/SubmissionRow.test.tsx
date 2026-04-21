import { render, screen } from '@testing-library/react';

import { SubmissionRow } from '@/components/submissions/list/SubmissionRow';
import { mockSubmission } from '@/__tests__/fixtures/submissions';

describe('SubmissionRow', () => {
  it('renders company name', () => {
    render(<SubmissionRow submission={mockSubmission} />);
    expect(screen.getByText('Globex Corp')).toBeInTheDocument();
  });

  it('renders broker and owner', () => {
    render(<SubmissionRow submission={mockSubmission} />);
    expect(screen.getByText('Acme Brokerage · Jane Smith')).toBeInTheDocument();
  });

  it('renders priority chip', () => {
    render(<SubmissionRow submission={mockSubmission} />);
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('renders status chip with underscores replaced', () => {
    render(<SubmissionRow submission={{ ...mockSubmission, status: 'in_review' }} />);
    expect(screen.getByText('in review')).toBeInTheDocument();
  });

  it('renders formatted updatedAt date', () => {
    render(<SubmissionRow submission={mockSubmission} />);
    const formatted = new Date('2026-03-15T00:00:00Z').toLocaleDateString();
    expect(screen.getByText(formatted)).toBeInTheDocument();
  });

  it('links to submission detail page', () => {
    render(<SubmissionRow submission={mockSubmission} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/submissions/1');
  });
});
