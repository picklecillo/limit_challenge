import { Button } from '@mui/material';

import { useSubmissions } from '../SubmissionsProvider';

export function ClearFiltersButton() {
  const { hasActiveFilters, onClearFilters } = useSubmissions();

  return (
    <Button
      variant="outlined"
      color="inherit"
      disabled={!hasActiveFilters}
      onClick={onClearFilters}
      sx={{ whiteSpace: 'nowrap', alignSelf: 'center', flexShrink: 0 }}
    >
      Clear filters
    </Button>
  );
}
