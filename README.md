# TMK Limited Properties Services

Сайт аренды офисов и коммерческой недвижимости в Алматы.

## Стек

- React 18 + Vite
- React Router (BrowserRouter)

## Локальная разработка

```bash
npm install
npm run dev
```

Откройте http://localhost:5173

## Сборка

```bash
npm run build
npm run preview
```

## Деплой на Vercel

1. Загрузите репозиторий на GitHub
2. Импортируйте проект в [Vercel](https://vercel.com)
3. Vercel автоматически определит Vite:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. В **Settings → Environment Variables** добавьте SMTP-переменные из `.env.example`

Файл `vercel.json` уже настроен для SPA-роутинга. API-роут `/api/send-lead` обрабатывается serverless-функцией автоматически.

## Отправка заявок на email

1. Скопируйте `.env.example` в `.env.local`
2. Укажите SMTP-доступ почтового ящика (лучше отдельный app password, не основной пароль)
3. Запустите `npm run dev` и отправьте тестовую заявку

Заявки уходят на `LEAD_TO_EMAIL` (по умолчанию `Yerlepessov.t@tmk-limited.com`).

## Структура

```
public/assets/   — фото объектов и логотипы партнёров
src/data.js      — каталог объектов
src/pages/       — страницы
src/components/  — UI-компоненты
```

## Примечания

- Форма заявки отправляет данные на email через `/api/send-lead` (SMTP). Настройка — в `.env.example`.
- Карта — демо-заглушка; 2GIS подключается отдельно по API-ключу.
