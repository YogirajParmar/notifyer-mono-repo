import nodemailer from 'nodemailer';

export const sendNotification = async (email: string, message: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: process.env.SMTP_EMAIL_HOST,
        pass: process.env.SMTP_PASSWORD
    }
    });

    const mailOptions = {
        from: 'yogirajparmar10@gmail.com',
        to: email,
        subject: 'Notification',
        text: message,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
}