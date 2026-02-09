import nodemailer from 'nodemailer';

export type EmailData = {
    from: string;
    to: string;
    subject: string;
    text: string;
    html?: string;
};

const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: String(process.env.SMTP_PORT) === '465',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

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