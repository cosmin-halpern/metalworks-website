import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { sendEmail } from '../services/email';
import { ContactFormData } from '../../client/src/types';
import { ApiResponse } from '../types';

const router = Router();

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  service: z.string().optional(),
});

router.post('/', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const formData = contactFormSchema.parse(req.body) as ContactFormData;
    
    // Send email
    await sendEmail({
      from: process.env.SMTP_USER || '',
      to: process.env.CONTACT_EMAIL || '',
      subject: `New Contact Form Submission from ${formData.name}`,
      text: `
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Service: ${formData.service || 'Not specified'}

Message:
${formData.message}
      `,
      html: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${formData.name}</p>
<p><strong>Email:</strong> ${formData.email}</p>
<p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
<p><strong>Service:</strong> ${formData.service || 'Not specified'}</p>
<h3>Message:</h3>
<p>${formData.message}</p>
      `,
    });

    res.json({
      status: 'success',
      message: 'Message sent successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    } else {
      console.error('Error sending email:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to send message',
      });
    }
  }
});

export default router; 