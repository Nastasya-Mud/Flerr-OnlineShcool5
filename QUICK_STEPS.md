# ⚡ БЫСТРЫЕ ШАГИ - Исправление 404

## 1️⃣ GitHub Desktop
```
Commit: "Fix: Convert frontend to Node.js Web Service for SPA routing"
→ Commit to main → Push origin
```

## 2️⃣ Render - Удалить старый Static Site
```
Dashboard → flerr-web (Static) 
→ Settings → Delete Service
```

## 3️⃣ Render - Создать новый Web Service
```
New + → Blueprint
→ Выбрать репозиторий
→ Выбрать только flerr-web
→ Apply
→ Подождать 5-7 минут
```

## 4️⃣ Настроить переменные
```
flerr-web → Environment → Добавить:
- NODE_ENV = production
- VITE_API_URL = https://flerr-server.onrender.com
- VITE_IMGBB_API_KEY = dc5f5f126ec04bde841e3ef1f26f407a
- PORT = 3000
→ Save Changes
```

## 5️⃣ Проверка
```
Открыть: https://flerr-web.onrender.com/login
✅ Должно работать без 404!
```

---

**Подробности в `FINAL_FIX_SPA_ROUTING.md`**

