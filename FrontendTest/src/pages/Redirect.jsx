import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getByCode, recordClick } from '../utils/storage';
import { isExpired } from '../utils/shorten';
import { CircularProgress, Box, Alert, Typography, Button } from '@mui/material';
import dayjs from 'dayjs';

export default function Redirect() {
  const { code } = useParams();
  const [status, setStatus] = useState('loading'); // loading | expired | notfound | ok
  const [target, setTarget] = useState(null);

  useEffect(() => {
    const item = getByCode(code);
    if (!item) {
      setStatus('notfound');
      return;
    }
    if (isExpired(item)) {
      setStatus('expired');
      return;
    }
    // record click details
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown';
    const ref = document.referrer || 'Direct';
    recordClick(code, {
      at: dayjs().toISOString(),
      source: ref,
      coarseLocation: tz
    });
    setTarget(item.original);
    setStatus('ok');
    // redirect after short delay to allow recording
    const t = setTimeout(() => {
      window.location.href = item.original;
    }, 400);
    return () => clearTimeout(t);
  }, [code]);

  if (status === 'loading') {
    return (
      <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (status === 'notfound') {
    return <Alert severity="error">Short link not found.</Alert>;
  }

  if (status === 'expired') {
    return (
      <Box>
        <Alert severity="warning" sx={{ mb:2 }}>This short link has expired.</Alert>
        <Button variant="contained" href="/">Create a new short link</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ textAlign:'center' }}>
      <Typography variant="h6">Redirecting…</Typography>
      <Typography variant="body2">to {target}</Typography>
    </Box>
  );
}
