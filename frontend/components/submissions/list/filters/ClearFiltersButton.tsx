import { Button } from '@mui/material';

import { useSubmissionsFilters } from '../SubmissionsFilteringProvider';

export function ClearFiltersButton() {
  const { filters, actions } = useSubmissionsFilters();

  return (
    <Button
      variant="outlined"
      color="inherit"
      disabled={!filters.hasActiveFilters}
      onClick={actions.onClearFilters}
      sx={{ whiteSpace: 'nowrap', alignSelf: 'center', flexShrink: 0 }}
    >
      Clear filters
    </Button>
  );
}
