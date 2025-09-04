import React from 'react';
import { Grid, TextField } from '@mui/material';

export default function UrlInputRow({ index, value, onChange }) {
  const handle = (field) => (e) => {
    onChange(index, { ...value, [field]: e.target.value });
  };
  return (
    <Grid container spacing={2} sx={{ mb: 1 }}>
      <Grid item xs={12} md={6}>
        <TextField
          label={`Original URL #${index + 1}`}
          fullWidth
          value={value.original || ''}
          onChange={handle('original')}
          placeholder="https://example.com/page"
        />
      </Grid>
      <Grid item xs={6} md={3}>
        <TextField
          label="Validity (minutes, optional)"
          fullWidth
          value={value.validity || ''}
          onChange={handle('validity')}
          placeholder="e.g., 30"
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
        />
      </Grid>
      <Grid item xs={6} md={3}>
        <TextField
          label="Preferred Shortcode (optional)"
          fullWidth
          value={value.preferred || ''}
          onChange={handle('preferred')}
          placeholder="e.g., promo2024"
        />
      </Grid>
    </Grid>
  );
}
