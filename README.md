# GradePulse 🚀 | Student Performance Analytics & Academic Intelligence Platform

[![Next.js 16](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite)](https://www.sqlite.org/)

**GradePulse** is a high-performance, full-stack academic performance analytics platform designed for **Siddaganga Institute of Technology (SIT Tumakuru)**. It transforms raw academic examination records into intuitive, interactive dashboards, section comparisons, grade distribution charts, and head-to-head student benchmarks.

---

## 🌟 Key Features

### 1. 🎛️ Multi-Cohort & Multi-Branch Navigation
* **Dynamic Batch & Branch Selectors**: Seamless interactive dropdown and card selectors across batches (`2024–2028`) and engineering departments:
  * **CS** — Computer Science & Engineering
  * **IS** — Information Science & Engineering
  * **AD** — Artificial Intelligence & Data Science
  * **CI** — Artificial Intelligence & Machine Learning
  * **EC** — Electronics & Communication Engineering
* **Semester Timeline Navigation**: Fast switching between Semesters 1 through 8 with live average SGPA previews.

### 2. 📊 Advanced Statistical Analytics Engine
* **Cohort Metrics**: Calculates Mean, Median, Mode, Standard Deviation, and Interquartile Range (IQR) for SGPA and CGPA.
* **Grade Distribution Spectrum**: Interactive distribution bar charts categorizing student performance into grade bands (Outstanding `9-10`, Excellent `8-9`, Very Good `7-8`, Good `6-7`, Average `5-6`, Below Average `<5`).
* **Donut & Spectrum Charts**: Built with **Recharts** & **Plotly.js** for smooth visual analytics and dark mode responsiveness.

### 3. ⚔️ Head-to-Head Student Comparison
* **Side-by-Side Comparison Modal**: Compare any two students' academic profiles simultaneously.
* **Differential Metrics**: Evaluates SGPA deltas, CGPA differences, earned credits, CIE scores, and subject-by-subject grade comparisons.

### 4. 🏆 Dynamic Leaderboards & Section Benchmarking
* **Section-Level Analytics**: Head-to-head section comparison (**Section A vs Section B vs Section C**) displaying mean CGPA/SGPA, highest scores, and student strength.
* **Class Leaderboards**: Real-time sortable leaderboard with search filtering by USN or Student Name, displaying **Section Ranks** and **Branch Ranks**.

### 5. 🔍 Detailed Transcript & Retake Tracking Engine
* **Student Detail Modal**: Deep academic breakdown featuring student bio data (Email, Phone, Faculty Mentor, Admission Quota, Blood Group).
* **Automated Retake Detection**: Identifies courses failed in earlier semesters and passed in subsequent attempts, displaying a high-visibility badge:
  * `[✓ Cleared in 2nd Attempt (Prev: F)]`
* **Subject Component Breakdown**: Displays Internal Assessment (CIE / 50), Semester End Exam (SEE / 100), Attendance %, Grade Points, and Letter Grades.

### 6. 🎨 Premium Glassmorphic Design System
* **Modern Aesthetic**: Built with glassmorphism cards, vibrant indigo & amber accents, micro-animations via **Framer Motion**, and a persistent Light/Dark theme toggle.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript |
| **Styling & Design** | Vanilla Tailwind CSS v4, Lucide Icons, Framer Motion |
| **Data Visualization** | Recharts, Plotly.js |
| **Database & ORM** | SQLite, Prisma ORM v6 |
| **Data Processing** | Node.js, Python |

---

## 📁 Database Schema Overview

```prisma
model Student {
  id            Int              @id @default(autoincrement())
  usn           String           @unique
  name          String
  gender        String?
  section       String?
  batchId       Int
  branchId      Int
  overallCgpa   Float?
  creditsEarned Int?
  creditsToEarn Int?
  email         String?
  phone         String?
  mentorName    String?
  admissionType String?          @default("CET")
  bloodGroup    String?
}

model SemesterResult {
  id                Int      @id @default(autoincrement())
  studentId         Int
  semesterId        Int
  creditsRegistered Int
  creditsEarned     Int
  sgpa              Float
  cgpa              Float
  rankInSection     Int?
  rankInBranch      Int?
}

model SubjectResult {
  id              Int      @id @default(autoincrement())
  studentId       Int
  subjectId       Int
  semesterId      Int
  cieMarks        Int
  seeMarks        Int?
  attendance      Int
  creditsEarned   Int
  gpa             Float
  grade           String
  attempts        Int      @default(1)
  backlogCleared  Boolean  @default(false)
  originalGrade   String?
}
```

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/satyakam-vats/GradePulse.git
cd GradePulse
npm install
```

### 2. Configure Environment & Database
Create `.env` file:
```env
DATABASE_URL="file:./prisma/dev.db"
```

Sync database schema & seed synthetic records:
```bash
npx prisma db push
npx prisma db seed
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💼 Resume Highlights (Copy-Paste Ready)

* **Architected & Developed GradePulse**: A full-stack academic analytics platform in **Next.js 16**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM** for 560+ students across 5 engineering departments.
* **Engineered Statistical Analytics Engine**: Built custom algorithms computing Mean, Median, Standard Deviation, IQR, Grade Bands, Section Ranks, and Branch Ranks over 17,000+ course records.
* **Automated Backlog & Retake Tracking**: Implemented a transcript reconciliation algorithm to track multi-attempt examination history, retake badges, CIE/SEE component breakdowns, and attendance metrics.
* **Interactive Data Visualization & Comparison**: Designed interactive charts using **Recharts** & **Plotly.js** and a side-by-side student comparison modal with differential grade analytics.
