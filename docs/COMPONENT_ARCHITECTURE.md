# Component Architecture

## Overview

Zentara Global Cyber Threat Monitor follows a modular, component-based architecture built with Next.js 15, TypeScript, and modern React patterns.

## Architecture Principles

### 1. Separation of Concerns
- **UI Components**: Pure presentation components
- **Business Logic**: Custom hooks and utilities
- **Data Layer**: API clients and data fetching
- **State Management**: React Query + local state

### 2. Component Composition
- **Atomic Design**: Small, reusable components
- **Compound Components**: Complex UI patterns
- **Render Props**: Flexible component APIs
- **Higher-Order Components**: Cross-cutting concerns

### 3. Type Safety
- **TypeScript**: Full type coverage
- **Interface Definitions**: Clear contracts
- **Generic Types**: Reusable type patterns
- **Strict Mode**: Compile-time error checking

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (protected)/             # Protected routes group
│   │   └── dashboard/           # Main dashboard
│   │       ├── _components/     # Dashboard-specific components
│   │       └── page.tsx         # Dashboard page
│   ├── _components/             # Global/shared components
│   │   └── ui/                  # ShadCN UI components
│   ├── _entities/               # Type definitions
│   ├── _hooks/                  # Custom React hooks
│   ├── _libs/                   # Utility libraries
│   └── api/                     # API route handlers
├── api/                         # External API clients
└── docs/                        # Documentation
```

## Component Hierarchy

### Dashboard Page
```
DashboardPage
├── Header
├── CountrySelection
├── ThreatDashboard
├── ThreatVisualization
└── AIAnalysis
```

### Component Dependencies
```
CountrySelection
├── useCountries (hook)
├── Input (UI)
├── Badge (UI)
└── Card (UI)

ThreatDashboard
├── useThreats (hook)
├── Badge (UI)
├── Progress (UI)
└── Card (UI)

ThreatVisualization
├── useThreats (hook)
├── BarChart (Recharts)
├── PieChart (Recharts)
└── LineChart (Recharts)

