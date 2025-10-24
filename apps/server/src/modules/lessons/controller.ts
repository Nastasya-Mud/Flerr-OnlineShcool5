import { Response } from 'express';
import { Lesson, Course, User } from '../../db/models/index.js';
import { AuthRequest } from '../../middlewares/auth.js';
import { generateDownloadUrl } from '../../utils/s3.js';

export const getLessonsByCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { courseSlug } = req.params;

    const course = await Course.findOne({ slug: courseSlug });
    if (!course) {
      return res.status(404).json({ error: 'Курс не найден' });
    }

    const lessons = await Lesson.find({ courseId: course._id })
      .sort('order')
      .select('-videoKey') // Не отдаем ключ видео в списке
      .lean();

    res.json({ lessons });
  } catch (error: any) {
    console.error('Get lessons error:', error);
    res.status(500).json({ error: 'Ошибка получения уроков' });
  }
};

export const getLessonById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const lesson = await Lesson.findById(id).populate('courseId').lean();
    if (!lesson) {
      return res.status(404).json({ error: 'Урок не найден' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ error: 'Пользователь не найден' });
    }

    const course = lesson.courseId as any;

    // Проверяем доступ
    const hasAccess =
      lesson.freePreview ||
      user.roles.includes('admin') ||
      user.activatedPromoCodes.some(
        (activation) =>
          activation.globalAccess ||
          activation.courseIds?.some((id) => id.toString() === course._id.toString())
      );

    if (!hasAccess) {
      return res.status(403).json({
        error: 'Нет доступа к уроку',
        message: 'Активируйте промокод для доступа к этому уроку',
      });
    }

    // Генерируем подписанную ссылку на видео (действительна 1 час)
    const videoUrl = await generateDownloadUrl(lesson.videoKey, 3600);

    // Генерируем ссылки на материалы
    const materialsWithUrls = await Promise.all(
      lesson.materials.map(async (material) => ({
        ...material,
        downloadUrl: await generateDownloadUrl(material.url, 3600),
      }))
    );

    res.json({
      ...lesson,
      videoUrl,
      materials: materialsWithUrls,
    });
  } catch (error: any) {
    console.error('Get lesson error:', error);
    res.status(500).json({ error: 'Ошибка получения урока' });
  }
};

export const createLesson = async (req: AuthRequest, res: Response) => {
  try {
    const lesson = await Lesson.create(req.body);

    // Добавляем урок к курсу
    await Course.findByIdAndUpdate(req.body.courseId, {
      $push: { lessons: lesson._id },
    });

    res.status(201).json(lesson);
  } catch (error: any) {
    console.error('Create lesson error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Урок с таким slug уже существует в этом курсе' });
    }
    res.status(500).json({ error: 'Ошибка создания урока' });
  }
};

export const updateLesson = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const lesson = await Lesson.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!lesson) {
      return res.status(404).json({ error: 'Урок не найден' });
    }

    res.json(lesson);
  } catch (error: any) {
    console.error('Update lesson error:', error);
    res.status(500).json({ error: 'Ошибка обновления урока' });
  }
};

export const deleteLesson = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const lesson = await Lesson.findByIdAndDelete(id);
    if (!lesson) {
      return res.status(404).json({ error: 'Урок не найден' });
    }

    // Удаляем урок из курса
    await Course.findByIdAndUpdate(lesson.courseId, {
      $pull: { lessons: lesson._id },
    });

    res.json({ message: 'Урок успешно удален' });
  } catch (error: any) {
    console.error('Delete lesson error:', error);
    res.status(500).json({ error: 'Ошибка удаления урока' });
  }
};

export const saveProgress = async (req: AuthRequest, res: Response) => {
  try {
    const { lessonId, percent } = req.body;
    const userId = req.user!.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Обновляем прогресс
    user.progress.set(lessonId, percent);
    await user.save();

    res.json({ message: 'Прогресс сохранен', progress: Object.fromEntries(user.progress) });
  } catch (error: any) {
    console.error('Save progress error:', error);
    res.status(500).json({ error: 'Ошибка сохранения прогресса' });
  }
};

