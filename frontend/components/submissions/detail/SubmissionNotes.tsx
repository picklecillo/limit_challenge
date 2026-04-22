'use client';

import { Box, Card, CardContent, CardHeader, Divider, Stack, Typography } from '@mui/material';

import { useSubmissionDetailContext } from './SubmissionDetailProvider';

export function SubmissionNotes() {
  const { query: { data } } = useSubmissionDetailContext();

  if (!data) return null;

  return (
    <Card variant="outlined">
      <CardHeader
        title={`Notes (${data.notes.length})`}
        titleTypographyProps={{ variant: 'h6' }}
      />
      <Divider />
      <CardContent>
        {data.notes.length === 0 ? (
          <Typography color="text.secondary">No notes.</Typography>
        ) : (
          <Stack spacing={2}>
            {data.notes.map((n) => (
              <Box key={n.id}>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="caption" fontWeight={600}>
                    {n.authorName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(n.createdAt).toLocaleString()}
                  </Typography>
                </Box>
                <Typography variant="body2">{n.body}</Typography>
              </Box>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
