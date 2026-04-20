import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import admin from 'firebase-admin';
import path from 'path';
import { config } from 'dotenv';
config();

try {
  admin.initializeApp();
} catch (e) {
  console.warn("Firebase Admin initialized.");
}

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(3000, '0.0.0.0', () => console.log('✅ Server running at http://localhost:3000'));
}
startServer();
