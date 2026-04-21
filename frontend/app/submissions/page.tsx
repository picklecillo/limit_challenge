'use client';

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useBrokerOptions } from '@/lib/hooks/useBrokerOptions';
import { useSubmissionsList } from '@/lib/hooks/useSubmissions';
import { SubmissionStatus } from '@/lib/types';
import { SubmissionRow } from './SubmissionRow';

const STATUS_OPTIONS: { label: string; value: SubmissionStatus | '' }[] = [
  { label: 'All statuses', value: '' },
  { label: 'New', value: 'new' },
  { label: 'In Review', value: 'in_review' },
  { label: 'Closed', value: 'closed' },
  { label: 'Lost', value: 'lost' },
];

export default function SubmissionsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const status = (searchParams.get('status') ?? '') as SubmissionStatus | '';
  const brokerId = searchParams.get('brokerId') ?? '';
  const companySearch = searchParams.get('companySearch') ?? '';
  const page = parseInt(searchParams.get('page') ?? '1', 10);

  const [companySearchInput, setCompanySearchInput] = useState(companySearch);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCompanySearchInput(companySearch);
  }, [companySearch]);

  const setFilter = useCallback(
    (updates: Record<string, string>, resetPage = true) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      if (resetPage) params.delete('page');
      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router],
  );

  const handleCompanyChange = (value: string) => {
    setCompanySearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setFilter({ companySearch: value });
    }, 300);
  };

  const filters = useMemo(
    () => ({
      status: status || undefined,
      brokerId: brokerId || undefined,
      companySearch: companySearch || undefined,
      page,
    }),
    [status, brokerId, companySearch, page],
  );

  const submissionsQuery = useSubmissionsList(filters);
  const brokerQuery = useBrokerOptions();

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack spacing={4}>
        <Box>
          <Typography variant="h4" component="h1">
            Submissions
          </Typography>
        </Box>

        <Card variant="outlined">
          <CardContent>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                select
                label="Status"
                value={status}
                onChange={(event) => setFilter({ status: event.target.value })}
                fullWidth
              >
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value || 'all'} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Broker"
                value={brokerId}
                onChange={(event) => setFilter({ brokerId: event.target.value })}
                fullWidth
              >
                <MenuItem value="">All brokers</MenuItem>
                {brokerQuery.data?.results?.map((broker) => (
                  <MenuItem key={broker.id} value={String(broker.id)}>
                    {broker.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Company search"
                value={companySearchInput}
                onChange={(event) => handleCompanyChange(event.target.value)}
                fullWidth
              />
            </Stack>
          </CardContent>
        </Card>

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
                    onClick={() => setFilter({ page: String(page - 1) }, false)}
                  >
                    Previous
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    disabled={!submissionsQuery.data.next || submissionsQuery.isFetching}
                    onClick={() => setFilter({ page: String(page + 1) }, false)}
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
