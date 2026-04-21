'use client';

import { Box, Container, Stack, Typography } from '@mui/material';

import { useSubmissions } from '@/components/submissions/list/SubmissionsProvider';
import { SubmissionFilters } from '@/components/submissions/list/SubmissionFilters';
import { SubmissionsList } from '@/components/submissions/list/SubmissionsList';
import { SubmissionsPagination } from '@/components/submissions/list/SubmissionsPagination';

export default function SubmissionsPage() {
  const {
    status,
    brokerId,
    companySearchInput,
    hasDocuments,
    hasActiveFilters,
    page,
    brokers,
    results,
    isEmpty,
    submissionsQuery,
    onStatusChange,
    onBrokerChange,
    onCompanySearchChange,
    onHasDocumentsChange,
    onClearFilters,
    onPreviousPage,
    onNextPage,
  } = useSubmissions();

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack spacing={4}>
        <Box>
          <Typography variant="h4" component="h1">
            Submissions
          </Typography>
        </Box>

        <SubmissionFilters
          status={status}
          brokerId={brokerId}
          companySearchInput={companySearchInput}
          hasDocuments={hasDocuments}
          hasActiveFilters={hasActiveFilters}
          brokers={brokers}
          onStatusChange={onStatusChange}
          onBrokerChange={onBrokerChange}
          onCompanySearchChange={onCompanySearchChange}
          onHasDocumentsChange={onHasDocumentsChange}
          onClearFilters={onClearFilters}
        />

        <Stack spacing={2}>
          <SubmissionsList
            isFetching={submissionsQuery.isFetching}
            isError={submissionsQuery.isError}
            isEmpty={isEmpty}
            hasActiveFilters={hasActiveFilters}
            results={results}
            onClearFilters={onClearFilters}
          />
          {submissionsQuery.data && !isEmpty && (
            <SubmissionsPagination
              page={page}
              totalPages={submissionsQuery.data.totalPages}
              isFetching={submissionsQuery.isFetching}
              hasPrevious={!!submissionsQuery.data.previous}
              hasNext={!!submissionsQuery.data.next}
              onPreviousPage={onPreviousPage}
              onNextPage={onNextPage}
            />
          )}
        </Stack>
      </Stack>
    </Container>
  );
}
