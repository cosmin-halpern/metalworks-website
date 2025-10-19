import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { z } from 'zod';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import contactRouter from './routes/contact';

// Load environment variables
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Validation schemas
const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  service: z.string().optional(),
});

// Error handling middleware
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};

// Routes
app.use('/api/contact', contactRouter);

// Apply error handling middleware
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
