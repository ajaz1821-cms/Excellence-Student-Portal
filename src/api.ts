const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { ...options, credentials: 'include', headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message ?? 'Unable to complete request');
  return body as T;
}

export type Student = { id: string; studentId: string; email: string; name: string; role: string; profile: { className: string; section: string | null; rollNumber: string | null; joinedAt: string | null } | null };
export type HomeworkItem = { id: string; title: string; description: string | null; dueDate: string; subject: string; teacherName: string; progress: number; status: string };
export type Course = { id: string; name: string; teacherName: string; room: string | null };
export type Mark = { id: string; subject: string; examName: string; score: number; maxScore: number; createdAt: string };
export type Holiday = { id: string; title: string; date: string; description: string | null };
export type Summary = { homeworkCompletion: number; averageScore: number; attendance: number; activeCourses: number };

export const api = {
  login: (studentId: string, password: string) => request<{ user: Student }>('/api/auth/login', { method: 'POST', body: JSON.stringify({ studentId, password }) }),
  logout: () => request<void>('/api/auth/logout', { method: 'POST' }),
  me: () => request<{ user: Student }>('/api/auth/me'),
  profile: () => request<Student>('/api/student/profile'),
  summary: () => request<Summary>('/api/student/summary'),
  homework: () => request<HomeworkItem[]>('/api/student/homework'),
  classroom: () => request<Course[]>('/api/student/classroom'),
  marks: () => request<Mark[]>('/api/student/marks'),
  holidays: () => request<Holiday[]>('/api/student/holidays'),
};
