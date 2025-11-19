export interface ChatMetadata {
  language?: string;
  page_url?: string;
  client_id?: string;
  category?: string;
}

export interface ChatRequestBody {
  conversation_id?: string;
  user_message: string;
  metadata?: ChatMetadata;
}

export interface N8nPayload {
  conversation_id?: string;
  message: string;
  language?: string;
  source: string;
  page_url?: string;
  client_id?: string;
  category?: string;
}

export interface N8nResponse {
  assistant_message?: string;
  conversation_id?: string;
  quick_replies?: Array<{ label: string; value: string }>;
  ui_hints?: Record<string, unknown>;
  language?: string;
}

export interface NormalizedChatResponse {
  assistant_message: string;
  conversation_id: string;
  quick_replies: Array<{ label: string; value: string }>;
  ui_hints: Record<string, unknown>;
}
