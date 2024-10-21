import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable';
import fs from 'fs'
import pdf from 'pdf-parse'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { fields, files } = await parseForm(req);
      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      
      if (!file) {
        throw new Error('No file uploaded');
      }

      const fileContent = await fs.promises.readFile(file.filepath);
      const pdfData = await pdf(fileContent);

      if (!pdfData.text || pdfData.text.trim().length === 0) {
        throw new Error('PDF file content is empty');
      }

      res.status(200).json({ text: pdfData.text });
    } catch (error) {
      console.error('PDF processing failed:', error);
      res.status(500).json({ error: 'PDF processing failed', details: (error as Error).message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

function parseForm(req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  return new Promise((resolve, reject) => {
    const form = formidable();
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}
