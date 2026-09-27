import { Button, Stack } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useSpiderMarks } from '../storage/useUserMarks';

export const MarkButtons = ({ spiderId }: { spiderId: string }) => {
  const { favorite, seen, toggleFavorite, toggleSeen } = useSpiderMarks(spiderId);
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
      <Button
        fullWidth
        variant={favorite ? 'contained' : 'outlined'}
        color="error"
        startIcon={favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        onClick={toggleFavorite}
        sx={{ py: 1.5, fontSize: 17 }}
      >
        {favorite ? 'Oblíbený' : 'Dát srdíčko'}
      </Button>
      <Button
        fullWidth
        variant={seen ? 'contained' : 'outlined'}
        color="primary"
        startIcon={seen ? <VisibilityIcon /> : <VisibilityOutlinedIcon />}
        onClick={toggleSeen}
        sx={{ py: 1.5, fontSize: 17 }}
      >
        {seen ? 'Viděli jsme ho!' : 'Viděli jsme ho'}
      </Button>
    </Stack>
  );
};
