import { describe, expect, it, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';
import * as n8nClient from '../src/services/n8nClient.js';

const sampleResponse = {
  assistant_message: 'Hi there',
  conversation_id: 'abc123',
  quick_replies: [],
  ui_hints: {},
};

describe('POST /api/chat', () => {
  beforeEach(() => {
    vi.spyOn(n8nClient, 'forwardToN8n').mockResolvedValue(sampleResponse);
  });

  it('validates missing user message', async () => {
    const response = await request(app).post('/api/chat').send({});
    expect(response.status).toBe(400);
  });

  it('returns normalized payload', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({ user_message: 'Hello' });

    expect(response.status).toBe(200);
    expect(response.body.assistant_message).toBe('Hi there');
  });
});
