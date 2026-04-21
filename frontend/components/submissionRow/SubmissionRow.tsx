import { Box, Chip, Stack, Typography } from '@mui/material';
import Link from 'next/link';

import { SubmissionListItem, SubmissionPriority, SubmissionStatus } from '@/lib/types';

const STATUS_COLOR: Record<SubmissionStatus, 'default' | 'info' | 'success' | 'error'> = {
  new: 'info',
  in_review: 'default',
  closed: 'success',
  lost: 'error',
};

const PRIORITY_COLOR: Record<SubmissionPriority, 'error' | 'warning' | 'default'> = {
  high: 'error',
  medium: 'warning',
  low: 'default',
};

interface Props {
  submission: SubmissionListItem;
}

export function SubmissionRow({ submission }: Props) {
  return (
    <Box
      component={Link}
      href={`/submissions/${submission.id}`}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2,
        py: 1.5,
        borderRadius: 1,
        textDecoration: 'none',
        color: 'inherit',
        '&:hover': { bgcolor: 'action.hover' },
      }}
    >
      <Stack spacing={0.5} sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="body1" fontWeight={500} noWrap>
          {submission.company.legalName}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {submission.broker.name} · {submission.owner.fullName}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: 2, flexShrink: 0 }}>
        <Chip
          label={submission.priority}
          color={PRIORITY_COLOR[submission.priority]}
          size="small"
          variant="outlined"
        />
        <Chip
          label={submission.status.replace('_', ' ')}
          color={STATUS_COLOR[submission.status]}
          size="small"
        />
        <Typography variant="caption" color="text.secondary" sx={{ minWidth: 80, textAlign: 'right' }}>
          {new Date(submission.updatedAt).toLocaleDateString()}
        </Typography>
      </Stack>
    </Box>
  );
}
