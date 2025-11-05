# ⚡ БЫСТРОЕ ИСПРАВЛЕНИЕ - 5 ШАГОВ

## 1️⃣ GitHub Desktop
```
Commit message: Fix: Configure proper SPA routing for Render
→ Commit to main
→ Push origin
```

## 2️⃣ Render Dashboard
```
https://dashboard.render.com
→ Выбрать flerr-web
→ Manual Deploy
→ Clear build cache & deploy
→ Подождать 3-5 минут
```

## 3️⃣ ImgBB API
```
https://api.imgbb.com/
→ Get API Key
→ Скопировать ключ
```

## 4️⃣ Render Environment
```
Dashboard → flerr-web → Environment
→ Найти VITE_IMGBB_API_KEY
→ Вставить ключ
→ Save Changes
```

## 5️⃣ Проверка
```
Открыть: https://flerr-web.onrender.com
→ Перейти на /login
→ Не должно быть 404!
→ F12 → Console → Не должно быть ошибок
```

---

## ✅ Готово!

Если все 5 шагов выполнены:
- ✅ Ошибка 404 исчезнет
- ✅ Все переходы будут работать
- ✅ Админка заработает
- ✅ Загрузка фото заработает

**Если проблема осталась → смотрите `FIX_RENDER_ROUTING.md`**

