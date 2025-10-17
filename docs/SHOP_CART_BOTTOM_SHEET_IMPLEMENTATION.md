# Shop Cart Bottom Sheet Implementation

## 📋 Overview

Implemented a reusable bottom sheet cart component for the ShopPage, allowing guests to review products, adjust quantities, select delivery options, and place orders.

**Implementation Date:** October 15, 2025  
**Status:** ✅ Complete (UI & Flow) - TODO: Connect to database mutations

---

## 🗂️ File Structure

```
src/pages/Guests/components/
├── common/
│   └── BottomSheet/
│       ├── BottomSheet.tsx      ✅ Reusable bottom sheet component
│       └── index.ts              ✅ Export file
│
└── ShopCart/
    ├── ShopCartBottomSheet.tsx   ✅ Shop-specific cart implementation
    └── index.ts                   ✅ Export file

src/pages/Guests/pages/Shop/
└── ShopPage.tsx                   ✅ Updated with cart modal integration
```

---

## ✨ Features Implemented

### 1. Reusable BottomSheet Component

**Location:** `src/pages/Guests/components/common/BottomSheet/BottomSheet.tsx`

#### Features:

- ✅ Smooth slide-up animation with backdrop
- ✅ Swipe-to-close gesture support (touch devices)
- ✅ Escape key to close
- ✅ Body scroll lock when open
- ✅ Drag handle indicator
- ✅ Optional title and close button
- ✅ Full height or auto height modes
- ✅ Fully accessible (ARIA attributes)

#### Props:

```typescript
interface BottomSheetProps {
  isOpen: boolean; // Control visibility
  onClose: () => void; // Close handler
  title?: string; // Optional header title
  children: React.ReactNode; // Sheet content
  fullHeight?: boolean; // 90vh or max-85vh
  showCloseButton?: boolean; // X button in header
  className?: string; // Additional styles
}
```

#### Usage Pattern:

```tsx
<BottomSheet
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="My Sheet"
  fullHeight={false}
>
  <div>Content here</div>
</BottomSheet>
```

---

### 2. ShopCartBottomSheet Component

**Location:** `src/pages/Guests/components/ShopCart/ShopCartBottomSheet.tsx`

#### Features:

- ✅ Product cart items display with images
- ✅ Quantity adjustment (+/- buttons)
- ✅ Remove item functionality
- ✅ Real-time total calculation
- ✅ Delivery date picker (min: tomorrow)
- ✅ Optional delivery time picker
- ✅ Special instructions textarea
- ✅ Empty cart state with CTA
- ✅ Checkout button with validation
- ✅ Order confirmation modal
- ✅ Auto-clear cart on success

#### UI States:

**Empty Cart:**

```
┌─────────────────────────────┐
│   [Shopping Bag Icon]      │
│   Your cart is empty        │
│   Add some products...      │
│   [Continue Shopping]       │
└─────────────────────────────┘
```

**Cart with Items:**

```
┌─────────────────────────────┐
│ ─── Shopping Cart           │
├─────────────────────────────┤
│ ┌───┬─────────────┬──────┐ │
│ │img│Product Name │[$50] │ │
│ │   │$25 each     │[X]   │ │
│ │   │[−] 2 [+]    │      │ │
│ └───┴─────────────┴──────┘ │
│                             │
├─────────────────────────────┤
│ 📅 Delivery Date *          │
│ [Date Picker]               │
│                             │
│ 🕐 Delivery Time            │
│ [Time Picker]               │
│                             │
│ Special Instructions        │
│ [Textarea]                  │
├─────────────────────────────┤
│ Total            $100.00    │
│ [Place Order]               │
└─────────────────────────────┘
```

**Confirmation Modal:**

```
┌─────────────────────────────┐
│         ✓                   │
│   Order Placed!             │
│   Your order has been       │
│   submitted successfully    │
└─────────────────────────────┘
```

---

### 3. ShopPage Integration

**Location:** `src/pages/Guests/pages/Shop/ShopPage.tsx`

#### Changes:

```tsx
// Added state for cart modal
const [isCartOpen, setIsCartOpen] = useState(false);

// Connected cart icon click
onCartClick={() => setIsCartOpen(true)}

// Added bottom sheet component
<ShopCartBottomSheet
  isOpen={isCartOpen}
  onClose={() => setIsCartOpen(false)}
  onCheckoutSuccess={() => console.log("Success!")}
/>
```

---

## 🔄 Data Flow

### Current Implementation:

```
User Action → CartContext → BottomSheet UI
    ↓            ↓              ↓
Add to Cart → localStorage → Display Items
    ↓                           ↓
Modify Qty  →  Update State → Real-time Total
    ↓                           ↓
Checkout → TODO: Database → Clear Cart
```

