'use client';

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Divider,
  Link as MuiLink,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useSubmissionDetailContext } from '@/components/submissions/detail/SubmissionDetailProvider';

const PRIORITY_COLOR: Record<string, 'error' | 'warning' | 'default'> = {
  high: 'error',
  medium: 'warning',
  low: 'default',
};

const STATUS_COLOR: Record<string, 'default' | 'info' | 'success' | 'error'> = {
  new: 'info',
  in_review: 'default',
  closed: 'success',
  lost: 'error',
};

function InlineField({ label, value }: { label: string; value: string }) {
  return (
    <Box display="flex" gap={0.5} alignItems="baseline">
      <Typography variant="caption" color="text.secondary">{label}:</Typography>
      <Typography variant="caption">{value}</Typography>
    </Box>
  );
}

export default function SubmissionDetailPage() {
  const { query: { data, isFetching, isError }, onBack } = useSubmissionDetailContext();

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

        {data && (
          <Stack spacing={3}>
            <Card variant="outlined">
              <CardContent sx={{ pb: '12px !important' }}>
                <Stack spacing={1.5}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" gap={1}>
                      <Chip
                        label={data.status.replace('_', ' ')}
                        size="small"
                        color={STATUS_COLOR[data.status]}
                      />
                      <Chip
                        label={data.priority}
                        size="small"
                        color={PRIORITY_COLOR[data.priority] ?? 'default'}
                        variant="outlined"
                      />
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

            <Card variant="outlined">
              <CardHeader
                title={`Contacts (${data.contacts.length})`}
                titleTypographyProps={{ variant: 'h6' }}
              />
              <Divider />
              <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                {data.contacts.length === 0 ? (
                  <Typography color="text.secondary" sx={{ p: 2 }}>
                    No contacts.
                  </Typography>
                ) : (
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.contacts.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell>{c.name}</TableCell>
                          <TableCell>{c.role}</TableCell>
                          <TableCell>{c.email}</TableCell>
                          <TableCell>{c.phone}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardHeader
                title={`Documents (${data.documents.length})`}
                titleTypographyProps={{ variant: 'h6' }}
              />
              <Divider />
              <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                {data.documents.length === 0 ? (
                  <Typography color="text.secondary" sx={{ p: 2 }}>
                    No documents.
                  </Typography>
                ) : (
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Uploaded</TableCell>
                        <TableCell>File</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.documents.map((d) => (
                        <TableRow key={d.id}>
                          <TableCell>{d.title}</TableCell>
                          <TableCell>{d.docType}</TableCell>
                          <TableCell>
                            {new Date(d.uploadedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {d.fileUrl ? (
                              <MuiLink href={d.fileUrl} target="_blank" rel="noopener">
                                Download
                              </MuiLink>
                            ) : (
                              '—'
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

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
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
