'use client';

import { Button, Stack, Typography } from '@mui/material';

import { SubmissionListItem } from '@/lib/types';
import { SubmissionRow } from '@/components/submissionRow/SubmissionRow';

interface Props {
  isFetching: boolean;
  isError: boolean;
  isEmpty: boolean;
  hasActiveFilters: boolean;
  results: SubmissionListItem[] | undefined;
  onClearFilters: () => void;
}

export function SubmissionsList({ isFetching, isError, isEmpty, hasActiveFilters, results, onClearFilters }: Props) {
  return (
    <Stack spacing={1.5}>
      {isFetching ? (
        <Typography color="text.secondary">Loading...</Typography>
      ) : isError ? (
        <Typography color="error">Failed to load submissions.</Typography>
      ) : isEmpty ? (
        <Stack spacing={1} alignItems="center" sx={{ py: 4 }}>
          <Typography color="text.secondary">
            {hasActiveFilters
              ? 'No submissions match your filters.'
              : 'No submissions yet.'}
          </Typography>
          {hasActiveFilters && (
            <Button size="small" variant="outlined" onClick={onClearFilters}>
              Clear filters
            </Button>
          )}
        </Stack>
      ) : (
        results?.map((submission) => (
          <SubmissionRow key={submission.id} submission={submission} />
        ))
      )}
    </Stack>
  );
}
