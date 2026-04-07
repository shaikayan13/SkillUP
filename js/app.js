/* =============================================
   EDUVERSE LMS - APP.JS (UI Layer)
   ============================================= */

'use strict';

/* =============================================
   SPLASH SCREEN ANIMATION
   ============================================= */
(function runSplash() {
  const steps = [
    { msg: 'Loading data...', pct: 20 },
    { msg: 'Initializing modules...', pct: 45 },
    { msg: 'Building dashboard...', pct: 70 },
    { msg: 'Applying theme...', pct: 88 },
    { msg: 'Ready!', pct: 100 },
  ];
  let i = 0;
  const fill = document.getElementById('splashFill');
  const status = document.getElementById('splashStatus');

  function step() {
    if (i >= steps.length) {
      setTimeout(launchApp, 300);
      return;
    }
    fill.style.width = steps[i].pct + '%';
    status.textContent = steps[i].msg;
    i++;
    setTimeout(step, 350);
  }

  setTimeout(step, 400);
})();

function launchApp() {
  const splash = document.getElementById('splash');
  const app = document.getElementById('app');
  splash.classList.add('exit');
  setTimeout(() => {
    splash.style.display = 'none';
    app.style.display = 'flex';
    initApp();
  }, 600);
}

/* =============================================
   INIT
   ============================================= */
function initApp() {
  updateStats();
  buildAttChart('att-chart');
  buildStudentsTable();
  buildAllStudentsTable();
  buildCoursesGrid();
  buildCalendar();
  buildAttList();
  buildAttMonthly();
  buildTopPerformers();
  buildMyCourses();
  buildSchedule();
  buildAssessments();
  buildTasks();
  buildNotifications();
  buildNotificationsPage();
}

/* =============================================
   NAVIGATION
   ============================================= */
function navigate(el, page) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById('page-' + page);
  if (pg) pg.classList.add('active');
  const titles = {
    admin: 'Admin Dashboard', students: 'Students',
    courses: 'Courses', attendance: 'Attendance Tracker',
    notifications: 'Notifications', settings: 'Settings',
    'student-dash': 'Student Portal', assessments: 'Assessments',
    programming: 'Programming Tasks',
  };
  document.getElementById('page-title').textContent = titles[page] || page;
  if (window.innerWidth < 900) {
    document.getElementById('sidebar').classList.remove('open');
  }
}

/* =============================================
   STATS
   ============================================= */
function updateStats() {
  const stats = DB.getStats();
  animateNumber('total-students', stats.total);
  animateNumber('active-courses', stats.courses);
  setTimeout(() => {
    document.getElementById('completion-rate').textContent = stats.avgProg + '%';
    document.getElementById('attendance-rate').textContent = stats.avgAtt + '%';
  }, 800);
  document.getElementById('badge-students').textContent = stats.total;
}

function animateNumber(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  let current = 0;
  const step = Math.max(1, Math.floor(target / 30));
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(timer);
  }, 40);
}

/* =============================================
   ATTENDANCE CHART
   ============================================= */
const attData = [72, 81, 69, 94, 87, 78, 85];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function buildAttChart(containerId) {
  const c = document.getElementById(containerId);
  if (!c) return;
  c.innerHTML = days.map((d, i) => `
    <div class="chart-bar-wrap">
      <div class="chart-bar-val">${attData[i]}%</div>
      <div class="chart-bar" style="height:${attData[i]}px;background:${i === 3 ? 'linear-gradient(180deg,#6C63FF,#8B5CF6)' : 'linear-gradient(180deg,rgba(108,99,255,.55),rgba(108,99,255,.25))'}"></div>
      <div class="chart-label">${d}</div>
    </div>`).join('');
}

/* =============================================
   STUDENTS TABLE (Dashboard)
   ============================================= */
