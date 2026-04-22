'use client';

import { Card, CardHeader, CardContent, Divider, Link as MuiLink, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

import { useSubmissionDetailContext } from './SubmissionDetailProvider';

export function SubmissionDocuments() {
  const { query: { data } } = useSubmissionDetailContext();

  if (!data) return null;

  return (
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
                  <TableCell>{new Date(d.uploadedAt).toLocaleDateString()}</TableCell>
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
  );
}
