import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.S3_REGION || 'us-east-1',
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || '',
    secretAccessKey: process.env.S3_SECRET_KEY || '',
  },
  forcePathStyle: true, // Для совместимости с MinIO и другими S3-совместимыми хранилищами
});

const S3_BUCKET = process.env.S3_BUCKET || 'flerr-videos';

/**
 * Генерирует подписанный URL для загрузки файла на S3
 * @param key - ключ файла в S3
 * @param contentType - тип контента
 * @param expiresIn - время жизни ссылки в секундах (по умолчанию 1 час)
 */
export const generateUploadUrl = async (
  key: string,
  contentType: string,
  expiresIn: number = 3600
): Promise<string> => {
  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
};

/**
 * Генерирует подписанный URL для скачивания файла из S3
 * @param key - ключ файла в S3
 * @param expiresIn - время жизни ссылки в секундах (по умолчанию 1 час)
 */
export const generateDownloadUrl = async (
  key: string,
  expiresIn: number = 3600
): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
};

/**
 * Генерирует ключ для видео файла
 * @param courseSlug - slug курса
 * @param lessonId - ID урока
 * @param filename - имя файла
 */
export const generateVideoKey = (courseSlug: string, lessonId: string, filename: string): string => {
  return `videos/${courseSlug}/${lessonId}/${filename}`;
};

/**
 * Генерирует ключ для обложки курса
 * @param courseSlug - slug курса
 * @param filename - имя файла
 */
export const generateCoverKey = (courseSlug: string, filename: string): string => {
  return `covers/${courseSlug}/${filename}`;
};

/**
 * Генерирует ключ для материалов урока
 * @param courseSlug - slug курса
 * @param lessonId - ID урока
 * @param filename - имя файла
 */
export const generateMaterialKey = (
  courseSlug: string,
  lessonId: string,
  filename: string
): string => {
  return `materials/${courseSlug}/${lessonId}/${filename}`;
};

