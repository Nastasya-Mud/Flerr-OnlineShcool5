import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.js';
import {
  generateUploadUrl,
  generateVideoKey,
  generateCoverKey,
  generateMaterialKey,
} from '../../utils/s3.js';

export const getUploadUrl = async (req: AuthRequest, res: Response) => {
  try {
    const { filename, contentType, fileType, courseSlug, lessonId } = req.body;

    let key: string;

    // Генерируем ключ в зависимости от типа файла
    switch (fileType) {
      case 'video':
        if (!courseSlug || !lessonId) {
          return res.status(400).json({ error: 'courseSlug и lessonId обязательны для видео' });
        }
        key = generateVideoKey(courseSlug, lessonId, filename);
        break;

      case 'cover':
        if (!courseSlug) {
          return res.status(400).json({ error: 'courseSlug обязателен для обложки' });
        }
        key = generateCoverKey(courseSlug, filename);
        break;

      case 'material':
      case 'thumbnail':
        if (!courseSlug || !lessonId) {
          return res.status(400).json({ error: 'courseSlug и lessonId обязательны для материалов' });
        }
        key = generateMaterialKey(courseSlug, lessonId, filename);
        break;

      default:
        return res.status(400).json({ error: 'Неверный тип файла' });
    }

    // Генерируем подписанный URL для загрузки (действителен 1 час)
    const uploadUrl = await generateUploadUrl(key, contentType, 3600);

    res.json({
      uploadUrl,
      key,
      expiresIn: 3600,
    });
  } catch (error: any) {
    console.error('Get upload URL error:', error);
    res.status(500).json({ error: 'Ошибка генерации URL для загрузки' });
  }
};

