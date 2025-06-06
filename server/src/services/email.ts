import nodemailer from 'nodemailer';
import { EmailConfig, EmailData } from '../types';

// Create reusable transporter
const createTransporter = (): nodemailer.Transporter => {
  const config: EmailConfig = {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  };

  return nodemailer.createTransport(config);
};

// Send email function
export const sendEmail = async (emailData: EmailData): Promise<void> => {
  const transporter = createTransporter();

  try {
    await transporter.sendMail({
      from: emailData.from,
      to: emailData.to,
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.html,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

// Verify SMTP connection
export const verifyEmailConfig = async (): Promise<boolean> => {
  const transporter = createTransporter();

  try {
    await transporter.verify();
    return true;
  } catch (error) {
    console.error('SMTP connection error:', error);
    return false;
  }
}; 