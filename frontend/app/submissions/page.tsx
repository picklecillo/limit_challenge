'use client';

import { Box, Button, Container, Stack, Typography } from '@mui/material';

import { useSubmissionFilters } from '@/components/submissionFilters/SubmissionFiltersProvider';
import { SubmissionFilters } from '@/components/submissionFilters/SubmissionFilters';
import { SubmissionRow } from '@/components/submissionRow/SubmissionRow';

export default function SubmissionsPage() {
  const {
    status,
    brokerId,
    companySearchInput,
    page,
    submissionsQuery,
    onPreviousPage,
    onNextPage,
    onClearFilters,
  } = useSubmissionFilters();

  const hasActiveFilters = !!(status || brokerId || companySearchInput);
  const results = submissionsQuery.data?.results;
  const isEmpty = !submissionsQuery.isFetching && results?.length === 0;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack spacing={4}>
        <Box>
          <Typography variant="h4" component="h1">
            Submissions
          </Typography>
        </Box>

        <SubmissionFilters />

        <Stack spacing={2}>
          <Stack spacing={1.5}>
            {submissionsQuery.isFetching ? (
              <Typography color="text.secondary">Loading...</Typography>
            ) : submissionsQuery.isError ? (
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
          {submissionsQuery.data && !isEmpty && (
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
          )}
        </Stack>
      </Stack>
    </Container>
  );
}
