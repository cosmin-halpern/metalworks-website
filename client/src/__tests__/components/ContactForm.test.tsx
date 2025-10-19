import * as React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContactForm from '../../components/ContactForm';
import userEvent from '@testing-library/user-event';
import { submitContactForm } from '../../services/api';

jest.mock('../../services/api');
jest.mock('../../services/env', () => ({
  getApiBaseUrl: () => 'http://localhost:3001',
}));

describe('ContactForm', () => {
  test('renders the contact form with required fields', () => {
    render(<ContactForm />);

    // Check for required fields by their labels or placeholders
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send Message/i })).toBeInTheDocument();
  });

  test('shows validation errors when submitting empty form', async () => {
    render(<ContactForm />);
    userEvent.click(screen.getByRole('button', { name: /Send Message/i }));
    expect(await screen.findAllByText(/required|at least|Invalid/i)).not.toHaveLength(0);
  });

  test('submits form successfully', async () => {
    (submitContactForm as unknown as jest.Mock).mockResolvedValueOnce({ status: 'success' });
    render(<ContactForm />);
    userEvent.type(screen.getByLabelText(/Name/i), 'John Doe');
    userEvent.type(screen.getByLabelText(/Email/i), 'john@example.com');
    userEvent.type(screen.getByLabelText(/Message/i), 'This is a test message.');
    userEvent.click(screen.getByRole('button', { name: /Send Message/i }));
    expect(await screen.findByText(/Message sent successfully/i)).toBeInTheDocument();
    expect(submitContactForm).toHaveBeenCalled();
  });

  test('shows error on failed submission', async () => {
    (submitContactForm as unknown as jest.Mock).mockRejectedValueOnce(new Error('API Error'));
    render(<ContactForm />);
    userEvent.type(screen.getByLabelText(/Name/i), 'Jane Doe');
    userEvent.type(screen.getByLabelText(/Email/i), 'fail@example.com');
    userEvent.type(screen.getByLabelText(/Message/i), 'This is a test message.');
    userEvent.click(screen.getByRole('button', { name: /Send Message/i }));
    expect(await screen.findByText(/error|failed/i)).toBeInTheDocument();
  });

  // Add more tests here later for form submission, validation, etc.
});
