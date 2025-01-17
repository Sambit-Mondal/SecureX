import nodemailer from 'nodemailer';

const sendVerificationCode = async (email: string, code: string) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'SecureComm - Unique Code',
            text: `Your Unique Code is: ${code}. Save it for future reference, as it is much necessary for logging in.`,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Failed to send email:', error.message);
        } else {
            console.error('Failed to send email:', error);
        }
        throw new Error('Email sending failed');
    }
};

export default sendVerificationCode;