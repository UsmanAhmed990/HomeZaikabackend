const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        connectionTimeout: 10000 // 10 seconds
    });

    // Verify connection configuration
    try {
        await transporter.verify();
        console.log('✅ SMTP Connection Established');
    } catch (error) {
        console.error('❌ SMTP Connection Error:', error);
        throw error; // Re-throw to be caught by caller
    }

    const mailOptions = {
        from: `HOMEZaika <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent: %s', info.messageId);
};

module.exports = sendEmail;
