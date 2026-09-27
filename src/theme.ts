import { createTheme } from '@mui/material/styles';

// Přátelské „lesní“ ladění: tmavě zelená, krémové pozadí, oranžový akcent, hodně zaoblení.
export const theme = createTheme({
  palette: {
    primary: { main: '#2e5b3a', light: '#5d8a63', dark: '#1c3d26' },
    secondary: { main: '#e8862a', contrastText: '#fff' },
    background: { default: '#f6f1e7', paper: '#ffffff' },
    success: { main: '#3f8f4f' },
    warning: { main: '#e39a1c' },
    error: { main: '#c62828' },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 15,
    h5: { fontWeight: 800 },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiButton: { defaultProps: { size: 'large', disableElevation: true } },
    MuiChip: { styleOverrides: { root: { fontWeight: 600 } } },
    MuiCard: { defaultProps: { elevation: 0 } },
  },
});
