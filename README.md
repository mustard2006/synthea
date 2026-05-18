# Synthea

Personal studying dashboard: upload PDFs, YouTube links, or articles and review summaries, flashcards, quizzes, and concept maps.

## Setup

```bash
cd dashboard
cp .env.example .env.local
# Fill in Supabase + Gemini (or Azure) keys
npm install
npm run dev
```

Run the SQL in `dashboard/supabase/schema.sql` in your Supabase project.

Deploy on Vercel with the project root set to `dashboard`.
