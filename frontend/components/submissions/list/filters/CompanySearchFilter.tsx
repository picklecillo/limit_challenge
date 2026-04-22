import { TextField } from '@mui/material';

import { useSubmissions } from '../SubmissionsProvider';

export function CompanySearchFilter() {
  const { companySearchInput, onCompanySearchChange } = useSubmissions();

  return (
    <TextField
      label="Company search"
      value={companySearchInput}
      onChange={(event) => onCompanySearchChange(event.target.value)}
      fullWidth
    />
  );
}
