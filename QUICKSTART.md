# Быстрый старт

Самый быстрый способ запустить Flerr локально.

## Предварительные требования

- Node.js 18+
- MongoDB (локально или Docker)
- npm или yarn

## Установка за 5 минут

### 1. Клонируйте репозиторий

```bash
git clone <your-repo-url>
cd flerr-online-school
```

### 2. Установите зависимости

```bash
npm install
```

### 3. Настройте MongoDB

#### Вариант А: Docker (рекомендуется)

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### Вариант Б: Локальная установка

Установите MongoDB с [mongodb.com](https://www.mongodb.com/try/download/community) и запустите:

```bash
mongod
```

### 4. Создайте `.env` файлы

В корне проекта уже есть `.env.example`. Скопируйте его:

```bash
cp .env.example .env
```

Минимальная конфигурация для локального запуска (уже в `.env.example`):

```env
MONGODB_URI=mongodb://localhost:27017/flerr
JWT_SECRET=dev-secret-key-change-in-production
JWT_REFRESH_SECRET=dev-refresh-secret-key
APP_BASE_URL=http://localhost:3000
API_BASE_URL=http://localhost:5000
```

> **Примечание**: Для полной функциональности (загрузка видео, email) настройте S3 и SMTP. Но для тестирования они не обязательны.

### 5. Заполните тестовыми данными

```bash
npm run seed
```

Будут созданы:
- **Админ**: admin@flerr.ru / admin123
- **Студент**: student@flerr.ru / student123
- **Курсы**: 3 курса с уроками
- **Промокоды**: WELCOME2024, FLOWERS101, WEDDING2024

### 6. Запустите приложение

```bash
npm run dev
```

Это запустит одновременно:
- Frontend на http://localhost:3000
- Backend на http://localhost:5000

### 7. Откройте в браузере

Перейдите на http://localhost:3000

🎉 **Готово!** Платформа запущена.

## Тестирование

### Войдите как студент

1. Перейдите на http://localhost:3000/login
2. Email: `student@flerr.ru`
3. Password: `student123`
4. Активируйте промокод `WELCOME2024` для доступа ко всем курсам

### Войдите как администратор

1. Перейдите на http://localhost:3000/login
2. Email: `admin@flerr.ru`
3. Password: `admin123`
4. Перейдите в админку: http://localhost:3000/admin

## Что дальше?

### Настройка S3 для видео (опционально для разработки)

Если хотите загружать видео, настройте S3:

1. Создайте аккаунт на [Backblaze B2](https://www.backblaze.com/b2/) (дешевле AWS)
2. Создайте bucket
3. Получите credentials
4. Добавьте в `.env`:

```env
S3_ENDPOINT=https://s3.us-west-000.backblazeb2.com
S3_REGION=us-west-000
S3_BUCKET=your-bucket-name
S3_ACCESS_KEY=your-key-id
S3_SECRET_KEY=your-secret
```

### Настройка Email (опционально)

Для восстановления пароля настройте SMTP:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=your-app-password
```

## Полезные команды

```bash
# Запуск в режиме разработки
npm run dev

# Только frontend
npm run dev:web

# Только backend
npm run dev:server

# Пересоздать тестовые данные
npm run seed

# Production build
npm run build

# Запуск production build
npm start
```

## Структура проекта

```
flerr-online-school/
├── apps/
│   ├── web/          # React frontend
│   └── server/       # Express backend
├── .env              # Переменные окружения
├── package.json      # Root package
└── README.md
```

## Возникли проблемы?

### MongoDB не подключается

```bash
# Проверьте, запущен ли MongoDB
mongo --version

# Или через Docker
docker ps | grep mongo
```

### Порт уже занят

Измените порт в `.env`:
```env
PORT=5001  # Вместо 5000
```

### Ошибка при npm install

Попробуйте:
```bash
rm -rf node_modules apps/*/node_modules
npm install
```

## Следующие шаги

1. 📖 Прочитайте [README.md](./README.md) для подробной информации
2. 🚀 Изучите [DEPLOY.md](./DEPLOY.md) для деплоя на Render
3. ✨ Посмотрите [FEATURES.md](./FEATURES.md) для списка всех функций
4. 🔧 Настройте S3 и SMTP для полной функциональности

---

**Приятного использования Flerr! 🌸**

