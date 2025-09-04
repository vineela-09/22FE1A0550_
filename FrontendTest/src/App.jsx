import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import ShortenerPage from './pages/ShortenerPage';
import StatsPage from './pages/StatsPage';
import Redirect from './pages/Redirect';
import { AppBar, Toolbar, Typography, Container, Button } from '@mui/material';

export default function App() {
  const location = useLocation();
  const isRedirect = location.pathname.startsWith('/r/');

  return (
    <>
      {!isRedirect && (
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              URL Shortener
            </Typography>
            <Button color="inherit" component={Link} to="/">Shorten</Button>
            <Button color="inherit" component={Link} to="/stats">Stats</Button>
          </Toolbar>
        </AppBar>
      )}
      <Container sx={{ mt: 4, mb: 6 }}>
        <Routes>
          <Route path="/" element={<ShortenerPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/r/:code" element={<Redirect />} />
        </Routes>
      </Container>
    </>
  );
}
