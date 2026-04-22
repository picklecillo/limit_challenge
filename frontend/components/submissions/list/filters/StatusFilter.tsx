import { MenuItem, TextField } from '@mui/material';

import { SubmissionStatus } from '@/lib/types';
import { useSubmissions } from '../SubmissionsProvider';

const STATUS_OPTIONS: { label: string; value: SubmissionStatus | '' }[] = [
  { label: 'All statuses', value: '' },
  { label: 'New', value: 'new' },
  { label: 'In Review', value: 'in_review' },
  { label: 'Closed', value: 'closed' },
  { label: 'Lost', value: 'lost' },
];

export function StatusFilter() {
  const { status, onStatusChange } = useSubmissions();

  return (
    <TextField
      select
      label="Status"
      value={status}
      onChange={(event) => onStatusChange(event.target.value)}
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
