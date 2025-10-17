# Dine-In Menu Section Implementation

## Overview

Implementation of an Uber Eats-style menu display for the Guest Dashboard using the new `ExperienceCard` component.

## Components Created

### 1. **ExperienceCard** (Common Component)

**Path:** `src/pages/Guests/components/ExperienceCard/`

A modern, reusable card component inspired by food delivery apps like Uber Eats and Lieferando.

**Features:**

- Full-width responsive image with lazy loading
- Category badge overlay
- Rating display with stars
- Price level indicator ($ to $$$$) or formatted price
- Distance and estimated time badges
- Favorite button with toggle
- Tags display (up to 3 visible + count)
- Smooth hover effects
- Mobile-optimized

**Props:**

```typescript
interface ExperienceCardProps {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  priceLevel?: number; // 1-4 for $ to $$$$
  price?: string; // Formatted like "$25.00"
  distance?: string;
  estimatedTime?: string;
  tags?: string[];
  isFavorite?: boolean;
  onClick?: () => void;
  onFavoriteToggle?: () => void;
}
```

### 2. **DineInMenuSection**

**Path:** `src/pages/Guests/pages/Home/components/DineInMenuSection.tsx`

Main section component that displays menu items in the Hotel category.

**Features:**

- Fetches menu items using `useRestaurantMenuItems(hotelId)` hook
- Filters only available items
- Groups items by category
- Displays each category with item count
- Horizontal scrolling cards per category
- Loading skeleton states
- Empty state with icon

**Data Flow:**

```
useRestaurantMenuItems(hotelId)
  ↓
filterAvailableMenuItems()
  ↓
groupMenuItemsByCategory()
  ↓
Render ExperienceCard for each item
```

## Integration

### HomePage.tsx

Added the DineInMenuSection to display when the "hotel" category is active:

```typescript
{
  /* Dine In Menu Section - Only visible in Hotel category */
}
{
  activeCategory === "hotel" && <DineInMenuSection hotelId={hotelId} />;
}
```

## Database Schema

Uses the existing `menu_items` table:

```typescript
interface MenuItem {
  id: string;
  hotel_id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  service_type: string[] | null;
  special_type: string[] | null;
  restaurant_ids: string[];
  is_available: boolean;
  image_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}
```

## Hooks Used

- **`useRestaurantMenuItems(hotelId, restaurantId?)`** - Fetches menu items from database
- **`filterAvailableMenuItems(items)`** - Filters only available items
- **`groupMenuItemsByCategory(items)`** - Groups by category

## Styling

- Uses Tailwind CSS utilities
- Horizontal scrolling with `scrollbar-hide` class
- Responsive card sizing: `min-w-[280px]`
- Consistent spacing and padding
- Modern rounded corners and shadows

## User Experience

1. **Category Navigation**: User selects "Hotel" category
2. **Menu Display**: Menu items appear grouped by category (Breakfast, Lunch, Dinner, etc.)
3. **Horizontal Scroll**: Each category has horizontally scrollable cards
4. **Item Selection**: Click on any card to view details (TODO: implement modal)
5. **Visual Feedback**: Hover effects, loading states, and empty states

## Future Enhancements

- [ ] Add item detail modal
- [ ] Implement add to cart functionality
- [ ] Add quantity selector
- [ ] Filter by dietary restrictions
- [ ] Search functionality
- [ ] Sort options (price, popularity, etc.)
- [ ] Favorite items feature
- [ ] Estimated delivery time integration

## Files Modified

1. ✅ Created `src/pages/Guests/components/ExperienceCard/ExperienceCard.tsx`
2. ✅ Created `src/pages/Guests/components/ExperienceCard/index.ts`
3. ✅ Created `src/pages/Guests/pages/Home/components/DineInMenuSection.tsx`
4. ✅ Updated `src/pages/Guests/pages/Home/components/index.ts`
5. ✅ Updated `src/pages/Guests/pages/Home/HomePage.tsx`

## Testing

To test the implementation:

1. Navigate to Guest Dashboard
2. Select "Hotel" category from navigation
3. Scroll to "Dine In Menu" section
4. Verify menu items display by category
5. Test horizontal scrolling
6. Click on cards to verify console logs

## Console Logs

Debug logs available for tracking:

- `🍽️ [DineInMenuSection] Fetched menu items: X`
- `✅ [DineInMenuSection] Available menu items: X`
- `🍽️ [DineInMenuSection] Menu item clicked: ItemName`
