import request from 'supertest';
import express from 'express';
import contactRouter from '../../routes/contact.js';
import { sendEmail } from '../../services/email.js';

// Mock the email service
jest.mock('../../services/email.js', () => ({
  sendEmail: jest.fn(),
}));

describe('Contact Route', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/contact', contactRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should validate required fields', async () => {
    const response = await request(app)
      .post('/api/contact')
      .send({
        name: 'J',
        email: 'invalid-email',
        message: 'Too short',
      });

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('error');
    expect(response.body.errors).toHaveLength(3);
  });

  it('should successfully send a contact form', async () => {
    const mockSendEmail = sendEmail as jest.Mock;
    mockSendEmail.mockResolvedValueOnce(undefined);

    const response = await request(app)
      .post('/api/contact')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message that is long enough to pass validation.',
        phone: '1234567890',
        service: 'General Inquiry',
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(mockSendEmail).toHaveBeenCalledTimes(1);
    expect(mockSendEmail).toHaveBeenCalledWith(expect.objectContaining({
      from: expect.any(String),
      to: expect.any(String),
      subject: expect.stringContaining('John Doe'),
    }));
  });

  it('should handle email sending errors', async () => {
    const mockSendEmail = sendEmail as jest.Mock;
    mockSendEmail.mockRejectedValueOnce(new Error('SMTP error'));

    const response = await request(app)
      .post('/api/contact')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message that is long enough to pass validation.',
      });

    expect(response.status).toBe(500);
    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('Failed to send message');
  });
}); 