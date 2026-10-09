Project: PlaceReady, a Placement Training LMS. Roles: student, trainer, admin.
Stack: Next.js (App Router) + TypeScript + Tailwind, Supabase (Postgres, Auth, Storage), 
Judge0 for code execution, Gemini API for AI. Deployed on Vercel.
Rules: 
- All API routes in /app/api/*, validate every input with Zod, return { data, error } always.
- Secrets only in env vars, never in the repo. AI and Judge0 keys are server-side only.
- Role guard on every route; Supabase Row Level Security enabled on all tables.
- NEVER send correct answers or hidden test cases to the client.
- Shared types and Zod schemas live in /lib/contracts.ts and are the single source of truth.
- Every endpoint must handle empty, error, and success cases.
- Every page must be responsive at 360px, 768px, 1280px with loading, empty, error and success states.
