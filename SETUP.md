# Полная настройка платформы Flerr

Пошаговое руководство по настройке всех переменных окружения и сервисов.

## 📋 Чек-лист необходимых сервисов

- [ ] MongoDB - база данных
- [ ] S3 хранилище (необязательно для начала)
- [ ] SMTP для email (необязательно для начала)
- [ ] Render аккаунт для деплоя (или локальный запуск)

---

## 1️⃣ Минимальная настройка (для локального тестирования)

### Установка MongoDB локально

**Windows:**
1. Скачайте [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Установите с настройками по умолчанию
3. MongoDB запустится автоматически как служба

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

**Docker (рекомендуется):**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Создайте `.env` файл в корне проекта

```bash
cp .env.example .env
```

Отредактируйте `.env`:

```env
# MongoDB - локальное подключение
MONGODB_URI=mongodb://localhost:27017/flerr

# JWT секреты (для разработки можно оставить как есть)
JWT_SECRET=your-secret-key-min-32-chars-long
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars

# URLs для локальной разработки
APP_BASE_URL=http://localhost:3000
API_BASE_URL=http://localhost:5000

# Порт сервера
PORT=5000
NODE_ENV=development

# S3 и SMTP пока можно не заполнять
# Без них платформа работает, но:
# - Видео не загружаются (но можно смотреть тестовые уроки)
# - Email не отправляются (но авторизация работает)
```

### Запустите платформу

```bash
# Установка зависимостей
npm install

# Заполнение тестовыми данными
npm run seed

# Запуск
npm run dev
```

✅ **Готово!** Платформа работает на http://localhost:3000

---

## 2️⃣ Полная настройка (с видео и email)

### A. Настройка MongoDB Atlas (облачная БД)

1. **Создайте аккаунт:**
   - Перейдите на https://www.mongodb.com/cloud/atlas
   - Зарегистрируйтесь (бесплатно)

2. **Создайте кластер:**
   - Нажмите "Build a Database"
   - Выберите FREE tier (M0)
   - Регион: выберите ближайший к вам
   - Нажмите "Create"

3. **Создайте пользователя:**
   - В секции Security → Database Access
   - Add New Database User
   - Username: `flerr_admin`
   - Password: создайте надежный пароль (СОХРАНИТЕ ЕГО!)
   - Role: Atlas Admin
   - Add User

4. **Настройте доступ:**
   - Security → Network Access
   - Add IP Address
   - Для разработки: `0.0.0.0/0` (разрешить все IP)
   - Для production: добавьте конкретные IP Render

5. **Получите Connection String:**
   - Нажмите "Connect" на вашем кластере
   - Choose "Connect your application"
   - Скопируйте строку подключения
   - Замените `<password>` на ваш пароль

**Пример Connection String:**
```
mongodb+srv://flerr_admin:ВАШ_ПАРОЛЬ@cluster0.abcde.mongodb.net/flerr?retryWrites=true&w=majority
```

**Добавьте в `.env`:**
```env
MONGODB_URI=mongodb+srv://flerr_admin:ВАШ_ПАРОЛЬ@cluster0.abcde.mongodb.net/flerr?retryWrites=true&w=majority
```

---

### B. Настройка S3 хранилища (для видео)

#### Вариант 1: Backblaze B2 (РЕКОМЕНДУЕТСЯ - дешевле AWS)

1. **Создайте аккаунт:**
   - https://www.backblaze.com/b2/
   - Регистрация бесплатна
   - 10 GB хранилища бесплатно

2. **Создайте Bucket:**
   - B2 Cloud Storage → Buckets → Create a Bucket
   - Bucket Name: `flerr-videos` (уникальное имя)
   - Files in Bucket: **Private**
   - Lifecycle Settings: Keep all versions
   - Create Bucket

3. **Настройте CORS:**
   - Откройте ваш bucket
   - Bucket Settings → Bucket CORS Rules
   - Добавьте правило:

```json
[
  {
    "corsRuleName": "allowAll",
    "allowedOrigins": ["*"],
    "allowedOperations": ["s3_get", "s3_head", "s3_put"],
    "allowedHeaders": ["*"],
    "exposeHeaders": ["ETag"],
    "maxAgeSeconds": 3600
  }
]
```

4. **Создайте Application Key:**
   - App Keys → Add a New Application Key
   - Name: `flerr-app-key`
   - Allow access to Bucket: выберите `flerr-videos`
   - Permissions: Read and Write
   - Create New Key

5. **Сохраните данные:**
   - `keyID` - это ваш S3_ACCESS_KEY
   - `applicationKey` - это ваш S3_SECRET_KEY (покажется только 1 раз!)
   - `Endpoint` - найдите в Bucket Details

**Добавьте в `.env`:**
```env
S3_ENDPOINT=https://s3.us-west-004.backblazeb2.com
S3_REGION=us-west-004
S3_BUCKET=flerr-videos
S3_ACCESS_KEY=004abc123def456789
S3_SECRET_KEY=K004abcdefghijklmnopqrstuvwxyz123456
```

#### Вариант 2: AWS S3 (классический вариант)

1. **Создайте аккаунт AWS:**
   - https://aws.amazon.com
   - Потребуется кредитная карта

2. **Создайте S3 Bucket:**
   - Services → S3 → Create bucket
   - Bucket name: `flerr-videos-production` (уникальное)
   - Region: выберите ближайший
   - Block all public access: ✅ (оставьте включенным)
   - Create bucket

3. **Настройте CORS:**
   - Откройте bucket → Permissions → CORS
   - Добавьте:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"]
  }
]
```

4. **Создайте IAM пользователя:**
   - Services → IAM → Users → Add users
   - Username: `flerr-s3-user`
   - Access type: Programmatic access
   - Attach policy: `AmazonS3FullAccess`
   - Create user
   - **СОХРАНИТЕ** Access Key ID и Secret Access Key

**Добавьте в `.env`:**
```env
S3_ENDPOINT=https://s3.us-east-1.amazonaws.com
S3_REGION=us-east-1
S3_BUCKET=flerr-videos-production
S3_ACCESS_KEY=AKIAIOSFODNN7EXAMPLE
S3_SECRET_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

