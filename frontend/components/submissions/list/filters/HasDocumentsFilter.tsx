import { Checkbox, FormControlLabel } from '@mui/material';

import { useSubmissionsFilters } from '../SubmissionsFilteringProvider';

export function HasDocumentsFilter() {
  const { filters, actions } = useSubmissionsFilters();

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={filters.hasDocuments}
          onChange={(event) => actions.onHasDocumentsChange(event.target.checked)}
        />
      }
      label="Has documents"
      sx={{ whiteSpace: 'nowrap', alignSelf: 'center', flexShrink: 0 }}
    />
  );
}