function buildStudentsTable() {
  const b = document.getElementById('students-table-body');
  if (!b) return;
  b.innerHTML = DB.students.slice(0, 5).map(s => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <div style="width:28px;height:28px;border-radius:8px;background:${s.color}22;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:${s.color}">${s.avatar}</div>
          <span style="font-weight:600;color:var(--text)">${s.firstName} ${s.lastName}</span>
        </div>
      </td>
      <td style="font-family:'Space Grotesk',sans-serif;font-size:11px">${s.id}</td>
      <td>${s.course}</td>
      <td><span class="status-badge ${statusClass(s.status)}">${s.status}</span></td>
    </tr>`).join('');
}

/* =============================================
   ALL STUDENTS TABLE (Students Page)
   ============================================= */
let studentPage = 0;
const pageSize = 8;

function buildAllStudentsTable(filtered) {
  const all = filtered !== undefined ? filtered : DB.students;
  const count = document.getElementById('students-count');
  if (count) count.textContent = `${all.length} student${all.length !== 1 ? 's' : ''}`;

  const b = document.getElementById('all-students-table');
  if (!b) return;

  const page = all.slice(studentPage * pageSize, (studentPage + 1) * pageSize);

  b.innerHTML = page.map(s => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px">
          <div style="width:34px;height:34px;border-radius:10px;background:${s.color}22;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:${s.color}">${s.avatar}</div>
          <div>
            <div style="font-weight:600;color:var(--text);font-size:13px">${s.firstName} ${s.lastName}</div>
            <div style="font-size:11px;color:var(--text3)">${s.email}</div>
          </div>
        </div>
      </td>
      <td style="font-family:'Space Grotesk',sans-serif;font-size:12px;color:var(--accent3)">${s.id}</td>
      <td>${s.course}</td>
      <td>
        <span style="font-weight:600;color:${s.att >= 85 ? 'var(--green)' : s.att >= 70 ? 'var(--yellow)' : 'var(--red)'}">${s.att}%</span>
      </td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <div style="width:60px;height:5px;background:var(--bg3);border-radius:3px;overflow:hidden">
            <div style="width:${s.prog}%;height:100%;background:${s.color};border-radius:3px"></div>
          </div>
          <span style="font-size:11px">${s.prog}%</span>
        </div>
      </td>
      <td><span class="status-badge ${statusClass(s.status)}">${s.status}</span></td>
      <td>
        <div style="display:flex;gap:6px">
          <button class="btn-secondary" style="padding:5px 10px;font-size:11px;border-radius:7px" onclick="editStudent('${s.id}')">✏️ Edit</button>
          <button style="background:rgba(248,113,113,.15);color:var(--red);border:1px solid rgba(248,113,113,.3);border-radius:7px;padding:5px 10px;font-size:11px;cursor:pointer;transition:.2s;font-family:inherit" onmouseover="this.style.background='rgba(248,113,113,.25)'" onmouseout="this.style.background='rgba(248,113,113,.15)'" onclick="removeStudent('${s.id}')">🗑️</button>
        </div>
      </td>
    </tr>`).join('');

  // Pagination
  buildPagination(all.length, filtered);
}

function buildPagination(total, filtered) {
  const pages = Math.ceil(total / pageSize);
  const el = document.getElementById('pagination');
  if (!el) return;
  el.innerHTML = Array.from({ length: pages }, (_, i) => `
    <button style="width:28px;height:28px;border-radius:6px;border:1px solid ${i === studentPage ? 'var(--accent)' : 'var(--border)'};background:${i === studentPage ? 'rgba(108,99,255,.2)' : 'var(--bg3)'};color:${i === studentPage ? 'var(--accent3)' : 'var(--text2)'};cursor:pointer;font-size:12px;font-family:inherit"
      onclick="goPage(${i}, ${JSON.stringify(filtered) ? null : null})">${i + 1}</button>`).join('');
}

function goPage(n) {
  studentPage = n;
  buildAllStudentsTable();
}

function filterStudents() {
  const query = (document.getElementById('student-search')?.value || '').toLowerCase();
  const course = document.getElementById('filter-course')?.value || '';
  const status = document.getElementById('filter-status')?.value || '';
  const filtered = DB.students.filter(s => {
    const matchQ = !query || `${s.firstName} ${s.lastName} ${s.id} ${s.email}`.toLowerCase().includes(query);
    const matchC = !course || s.course === course;
    const matchS = !status || s.status === status;
    return matchQ && matchC && matchS;
  });
  studentPage = 0;
  buildAllStudentsTable(filtered);
}

