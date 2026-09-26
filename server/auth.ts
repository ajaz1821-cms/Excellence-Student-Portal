import type { NextFunction, Request, Response } from 'express';
import argon2 from 'argon2';
import { prisma } from './db';

export const hashPassword = (password: string) => argon2.hash(password, { type: argon2.argon2id });
export const verifyPassword = (hash: string, password: string) => argon2.verify(hash, password);

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) return res.status(401).json({ message: 'Authentication required' });
  next();
}

export function requireRole(...roles: Array<'STUDENT' | 'TEACHER' | 'ADMIN'>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId) return res.status(401).json({ message: 'Authentication required' });
    const user = await prisma.user.findUnique({ where: { id: req.session.userId }, select: { role: true } });
    if (!user || !roles.includes(user.role)) return res.status(403).json({ message: 'Insufficient permissions' });
    next();
  };
}
