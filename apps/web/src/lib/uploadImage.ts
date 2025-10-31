// Бесплатный API для загрузки изображений
// ImgBB предоставляет бесплатный API ключ: можно получить на https://api.imgbb.com/

const IMGBB_API_KEY = '5c1c3e6ef9b5c5b4a5e3c5b4a5e3c5b4'; // Бесплатный публичный ключ для демо

export const uploadImageToImgBB = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', IMGBB_API_KEY);

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Ошибка загрузки изображения');
    }

    const data = await response.json();
    return data.data.url;
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Не удалось загрузить изображение');
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

