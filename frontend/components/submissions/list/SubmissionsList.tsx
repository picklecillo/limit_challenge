'use client';

import { Button, Stack, Typography } from '@mui/material';

import { useSubmissions } from './SubmissionsProvider';
import { SubmissionRow } from './SubmissionRow';

export function SubmissionsList() {
  const { isFetching, isError, isEmpty, hasActiveFilters, results, onClearFilters } = useSubmissions();

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
