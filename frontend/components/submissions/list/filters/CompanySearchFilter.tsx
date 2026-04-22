import { TextField } from '@mui/material';

import { useSubmissionsFilters } from '../SubmissionsFilteringProvider';

export function CompanySearchFilter() {
  const { filters, actions } = useSubmissionsFilters();

  return (
    <TextField
      label="Company search"
      value={filters.companySearchInput}
      onChange={(event) => actions.onCompanySearchChange(event.target.value)}
      fullWidth
    />
  );
}