---

### C. Настройка SMTP (для email)

#### Вариант 1: Gmail (для начала)

1. **Включите 2FA:**
   - Google Account → Security
   - 2-Step Verification → включите

2. **Создайте App Password:**
   - Security → 2-Step Verification → App passwords
   - Select app: Mail
   - Select device: Other (Custom name) → "Flerr"
   - Generate
   - **СОХРАНИТЕ** пароль (16 символов без пробелов)

**Добавьте в `.env`:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=ваш.email@gmail.com
SMTP_PASS=abcd efgh ijkl mnop  # 16-символьный app password
```

#### Вариант 2: SendGrid (для production)

1. **Создайте аккаунт:**
   - https://sendgrid.com
   - Бесплатно 100 emails/день

2. **Создайте API Key:**
   - Settings → API Keys → Create API Key
   - Name: "Flerr SMTP"
   - Full Access
   - Create & View

3. **Настройте SMTP:**

**Добавьте в `.env`:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.ваш-api-ключ-очень-длинный
```

#### Вариант 3: Mailgun (альтернатива)

1. **Создайте аккаунт:**
   - https://www.mailgun.com
   - Бесплатно 5000 emails/месяц

2. **Получите SMTP credentials:**
   - Sending → Domain settings → SMTP credentials

**Добавьте в `.env`:**
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@вашдомен.mailgun.org
SMTP_PASS=ваш-smtp-пароль
```

---

## 3️⃣ Генерация безопасных секретов

### JWT секреты (ВАЖНО для production!)

**Генерация на Linux/Mac:**
```bash
# JWT_SECRET
openssl rand -base64 32

# JWT_REFRESH_SECRET
openssl rand -base64 32
```

**Генерация на Windows (PowerShell):**
```powershell
# JWT_SECRET
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))

# JWT_REFRESH_SECRET
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Онлайн генератор:**
- https://www.random.org/strings/
- Length: 32
- Format: Alphanumeric

**Пример:**
```env
JWT_SECRET=K9mN2pQ5rT8wX1zY4bC7fG0hJ3lM6nP9
JWT_REFRESH_SECRET=A1sD4fG7jK0lN3qT6wZ9cF2hL5pR8uY1
```

---

## 4️⃣ Полный пример `.env` файла

### Для локальной разработки:

```env
# База данных
MONGODB_URI=mongodb://localhost:27017/flerr

# JWT секреты (сгенерируйте свои!)
JWT_SECRET=your-super-secret-key-min-32-characters-long-dev
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-characters-long-dev

# URLs
APP_BASE_URL=http://localhost:3000
API_BASE_URL=http://localhost:5000

# Server
PORT=5000
NODE_ENV=development

# S3 (Backblaze B2)
S3_ENDPOINT=https://s3.us-west-004.backblazeb2.com
S3_REGION=us-west-004
S3_BUCKET=flerr-videos
S3_ACCESS_KEY=004ваш_access_key
S3_SECRET_KEY=K004ваш_secret_key

# Email (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your.email@gmail.com
SMTP_PASS=your app password here
```

### Для production на Render:

