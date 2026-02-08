---
name: modern-ui-design-todo-app
description: Modern UI design system for Nexa following 2025 trends. Implements glassmorphism, dark mode, soft edges, exaggerated minimalism, and micro-interactions. Includes color palettes, component patterns, layout guidelines, and Tailwind CSS implementation. Use for creating attractive, modern, user-friendly interfaces.
---

# Modern UI Design for Nexa

**Core Thesis**: A modern task management app UI should combine glassmorphism aesthetics with practical usability, using dark mode as default, soft rounded edges, and purposeful micro-interactions to create an engaging yet distraction-free experience.

Based on 2025 design trends, this skill provides a complete design system that balances visual appeal with functional clarity, ensuring users can focus on their tasks while enjoying a premium interface.

## When to Activate

Activate this skill when:
- Designing UI components for the todo web application
- Creating responsive layouts for desktop and mobile
- Implementing color schemes and typography
- Building reusable component patterns
- Ensuring consistent design language across the app
- Updating from console app to modern web interface

## Core Concepts

### 1. Design Philosophy: Exaggerated Minimalism

| Principle | Description | Implementation |
|-----------|-------------|----------------|
| **Bold Simplicity** | Large typography, generous white space | Hero headings, minimal UI chrome |
| **Purposeful Depth** | Glassmorphism for visual hierarchy | Frosted glass cards, layered panels |
| **Soft Interactions** | Rounded corners, smooth animations | Border radius 12-16px, 200-300ms transitions |
| **Focused Attention** | Strategic use of accent colors | Indigo primary, pink for CTAs |

### 2. Visual Trends Applied

Based on 2025 design research, this system incorporates:

- **Glassmorphism (Liquid Glass)**: Translucent surfaces with backdrop blur
- **Dark Mode First**: Reduces eye strain, modern aesthetic
- **Soft Rounded Edges**: Approachable, human-centric design
- **Micro-interactions**: Feedback on hover, click, completion
- **Card-based Layout**: Organized content in scannable blocks

### 3. Color System

#### Dark Mode (Default)

```
Primary Colors:
- Background: #0F0F0F (Deep Black)
- Surface: #1A1A1A (Card Background)
- Glass Surface: rgba(26, 26, 26, 0.7) with backdrop-blur-xl

Accent Colors:
- Primary (Indigo): #6366F1
- Accent (Pink): #EC4899
- Success (Green): #10B981
- Warning (Amber): #F59E0B
- Error (Red): #EF4444

Text Colors:
- Primary: #F9FAFB (Off-white)
- Secondary: #9CA3AF (Gray)
- Muted: #6B7280 (Lighter Gray)

Border Colors:
- Default: rgba(255, 255, 255, 0.1)
- Hover: rgba(255, 255, 255, 0.2)
```

#### Light Mode (Optional)

```
Primary Colors:
- Background: #FFFFFF
- Surface: #F9FAFB
- Glass Surface: rgba(249, 250, 251, 0.8) with backdrop-blur-xl

Accent Colors: (Same as dark mode for consistency)

Text Colors:
- Primary: #111827 (Near Black)
- Secondary: #4B5563 (Gray)
- Muted: #9CA3AF (Lighter Gray)

Border Colors:
- Default: rgba(0, 0, 0, 0.1)
- Hover: rgba(0, 0, 0, 0.2)
```

### 4. Typography System

```
Font Family:
- Primary: Inter (Clean, modern sans-serif)
- Fallback: system-ui, -apple-system, sans-serif

Scale:
- Heading 1: 48px / 3rem (Hero sections)
- Heading 2: 36px / 2.25rem (Page titles)
- Heading 3: 24px / 1.5rem (Section headers)
- Body Large: 18px / 1.125rem (Emphasis)
- Body: 16px / 1rem (Default text)
- Body Small: 14px / 0.875rem (Secondary info)
- Caption: 12px / 0.75rem (Timestamps, labels)

Font Weights:
- Regular: 400 (Body text)
- Medium: 500 (Emphasis)
- Semibold: 600 (Headings)
- Bold: 700 (Titles)

Line Heights:
- Tight: 1.2 (Headings)
- Normal: 1.5 (Body)
- Relaxed: 1.75 (Long-form content)
```

### 5. Spacing System (8px Grid)