function editStudent(id) {
  const s = DB.getStudentById(id);
  if (!s) return;
  document.getElementById('fname').value = s.firstName;
  document.getElementById('lname').value = s.lastName;
  document.getElementById('semail').value = s.email;
  document.getElementById('sphone').value = s.phone;
  document.getElementById('sdob').value = s.dob;
  document.getElementById('scourse').value = s.course;
  document.getElementById('sid').value = s.id;
  document.getElementById('saddress').value = s.address;
  document.getElementById('sstatus').value = s.status;
  // Store edit id
  document.getElementById('add-student-modal').dataset.editId = id;
  document.querySelector('#add-student-modal .modal-title').textContent = '✏️ Edit Student';
  showModal('add-student-modal');
}

function removeStudent(id) {
  if (!confirm('Remove this student?')) return;
  DB.deleteStudent(id);
  updateStats();
  buildStudentsTable();
  buildAllStudentsTable();
  buildTopPerformers();
  buildAttList();
  buildAttMonthly();
  showToast('🗑️ Student removed.');
}

/* =============================================
   GLOBAL SEARCH
   ============================================= */
function globalSearch(query) {
  if (!query) return;
  const results = DB.search(query);
  if (results.length > 0) {
    studentPage = 0;
    navigate(document.querySelector('[data-page=students]'), 'students');
    buildAllStudentsTable(results);
  }
}

/* =============================================
   COURSES GRID
   ============================================= */
function buildCoursesGrid() {
  const g = document.getElementById('courses-grid');
  if (!g) return;
  g.innerHTML = DB.courses.map(c => `
    <div class="course-card">
      <div class="course-thumb" style="background:${c.bg}">
        <span>${c.icon}</span>
        <span class="course-badge">${c.level}</span>
      </div>
      <div class="course-body">
        <div class="course-title">${c.title}</div>
        <div class="course-desc">${c.desc}</div>
        <div class="course-meta">👥 ${c.students} students · 🎬 ${c.videos} videos · ⏱ ${c.dur}</div>
        <div class="course-progress"><div style="width:${c.prog}%;height:100%;background:${c.color};border-radius:2px;transition:.6s"></div></div>
        <div class="course-pct">${c.prog}% progress</div>
        ${c.playlist ? `<a href="${c.playlist}" target="_blank" style="display:inline-flex;align-items:center;gap:5px;margin-top:8px;font-size:11px;color:var(--accent3);text-decoration:none;font-weight:600">▶ Watch Playlist →</a>` : ''}
      </div>
    </div>`).join('');
}

/* =============================================
   CALENDAR
   ============================================= */
let calDate = new Date();

