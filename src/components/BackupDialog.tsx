import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import IosShareIcon from '@mui/icons-material/IosShare';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RestoreIcon from '@mui/icons-material/Restore';
import { useNavigate } from 'react-router-dom';
import { useUserMarks } from '../storage/useUserMarks';
import { useSpiderList } from '../data/SpidersContext';
import { MAX_LINK_LENGTH, backupLink, encodeBackup, extractCode } from '../storage/backup';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const BackupDialog = ({ open, onClose }: Props) => {
  const { marks } = useUserMarks();
  const spiders = useSpiderList();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [pasted, setPasted] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (open) encodeBackup(marks, spiders).then(setCode);
  }, [open, marks, spiders]);

  const link = code ? backupLink(code) : '';
  const linkTooLong = link.length > MAX_LINK_LENGTH;
  const favCount = marks.favorites.length;
  const seenCount = Object.keys(marks.seen).length;
  const nothing = favCount === 0 && seenCount === 0;

  const copy = async (text: string, what: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast(`${what} je ve schránce.`);
    } catch {
      setToast('Kopírování se nepovedlo, označ text a zkopíruj ho ručně.');
    }
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mates pavouci – záloha',
          text: 'Moje oblíbené a viděné pavouky',
          url: link,
        });
        return;
      } catch {
        // zrušeno uživatelem
        return;
      }
    }
    await copy(link, 'Odkaz');
  };

  const restore = () => {
    const c = extractCode(pasted);
    if (!c) return;
    onClose();
    navigate(`/obnovit?d=${encodeURIComponent(c)}`);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
        <DialogTitle>Záloha srdíček a viděných</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Typography>
              Máš <b>{favCount}</b> oblíbených a <b>{seenCount}</b> viděných pavouků. Záloha je
              krátký odkaz, pošli si ho třeba do Poznámek nebo do Zpráv.
            </Typography>
            {linkTooLong && (
              <Alert severity="info">Odkaz je moc dlouhý, použij místo něj kopírování kódu.</Alert>
            )}
            <Button
              variant="contained"
              startIcon={<IosShareIcon />}
              onClick={share}
              disabled={nothing || !code || linkTooLong}
            >
              Sdílet zálohu
            </Button>
            <Button
              variant="outlined"
              startIcon={<ContentCopyIcon />}
              onClick={() => copy(code, 'Kód')}
              disabled={nothing || !code}
            >
              Zkopírovat kód
            </Button>
            <TextField
              label="Odkaz se zálohou (pro kontrolu)"
              value={link}
              size="small"
              onFocus={(e) => e.target.select()}
              slotProps={{ input: { readOnly: true }, htmlInput: { 'data-testid': 'backup-link' } }}
            />

            <Typography variant="subtitle1" sx={{ pt: 1 }}>
              Obnovit ze zálohy
            </Typography>
            <TextField
              label="Vlož odkaz nebo kód"
              value={pasted}
              onChange={(e) => setPasted(e.target.value)}
              size="small"
              multiline
              maxRows={3}
            />
            <Button
              variant="outlined"
              startIcon={<RestoreIcon />}
              onClick={restore}
              disabled={!pasted.trim()}
            >
              Obnovit
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Zavřít</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={toast !== null}
        autoHideDuration={3000}
        onClose={() => setToast(null)}
        message={toast}
      />
    </>
  );
};
