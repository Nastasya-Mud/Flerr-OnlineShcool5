# Примеры конфигурации переменных окружения

## 📋 Для локальной разработки

Создайте файл `.env` в корне проекта:

```env
# База данных (локальная MongoDB)
MONGODB_URI=mongodb://localhost:27017/flerr

# JWT секреты (для разработки)
JWT_SECRET=dev-secret-key-change-in-production-min-32-chars
JWT_REFRESH_SECRET=dev-refresh-secret-key-change-in-production-min-32-chars

# URLs
APP_BASE_URL=http://localhost:3000

# Сервер
PORT=5000
NODE_ENV=development

# S3 и SMTP можно не заполнять для начала
```

## 🚀 Для production на Render

### Backend Service (flerr-server)

В Render Dashboard → Environment Variables добавьте:

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://flerr_admin:ВАШ_ПАРОЛЬ@cluster0.xxxxx.mongodb.net/flerr?retryWrites=true&w=majority

# JWT (сгенерируйте в Render или используйте: openssl rand -base64 32)
JWT_SECRET=prod-K9mN2pQ5rT8wX1zY4bC7fG0hJ3lM6nP9sV2uW5xA8bD1
JWT_REFRESH_SECRET=prod-A1sD4fG7jK0lN3qT6wZ9cF2hL5pR8uY1xB4vC7eH0kM3

# URLs (замените на ваши Render URLs)
APP_BASE_URL=https://flerr-web.onrender.com
API_BASE_URL=https://flerr-server.onrender.com

# Server
PORT=5000
NODE_ENV=production

# S3 (Backblaze B2)
S3_ENDPOINT=https://s3.us-west-004.backblazeb2.com
S3_REGION=us-west-004
S3_BUCKET=flerr-videos-prod
S3_ACCESS_KEY=004ваш_key_id
S3_SECRET_KEY=K004ваш_application_key

# SMTP (SendGrid)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.ваш_sendgrid_api_key
```

### Frontend Static Site (flerr-web)

Только одна переменная:

```env
VITE_API_URL=https://flerr-server.onrender.com
```

## 🔑 Как получить каждую переменную

### MONGODB_URI

**Локально:**
```
mongodb://localhost:27017/flerr
```

**MongoDB Atlas:**
1. Создайте аккаунт → https://mongodb.com/cloud/atlas
2. Create FREE cluster (M0)
3. Database Access → Add Database User
4. Network Access → Add IP (0.0.0.0/0)
5. Connect → Connect your application
6. Копируйте connection string и замените <password>

### JWT_SECRET и JWT_REFRESH_SECRET

**Linux/Mac:**
```bash
openssl rand -base64 32
```

**Windows PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Min 0 -Max 256 }))
```

**В Render:**
При добавлении переменной нажмите "Generate Value"

### S3 переменные (Backblaze B2)

1. **Регистрация:** https://backblaze.com/b2
2. **Создайте Bucket:**
   - B2 Cloud Storage → Create a Bucket
   - Name: `flerr-videos`
   - Files: Private
3. **CORS настройки:**
   ```json
   [{
     "corsRuleName": "allowAll",
     "allowedOrigins": ["*"],
     "allowedOperations": ["s3_get", "s3_put"],
     "allowedHeaders": ["*"]
   }]
   ```
4. **Создайте App Key:**
   - App Keys → Add a New Application Key
   - Access: Read and Write
   - Сохраните:
     - `keyID` → S3_ACCESS_KEY
     - `applicationKey` → S3_SECRET_KEY

**Переменные:**
```env
S3_ENDPOINT=https://s3.us-west-004.backblazeb2.com  # Из Bucket Details
S3_REGION=us-west-004  # Из Bucket Details
S3_BUCKET=flerr-videos  # Имя вашего bucket
S3_ACCESS_KEY=004abc123...  # keyID из App Key
S3_SECRET_KEY=K004xyz789...  # applicationKey из App Key
```

### SMTP переменные (Gmail для разработки)

1. **Включите 2FA:** Google Account → Security → 2-Step Verification
2. **Создайте App Password:**
   - Security → 2-Step Verification → App passwords
   - Select app: Mail
   - Device: Other (Custom) → "Flerr"
   - Generate → сохраните 16-символьный пароль

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your.email@gmail.com
SMTP_PASS=abcdefghijklmnop  # 16 символов без пробелов
```

### SMTP переменные (SendGrid для production)

1. **Регистрация:** https://sendgrid.com
2. **Создайте API Key:**
   - Settings → API Keys → Create API Key
   - Name: "Flerr SMTP"
   - Full Access → Create & View
   - Сохраните ключ (показывается 1 раз!)

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.очень_длинный_api_ключ_от_sendgrid
```

## ✅ Проверка конфигурации

### 1. Проверка MongoDB

```bash
npm run seed
```

Должно вывести: `✅ MongoDB connected`

### 2. Проверка S3

В админке попробуйте загрузить изображение обложки курса.

### 3. Проверка SMTP

Попробуйте восстановить пароль - должно прийти письмо.

## 🆘 Частые ошибки

### "Cannot connect to MongoDB"
- Проверьте MONGODB_URI на опечатки
- В Atlas: убедитесь что IP 0.0.0.0/0 добавлен
- Замените <password> на реальный пароль (без < >)

### "JWT errors"
- JWT_SECRET минимум 32 символа
- Разные значения для JWT_SECRET и JWT_REFRESH_SECRET

### "S3 Access Denied"
- Проверьте S3_ACCESS_KEY и S3_SECRET_KEY
- Убедитесь что bucket существует
- Проверьте права Application Key (Read and Write)

### "Cannot send email"
- Gmail: используйте App Password, не обычный пароль
- Убедитесь что 2FA включена
- Проверьте что нет лишних пробелов в пароле

## 📚 Дополнительно

Полная документация по настройке: **SETUP.md**

