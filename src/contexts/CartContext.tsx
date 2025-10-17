/**
 * Cart Context
 *
 * Global cart state management for Dine-In and Shop items
 * Provides cart operations: add, remove, update quantity, clear
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string | null;
  type: "food" | "product" | "service";
  description?: string | null;
  category?: string;
  serviceType?: "restaurant_booking" | "room_service"; // Only for food items
  restaurantId?: string; // Restaurant ID for food items
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  clearCartByType: (type: "food" | "product" | "service") => void;
  getItemQuantity: (id: string) => number;
  getTotalItems: () => number;
  getTotalItemsByType: (type: "food" | "product" | "service") => number;
  getTotalPrice: () => number;
  getTotalPriceByType: (type: "food" | "product" | "service") => number;
  isCartEmpty: () => boolean;
  getItemsByType: (type: "food" | "product" | "service") => CartItem[];
  canAddFoodItem: (serviceType: "restaurant_booking" | "room_service") => {
    canAdd: boolean;
    existingServiceType?: "restaurant_booking" | "room_service";
  };
  getFoodServiceType: () => "restaurant_booking" | "room_service" | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("hotelCart");
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("hotelCart", JSON.stringify(items));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [items]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existingItem = prev.find((i) => i.id === item.id);
      if (existingItem) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(id);
        return;
      }
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const clearCartByType = useCallback((type: "food" | "product") => {
    setItems((prev) => prev.filter((item) => item.type !== type));
  }, []);

  const getItemQuantity = useCallback(
    (id: string): number => {
      const item = items.find((i) => i.id === id);
      return item?.quantity || 0;
    },
    [items]
  );

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const getTotalItemsByType = useCallback(
    (type: "food" | "product") => {
      return items
        .filter((item) => item.type === type)
        .reduce((total, item) => total + item.quantity, 0);
    },
    [items]
  );

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  const getTotalPriceByType = useCallback(
    (type: "food" | "product") => {
      return items
        .filter((item) => item.type === type)
        .reduce((total, item) => total + item.price * item.quantity, 0);
    },
    [items]
  );

  const getItemsByType = useCallback(
    (type: "food" | "product") => {
      return items.filter((item) => item.type === type);
    },
    [items]
  );

  const isCartEmpty = useCallback(() => {
    return items.length === 0;
  }, [items]);

  /**
   * Check if a food item with the given service type can be added to cart
   * Returns false if cart already has food items with a different service type
   */
  const canAddFoodItem = useCallback(
    (serviceType: "restaurant_booking" | "room_service") => {
      const foodItems = items.filter((item) => item.type === "food");

      if (foodItems.length === 0) {
        return { canAdd: true };
      }

      const existingServiceType = foodItems[0].serviceType;

      if (!existingServiceType) {
        return { canAdd: true };
      }

      return {
        canAdd: existingServiceType === serviceType,
        existingServiceType,
      };
    },
    [items]
  );

  /**
   * Get the current service type of food items in cart
   * Returns null if no food items in cart
   */
  const getFoodServiceType = useCallback(() => {
    const foodItems = items.filter((item) => item.type === "food");

    if (foodItems.length === 0) {
      return null;
    }

    return foodItems[0].serviceType || null;
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        clearCartByType,
        getItemQuantity,
        getTotalItems,
        getTotalItemsByType,
        getTotalPrice,
        getTotalPriceByType,
        getItemsByType,
        isCartEmpty,
        canAddFoodItem,
        getFoodServiceType,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
