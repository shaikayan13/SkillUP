# EduVerse LMS — Setup Guide
# My Skills 🚀

![SkillUp Screenshot](skillup.png)
![SkillUp Screenshot](skillup.png)

## 📁 Project Structure
```
eduverse/
├── index.html          ← Main entry point (open this)
├── css/
│   └── style.css       ← All styles + animations + responsive
├── js/
│   ├── backend.js      ← Data layer, CRUD, Excel export
│   └── app.js          ← UI rendering, interactions, navigation
└── README.md
```

## 🚀 How to Run
1. **Keep all files in the same folder** — the folder structure must stay as-is
2. Open `index.html` in any modern browser (Chrome, Edge, Firefox)
3. No server needed — runs entirely in the browser

## ✅ Features Implemented

### Admin Dashboard
- Live stats: total students, active courses, completion %, attendance %
- Weekly attendance bar chart with animations
- Course distribution donut chart
- Recent students table + top performers leaderboard
- Quick actions panel

### Students Module
- Add / Edit / Delete students with full form (name, email, phone, DOB, course, ID, address, status)
- Auto-generated Student IDs (STU-001...) or Custom IDs
- Search, filter by course & status
- Pagination (8 per page)

### Courses Module
- Add new courses with title, level, duration, YouTube playlist link, description
- Visual course cards with progress bars

### Attendance Tracker
- Interactive calendar with present/absent/today markers
- Mark individual students present/absent
- Mark All Present button
- Monthly overview table with attendance %
- Filter attendance by course
- **📥 Export to Excel (.xlsx)** — attendance + student list in 2 sheets

### Student Portal
- Personal dashboard with stats (attendance, courses, hours)
- My courses with progress
- Weekly schedule
- Notifications feed

### Assessments
- Upload quizzes with questions, duration, due date
- Start/complete quiz tracking

### Programming Tasks
- Create tasks with language, difficulty, deadline, description
- Submit task functionality

### Notifications
- Real-time feed, Mark All Read, event announcements

### Settings
- Profile editing, password change, notification toggles, export buttons

## 💡 Tips
- **Ctrl+K** — Focus global search
- **Escape** — Close any open modal
- Excel export uses SheetJS (loads from CDN on first use — internet required for export)
