import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>KarigarAI Server</title>
      <style>
        body { font-family: system-ui, sans-serif; background: #FFFDF9; color: #431407; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
        .card { background: white; padding: 2.5rem; border-radius: 1.5rem; box-shadow: 0 10px 25px rgba(217, 119, 6, 0.1); border: 1px solid #FED7AA; text-align: center; max-width: 480px; }
        h1 { color: #9A3412; margin-top: 0; }
        p { line-height: 1.6; color: #57534E; }
        a.btn { display: inline-block; background: #D97706; color: white; padding: 0.75rem 1.5rem; border-radius: 9999px; text-decoration: none; font-weight: bold; margin-top: 1rem; }
        a.btn:hover { background: #B45309; }
      </style>
    </head>
    <body>
      <div class="card">
        <div style="font-size: 3rem; margin-bottom: 0.5rem;">🏺</div>
        <h1>KarigarAI Backend API</h1>
        <p>The backend API server is active and running on port 5000.</p>
        <p>Looking for the <strong>Buyer Website</strong>?</p>
        <a class="btn" href="http://localhost:3001">Open Buyer Website (Port 3001) →</a>
      </div>
    </body>
    </html>
  `);
});

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'KarigarAI backend is running' });
});

export default router;