```env
# База данных (MongoDB Atlas)
MONGODB_URI=mongodb+srv://flerr_admin:PASSWORD@cluster0.abcde.mongodb.net/flerr?retryWrites=true&w=majority

# JWT секреты (ОБЯЗАТЕЛЬНО сгенерируйте новые!)
JWT_SECRET=prod-K9mN2pQ5rT8wX1zY4bC7fG0hJ3lM6nP9sV2
JWT_REFRESH_SECRET=prod-A1sD4fG7jK0lN3qT6wZ9cF2hL5pR8uY1xB4

# URLs (замените на ваши домены Render)
APP_BASE_URL=https://flerr-web.onrender.com
API_BASE_URL=https://flerr-server.onrender.com

# Server
PORT=5000
NODE_ENV=production

# S3 (Backblaze B2)
S3_ENDPOINT=https://s3.us-west-004.backblazeb2.com
S3_REGION=us-west-004
S3_BUCKET=flerr-videos-prod
S3_ACCESS_KEY=004ваш_access_key
S3_SECRET_KEY=K004ваш_secret_key

# Email (SendGrid для production)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.ваш_sendgrid_api_key
```

---

## 5️⃣ Проверка настройки

### Проверьте MongoDB подключение:

```bash
# В корне проекта
cd apps/server
npm install
npm run seed
```

Если видите сообщение `✅ MongoDB connected`, всё работает!

### Проверьте S3:

Создайте тестовый файл `test-upload.js`:

```javascript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
});

const command = new PutObjectCommand({
  Bucket: process.env.S3_BUCKET,
  Key: 'test.txt',
  Body: 'Hello Flerr!',
});

await s3.send(command);
console.log('✅ S3 works!');
```

### Проверьте SMTP:

В админке платформы попробуйте восстановить пароль - должно прийти письмо.

---

## 6️⃣ Настройка на Render

### Создайте сервисы:

1. **Backend (Web Service):**
   - New → Web Service
   - Connect GitHub repo
   - Name: `flerr-server`
   - Build: `npm install && npm run build:server`
   - Start: `npm start`
   - Add Environment Variables (все из `.env` для production)

2. **Frontend (Static Site):**
   - New → Static Site
   - Name: `flerr-web`
   - Build: `cd apps/web && npm install && npm run build`
   - Publish: `apps/web/dist`
   - Add Environment Variable:
     - `VITE_API_URL` = URL вашего backend (https://flerr-server.onrender.com)

### После деплоя:

1. Откройте Shell в backend сервисе
2. Запустите: `npm run seed`
3. Готово!

---

## 7️⃣ Частые проблемы

### "Cannot connect to MongoDB"
- Проверьте, что MongoDB запущен
- Проверьте connection string
- В MongoDB Atlas: добавьте IP `0.0.0.0/0` в Network Access

### "S3 Access Denied"
- Проверьте credentials
- Убедитесь, что bucket существует
- Проверьте CORS настройки

### "Cannot send email"
- Для Gmail: убедитесь, что используете App Password, а не обычный пароль
- Проверьте, что 2FA включена
- Для SendGrid: проверьте квоту бесплатного плана

### "JWT errors"
- Убедитесь, что JWT_SECRET и JWT_REFRESH_SECRET заданы
- Минимум 32 символа
- Разные для access и refresh

---

## 8️⃣ Дополнительные настройки (опционально)

### CloudFlare CDN для видео:

1. Создайте аккаунт CloudFlare
2. Добавьте ваш домен
3. Настройте R2 или подключите B2
4. В `.env` измените `S3_ENDPOINT` на CloudFlare URL

### Redis для кеширования:

```env
REDIS_URL=redis://localhost:6379
```

### Sentry для отслеживания ошибок:

```env
SENTRY_DSN=https://ваш@sentry.io/проект
```

---

## ✅ Чек-лист готовности к запуску

- [ ] MongoDB подключен и работает
- [ ] JWT секреты сгенерированы (32+ символа)
- [ ] S3 bucket создан и настроен CORS
- [ ] S3 credentials получены и работают
- [ ] SMTP настроен (или пропущен для начала)
- [ ] `.env` файл заполнен
- [ ] `npm install` выполнен без ошибок
- [ ] `npm run seed` создал тестовые данные
- [ ] `npm run dev` запустил приложение
- [ ] http://localhost:3000 открывается
- [ ] Можно залогиниться как admin@flerr.ru

---

## 🆘 Нужна помощь?

1. Проверьте логи в терминале
2. Убедитесь, что все сервисы запущены
3. Проверьте `.env` файл на опечатки
4. Попробуйте `npm run seed` ещё раз

**Готово!** 🎉 Платформа настроена и готова к работе!

