# Quiz Website MVP

A static, mobile-first quiz website powered by JSON configuration files. Built with Vite + React and Tailwind CSS.

## Features

- Configuration-driven quizzes (no code changes needed for new quizzes)
- Smart navigation (auto-advances to next unanswered question)
- Result reveal animation for intrigue
- Share functionality (Web Share API with clipboard fallback)
- Mobile-first, accessible design
- Static site generation

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5173/quiz/personality-quiz` to see the example quiz.

### Build

```bash
npm run build
```

The static files will be in the `dist` directory, ready for deployment to Netlify, Vercel, or any static hosting service.

## Adding New Quizzes

1. Create a new JSON file in `src/quiz-configs/` following the schema from the PRD
2. Import it in `src/components/Quiz.jsx`
3. Add it to the `QUIZ_CONFIGS` object
4. Access it at `/quiz/[your-quiz-id]`

## Quiz Configuration Schema

See the example in `src/quiz-configs/personality-quiz.json` for the full schema.

## Tech Stack

- Vite
- React
- React Router DOM
- Tailwind CSS
- JavaScript (ES6+)
