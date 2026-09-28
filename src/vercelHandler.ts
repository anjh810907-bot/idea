import app from './apiServer';

export default function handler(req: any, res: any) {
  // Normalize req.url so both `/` and `/api` and `/api/...` route correctly to Express
  if (req.url) {
    // If the path was rewritten or stripped by Vercel
    if (!req.url.startsWith('/api')) {
      req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
    }
  }
  return app(req, res);
}
