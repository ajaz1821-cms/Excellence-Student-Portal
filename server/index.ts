import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { Pool } from 'pg';
import { z } from 'zod';
import { config, assertServerConfig } from './config';
import { prisma } from './db';
import { hashPassword, requireAuth, verifyPassword } from './auth';

assertServerConfig();
const app = express();
const PgStore = connectPgSimple(session);
const pool = new Pool({ connectionString: config.databaseUrl });

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: config.frontendUrl, credentials: true }));
app.use(express.json({ limit: '20kb' }));
app.use(session({
  store: new PgStore({ pool, tableName: 'Session', createTableIfMissing: false }),
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: config.nodeEnv === 'production', sameSite: config.nodeEnv === 'production' ? 'none' : 'lax', maxAge: 1000 * 60 * 60 * 8 },
}));

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false, message: { message: 'Too many login attempts. Try again later.' } });
const loginSchema = z.object({ studentId: z.string().trim().toUpperCase().min(6).max(40), password: z.string().min(8).max(128) });
const userSelect = { id: true, studentId: true, email: true, name: true, role: true, profile: true } as const;

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'excellence-student-portal' }));
app.post('/api/auth/login', loginLimiter, async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: 'Enter a valid Student ID and password.' });
    const user = await prisma.user.findUnique({ where: { studentId: parsed.data.studentId }, select: { ...userSelect, passwordHash: true } });
    if (!user || user.role !== 'STUDENT' || !(await verifyPassword(user.passwordHash, parsed.data.password))) return res.status(401).json({ message: 'Invalid Student ID or password.' });
    req.session.userId = user.id; req.session.role = user.role;
    const { passwordHash: _passwordHash, ...safeUser } = user;
    return res.json({ user: safeUser });
  } catch (error) { return next(error); }
});
app.post('/api/auth/logout', (req, res, next) => req.session.destroy((error) => error ? next(error) : res.status(204).end()));
app.get('/api/auth/me', async (req, res, next) => {
  try { if (!req.session.userId) return res.status(401).json({ message: 'Authentication required' }); const user = await prisma.user.findUnique({ where: { id: req.session.userId }, select: userSelect }); if (!user) return res.status(401).json({ message: 'Session expired' }); return res.json({ user }); } catch (error) { return next(error); }
});

app.use('/api/student', requireAuth);
app.get('/api/student/profile', async (req, res, next) => { try { const user = await prisma.user.findUnique({ where: { id: req.session.userId! }, select: userSelect }); return res.json(user); } catch (error) { return next(error); } });
app.get('/api/student/homework', async (req, res, next) => { try { const rows = await prisma.homeworkSubmission.findMany({ where: { studentId: req.session.userId! }, include: { homework: { include: { course: true } } }, orderBy: { homework: { dueDate: 'asc' } } }); return res.json(rows.map(({ homework, ...submission }) => ({ ...submission, title: homework.title, description: homework.description, dueDate: homework.dueDate, subject: homework.course.name, teacherName: homework.course.teacherName }))); } catch (error) { return next(error); } });
app.get('/api/student/classroom', async (req, res, next) => { try { const rows = await prisma.enrollment.findMany({ where: { studentId: req.session.userId! }, include: { course: true }, orderBy: { course: { name: 'asc' } } }); return res.json(rows.map(({ course }) => course)); } catch (error) { return next(error); } });
app.get('/api/student/marks', async (req, res, next) => { try { return res.json(await prisma.mark.findMany({ where: { studentId: req.session.userId! }, orderBy: [{ examName: 'asc' }, { subject: 'asc' }] })); } catch (error) { return next(error); } });
app.get('/api/student/holidays', async (_req, res, next) => { try { return res.json(await prisma.holiday.findMany({ where: { date: { gte: new Date() } }, orderBy: { date: 'asc' } })); } catch (error) { return next(error); } });
app.get('/api/student/summary', async (req, res, next) => { try { const [homework, marks, courses] = await Promise.all([prisma.homeworkSubmission.findMany({ where: { studentId: req.session.userId! } }), prisma.mark.findMany({ where: { studentId: req.session.userId! } }), prisma.enrollment.count({ where: { studentId: req.session.userId! } })]); const completion = homework.length ? Math.round(homework.reduce((sum, item) => sum + item.progress, 0) / homework.length) : 0; const average = marks.length ? Number((marks.reduce((sum, item) => sum + item.score / item.maxScore * 100, 0) / marks.length).toFixed(1)) : 0; return res.json({ homeworkCompletion: completion, averageScore: average, attendance: 94, activeCourses: courses }); } catch (error) { return next(error); } });

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => { console.error(error); res.status(500).json({ message: 'Unexpected server error' }); });

app.listen(config.port, () => console.log(`Student portal API listening on http://localhost:${config.port}`));

process.on('SIGTERM', async () => { await prisma.$disconnect(); await pool.end(); process.exit(0); });
export { app, hashPassword };
