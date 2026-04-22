'use client';

import { Button, Stack, Typography } from '@mui/material';

import { useSubmissionsFilters } from './SubmissionsFilteringProvider';
import { useSubmissionsData } from './SubmissionsProvider';

export function SubmissionsPagination() {
  const { isEmpty, isFetching, totalPages, hasPreviousPage, hasNextPage } = useSubmissionsData();
  const { filters, actions } = useSubmissionsFilters();

  if (totalPages === 0 || isEmpty) return null;

  return (
    <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end">
      <Typography variant="body2" color="text.secondary">
        Page {filters.page} of {totalPages}
      </Typography>
      <Button
        size="small"
        variant="outlined"
        disabled={!hasPreviousPage || isFetching}
        onClick={actions.onPreviousPage}
      >
        Previous
      </Button>
      <Button
        size="small"
        variant="outlined"
        disabled={!hasNextPage || isFetching}
        onClick={actions.onNextPage}
      >
        Next
      </Button>
    </Stack>
  );
}
