import { MenuItem, TextField } from '@mui/material';

import { useBrokerOptions } from '@/lib/hooks/useBrokerOptions';
import { useSubmissionsFilters } from '../SubmissionsFilteringProvider';

export function BrokerFilter() {
  const { filters, actions } = useSubmissionsFilters();
  const { data: brokers = [] } = useBrokerOptions();

  return (
    <TextField
      select
      label="Broker"
      value={filters.brokerId}
      onChange={(event) => actions.onBrokerChange(event.target.value)}
      fullWidth
    >
      <MenuItem value="">All brokers</MenuItem>
      {brokers.map((broker) => (
        <MenuItem key={broker.id} value={String(broker.id)}>
          {broker.name}
        </MenuItem>
      ))}
    </TextField>
  );
}
