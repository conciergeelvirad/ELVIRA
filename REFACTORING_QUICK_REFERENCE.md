# Refactoring Quick Reference 📋

## At a Glance

### Files to Refactor (by size)

1. 🔴 **RecommendedItemModal.tsx** - 350 lines → 100 lines (5 components)
2. 🔴 **ApprovedThirdPartySection.tsx** - 350 lines → 80 lines (3 components + 2 hooks)
3. 🔴 **useGuestChat.ts** - 304 lines → 80 lines (4 hooks + utils)
4. 🟡 **FilterModal.tsx** - 300 lines → 80 lines (4 components)
5. 🟡 **FilterableListPage.tsx** - 250 lines → ✅ Already good
6. 🟡 **PhotoGallerySection.tsx** - 250 lines → 60 lines (3 components + hook)
7. 🟢 **ExperienceCard.tsx** - 200 lines → 80 lines (3 components)
8. 🟢 **GuestDashboard.tsx** - 200 lines → 100 lines (3 hooks)

**Total: 2,204 lines → ~660 lines (70% reduction)**

---

## Priority Order (Recommended)

### Week 1: Critical & High Impact

```
Day 1-2: useGuestChat.ts         (Chat is critical feature)
Day 3-4: RecommendedItemModal.tsx (Used in multiple places)
Day 5:   ApprovedThirdPartySection (Part 1 - hooks)
```

### Week 2: Supporting Features

```
Day 1-2: ApprovedThirdPartySection (Part 2 - components)
Day 3-4: FilterModal.tsx          (Used in Shop/DineIn/Services)
Day 5:   PhotoGallerySection.tsx  (Visual impact)
```

### Week 3: Polish & Reusability

```
Day 1-2: ExperienceCard.tsx      (Create reusable components)
Day 3-4: GuestDashboard.tsx      (Orchestration cleanup)
Day 5:   Documentation & Testing
```

---

## Reusable Components to Create

### 🎠 SectionCarousel

**Priority:** HIGH  
**Uses:** 4+ (Recommended, ApprovedThirdParty, DineInMenu, PhotoGallery)  
**Lines:** ~60  
**Props:**

```typescript
{
  items: any[];
  renderItem: (item) => ReactNode;
  isLoading: boolean;
  title: string;
  autoScroll?: boolean;
}
```

### 🖼️ CardImage

**Priority:** HIGH  
**Uses:** 6+ (All card components)  
**Lines:** ~40  
**Props:**

```typescript
{
  src: string;
  alt: string;
  fallback?: string;
  aspectRatio?: string;
  lazy?: boolean;
}
```

### ⭐ CardRating

**Priority:** MEDIUM  
**Uses:** 3+ (Restaurant, Tour, Review cards)  
**Lines:** ~30  
**Props:**

```typescript
{
  rating: number;
  reviewCount?: number;
  showStars?: boolean;
}
```

### 📞 ContactInfo

**Priority:** MEDIUM  
**Uses:** 3+ (Modals, Emergency contacts)  
**Lines:** ~50  
**Props:**

```typescript
{
  phone?: string;
  website?: string;
  address?: string;
  placeId?: string;
  email?: string;
}
```

### 🎭 Modal Shell

**Priority:** MEDIUM  
**Uses:** 5+ (All modals)  
**Lines:** ~80  
**Props:**

```typescript
{
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: ReactNode;
}
```

---

## Existing Components to Reuse

✅ **EmptyState** - `src/pages/Guests/components/ui/EmptyState.tsx`  
✅ **LoadingSkeleton** - `src/pages/Guests/components/ui/LoadingSkeleton.tsx`  
✅ **CategoryHeader** - `src/pages/Guests/components/ui/CategoryHeader.tsx`  
✅ **useFilterState** - Existing hook for filter management  
✅ **useItemModal** - Existing hook for modal state  
✅ **useGuestHotelId** - Existing hook for hotel ID extraction

---

## Refactoring Checklist (Per File)

### Before Starting

- [ ] Read entire file to understand functionality
- [ ] Identify repeated patterns
- [ ] List all external dependencies
- [ ] Note existing type definitions
- [ ] Check for existing similar components

### During Refactoring

- [ ] Create folder structure
- [ ] Extract smallest components first
- [ ] Create type definitions
- [ ] Write JSDoc comments
- [ ] Create barrel exports (index.ts)
- [ ] Update imports in main file
- [ ] Test each component individually

### After Refactoring

- [ ] Run TypeScript compiler (no errors)
- [ ] Test functionality in browser
- [ ] Check for console errors
- [ ] Verify no broken imports
- [ ] Update documentation
- [ ] Commit with descriptive message

---

## Common Patterns

### 1. Component Extraction

```typescript
// Before: Large component with embedded logic
export const LargeComponent = () => {
  // 300 lines of code
};

// After: Main component + sub-components
export const LargeComponent = () => {
  return (
    <>
      <SubComponent1 />
      <SubComponent2 />
      <SubComponent3 />
    </>
  );
};
```

### 2. Hook Extraction

```typescript
// Before: Logic in component
export const Component = () => {
  const [state1, setState1] = useState();
  const [state2, setState2] = useState();
  // Complex logic here
};

// After: Custom hook
export const useComponentLogic = () => {
  const [state1, setState1] = useState();
  const [state2, setState2] = useState();
  // Complex logic here
  return { state1, state2, methods };
};

export const Component = () => {
  const logic = useComponentLogic();
  return <div>...</div>;
};
```

