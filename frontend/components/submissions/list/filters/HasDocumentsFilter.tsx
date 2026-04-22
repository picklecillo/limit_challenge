import { Checkbox, FormControlLabel } from '@mui/material';

import { useSubmissions } from '../SubmissionsProvider';

export function HasDocumentsFilter() {
  const { hasDocuments, onHasDocumentsChange } = useSubmissions();

  return (
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
  );
}