```
Scale:
- xs: 4px (0.25rem)
- sm: 8px (0.5rem)
- md: 16px (1rem)
- lg: 24px (1.5rem)
- xl: 32px (2rem)
- 2xl: 48px (3rem)
- 3xl: 64px (4rem)

Component Spacing:
- Card padding: lg (24px)
- Button padding: sm (8px) vertical, md (16px) horizontal
- Input padding: sm (8px) vertical, md (16px) horizontal
- Section gap: xl (32px)
- List item gap: md (16px)
```

## Component Patterns

### 1. Task Card (Glassmorphism)

```tsx
// TaskCard.tsx
interface TaskCardProps {
  task: Task;
  onToggle: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  return (
    <div className="group relative">
      {/* Glassmorphism Container */}
      <div className={`
        bg-white/5 dark:bg-white/5
        backdrop-blur-xl
        border border-white/10
        rounded-2xl
        p-6
        transition-all duration-300
        hover:bg-white/10
        hover:border-white/20
        hover:shadow-xl hover:shadow-indigo-500/10
        ${task.completed ? 'opacity-60' : ''}
      `}>
        
        {/* Checkbox + Title */}
        <div className="flex items-start gap-4">
          <button
            onClick={() => onToggle(task.id)}
            className={`
              relative flex-shrink-0
              w-6 h-6
              rounded-lg
              border-2
              transition-all duration-200
              ${task.completed
                ? 'bg-emerald-500 border-emerald-500'
                : 'border-white/30 hover:border-indigo-400'
              }
            `}
          >
            {task.completed && (
              <svg className="w-full h-full text-white p-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          <div className="flex-1 min-w-0">
            <h3 className={`
              text-lg font-semibold
              ${task.completed
                ? 'line-through text-gray-500'
                : 'text-gray-100'
              }
            `}>
              {task.title}
            </h3>
            
            {task.description && (
              <p className="mt-1 text-sm text-gray-400">
                {task.description}
              </p>
            )}

            <p className="mt-2 text-xs text-gray-500">
              {new Date(task.created_at).toLocaleDateString()}
            </p>
          </div>

          {/* Action Buttons (Show on Hover) */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(task.id)}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-indigo-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            
            <button
              onClick={() => onDelete(task.id)}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 2. Primary Button (Soft, Modern)

```tsx
// Button.tsx
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled
}: ButtonProps) {
  const baseClasses = `
    relative
    inline-flex items-center justify-center
    font-medium
    rounded-xl
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-indigo-500 to-purple-500
      hover:from-indigo-600 hover:to-purple-600
      text-white
      shadow-lg shadow-indigo-500/25
      hover:shadow-xl hover:shadow-indigo-500/40
      hover:scale-105
    `,
    secondary: `
      bg-white/10
      backdrop-blur-xl
      border border-white/20
      hover:bg-white/20
      text-gray-100
    `,
    ghost: `
      hover:bg-white/10
      text-gray-300
      hover:text-white
    `
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </button>
  );
}
```

### 3. Input Field (Glassmorphism)

```tsx
// Input.tsx
interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password';
  error?: string;
}

export function Input({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  error
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`
          w-full
          px-4 py-3
          bg-white/5
          backdrop-blur-xl
          border
          ${error ? 'border-red-500' : 'border-white/10'}
          rounded-xl
          text-gray-100
          placeholder:text-gray-500
          focus:outline-none
          focus:ring-2
          focus:ring-indigo-500
          focus:border-transparent
          transition-all duration-200
        `}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
```

### 4. Modal (Glassmorphism Overlay)

```tsx
// Modal.tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg">
        <div className="
          bg-gray-900/95
          backdrop-blur-xl
          border border-white/10
          rounded-2xl
          p-6
          shadow-2xl
          animate-in fade-in zoom-in duration-200
        ">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-100">
              {title}
            </h2>
            
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
}
```

## Layout Patterns

### 1. Dashboard Layout

```tsx
// app/tasks/page.tsx
export default function TasksPage() {
  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-5xl font-bold text-gray-100 mb-2">
            My Tasks
          </h1>
          <p className="text-gray-400 text-lg">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Sidebar - Filters */}
          <aside className="lg:col-span-3">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-100 mb-4">
                Filters
              </h3>
              {/* Filter options */}
            </div>
          </aside>

          {/* Task List */}
          <main className="lg:col-span-9">
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2">
                <Button variant="primary">
                  + New Task
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Task cards go here */}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
```

### 2. Mobile-Responsive Grid

```tsx
// Responsive Task Grid
<div className="
  grid
  gap-4
  grid-cols-1
  sm:grid-cols-2
  lg:grid-cols-3
  xl:grid-cols-4
