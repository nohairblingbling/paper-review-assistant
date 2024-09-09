import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { apiKey, apiBase, apiModel } = req.body

    let envContent = `OPENAI_API_KEY=${apiKey}\n`
    if (apiBase) {
      envContent += `OPENAI_API_BASE=${apiBase}\n`
    }
    envContent += `OPENAI_API_MODEL=${apiModel || 'gpt-3.5-turbo'}\n`

    const envPath = path.join(process.cwd(), '.env.local')

    try {
      fs.writeFileSync(envPath, envContent)
      res.status(200).json({ message: 'API configuration saved' })
    } catch (error) {
      console.error('Failed to save API configuration:', error)
      res.status(500).json({ error: 'Failed to save API configuration' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}