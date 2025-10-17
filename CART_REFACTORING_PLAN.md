# Cart System Refactoring Plan

## Overview

Reorganize cart components to eliminate code duplication and create a more maintainable structure by extracting common patterns and components.

## Current Issues

1. **Duplicate Code**: All three cart bottom sheets share similar patterns:
   - Cart item rendering with images and quantity controls
   - Form input components (date, time, text areas)
   - Email notification logic
   - Guest session data extraction
   - Success/error handling
2. **Poor Organization**: Cart-related components scattered across multiple folders

   - `ShopCart/`, `DineInCart/`, `ServicesCart/` each in their own folders
   - Common patterns not extracted
   - No shared utilities

3. **AddToCartButton Complexity**: Single large component handling three different behaviors
   - Service items (simple add/remove)
   - Initial add button (quantity = 0)
   - Quantity controls (quantity > 0)

## Proposed Folder Structure

```
src/pages/Guests/components/cart/
├── index.ts                          # Main exports
├── AddToCartButton/
│   ├── AddToCartButton.tsx           # Main component (refactored)
│   ├── ServiceButton.tsx             # Service-specific button
│   ├── InitialAddButton.tsx          # Initial "+" button
│   ├── QuantityControls.tsx          # +/- quantity controls
│   └── index.ts
├── CartBottomSheets/
│   ├── ShopCartBottomSheet.tsx       # Shop cart (refactored)
│   ├── DineInCartBottomSheet.tsx     # DineIn cart (refactored)
│   ├── ServicesCartBottomSheet.tsx   # Services cart (refactored)
│   └── index.ts
├── shared/                           # NEW: Shared cart components
│   ├── CartItemsList/
│   │   ├── CartItemsList.tsx         # Reusable cart items renderer
│   │   ├── CartItem.tsx              # Individual cart item card
│   │   ├── CartItemImage.tsx         # Item image component
│   │   ├── CartItemInfo.tsx          # Item name, price, description
│   │   └── index.ts
│   ├── CartForm/
│   │   ├── DatePickerField.tsx       # Reusable date picker
│   │   ├── TimePickerField.tsx       # Reusable time picker
│   │   ├── TextAreaField.tsx         # Reusable textarea
│   │   ├── NumberInputField.tsx      # Number of guests input
│   │   └── index.ts
│   ├── CartSummary/
│   │   ├── CartSummary.tsx           # Total price summary
│   │   ├── EmptyCart.tsx             # Empty cart state
│   │   └── index.ts
│   └── index.ts
├── utils/                            # NEW: Cart utilities
│   ├── emailHelpers.ts               # Email notification helpers
│   ├── guestDataExtractors.ts        # Guest session data extraction
│   ├── cartValidation.ts             # Form validation helpers
│   └── index.ts
├── hooks/                            # NEW: Cart-specific hooks
│   ├── useCartCheckout.ts            # Common checkout logic
│   ├── useEmailNotification.ts       # Email sending hook
│   └── index.ts
└── CartBadge/
    └── CartBadge.tsx                 # Existing badge component
```

## Refactoring Steps

### Phase 1: Extract AddToCartButton Sub-components

#### 1.1 Create ServiceButton Component

**File**: `src/pages/Guests/components/cart/AddToCartButton/ServiceButton.tsx`

**Purpose**: Handle service-specific add/remove behavior

- Simple add/remove toggle
- No quantity controls
- Checkmark when added
- Plus icon when not added

**Props**:

```typescript
interface ServiceButtonProps {
  itemId: string;
  quantity: number;
  onAdd: (e: React.MouseEvent) => void;
  onRemove: () => void;
  size: "sm" | "md" | "lg";
  disabled?: boolean;
}
```

#### 1.2 Create InitialAddButton Component

**File**: `src/pages/Guests/components/cart/AddToCartButton/InitialAddButton.tsx`

**Purpose**: Show initial "+" button when quantity is 0

- Circular plus button
- Hover effects
- Size variants

**Props**:

```typescript
interface InitialAddButtonProps {
  onAdd: (e: React.MouseEvent) => void;
  size: "sm" | "md" | "lg";
  disabled?: boolean;
}
```

#### 1.3 Create QuantityControls Component

**File**: `src/pages/Guests/components/cart/AddToCartButton/QuantityControls.tsx`

**Purpose**: Show +/- quantity controls when item is in cart

- Minus button (red)
- Quantity display
- Plus button (purple)

**Props**:

```typescript
interface QuantityControlsProps {
  quantity: number;
  onIncrement: (e: React.MouseEvent) => void;
  onDecrement: (e: React.MouseEvent) => void;
  size: "sm" | "md" | "lg";
  disabled?: boolean;
}
```

#### 1.4 Refactor Main AddToCartButton

**File**: `src/pages/Guests/components/cart/AddToCartButton/AddToCartButton.tsx`

**Changes**:

- Use sub-components instead of inline JSX
- Keep only business logic (cart operations, validation)
- Delegate rendering to sub-components

### Phase 2: Extract Cart Item Rendering Components

#### 2.1 Create CartItem Component

**File**: `src/pages/Guests/components/cart/shared/CartItemsList/CartItem.tsx`

