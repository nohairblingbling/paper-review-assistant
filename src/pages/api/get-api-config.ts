import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const apiKey = process.env.OPENAI_API_KEY || '';
    const apiBase = process.env.OPENAI_API_BASE || '';
    res.status(200).json({ apiKey, apiBase });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
