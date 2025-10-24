import { Response } from 'express';
import { Course, Lesson, User } from '../../db/models/index.js';
import { AuthRequest } from '../../middlewares/auth.js';

export const getCourses = async (req: AuthRequest, res: Response) => {
  try {
    const {
      search,
      level,
      category,
      published = 'true',
      page = '1',
      limit = '12',
      sort = '-createdAt',
    } = req.query;

    const query: any = {};

    // Фильтры
    if (published === 'true') {
      query.published = true;
    }

    if (level) {
      query.level = level;
    }

    if (category) {
      query.categories = category;
    }

    if (search) {
      query.$text = { $search: search as string };
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [courses, total] = await Promise.all([
      Course.find(query)
        .sort(sort as string)
        .skip(skip)
        .limit(limitNum)
        .select('-__v')
        .lean(),
      Course.countDocuments(query),
    ]);

    res.json({
      courses,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Ошибка получения курсов' });
  }
};

export const getCourseBySlug = async (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;

    const course = await Course.findOne({ slug }).populate('lessons').lean();

    if (!course) {
      return res.status(404).json({ error: 'Курс не найден' });
    }

    // Если пользователь авторизован, проверяем доступ и добавляем прогресс
    let hasAccess = false;
    let progress = {};

    if (req.user) {
      const user = await User.findById(req.user.id);
      
      if (user) {
        // Проверяем доступ через промокоды
        hasAccess = user.activatedPromoCodes.some(
          (activation) =>
            activation.globalAccess ||
            activation.courseIds?.some((id) => id.toString() === course._id.toString())
        );

        // Получаем прогресс
        progress = Object.fromEntries(user.progress);
      }
    }

    res.json({
      ...course,
      hasAccess,
      progress,
    });
  } catch (error: any) {
    console.error('Get course error:', error);
    res.status(500).json({ error: 'Ошибка получения курса' });
  }
};

export const createCourse = async (req: AuthRequest, res: Response) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error: any) {
    console.error('Create course error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Курс с таким slug уже существует' });
    }
    res.status(500).json({ error: 'Ошибка создания курса' });
  }
};

export const updateCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const course = await Course.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!course) {
      return res.status(404).json({ error: 'Курс не найден' });
    }

    res.json(course);
  } catch (error: any) {
    console.error('Update course error:', error);
    res.status(500).json({ error: 'Ошибка обновления курса' });
  }
};

export const deleteCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return res.status(404).json({ error: 'Курс не найден' });
    }

    // Удаляем связанные уроки
    await Lesson.deleteMany({ courseId: id });

    res.json({ message: 'Курс успешно удален' });
  } catch (error: any) {
    console.error('Delete course error:', error);
    res.status(500).json({ error: 'Ошибка удаления курса' });
  }
};

export const toggleFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ error: 'Курс не найден' });
    }

    const favoriteIndex = user.favorites.findIndex((fav) => fav.toString() === id);

    if (favoriteIndex > -1) {
      user.favorites.splice(favoriteIndex, 1);
    } else {
      user.favorites.push(course._id);
    }

    await user.save();

    res.json({
      isFavorite: favoriteIndex === -1,
      favorites: user.favorites,
    });
  } catch (error: any) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ error: 'Ошибка изменения избранного' });
  }
};

