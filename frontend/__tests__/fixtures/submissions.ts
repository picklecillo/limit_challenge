import { SubmissionListItem } from '@/lib/types';

export const mockSubmission: SubmissionListItem = {
  id: 1,
  status: 'new',
  priority: 'high',
  summary: 'Test submission summary',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-03-15T00:00:00Z',
  broker: {
    id: 10,
    name: 'Acme Brokerage',
    primaryContactEmail: 'broker@acme.com',
  },
  company: {
    id: 20,
    legalName: 'Globex Corp',
    industry: 'Manufacturing',
    headquartersCity: 'Springfield',
  },
  owner: {
    id: 30,
    fullName: 'Jane Smith',
    email: 'jane@example.com',
  },
  documentCount: 3,
  noteCount: 2,
  latestNote: null,
};
