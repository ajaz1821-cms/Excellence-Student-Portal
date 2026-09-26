import { createContext, useContext, useEffect, useMemo, useState, type FormEvent } from 'react';
import { api, type Course, type Holiday, type HomeworkItem, type Mark, type Student, type Summary } from './api';
import {
  Award,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  GraduationCap,
  Home,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Moon,
  PanelLeftClose,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
  X,
} from 'lucide-react';

const student = {
  name: 'Aarav Mehta',
  id: 'AOE-2024-0148',
  className: 'Class 10 · Section A',
  roll: '18',
  email: 'aarav.mehta@student.aoe.edu',
  joined: 'April 2024',
};

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'profile', label: 'My profile', icon: UserRound },
  { id: 'homework', label: 'Homework', icon: ClipboardCheck },
  { id: 'classroom', label: 'Classroom', icon: UsersRound },
  { id: 'performance', label: 'Performance', icon: Sparkles },
  { id: 'marks', label: 'Marks & results', icon: Award },
  { id: 'holidays', label: 'Holidays', icon: CalendarDays },
];

const assignments = [
  { subject: 'Mathematics', title: 'Quadratic equations · worksheet 04', due: 'Today, 5:00 PM', progress: 80, tone: 'orange' },
  { subject: 'Physics', title: 'Lab report: Refraction of light', due: 'Tomorrow', progress: 45, tone: 'blue' },
  { subject: 'English', title: 'The last lesson · reflection note', due: '28 Sep 2026', progress: 100, tone: 'green' },
];

const holidays = [
  { date: '02', month: 'OCT', title: 'Gandhi Jayanti', day: 'Friday' },
  { date: '20', month: 'OCT', title: 'Dussehra break', day: 'Tuesday' },
  { date: '08', month: 'NOV', title: 'Diwali holiday', day: 'Sunday' },
];

