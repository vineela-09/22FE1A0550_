import React, { useMemo, useState } from 'react';
import { allUrls, clicksFor, clearAll } from '../utils/storage';
import { isExpired } from '../utils/shorten';
import dayjs from 'dayjs';
import {
  Box, Card, CardContent, Typography, Table, TableHead, TableRow,
  TableCell, TableBody, Button, Dialog, DialogTitle, DialogContent, DialogActions, Chip, Stack
} from '@mui/material';

export default function StatsPage() {
  const [open, setOpen] = useState(false);
  const urls = useMemo(() => allUrls(), []);

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5">Shortener Statistics</Typography>
        <Button color="error" variant="outlined" onClick={() => setOpen(true)}>Clear All Data</Button>
      </Stack>

      <Card>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Short URL</TableCell>
                <TableCell>Original</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Expiry</TableCell>
                <TableCell>Clicks</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {urls.length === 0 && (
                <TableRow><TableCell colSpan={5}>No data yet.</TableCell></TableRow>
              )}
              {urls.map(u => {
                const clicks = clicksFor(u.code);
                const expired = isExpired(u);
                return (
                  <TableRow key={u.code}>
                    <TableCell>
                      <a href={u.shortUrl} target="_blank" rel="noreferrer">{u.shortUrl}</a>
                    </TableCell>
                    <TableCell style={{maxWidth:300, overflow:'hidden', textOverflow:'ellipsis'}} title={u.original}>
                      {u.original}
                    </TableCell>
                    <TableCell>{dayjs(u.createdAt).format('YYYY-MM-DD HH:mm')}</TableCell>
                    <TableCell>
                      {u.expiresAt ? (
                        <Chip label={dayjs(u.expiresAt).format('YYYY-MM-DD HH:mm')} color={expired ? 'warning' : 'default'} />
                      ) : '—'}
                    </TableCell>
                    <TableCell>{clicks.length}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>Click Details</Typography>
        {urls.map(u => {
          const clicks = clicksFor(u.code);
          if (clicks.length === 0) return null;
          return (
            <Card key={u.code} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>{u.shortUrl}</Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Source</TableCell>
                      <TableCell>Coarse Location (Timezone)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {clicks.map((c, i) => (
                      <TableRow key={i}>
                        <TableCell>{dayjs(c.at).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                        <TableCell>{c.source}</TableCell>
                        <TableCell>{c.coarseLocation}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Clear all data?</DialogTitle>
        <DialogContent>
          This will remove all shortened URLs and click logs from this browser's localStorage.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button color="error" onClick={() => { clearAll(); window.location.reload(); }}>Clear</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
