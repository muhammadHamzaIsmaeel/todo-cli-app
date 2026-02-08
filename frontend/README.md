# Todo Frontend Application

A modern, responsive frontend for the Todo Full-Stack Web Application built with Next.js 16+ and TypeScript.

## Features

- **Next.js 16+**: The latest React framework with App Router for building full-stack web applications.
- **TypeScript**: Type-safe development for better maintainability and developer experience.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **Better Auth**: Secure authentication with JWT tokens and user management.
- **Responsive Design**: Mobile-first approach with responsive layouts for all screen sizes.
- **Dark Mode**: Automatic dark/light mode with user preference detection.

## Tech Stack

- Next.js 16+
- React 18+
- TypeScript 5+
- Tailwind CSS
- Better Auth
- Modern UI/UX design patterns

## Setup

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Variables**:
   Copy `.env.example` to `.env.local` and fill in the required values:
   ```bash
   cp .env.example .env.local
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

4. **Build for Production**:
   ```bash
   npm run build
   npm run start
   ```

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── login/
│   ├── signup/
│   └── dashboard/
│       ├── layout.tsx
│       └── page.tsx
├── components/
│   ├── tasks/
│   ├── auth/
│   └── ui/
├── contexts/
│   ├── user-context.tsx
│   └── theme-context.tsx
├── lib/
│   └── api.ts
├── public/
├── styles/
├── types/
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## UI Components

- **Task Management**: Create, update, delete, and mark tasks as complete
- **Authentication**: Login and signup forms with validation
- **Navigation**: Responsive navigation with mobile menu
- **Theme Toggle**: Dark/light mode switch
- **Loading States**: Skeleton loaders and spinners
- **Error Boundaries**: Graceful error handling

## API Integration

The frontend communicates with the backend API using:
- JWT tokens for authentication
- Proper error handling and user feedback
- Loading states for better UX
- Input validation and sanitization

## Modern UI Design

Following the ModernUIDesign skill with:
- Glassmorphism effects
- Soft edges and rounded corners
- Micro-interactions and animations
- Dark mode support
- Responsive design for all devices