type PortalState = { student: Student; summary: Summary; homework: HomeworkItem[]; courses: Course[]; marks: Mark[]; holidays: Holiday[] };
const PortalContext = createContext<PortalState | null>(null);
const usePortal = () => {
  const value = useContext(PortalContext);
  if (!value) throw new Error('Portal data is unavailable');
  return value;
};

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState('overview');
  const [menuOpen, setMenuOpen] = useState(false);
  const [credentials, setCredentials] = useState({ id: new URLSearchParams(window.location.search).get('studentId') ?? '', password: '' });
  const [error, setError] = useState('');
  const [portal, setPortal] = useState<PortalState | null>(null);

  const activeLabel = useMemo(() => navItems.find((item) => item.id === activePage)?.label ?? 'Overview', [activePage]);

  const login = async (event: FormEvent) => {
    event.preventDefault();
    try { const response = await api.login(credentials.id, credentials.password); setPortal(await loadPortal(response.user)); setError(''); setLoggedIn(true); } catch (loginError) { setError(loginError instanceof Error ? loginError.message : 'Unable to sign in'); }
  };

  const loadPortal = async (signedInStudent: Student) => {
    const [summary, homework, courses, marks, holidays] = await Promise.all([api.summary(), api.homework(), api.classroom(), api.marks(), api.holidays()]);
    return { student: signedInStudent, summary, homework, courses, marks, holidays };
  };

  useEffect(() => { api.me().then(({ user }) => loadPortal(user).then((data) => { setPortal(data); setLoggedIn(true); })).catch(() => undefined); }, []);

  if (!loggedIn) {
    return (
      <div className="login-shell">
        <div className="login-glow login-glow-one" />
        <div className="login-glow login-glow-two" />
        <header className="login-header">
          <a className="brand" href="/">
            <img src="/logo.png" alt="Academy of Excellence" />
            <span><strong>ACADEMY</strong><small>OF EXCELLENCE</small></span>
          </a>
          <a className="back-link" href="https://github.com/ajaz1821-cms/Excellence-">Back to academy website <ChevronRight size={16} /></a>
        </header>
        <main className="login-main">
          <section className="login-copy">
            <span className="eyebrow"><ShieldCheck size={15} /> Secure student access</span>
            <h1>Your progress,<br /><em>all in one place.</em></h1>
            <p>Stay close to your classroom, track your learning, and keep every important update within reach.</p>
            <div className="login-proof"><div className="avatar-stack"><span>AM</span><span>RK</span><span>PS</span></div><div><strong>120+ learners</strong><small>learning with confidence</small></div></div>
          </section>
          <section className="login-card">
            <div className="card-kicker">WELCOME BACK</div>
            <h2>Sign in to your portal</h2>
            <p className="card-subtitle">Use the Student ID shared by your academy.</p>
            <form onSubmit={login}>
              <label>Student ID<div className="input-wrap"><UserRound size={18} /><input value={credentials.id} onChange={(e) => setCredentials({ ...credentials, id: e.target.value })} placeholder="AOE-2024-XXXX" autoComplete="username" /></div></label>
              <label>Password<div className="input-wrap"><KeyRound size={18} /><input type="password" value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} placeholder="Enter your password" autoComplete="current-password" /></div></label>
              {error && <div className="form-error">{error}</div>}
              <button className="primary-button" type="submit">Open my dashboard <ChevronRight size={18} /></button>
            </form>
            <div className="demo-note"><span>PRIVATE ACADEMY ACCESS</span><p className="help-text">Use the credentials issued by Academy administration.</p></div>
            <p className="help-text">Need help signing in? <a href="mailto:admin@aoe.edu">Contact administration</a></p>
          </section>
        </main>
        <footer className="login-footer"><span>© 2026 Academy of Excellence</span><span>Private student portal · Built for focused learning</span></footer>
      </div>
    );
  }

  const goTo = (page: string) => { setActivePage(page); setMenuOpen(false); };

  return (
    <PortalContext.Provider value={portal!}><div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-top"><a className="brand" href="/"><img src="/logo.png" alt="Academy of Excellence" /><span><strong>ACADEMY</strong><small>OF EXCELLENCE</small></span></a><button className="icon-button close-mobile" onClick={() => setMenuOpen(false)}><X size={20} /></button></div>
        <div className="workspace-label">STUDENT WORKSPACE</div>
        <nav>{navItems.map(({ id, label, icon: Icon }) => <button key={id} className={activePage === id ? 'nav-item active' : 'nav-item'} onClick={() => goTo(id)}><Icon size={18} /><span>{label}</span>{activePage === id && <span className="nav-dot" />}</button>)}</nav>
        <div className="sidebar-bottom"><div className="support-card"><MessageCircle size={18} /><div><strong>Need a hand?</strong><small>Ask your class mentor</small></div><ChevronRight size={15} /></div><button className="logout" onClick={() => { api.logout().finally(() => { setLoggedIn(false); setPortal(null); }); }}><LogOut size={17} /> Sign out</button></div>
      </aside>
      <div className="main-area">
        <header className="topbar"><button className="icon-button menu-trigger" onClick={() => setMenuOpen(true)}><Menu size={21} /></button><div><div className="breadcrumb">STUDENT PORTAL <ChevronRight size={13} /> {activeLabel.toUpperCase()}</div><h1>{activeLabel}</h1></div><div className="topbar-actions"><button className="icon-button"><Search size={19} /></button><button className="icon-button notification"><Bell size={19} /><span /></button><div className="top-profile"><span className="initials">{portal.student.name.slice(0, 2).toUpperCase()}</span><div><strong>{portal.student.name}</strong><small>{portal.student.profile?.className} · Section {portal.student.profile?.section}</small></div><ChevronRight size={16} /></div></div></header>
        <main className="content">{activePage === 'overview' && <Overview goTo={goTo} />}{activePage === 'profile' && <Profile />}{activePage === 'homework' && <Homework />}{activePage === 'classroom' && <Classroom />}{activePage === 'performance' && <Performance />}{activePage === 'marks' && <Marks />}{activePage === 'holidays' && <Holidays />}</main>
      </div>
    </div></PortalContext.Provider>
  );
}

