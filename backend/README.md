# Flourish Hub Backend

Production-oriented backend scaffold for the Flourishing Hub alpha app.

## Stack

- Node.js + Express
- PostgreSQL + Prisma
- JWT authentication
- Role-based access control
- Rate limiting
- Lightweight in-memory response caching

## Core Alpha Coverage

- IITB email-gated authentication
- Role-aware users and profiles
- Public sign-up for students, instructors, and volunteers only
- Admin accounts created manually through database or backend-controlled workflows, with normal public login allowed
- Event, session/module, registration, attendance, feedback, and progress data models
- Student, instructor, volunteer, associate-instructor, and admin dashboard APIs
- Excel upload pipelines for users, events, registrations, attendance, and marks
- CSV and native `.xlsx` exports for admin roster and event record workflows
- Analytics endpoints for admin overview

## Local Setup

1. Create `.env` from `.env.example`
2. Install dependencies with `npm install`
3. Generate Prisma client with `npm run prisma:generate`
4. After the database is ready, run migrations with `npm run prisma:migrate`
5. Start the server with `npm run dev`

## Notes

- `.env` should live in the project root next to `package.json`.
- Bulk uploads currently use in-memory multipart parsing and synchronous processing, which is fine for alpha demos but should move to background workers on AWS later.
- For Vercel, use serverless-friendly routes carefully. For long-term scale on AWS, move bulk imports, reminders, and calendar sync into background workers.