AIAnalysis
├── useNIM (hook)
├── useThreats (hook)
├── Button (UI)
├── Input (UI)
└── Card (UI)
```

## Core Components

### 1. CountrySelection

**Purpose**: Multi-country selection with search and flag display

**Props**:
```typescript
interface CountrySelectionProps {
  selectedCountries: Country[];
  onSelectionChange: (countries: Country[]) => void;
  onGenerateThreats: (codes?: string[]) => void;
}
```

**Features**:
- Searchable dropdown
- Flag icon display
- Maximum 5 countries
- Click-outside-to-close
- Real-time search

**State Management**:
- Local state for search term
- Local state for dropdown visibility
- Props for selected countries

**Dependencies**:
- `useCountries` hook
- `country-flag-icons` package
- ShadCN UI components

### 2. ThreatDashboard

**Purpose**: Real-time threat overview and statistics

**Props**:
```typescript
interface ThreatDashboardProps {
  selectedCountries: Country[];
  threats: Threat[];
  stats: ThreatStats;
}
```

**Features**:
- Live threat statistics
- Progress bars for threat levels
- Recent threats list
- Live indicator with animation

**State Management**:
- Receives data via props
- No internal state management

**Dependencies**:
- Threat data from parent
- ShadCN UI components

### 3. ThreatVisualization

**Purpose**: Interactive charts and data visualization

**Props**:
```typescript
interface ThreatVisualizationProps {
  selectedCountries: Country[];
  threats: Threat[];
  stats: ThreatStats;
}
```

**Features**:
- Bar charts for threat levels
- Pie charts for threat types
- Country comparison charts
- Timeline visualization
- Debounced updates

**State Management**:
- Debounced state for performance
- Memoized chart data
- No direct API calls

**Dependencies**:
- Recharts library
- Threat data from parent

### 4. AIAnalysis

**Purpose**: AI-powered threat analysis and chat

**Props**:
```typescript
interface AIAnalysisProps {
  selectedCountries: Country[];
}
```

**Features**:
- Streaming AI analysis
- Interactive chat interface
- Stop/restart functionality
- Export capabilities
- Markdown rendering

**State Management**:
- Local chat state
- AI analysis state
- Mode switching (analysis/chat)

**Dependencies**:
- `useNIM` hook
- `useThreats` hook
- `react-markdown` package

## Custom Hooks

### 1. useCountries

**Purpose**: Fetch and manage country data

**Implementation**:
```typescript
export function useCountries(filter?: CountryQueryVariables["filter"]) {
  return useQuery({
    queryKey: ["countries", filter],
    queryFn: async () => {
      // GraphQL query implementation
    },
    staleTime: 5 * 60 * 1000,
  });
}
```

**Returns**:
- `data`: Country array
- `isLoading`: Loading state
- `error`: Error state

**Caching**: 5 minutes with React Query

### 2. useThreats

**Purpose**: Generate and manage threat data

**Implementation**:
```typescript
export function useThreats(selectedCountries: string[]) {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Threat generation logic
  // Real-time updates
  // Statistics calculation
  
  return {
    threats,
    stats,
    isGenerating,
    generateThreats,
    addRandomThreat,
    clearThreats,
  };
}
```

**Features**:
- Real-time threat generation
- Automatic cleanup
- Statistics calculation
- Performance optimization

### 3. useNIM

**Purpose**: AI integration and streaming

**Implementation**:
```typescript
export function useNIM() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState(false);
  
  // AI analysis logic
  // Streaming implementation
  // Error handling
  
  return {
    isAnalyzing,
    isStreaming,
    analysis,
    error,
    analyzeThreats,
    chatWithAI,
    stopAnalysis,
    clearAnalysis,
  };
}
```

**Features**:
- Streaming responses
- Abort controllers
- Error handling
- State management

## State Management Strategy

### 1. Local State
- **Component-specific state**: `useState`
- **Form state**: Controlled components
- **UI state**: Modals, dropdowns, etc.

### 2. Server State
- **API data**: React Query
- **Caching**: Automatic with React Query
- **Synchronization**: Background updates

### 3. Global State
- **User preferences**: localStorage
- **Session data**: cookies
- **Theme state**: CSS variables

### 4. Derived State
- **Computed values**: `useMemo`
- **Filtered data**: `useMemo`
- **Statistics**: `useMemo`

## Performance Optimizations

### 1. Memoization
```typescript
const memoizedData = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);
```

### 2. Callback Memoization
```typescript
const handleClick = useCallback(() => {
  doSomething();
}, [dependency]);
```

### 3. Component Memoization
```typescript
const MemoizedComponent = memo(Component);
```

### 4. Debouncing
```typescript
const debouncedValue = useDebounce(value, 500);
```

## Error Handling

### 1. Error Boundaries
```typescript
<ErrorBoundary fallback={<ErrorFallback />}>
  <Component />
</ErrorBoundary>
```

### 2. API Error Handling
```typescript
const { data, error, isLoading } = useQuery({
  queryFn: fetchData,
  onError: (error) => {
    console.error('API Error:', error);
  },
});
```

### 3. User Feedback
```typescript
if (error) {
  return <ErrorMessage error={error} />;
}
```

## Testing Strategy

### 1. Unit Tests
- Component rendering
- Hook behavior
- Utility functions

### 2. Integration Tests
- Component interactions
- API integration
- User workflows

### 3. E2E Tests
- Complete user journeys
- Cross-browser testing
- Performance testing

## Accessibility

### 1. ARIA Labels
```typescript
<button aria-label="Close dialog">
  <X />
</button>
```

### 2. Keyboard Navigation
```typescript
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    onClose();
  }
};
```

### 3. Screen Reader Support
```typescript
<div role="status" aria-live="polite">
  {isLoading ? 'Loading...' : 'Complete'}
</div>
```

## Future Enhancements

### 1. Component Library
- Extract reusable components
- Create design system
- Add Storybook documentation

### 2. State Management
- Consider Zustand for complex state
- Add state persistence
- Implement undo/redo

### 3. Performance
- Add virtual scrolling
- Implement code splitting
- Add service worker caching

### 4. Testing
- Add visual regression tests
- Implement accessibility testing
- Add performance monitoring
