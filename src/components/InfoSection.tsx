import { Box, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface Props {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  highlight?: boolean;
}

export const InfoSection = ({ icon, title, children, highlight }: Props) => (
  <Box
    sx={{
      p: 2,
      borderRadius: 3,
      bgcolor: highlight ? 'secondary.main' : 'background.paper',
      color: highlight ? 'secondary.contrastText' : 'text.primary',
    }}
  >
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.75 }}>
      <Box sx={{ display: 'flex', color: highlight ? 'inherit' : 'primary.main' }}>{icon}</Box>
      <Typography variant="h6">{title}</Typography>
    </Stack>
    <Typography component="div" sx={{ fontSize: 17, lineHeight: 1.5 }}>
      {children}
    </Typography>
  </Box>
);
