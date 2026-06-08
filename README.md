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

Файл `vercel.json` уже настроен для SPA-роутинга.

## Структура

```
public/assets/   — фото объектов и логотипы партнёров
src/data.js      — каталог объектов
src/pages/       — страницы
src/components/  — UI-компоненты
```

## Примечания

- Форма заявки сохраняет данные в `sessionStorage` и показывает страницу «Спасибо». Для продакшена подключите отправку на email или CRM.
- Карта — демо-заглушка; 2GIS подключается отдельно по API-ключу.