">
  {tasks.map(task => (
    <TaskCard key={task.id} task={task} />
  ))}
</div>
```

## Micro-interactions

### 1. Hover Effects

```css
/* Smooth hover transitions */
.card {
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(99, 102, 241, 0.2);
}
```

### 2. Success Animation (Task Complete)

```tsx
// Confetti effect on task completion
const [showConfetti, setShowConfetti] = useState(false);

const handleToggleComplete = async (id: number) => {
  await toggleTask(id);
  setShowConfetti(true);
  setTimeout(() => setShowConfetti(false), 2000);
};

{showConfetti && (
  <div className="fixed inset-0 pointer-events-none">
    {/* Confetti animation */}
  </div>
)}
```

### 3. Loading States

```tsx
// Skeleton loading for tasks
function TaskSkeleton() {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 animate-pulse">
      <div className="flex gap-4">
        <div className="w-6 h-6 bg-white/10 rounded-lg" />
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-white/10 rounded w-3/4" />
          <div className="h-4 bg-white/10 rounded w-full" />
        </div>
      </div>
    </div>
  );
}
```

## Tailwind Configuration

```js
// tailwind.config.js
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom color palette
        dark: {
          100: '#F9FAFB',
          200: '#E5E7EB',
          300: '#9CA3AF',
          400: '#6B7280',
          500: '#4B5563',
          600: '#374151',
          700: '#1F2937',
          800: '#1A1A1A',
          900: '#0F0F0F',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'in': 'fadeIn 200ms ease-in',
        'out': 'fadeOut 200ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        fadeOut: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.95)' },
        },
      },
    },
  },
  plugins: [],
};
```

## Anti-Patterns to Avoid

| ❌ Don't | ✅ Do Instead |
|---------|--------------|
| Too much glassmorphism | Use strategically for key components only |
| Low contrast text | Maintain WCAG AA standards (4.5:1 ratio) |
| Overuse animations | Keep transitions under 300ms, purposeful only |
| Inconsistent rounded corners | Use consistent border-radius (12-16px) |
| No loading states | Always show feedback for async operations |
| Cluttered cards | Limit to 3-4 key pieces of info per card |
| Flat colors only | Add subtle gradients for depth |

## Accessibility Checklist

- [ ] Color contrast meets WCAG AA (4.5:1 for normal text)
- [ ] Keyboard navigation works for all interactive elements
- [ ] Focus indicators visible on all focusable elements
- [ ] ARIA labels for icon-only buttons
- [ ] Screen reader friendly markup
- [ ] Touch targets minimum 44x44px for mobile
- [ ] Light mode option available (not just dark)
- [ ] Reduced motion support for animations

## Implementation Quick Start

### Step 1: Install Dependencies

```bash
cd frontend
npm install @headlessui/react @heroicons/react clsx tailwind-merge
```

### Step 2: Setup Fonts

```tsx
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

### Step 3: Create Component Library

```
components/
├── ui/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── Card.tsx
│   └── Skeleton.tsx
└── tasks/
    ├── TaskCard.tsx
    ├── TaskForm.tsx
    └── TaskList.tsx
```

## Testing Your Design

```tsx
// Test different states
<TaskCard
  task={{
    id: 1,
    title: "Design System",
    description: "Create modern UI",
    completed: false,
    created_at: new Date().toISOString()
  }}
/>

<TaskCard
  task={{
    id: 2,
    title: "API Integration",
    completed: true,
    created_at: new Date().toISOString()
  }}
/>
```

## Integration with Other Skills

This skill connects to:
- **monorepo-spec-kit-structure**: Organizing UI components in frontend folder
- **better-auth-jwt-integration**: Styling login/signup pages
- **neon-postgresql-setup**: Designing data visualization for tasks

---

**Skill Metadata**

**Created**: 2025-01-05  
**Phase**: Phase II - Full-Stack Web Application  
**Design Trends**: Glassmorphism, Dark Mode, Soft Edges, Micro-interactions  
**Version**: 1.0.0