### Cart Context Integration:

```typescript
const {
  items, // All cart items
  updateQuantity, // (id, qty) => void
  removeItem, // (id) => void
  getTotalPriceByType, // ("product") => number
  clearCartByType, // ("product") => void
} = useCart();

// Filter only product items
const productItems = items.filter((item) => item.type === "product");
```

---

## 📊 Database Integration (TODO)

### Required Data Mapping:

**From CartContext → Database:**

```typescript
// Current Cart Item
CartItem {
  id: string;           // → product_id
  name: string;         // Display only
  price: number;        // → price_at_order
  quantity: number;     // → quantity
  image_url?: string;   // Display only
  type: "product";      // Filter criteria
}

// Target Database Structure
ShopOrderCreationData {
  order: {
    hotel_id: string;              // ✅ useGuestHotelId()
    guest_id: string;              // ✅ getGuestSession().guestData.id
    total_price: number;           // ✅ getTotalPriceByType("product")
    delivery_date: string;         // ✅ From date picker
    delivery_time?: string;        // ✅ From time picker (optional)
    special_instructions?: string; // ✅ From textarea (optional)
    status: "pending";             // ✅ Default
  },
  items: [{
    product_id: string;       // ✅ item.id
    quantity: number;         // ✅ item.quantity
    price_at_order: number;   // ✅ item.price
  }]
}
```

### Next Steps for Database Integration:

1. **Create Guest Order Mutation Hook:**

```typescript
// TODO: Create in src/hooks/queries/guests/shop/
export const useCreateGuestShopOrder = () => {
  return useMutation({
    mutationFn: async (data: ShopOrderCreationData) => {
      // 1. Insert into shop_orders
      // 2. Insert into shop_order_items
      // 3. Return order confirmation
    },
    onSuccess: () => {
      // Invalidate order history queries if needed
    },
  });
};
```

2. **Update ShopCartBottomSheet.tsx:**

```typescript
// Replace TODO section (lines 67-89) with:
const createOrderMutation = useCreateGuestShopOrder();

const orderData: ShopOrderCreationData = {
  order: {
    hotel_id: hotelId,
    guest_id: guestId!,
    total_price: totalPrice,
    delivery_date: deliveryDate,
    delivery_time: deliveryTime || null,
    special_instructions: specialInstructions || null,
    status: "pending",
  },
  items: productItems.map((item) => ({
    product_id: item.id,
    quantity: item.quantity,
    price_at_order: item.price,
  })),
};

await createOrderMutation.mutateAsync(orderData);
```

3. **Add Error Handling:**

```typescript
// Show error toast if mutation fails
try {
  await createOrderMutation.mutateAsync(orderData);
} catch (error) {
  toast.error("Failed to place order. Please try again.");
}
```

---

## 🎨 Styling & Animations

### Tailwind Classes Used:

**Bottom Sheet Animation:**

- `transition-transform duration-300 ease-out` - Smooth slide-up
- `fixed bottom-0 left-0 right-0` - Full width at bottom
- `rounded-t-2xl` - Rounded top corners
- `shadow-2xl` - Elevated shadow
- `z-[60]` - **Higher z-index than bottom navigation (z-50) to hide nav when open**

**Z-Index Layers:**

- Bottom Navigation: `z-50`
- Bottom Sheet Backdrop: `z-[60]` (covers navigation)
- Bottom Sheet: `z-[60]` (appears above navigation)

**Confirmation Modal:**

- `animate-scale-in` - Scale from 90% to 100%
- Custom keyframe added to `tailwind.config.js`:

```javascript
keyframes: {
  scaleIn: {
    "0%": { transform: "scale(0.9)", opacity: "0" },
    "100%": { transform: "scale(1)", opacity: "1" },
  },
}
```

**Touch Interactions:**

- Drag handle: `w-12 h-1.5 bg-gray-300 rounded-full`
- Swipe gesture: Transform applied dynamically via JavaScript

---

## 🔒 Validation & Edge Cases

### Form Validation:

- ✅ Delivery date required (minimum: tomorrow)
- ✅ Delivery time optional
- ✅ Special instructions optional
- ✅ Checkout disabled until date selected
- ✅ Checkout disabled if cart empty

### Edge Cases Handled:

- ✅ Empty cart state with CTA
- ✅ Quantity cannot go below 1 (removes item instead)
- ✅ Body scroll locked when modal open
- ✅ Escape key closes modal
- ✅ Backdrop click closes modal
- ✅ Swipe down to close on mobile
- ✅ Auto-close confirmation after 2 seconds

---

## 🧪 Testing Checklist

