/* =============================================
   EDUVERSE LMS - BACKEND (Data Layer + Business Logic)
   All data lives here. In production replace with API calls.
   ============================================= */

'use strict';

/* ---- LOCALSTORAGE HELPERS ---- */
const Storage = {
  save(key, value) {
    try { localStorage.setItem('eduverse_' + key, JSON.stringify(value)); } catch(e) {}
  },
  load(key) {
    try { const v = localStorage.getItem('eduverse_' + key); return v ? JSON.parse(v) : null; } catch(e) { return null; }
  },
};

/* ---- DATA STORE ---- */
const DB = {
  students: [
    { id: 'STU-001', firstName: 'Arjun',   lastName: 'Sharma',   email: 'arjun.sharma@edu.com',   phone: '+91 98765 00001', dob: '2002-05-14', course: 'AWS Cloud',    att: 87, prog: 74, status: 'active',   avatar: 'AS', color: '#6C63FF', address: 'Bengaluru, KA' },
    { id: 'STU-002', firstName: 'Sneha',   lastName: 'Nair',     email: 'sneha.nair@edu.com',     phone: '+91 98765 00002', dob: '2001-11-22', course: 'Java Dev',     att: 95, prog: 91, status: 'active',   avatar: 'SN', color: '#10D98F', address: 'Kochi, KL' },
    { id: 'STU-003', firstName: 'Rahul',   lastName: 'Mehta',    email: 'rahul.mehta@edu.com',    phone: '+91 98765 00003', dob: '2003-02-08', course: 'Web Dev',      att: 72, prog: 56, status: 'active',   avatar: 'RM', color: '#FF8C42', address: 'Mumbai, MH' },
    { id: 'STU-004', firstName: 'Priya',   lastName: 'Reddy',    email: 'priya.reddy@edu.com',    phone: '+91 98765 00004', dob: '2002-07-30', course: 'Data Science', att: 88, prog: 83, status: 'active',   avatar: 'PR', color: '#38BDF8', address: 'Hyderabad, TS' },
    { id: 'STU-005', firstName: 'Kiran',   lastName: 'Kumar',    email: 'kiran.kumar@edu.com',    phone: '+91 98765 00005', dob: '2001-04-16', course: 'AWS Cloud',    att: 61, prog: 44, status: 'inactive', avatar: 'KK', color: '#F472B6', address: 'Delhi, DL' },
    { id: 'STU-006', firstName: 'Deepa',   lastName: 'Singh',    email: 'deepa.singh@edu.com',    phone: '+91 98765 00006', dob: '2002-09-03', course: 'Java Dev',     att: 92, prog: 88, status: 'active',   avatar: 'DS', color: '#A78BFA', address: 'Pune, MH' },
    { id: 'STU-007', firstName: 'Vikram',  lastName: 'Patel',    email: 'vikram.patel@edu.com',   phone: '+91 98765 00007', dob: '2003-01-25', course: 'Web Dev',      att: 79, prog: 62, status: 'active',   avatar: 'VP', color: '#FBBF24', address: 'Ahmedabad, GJ' },
    { id: 'STU-008', firstName: 'Anita',   lastName: 'Thomas',   email: 'anita.thomas@edu.com',   phone: '+91 98765 00008', dob: '2001-06-12', course: 'Data Science', att: 84, prog: 77, status: 'active',   avatar: 'AT', color: '#F87171', address: 'Chennai, TN' },
    { id: 'STU-009', firstName: 'Suresh',  lastName: 'Iyer',     email: 'suresh.iyer@edu.com',    phone: '+91 98765 00009', dob: '2002-12-20', course: 'AWS Cloud',    att: 68, prog: 50, status: 'pending',  avatar: 'SI', color: '#34D399', address: 'Bengaluru, KA' },
    { id: 'STU-010', firstName: 'Meena',   lastName: 'Das',      email: 'meena.das@edu.com',      phone: '+91 98765 00010', dob: '2001-08-07', course: 'Java Dev',     att: 97, prog: 96, status: 'active',   avatar: 'MD', color: '#60A5FA', address: 'Kolkata, WB' },
  ],

  courses: [
    { id: 'CRS-001', title: 'AWS Solutions Architect', icon: '☁️', level: 'Advanced',      students: 82, videos: 48, dur: '14 weeks', prog: 65, color: '#6C63FF', bg: 'linear-gradient(135deg,#1A1550,#2D1A5E)', desc: 'Complete AWS Cloud certification prep', playlist: '' },
    { id: 'CRS-002', title: 'Java Development',        icon: '☕', level: 'Intermediate',  students: 64, videos: 62, dur: '16 weeks', prog: 48, color: '#10D98F', bg: 'linear-gradient(135deg,#0D3326,#0A4532)', desc: 'Core Java to Spring Boot', playlist: '' },
    { id: 'CRS-003', title: 'Web Development',         icon: '🌐', level: 'Beginner',      students: 38, videos: 34, dur: '10 weeks', prog: 30, color: '#FF8C42', bg: 'linear-gradient(135deg,#3D1F0A,#4D2810)', desc: 'HTML, CSS, JavaScript, React', playlist: '' },
    { id: 'CRS-004', title: 'Data Science',            icon: '📊', level: 'Intermediate',  students: 56, videos: 41, dur: '12 weeks', prog: 55, color: '#38BDF8', bg: 'linear-gradient(135deg,#0A2B3D,#0A3550)', desc: 'Python, ML, Analytics', playlist: '' },
    { id: 'CRS-005', title: 'DevOps & CI/CD',          icon: '🔧', level: 'Advanced',      students: 28, videos: 29, dur: '10 weeks', prog: 20, color: '#F472B6', bg: 'linear-gradient(135deg,#3D0A2B,#4D0A3A)', desc: 'Docker, Jenkins, Kubernetes', playlist: '' },
    { id: 'CRS-006', title: 'Cloud Security',          icon: '🔐', level: 'Advanced',      students: 18, videos: 22, dur: '8 weeks',  prog: 10, color: '#FBBF24', bg: 'linear-gradient(135deg,#3D3000,#4D3D00)', desc: 'IAM, VPN, Security Best Practices', playlist: '' },
  ],

  assessments: [
    { id: 'QZ-001', title: 'Java Core Concepts Quiz',   course: 'Java Dev',     questions: 25, duration: 30, due: '2025-04-12', icon: '☕', color: '#FF8C42', done: false },
    { id: 'QZ-002', title: 'AWS IAM & S3 Test',         course: 'AWS Cloud',    questions: 30, duration: 45, due: '2025-04-15', icon: '☁️', color: '#6C63FF', done: true  },
    { id: 'QZ-003', title: 'HTML/CSS Practical',        course: 'Web Dev',      questions: 20, duration: 60, due: '2025-04-18', icon: '🌐', color: '#10D98F', done: false },
    { id: 'QZ-004', title: 'Python Data Analysis',      course: 'Data Science', questions: 28, duration: 40, due: '2025-04-20', icon: '📊', color: '#38BDF8', done: false },
    { id: 'QZ-005', title: 'OOP Design Patterns',       course: 'Java Dev',     questions: 22, duration: 35, due: '2025-04-22', icon: '🏗️', color: '#A78BFA', done: true  },
    { id: 'QZ-006', title: 'React Component Test',      course: 'Web Dev',      questions: 18, duration: 30, due: '2025-04-25', icon: '⚛️', color: '#F472B6', done: false },
  ],

  tasks: [
    { id: 'TSK-001', title: 'Build a REST API with Spring Boot', lang: 'Java',       diff: 'Medium', deadline: '2025-04-14', color: '#FF8C42', status: 'In Progress', desc: 'Create CRUD REST API using Spring Boot and MySQL' },
    { id: 'TSK-002', title: 'Deploy App to AWS EC2',             lang: 'Bash/AWS',   diff: 'Hard',   deadline: '2025-04-16', color: '#6C63FF', status: 'Not Started', desc: 'Deploy existing Spring Boot app to EC2 using Linux' },
    { id: 'TSK-003', title: 'Create React Dashboard UI',         lang: 'JavaScript', diff: 'Easy',   deadline: '2025-04-11', color: '#10D98F', status: 'Submitted',   desc: 'Build a responsive dashboard with React and Tailwind' },
    { id: 'TSK-004', title: 'Design SQL Database Schema',        lang: 'SQL',        diff: 'Medium', deadline: '2025-04-19', color: '#38BDF8', status: 'Not Started', desc: 'Design normalized schema for an LMS platform' },
    { id: 'TSK-005', title: 'Build CLI Todo App',                lang: 'Java',       diff: 'Easy',   deadline: '2025-04-10', color: '#FBBF24', status: 'Submitted',   desc: 'Command line to-do application with file persistence' },
    { id: 'TSK-006', title: 'Implement Binary Search Tree',      lang: 'Java',       diff: 'Hard',   deadline: '2025-04-23', color: '#A78BFA', status: 'In Progress', desc: 'BST with insert, delete, search, traversal methods' },
  ],

  notifications: [
    { icon: '📝', bg: 'rgba(108,99,255,.2)',   title: 'New quiz uploaded: Java OOP Test',              time: '5 min ago',   unread: true  },
    { icon: '✅', bg: 'rgba(16,217,143,.15)',  title: 'Arjun Sharma submitted Programming Task #3',    time: '22 min ago',  unread: true  },
    { icon: '⚠️', bg: 'rgba(251,191,36,.15)',  title: 'Kiran Kumar attendance below 65%',              time: '1 hour ago',  unread: true  },
    { icon: '🎓', bg: 'rgba(56,189,248,.15)',  title: 'Sneha Nair completed AWS Cloud course',         time: '2 hours ago', unread: true  },
    { icon: '📢', bg: 'rgba(244,114,182,.15)', title: 'Upcoming event: Tech Fest 2025 - Apr 20',       time: 'Yesterday',   unread: true  },
    { icon: '👤', bg: 'rgba(167,139,250,.15)', title: 'New student registered: Deepa Singh',           time: 'Yesterday',   unread: false },
    { icon: '📊', bg: 'rgba(255,140,66,.15)',  title: 'Monthly attendance report is ready',            time: '2 days ago',  unread: false },
    { icon: '🔐', bg: 'rgba(248,113,113,.15)', title: 'Admin login from new device detected',          time: '3 days ago',  unread: false },
  ],

  attendanceLog: {}, // { 'STU-001_2025-04-07': 'present'|'absent' }
  events: [],

  /* ---- PERSIST to localStorage ---- */
  persist(key) {
    Storage.save(key, this[key]);
  },

  /* ---- INIT: load saved data over defaults ---- */
  init() {
    const saved = {
      courses: Storage.load('courses'),
      students: Storage.load('students'),
      nextCourseNum: Storage.load('nextCourseNum'),
      nextStudentNum: Storage.load('nextStudentNum'),
      attendanceLog: Storage.load('attendanceLog'),
    };
    if (saved.courses)       this.courses       = saved.courses;
    if (saved.students)      this.students      = saved.students;
    if (saved.nextCourseNum) this.nextCourseNum  = saved.nextCourseNum;
    if (saved.nextStudentNum)this.nextStudentNum = saved.nextStudentNum;
    if (saved.attendanceLog) this.attendanceLog  = saved.attendanceLog;
  },
  getStats() {
    const total = this.students.length;
    const active = this.students.filter(s => s.status === 'active').length;
    const avgAtt = Math.round(this.students.reduce((a, s) => a + s.att, 0) / total);
    const avgProg = Math.round(this.students.reduce((a, s) => a + s.prog, 0) / total);
    return { total, active, courses: this.courses.length, avgAtt, avgProg };
  },

  /* ---- STUDENT CRUD ---- */
  nextStudentNum: 11,
  addStudent(data) {
    const num = String(this.nextStudentNum).padStart(3, '0');
    const id = data.customId || `STU-${num}`;
    const colors = ['#6C63FF','#10D98F','#FF8C42','#38BDF8','#F472B6','#A78BFA','#FBBF24','#F87171'];
    const student = {
      id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || '',
      dob: data.dob || '',
      course: data.course,
      att: 100, prog: 0,
      status: data.status || 'active',
      avatar: (data.firstName[0] + data.lastName[0]).toUpperCase(),
      color: colors[this.nextStudentNum % colors.length],
      address: data.address || '',
    };
    this.students.push(student);
    this.nextStudentNum++;
    this.persist('students');
    this.persist('nextStudentNum');
    return student;
  },

  deleteStudent(id) {
    this.students = this.students.filter(s => s.id !== id);
    this.persist('students');
  },

  updateStudent(id, updates) {
    const idx = this.students.findIndex(s => s.id === id);
    if (idx !== -1) Object.assign(this.students[idx], updates);
    this.persist('students');
  },

  getStudentById(id) {
    return this.students.find(s => s.id === id);
  },

  /* ---- COURSE CRUD ---- */
  nextCourseNum: 7,
  addCourse(data) {
    const colors = ['#6C63FF','#10D98F','#FF8C42','#38BDF8','#F472B6','#FBBF24'];
    const bgs = [
      'linear-gradient(135deg,#1A1550,#2D1A5E)',
      'linear-gradient(135deg,#0D3326,#0A4532)',
      'linear-gradient(135deg,#3D1F0A,#4D2810)',
      'linear-gradient(135deg,#0A2B3D,#0A3550)',
    ];
    const course = {
      id: `CRS-${String(this.nextCourseNum).padStart(3,'0')}`,
      title: data.title,
      icon: data.icon || '📘',
      level: data.level,
      students: 0,
      videos: 0,
      dur: data.duration || '8 weeks',
      prog: 0,
      color: colors[this.nextCourseNum % colors.length],
      bg: bgs[this.nextCourseNum % bgs.length],
      desc: data.desc || '',
      playlist: data.playlist || '',
    };
    this.courses.push(course);
    this.nextCourseNum++;
    this.persist('courses');
    this.persist('nextCourseNum');
    return course;
  },

  /* ---- ASSESSMENT CRUD ---- */
  nextQuizNum: 7,
  addAssessment(data) {
    const colors = ['#6C63FF','#10D98F','#FF8C42','#38BDF8','#F472B6'];
    const icons = { 'AWS Cloud': '☁️', 'Java Dev': '☕', 'Web Dev': '🌐', 'Data Science': '📊' };
    const quiz = {
      id: `QZ-${String(this.nextQuizNum).padStart(3,'0')}`,
      title: data.title,
      course: data.course,
      questions: parseInt(data.questions) || 20,
      duration: parseInt(data.duration) || 30,
      due: data.due || '',
      icon: icons[data.course] || '📝',
      color: colors[this.nextQuizNum % colors.length],
      done: false,
    };
    this.assessments.push(quiz);
    this.nextQuizNum++;
    return quiz;
  },

  /* ---- TASK CRUD ---- */
  nextTaskNum: 7,
  addTask(data) {
    const colors = ['#6C63FF','#10D98F','#FF8C42','#38BDF8','#F472B6','#FBBF24'];
    const task = {
      id: `TSK-${String(this.nextTaskNum).padStart(3,'0')}`,
      title: data.title,
      lang: data.lang,
      diff: data.diff,
      deadline: data.deadline || '',
      color: colors[this.nextTaskNum % colors.length],
      status: 'Not Started',
      desc: data.desc || '',
    };
    this.tasks.push(task);
    this.nextTaskNum++;
    return task;
  },

  /* ---- ATTENDANCE ---- */
  markAttendance(studentId, date, status) {
    this.attendanceLog[`${studentId}_${date}`] = status;
    this.persist('attendanceLog');
  },

  getAttendance(studentId, date) {
    return this.attendanceLog[`${studentId}_${date}`] || null;
  },

  getTodayAttendance() {
    const today = new Date().toISOString().split('T')[0];
    return this.students.map(s => ({
      ...s,
      todayStatus: this.getAttendance(s.id, today) || 'unmarked'
    }));
  },

  markAllPresent() {
    const today = new Date().toISOString().split('T')[0];
    this.students.forEach(s => this.markAttendance(s.id, today, 'present'));
  },

  /* ---- EVENTS ---- */
  addEvent(data) {
    this.events.push({ ...data, id: `EVT-${Date.now()}` });
    this.notifications.unshift({
      icon: '📢',
      bg: 'rgba(244,114,182,.15)',
      title: `Upcoming event: ${data.name}`,
      time: 'Just now',
      unread: true,
    });
  },

  /* ---- SEARCH ---- */
  search(query) {
    query = query.toLowerCase();
    return this.students.filter(s =>
      s.firstName.toLowerCase().includes(query) ||
      s.lastName.toLowerCase().includes(query) ||
      s.id.toLowerCase().includes(query) ||
      s.email.toLowerCase().includes(query) ||
      s.course.toLowerCase().includes(query)
    );
  },

  /* ---- EXPORT HELPERS ---- */
  getAttendanceTableData() {
    const today = new Date().toISOString().split('T')[0];
    return this.students.map(s => {
      const present = Math.round(22 * s.att / 100);
      return {
        name: `${s.firstName} ${s.lastName}`,
        id: s.id,
        course: s.course,
        email: s.email,
        totalDays: 22,
        present,
        absent: 22 - present,
        pct: s.att + '%',
        todayStatus: this.getAttendance(s.id, today) || 'unmarked',
      };
    });
  },
};

