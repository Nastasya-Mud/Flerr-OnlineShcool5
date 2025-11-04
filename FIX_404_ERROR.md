# Исправление ошибки 404 "Not Found"

## Проблема

При переходе по любым URL в приложении (например, `/login`, `/admin`, `/courses`) вы видите **"Not Found"**.

Это происходит потому, что Render Static Site ищет физический файл по этому пути, но в SPA (Single Page Application) все маршруты обрабатываются клиентским React Router.

## Решение

Файл `apps/web/public/_redirects` уже создан с содержимым:
```
/*    /index.html   200
```

Это говорит Render: "Для ЛЮБОГО URL верни index.html и пусть React Router сам разберется с маршрутизацией".

## Что нужно сделать

### 1. Убедитесь, что файл есть в репозитории:
```bash
ls -la apps/web/public/_redirects
```

Если файл есть - переходите к шагу 2.

### 2. Запушьте изменения на GitHub:

**Через GitHub Desktop:**
1. Откройте GitHub Desktop
2. Убедитесь, что видите файл `apps/web/public/_redirects` в списке изменений
3. Commit message: `Fix SPA routing with _redirects file`
4. Нажмите `Commit to main`
5. Нажмите `Push origin`

**Или через командную строку:**
```bash
git add apps/web/public/_redirects
git commit -m "Fix SPA routing with _redirects file"
git push
```

### 3. Дождитесь деплоя на Render:

1. Откройте https://dashboard.render.com
2. Выберите сервис `flerr-web`
3. Дождитесь, пока статус станет **"Live"** (2-3 минуты)

### 4. Проверьте результат:

После деплоя:
- ✅ Переходы по URL будут работать
- ✅ Обновление страницы (F5) не вызовет 404
- ✅ Прямые ссылки (например, `flerr-web.onrender.com/admin`) будут работать
- ✅ Кнопка "Назад" в браузере будет работать

## Альтернативный способ проверки

Если после деплоя ошибка сохраняется:

1. Проверьте, что файл задеплоился:
   - Откройте DevTools (F12) → Network
   - Обновите страницу
   - Найдите запрос к `_redirects`
   - Убедитесь, что он возвращает 200 OK

2. Проверьте настройки Render:
   - В настройках `flerr-web` → Build Command должно быть: `npm run build`
   - Publish Directory должна быть: `dist`

## Если проблема не решена

Попробуйте создать файл `vercel.json` (альтернатива для Render):

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

Или файл `netlify.toml`:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Но обычно `_redirects` работает на Render без проблем!

