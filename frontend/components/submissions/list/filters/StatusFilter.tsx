import { MenuItem, TextField } from '@mui/material';

import { SubmissionStatus } from '@/lib/types';
import { useSubmissionsFilters } from '../SubmissionsFilteringProvider';

const STATUS_OPTIONS: { label: string; value: SubmissionStatus | '' }[] = [
  { label: 'All statuses', value: '' },
  { label: 'New', value: 'new' },
  { label: 'In Review', value: 'in_review' },
  { label: 'Closed', value: 'closed' },
  { label: 'Lost', value: 'lost' },
];

export function StatusFilter() {
  const { filters, actions } = useSubmissionsFilters();

  return (
    <TextField
      select
      label="Status"
      value={filters.status}
      onChange={(event) => actions.onStatusChange(event.target.value)}
      fullWidth
    >
      {STATUS_OPTIONS.map((option) => (
        <MenuItem key={option.value || 'all'} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
