import { Chip } from '@mui/material';

import { SubmissionPriority } from '@/lib/types';

const PRIORITY_COLOR: Record<SubmissionPriority, 'error' | 'warning' | 'default'> = {
  high: 'error',
  medium: 'warning',
  low: 'default',
};

interface Props {
  priority: SubmissionPriority;
}

export function PriorityChip({ priority }: Props) {
  return (
    <Chip
      label={priority}
      color={PRIORITY_COLOR[priority]}
      size="small"
      variant="outlined"
    />
  );
}
