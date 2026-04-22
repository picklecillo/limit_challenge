import { Card, CardContent, Stack } from '@mui/material';

import { StatusFilter } from './StatusFilter';
import { BrokerFilter } from './BrokerFilter';
import { CompanySearchFilter } from './CompanySearchFilter';
import { HasDocumentsFilter } from './HasDocumentsFilter';
import { ClearFiltersButton } from './ClearFiltersButton';

export function SubmissionFilters() {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <StatusFilter />
          <BrokerFilter />
          <CompanySearchFilter />
          <HasDocumentsFilter />
          <ClearFiltersButton />
        </Stack>
      </CardContent>
    </Card>
  );
}
