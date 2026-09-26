import { useMemo, useState, type FormEvent } from 'react';
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

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState('overview');
  const [menuOpen, setMenuOpen] = useState(false);
  const [credentials, setCredentials] = useState({ id: new URLSearchParams(window.location.search).get('studentId') ?? '', password: '' });
  const [error, setError] = useState('');

  const activeLabel = useMemo(() => navItems.find((item) => item.id === activePage)?.label ?? 'Overview', [activePage]);

  const login = (event: FormEvent) => {
    event.preventDefault();
    if (credentials.id.trim().toUpperCase() === student.id && credentials.password === 'excellence') {
      setError('');
      setLoggedIn(true);
      localStorage.setItem('aoe_student_id', student.id);
      return;
    }
    setError('Use the demo credentials shown below, or ask administration for your account.');
  };

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
            <div className="demo-note"><span>DEMO ACCESS</span><code>AOE-2024-0148</code><code>excellence</code></div>
            <p className="help-text">Need help signing in? <a href="mailto:admin@aoe.edu">Contact administration</a></p>
          </section>
        </main>
        <footer className="login-footer"><span>© 2026 Academy of Excellence</span><span>Private student portal · Built for focused learning</span></footer>
      </div>
    );
  }

  const goTo = (page: string) => { setActivePage(page); setMenuOpen(false); };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-top"><a className="brand" href="/"><img src="/logo.png" alt="Academy of Excellence" /><span><strong>ACADEMY</strong><small>OF EXCELLENCE</small></span></a><button className="icon-button close-mobile" onClick={() => setMenuOpen(false)}><X size={20} /></button></div>
        <div className="workspace-label">STUDENT WORKSPACE</div>
        <nav>{navItems.map(({ id, label, icon: Icon }) => <button key={id} className={activePage === id ? 'nav-item active' : 'nav-item'} onClick={() => goTo(id)}><Icon size={18} /><span>{label}</span>{activePage === id && <span className="nav-dot" />}</button>)}</nav>
        <div className="sidebar-bottom"><div className="support-card"><MessageCircle size={18} /><div><strong>Need a hand?</strong><small>Ask your class mentor</small></div><ChevronRight size={15} /></div><button className="logout" onClick={() => setLoggedIn(false)}><LogOut size={17} /> Sign out</button></div>
      </aside>
      <div className="main-area">
        <header className="topbar"><button className="icon-button menu-trigger" onClick={() => setMenuOpen(true)}><Menu size={21} /></button><div><div className="breadcrumb">STUDENT PORTAL <ChevronRight size={13} /> {activeLabel.toUpperCase()}</div><h1>{activeLabel}</h1></div><div className="topbar-actions"><button className="icon-button"><Search size={19} /></button><button className="icon-button notification"><Bell size={19} /><span /></button><div className="top-profile"><span className="initials">AM</span><div><strong>{student.name}</strong><small>{student.className}</small></div><ChevronRight size={16} /></div></div></header>
        <main className="content">{activePage === 'overview' && <Overview goTo={goTo} />}{activePage === 'profile' && <Profile />}{activePage === 'homework' && <Homework />}{activePage === 'classroom' && <Classroom />}{activePage === 'performance' && <Performance />}{activePage === 'marks' && <Marks />}{activePage === 'holidays' && <Holidays />}</main>
      </div>
    </div>
  );
}

