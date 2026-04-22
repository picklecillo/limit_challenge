import { Box, Card, CardActionArea, Stack, Typography } from '@mui/material';
import Link from 'next/link';

import { SubmissionListItem, SubmissionPriority } from '@/lib/types';
import { StatusChip } from '@/components/submissions/shared/StatusChip';
import { PriorityChip } from '@/components/submissions/shared/PriorityChip';

const PRIORITY_BORDER: Record<SubmissionPriority, string> = {
  high: 'error.main',
  medium: 'warning.main',
  low: 'divider',
};

interface Props {
  submission: SubmissionListItem;
}

export function SubmissionRow({ submission }: Props) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderLeftWidth: 4,
        borderLeftColor: PRIORITY_BORDER[submission.priority],
        transition: 'box-shadow 0.15s',
        '&:hover': { boxShadow: 3 },
      }}
    >
      <CardActionArea component={Link} href={`/submissions/${submission.id}`} sx={{ px: 2.5, py: 2 }}>
        <Stack spacing={1.5}>
          {/* Header row */}
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="subtitle1" fontWeight={600} noWrap>
                {submission.company.legalName}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {submission.company.industry} · {submission.company.headquartersCity}
              </Typography>
            </Box>
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ flexShrink: 0, pt: 0.25 }}>
              <PriorityChip priority={submission.priority} />
              <StatusChip status={submission.status} />
            </Stack>
          </Stack>

          {/* Latest note preview */}
          {submission.latestNote && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                fontStyle: 'italic',
              }}
            >
              "{submission.latestNote.bodyPreview}"
            </Typography>
          )}

          {/* Footer row */}
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="caption" color="text.secondary">
              {submission.broker.name} · {submission.owner.fullName}
            </Typography>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Typography variant="caption" color="text.secondary">
                {submission.documentCount} doc{submission.documentCount !== 1 ? 's' : ''}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {submission.noteCount} note{submission.noteCount !== 1 ? 's' : ''}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(submission.updatedAt).toLocaleDateString()}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardActionArea>
    </Card>
  );
}
