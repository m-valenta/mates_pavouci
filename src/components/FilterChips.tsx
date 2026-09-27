import { Chip, Stack } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import type { ListFilter } from '../storage/ListStateContext';

interface Props {
  value: ListFilter;
  onChange: (f: ListFilter) => void;
  favoritesCount: number;
  seenCount: number;
}

export const FilterChips = ({ value, onChange, favoritesCount, seenCount }: Props) => {
  const toggle = (f: ListFilter) => onChange(value === f ? 'all' : f);
  return (
    <Stack direction="row" spacing={1}>
      <Chip
        icon={<FavoriteIcon />}
        label={`Oblíbení (${favoritesCount})`}
        color="error"
        variant={value === 'favorites' ? 'filled' : 'outlined'}
        onClick={() => toggle('favorites')}
        sx={{ height: 40, px: 0.5 }}
      />
      <Chip
        icon={<VisibilityIcon />}
        label={`Viděli jsme (${seenCount})`}
        color="primary"
        variant={value === 'seen' ? 'filled' : 'outlined'}
        onClick={() => toggle('seen')}
        sx={{ height: 40, px: 0.5 }}
      />
    </Stack>
  );
};