### UI Tests:

- [ ] Open cart from Shop page
- [ ] Add/remove items from cart
- [ ] Adjust quantities with +/- buttons
- [ ] Verify total updates in real-time
- [ ] Select delivery date (test minimum date)
- [ ] Enter optional delivery time
- [ ] Add special instructions
- [ ] Submit order with valid data
- [ ] Try to submit without required fields
- [ ] View confirmation modal
- [ ] Verify cart clears after order

### Mobile Tests:

- [ ] Swipe down to close cart
- [ ] Tap backdrop to close
- [ ] Verify scroll behavior
- [ ] Test on iOS Safari
- [ ] Test on Android Chrome

### Integration Tests (After DB Connection):

- [ ] Order saves to `shop_orders` table
- [ ] Order items save to `shop_order_items` table
- [ ] Correct hotel_id and guest_id
- [ ] Price snapshot matches cart price
- [ ] Status defaults to "pending"
- [ ] Hotel staff sees order in dashboard

---

## 📱 Responsive Design

### Mobile First Approach:

- Bottom sheet naturally works on mobile
- Touch gestures for swipe-to-close
- Full width on all screen sizes
- Vertical scrolling for long carts
- Large touch targets (44px minimum)

### Desktop Experience:

- Bottom sheet still slides up from bottom
- Max width constrained (future: center modal option)
- Mouse interactions work seamlessly
- Keyboard navigation supported

---

## ♿ Accessibility

### ARIA Attributes:

```tsx
role="dialog"
aria-modal="true"
aria-labelledby="bottom-sheet-title"
aria-label="Close"
```

### Keyboard Support:

- ✅ Escape key closes modal
- ✅ Tab navigation works
- ✅ Focus trapped in modal (TODO: enhance)
- ✅ Screen reader friendly

---

## 🔄 Reusability

### Other Use Cases for BottomSheet:

1. **DineIn Cart** (similar implementation):

```tsx
<DineInCartBottomSheet isOpen={isOpen} onClose={onClose} />
```

2. **Filter Modals** (mobile alternative):

```tsx
<BottomSheet title="Filters" isOpen={isOpen} onClose={onClose}>
  <FilterContent />
</BottomSheet>
```

3. **Tour Booking**:

```tsx
<BottomSheet title="Book Tour" isOpen={isOpen} onClose={onClose}>
  <TourBookingForm />
</BottomSheet>
```

4. **Guest Profile Edit**:

```tsx
<BottomSheet title="Edit Profile" isOpen={isOpen} onClose={onClose}>
  <ProfileForm />
</BottomSheet>
```

---

## 📚 Related Files

### Components:

- `src/contexts/CartContext.tsx` - Cart state management
- `src/pages/Guests/components/cart/AddToCartButton/` - Add to cart UI
- `src/pages/Guests/components/MenuItemCard/` - Product display card

### Database:

- `src/types/supabase.ts` - Table type definitions (lines 1672-1800)
- `src/hooks/queries/hotel-management/shop-orders/` - Order queries (hotel-facing)

### Documentation:

- `SHOP_CART_DATABASE_ANALYSIS.md` - Database structure analysis
- `CART_IMPLEMENTATION.md` - Cart system overview (TODO)

---

## 🚀 Future Enhancements

### Planned Features:

1. **Order History Page** - View past orders
2. **Order Tracking** - Real-time status updates
3. **Edit Order** - Modify pending orders
4. **Delivery Slots** - Time slot selection instead of free text
5. **Estimated Delivery** - Calculate based on hotel schedule
6. **Order Notes** - Save common instructions as presets
7. **Multi-language** - i18n support
8. **Dark Mode** - Theme support

### Technical Improvements:

1. **Focus Trap** - Enhanced keyboard navigation
2. **Loading States** - Skeleton screens while loading
3. **Error Boundaries** - Graceful error handling
4. **Analytics** - Track cart abandonment, conversion rates
5. **A/B Testing** - Test different checkout flows
6. **Performance** - Optimize re-renders with memo

---

## 📝 Notes

- ⚠️ `hotelId` variable shows as unused but will be needed for database mutation
- ⚠️ Fast refresh warning in CartContext is non-blocking
- ✅ CartItem uses `name` and `image_url` properties (not `title`/`imageUrl`)
- ✅ Delivery date minimum is set to tomorrow (not today)
- ✅ Confirmation modal auto-closes after 2 seconds

---

## 👥 Team Communication

**Status:** Ready for review  
**Blockers:** None  
**Next Steps:** Implement database mutation hook for order creation  
**Questions:**

- Should we add order tracking/history now?
- Time slots vs. free text for delivery time?
- Add estimated delivery time calculation?
