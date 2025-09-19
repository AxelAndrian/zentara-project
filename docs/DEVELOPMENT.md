# Development Guide

## Getting Started

### Prerequisites

- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher
- **Git**: For version control
- **Code Editor**: VS Code (recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/zentara.git
   cd zentara
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Development Environment

### Required Environment Variables

Create `.env.local` file:
```env
# NVIDIA NIM API Key (required for AI features)
NIM_API_KEY=your_nvidia_nim_api_key

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Debug mode (optional)
NEXT_PUBLIC_DEBUG=true
```

### VS Code Configuration

Create `.vscode/settings.json`:
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

### Recommended Extensions

- **ES7+ React/Redux/React-Native snippets**
- **TypeScript Importer**
- **Tailwind CSS IntelliSense**
- **Prettier - Code formatter**
- **ESLint**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (protected)/             # Protected routes
│   │   └── dashboard/           # Main dashboard
│   │       ├── _components/     # Dashboard components
│   │       └── page.tsx         # Dashboard page
│   ├── _components/             # Shared components
│   │   └── ui/                  # ShadCN UI components
│   ├── _entities/               # Type definitions
│   ├── _hooks/                  # Custom hooks
│   ├── _libs/                   # Utilities
│   └── api/                     # API routes
├── api/                         # External API clients
└── docs/                        # Documentation
```

## Development Workflow

### 1. Feature Development

1. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes**
   - Write code following project conventions
   - Add tests if applicable
   - Update documentation

3. **Test changes**
   ```bash
   npm run test
   npm run build
   ```

4. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### 2. Code Style

#### TypeScript
- Use strict mode
- Define interfaces for all props
- Use type assertions sparingly
- Prefer `interface` over `type` for objects

#### React
- Use functional components
- Prefer hooks over class components
- Use `useCallback` and `useMemo` for optimization
- Keep components small and focused

#### Styling
- Use Tailwind CSS classes
- Follow mobile-first approach
- Use CSS variables for theming
- Keep styles consistent

### 3. Git Conventions

#### Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: fix bug
docs: update documentation
style: formatting changes
refactor: code refactoring
test: add tests
chore: build process changes
```

#### Branch Naming
```
feature/feature-name
bugfix/bug-description
hotfix/critical-fix
docs/documentation-update
```

## Available Scripts

### Development
```bash
# Start development server
npm run dev

# Start with debug mode
NEXT_PUBLIC_DEBUG=true npm run dev

# Start with specific port
npm run dev -- -p 3001
```

### Building
```bash
# Build for production
npm run build

# Build and analyze bundle
npm run build && npx @next/bundle-analyzer

# Build with type checking
npm run build -- --no-lint
```

### Testing
```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### Linting and Formatting
```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Run Prettier
npm run format

# Check formatting
npm run format:check
```

## Component Development

### Creating New Components

1. **Create component file**
   ```typescript
   // src/app/_components/ui/my-component.tsx
   import React from 'react';
   import { cn } from '@/app/_libs/utils';
   
   interface MyComponentProps {
     className?: string;
     children: React.ReactNode;
   }
   
   export function MyComponent({ className, children }: MyComponentProps) {
     return (
       <div className={cn("base-styles", className)}>
         {children}
       </div>
     );
   }
   ```

2. **Add to index file**
   ```typescript
   // src/app/_components/ui/index.ts
   export { MyComponent } from './my-component';
   ```

3. **Create story (optional)**
   ```typescript
   // src/app/_components/ui/my-component.stories.tsx
   import type { Meta, StoryObj } from '@storybook/react';
   import { MyComponent } from './my-component';
   
   const meta: Meta<typeof MyComponent> = {
     title: 'UI/MyComponent',
     component: MyComponent,
   };
   
   export default meta;
   type Story = StoryObj<typeof meta>;
   
   export const Default: Story = {
     args: {
       children: 'Hello World',
     },
   };
   ```

### Custom Hooks

1. **Create hook file**
   ```typescript
   // src/app/_hooks/useMyHook.ts
   import { useState, useEffect } from 'react';
   
   interface UseMyHookReturn {
     data: any;
     loading: boolean;
     error: string | null;
   }
   
   export function useMyHook(): UseMyHookReturn {
     const [data, setData] = useState(null);
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState<string | null>(null);
   
     useEffect(() => {
       // Hook logic
     }, []);
   
     return { data, loading, error };
   }
   ```

2. **Add to index file**
   ```typescript
   // src/app/_hooks/index.ts
   export { useMyHook } from './useMyHook';
   ```

## API Development

### Adding New API Routes

1. **Create route file**
   ```typescript
   // src/app/api/my-endpoint/route.ts
   import { NextRequest, NextResponse } from 'next/server';
   
   export async function GET(request: NextRequest) {
     try {
       // API logic
       return NextResponse.json({ data: 'success' });
     } catch (error) {
       return NextResponse.json(
         { error: 'Internal Server Error' },
         { status: 500 }
       );
     }
   }
   
   export async function POST(request: NextRequest) {
     const body = await request.json();
     // Handle POST request
     return NextResponse.json({ success: true });
   }
   ```

2. **Add client function**
   ```typescript
   // src/api/my-api.ts
   export async function fetchMyData() {
     const response = await fetch('/api/my-endpoint');
     return response.json();
   }
   ```

## Testing

### Unit Tests

```typescript
// src/app/_components/__tests__/my-component.test.tsx
import { render, screen } from '@testing-library/react';
import { MyComponent } from '../my-component';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent>Test</MyComponent>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

### Integration Tests

```typescript
// src/app/_hooks/__tests__/use-my-hook.test.ts
import { renderHook } from '@testing-library/react';
import { useMyHook } from '../use-my-hook';

describe('useMyHook', () => {
  it('returns initial state', () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current.loading).toBe(false);
  });
});
```

### E2E Tests

```typescript
// tests/e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test('dashboard loads correctly', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page.getByText('Global Cyber Threat Monitor')).toBeVisible();
});
```

## Debugging

### Debug Mode

Enable debug mode by setting:
```env
NEXT_PUBLIC_DEBUG=true
```

This will:
- Show detailed console logs
- Display API request/response data
- Show component render information

### Browser DevTools

1. **React DevTools**
   - Install browser extension
   - Inspect component props and state
   - Profile component performance

2. **Network Tab**
   - Monitor API calls
   - Check request/response data
   - Identify performance bottlenecks

3. **Console**
   - Check for errors and warnings
   - Use `console.log` for debugging
   - Monitor performance metrics

### VS Code Debugging

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/next/dist/bin/next",
      "args": ["dev"],
      "cwd": "${workspaceFolder}",
      "console": "integratedTerminal"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

## Performance Optimization

### Bundle Analysis

```bash
# Analyze bundle size
npm run build && npx @next/bundle-analyzer

# Check for duplicate dependencies
npx npm-check-duplicates
```

### Performance Monitoring

```typescript
// Add performance monitoring
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics service
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### Code Splitting

```typescript
// Dynamic imports for code splitting
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false
});
```

## Troubleshooting

### Common Issues

1. **Build Errors**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run build
   ```

2. **TypeScript Errors**
   ```bash
   # Check TypeScript
   npx tsc --noEmit
   ```

3. **Dependency Issues**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Port Already in Use**
   ```bash
   # Kill process on port 3000
   npx kill-port 3000
   # Or use different port
   npm run dev -- -p 3001
   ```

### Getting Help

1. **Check Documentation**
   - README.md
   - API.md
   - COMPONENT_ARCHITECTURE.md

2. **Search Issues**
   - GitHub Issues
   - Stack Overflow
   - Next.js Documentation

3. **Ask for Help**
   - Create GitHub Issue
   - Join Discord/Slack
   - Contact maintainers

## Contributing

### Before Contributing

1. **Read Contributing Guidelines**
2. **Check Existing Issues**
3. **Fork Repository**
4. **Create Feature Branch**

### Pull Request Process

1. **Write Tests**
2. **Update Documentation**
3. **Follow Code Style**
4. **Write Clear Commit Messages**
5. **Request Review**

### Code Review Checklist

- [ ] Code follows project conventions
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No console.log statements
- [ ] TypeScript types are correct
- [ ] Performance impact considered
- [ ] Accessibility requirements met