function buildCalendar() {
  const g = document.getElementById('calendar');
  if (!g) return;
  const year = calDate.getFullYear();
  const month = calDate.getMonth();
  const today = new Date();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const lbl = document.getElementById('cal-month-label');
  if (lbl) lbl.textContent = `${monthNames[month]} ${year}`;

  const dayLabels = ['S','M','T','W','T','F','S'];
  let html = dayLabels.map(d => `<div class="cal-day-label">${d}</div>`).join('');
  for (let i = 0; i < firstDay; i++) html += `<div class="cal-day empty"></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    const isPast = new Date(year, month, d) < today && !isToday;
    const cls = isToday ? 'today' : (isPast && d % 3 !== 0) ? 'present' : (isPast && d % 3 === 0) ? 'absent' : '';
    html += `<div class="cal-day ${cls}">${d}</div>`;
  }
  g.innerHTML = html;
}

function changeMonth(dir) {
  calDate.setMonth(calDate.getMonth() + dir);
  buildCalendar();
}

/* =============================================
   ATTENDANCE LIST
   ============================================= */
function renderAttList() {
  buildAttList();
}

function buildAttList() {
  const l = document.getElementById('att-list-items');
  if (!l) return;
  const course = document.getElementById('att-course-filter')?.value || '';
  const filtered = course ? DB.students.filter(s => s.course === course) : DB.students.slice(0, 8);
  const today = new Date().toISOString().split('T')[0];
  const colors = ['#6C63FF','#10D98F','#FF8C42','#38BDF8','#F472B6'];
  l.innerHTML = filtered.map((s, i) => {
    const status = DB.getAttendance(s.id, today) || 'unmarked';
    return `
    <div class="att-row" id="att-row-${s.id}">
      <div class="att-avatar" style="background:${colors[i % 5]}22;color:${colors[i % 5]}">${s.avatar}</div>
      <div class="att-info">
        <div class="att-name">${s.firstName} ${s.lastName}</div>
        <div class="att-id">${s.id} · ${s.course}</div>
        <div class="progress-bar" style="width:80px"><div class="progress-fill" style="width:${s.att}%;background:${s.att > 85 ? '#10D98F' : s.att > 70 ? '#FBBF24' : '#F87171'}"></div></div>
      </div>
      <div>
        <div class="att-percent" style="color:${s.att > 85 ? '#10D98F' : s.att > 70 ? '#FBBF24' : '#F87171'}">${s.att}%</div>
        <div class="att-actions">
          <button class="att-btn att-btn-present" title="Present" onclick="markStudentAtt('${s.id}','present')" style="opacity:${status==='present'?'1':'0.5'}">✓</button>
          <button class="att-btn att-btn-absent" title="Absent" onclick="markStudentAtt('${s.id}','absent')" style="opacity:${status==='absent'?'1':'0.5'}">✗</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function markStudentAtt(id, status) {
  const today = new Date().toISOString().split('T')[0];
  DB.markAttendance(id, today, status);
  buildAttList();
  showToast(status === 'present' ? `✅ Marked present` : `❌ Marked absent`);
}

function markAllPresent() {
  DB.markAllPresent();
  buildAttList();
  showToast('✅ All students marked present!');
}

function buildAttMonthly() {
  const t = document.getElementById('att-monthly-table');
  if (!t) return;
  t.innerHTML = DB.students.map(s => {
    const present = Math.round(22 * s.att / 100);
    const today = new Date().toISOString().split('T')[0];
    const todayStatus = DB.getAttendance(s.id, today) || 'unmarked';
    return `<tr>
      <td><div style="display:flex;align-items:center;gap:8px">
        <div style="width:28px;height:28px;border-radius:8px;background:${s.color}22;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:${s.color}">${s.avatar}</div>
        <span style="color:var(--text);font-weight:600">${s.firstName} ${s.lastName}</span>
      </div></td>
      <td>${s.course}</td>
      <td>22</td>
      <td style="color:var(--green);font-weight:600">${present}</td>
      <td style="color:var(--red);font-weight:600">${22 - present}</td>
      <td><span style="font-family:'Space Grotesk',sans-serif;font-weight:700;color:${s.att > 85 ? '#10D98F' : s.att > 70 ? '#FBBF24' : '#F87171'}">${s.att}%</span></td>
      <td><span class="status-badge ${s.att >= 75 ? 'status-active' : 'status-inactive'}">${s.att >= 75 ? '✅ Good' : '⚠️ Low'}</span></td>
    </tr>`;
  }).join('');
}

/* =============================================
   TOP PERFORMERS
   ============================================= */
function buildTopPerformers() {
  const sorted = [...DB.students].sort((a, b) => b.prog - a.prog);
  const p = document.getElementById('top-performers');
  if (!p) return;
  p.innerHTML = sorted.slice(0, 5).map((s, i) => `
    <div class="perf-item">
      <div class="perf-rank ${['rank-1','rank-2','rank-3','rank-n','rank-n'][i]}">${i + 1}</div>
      <div style="width:30px;height:30px;border-radius:9px;background:${s.color}22;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:${s.color}">${s.avatar}</div>
      <div>
        <div style="font-size:13px;font-weight:600;color:var(--text)">${s.firstName} ${s.lastName}</div>
        <div style="font-size:11px;color:var(--text3)">${s.course}</div>
      </div>
      <div class="perf-score">${s.prog}%</div>
    </div>`).join('');
}

/* =============================================
   MY COURSES (Student Portal)
   ============================================= */
function buildMyCourses() {
  const l = document.getElementById('my-courses-list');
  if (!l) return;
  l.innerHTML = DB.courses.slice(0, 4).map(c => `
    <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid rgba(42,50,96,.4);transition:.2s;cursor:pointer" onmouseover="this.style.paddingLeft='6px'" onmouseout="this.style.paddingLeft='0'">
      <div style="width:40px;height:40px;border-radius:11px;background:${c.bg};display:flex;align-items:center;justify-content:center;font-size:19px;flex-shrink:0">${c.icon}</div>
      <div style="flex:1">
        <div style="font-size:13px;font-weight:600;color:var(--text)">${c.title}</div>
        <div style="height:4px;background:var(--bg3);border-radius:2px;margin-top:6px">
          <div style="width:${c.prog}%;height:100%;background:${c.color};border-radius:2px;transition:.6s"></div>
        </div>
        <div style="font-size:11px;color:var(--text3);margin-top:3px">${c.prog}% complete · ${c.videos} videos · ${c.dur}</div>
      </div>
    </div>`).join('');
}

/* =============================================
   SCHEDULE
   ============================================= */
function buildSchedule() {
  const sched = [
    { day: 'Mon', time: '10:00 AM', subj: 'AWS EC2 & VPC', color: '#6C63FF' },
    { day: 'Tue', time: '2:00 PM',  subj: 'Java OOP Concepts', color: '#FF8C42' },
    { day: 'Wed', time: '11:00 AM', subj: 'React Hooks Lab', color: '#10D98F' },
    { day: 'Thu', time: '3:00 PM',  subj: 'Data Structures', color: '#38BDF8' },
    { day: 'Fri', time: '10:00 AM', subj: 'Mock Assessment', color: '#F472B6' },
  ];
  const l = document.getElementById('schedule-list');
  if (!l) return;
  l.innerHTML = sched.map(s => `
    <div style="display:flex;align-items:center;gap:12px;padding:9px 0;border-bottom:1px solid rgba(42,50,96,.4);transition:.2s" onmouseover="this.style.paddingLeft='5px'" onmouseout="this.style.paddingLeft='0'">
      <div style="width:38px;height:38px;border-radius:10px;background:${s.color}22;display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0">
        <div style="font-size:10px;color:${s.color};font-weight:700">${s.day}</div>
      </div>
      <div>
        <div style="font-size:13px;font-weight:600;color:var(--text)">${s.subj}</div>
        <div style="font-size:11px;color:var(--text3)">⏰ ${s.time}</div>
      </div>
      <div style="margin-left:auto;width:8px;height:8px;border-radius:50%;background:${s.color};box-shadow:0 0 6px ${s.color}"></div>
    </div>`).join('');
}

/* =============================================
   ASSESSMENTS
   ============================================= */
function buildAssessments() {
  const g = document.getElementById('assessments-grid');
  if (!g) return;
  g.innerHTML = DB.assessments.map(i => `
    <div class="card" style="cursor:pointer;transition:.25s" onmouseover="this.style.transform='translateY(-4px)';this.style.borderColor='var(--border2)'" onmouseout="this.style.transform='';this.style.borderColor=''">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
        <div style="width:44px;height:44px;border-radius:12px;background:${i.color}22;display:flex;align-items:center;justify-content:center;font-size:21px">${i.icon}</div>
        <div>
          <div style="font-size:13px;font-weight:700;color:var(--text)">${i.title}</div>
          <div style="font-size:11px;color:var(--text3)">${i.course}</div>
        </div>
        ${i.done ? '<span class="status-badge status-active" style="margin-left:auto">✓ Done</span>' : ''}
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">
        <span style="background:var(--bg3);padding:3px 8px;border-radius:6px;font-size:11px;color:var(--text2)">❓ ${i.questions} Qs</span>
        <span style="background:var(--bg3);padding:3px 8px;border-radius:6px;font-size:11px;color:var(--text2)">⏱ ${i.duration} min</span>
        <span style="background:var(--bg3);padding:3px 8px;border-radius:6px;font-size:11px;color:var(--text2)">📅 Due ${formatDate(i.due)}</span>
      </div>
      <button class="btn-primary" style="width:100%;justify-content:center;${i.done ? 'background:var(--bg3);color:var(--green);border:1px solid rgba(16,217,143,.3)' : ''}"
        onclick="event.stopPropagation();${i.done ? '' : `startQuiz('${i.id}')`}">${i.done ? '✅ Completed' : '▶ Start Quiz'}</button>
    </div>`).join('');
}

function startQuiz(id) {
  const q = DB.assessments.find(a => a.id === id);
  if (!q) return;
  showToast(`📝 Starting: ${q.title}... (${q.duration} min, ${q.questions} questions)`);
}

/* =============================================
   TASKS / PROGRAMMING
   ============================================= */
function buildTasks() {
  const g = document.getElementById('tasks-grid');
  if (!g) return;
  const statusColor = { 'In Progress': '#FBBF24', 'Not Started': '#8B91C4', 'Submitted': '#10D98F' };
  g.innerHTML = DB.tasks.map(t => `
    <div class="card" style="cursor:pointer;transition:.25s" onmouseover="this.style.transform='translateY(-4px)';this.style.borderColor='var(--border2)'" onmouseout="this.style.transform='';this.style.borderColor=''">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px">
        <div style="font-size:13px;font-weight:700;color:var(--text);flex:1;padding-right:8px">${t.title}</div>
        <span style="background:${statusColor[t.status]}22;color:${statusColor[t.status]};padding:3px 8px;border-radius:6px;font-size:10px;font-weight:700;white-space:nowrap">${t.status}</span>
      </div>
      <div style="font-size:12px;color:var(--text3);margin-bottom:10px;line-height:1.5">${t.desc}</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px">
        <span style="background:${t.color}22;color:${t.color};padding:3px 8px;border-radius:6px;font-size:11px;font-weight:600">💻 ${t.lang}</span>
        <span style="background:var(--bg3);padding:3px 8px;border-radius:6px;font-size:11px;color:var(--text2)">⚡ ${t.diff}</span>
        ${t.deadline ? `<span style="background:var(--bg3);padding:3px 8px;border-radius:6px;font-size:11px;color:var(--text2)">📅 ${formatDate(t.deadline)}</span>` : ''}
      </div>
      <button class="btn-primary" style="width:100%;justify-content:center" onclick="event.stopPropagation();submitTask('${t.id}')">${t.status === 'Submitted' ? '👀 View Submission' : '📤 Submit Task'}</button>
    </div>`).join('');
}

function submitTask(id) {
  const t = DB.tasks.find(x => x.id === id);
  if (!t) return;
  if (t.status === 'Submitted') { showToast('👀 Submission already made!'); return; }
  t.status = 'Submitted';
  buildTasks();
  showToast(`✅ Task "${t.title}" submitted!`);
}

/* =============================================
   NOTIFICATIONS
   ============================================= */
function buildNotifications() {
  const l = document.getElementById('notif-list');
  if (!l) return;
  l.innerHTML = DB.notifications.slice(0, 4).map(n => `
    <div class="notif-item">
      <div class="notif-icon" style="background:${n.bg}">${n.icon}</div>
      <div class="notif-content">
        <div class="notif-title">${n.title}</div>
        <div class="notif-time">${n.time}</div>
      </div>
      ${n.unread ? '<div class="notif-dot-unread"></div>' : ''}
    </div>`).join('');
}

function buildNotificationsPage() {
  const l = document.getElementById('notif-page-list');
  if (!l) return;
  l.innerHTML = DB.notifications.map((n, idx) => `
    <div class="notif-item" style="${n.unread ? 'background:rgba(108,99,255,.04);border-radius:10px;padding-left:12px;padding-right:12px;' : ''}">
      <div class="notif-icon" style="background:${n.bg}">${n.icon}</div>
      <div class="notif-content">
        <div class="notif-title">${n.title}</div>
        <div class="notif-time">${n.time}</div>
      </div>
      ${n.unread ? '<div class="notif-dot-unread"></div>' : ''}
    </div>`).join('');
}

function markAllRead() {
  DB.notifications.forEach(n => n.unread = false);
  buildNotificationsPage();
  buildNotifications();
  showToast('✓ All notifications marked as read');
}

/* =============================================
   MODALS
   ============================================= */
function showModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = 'flex';
  if (id === 'add-student-modal') {
    const idField = document.getElementById('sid');
    if (idField && !idField.value) {
      idField.value = `STU-${String(DB.nextStudentNum).padStart(3,'0')}`;
    }
    document.getElementById('add-student-modal').dataset.editId = '';
    document.querySelector('#add-student-modal .modal-title').textContent = '👤 Add New Student';
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.animation = 'none';
    modal.style.display = 'none';
    modal.style.animation = '';
  }
}