function SectionHeading({ kicker, title, action }: { kicker: string; title: string; action?: string }) { return <div className="section-heading"><div><span className="eyebrow">{kicker}</span><h2>{title}</h2></div>{action && <button className="text-button">{action} <ChevronRight size={16} /></button>}</div>; }
function Overview({ goTo }: { goTo: (page: string) => void }) { const { student: currentStudent, summary, homework } = usePortal(); return <><section className="welcome-banner"><div><span className="eyebrow light"><Sparkles size={15} /> Live from your academy</span><h2>Good morning, {currentStudent.name.split(' ')[0]}.</h2><p>Your dashboard is connected to your secure student record.</p></div><div className="banner-mark"><GraduationCap size={62} /></div></section><section className="stat-grid"><Stat icon={ClipboardCheck} label="Homework completion" value={`${summary.homeworkCompletion}%`} change="From submitted work" tone="orange" /><Stat icon={Award} label="Average score" value={`${summary.averageScore}`} change="Across latest marks" tone="blue" /><Stat icon={Clock3} label="Attendance" value={`${summary.attendance}%`} change="Excellent standing" tone="green" /><Stat icon={BookOpen} label="Active courses" value={String(summary.activeCourses).padStart(2, '0')} change="Current enrolments" tone="purple" /></section><section className="dashboard-grid"><div className="panel assignments-panel"><SectionHeading kicker="UP NEXT" title="Homework queue" action="View all" /><div className="assignment-list">{homework.slice(0, 3).map((item) => <div className="assignment" key={item.id}><span className="subject-icon orange"><BookOpen size={17} /></span><div className="assignment-body"><div className="assignment-meta"><span>{item.subject}</span><strong>{item.progress === 100 ? 'Complete' : new Date(item.dueDate).toLocaleDateString()}</strong></div><h3>{item.title}</h3><div className="progress-row"><div className="progress"><i className="orange" style={{ width: `${item.progress}%` }} /></div><small>{item.progress}%</small></div></div></div>)}</div></div><div className="panel focus-panel"><SectionHeading kicker="YOUR FOCUS" title="This week" /><div className="focus-ring"><div><strong>{summary.homeworkCompletion}</strong><small>focus score</small></div></div><p>Your progress is calculated from live homework and marks in the academy database.</p><button className="soft-button" onClick={() => goTo('performance')}>See my performance <ChevronRight size={16} /></button></div></section><section className="lower-grid"><div className="panel schedule-panel"><SectionHeading kicker="YOUR LEARNING" title="Classroom access" action="View classroom" /><div className="schedule-row"><span className="time">LIVE</span><span className="schedule-line orange" /><div><strong>Your classes are connected</strong><small>Open Classroom to view teachers and rooms</small></div><span className="live-pill">SYNCED</span></div><div className="schedule-row"><span className="time">SECURE</span><span className="schedule-line blue" /><div><strong>Protected student record</strong><small>Only your authenticated account can access it</small></div></div></div><div className="panel notice-panel"><span className="notice-icon"><Bell size={19} /></span><div><span className="eyebrow">DATA STATUS</span><h3>Everything is up to date</h3><p>Your student information is being read from the protected portal API.</p><button className="text-button">Last sync: just now <CheckCircle2 size={16} /></button></div></div></section></>; }
function Stat({ icon: Icon, label, value, change, tone }: { icon: typeof Award; label: string; value: string; change: string; tone: string }) { return <div className="stat-card"><span className={`stat-icon ${tone}`}><Icon size={19} /></span><div><small>{label}</small><strong>{value}</strong><span className="stat-change">{change}</span></div></div>; }
function Profile() { const { student: currentStudent } = usePortal(); const profile = currentStudent.profile; return <><SectionHeading kicker="STUDENT RECORD" title="My profile" /><div className="profile-layout"><div className="panel profile-card"><div className="profile-hero"><span className="profile-avatar">{currentStudent.name.slice(0, 2).toUpperCase()}</span><div><h3>{currentStudent.name}</h3><p>{profile?.className} · Section {profile?.section} · Roll no. {profile?.rollNumber}</p></div><span className="verified"><CheckCircle2 size={15} /> Verified</span></div><div className="detail-grid"><Detail label="Student ID" value={currentStudent.studentId} /><Detail label="Email address" value={currentStudent.email} /><Detail label="Joined academy" value={profile?.joinedAt ? new Date(profile.joinedAt).toLocaleDateString() : '—'} /><Detail label="Current term" value="Term 1 · 2026–27" /></div></div><div className="panel profile-side"><span className="eyebrow">ACCOUNT SECURITY</span><h3>Your account is protected</h3><p>Your student portal access is private to you. Never share your password with anyone.</p><button className="soft-button">Change password <KeyRound size={16} /></button></div></div></>; }
function Detail({ label, value }: { label: string; value: string }) { return <div className="detail"><span>{label}</span><strong>{value}</strong></div>; }
function Homework() { const { homework } = usePortal(); return <><SectionHeading kicker="LEARNING TASKS" title="Homework" action="Live from database" /><div className="filter-row"><span className="filter-chip active">All tasks <b>{homework.length}</b></span><span className="filter-chip">In progress <b>{homework.filter((item) => item.progress < 100).length}</b></span><span className="filter-chip">Completed <b>{homework.filter((item) => item.progress === 100).length}</b></span></div><div className="task-grid">{homework.map((item) => <div className="panel task-card" key={item.id}><span className="subject-icon orange"><BookOpen size={17} /></span><span className="eyebrow">{item.subject}</span><h3>{item.title}</h3><div className="progress-row"><div className="progress"><i className="orange" style={{ width: `${item.progress}%` }} /></div><small>{item.progress}%</small></div><div className="task-footer"><span><Clock3 size={14} /> {item.progress === 100 ? 'Submitted' : new Date(item.dueDate).toLocaleDateString()}</span><button className="arrow-button"><ChevronRight size={17} /></button></div></div>)}</div></>; }
function Classroom() { const { courses } = usePortal(); return <><SectionHeading kicker="YOUR CLASSES" title="Classroom" /><div className="classroom-grid">{courses.map((course, index) => <div className="panel class-card" key={course.id}><div className={`class-cover cover-${(index % 6) + 1}`}><span>{course.name.slice(0, 2).toUpperCase()}</span></div><div><span className="eyebrow">{course.teacherName}</span><h3>{course.name}</h3><p>{course.room ?? 'Room to be announced'}</p></div><ChevronRight size={18} /></div>)}</div></>; }
function Performance() { return <><SectionHeading kicker="LEARNING INSIGHTS" title="Performance" /><div className="performance-grid"><div className="panel score-panel"><div className="panel-title"><div><span className="eyebrow">TERM AVERAGE</span><h3>91.4 <small>/ 100</small></h3></div><span className="positive"><Sparkles size={14} /> +3.4</span></div><div className="chart"><div className="chart-labels"><span>100</span><span>75</span><span>50</span><span>25</span></div><div className="chart-bars">{[52, 68, 61, 77, 72, 86, 91, 91].map((height, i) => <div className="bar-group" key={i}><i style={{ height: `${height}%` }} /><small>{['M', 'P', 'E', 'C', 'M', 'P', 'E', 'C'][i]}</small></div>)}</div></div></div><div className="panel strengths-panel"><span className="eyebrow">STRENGTHS</span><h3>Where you shine</h3>{[['Problem solving', '92%', 'orange'], ['Consistency', '88%', 'blue'], ['Participation', '84%', 'green']].map(([label, value, tone]) => <div className="strength" key={label}><div><span>{label}</span><strong>{value}</strong></div><div className="progress"><i className={tone} style={{ width: value }} /></div></div>)}</div></div></>; }
function Marks() { const { marks } = usePortal(); const average = marks.length ? (marks.reduce((sum, mark) => sum + mark.score / mark.maxScore * 100, 0) / marks.length).toFixed(1) : '0.0'; return <><SectionHeading kicker="ASSESSMENTS" title="Marks & results" /><div className="panel marks-panel"><div className="marks-summary"><span className="marks-badge"><Award size={25} /></span><div><span className="eyebrow">LATEST REPORT</span><h3>{marks[0]?.examName ?? 'No assessments yet'} <small>· Live results</small></h3></div><strong className="total-score">{average}<small> average</small></strong></div><div className="marks-table">{marks.map((mark) => <div className="marks-row" key={mark.id}><span>{mark.subject}</span><div className="mini-progress"><i style={{ width: `${mark.score / mark.maxScore * 100}%` }} /></div><strong>{mark.score}<small> / {mark.maxScore}</small></strong><span className="grade">{mark.score / mark.maxScore > .9 ? 'A+' : 'A'}</span></div>)}</div></div></>; }
function Holidays() { const { holidays } = usePortal(); return <><SectionHeading kicker="ACADEMIC CALENDAR" title="Holidays" action="Live calendar" /><div className="holiday-intro panel"><div><span className="eyebrow">UPCOMING BREAKS</span><h3>Plan your learning around the year.</h3><p>Keep this calendar handy for holidays, observances, and academy closures.</p></div><CalendarDays size={70} /></div><div className="holiday-list">{holidays.map((holiday) => { const date = new Date(holiday.date); return <div className="panel holiday-card" key={holiday.id}><div className="date-block"><strong>{date.getDate().toString().padStart(2, '0')}</strong><span>{date.toLocaleString('en', { month: 'short' }).toUpperCase()}</span></div><div><h3>{holiday.title}</h3><p>{date.toLocaleDateString()} · {holiday.description ?? 'Academy holiday'}</p></div><ChevronRight size={18} /></div>; })}</div></>; }

export default App;
