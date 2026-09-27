import { Box, Chip, Stack, Typography } from '@mui/material';
import StraightenIcon from '@mui/icons-material/Straighten';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ForestIcon from '@mui/icons-material/Forest';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { DANGER_LABELS, type Danger, type Spider } from '../data/schema';
import { MONTHS_SHORT, formatMm } from '../data/search';
import { PhotoGallery } from './PhotoGallery';
import { InfoSection } from './InfoSection';
import { MarkButtons } from './MarkButtons';

const DANGER_COLOR: Record<Danger, 'success' | 'warning' | 'error'> = {
  neskodny: 'success',
  'muze-kousnout': 'warning',
  jedovaty: 'error',
};

export const SpiderDetail = ({ spider }: { spider: Spider }) => {
  const { size, lifestyle, occurrence } = spider;
  return (
    <Box sx={{ pb: 4 }}>
      <PhotoGallery photos={spider.photos} alt={spider.nameCs} />

      <Stack spacing={2} sx={{ px: 2, pt: 2 }}>
        <Box>
          <Typography variant="h5" component="h1">
            {spider.nameCs}
          </Typography>
          {spider.family && (
            <Typography color="text.secondary" sx={{ fontWeight: 600 }}>
              čeleď {spider.family}
            </Typography>
          )}
        </Box>

        <Stack direction="row" useFlexGap spacing={1} sx={{ flexWrap: 'wrap' }}>
          <Chip
            label={DANGER_LABELS[spider.dangerToHumans]}
            color={DANGER_COLOR[spider.dangerToHumans]}
          />
          <Chip
            icon={<StraightenIcon />}
            label={`samice ${formatMm(size.femaleMm)}`}
            variant="outlined"
          />
          {size.maleMm && (
            <Chip
              icon={<StraightenIcon />}
              label={`sameček ${formatMm(size.maleMm)}`}
              variant="outlined"
            />
          )}
        </Stack>
        {size.note && (
          <Typography color="text.secondary" sx={{ mt: -1 }}>
            {size.note}
          </Typography>
        )}

        <MarkButtons spiderId={spider.id} />

        {spider.funFact && (
          <InfoSection icon={<LightbulbIcon />} title="Věděl jsi?" highlight>
            {spider.funFact}
          </InfoSection>
        )}
        <InfoSection icon={<GpsFixedIcon />} title="Jak loví">
          {lifestyle.hunting}
        </InfoSection>
        <InfoSection icon={<RestaurantIcon />} title="Co jí">
          {lifestyle.food}
        </InfoSection>
        <InfoSection icon={<ForestIcon />} title="Kde ho najdeš">
          {occurrence.habitat}
          <Typography component="div" color="text.secondary" sx={{ mt: 0.5 }}>
            {occurrence.czech}
          </Typography>
        </InfoSection>
        {occurrence.months && occurrence.months.length > 0 && (
          <InfoSection icon={<CalendarMonthIcon />} title="Kdy ho potkáš">
            <Stack direction="row" useFlexGap spacing={0.5} sx={{ flexWrap: 'wrap', mt: 0.5 }}>
              {MONTHS_SHORT.map((m, i) => {
                const active = occurrence.months!.includes(i + 1);
                return (
                  <Chip
                    key={m}
                    label={m}
                    size="small"
                    color={active ? 'primary' : 'default'}
                    variant={active ? 'filled' : 'outlined'}
                    sx={{ opacity: active ? 1 : 0.5 }}
                  />
                );
              })}
            </Stack>
          </InfoSection>
        )}
        <InfoSection icon={<HourglassBottomIcon />} title="Jak dlouho žije">
          {spider.lifespan}
        </InfoSection>
        <InfoSection icon={<AcUnitIcon />} title="Co dělá v zimě">
          {lifestyle.wintering}
        </InfoSection>
      </Stack>
    </Box>
  );
};
