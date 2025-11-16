import { Response } from 'express';
import { SiteSettings } from '../../db/models/index.js';
import { AuthRequest } from '../../middlewares/auth.js';

// Получить настройки (публичный доступ)
export const getSiteSettings = async (req: any, res: Response) => {
  try {
    let settings = await SiteSettings.findOne();
    
    // Если настроек нет, создаем с дефолтными значениями
    if (!settings) {
      settings = await SiteSettings.create({
        heroImage1: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1200&q=80&auto=format&fit=crop',
        heroImage2: '',
      });
    }

    res.json({ settings });
  } catch (error: any) {
    console.error('Get site settings error:', error);
    res.status(500).json({ error: 'Ошибка при получении настроек сайта' });
  }
};

// Обновить настройки (только админ)
export const updateSiteSettings = async (req: AuthRequest, res: Response) => {
  try {
    const { heroImage1, heroImage2 } = req.body;

    let settings = await SiteSettings.findOne();

    if (!settings) {
      // Создаем новые настройки, если их нет
      settings = await SiteSettings.create({
        heroImage1: heroImage1 || 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1200&q=80&auto=format&fit=crop',
        heroImage2: heroImage2 || '',
      });
    } else {
      // Обновляем существующие
      if (heroImage1 !== undefined) settings.heroImage1 = heroImage1;
      if (heroImage2 !== undefined) settings.heroImage2 = heroImage2;
      await settings.save();
    }

    res.json({ settings });
  } catch (error: any) {
    console.error('Update site settings error:', error);
    res.status(500).json({ error: 'Ошибка при обновлении настроек сайта' });
  }
};

