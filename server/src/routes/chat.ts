import type { Request, Response } from 'express';
import { forwardToN8n } from '../services/n8nClient.js';
import { ChatRequestBody } from '../types/chat.js';

export async function chatHandler(req: Request, res: Response) {
  try {
    const body = req.body as ChatRequestBody;

    if (!body?.user_message) {
      res.status(400).json({ error: 'user_message is required' });
      return;
    }

    const normalized = await forwardToN8n({
      conversation_id: body.conversation_id,
      user_message: body.user_message,
      metadata: {
        ...body.metadata,
        page_url: body.metadata?.page_url ?? req.headers.referer?.toString(),
      },
    });

    res.json(normalized);
  } catch (error) {
    console.error('Unexpected error handling chat request', error);
    res.status(500).json({ error: 'Unexpected error' });
  }
}
