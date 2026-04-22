import { Button, Card, CardContent, Checkbox, FormControlLabel, MenuItem, Stack, TextField } from '@mui/material';

import { SubmissionStatus } from '@/lib/types';
import { useSubmissions } from './SubmissionsProvider';

const STATUS_OPTIONS: { label: string; value: SubmissionStatus | '' }[] = [
  { label: 'All statuses', value: '' },
  { label: 'New', value: 'new' },
  { label: 'In Review', value: 'in_review' },
  { label: 'Closed', value: 'closed' },
  { label: 'Lost', value: 'lost' },
];

export function SubmissionFilters() {
  const {
    status,
    brokerId,
    companySearchInput,
    hasDocuments,
    hasActiveFilters,
    brokers,
    onStatusChange,
    onBrokerChange,
    onCompanySearchChange,
    onHasDocumentsChange,
    onClearFilters,
  } = useSubmissions();

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            select
            label="Status"
            value={status}
            onChange={(event) => onStatusChange(event.target.value)}
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
            onChange={(event) => onBrokerChange(event.target.value)}
            fullWidth
          >
            <MenuItem value="">All brokers</MenuItem>
            {brokers.map((broker) => (
              <MenuItem key={broker.id} value={String(broker.id)}>
                {broker.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Company search"
            value={companySearchInput}
            onChange={(event) => onCompanySearchChange(event.target.value)}
            fullWidth
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={hasDocuments}
                onChange={(event) => onHasDocumentsChange(event.target.checked)}
              />
            }
            label="Has documents"
            sx={{ whiteSpace: 'nowrap', alignSelf: 'center', flexShrink: 0 }}
          />
          <Button
            variant="outlined"
            color="inherit"
            disabled={!hasActiveFilters}
            onClick={onClearFilters}
            sx={{ whiteSpace: 'nowrap', alignSelf: 'center', flexShrink: 0 }}
          >
            Clear filters
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
