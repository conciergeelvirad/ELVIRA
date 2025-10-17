# Restaurant Card Components

Modular components extracted from `RestaurantCard.tsx` to improve maintainability and reusability.

## Overview

The Restaurant Card displays a restaurant's key information in a compact card layout with interactive actions. It has been refactored from **200 lines to 97 lines** (~52% reduction) by extracting focused sub-components.

## Components

### Section Creators

These functions create section objects compatible with GenericCard's sections prop:

#### `createRestaurantRatingSection(rating, reviewCount?)`

- **Purpose**: Creates rating display section with star icon
- **Returns**: Section object with icon and content
- **Usage**:
  ```tsx
  const ratingSection = createRestaurantRatingSection(4.5, 120);
  sections.push(ratingSection);
  ```

#### `createRestaurantAddressSection(address)`

- **Purpose**: Creates address section with MapPin icon
- **Returns**: Section object with icon and formatted address
- **Usage**:
  ```tsx
  const addressSection = createRestaurantAddressSection(restaurant.vicinity);
  sections.push(addressSection);
  ```

#### `createRestaurantCategoriesSection(types, maxDisplay?)`

- **Purpose**: Creates formatted categories display
- **Parameters**:
  - `types`: Array of place type strings
  - `maxDisplay`: Maximum number of types to show (default: 2)
- **Returns**: Section object or null if no displayable types
- **Usage**:
  ```tsx
  const categoriesSection = createRestaurantCategoriesSection(restaurant.types);
  if (categoriesSection) sections.push(categoriesSection);
  ```

### Footer Components

#### `RestaurantStatusBadges`

- **Purpose**: Displays approval status and recommended badges
- **Props**:
  - `currentStatus?`: Current approval status
  - `isRecommended?`: Whether restaurant is recommended
- **Features**:
  - Uses `StatusBadge` from common components
  - Shows amber "Recommended" badge with star icon
  - Soft variant for status display

#### `RestaurantCardActions`

- **Purpose**: Action buttons for restaurant management
- **Props**:
  - `restaurant`: Restaurant object
  - `onView?`: View details handler
  - `onApprove?`: Approve handler
  - `onReject?`: Reject handler
  - `onToggleRecommended?`: Toggle recommendation handler
  - `currentStatus?`: Current approval status
  - `isRecommended?`: Current recommendation status
  - `isLoading?`: Loading state for disabled buttons
- **Features**:
  - Conditional rendering based on status
  - Only shows approve/reject when status allows
  - Only shows recommend toggle for approved restaurants
  - Prevents event propagation on button clicks
  - Disabled state during loading

#### `RestaurantCardFooter`

- **Purpose**: Complete footer combining badges and actions
- **Props**: Combination of StatusBadges and CardActions props
- **Features**:
  - Flexbox layout with status badges on left
  - Action buttons on right
  - Border-top separator
  - Consistent padding and spacing

## Architecture

```
RestaurantCard (97 lines - Main Component)
├── Sections (built from section creators)
│   ├── createRestaurantRatingSection
│   ├── Price Level Badge (inline)
│   ├── createRestaurantAddressSection
│   └── createRestaurantCategoriesSection
└── Footer
    └── RestaurantCardFooter (52 lines)
        ├── RestaurantStatusBadges (44 lines)
        └── RestaurantCardActions (93 lines)
```

## Refactoring Benefits

### Before

- **200 lines**: Single monolithic component
- **Mixed concerns**: Section building and footer logic intermingled
- **Hard to test**: Footer logic embedded in main component
- **Difficult to reuse**: Footer actions couldn't be used elsewhere

### After

- **97 lines**: Clean, focused main component
- **6 modular pieces**: Section creators + footer components
- **Easy to test**: Each component can be tested independently
- **Highly reusable**: Footer components can be used in other contexts
- **Better maintainability**: Changes to footer don't affect section logic

## Usage in RestaurantCard

```tsx
import {
  createRestaurantRatingSection,
  createRestaurantAddressSection,
  createRestaurantCategoriesSection,
  RestaurantCardFooter,
} from "./restaurant-card";

export const RestaurantCard = ({ restaurant, ...props }) => {
  const sections = [];

  // Build sections using creators
  if (restaurant.rating) {
    sections.push(
      createRestaurantRatingSection(
        restaurant.rating,
        restaurant.user_ratings_total
      )
    );
  }

  if (restaurant.vicinity) {
    sections.push(createRestaurantAddressSection(restaurant.vicinity));
  }

  if (restaurant.types) {
    const categoriesSection = createRestaurantCategoriesSection(
      restaurant.types
    );
    if (categoriesSection) sections.push(categoriesSection);
  }

  // Build footer
  const customFooter = (
    <RestaurantCardFooter
      restaurant={restaurant}
      onView={onView}
      onApprove={onApprove}
      onReject={onReject}
      onToggleRecommended={onToggleRecommended}
      currentStatus={currentStatus}
      isRecommended={isRecommended}
      isLoading={isLoading}
    />
  );

  return (
    <GenericCard
      title={restaurant.name}
      sections={sections}
      footer={customFooter}
    />
  );
};
```

## Common Components Used

- **StatusBadge**: Displays approval status with appropriate colors
- **Badge**: Generic badge for categories, price, and recommendations
- **GenericCard**: Base card component for layout

## Dependencies

- `lucide-react`: Icons (Star, MapPin, Eye, Check, X)
- `../../types/approved-third-party-places`: ApprovalStatus type
- `../../services/googlePlaces.service`: Restaurant type
- `../../utils`: badgeHelpers (getBadgeStatusType, formatStatusText)
- `../../common`: StatusBadge, Badge components

## Testing Considerations

Each component can be tested independently:

1. **Section Creators**: Test return objects match GenericCard section structure
2. **RestaurantStatusBadges**: Test badge display logic for different statuses
3. **RestaurantCardActions**: Test button visibility based on status and props
4. **RestaurantCardFooter**: Integration test for badges + actions layout

## Future Enhancements

- Add loading skeleton states
- Support custom action buttons through composition
- Add analytics tracking to action buttons
- Support batch operations on multiple restaurants
