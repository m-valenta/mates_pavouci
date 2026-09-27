import { Avatar, Box, Card, CardActionArea, Stack, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import type { Spider } from '../data/schema';
import { useSpiderMarks } from '../storage/useUserMarks';

interface Props {
  spider: Spider;
  selected: boolean;
  onSelect: (id: string) => void;
}

const base = import.meta.env.BASE_URL;

export const SpiderCard = ({ spider, selected, onSelect }: Props) => {
  const { favorite, seen } = useSpiderMarks(spider.id);
  const thumb = spider.photos[0]?.thumb ?? spider.photos[0]?.src;
  return (
    <Card
      sx={{
        border: 2,
        borderColor: selected ? 'primary.main' : favorite ? 'error.light' : 'transparent',
        bgcolor: selected ? 'primary.light' : 'background.paper',
        color: selected ? 'primary.contrastText' : 'text.primary',
      }}
    >
      <CardActionArea onClick={() => onSelect(spider.id)} sx={{ p: 1.25 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Avatar
            variant="rounded"
            src={thumb ? base + thumb : undefined}
            alt=""
            sx={{
              width: 64,
              height: 64,
              borderRadius: '12px',
              bgcolor: 'primary.light',
              fontSize: 28,
            }}
          >
            🕷️
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle1" noWrap sx={{ lineHeight: 1.2 }}>
              {spider.nameCs}
            </Typography>
            {spider.family && (
              <Typography variant="body2" noWrap sx={{ opacity: 0.75 }}>
                {spider.family}
              </Typography>
            )}
          </Box>
          <Stack direction="row" spacing={0.5} sx={{ color: selected ? 'inherit' : undefined }}>
            {favorite && <FavoriteIcon color={selected ? 'inherit' : 'error'} fontSize="small" />}
            {seen && <VisibilityIcon color={selected ? 'inherit' : 'primary'} fontSize="small" />}
          </Stack>
        </Stack>
      </CardActionArea>
    </Card>
  );
};
