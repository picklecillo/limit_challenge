'use client';

import { Box, Container, Link as MuiLink, Stack, Typography } from '@mui/material';

import { useSubmissionDetailContext } from '@/components/submissions/detail/SubmissionDetailProvider';
import { SubmissionDetails } from '@/components/submissions/detail/SubmissionDetails';
import { SubmissionContacts } from '@/components/submissions/detail/SubmissionContacts';
import { SubmissionDocuments } from '@/components/submissions/detail/SubmissionDocuments';
import { SubmissionNotes } from '@/components/submissions/detail/SubmissionNotes';

export default function SubmissionDetailPage() {
  const { query: { isFetching, isError }, onBack } = useSubmissionDetailContext();

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Stack spacing={3}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <div>
            <Typography variant="h4">Submission detail</Typography>
            <Typography color="text.secondary">
              Full submission payload with contacts, documents, and notes.
            </Typography>
          </div>
          <MuiLink
            component="button"
            onClick={onBack}
            underline="none"
            sx={{ background: 'none', border: 'none', font: 'inherit', cursor: 'pointer' }}
          >
            Back to list
          </MuiLink>
        </Box>

        {isFetching && (
          <Typography color="text.secondary">Loading…</Typography>
        )}

        {isError && (
          <Typography color="error">Failed to load submission.</Typography>
        )}

        <SubmissionDetails />
        <SubmissionContacts />
        <SubmissionDocuments />
        <SubmissionNotes />
      </Stack>
    </Container>
  );
}
