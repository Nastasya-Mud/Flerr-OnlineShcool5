import { Request, Response } from 'express';
import crypto from 'crypto';
import { User } from '../../db/models/index.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt.js';
import { sendPasswordResetEmail, sendWelcomeEmail } from '../../utils/email.js';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Проверяем, существует ли пользователь
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
    }

    // Создаем пользователя
    const user = await User.create({
      email,
      passwordHash: password, // будет захеширован в pre-save hook
      name,
      roles: ['student'],
    });

    // Генерируем токены
    const accessToken = generateAccessToken({
      id: String(user._id),
      email: user.email,
      roles: user.roles,
    });
    const refreshToken = generateRefreshToken({ id: String(user._id) });

    // Отправляем welcome email
    sendWelcomeEmail(user.email, user.name).catch(console.error);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    });

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        roles: user.roles,
      },
      accessToken,
    });
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Ошибка регистрации' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Находим пользователя
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    // Проверяем пароль
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    // Генерируем токены
    const accessToken = generateAccessToken({
      id: String(user._id),
      email: user.email,
      roles: user.roles,
    });
    const refreshToken = generateRefreshToken({ id: String(user._id) });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        roles: user.roles,
      },
      accessToken,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Ошибка входа' });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token не найден' });
    }

    const decoded = verifyRefreshToken(refreshToken) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'Пользователь не найден' });
    }

    const accessToken = generateAccessToken({
      id: String(user._id),
      email: user.email,
      roles: user.roles,
    });

    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ error: 'Неверный refresh token' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Не раскрываем, существует ли пользователь
      return res.json({ message: 'Если email существует, письмо будет отправлено' });
    }

    // Генерируем токен для сброса пароля
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 час
    await user.save();

    // Отправляем email
    await sendPasswordResetEmail(email, resetToken);

    res.json({ message: 'Если email существует, письмо будет отправлено' });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Ошибка восстановления пароля' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Неверный или истекший токен' });
    }

    user.passwordHash = password; // будет захеширован в pre-save hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Пароль успешно изменен' });
  } catch (error: any) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Ошибка сброса пароля' });
  }
};

