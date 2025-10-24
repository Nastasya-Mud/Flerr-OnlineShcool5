import { Response } from 'express';
import { User, Course, Lesson, PromoCode, Activation } from '../../db/models/index.js';
import { AuthRequest } from '../../middlewares/auth.js';

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const [
      totalUsers,
      totalCourses,
      totalLessons,
      totalPromoCodes,
      totalActivations,
      recentActivations,
    ] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments({ published: true }),
      Lesson.countDocuments(),
      PromoCode.countDocuments(),
      Activation.countDocuments(),
      Activation.find()
        .sort('-activatedAt')
        .limit(10)
        .populate('userId', 'name email')
        .populate('promoCodeId', 'code scope')
        .lean(),
    ]);

    // Статистика по активациям за последние 30 дней
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentActivationsCount = await Activation.countDocuments({
      activatedAt: { $gte: thirtyDaysAgo },
    });

    // Топ курсов по количеству студентов
    const topCourses = await Course.find({ published: true })
      .sort('-studentsCount')
      .limit(5)
      .select('title slug studentsCount coverUrl')
      .lean();

    res.json({
      stats: {
        totalUsers,
        totalCourses,
        totalLessons,
        totalPromoCodes,
        totalActivations,
        recentActivationsCount,
      },
      recentActivations,
      topCourses,
    });
  } catch (error: any) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Ошибка получения статистики' });
  }
};

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { page = '1', limit = '20', search, role } = req.query;

    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (role) {
      query.roles = role;
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-passwordHash -resetPasswordToken -resetPasswordExpires')
        .sort('-createdAt')
        .skip(skip)
        .limit(limitNum)
        .lean(),
      User.countDocuments(query),
    ]);

    res.json({
      users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Ошибка получения пользователей' });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, roles } = req.body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (roles) updateData.roles = roles;

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select('-passwordHash -resetPasswordToken -resetPasswordExpires');

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json(user);
  } catch (error: any) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Ошибка обновления пользователя' });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Нельзя удалить самого себя
    if (id === req.user!.id) {
      return res.status(400).json({ error: 'Нельзя удалить свой собственный аккаунт' });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json({ message: 'Пользователь успешно удален' });
  } catch (error: any) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Ошибка удаления пользователя' });
  }
};

