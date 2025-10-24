import { Request, Response } from 'express';
import { Course, Lesson } from '../../db/models/index.js';

export const search = async (req: Request, res: Response) => {
  try {
    const {
      q = '',
      type = 'all', // all, courses, lessons
      level,
      category,
      page = '1',
      limit = '10',
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const searchQuery = q as string;
    const results: any = {
      courses: [],
      lessons: [],
    };

    // Поиск по курсам
    if (type === 'all' || type === 'courses') {
      const courseQuery: any = {
        published: true,
        $or: [
          { title: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } },
          { shortDescription: { $regex: searchQuery, $options: 'i' } },
        ],
      };

      if (level) courseQuery.level = level;
      if (category) courseQuery.categories = category;

      results.courses = await Course.find(courseQuery)
        .select('title slug description shortDescription coverUrl level categories rating studentsCount')
        .limit(limitNum)
        .skip(skip)
        .lean();
    }

    // Поиск по урокам
    if (type === 'all' || type === 'lessons') {
      const lessonQuery: any = {
        $or: [
          { title: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } },
        ],
      };

      results.lessons = await Lesson.find(lessonQuery)
        .populate('courseId', 'title slug coverUrl')
        .select('title slug description durationSec thumbnailUrl courseId')
        .limit(limitNum)
        .skip(skip)
        .lean();
    }

    // Подсчет общего количества результатов
    const total = results.courses.length + results.lessons.length;

    res.json({
      query: searchQuery,
      results,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
      },
    });
  } catch (error: any) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Ошибка поиска' });
  }
};

