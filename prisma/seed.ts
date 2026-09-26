import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await argon2.hash('excellence', { type: argon2.argon2id });
  const student = await prisma.user.upsert({
    where: { studentId: 'AOE-2024-0148' },
    update: { passwordHash },
    create: { studentId: 'AOE-2024-0148', email: 'aarav.mehta@student.aoe.edu', name: 'Aarav Mehta', passwordHash, role: 'STUDENT', profile: { create: { className: 'Class 10', section: 'A', rollNumber: '18', joinedAt: new Date('2024-04-01') } } },
  });
  const subjects = [['Mathematics', 'Ms. Kapoor', '204'], ['Physics', 'Mr. Iyer', 'Lab 02'], ['English literature', 'Ms. Shah', '107'], ['Chemistry', 'Dr. Rao', 'Lab 01'], ['Biology', 'Mrs. Menon', '103'], ['Computer science', 'Mr. Verma', 'Lab 03']];
  for (const [name, teacherName, room] of subjects) {
    const course = await prisma.course.upsert({ where: { id: `seed-${name.toLowerCase().replaceAll(' ', '-')}` }, update: { teacherName, room }, create: { id: `seed-${name.toLowerCase().replaceAll(' ', '-')}`, name, teacherName, room } });
    await prisma.enrollment.upsert({ where: { studentId_courseId: { studentId: student.id, courseId: course.id } }, update: {}, create: { studentId: student.id, courseId: course.id } });
    const homework = await prisma.homework.upsert({ where: { id: `homework-${course.id}` }, update: {}, create: { id: `homework-${course.id}`, courseId: course.id, title: `${name} practice set`, description: `Complete the assigned ${name} practice work.`, dueDate: new Date('2026-09-30T17:00:00Z') } });
    await prisma.homeworkSubmission.upsert({ where: { homeworkId_studentId: { homeworkId: homework.id, studentId: student.id } }, update: {}, create: { homeworkId: homework.id, studentId: student.id, progress: name === 'English literature' ? 100 : 45, status: name === 'English literature' ? 'SUBMITTED' : 'IN_PROGRESS' } });
  }
  await prisma.mark.deleteMany({ where: { studentId: student.id } });
  await prisma.mark.createMany({ data: [['Mathematics', 96], ['Physics', 89], ['English literature', 94], ['Chemistry', 87]].map(([subject, score]) => ({ studentId: student.id, subject: String(subject), examName: 'Unit test 02', score: Number(score), maxScore: 100 })) });
  await prisma.holiday.deleteMany();
  await prisma.holiday.createMany({ data: [{ title: 'Gandhi Jayanti', date: new Date('2026-10-02'), description: 'Academy closed' }, { title: 'Dussehra break', date: new Date('2026-10-20'), description: 'Academy closed' }, { title: 'Diwali holiday', date: new Date('2026-11-08'), description: 'Academy closed' }] });
}

main().finally(() => prisma.$disconnect());
