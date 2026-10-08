# PEER PROJECT COLLABORATION PLATFORM
**B.Tech Computer Science and Engineering Mini Project & Capstone Collaboration System**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-teal)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Vitest-Passing-emerald)](https://vitest.dev/)

---

## 🎯 Project Purpose

Students often struggle to find suitable teammates with complementary skill sets for academic mini projects, hackathons, open-source repositories, and final-year capstone developments.

The **Peer Project Collaboration Platform** solves this problem by pairing a **transparent, explainable recommendation engine** with **end-to-end team project lifecycle management** (Kanban task boards, GitHub repository synchronization, and real-time progress analytics).

---

## 🚀 Key Features

1. **Student Profile & Technical Skills**: Add competencies with explicit proficiencies (`BEGINNER`, `INTERMEDIATE`, `ADVANCED`, `EXPERT`), interests, availability, and GitHub handle.
2. **Project Discovery & Search**: Global debounced search with filters for Category, Required Skills, Vacancies, and Project Status.
3. **Deterministic Matching Engine**: Transparent 4-tier compatibility formula:
   $$\text{skill\_match} = \frac{\text{matched\_required\_skills}}{\text{total\_required\_skills}}$$
   $$\text{compatibility} = 0.60 \times \text{skill\_match} + 0.20 \times \text{interest\_match} + 0.10 \times \text{availability\_match} + 0.10 \times \text{experience\_match}$$
4. **Collaboration Requests**: Send personalized proposals, accept incoming applications, and automatically instantiate team members.
5. **Interactive Kanban Task Board**: Manage sprint milestones across *To Do*, *In Progress*, and *Completed* columns with assignees, priorities, and due dates.
6. **GitHub REST API Integration**: Connect repository URLs to track real-time stars, forks, open issues, primary language, and recent commits (with a graceful offline fallback).
7. **Progress & Health Dashboard**: Radial completion gauge, task priority distribution, and individual team member contribution statistics.
8. **Real-time Notifications**: Alert students on task assignments, incoming requests, invitation approvals, and repo updates.
9. **Admin Governance Console**: Moderation dashboard to oversee users, audit collaboration requests, manage canonical skill registries, and resolve user reports.

---

## 🏗️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons |
| **Backend** | Next.js API Route Handlers, Node.js |
| **Database & ORM** | Prisma ORM, SQLite (`dev.db` for instant zero-setup demonstration) / PostgreSQL compatible |
| **Authentication** | JWT Session Management in HTTP-Only secure cookies, bcrypt password hashing, Role-based Access Control (`STUDENT`, `ADMIN`) |
| **Integrations** | GitHub REST API v3 |
| **Testing** | Vitest unit test suite for matching algorithms and calculations |

---

## 🔑 Demo & Evaluation Accounts

The platform includes pre-populated realistic seed data ready for immediate demonstration:

| Role | Email | Password | Details |
|---|---|---|---|
| **Student** | `student@example.com` | `Student@123` | **Karthik Rao** (Lead for *Smart Campus Navigation*, React/PostgreSQL/Node.js) |
| **Admin** | `admin@example.com` | `Admin@123` | **Dr. Ramesh Kumar** (Department Head & Project Coordinator) |
| **Candidate Student** | `rahul@example.com` | `Student@123` | **Rahul Sharma** (87% Match for Smart Campus Navigation) |
| **Candidate Student** | `ananya@example.com` | `Student@123` | **Ananya Verma** (UI/UX Designer, Team Member) |
| **Candidate Student** | `priya@example.com` | `Student@123` | **Priya Iyer** (AI/ML Lead for AI Study Planner) |

---

## 📂 Project Architecture

```
peer-project-collaboration-platform/
├── app/
│   ├── (public & student routes)
│   │   ├── page.tsx                     # Modern Landing Page
│   │   ├── login/page.tsx               # Student / Admin Login
│   │   ├── register/page.tsx            # Student Registration
│   │   ├── dashboard/page.tsx           # Main Student Dashboard
│   │   ├── profile/page.tsx             # Student Profile View
│   │   ├── profile/edit/page.tsx        # Profile & Skill Editor
│   │   ├── projects/page.tsx            # Project Discovery & Filters
│   │   ├── projects/create/page.tsx     # Project Creation Form
│   │   ├── projects/[id]/page.tsx       # Master Project Detail (Tabs)
│   │   ├── projects/[id]/team/page.tsx  # Project Team Management
│   │   ├── projects/[id]/tasks/page.tsx # Project Kanban Board
│   │   ├── projects/[id]/github/page.tsx# Project GitHub Sync
│   │   ├── projects/[id]/dashboard/page.tsx # Progress Analytics
│   │   ├── matches/page.tsx             # Recommended Teammates
│   │   ├── collaboration-requests/page.tsx # Requests Inbox & Sent
│   │   ├── notifications/page.tsx       # Notification Center
│   │   └── settings/page.tsx            # Account & Security Settings
│   ├── admin/
│   │   ├── page.tsx                     # Admin Moderation Dashboard
│   │   ├── users/page.tsx               # User Management Table
│   │   ├── projects/page.tsx            # Project Approvals/Removal
│   │   ├── reports/page.tsx             # Moderation Reports
│   │   ├── skills/page.tsx              # Skills Registry
│   │   ├── requests/page.tsx            # Request Audit Logs
│   │   └── settings/page.tsx            # Platform Governance Weights
│   └── api/                             # Clean REST API Route Handlers
├── components/
│   ├── auth/AuthContext.tsx             # Client Auth Provider & Hook
│   ├── layout/AppLayout.tsx             # Responsive layout with mobile drawer
│   ├── navigation/                      # Header, Sidebar, AdminSidebar
│   ├── ui/                              # ProjectCard, MatchCard, SkillBadge, EmptyState
│   ├── tasks/                           # KanbanBoard, TaskCard
│   ├── github/                          # GitHubRepoView
│   └── dashboard/                       # ProjectProgressView
├── lib/
│   ├── prisma.ts                        # Singleton Prisma ORM Client
│   ├── auth/                            # JWT token generation & password hashing
│   ├── matching/                        # Deterministic 4-tier matching engine
│   │   ├── matchingEngine.ts
│   │   ├── scoreSkillMatch.ts
│   │   ├── scoreInterestMatch.ts
│   │   ├── scoreAvailabilityMatch.ts
│   │   └── scoreExperienceMatch.ts
│   └── github/                          # GitHub REST API service & parser
├── prisma/
│   ├── schema.prisma                    # Database Schema (Users, Projects, Teams, Tasks...)
│   └── seed.ts                          # Comprehensive Realistic Seed Script
├── tests/
│   └── matchingEngine.test.ts           # Vitest Unit Tests
└── package.json
```

---

## ⚡ Quick Start / Local Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Prisma Client & Database
```bash
npx prisma generate
npx prisma db push
```

### 3. Populate Realistic Seed Data
```bash
npm run seed
```

### 4. Run Automated Unit Tests
```bash
npm run test
```

### 5. Start the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📋 Exact College Evaluation Demonstration Scenario

To demonstrate all 20 required rubric criteria:

1. **Sign In**: Log in with `student@example.com` / `Student@123` (Karthik Rao).
2. **Profile**: Navigate to `/profile` → View React, Node.js, PostgreSQL skills and proficiency levels. Click "Edit Profile" to add or modify skills.
3. **Discover Projects**: Navigate to `/projects` → Search for "Smart Campus Navigation" or filter by "Web Development".
4. **Project Details**: Open *Smart Campus Navigation* → Show project overview, required skills, and current team size (3 / 5).
5. **Matching Engine**: Open "Recommended Teammates" or `/matches` → Show candidate **Rahul Sharma** with an **87% Match**.
6. **Explainable Match Breakdown**: Click "Why this score?" → Inspect the transparent mathematical report:
   - Skill Match (60% weight): 90%
   - Domain Alignment (20% weight): 80%
   - Availability (10% weight): 100%
   - Experience (10% weight): 70%
   - Matched skills: *React*, *Node.js*, *PostgreSQL* | Missing skills: *Docker*.
7. **Send Collaboration Request**: Click "Invite Teammate" to send a collaboration proposal.
8. **Switch Accounts**: Sign out and log in as `rahul@example.com` / `Student@123`.
9. **Accept Request**: Navigate to `/collaboration-requests` → Click "Accept & Join Team" on the incoming invite.
10. **Team Membership**: Navigate to `/projects/[id]/team` → Verify Rahul is now an active team member.
11. **Kanban Tasks**: Navigate to the "Tasks" tab → Create a task, assign to a member, and drag/move status from `To Do` → `In Progress` → `Completed`.
12. **GitHub Sync**: Open "GitHub Sync" tab → View repository stats (stars, forks, open issues, commits timeline).
13. **Progress Analytics**: Open "Progress & Metrics" tab → View updated radial progress gauge, task priority breakdown, and member milestone contributions.
14. **Notifications**: Click the Notification bell to see the workflow notification stream.
15. **Admin Moderation**: Sign in as `admin@example.com` / `Admin@123` → Explore user management, project moderation, and platform reports.

---

## 🧪 Testing Results

Unit tests verify the deterministic scoring formulas:
- Exact skill match ratio ($3/4 = 0.75$)
- 100% match & 0% match boundaries
- Domain keyword overlap & interest scoring
- Availability & experience weighting
- Total weighted compatibility formula calculation ($87\%$ match test case)

```bash
npm run test
```

---

## 🔒 Security & Best Practices

- Passwords securely hashed with `bcryptjs` (salt rounds: 10).
- Session tokens stored in HTTP-Only, Lax SameSite cookies.
- Server-side authorization checks on all API mutations.
- SQL injection immunity via Prisma parameterization.
- No client-side exposure of API tokens or secrets.

---

## 📄 License
This project is developed as part of the B.Tech Computer Science and Engineering Academic Mini Project Curriculum.
