'use client';

import { Box, Button, Card, CardContent, Container, Stack, Typography } from '@mui/material';

import { useSubmissionFilters } from '@/components/submissionFilters/SubmissionFiltersProvider';
import { SubmissionFilters } from '@/components/submissionFilters/SubmissionFilters';
import { SubmissionRow } from '@/components/submissionRow/SubmissionRow';

export default function SubmissionsPage() {
  const { page, submissionsQuery, onPreviousPage, onNextPage } = useSubmissionFilters();

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack spacing={4}>
        <Box>
          <Typography variant="h4" component="h1">
            Submissions
          </Typography>
        </Box>

        <SubmissionFilters />

        <Card variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              <Box>
                {submissionsQuery.isFetching ? (
                  <div>fetching...</div>
                ) : (
                  submissionsQuery.data?.results?.map((submission) => (
                    <SubmissionRow key={submission.id} submission={submission} />
                  ))
                )}
              </Box>
              {submissionsQuery.data && (
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
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