function generateCustomId() {
  const custom = prompt('Enter custom Student ID:', 'STU-XXX');
  if (custom) document.getElementById('sid').value = custom;
}

/* =============================================
   CRUD ACTIONS
   ============================================= */
function addStudent() {
  const fn = document.getElementById('fname').value.trim();
  const ln = document.getElementById('lname').value.trim();
  const email = document.getElementById('semail').value.trim();
  if (!fn || !ln) { showToast('⚠️ First and last name are required', '#F87171'); return; }
  if (!email) { showToast('⚠️ Email is required', '#F87171'); return; }

  const modal = document.getElementById('add-student-modal');
  const editId = modal.dataset.editId;

  if (editId) {
    DB.updateStudent(editId, {
      firstName: fn, lastName: ln, email,
      phone: document.getElementById('sphone').value,
      dob: document.getElementById('sdob').value,
      course: document.getElementById('scourse').value,
      address: document.getElementById('saddress').value,
      status: document.getElementById('sstatus').value,
      avatar: (fn[0] + ln[0]).toUpperCase(),
    });
    showToast(`✅ Student ${fn} ${ln} updated!`);
  } else {
    DB.addStudent({
      firstName: fn, lastName: ln, email,
      phone: document.getElementById('sphone').value,
      dob: document.getElementById('sdob').value,
      course: document.getElementById('scourse').value,
      address: document.getElementById('saddress').value,
      status: document.getElementById('sstatus').value,
      customId: document.getElementById('sid').value || null,
    });
    showToast(`✅ Student ${fn} ${ln} added (ID: ${DB.students[DB.students.length-1].id})`);
    DB.notifications.unshift({ icon: '👤', bg: 'rgba(167,139,250,.15)', title: `New student registered: ${fn} ${ln}`, time: 'Just now', unread: true });
  }

  updateStats();
  buildStudentsTable();
  buildAllStudentsTable();
  buildTopPerformers();
  buildAttList();
  buildAttMonthly();
  closeModal('add-student-modal');
  // Clear form
  ['fname','lname','semail','sphone','sdob','saddress','sid'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
}

function addCourse() {
  const title = document.getElementById('ctitle').value.trim();
  if (!title) { showToast('⚠️ Course title required', '#F87171'); return; }
  DB.addCourse({
    title,
    level: document.getElementById('clevel').value,
    duration: document.getElementById('cduration').value,
    desc: document.getElementById('cdesc').value,
    playlist: document.getElementById('cvideo').value,
    icon: document.getElementById('cicon').value || '📘',
  });
  buildCoursesGrid();
  buildMyCourses();
  closeModal('add-course-modal');
  ['ctitle','cduration','cdesc','cvideo','cicon'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  showToast(`✅ Course "${title}" created!`);
}

function addQuiz() {
  const title = document.getElementById('qtitle').value.trim();
  if (!title) { showToast('⚠️ Quiz title required', '#F87171'); return; }
  DB.addAssessment({
    title,
    course: document.getElementById('qcourse').value,
    questions: document.getElementById('qquestions').value,
    duration: document.getElementById('qduration').value,
    due: document.getElementById('qdue').value,
  });
  buildAssessments();
  closeModal('add-quiz-modal');
  ['qtitle','qquestions','qduration','qdue'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  showToast('📝 Quiz uploaded!');
}

function addTask() {
  const title = document.getElementById('ttitle').value.trim();
  if (!title) { showToast('⚠️ Task title required', '#F87171'); return; }
  DB.addTask({
    title,
    lang: document.getElementById('tlang').value,
    diff: document.getElementById('tdiff').value,
    desc: document.getElementById('tdesc').value,
    deadline: document.getElementById('tdeadline').value,
  });
  buildTasks();
  closeModal('add-task-modal');
  ['ttitle','tlang','tdesc','tdeadline'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  showToast('💻 Task created!');
}

function addEvent() {
  const name = document.getElementById('ename').value.trim();
  if (!name) { showToast('⚠️ Event name required', '#F87171'); return; }
  DB.addEvent({
    name,
    date: document.getElementById('edate').value,
    desc: document.getElementById('edesc').value,
  });
  buildNotificationsPage();
  buildNotifications();
  closeModal('add-event-modal');
  ['ename','edate','edesc'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  showToast(`📢 Event "${name}" announced!`);
}

/* =============================================
   TOAST
   ============================================= */
function showToast(msg, color) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.background = color || 'linear-gradient(135deg,#6C63FF,#8B5CF6)';
  t.style.transform = 'translateY(0)';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.style.transform = 'translateY(120px)', 3000);
}

/* =============================================
   UTILITIES
   ============================================= */
function statusClass(status) {
  return { active: 'status-active', inactive: 'status-inactive', pending: 'status-pending' }[status] || '';
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

/* =============================================
   KEYBOARD SHORTCUTS
   ============================================= */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    document.getElementById('global-search')?.focus();
  }
});
