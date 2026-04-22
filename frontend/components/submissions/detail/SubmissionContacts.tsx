'use client';

import { Card, CardHeader, CardContent, Divider, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

import { useSubmissionDetailContext } from './SubmissionDetailProvider';

export function SubmissionContacts() {
  const { query: { data } } = useSubmissionDetailContext();

  if (!data) return null;

  return (
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
  );
}
