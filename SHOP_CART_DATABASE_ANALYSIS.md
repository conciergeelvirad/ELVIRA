# Shop Cart Database Analysis

## Database Structure Overview

### 📊 Table: `shop_orders`

**Purpose:** Main order record for guest product purchases

#### Columns:

| Column                 | Type      | Required | Notes                            |
| ---------------------- | --------- | -------- | -------------------------------- |
| `id`                   | uuid      | Auto     | Primary key                      |
| `hotel_id`             | uuid      | ✅       | FK to hotels                     |
| `guest_id`             | uuid      | ✅       | FK to guests                     |
| `total_price`          | number    | ✅       | Total order amount               |
| `status`               | string    | ✅       | Order status (default set in DB) |
| `delivery_date`        | string    | ✅       | When to deliver                  |
| `delivery_time`        | string    | Optional | Specific delivery time           |
| `special_instructions` | string    | Optional | Guest notes/requests             |
| `processed_by`         | uuid      | Optional | FK to staff member (profiles)    |
| `created_at`           | timestamp | Auto     | When order was created           |
| `updated_at`           | timestamp | Auto     | Last modification time           |

#### Relationships:

- ✅ `guest_id` → `guests.id`
- ✅ `hotel_id` → `hotels.id`
- ✅ `processed_by` → `profiles.id` (staff member)

---

### 📊 Table: `shop_order_items`

**Purpose:** Line items for each product in an order

#### Columns:

| Column           | Type      | Required | Notes                        |
| ---------------- | --------- | -------- | ---------------------------- |
| `id`             | uuid      | Auto     | Primary key                  |
| `order_id`       | uuid      | ✅       | FK to shop_orders            |
| `product_id`     | uuid      | ✅       | FK to products               |
| `quantity`       | number    | ✅       | How many of this product     |
| `price_at_order` | number    | ✅       | Price snapshot at order time |
| `created_at`     | timestamp | Auto     | When item was added          |

#### Relationships:

- ✅ `order_id` → `shop_orders.id`
- ✅ `product_id` → `products.id`

---

### 📊 Table: `products`

**Purpose:** Hotel products available for purchase

#### Key Columns (for cart integration):

| Column               | Type    | Notes                         |
| -------------------- | ------- | ----------------------------- |
| `id`                 | uuid    | Product identifier            |
| `hotel_id`           | uuid    | Which hotel owns this product |
| `name`               | string  | Product name                  |
| `description`        | string  | Product details               |
| `price`              | number  | Current price                 |
| `image_url`          | string  | Product photo                 |
| `category`           | string  | Product category              |
| `is_active`          | boolean | Available for purchase        |
| `stock_quantity`     | number  | Available inventory           |
| `is_unlimited_stock` | boolean | Whether stock is tracked      |
| `hotel_recommended`  | boolean | Featured product              |
| `mini_bar`           | boolean | Mini bar item                 |

---

## 🛠️ What We Have

### ✅ Existing Infrastructure:

1. **Database Tables:**

   - All required tables exist with proper relationships
   - Foreign keys properly configured
   - Timestamps auto-managed

2. **TypeScript Types:**

   - `ShopOrder` - Base order type
   - `ShopOrderItem` - Base order item type
   - `ExtendedShopOrder` - Order with relations (items, products, guest info)
   - `ShopOrderInsert` - Insert type
   - `ShopOrderItemInsert` - Item insert type
   - `ShopOrderUpdate` - Update type
   - `ShopOrderCreationData` - Complete order with items
   - `ShopOrderUpdateData` - Order update payload
   - `ShopOrderStatusUpdateData` - Status change payload
   - `ShopOrderDeletionData` - Delete payload

3. **React Query Hooks (Hotel Management):**

   - `useShopOrders(hotelId)` - Fetch all orders for hotel
   - `useShopOrderById(orderId)` - Fetch single order with details
   - `useCreateShopOrder()` - Create new order mutation
   - `useUpdateShopOrder()` - Update order mutation
   - `useUpdateShopOrderStatus()` - Update status mutation
   - `useDeleteShopOrder()` - Delete order mutation

