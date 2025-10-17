# Q&A Page Implementation

## Overview

Implemented a dedicated Q&A page for the guest dashboard that displays frequently asked questions organized by category, similar to the hotel Q&A browsing experience shown in the reference screenshot.

## Features

### Page Layout

- **Compact Header**: Gradient background (indigo-to-purple) with title and subtitle
- **Category Organization**: Q&A items grouped by category with count badges
- **Accordion Interface**: Expandable/collapsible Q&A items
- **Mobile-Optimized**: Touch-friendly interface with clear visual feedback

### Functionality

1. **Data Fetching**: Uses `useActiveQARecommendations` hook to fetch Q&A items from Supabase
2. **Category Grouping**: Automatically groups questions by category using `groupByCategory` transformer
3. **Expand/Collapse**: Click any question to reveal/hide the answer
4. **Loading States**: Skeleton loading animation while data is being fetched
5. **Empty States**: User-friendly message when no Q&A items are available

## File Structure

```
src/pages/Guests/pages/QA/
├── QAPage.tsx          # Main Q&A page component
└── index.ts            # Barrel export
```

## Database Schema

The page uses the `qa_recommendations` table with the following fields:

- `id`: Unique identifier
- `hotel_id`: Foreign key to hotels table
- `question`: The FAQ question text
- `answer`: The answer text
- `category`: Category name (e.g., "Accessibility", "Amenities", "Dining")
- `type`: Type of Q&A
- `is_active`: Boolean flag to show/hide items
- `created_at`, `updated_at`: Timestamps
- `created_by`: Foreign key to profiles

## Navigation Integration

### NavigationTab Type

Updated to include `"qa"` as a valid tab option:

```typescript
export type NavigationTab =
  | "home"
  | "services"
  | "dine-in"
  | "shop"
  | "qa"
  | "logout";
```

### GuestDashboard Routing

Added Q&A page to the dashboard routing:

```typescript
case "qa":
  return <QAPage />;
```

### HomePage Quick Access

Updated the Q&A card handler to navigate to the Q&A page:

```typescript
else if (cardId === "qna" && onNavigate) {
  console.log("✅ [HomePage] Navigating to Q&A page");
  onNavigate("qa");
}
```

## UI Components

### Header

```tsx
<div className="px-4 py-3 bg-gradient-to-br from-indigo-50 to-purple-50 mb-4">
  <h1 className="text-xl font-bold text-gray-900 mb-1">Browse Q&A</h1>
  <p className="text-sm text-gray-600">
    Tap a category, then a question to expand.
  </p>
</div>
```

### Category Section

- Category name with count badge
- Vertical list of Q&A accordion items
- Consistent spacing and styling

### Q&A Accordion Item

- Question displayed in bold with chevron icon
- Answer revealed when expanded
- Smooth transitions
- Border styling for clear separation

## Styling Details

### Colors

- Header gradient: `from-indigo-50 to-purple-50`
- Category badge: `bg-indigo-100 text-indigo-700`
- Chevron (expanded): `text-indigo-600`
- Chevron (collapsed): `text-gray-400`

### Spacing

- Header padding: `py-3` (compact)
- Header margin bottom: `mb-4`
- Category margin bottom: `mb-6`
- Q&A item spacing: `space-y-2`
- Button padding: `p-4`

### Interactive States

- Hover: `hover:bg-gray-50` on question button
- Transition: `transition-colors` for smooth interactions
- Border: Top border on answer section for visual separation

## State Management

### Expanded Items Tracking

Uses a Set to track which items are expanded:

```typescript
const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
```

Key format: `"${category}-${index}"` to uniquely identify each Q&A item.

### Toggle Function

```typescript
const toggleItem = (category: string, index: number) => {
  const key = `${category}-${index}`;
  const newExpanded = new Set(expandedItems);

  if (newExpanded.has(key)) {
    newExpanded.delete(key);
  } else {
    newExpanded.add(key);
  }

  setExpandedItems(newExpanded);
};
```

## Query Hooks Used

### Primary Hook

- `useActiveQARecommendations(hotelId)`: Fetches only active Q&A items for the hotel

### Transformer

- `groupByCategory(qaItems)`: Groups Q&A items by their category field

## Icons

- **ChevronDown**: Shown when item is collapsed
- **ChevronUp**: Shown when item is expanded
- **Question Mark Emoji**: Used in empty state (❓)

## Loading & Empty States

### Loading State

- Shows 5 skeleton placeholders
- Animates with `animate-pulse`
- Height: `h-16`
- Background: `bg-gray-100`

### Empty State

- Large emoji icon (❓)
- Primary message: "No Q&A available"
- Secondary message: "Please check back later or contact the front desk"
- Centered layout with rounded container

## Console Logging

Debug logs for tracking:

```typescript
console.log("❓ [QAPage] Fetched Q&A items:", qaItems.length);
```

## Responsive Design

- Mobile-first approach
- Full-width buttons for easy tapping
- Adequate padding for touch targets
- Text wrapping for long questions/answers
- Flexible layout adapts to content

## Accessibility

- Semantic HTML with `<button>` elements
- Clear visual feedback on hover/active states
- Keyboard navigable (native button behavior)
- Screen reader friendly with proper structure

## Integration Points

### Files Modified

1. `src/pages/Guests/pages/index.ts` - Added QAPage export
2. `src/pages/Guests/GuestDashboard.tsx` - Added QAPage import and routing
3. `src/pages/Guests/components/shared/BottomNavigation.tsx` - Updated NavigationTab type
4. `src/pages/Guests/pages/Home/HomePage.tsx` - Added Q&A navigation handler

### Files Created

1. `src/pages/Guests/pages/QA/QAPage.tsx` - Main page component
2. `src/pages/Guests/pages/QA/index.ts` - Barrel export

## Usage

The Q&A page is accessible by:

1. Clicking the "Q&A" card on the Home page (under Hotel category)
2. Navigating directly via the routing system with `activeTab="qa"`

## Future Enhancements

Potential improvements:

- Search functionality to filter questions
- Expand/collapse all buttons
- Deep linking to specific Q&A items
- Feedback mechanism (helpful/not helpful)
- Related questions suggestions
- Type/topic filtering beyond categories
- Bookmarking favorite Q&As
- Share specific Q&A answers

## Testing Checklist

- [x] Page loads without errors
- [x] Q&A items display correctly when data is available
- [x] Loading state shows during data fetch
- [x] Empty state displays when no Q&A items exist
- [x] Questions expand/collapse correctly
- [x] Multiple items can be expanded simultaneously
- [x] Navigation from Home page works
- [x] Category grouping functions properly
- [x] Responsive layout works on mobile screens
- [x] TypeScript types are correct
- [x] Console logs help with debugging
