'use client';

import { Box, Container, Stack, Typography } from '@mui/material';

import { SubmissionFilters } from '@/components/submissions/list/filters/SubmissionFilters';
import { SubmissionsList } from '@/components/submissions/list/SubmissionsList';
import { SubmissionsPagination } from '@/components/submissions/list/SubmissionsPagination';

export default function SubmissionsPage() {
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
          <SubmissionsList />
          <SubmissionsPagination />
        </Stack>
      </Stack>
    </Container>
  );
}
