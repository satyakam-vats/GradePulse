# GradePulse 🚀

**GradePulse** is a modern, full-stack academic analytics and performance intelligence platform built to transform examination records into real-time interactive insights, grade distributions, section benchmarks, and head-to-head student performance analytics.

---

## 🌟 Key Features

* **⚡ Automated Result Ingestion & Processing**: Intelligent engine to parse academic records, calculate SGPA/CGPA trends, and reconcile course examination histories.
* **🎛️ Dynamic Dropdown & Filter Controls**: Seamless navigation across academic cohorts, departments, semesters, and section filters.
* **📊 Advanced Statistical Engine**: Computes cohort Mean, Median, Standard Deviation, Interquartile Range (IQR), and dynamic grade band distributions.
* **⚔️ Head-to-Head Student Comparison**: Side-by-side USN comparison evaluating SGPA deltas, CGPA differences, CIE marks, and course breakdowns.
* **🏆 Class Leaderboards & Section Benchmarking**: Real-time sortable leaderboards featuring Section Ranks, Branch Ranks, and head-to-head section performance comparisons.
* **🔍 Retake & Transcript Intelligence**: Automatic detection of backlog retakes with visual status badges, CIE/SEE breakdowns, and attendance tracking.
* **🎨 Modern Glassmorphic Interface**: Responsive dark/light theme switching with smooth micro-animations built with Next.js 16, TypeScript, and Tailwind CSS.

---

## 🛠️ Tech Stack

* **Frontend**: Next.js 16 (App Router, Turbopack), TypeScript, Tailwind CSS, Framer Motion
* **Visualizations**: Recharts, Plotly.js, Lucide Icons
* **Backend & ORM**: Node.js, Prisma ORM, SQLite

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/satyakam-vats/GradePulse.git
cd GradePulse

# Install dependencies
npm install

# Setup database & seed test records
npx prisma db push
npx prisma db seed

# Launch development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.