### 3. Utility Extraction

```typescript
// Before: Helper functions in component
export const Component = () => {
  const helperFunction = () => { ... }
  const anotherHelper = () => { ... }
}

// After: Utils file
// utils/helpers.ts
export const helperFunction = () => { ... }
export const anotherHelper = () => { ... }

// Component.tsx
import { helperFunction, anotherHelper } from './utils/helpers'
```

---

## Folder Structure Template

```
ComponentName/
├── ComponentName.tsx          # Main component (orchestration)
├── components/                # Sub-components
│   ├── SubComponent1.tsx
│   ├── SubComponent2.tsx
│   └── SubComponent3.tsx
├── hooks/                     # Custom hooks (if needed)
│   ├── useComponentLogic.ts
│   └── useAnotherHook.ts
├── utils/                     # Utility functions
│   ├── helpers.ts
│   └── transformers.ts
├── types.ts                   # Type definitions (if needed)
└── index.ts                   # Barrel export
```

---

## Naming Conventions

### Components

- PascalCase: `CardImage`, `SectionCarousel`
- Descriptive: `RestaurantCard` not `Card1`
- Indicate purpose: `PhotoLightbox` not `PhotoModal`

### Hooks

- camelCase with 'use' prefix: `useGuestChat`
- Descriptive: `useStaffAssignment` not `useStaff`
- Return object: `{ data, isLoading, error, actions }`

### Utilities

- camelCase: `transformMessage`, `findStaff`
- Verb-first: `calculatePrice` not `priceCalculation`
- Pure functions preferred

### Types

- PascalCase: `GuestChatProps`, `MessageData`
- Descriptive suffixes: `Props`, `Data`, `Response`, `Request`

---

## Testing Quick Start

### Component Test Template

```typescript
import { render, screen } from "@testing-library/react";
import { ComponentName } from "./ComponentName";

describe("ComponentName", () => {
  it("renders correctly", () => {
    render(<ComponentName {...mockProps} />);
    expect(screen.getByText("Expected Text")).toBeInTheDocument();
  });

  it("handles user interaction", () => {
    const onClickMock = jest.fn();
    render(<ComponentName onClick={onClickMock} />);
    // Test interaction
  });
});
```

### Hook Test Template

```typescript
import { renderHook } from "@testing-library/react-hooks";
import { useHookName } from "./useHookName";

describe("useHookName", () => {
  it("returns correct initial state", () => {
    const { result } = renderHook(() => useHookName());
    expect(result.current.state).toBe(expectedValue);
  });

  it("handles state changes", () => {
    const { result } = renderHook(() => useHookName());
    act(() => {
      result.current.action();
    });
    expect(result.current.state).toBe(newValue);
  });
});
```

---

## Git Commit Messages

### Format

```
type(scope): brief description

- Detailed change 1
- Detailed change 2

Closes #issue
```

### Examples

```
refactor(chat): extract useGuestChat into smaller hooks

- Created useStaffAssignment hook
- Created useConversationSetup hook
- Created useMessageSubscription hook
- Reduced main hook from 304 to 80 lines

Closes #123
```

```
feat(components): add reusable SectionCarousel component

- Horizontal scroll with auto-scroll support
- Configurable render function
- Loading states
- Can be used in 4+ sections

Closes #124
```

---

## Progress Tracking

### Overall Progress

- [ ] Phase 1: useGuestChat.ts (304 lines)
- [ ] Phase 2: FilterModal.tsx (300 lines)
- [ ] Phase 3: RecommendedItemModal.tsx (350 lines)
- [ ] Phase 4: ApprovedThirdPartySection.tsx (350 lines)
- [ ] Phase 5: PhotoGallerySection.tsx (250 lines)
- [ ] Phase 6: ExperienceCard.tsx (200 lines)
- [ ] Phase 7: GuestDashboard.tsx (200 lines)
- [ ] Phase 8: Reusable Components Library
- [ ] Phase 9: Documentation & Testing

### Key Metrics

- **Total Lines Before:** 2,204
- **Target Lines After:** ~660
- **Expected Reduction:** 70%
- **New Reusable Components:** 15+
- **Components Refactored:** 8

---

## Help & Resources

### Documentation

- Main Plan: `COMPREHENSIVE_REFACTORING_PLAN.md`
- QA Example: `QA_PAGE_REFACTORING_COMPLETE.md`
- FilterableListPage: Check implementation for patterns

### Existing Patterns

- Look at QAPage refactoring for hook extraction examples
- Look at FilterableListPage for component composition
- Look at ui/ folder for reusable component patterns

### When Stuck

1. Check if similar component exists
2. Review existing refactored files
3. Break problem into smaller pieces
4. Test frequently
5. Commit working code often

---

**Ready to start refactoring! 🚀**

Choose your starting point:

1. Start with Priority 1 (useGuestChat.ts) - Most complex
2. Start with Phase 6 (ExperienceCard.tsx) - Easiest, creates reusable components
3. Start with Phase 4 (ApprovedThirdPartySection) - High impact, creates SectionCarousel

Recommended: **Start with ExperienceCard to create CardImage and CardRating components that others can reuse!**
