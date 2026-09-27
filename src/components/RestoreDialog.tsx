import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSpiderList } from '../data/SpidersContext';
import { useUserMarks, type UserMarks } from '../storage/useUserMarks';
import { decodeBackup, mergeMarks } from '../storage/backup';

/** Stránka /obnovit?d=<kód>: ukáže, co je v záloze, a nechá vybrat sloučení nebo nahrazení. */
export const RestoreDialog = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const spiders = useSpiderList();
  const { marks, replaceAll } = useUserMarks();
  const [incoming, setIncoming] = useState<UserMarks | null>(null);
  const [error, setError] = useState<string | null>(null);

  const code = params.get('d') ?? '';
  useEffect(() => {
    decodeBackup(code, spiders)
      .then(setIncoming)
      .catch(() => setError('Tenhle kód nejde přečíst. Zkontroluj, že je zkopírovaný celý.'));
  }, [code, spiders]);

  const nameOf = (id: string) => spiders.find((s) => s.id === id)?.nameCs ?? id;
  const known = (ids: string[]) => ids.filter((id) => spiders.some((s) => s.id === id));
  const close = () => navigate('/', { replace: true });
  const apply = (next: UserMarks) => {
    replaceAll(next);
    close();
  };

  const favIds = incoming ? known(incoming.favorites) : [];
  const seenIds = incoming ? known(Object.keys(incoming.seen)) : [];
  const hasCurrent = marks.favorites.length > 0 || Object.keys(marks.seen).length > 0;

  return (
    <Dialog open onClose={close} fullWidth maxWidth="xs">
      <DialogTitle>Obnovit ze zálohy</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}
        {incoming && (
          <Stack spacing={1.5}>
            <Typography>
              V záloze je <b>{favIds.length}</b> oblíbených a <b>{seenIds.length}</b> viděných
              pavouků.
            </Typography>
            {favIds.length > 0 && (
              <Typography variant="body2">❤️ {favIds.map(nameOf).join(', ')}</Typography>
            )}
            {seenIds.length > 0 && (
              <Typography variant="body2">👁 {seenIds.map(nameOf).join(', ')}</Typography>
            )}
            {hasCurrent && (
              <Typography variant="body2" color="text.secondary">
                „Sloučit“ přidá zálohu k tomu, co už tu je. „Nahradit“ současné značky smaže.
              </Typography>
            )}
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ flexWrap: 'wrap', gap: 1 }}>
        <Button onClick={close}>Zrušit</Button>
        {incoming && hasCurrent && (
          <Button variant="outlined" color="error" onClick={() => apply(incoming)}>
            Nahradit
          </Button>
        )}
        {incoming && (
          <Button
            variant="contained"
            onClick={() => apply(hasCurrent ? mergeMarks(marks, incoming) : incoming)}
          >
            {hasCurrent ? 'Sloučit' : 'Obnovit'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
