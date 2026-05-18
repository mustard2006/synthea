<div align="center">

#  Study Dash

**Your personal AI-powered study companion.**
Upload anything. Learn everything.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-96%25-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-backend-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Gemini](https://img.shields.io/badge/Gemini-AI-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com/)
[![MIT License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](./LICENSE)

</div>

---

## What is Study Dash?

Study Dash transforms any learning material into interactive study tools — instantly. Drop in a PDF, paste a YouTube link, or share an article URL, and within seconds you get AI-generated summaries, flashcards, quizzes, and concept maps tailored to that content.

No more manual note-taking. No more re-reading the same paragraph five times. Just upload and study smarter.

---

##  Features

**Multi-format ingestion**
Upload PDFs, paste YouTube video links, or share article URLs. Study Dash handles parsing and content extraction automatically.

**AI-powered summaries**
Get concise, structured summaries of any material — key points, main arguments, and takeaways surfaced in seconds.

**Smart flashcards**
Automatically generated Q&A flashcard decks from your content. Review and test yourself without having to write a single card manually.

**Auto-generated quizzes**
Multiple-choice and open-ended quizzes created directly from your uploaded material, so you can assess your understanding on the fly.

**Concept maps**
Visual representations of how ideas connect within a document, making it easy to understand structure and relationships at a glance.

**Secure personal workspace**
All your content and study sets are private to you, backed by Supabase Auth and Row Level Security.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Auth & Database | Supabase (Postgres + RLS) |
| AI | Google Gemini API (or Azure OpenAI) |
| Styling | CSS Modules |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com/) project
- A [Google Gemini API key](https://ai.google.dev/) (or Azure OpenAI credentials)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/mustard2006/ai-dashboard.git
cd ai-dashboard

# 2. Navigate to the app directory
cd dashboard

# 3. Set up environment variables
cp .env.example .env.local
```

Open `.env.local` and fill in your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Provider (choose one)
GEMINI_API_KEY=your_gemini_api_key
# or
AZURE_OPENAI_KEY=your_azure_key
AZURE_OPENAI_ENDPOINT=your_azure_endpoint
```

```bash
# 4. Install dependencies
npm install

# 5. Set up the database schema
# Run the SQL in dashboard/supabase/schema.sql in your Supabase project SQL editor

# 6. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see it running.

---

## Database Setup

Run the schema file in your Supabase project's SQL editor:

```
dashboard/supabase/schema.sql
```

This sets up the necessary tables for storing documents, flashcard sets, quizzes, and user data with appropriate Row Level Security policies.

---

## Deployment

Study Dash is designed to deploy on [Vercel](https://vercel.com/) with zero configuration:

1. Push your fork to GitHub
2. Import the project in Vercel
3. **Set the root directory to `dashboard`**
4. Add your environment variables in the Vercel project settings
5. Deploy

Vercel will automatically handle builds and serverless functions.

---

## Project Structure

```
ai-dashboard/
├── dashboard/              # Next.js application root
│   ├── app/                # App Router pages and layouts
│   ├── components/         # Reusable UI components
│   ├── lib/                # Utility functions, Supabase client, AI helpers
│   ├── supabase/
│   │   └── schema.sql      # Database schema
│   ├── .env.example        # Environment variable template
│   └── package.json
├── .gitignore
├── LICENSE
└── README.md
```

---

## Contributing

Contributions are welcome! Feel free to open issues, suggest features, or submit pull requests.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request

---

## License

This project is licensed under the [MIT License](./LICENSE).

---

<div align="center">

Made with ☕ and way too many PDFs.

</div>
