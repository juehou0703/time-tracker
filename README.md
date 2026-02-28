# Time Tracker (Next.js + Postgres)

Personal time tracking with a single Next.js codebase (frontend + backend).

## Features (v0)

- Log time entries (category + activity)
- Analytics summary (pie charts) by day/week/month/quarter
- WhatsApp webhook endpoint (command parsing) to log time via messages

## Tech

- Next.js (App Router)
- Prisma + Postgres
- Recharts

## Local dev

1) Copy env:

```bash
cp .env.example .env
```

2) Set `DATABASE_URL` to a Postgres instance.

3) Install + migrate:

```bash
npm install
npx prisma migrate dev --name init
npm run dev
```

Open http://localhost:3000

## WhatsApp logging

Endpoint: `POST /api/whatsapp/webhook`

Simple payload:

```json
{ "text": "log past hour as workout", "from": "+1650..." }
```

If you set `ADMIN_API_KEY`, include `x-api-key: ...`.

## Hosting (suggested)

- App: Vercel
- DB: Neon (free Postgres)

Set env vars in Vercel: `DATABASE_URL`, optional `ADMIN_API_KEY`.
