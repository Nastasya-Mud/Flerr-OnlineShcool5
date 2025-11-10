const FALLBACK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"><defs><linearGradient id="g" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#F6E8D4"/><stop offset="100%" stop-color="#E7D4B2"/></linearGradient></defs><rect width="600" height="400" rx="24" fill="url(#g)"/><g fill="#A50C0A" font-family="'Segoe UI',sans-serif" text-anchor="middle"><text x="50%" y="52%" font-size="44" font-weight="700">Flerr</text><text x="50%" y="68%" font-size="20" fill="#9C7750">Изображение недоступно</text></g></svg>`;

export const FALLBACK_IMAGE_DATA_URI = `data:image/svg+xml;utf8,${encodeURIComponent(FALLBACK_SVG)}`;

const TRANSLATION_HOSTS = new Set(['images.unsplash.com']);
const UNSUPPORTED_PAGE_HOSTS = new Set(['ibb.co']);

export function getOptimizedImageUrl(url?: string | null): string {
  if (!url) return FALLBACK_IMAGE_DATA_URI;

  try {
    const parsed = new URL(url);

    if (UNSUPPORTED_PAGE_HOSTS.has(parsed.hostname)) {
      // Ссылка ведет на html-страницу, возвращаем заглушку.
      return FALLBACK_IMAGE_DATA_URI;
    }

    if (TRANSLATION_HOSTS.has(parsed.hostname)) {
      const params = parsed.searchParams;
      if (!params.has('w')) params.set('w', '1000');
      if (!params.has('q')) params.set('q', '80');
      if (!params.has('auto')) params.set('auto', 'format');
      if (!params.has('fit')) params.set('fit', 'crop');
      parsed.search = params.toString();
      return parsed.toString();
    }

    return parsed.toString();
  } catch (error) {
    console.warn('Не удалось разобрать URL изображения, используется заглушка', url, error);
    return FALLBACK_IMAGE_DATA_URI;
  }
}


