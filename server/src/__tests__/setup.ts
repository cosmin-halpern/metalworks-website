import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Mock environment variables if not set
process.env.SMTP_HOST = process.env.SMTP_HOST || 'smtp.test.com';
process.env.SMTP_PORT = process.env.SMTP_PORT || '587';
process.env.SMTP_USER = process.env.SMTP_USER || 'test@test.com';
process.env.SMTP_PASS = process.env.SMTP_PASS || 'test-password';
process.env.CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'contact@test.com';

// Global test timeout
jest.setTimeout(10000);

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
}); 