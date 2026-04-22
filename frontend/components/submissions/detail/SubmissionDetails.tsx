'use client';

import { Box, Card, CardContent, Divider, Stack, Typography } from '@mui/material';

import { useSubmissionDetailContext } from './SubmissionDetailProvider';
import { StatusChip } from '@/components/submissions/shared/StatusChip';
import { PriorityChip } from '@/components/submissions/shared/PriorityChip';

function InlineField({ label, value }: { label: string; value: string }) {
  return (
    <Box display="flex" gap={0.5} alignItems="baseline">
      <Typography variant="caption" color="text.secondary">{label}:</Typography>
      <Typography variant="caption">{value}</Typography>
    </Box>
  );
}

export function SubmissionDetails() {
  const { query: { data } } = useSubmissionDetailContext();

  if (!data) return null;

  return (
    <Card variant="outlined">
      <CardContent sx={{ pb: '12px !important' }}>
        <Stack spacing={1.5}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" gap={1}>
              <StatusChip status={data.status} />
              <PriorityChip priority={data.priority} />
            </Box>
            <Box display="flex" gap={3}>
              <InlineField label="Created" value={new Date(data.createdAt).toLocaleDateString()} />
              <InlineField label="Updated" value={new Date(data.updatedAt).toLocaleDateString()} />
            </Box>
          </Box>

          <Typography variant="body2">{data.summary}</Typography>

          <Divider />

          <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={1.5}>
            <Box>
              <Typography variant="overline" color="text.secondary" lineHeight={1.2} display="block" fontSize={10}>
                Broker
              </Typography>
              <Typography variant="body2" fontWeight={500}>{data.broker.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {data.broker.primaryContactEmail ?? '—'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="overline" color="text.secondary" lineHeight={1.2} display="block" fontSize={10}>
                Company
              </Typography>
              <Typography variant="body2" fontWeight={500}>{data.company.legalName}</Typography>
              <Typography variant="caption" color="text.secondary">
                {data.company.industry} · {data.company.headquartersCity}
              </Typography>
            </Box>
            <Box>
              <Typography variant="overline" color="text.secondary" lineHeight={1.2} display="block" fontSize={10}>
                Owner
              </Typography>
              <Typography variant="body2" fontWeight={500}>{data.owner.fullName}</Typography>
              <Typography variant="caption" color="text.secondary">{data.owner.email}</Typography>
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
