import { useRef, useState } from 'react';
import { Box, Link, Stack, Typography } from '@mui/material';
import type { Photo } from '../data/schema';

const base = import.meta.env.BASE_URL;

/** Fotky vedle sebe, přejíždění prstem (scroll-snap), tečky a autor pod fotkou. */
export const PhotoGallery = ({ photos, alt }: { photos: Photo[]; alt: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  if (photos.length === 0) {
    return (
      <Box
        sx={{
          aspectRatio: '4 / 3',
          bgcolor: 'primary.light',
          display: 'grid',
          placeItems: 'center',
          fontSize: 72,
        }}
      >
        🕷️
      </Box>
    );
  }

  const onScroll = () => {
    const el = ref.current;
    if (el) setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };
  const current = photos[Math.min(index, photos.length - 1)];

  return (
    <Box>
      <Box
        ref={ref}
        onScroll={onScroll}
        sx={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          bgcolor: '#1c3d26',
        }}
      >
        {photos.map((p, i) => (
          <Box
            key={p.src}
            component="img"
            src={base + p.src}
            alt={i === 0 ? alt : ''}
            loading={i === 0 ? 'eager' : 'lazy'}
            sx={{
              flex: '0 0 100%',
              width: '100%',
              aspectRatio: '4 / 3',
              objectFit: 'cover',
              scrollSnapAlign: 'start',
            }}
          />
        ))}
      </Box>
      {photos.length > 1 && (
        <Stack direction="row" spacing={0.75} sx={{ justifyContent: 'center', mt: 1 }}>
          {photos.map((p, i) => (
            <Box
              key={p.src}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: i === index ? 'primary.main' : 'action.disabled',
              }}
            />
          ))}
        </Stack>
      )}
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', textAlign: 'center', px: 2, mt: 0.5 }}
      >
        Foto:{' '}
        <Link href={current.sourceUrl} target="_blank" rel="noopener" color="inherit">
          {current.author}
        </Link>
        , {current.license}
      </Typography>
    </Box>
  );
};
