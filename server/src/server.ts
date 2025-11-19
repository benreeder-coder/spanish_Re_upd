import express from 'express';
import { chatHandler } from './routes/chat.js';

const app = express();

app.use(express.json());
app.post('/api/chat', chatHandler);
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Chat proxy listening on port ${PORT}`);
  });
}

export default app;
