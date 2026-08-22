# Workspace Guidelines & Persistent Memory: Examigo

## Persistent Agent Rules
1. **Always Record Completed Work**: After completing any task, update `PROGRESS.md` with a summary of changes, completed features, or fixes.
2. **Read Project Context**: Check `PRD.md` and `PROGRESS.md` at the start of complex tasks to maintain context of previous work.
3. **Follow Project Patterns**: Maintain consistent code structure, UI/UX mobile-first design, and tech stack guidelines specified in `PRD.md`.

## Project Summary
- **Project Name**: Examigo
- **Description**: AI-Powered Online Exam Builder (SaaS Platform).
- **Tech Stack**:
  - **Frontend**: React (Vite) + TypeScript + Tailwind CSS + shadcn/ui + React Router + TanStack Query + Recharts.
  - **Backend**: Node.js + Express.js + Prisma ORM + JWT + Multer + Zod.
  - **Database & Storage**: Supabase (PostgreSQL & Storage).
  - **AI Engine**: Google Gemini API.
- **Key Modules**:
  1. AI Question Generator (PDF/DOCX/PPT/TXT to Questions)
  2. Bank Soal & Categories
  3. Exam Builder (Drag & Drop, Acak Soal)
  4. Online Exam Room & Auto Save (Peserta)
  5. Automatic Grading & Analytics Dashboard
  6. Data Export (Excel, CSV, PDF)
