import app from '../src/apiServer';

export default function handler(req: any, res: any) {
  return app(req, res);
}
