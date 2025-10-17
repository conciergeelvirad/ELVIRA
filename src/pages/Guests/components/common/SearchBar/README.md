# SearchBar Component - Usage Guide

## 📁 Location

`src/pages/Guests/components/common/SearchBar/`

## 🎯 Purpose

Reusable search bar component with optional filter and cart buttons for guest pages.

## ✨ Features

- Search input with icon
- Optional filter button
- Optional cart button (auto-hides when count = 0)
- Cart badge showing item count
- Fully responsive
- Accessible (ARIA labels, keyboard navigation)

---

## 📖 Usage Examples

### Example 1: Full SearchBar (Search + Filter + Cart)

```tsx
import { useState } from "react";
import { SearchBar } from "../components/common";

export const RestaurantMenu = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState([1, 2, 3]); // Mock items
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="p-4 space-y-4">
      <SearchBar
        placeholder="Search menu items..."
        value={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterClick={() => setShowFilters(!showFilters)}
        cartItemCount={cartItems.length}
        onCartClick={() => console.log("Navigate to cart")}
      />

      {/* Your content here */}
    </div>
  );
};
```

### Example 2: Search + Filter Only (No Cart)

```tsx
import { useState } from "react";
import { SearchBar } from "../components/common";

export const ToursPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-4 space-y-4">
      <SearchBar
        placeholder="Search tours..."
        value={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterClick={() => console.log("Show filters")}
      />

      {/* Your content here */}
    </div>
  );
};
```

### Example 3: Search Only

```tsx
import { useState } from "react";
import { SearchBar } from "../components/common";

export const ServicesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-4 space-y-4">
      <SearchBar
        placeholder="Search services..."
        value={searchQuery}
        onSearchChange={setSearchQuery}
        showFilter={false}
      />

      {/* Your content here */}
    </div>
  );
};
```

---

## 🔧 Props

| Prop             | Type                      | Default       | Description                              |
| ---------------- | ------------------------- | ------------- | ---------------------------------------- |
| `placeholder`    | `string`                  | `"Search..."` | Placeholder text for search input        |
| `value`          | `string`                  | **required**  | Current search value                     |
| `onSearchChange` | `(value: string) => void` | **required**  | Callback when search changes             |
| `onFilterClick`  | `() => void`              | `undefined`   | Callback for filter button click         |
| `cartItemCount`  | `number`                  | `0`           | Number of items in cart (0 hides button) |
| `onCartClick`    | `() => void`              | `undefined`   | Callback for cart button click           |
| `showFilter`     | `boolean`                 | `true`        | Show/hide filter button                  |
| `className`      | `string`                  | `""`          | Additional CSS classes                   |

---

## 🎨 Component Variants

### Variant 1: Full (Search + Filter + Cart)

- Use for: Restaurant menu, Shop page
- Props: All props provided

### Variant 2: Search + Filter

- Use for: Tours, Experiences
- Props: Omit `cartItemCount` and `onCartClick`

### Variant 3: Search Only

- Use for: Services, Information pages
- Props: Set `showFilter={false}`

---

## 🚀 Future Enhancements

When needed, we can add:

- Debounced search (delay API calls)
- Clear button (X icon)
- Search suggestions dropdown
- Loading state
- Filter modal/drawer
- Cart preview modal

---

## ✅ Accessibility Features

- ✅ ARIA labels on all buttons
- ✅ Keyboard navigation support
- ✅ Focus indicators
- ✅ Screen reader friendly
- ✅ Proper contrast ratios

---

## 📁 File Structure

```
src/pages/Guests/components/common/
└── SearchBar/
    ├── SearchBar.tsx       # Main component
    ├── types.ts            # TypeScript interfaces
    └── index.ts            # Exports
```

---

## 🎯 Integration Checklist

- [ ] Import SearchBar in your page
- [ ] Add state for search query
- [ ] Add state for cart items (if needed)
- [ ] Connect onSearchChange handler
- [ ] Connect onFilterClick handler (if needed)
- [ ] Connect onCartClick handler (if needed)
- [ ] Test search functionality
- [ ] Test filter button
- [ ] Test cart button and badge

---

Ready to use! 🎉
