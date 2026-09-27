import { IconButton, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: Props) => (
  <TextField
    fullWidth
    placeholder="Hledej pavouka…"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    slotProps={{
      input: {
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: value ? (
          <InputAdornment position="end">
            <IconButton aria-label="Smazat hledání" onClick={() => onChange('')} edge="end">
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        ) : null,
        sx: { bgcolor: 'background.paper', borderRadius: 999 },
      },
    }}
    sx={{ '& fieldset': { borderRadius: 999 } }}
  />
);