function SectionHeading({ kicker, title, action }: { kicker: string; title: string; action?: string }) { return <div className="section-heading"><div><span className="eyebrow">{kicker}</span><h2>{title}</h2></div>{action && <button className="text-button">{action} <ChevronRight size={16} /></button>}</div>; }
function Overview({ goTo }: { goTo: (page: string) => void }) { return <><section className="welcome-banner"><div><span className="eyebrow light"><Sparkles size={15} /> Monday, 26 September 2026</span><h2>Good morning, Aarav.</h2><p>You’re on a strong run this week. Keep the momentum going.</p></div><div className="banner-mark"><GraduationCap size={62} /></div></section><section className="stat-grid"><Stat icon={ClipboardCheck} label="Homework completion" value="86%" change="+8.2% this month" tone="orange" /><Stat icon={Award} label="Average score" value="91.4" change="+3.4 points" tone="blue" /><Stat icon={Clock3} label="Attendance" value="94%" change="Excellent standing" tone="green" /><Stat icon={BookOpen} label="Active courses" value="06" change="Across 4 subjects" tone="purple" /></section><section className="dashboard-grid"><div className="panel assignments-panel"><SectionHeading kicker="UP NEXT" title="Homework queue" action="View all" /><div className="assignment-list">{assignments.map((item) => <div className="assignment" key={item.title}><span className={`subject-icon ${item.tone}`}><BookOpen size={17} /></span><div className="assignment-body"><div className="assignment-meta"><span>{item.subject}</span><strong>{item.progress === 100 ? 'Complete' : item.due}</strong></div><h3>{item.title}</h3><div className="progress-row"><div className="progress"><i className={item.tone} style={{ width: `${item.progress}%` }} /></div><small>{item.progress}%</small></div></div></div>)}</div></div><div className="panel focus-panel"><SectionHeading kicker="YOUR FOCUS" title="This week" /><div className="focus-ring"><div><strong>78</strong><small>focus score</small></div></div><p>Small, consistent sessions are adding up. You’re <strong>12% ahead</strong> of your last month’s pace.</p><button className="soft-button" onClick={() => goTo('performance')}>See my performance <ChevronRight size={16} /></button></div></section><section className="lower-grid"><div className="panel schedule-panel"><SectionHeading kicker="TODAY" title="Class schedule" action="Full timetable" /><div className="schedule-row"><span className="time">09:00</span><span className="schedule-line orange" /><div><strong>Mathematics</strong><small>Quadratic equations · Room 204</small></div><span className="live-pill">IN 20 MIN</span></div><div className="schedule-row"><span className="time">11:30</span><span className="schedule-line blue" /><div><strong>Physics practical</strong><small>Refraction of light · Lab 02</small></div></div><div className="schedule-row"><span className="time">14:00</span><span className="schedule-line purple" /><div><strong>English literature</strong><small>The last lesson · Room 107</small></div></div></div><div className="panel notice-panel"><span className="notice-icon"><Bell size={19} /></span><div><span className="eyebrow">LATEST NOTICE</span><h3>Parent-teacher meeting</h3><p>Meeting slots for October are now open. Choose a convenient time before 30 September.</p><button className="text-button">View notice <ChevronRight size={16} /></button></div></div></section></>; }
function Stat({ icon: Icon, label, value, change, tone }: { icon: typeof Award; label: string; value: string; change: string; tone: string }) { return <div className="stat-card"><span className={`stat-icon ${tone}`}><Icon size={19} /></span><div><small>{label}</small><strong>{value}</strong><span className="stat-change">{change}</span></div></div>; }
function Profile() { return <><SectionHeading kicker="STUDENT RECORD" title="My profile" /><div className="profile-layout"><div className="panel profile-card"><div className="profile-hero"><span className="profile-avatar">AM</span><div><h3>{student.name}</h3><p>{student.className} · Roll no. {student.roll}</p></div><span className="verified"><CheckCircle2 size={15} /> Verified</span></div><div className="detail-grid"><Detail label="Student ID" value={student.id} /><Detail label="Email address" value={student.email} /><Detail label="Joined academy" value={student.joined} /><Detail label="Current term" value="Term 1 · 2026–27" /></div></div><div className="panel profile-side"><span className="eyebrow">ACCOUNT SECURITY</span><h3>Your account is protected</h3><p>Your student portal access is private to you. Never share your password with anyone.</p><button className="soft-button">Change password <KeyRound size={16} /></button></div></div></>; }
function Detail({ label, value }: { label: string; value: string }) { return <div className="detail"><span>{label}</span><strong>{value}</strong></div>; }
function Homework() { return <><SectionHeading kicker="LEARNING TASKS" title="Homework" action="Filter by subject" /><div className="filter-row"><span className="filter-chip active">All tasks <b>08</b></span><span className="filter-chip">To do <b>05</b></span><span className="filter-chip">Completed <b>03</b></span></div><div className="task-grid">{assignments.concat([{ subject: 'Chemistry', title: 'Carbon compounds · practice set', due: '30 Sep 2026', progress: 20, tone: 'purple' }]).map((item) => <div className="panel task-card" key={item.title}><span className={`subject-icon ${item.tone}`}><BookOpen size={17} /></span><span className="eyebrow">{item.subject}</span><h3>{item.title}</h3><div className="progress-row"><div className="progress"><i className={item.tone} style={{ width: `${item.progress}%` }} /></div><small>{item.progress}%</small></div><div className="task-footer"><span><Clock3 size={14} /> {item.progress === 100 ? 'Submitted' : item.due}</span><button className="arrow-button"><ChevronRight size={17} /></button></div></div>)}</div></>; }
function Classroom() { return <><SectionHeading kicker="YOUR CLASSES" title="Classroom" /><div className="classroom-grid">{['Mathematics', 'Physics', 'English literature', 'Chemistry', 'Biology', 'Computer science'].map((name, index) => <div className="panel class-card" key={name}><div className={`class-cover cover-${index + 1}`}><span>{['M', 'P', 'E', 'C', 'B', 'CS'][index]}</span></div><div><span className="eyebrow">{['Ms. Kapoor', 'Mr. Iyer', 'Ms. Shah', 'Dr. Rao', 'Mrs. Menon', 'Mr. Verma'][index]}</span><h3>{name}</h3><p>{index + 3} upcoming lessons</p></div><ChevronRight size={18} /></div>)}</div></>; }
function Performance() { return <><SectionHeading kicker="LEARNING INSIGHTS" title="Performance" /><div className="performance-grid"><div className="panel score-panel"><div className="panel-title"><div><span className="eyebrow">TERM AVERAGE</span><h3>91.4 <small>/ 100</small></h3></div><span className="positive"><Sparkles size={14} /> +3.4</span></div><div className="chart"><div className="chart-labels"><span>100</span><span>75</span><span>50</span><span>25</span></div><div className="chart-bars">{[52, 68, 61, 77, 72, 86, 91, 91].map((height, i) => <div className="bar-group" key={i}><i style={{ height: `${height}%` }} /><small>{['M', 'P', 'E', 'C', 'M', 'P', 'E', 'C'][i]}</small></div>)}</div></div></div><div className="panel strengths-panel"><span className="eyebrow">STRENGTHS</span><h3>Where you shine</h3>{[['Problem solving', '92%', 'orange'], ['Consistency', '88%', 'blue'], ['Participation', '84%', 'green']].map(([label, value, tone]) => <div className="strength" key={label}><div><span>{label}</span><strong>{value}</strong></div><div className="progress"><i className={tone} style={{ width: value }} /></div></div>)}</div></div></>; }
function Marks() { return <><SectionHeading kicker="ASSESSMENTS" title="Marks & results" /><div className="panel marks-panel"><div className="marks-summary"><span className="marks-badge"><Award size={25} /></span><div><span className="eyebrow">LATEST REPORT</span><h3>Unit test 02 <small>· Published 22 Sep 2026</small></h3></div><strong className="total-score">91.4<small> average</small></strong></div><div className="marks-table">{[['Mathematics', '96', '100'], ['Physics', '89', '100'], ['English literature', '94', '100'], ['Chemistry', '87', '100']].map(([subject, score, max]) => <div className="marks-row" key={subject}><span>{subject}</span><div className="mini-progress"><i style={{ width: `${Number(score)}%` }} /></div><strong>{score}<small> / {max}</small></strong><span className="grade">{Number(score) > 90 ? 'A+' : 'A'}</span></div>)}</div></div></>; }
function Holidays() { return <><SectionHeading kicker="ACADEMIC CALENDAR" title="Holidays" action="Download calendar" /><div className="holiday-intro panel"><div><span className="eyebrow">UPCOMING BREAKS</span><h3>Plan your learning around the year.</h3><p>Keep this calendar handy for holidays, observances, and academy closures.</p></div><CalendarDays size={70} /></div><div className="holiday-list">{holidays.map((holiday) => <div className="panel holiday-card" key={holiday.title}><div className="date-block"><strong>{holiday.date}</strong><span>{holiday.month}</span></div><div><h3>{holiday.title}</h3><p>{holiday.day} · Academy closed</p></div><ChevronRight size={18} /></div>)}</div></>; }

export default App;
