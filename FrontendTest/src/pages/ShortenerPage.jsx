import React, { useState } from 'react';
import { Box, Button, Card, CardContent, Typography, Alert, List, ListItem, ListItemText, Chip } from '@mui/material';
import UrlInputRow from '../components/UrlInputRow';
import { generateCode, validateUrl, computeExpiry } from '../utils/shorten';
import { saveUrl } from '../utils/storage';
import dayjs from 'dayjs';

export default function ShortenerPage() {
  const [rows, setRows] = useState([{},{},{},{},{}]); // 5 rows
  const [errors, setErrors] = useState([]);
  const [results, setResults] = useState([]);

  const onChangeRow = (idx, val) => {
    const copy = [...rows];
    copy[idx] = val;
    setRows(copy);
  };

  const handleShorten = () => {
    const collected = [];
    const errs = [];

    rows.forEach((r, i) => {
      if (!r.original) return; // empty row, skip
      if (!validateUrl(r.original)) {
        errs.push(`Row ${i+1}: Invalid URL`);
        return;
      }
      let validity = r.validity?.trim();
      if (validity && (!/^[0-9]+$/.test(validity) || parseInt(validity,10) <= 0)) {
        errs.push(`Row ${i+1}: Validity must be a positive integer (minutes)`);
        return;
      }
      const gen = generateCode(r.preferred?.trim());
      if (gen.error) {
        errs.push(`Row ${i+1}: ${gen.error}`);
        return;
      }
      const code = gen.code;
      const createdAt = dayjs().toISOString();
      const expiresAt = computeExpiry(validity);
      const shortUrl = `${window.location.origin}/r/${code}`;
      const item = { code, original: r.original.trim(), shortUrl, createdAt, expiresAt };
      saveUrl(item);
      collected.push(item);
    });

    setErrors(errs);
    setResults(collected);
  };

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Shorten URLs (up to 5 at once)</Typography>
          {rows.map((r, idx) => (
            <UrlInputRow key={idx} index={idx} value={r} onChange={onChangeRow} />
          ))}
          <Button variant="contained" onClick={handleShorten}>Shorten</Button>
        </CardContent>
      </Card>

      {errors.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.map((e, i) => <div key={i}>{e}</div>)}
        </Alert>
      )}

      {results.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Shortened Links</Typography>
            <List>
              {results.map((r) => (
                <ListItem key={r.code} divider>
                  <ListItemText
                    primary={<a href={r.shortUrl} target="_blank" rel="noreferrer">{r.shortUrl}</a>}
                    secondary={`Original: ${r.original}`}
                  />
                  {r.expiresAt ? (
                    <Chip label={`Expires: ${dayjs(r.expiresAt).format('YYYY-MM-DD HH:mm')}`} />
                  ) : (
                    <Chip label="No Expiry" />
                  )}
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
