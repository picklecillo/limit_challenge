'use client';

import { Button, Stack, Typography } from '@mui/material';

import { useSubmissions } from './SubmissionsProvider';

export function SubmissionsPagination() {
  const { page, isEmpty, submissionsQuery, onPreviousPage, onNextPage } = useSubmissions();

  if (!submissionsQuery.data || isEmpty) return null;

  return (
    <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end">
      <Typography variant="body2" color="text.secondary">
        Page {page} of {submissionsQuery.data.totalPages}
      </Typography>
      <Button
        size="small"
        variant="outlined"
        disabled={!submissionsQuery.data.previous || submissionsQuery.isFetching}
        onClick={onPreviousPage}
      >
        Previous
      </Button>
      <Button
        size="small"
        variant="outlined"
        disabled={!submissionsQuery.data.next || submissionsQuery.isFetching}
        onClick={onNextPage}
      >
        Next
      </Button>
    </Stack>
  );
}