4. **Cart Context:**
   - `CartContext` with items array
   - `getTotalItemsByType("product")` - Get product count
   - `getTotalPriceByType("product")` - Get product total
   - `getItemsByType("product")` - Get all products
   - `clearCartByType("product")` - Clear product cart
   - Cart items stored in localStorage

---

## 🚀 What We Need for Guest Cart Modal

### Missing Components:

1. **Guest-Specific Query Hooks:**

   - ✅ Already have: Product queries (useProducts)
   - ❌ Need: Guest order creation hook (guest-facing, not hotel management)
   - ❌ Need: Guest order history hook (view their own orders)

2. **Cart Modal Component:**

   - ❌ Need: ShopCartModal.tsx
   - ❌ Need: Cart item list with quantities
   - ❌ Need: Subtotal/total calculation display
   - ❌ Need: Delivery date/time picker
   - ❌ Need: Special instructions textarea
   - ❌ Need: Checkout button

3. **Order Submission Flow:**

   - ❌ Need: Transform CartContext items → ShopOrderCreationData
   - ❌ Need: Submit order to database
   - ❌ Need: Clear cart after successful order
   - ❌ Need: Success confirmation message/modal
   - ❌ Need: Error handling

4. **UI Components:**
   - ❌ Need: Cart item card (product image, name, price, quantity, remove button)
   - ❌ Need: Empty cart state
   - ❌ Need: Checkout form
   - ❌ Need: Order confirmation screen

---

## 📋 Integration Requirements

### Data We Have in CartContext:

```typescript
CartItem {
  id: string;           // product_id
  title: string;        // product name
  price: number;        // current price
  quantity: number;     // how many
  imageUrl?: string;    // product image
  type: "product";      // cart type
  category?: string;    // product category
}
```

### Data We Need to Submit:

```typescript
ShopOrderCreationData {
  order: {
    hotel_id: string;              // ✅ From useGuestHotelId()
    guest_id: string;              // ✅ From guest auth context
    total_price: number;           // ✅ Calculate from cart
    delivery_date: string;         // ❌ User input needed
    delivery_time?: string;        // ❌ User input (optional)
    special_instructions?: string; // ❌ User input (optional)
    status: string;                // ✅ Default "pending"
  },
  items: [{
    product_id: string;       // ✅ cart item.id
    quantity: number;         // ✅ cart item.quantity
    price_at_order: number;   // ✅ cart item.price
  }]
}
```

---

## 🎯 Next Steps

### Tell me what you want to implement:

1. **Cart Modal UI:**

   - Full modal with checkout flow?
   - Simple sidebar cart?
   - Bottom sheet style?

2. **Order Placement:**

   - Should we create guest-specific query hooks?
   - Or use existing hotel management hooks directly?

3. **Delivery Options:**

   - Date picker required?
   - Time slots or free text?
   - Default to "ASAP" option?

4. **Order Confirmation:**

   - Show order details after submission?
   - Redirect to order history page?
   - Toast notification only?

5. **Order History:**
   - Do guests need to see past orders?
   - Should we create a MyOrders page?

---

## 💡 Recommendations

### Suggested Flow:

1. ✅ Guest adds products to cart (already working)
2. ❌ Guest clicks cart icon in ShopPage
3. ❌ Cart modal opens showing all products
4. ❌ Guest can adjust quantities or remove items
5. ❌ Guest fills delivery date/time & special instructions
6. ❌ Guest clicks "Place Order"
7. ❌ System creates order + order items in database
8. ❌ Cart clears, confirmation shown
9. ❌ Hotel staff sees order in their dashboard

### Minimal Required Fields:

- ✅ `hotel_id` - Auto from context
- ✅ `guest_id` - Auto from auth
- ✅ `total_price` - Auto calculate
- ✅ `delivery_date` - Can default to today/tomorrow
- ✅ `status` - Auto set to "pending"
- ✅ Product items from cart

### Optional Enhancements:

- Delivery time picker
- Special instructions
- Order history for guests
- Order tracking/status updates
