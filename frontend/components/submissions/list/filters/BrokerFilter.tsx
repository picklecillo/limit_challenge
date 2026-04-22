import { MenuItem, TextField } from '@mui/material';

import { useSubmissions } from '../SubmissionsProvider';

export function BrokerFilter() {
  const { brokerId, brokers, onBrokerChange } = useSubmissions();

  return (
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
  );
}