**Purpose**: Single cart item card with image, info, and quantity controls

- Used by all three cart types
- Configurable for products/food/services

**Props**:

```typescript
interface CartItemProps {
  item: CartItem;
  showQuantityControls?: boolean; // false for services
  onQuantityChange?: (itemId: string, newQuantity: number) => void;
  onRemove: (itemId: string) => void;
}
```

**Features**:

- Item image with fallback
- Name, description, price
- Quantity controls (optional)
- Remove button

#### 2.2 Create CartItemsList Component

**File**: `src/pages/Guests/components/cart/shared/CartItemsList/CartItemsList.tsx`

**Purpose**: Render list of cart items

- Scrollable container
- Empty state
- Loading state

**Props**:

```typescript
interface CartItemsListProps {
  items: CartItem[];
  showQuantityControls?: boolean;
  onQuantityChange?: (itemId: string, newQuantity: number) => void;
  onRemove: (itemId: string) => void;
  emptyMessage?: string;
}
```

### Phase 3: Extract Form Components

#### 3.1 Create DatePickerField Component

**File**: `src/pages/Guests/components/cart/shared/CartForm/DatePickerField.tsx`

**Purpose**: Reusable date picker with icon and label

- Calendar icon
- Label
- Required indicator
- Min date validation

**Props**:

```typescript
interface DatePickerFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  minDate?: string;
  disabled?: boolean;
}
```

#### 3.2 Create TimePickerField Component

**File**: `src/pages/Guests/components/cart/shared/CartForm/TimePickerField.tsx`

**Purpose**: Reusable time picker with icon and label

#### 3.3 Create TextAreaField Component

**File**: `src/pages/Guests/components/cart/shared/CartForm/TextAreaField.tsx`

**Purpose**: Reusable textarea for special instructions

#### 3.4 Create NumberInputField Component

**File**: `src/pages/Guests/components/cart/shared/CartForm/NumberInputField.tsx`

**Purpose**: Number input for guests count

### Phase 4: Extract Cart Summary Components

#### 4.1 Create CartSummary Component

**File**: `src/pages/Guests/components/cart/shared/CartSummary/CartSummary.tsx`

**Purpose**: Display total price and item count

- Item count
- Subtotal
- Total price (bold)

**Props**:

```typescript
interface CartSummaryProps {
  itemCount: number;
  totalPrice: number;
  currency?: string;
}
```

#### 4.2 Create EmptyCart Component

**File**: `src/pages/Guests/components/cart/shared/CartSummary/EmptyCart.tsx`

**Purpose**: Empty cart state message

- Icon
- Message
- Call to action

### Phase 5: Create Utility Functions

#### 5.1 Email Helpers

**File**: `src/pages/Guests/components/cart/utils/emailHelpers.ts`

**Functions**:

```typescript
// Extract guest email from session data
export const extractGuestEmail = (guestPersonalData: any): string => {
  return Array.isArray(guestPersonalData)
    ? guestPersonalData[0]?.guest_email || ""
    : guestPersonalData?.guest_email || "";
};

// Build common email data
export const buildBaseEmailData = (session: any) => ({
  guestName: session?.guestData?.guest_name || "Guest",
  guestEmail: extractGuestEmail(session?.guestData?.guest_personal_data),
  roomNumber: session?.guestData?.room_number || "",
  hotelName: session?.hotelData?.name || "Hotel",
});
```

#### 5.2 Guest Data Extractors

**File**: `src/pages/Guests/components/cart/utils/guestDataExtractors.ts`

**Functions**:

```typescript
export const getGuestIdFromSession = (session: any): string | undefined => {
  return session?.guestData?.id;
};

export const getHotelNameFromSession = (session: any): string => {
  return session?.hotelData?.name || "Hotel";
};
```

#### 5.3 Cart Validation

**File**: `src/pages/Guests/components/cart/utils/cartValidation.ts`

**Functions**:

```typescript
export const validateDeliveryDate = (date: string): boolean => {
  if (!date) return false;
  const selectedDate = new Date(date);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return selectedDate >= tomorrow;
};

export const validateRequiredFields = (
  fields: Record<string, any>
): boolean => {
  return Object.values(fields).every(
    (value) => value !== "" && value !== null && value !== undefined
  );
};
```

### Phase 6: Create Custom Hooks

#### 6.1 useCartCheckout Hook

**File**: `src/pages/Guests/components/cart/hooks/useCartCheckout.ts`

**Purpose**: Encapsulate common checkout logic

- Loading state
- Error handling
- Success confirmation
- Form reset

**Usage**:

```typescript
export const useCartCheckout = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeCheckout = async (
    checkoutFn: () => Promise<void>,
    onSuccess?: () => void
  ) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await checkoutFn();
      setShowConfirmation(true);

      setTimeout(() => {
        setShowConfirmation(false);
        onSuccess?.();
      }, 2000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Checkout failed";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    showConfirmation,
    error,
    executeCheckout,
  };
};
```

#### 6.2 useEmailNotification Hook

**File**: `src/pages/Guests/components/cart/hooks/useEmailNotification.ts`

