'use client';

import { Button, Stack, Typography } from '@mui/material';

interface Props {
  page: number;
  totalPages: number;
  isFetching: boolean;
  hasPrevious: boolean;
  hasNext: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export function SubmissionsPagination({ page, totalPages, isFetching, hasPrevious, hasNext, onPreviousPage, onNextPage }: Props) {
  return (
    <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end">
      <Typography variant="body2" color="text.secondary">
        Page {page} of {totalPages}
      </Typography>
      <Button
        size="small"
        variant="outlined"
        disabled={!hasPrevious || isFetching}
        onClick={onPreviousPage}
      >
        Previous
      </Button>
      <Button
        size="small"
        variant="outlined"
        disabled={!hasNext || isFetching}
        onClick={onNextPage}
      >
        Next
      </Button>
    </Stack>
  );
}
