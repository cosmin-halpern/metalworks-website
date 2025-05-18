import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/quote", async (req, res) => {
    const { name, email, message, product } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail", // or your SMTP provider
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"Quote Request" <${process.env.MAIL_USER}>`,
            to: process.env.MAIL_USER,
            subject: `New Quote: ${product}`,
            text: `
        Name: ${name}
        Email: ${email}
        Product: ${product}
        Message: ${message}
      `,
        });

        res.status(200).json({ message: "Quote sent successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to send quote" });
    }
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
