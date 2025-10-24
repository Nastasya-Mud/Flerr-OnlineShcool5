# Flerr Online School

Production-ready платформа онлайн-школы флористики с видеоуроками и системой промокодов.

## 🎨 Технологии

### Frontend
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- Framer Motion
- React Router
- Axios

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- AWS S3 совместимое хранилище

## 🚀 Быстрый старт

### Предварительные требования
- Node.js 18+
- MongoDB 6+
- S3-совместимое хранилище (AWS S3, Backblaze B2, MinIO и т.д.)

### Установка

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd flerr-online-school
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте `.env` файл на основе `.env.example`:
```bash
cp .env.example .env
```

4. Заполните переменные окружения в `.env`

5. Запустите MongoDB локально или используйте MongoDB Atlas

6. Заполните базу тестовыми данными:
```bash
npm run seed
```

7. Запустите приложение в режиме разработки:
```bash
npm run dev
```

Frontend будет доступен на `http://localhost:3000`
Backend API на `http://localhost:5000`

### Тестовые учетные данные (после seed)

**Администратор:**
- Email: admin@flerr.ru
- Password: admin123

**Студент:**
- Email: student@flerr.ru
- Password: student123

**Промокоды:**
- `WELCOME2024` - платформенный доступ
- `FLOWERS101` - курс "Основы флористики"

## 📁 Структура проекта

```
flerr-online-school/
├── apps/
│   ├── web/              # Frontend React приложение
│   │   ├── src/
│   │   │   ├── app/      # Страницы
│   │   │   ├── components/
│   │   │   │   ├── ui/   # shadcn/ui компоненты
│   │   │   │   └── domain/ # Доменные компоненты
│   │   │   ├── features/ # Функциональные модули
│   │   │   ├── lib/      # Утилиты и хуки
│   │   │   └── styles/   # Стили и тема
│   │   └── package.json
│   └── server/           # Backend Express приложение
│       ├── src/
│       │   ├── modules/  # API модули
│       │   ├── db/       # MongoDB подключение
│       │   ├── middlewares/
│       │   └── utils/
│       └── package.json
├── package.json          # Root package.json
└── README.md
```

## 🎨 Дизайн система

### Цветовая палитра
- **Accent Red**: `#A50C0A` - кнопки, акценты
- **Warm Brown**: `#9C7750` - вторичный текст
- **Sand**: `#E5CD9F` - градиенты
- **Light Cream**: `#F8EAC8` - основной фон
- **Deep Green**: `#333A1A` - основной текст

### Типографика
- Заголовки: Inter/Outfit (современный гротеск)
- Основной текст: Inter с увеличенным межстрочным интервалом

## 🔒 Система промокодов

Платформа использует систему промокодов для контроля доступа к контенту.

### Типы промокодов
- **platform** - открывает доступ ко всем курсам
- **course** - открывает доступ к конкретному курсу

### Характеристики промокода
- Срок действия (expires_at)
- Максимальное количество использований (max_uses)
- Статус (active/paused/expired)
- Счетчик активаций

## 📹 Работа с видео

Видео хранятся в S3-совместимом хранилище и защищены:
1. Публичный доступ к S3 закрыт
2. Backend генерирует временные подписанные URL (valid 1 hour)
3. Доступ выдается только после проверки активации промокода
4. Видео отдается через CDN для оптимизации

## 🔐 Безопасность

- JWT Access + Refresh токены
- HTTP-only cookies для refresh token
- Rate limiting на auth и promo endpoints
- Валидация всех входных данных с Zod
- CORS настроен для production доменов
- Защита от brute-force атак

## 📦 Деплой на Render

### 1. Подготовка MongoDB
Создайте базу данных MongoDB Atlas или используйте другой хостинг.

### 2. Настройка S3
Настройте S3 bucket или альтернативное хранилище (Backblaze B2, MinIO).

### 3. Создание сервисов на Render

#### Backend Service
1. New → Web Service
2. Connect repository
3. Settings:
   - Name: `flerr-server`
   - Environment: `Node`
   - Build Command: `npm install && npm run build:server`
   - Start Command: `npm start`
   - Root Directory: `apps/server`

4. Environment Variables:
   - Добавьте все переменные из `.env.example`

#### Frontend Service
1. New → Static Site
2. Connect repository
3. Settings:
   - Name: `flerr-web`
   - Build Command: `cd apps/web && npm install && npm run build`
   - Publish Directory: `apps/web/dist`

4. Environment Variables:
   - `VITE_API_URL` = URL вашего backend сервиса

### 4. Настройка DNS (опционально)
Привяжите свой домен к Render сервисам.

### 5. Заполнение данных
После деплоя запустите seed скрипт через Render Shell:
```bash
npm run seed
```

## 🧪 Разработка

### Добавление новых UI компонентов
Используем shadcn/ui CLI:
```bash
cd apps/web
npx shadcn-ui@latest add button
```

### API Endpoints

#### Auth
- `POST /api/auth/register` - регистрация
- `POST /api/auth/login` - вход
- `POST /api/auth/refresh` - обновление токена
- `POST /api/auth/forgot` - восстановление пароля
- `POST /api/auth/reset` - сброс пароля

#### Courses
- `GET /api/courses` - список курсов
- `GET /api/courses/:slug` - детали курса
- `POST /api/courses` - создать курс [admin]
- `PATCH /api/courses/:id` - обновить курс [admin]
- `DELETE /api/courses/:id` - удалить курс [admin]

#### Lessons
- `GET /api/courses/:courseSlug/lessons` - уроки курса
- `GET /api/lessons/:id` - детали урока + signed URL
- `POST /api/lessons` - создать урок [admin]
- `PATCH /api/lessons/:id` - обновить урок [admin]
- `POST /api/progress` - сохранить прогресс

#### Promo Codes
- `POST /api/promo/validate` - проверить код
- `POST /api/promo/activate` - активировать код
- `GET /api/promo` - список кодов [admin]
- `POST /api/promo` - создать код [admin]

#### Search
- `GET /api/search?q=...&filters=...` - поиск

#### Admin
- `GET /api/admin/stats` - статистика
- `POST /api/uploads/s3-sign` - pre-signed URL для загрузки

## 📝 License

Private - All rights reserved

## 💬 Поддержка

По вопросам обращайтесь: support@flerr.ru

