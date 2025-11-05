// Бесплатный API для загрузки изображений
// ImgBB предоставляет бесплатный API ключ: можно получить на https://api.imgbb.com/

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

export const uploadImageToImgBB = async (file: File): Promise<string> => {
  // Проверяем наличие API ключа
  if (!IMGBB_API_KEY || IMGBB_API_KEY === 'your_imgbb_api_key_here') {
    throw new Error('ImgBB API ключ не настроен. Получите ключ на https://api.imgbb.com/');
  }

  // Валидируем файл
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'Ошибка загрузки на ImgBB');
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error?.message || 'Не удалось загрузить изображение');
    }

    return data.data.url;
  } catch (error: any) {
    console.error('ImgBB upload error:', error);
    throw new Error(error.message || 'Не удалось загрузить изображение');
  }
};

// Альтернатива: конвертация в base64 (работает без API, но файлы большие)
export const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Валидация файла
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Допустимы только JPG, PNG и WebP форматы' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'Размер файла не должен превышать 5MB' };
  }

  return { valid: true };
};

