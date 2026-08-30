import { Router } from 'express';
import multer from 'multer';
import {
  transcribeAudio,
  mimeFromAudioName,
  SpeechServiceError,
} from '../services/speech.service';
import type { SpeechInput } from '../services/speech.service';

const router = Router();

const audioUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'));
    }
  },
});

router.post('/api/speech/transcribe', audioUpload.single('audio'), (req, res) => {
  void (async () => {
    try {
      const originalName = req.file?.originalname ?? 'audio.m4a';
      const rawMime = req.file?.mimetype || mimeFromAudioName(originalName);
      const mimeType = rawMime.toLowerCase() === 'audio/x-m4a' ? 'audio/mp4' : rawMime;
      const input: SpeechInput = {
        audio: req.file?.buffer ?? Buffer.alloc(0),
        mimeType,
        language: typeof req.body?.language === 'string' ? req.body.language : 'हिंदी',
      };

      if (!input.audio.length) {
        res.status(400).json({ success: false, message: 'audio file is required' });
        return;
      }

      const text = await transcribeAudio(input);
      res.json({ success: true, data: { transcript: text } });
    } catch (error) {
      console.error('transcribe error:', error);
      if (error instanceof SpeechServiceError) {
        res.status(error.status).json({ success: false, message: error.message });
        return;
      }
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Transcription failed',
      });
    }
  })();
});

export default router;
