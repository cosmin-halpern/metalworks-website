import nodemailer from 'nodemailer';

export type EmailData = {
    from: string;
    to: string;
    subject: string;
    text: string;
    html?: string;
};

// Singleton transporter — created once and reused across calls
let transporter: nodemailer.Transporter | null = null;

const getTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 587),
            secure: String(process.env.SMTP_PORT) === '465',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    return transporter;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

export const sendEmail = async (emailData: EmailData): Promise<void> => {
    let lastError: unknown;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            await getTransporter().sendMail({
                from: emailData.from,
                to: emailData.to,
                subject: emailData.subject,
                text: emailData.text,
                html: emailData.html,
            });
            return;
        } catch (error) {
            lastError = error;
            console.error(
                `Email send failed (attempt ${attempt}/${MAX_RETRIES}) to="${emailData.to}" subject="${emailData.subject}":`,
                error
            );

            if (attempt < MAX_RETRIES) {
                // Exponential backoff: 1s, 2s, 4s …
                await sleep(BASE_DELAY_MS * 2 ** (attempt - 1));
                // Reset transporter in case the connection went stale
                transporter = null;
            }
        }
    }

    throw new Error(`Failed to send email after ${MAX_RETRIES} attempts: ${lastError}`);
};
