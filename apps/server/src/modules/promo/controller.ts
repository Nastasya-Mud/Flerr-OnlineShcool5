import { Response } from 'express';
import { PromoCode, User, Activation, Course } from '../../db/models/index.js';
import { AuthRequest } from '../../middlewares/auth.js';

export const validatePromoCode = async (req: AuthRequest, res: Response) => {
  try {
    const { code } = req.body;

    const promoCode = await PromoCode.findOne({ code: code.toUpperCase() }).populate('courseId');

    if (!promoCode) {
      return res.status(404).json({ error: 'Промокод не найден', valid: false });
    }

    // Проверки валидности
    if (!promoCode.isActive) {
      return res.status(400).json({ error: 'Промокод неактивен', valid: false });
    }

    if (promoCode.expiresAt && new Date(promoCode.expiresAt) < new Date()) {
      return res.status(400).json({ error: 'Промокод истек', valid: false });
    }

    if (promoCode.usedCount >= promoCode.maxUses) {
      return res.status(400).json({ error: 'Промокод исчерпан', valid: false });
    }

    // Проверяем, не активирован ли уже этим пользователем
    const user = await User.findById(req.user!.id);
    const alreadyActivated = user?.activatedPromoCodes.some(
      (activation) => activation.codeId.toString() === promoCode._id.toString()
    );

    if (alreadyActivated) {
      return res.status(400).json({ error: 'Промокод уже активирован', valid: false });
    }

    res.json({
      valid: true,
      promoCode: {
        code: promoCode.code,
        scope: promoCode.scope,
        course: promoCode.courseId,
      },
    });
  } catch (error: any) {
    console.error('Validate promo code error:', error);
    res.status(500).json({ error: 'Ошибка проверки промокода' });
  }
};

export const activatePromoCode = async (req: AuthRequest, res: Response) => {
  try {
    const { code } = req.body;
    const userId = req.user!.id;

    const promoCode = await PromoCode.findOne({ code: code.toUpperCase() });

    if (!promoCode) {
      return res.status(404).json({ error: 'Промокод не найден' });
    }

    // Проверки
    if (!promoCode.isActive) {
      return res.status(400).json({ error: 'Промокод неактивен' });
    }

    if (promoCode.expiresAt && new Date(promoCode.expiresAt) < new Date()) {
      return res.status(400).json({ error: 'Промокод истек' });
    }

    if (promoCode.usedCount >= promoCode.maxUses) {
      return res.status(400).json({ error: 'Промокод исчерпан' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Проверяем, не активирован ли уже
    const alreadyActivated = user.activatedPromoCodes.some(
      (activation) => activation.codeId.toString() === promoCode._id.toString()
    );

    if (alreadyActivated) {
      return res.status(400).json({ error: 'Промокод уже активирован' });
    }

    // Активируем промокод
    const activation: any = {
      codeId: promoCode._id,
      activatedAt: new Date(),
    };

    if (promoCode.scope === 'platform') {
      activation.globalAccess = true;
    } else if (promoCode.scope === 'course' && promoCode.courseId) {
      activation.courseIds = [promoCode.courseId];
    }

    user.activatedPromoCodes.push(activation);
    await user.save();

    // Увеличиваем счетчик использований
    promoCode.usedCount += 1;
    await promoCode.save();

    // Создаем запись активации
    await Activation.create({
      userId: user._id,
      promoCodeId: promoCode._id,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    // Получаем информацию о курсе, если это курсовой код
    let course = null;
    if (promoCode.scope === 'course' && promoCode.courseId) {
      course = await Course.findById(promoCode.courseId).select('title slug coverUrl');
    }

    res.json({
      message: 'Промокод успешно активирован',
      scope: promoCode.scope,
      course,
    });
  } catch (error: any) {
    console.error('Activate promo code error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Промокод уже активирован' });
    }
    
    res.status(500).json({ error: 'Ошибка активации промокода' });
  }
};

export const getPromoCodes = async (req: AuthRequest, res: Response) => {
  try {
    const { page = '1', limit = '20', scope, isActive } = req.query;

    const query: any = {};
    if (scope) query.scope = scope;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [promoCodes, total] = await Promise.all([
      PromoCode.find(query)
        .populate('courseId', 'title slug')
        .populate('createdBy', 'name email')
        .sort('-createdAt')
        .skip(skip)
        .limit(limitNum)
        .lean(),
      PromoCode.countDocuments(query),
    ]);

    res.json({
      promoCodes,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    console.error('Get promo codes error:', error);
    res.status(500).json({ error: 'Ошибка получения промокодов' });
  }
};

export const createPromoCode = async (req: AuthRequest, res: Response) => {
  try {
    const data = {
      ...req.body,
      createdBy: req.user!.id,
    };

    // Валидация: если scope === 'course', courseId обязателен
    if (data.scope === 'course' && !data.courseId) {
      return res.status(400).json({ error: 'Для курсового промокода необходим courseId' });
    }

    const promoCode = await PromoCode.create(data);
    res.status(201).json(promoCode);
  } catch (error: any) {
    console.error('Create promo code error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Промокод с таким кодом уже существует' });
    }
    res.status(500).json({ error: 'Ошибка создания промокода' });
  }
};

export const updatePromoCode = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const promoCode = await PromoCode.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!promoCode) {
      return res.status(404).json({ error: 'Промокод не найден' });
    }

    res.json(promoCode);
  } catch (error: any) {
    console.error('Update promo code error:', error);
    res.status(500).json({ error: 'Ошибка обновления промокода' });
  }
};

export const deletePromoCode = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const promoCode = await PromoCode.findByIdAndDelete(id);

    if (!promoCode) {
      return res.status(404).json({ error: 'Промокод не найден' });
    }

    res.json({ message: 'Промокод успешно удален' });
  } catch (error: any) {
    console.error('Delete promo code error:', error);
    res.status(500).json({ error: 'Ошибка удаления промокода' });
  }
};

