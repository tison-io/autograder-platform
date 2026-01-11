# Shared Components Reference

## Phase 6: Shared Components ✅

### Navbar Component

```tsx
import { Navbar } from '@/components/layout';

// Automatically included in protected layout
// Features:
// - User avatar with dropdown menu
// - Role-based navigation links
// - Logout functionality
// - Responsive design
```

### Loading Components

```tsx
import { LoadingSpinner, LoadingCard, LoadingPage } from '@/components/shared';

// Small spinner
<LoadingSpinner size="sm" />

// Medium spinner with text
<LoadingSpinner size="md" text="Loading data..." />

// Large spinner
<LoadingSpinner size="lg" />

// Full page loading
<LoadingPage text="Loading..." />

// Card loading state
<LoadingCard />
```

### Error Components

```tsx
import { ErrorMessage, ErrorCard, ErrorPage } from '@/components/shared';

// Inline error
<ErrorMessage
  title="Error"
  message="Failed to load data"
  onRetry={() => refetch()}
/>

// Card error state
<ErrorCard
  message="Failed to load assignments"
  onRetry={() => refetch()}
/>

// Full page error
<ErrorPage
  title="Something went wrong"
  message="An unexpected error occurred"
  onRetry={() => refetch()}
/>
```

### Empty State Components

```tsx
import { EmptyState, EmptyCard } from '@/components/shared';

// Empty state with action
<EmptyState
  icon="inbox" // or "file"
  title="No courses yet"
  description="Get started by creating your first course."
  action={{
    label: "Create Course",
    onClick: () => navigate('/courses/new')
  }}
/>

// Simple empty card
<EmptyCard
  title="No submissions"
  description="There are no submissions for this assignment yet."
/>
```

## Usage Examples

### Loading State

```tsx
const { data, isLoading, error, refetch } = useQuery(...);

if (isLoading) return <LoadingCard />;
if (error) return <ErrorCard message={error.message} onRetry={refetch} />;
if (!data?.length) return <EmptyCard title="No data" description="..." />;

return <div>{/* render data */}</div>;
```

### Protected Pages

All pages in `(protected)` route group automatically have:

- Navbar with user menu
- Auth check and redirect
- Consistent layout

## Component Locations

- Layout: `src/components/layout/`
- Shared: `src/components/shared/`
- UI: `src/components/ui/` (shadcn/ui)

## Demo Page

View all components at: `/demo/components`
