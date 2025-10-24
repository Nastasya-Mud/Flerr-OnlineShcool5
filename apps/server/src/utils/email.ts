import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendPasswordResetEmail = async (email: string, resetToken: string) => {
  const resetUrl = `${process.env.APP_BASE_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `"Flerr Школа флористики" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Восстановление пароля',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333A1A;">Восстановление пароля</h2>
        <p>Вы запросили восстановление пароля для вашего аккаунта в Flerr.</p>
        <p>Перейдите по ссылке ниже для сброса пароля:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #A50C0A; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
          Сбросить пароль
        </a>
        <p>Ссылка действительна в течение 1 часа.</p>
        <p>Если вы не запрашивали восстановление пароля, проигнорируйте это письмо.</p>
        <hr style="border: none; border-top: 1px solid #E5CD9F; margin: 24px 0;">
        <p style="color: #9C7750; font-size: 14px;">С уважением,<br>Команда Flerr</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent to:', email);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Не удалось отправить письмо');
  }
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  const mailOptions = {
    from: `"Flerr Школа флористики" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Добро пожаловать в Flerr!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333A1A;">Добро пожаловать в Flerr, ${name}!</h2>
        <p>Мы рады приветствовать вас в нашей онлайн-школе флористики.</p>
        <p>Теперь вы можете:</p>
        <ul>
          <li>Активировать промокоды для доступа к курсам</li>
          <li>Смотреть уроки и отслеживать свой прогресс</li>
          <li>Сохранять любимые курсы</li>
          <li>Скачивать материалы к урокам</li>
        </ul>
        <a href="${process.env.APP_BASE_URL}/courses" style="display: inline-block; padding: 12px 24px; background-color: #A50C0A; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
          Перейти к курсам
        </a>
        <hr style="border: none; border-top: 1px solid #E5CD9F; margin: 24px 0;">
        <p style="color: #9C7750; font-size: 14px;">С уважением,<br>Команда Flerr</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent to:', email);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

