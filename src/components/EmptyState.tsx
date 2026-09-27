import { Box, Typography } from '@mui/material';

interface Props {
  emoji: string;
  title: string;
  hint?: string;
}

export const EmptyState = ({ emoji, title, hint }: Props) => (
  <Box sx={{ textAlign: 'center', py: 6, px: 2, color: 'text.secondary' }}>
    <Typography sx={{ fontSize: 56, lineHeight: 1, mb: 1.5 }}>{emoji}</Typography>
    <Typography variant="h6" color="text.primary">
      {title}
    </Typography>
    {hint && <Typography sx={{ mt: 0.5 }}>{hint}</Typography>}
  </Box>
);
