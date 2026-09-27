import { HashRouter, Route, Routes } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useSpiders } from './data/useSpiders';
import { SpidersProvider } from './data/SpidersContext';
import { UserMarksProvider } from './storage/useUserMarks';
import { ListStateProvider } from './storage/ListStateContext';
import { Layout } from './pages/Layout';

export default function App() {
  const data = useSpiders();

  if (data.status === 'loading') {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '100dvh' }}>
        <CircularProgress />
      </Box>
    );
  }
  if (data.status === 'error') {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">Data o pavoucích se nepodařilo načíst.</Typography>
        <Typography color="text.secondary">{data.message}</Typography>
      </Box>
    );
  }

  return (
    <SpidersProvider spiders={data.spiders}>
      <UserMarksProvider>
        <ListStateProvider>
          <HashRouter>
            <Routes>
              <Route path="/" element={<Layout />} />
              <Route path="/pavouk/:id" element={<Layout />} />
              <Route path="/obnovit" element={<Layout restore />} />
              <Route path="*" element={<Layout />} />
            </Routes>
          </HashRouter>
        </ListStateProvider>
      </UserMarksProvider>
    </SpidersProvider>
  );
}
