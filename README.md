# Academy of Excellence — Student Portal

A professional student portal backed by **PostgreSQL, Prisma, Express, and secure server-side sessions**. The React dashboard keeps the existing Academy of Excellence visual system while reading profile, homework, classroom, marks, and holiday data from protected API endpoints.

## Architecture

```text
React/Vite frontend → Express API → Prisma → PostgreSQL
                           ↓
                  HttpOnly session cookie
```

The browser never connects directly to PostgreSQL. Passwords are hashed with Argon2id, login is rate-limited, requests are validated, and student records are scoped to the authenticated session.

## Features

- Secure Student ID/password login
- Argon2id password hashing
- PostgreSQL schema and Prisma migration
- Persistent PostgreSQL session store
- Protected student-only API routes
- Profile, homework, classroom, marks, performance summary, and holidays from live database data
- Helmet security headers, CORS allow-list, request body limits, login rate limiting
- Seed data for the first student and sample academic records
- Responsive student dashboard for desktop and mobile

## Local development

Prerequisites: Node.js 20+, Docker Desktop, and npm.

```bash
cp .env.example .env
# Keep the values in .env local; never commit it.
docker compose up -d
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
```

Run the API and frontend in separate terminals:

```bash
npm run dev:server
npm run dev
```

- Frontend: http://localhost:3000
- API health: http://localhost:4000/api/health

### Seed login

```text
Student ID: AOE-2024-0148
Password: excellence
```

The password is stored only as an Argon2id hash. Change or remove the seed credentials before production launch.

## Environment variables

```env
DATABASE_URL=postgresql://user:password@host:5432/excellence
SESSION_SECRET=at-least-32-random-characters
FRONTEND_URL=https://portal.example.com
VITE_API_URL=https://api.example.com
PORT=4000
NODE_ENV=production
```

Set these through your hosting provider's secret manager. Do not commit `.env`, database URLs, session secrets, or production credentials.

## Database workflow

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

Use `prisma migrate deploy` during production releases. Back up the managed PostgreSQL database before applying migrations.

## API surface

```text
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
GET  /api/health
GET  /api/student/profile
GET  /api/student/summary
GET  /api/student/homework
GET  /api/student/classroom
GET  /api/student/marks
GET  /api/student/holidays
```

All `/api/student/*` routes require the authenticated HttpOnly session cookie and resolve the student from the server-side session. A client-supplied student ID is never trusted for authorization.

## Production deployment

1. Create a managed PostgreSQL database using Neon, Supabase, Railway, Render, or Amazon RDS.
2. Deploy the Express API to Railway, Render, Fly.io, or a similar Node.js host.
3. Add `DATABASE_URL`, `SESSION_SECRET`, `FRONTEND_URL`, `PORT`, and `NODE_ENV` to the API host.
4. Run `npm run db:migrate` as the release migration step.
5. Run the seed once only if you intentionally want the sample account.
6. Deploy the Vite frontend with `VITE_API_URL` pointing to the API domain.
7. Configure the Academy website login handoff to open the deployed portal domain.
8. Use HTTPS on both domains and verify CORS and cookie behavior in a production browser.

For a real academy rollout, add teacher/admin routes with role checks before giving staff the ability to create homework, publish marks, manage holidays, or edit student profiles.