/* =============================================
   EXCEL EXPORT (SheetJS via CDN)
   ============================================= */
function exportAttendanceExcel() {
  // Dynamically load SheetJS if not present
  if (typeof XLSX === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
    script.onload = () => _doExportExcel();
    document.head.appendChild(script);
  } else {
    _doExportExcel();
  }
}

function _doExportExcel() {
  const data = DB.getAttendanceTableData();
  const rows = [
    ['EduVerse - Attendance Report'],
    [`Generated: ${new Date().toLocaleString()}`],
    [],
    ['Student Name', 'Student ID', 'Course', 'Email', 'Total Days', 'Present', 'Absent', 'Percentage', "Today's Status"],
    ...data.map(r => [r.name, r.id, r.course, r.email, r.totalDays, r.present, r.absent, r.pct, r.todayStatus]),
  ];

  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Column widths
  ws['!cols'] = [
    { wch: 22 }, { wch: 12 }, { wch: 18 }, { wch: 28 },
    { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 14 }
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Attendance');

  // Second sheet: Student List
  const sRows = [
    ['EduVerse - Student List'],
    [],
    ['Name', 'ID', 'Course', 'Email', 'Phone', 'Status', 'Attendance %', 'Progress %'],
    ...DB.students.map(s => [
      `${s.firstName} ${s.lastName}`, s.id, s.course,
      s.email, s.phone, s.status, s.att + '%', s.prog + '%'
    ]),
  ];
  const ws2 = XLSX.utils.aoa_to_sheet(sRows);
  ws2['!cols'] = [{ wch: 22 }, { wch: 12 }, { wch: 18 }, { wch: 28 }, { wch: 16 }, { wch: 10 }, { wch: 14 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, ws2, 'Students');

  XLSX.writeFile(wb, `EduVerse_Attendance_${new Date().toISOString().split('T')[0]}.xlsx`);
  showToast('📥 Excel file downloaded successfully!');
}

function exportStudentsCSV() {
  const rows = [
    ['Name', 'ID', 'Course', 'Email', 'Phone', 'Status', 'Attendance %', 'Progress %'],
    ...DB.students.map(s => [
      `${s.firstName} ${s.lastName}`, s.id, s.course,
      s.email, s.phone, s.status, s.att, s.prog
    ]),
  ];
  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `EduVerse_Students_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  showToast('📥 CSV downloaded!');
}

/* ---- INIT on load ---- */
DB.init();
