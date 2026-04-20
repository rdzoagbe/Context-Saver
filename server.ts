import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import Stripe from 'stripe';
import admin from 'firebase-admin';
import path from 'path';
import crypto from 'crypto';
import { geminiService } from './src/services/geminiService.ts';
import { config } from 'dotenv';
config();

try {
  admin.initializeApp();
} catch (e) {
  console.warn("Firebase Admin already initialized or missing config.");
}

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

  // Vite + Static Serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(3000, '0.0.0.0', () => console.log('✅ Server running on http://localhost:3000'));
}
startServer();
