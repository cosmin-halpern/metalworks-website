import nodemailer from 'nodemailer';
import { sendEmail } from '../../services/email.js';

// Mock nodemailer
jest.mock('nodemailer');

describe('Email Service', () => {
  const mockSendMail = jest.fn();
  const mockCreateTransport = jest.fn();

  beforeEach(() => {
    mockSendMail.mockReset();
    mockCreateTransport.mockReset();
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: mockSendMail,
    });
  });

  it('should send an email successfully', async () => {
    mockSendMail.mockResolvedValueOnce({ messageId: 'test-id' });

    const emailData = {
      from: 'test@example.com',
      to: 'recipient@example.com',
      subject: 'Test Subject',
      text: 'Test message',
      html: '<p>Test message</p>',
    };

    await sendEmail(emailData);

    expect(mockCreateTransport).toHaveBeenCalledWith({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    expect(mockSendMail).toHaveBeenCalledWith(emailData);
  });

  it('should throw an error when email sending fails', async () => {
    const error = new Error('SMTP error');
    mockSendMail.mockRejectedValueOnce(error);

    const emailData = {
      from: 'test@example.com',
      to: 'recipient@example.com',
      subject: 'Test Subject',
      text: 'Test message',
    };

    await expect(sendEmail(emailData)).rejects.toThrow('SMTP error');
  });

  it('should use default from address when not provided', async () => {
    mockSendMail.mockResolvedValueOnce({ messageId: 'test-id' });

    const emailData = {
      to: 'recipient@example.com',
      subject: 'Test Subject',
      text: 'Test message',
    };

    await sendEmail(emailData);

    expect(mockSendMail).toHaveBeenCalledWith({
      ...emailData,
      from: process.env.CONTACT_EMAIL,
    });
  });
}); 