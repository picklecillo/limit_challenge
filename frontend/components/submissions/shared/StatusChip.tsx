import { Chip } from '@mui/material';

import { SubmissionStatus } from '@/lib/types';

const STATUS_COLOR: Record<SubmissionStatus, 'default' | 'info' | 'success' | 'error'> = {
  new: 'info',
  in_review: 'default',
  closed: 'success',
  lost: 'error',
};

interface Props {
  status: SubmissionStatus;
}

export function StatusChip({ status }: Props) {
  return (
    <Chip
      label={status.replace('_', ' ')}
      color={STATUS_COLOR[status]}
      size="small"
    />
  );
}
