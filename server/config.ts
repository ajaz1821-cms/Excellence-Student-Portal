import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: process.env.DATABASE_URL ?? '',
  sessionSecret: process.env.SESSION_SECRET ?? '',
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  nodeEnv: process.env.NODE_ENV ?? 'development',
};

export function assertServerConfig() {
  if (!config.databaseUrl) throw new Error('DATABASE_URL is required');
  if (config.sessionSecret.length < 32) throw new Error('SESSION_SECRET must be at least 32 characters');
}
