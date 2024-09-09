import type { NextApiRequest, NextApiResponse } from 'next';
import markdownpdf from 'markdown-pdf';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { markdown } = req.body;

    try {
      const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
        markdownpdf().from.string(markdown).to.buffer((err: Error | null, buffer: Buffer) => {
          if (err) reject(err);
          else resolve(buffer);
        });
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="review.pdf"');
      res.send(pdfBuffer);
    } catch (error) {
      console.error('PDF generation failed:', error);
      res.status(500).json({ error: 'PDF generation failed' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
