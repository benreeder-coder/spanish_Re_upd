import fetch from 'node-fetch';
import { config } from '../config.js';
import { ChatRequestBody, N8nPayload, N8nResponse, NormalizedChatResponse } from '../types/chat.js';

const SAFE_RESPONSE: NormalizedChatResponse = {
  assistant_message: config.fallbackMessage,
  conversation_id: '',
  quick_replies: [],
  ui_hints: {},
};

export async function forwardToN8n(body: ChatRequestBody): Promise<NormalizedChatResponse> {
  if (!body.user_message || typeof body.user_message !== 'string') {
    throw new Error('user_message is required');
  }

  const payload: N8nPayload = {
    conversation_id: body.conversation_id,
    message: body.user_message,
    language: body.metadata?.language,
    source: 'website_widget',
    page_url: body.metadata?.page_url,
    client_id: body.metadata?.client_id,
    category: body.metadata?.category,
  };

  try {
    const response = await fetch(config.n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`N8N webhook error: ${response.status}`);
    }

    const data = (await response.json()) as N8nResponse;

    return normalizeResponse(data);
  } catch (error) {
    console.error('Error forwarding to n8n', error);
    return SAFE_RESPONSE;
  }
}

function normalizeResponse(data: N8nResponse): NormalizedChatResponse {
  return {
    assistant_message: data.assistant_message ?? config.fallbackMessage,
    conversation_id: data.conversation_id ?? '',
    quick_replies: Array.isArray(data.quick_replies) ? data.quick_replies : [],
    ui_hints: data.ui_hints ?? {},
  };
}
