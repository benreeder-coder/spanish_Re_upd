const { N8N_WEBHOOK_URL = 'https://example.com/mock-n8n' } = process.env;

export const config = {
  n8nWebhookUrl: N8N_WEBHOOK_URL,
  fallbackMessage:
    'Sorry, I am having trouble connecting right now. Please try again in a moment or contact our team directly.',
};