**Purpose**: Handle email notifications with error handling

**Usage**:

```typescript
export const useEmailNotification = () => {
  const sendEmail = async (emailData: OrderEmailData) => {
    try {
      await sendOrderNotificationEmail(emailData);
    } catch (error) {
      console.error("⚠️ Email notification failed:", error);
      // Don't throw - email failure shouldn't block order
    }
  };

  return { sendEmail };
};
```

### Phase 7: Refactor Bottom Sheets

#### 7.1 Refactor ShopCartBottomSheet

**Changes**:

- Use `CartItemsList` component
- Use form field components
- Use `CartSummary` component
- Use `useCartCheckout` hook
- Use `useEmailNotification` hook
- Use utility functions

**Before**: ~350 lines
**After**: ~150 lines (57% reduction)

#### 7.2 Refactor DineInCartBottomSheet

**Changes**:

- Use `CartItemsList` component
- Use form field components
- Use `CartSummary` component
- Use `useCartCheckout` hook
- Use `useEmailNotification` hook
- Use utility functions

**Before**: ~530 lines
**After**: ~200 lines (62% reduction)

#### 7.3 Refactor ServicesCartBottomSheet

**Changes**:

- Use `CartItemsList` component (no quantity controls)
- Use form field components
- Use `CartSummary` component
- Use `useCartCheckout` hook
- Use `useEmailNotification` hook
- Use utility functions

**Before**: ~270 lines
**After**: ~120 lines (56% reduction)

## Benefits of Refactoring

### 1. Code Reusability

- **Form components** can be used across all cart types and other features
- **Cart item rendering** standardized and consistent
- **Utility functions** eliminate duplicate logic

### 2. Maintainability

- **Single source of truth** for common patterns
- **Easier to update**: Change once, applies everywhere
- **Better testing**: Test utilities and components independently

### 3. Reduced Bundle Size

- **~450 lines removed** across all three bottom sheets
- **Smaller component files** easier to understand
- **Tree-shaking friendly**: Import only what's needed

### 4. Consistency

- **Same UI patterns** across all carts
- **Same validation rules** everywhere
- **Same error handling** approach

### 5. Developer Experience

- **Clearer component responsibilities**: Each component does one thing well
- **Better discoverability**: Organized folder structure
- **Easier onboarding**: New developers can find patterns easily

## Implementation Priority

### High Priority (Do First)

1. ✅ **Phase 5**: Create utility functions (quick win, immediate benefit)
2. ✅ **Phase 6**: Create custom hooks (encapsulate complex logic)
3. ✅ **Phase 3**: Extract form components (high reusability)

### Medium Priority (Do Next)

4. ⏳ **Phase 2**: Extract cart item components (large impact)
5. ⏳ **Phase 4**: Extract cart summary components (visual consistency)

### Low Priority (Nice to Have)

6. ⏳ **Phase 1**: Split AddToCartButton (working well, lower urgency)
7. ⏳ **Phase 7**: Refactor bottom sheets (do after extracting reusable parts)

## Migration Strategy

### Step-by-Step Approach

1. **Create new components** without touching existing code
2. **Test new components** in isolation (Storybook or test page)
3. **Refactor one bottom sheet** at a time (start with ShopCart)
4. **Test thoroughly** after each refactor
5. **Repeat for other bottom sheets**
6. **Remove old code** once all migrations complete

### Backward Compatibility

- Keep old components during migration
- New components exported alongside old ones
- Gradual adoption, no breaking changes

## Testing Checklist

After each phase:

- [ ] Components render correctly
- [ ] Cart operations work (add, remove, update)
- [ ] Form validation works
- [ ] Email notifications sent
- [ ] Success modals display
- [ ] Error handling works
- [ ] Mobile responsive
- [ ] No console errors
- [ ] TypeScript types correct

## File Count Comparison

### Before Refactoring

```
cart/
├── AddToCartButton/ (1 file)
├── CartBadge/ (1 file)
├── ShopCart/ (1 file)
├── DineInCart/ (1 file)
└── ServicesCart/ (1 file)
Total: 5 components
```

### After Refactoring

```
cart/
├── AddToCartButton/ (4 files)
├── CartBadge/ (1 file)
├── CartBottomSheets/ (3 files)
├── shared/
│   ├── CartItemsList/ (5 files)
│   ├── CartForm/ (4 files)
│   └── CartSummary/ (2 files)
├── utils/ (3 files)
└── hooks/ (2 files)
Total: 24 components + utilities
```

**Trade-off**: More files but better organization and reusability

## Next Steps

1. Review and approve this plan
2. Start with Phase 5 (utility functions) - quick win
3. Move to Phase 6 (custom hooks) - simplify bottom sheets
4. Then tackle Phase 3 (form components) - high reuse value
5. Continue with remaining phases based on priority

## Questions to Consider

1. Should we create a separate `types.ts` file for shared cart types?
2. Do we want to add Storybook stories for new components?
3. Should we add unit tests for utility functions?
4. Do we need to update documentation as we go?

---

**Status**: 📋 Planning Phase
**Estimated Effort**: 8-12 hours
**Impact**: High (code quality, maintainability, reusability)
