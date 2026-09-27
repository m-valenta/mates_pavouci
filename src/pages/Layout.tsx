import {
  AppBar,
  Box,
  Chip,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate, useParams } from 'react-router-dom';
import { useSpider, useSpiderList } from '../data/SpidersContext';
import { useUserMarks } from '../storage/useUserMarks';
import { SpiderList } from '../components/SpiderList';
import { SpiderDetail } from '../components/SpiderDetail';
import { EmptyState } from '../components/EmptyState';

const LIST_WIDTH = 360;

/**
 * Mobil: buď seznam, nebo detail (podle URL). Desktop: seznam vlevo, detail vpravo.
 */
export const Layout = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const spiders = useSpiderList();
  const spider = useSpider(id);
  const { marks } = useUserMarks();
  const seenCount = Object.keys(marks.seen).length;

  const showDetailOnly = !isDesktop && Boolean(id);
  const select = (spiderId: string) => navigate(`/pavouk/${spiderId}`);

  const list = <SpiderList spiders={spiders} selectedId={id} onSelect={select} />;
  const detail = spider ? (
    <SpiderDetail key={spider.id} spider={spider} />
  ) : id ? (
    <EmptyState emoji="🕸️" title="Tenhle pavouk tu není" hint="Vyber jiného ze seznamu." />
  ) : (
    <EmptyState emoji="🕷️" title="Vyber si pavouka" hint="Klepni na některého vlevo." />
  );

  return (
    <Box sx={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="sticky" color="primary" enableColorOnDark>
        <Toolbar>
          {showDetailOnly ? (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="Zpět na seznam"
              onClick={() => navigate('/')}
            >
              <ArrowBackIcon />
            </IconButton>
          ) : (
            <Typography sx={{ fontSize: 26, mr: 1 }}>🕷️</Typography>
          )}
          <Typography variant="h6" component="div" noWrap sx={{ flex: 1 }}>
            {showDetailOnly && spider ? spider.nameCs : 'Mates pavouci'}
          </Typography>
          <Chip
            icon={<VisibilityIcon />}
            label={seenCount}
            size="small"
            sx={{
              bgcolor: 'rgba(255,255,255,0.18)',
              color: 'inherit',
              '& .MuiChip-icon': { color: 'inherit' },
            }}
            aria-label={`Viděli jsme ${seenCount} pavouků`}
          />
        </Toolbar>
      </AppBar>

      {isDesktop ? (
        <Box sx={{ display: 'flex', flex: 1, minHeight: 0 }}>
          <Box
            sx={{
              width: LIST_WIDTH,
              flexShrink: 0,
              borderRight: 1,
              borderColor: 'divider',
              overflowY: 'auto',
              height: 'calc(100dvh - 64px)',
              position: 'sticky',
              top: 64,
            }}
          >
            {list}
          </Box>
          <Box sx={{ flex: 1, maxWidth: 720, mx: 'auto', width: '100%' }}>{detail}</Box>
        </Box>
      ) : showDetailOnly ? (
        detail
      ) : (
        list
      )}
    </Box>
  );
};
