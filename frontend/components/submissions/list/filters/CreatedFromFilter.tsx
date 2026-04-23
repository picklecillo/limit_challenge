import { TextField } from '@mui/material';

import { useSubmissionsFilters } from '../SubmissionsFilteringProvider';

export function CreatedFromFilter() {
  const { filters, actions } = useSubmissionsFilters();

  return (
    <TextField
      type="date"
      label="Created from"
      value={filters.createdFrom}
      onChange={(event) => actions.onCreatedFromChange(event.target.value)}
      slotProps={{ inputLabel: { shrink: true } }}
      fullWidth
    />
  );
}
