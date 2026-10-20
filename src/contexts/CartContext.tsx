
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

export type CartItemType = "menu" | "special" | "product";

export interface CartItem {
  id: string;
  name: string;
  chef: string;
  price: number;
  quantity: number;
  image: string;

  // Item category
  type?: CartItemType;

  // Actual backend database IDs
  menu_id?: string | null;
  special_id?: string | null;
  product_id?: string | null;

  // Menu-specific details
  meal_type?: string | null;
  menu_date?: string | null;
}

type NewCartItem = Omit<CartItem, "quantity">;

interface CartContextType {
  items: CartItem[];
  addItem: (item: NewCartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  showToast: (message: string) => void;
  toastMessage: string | null;
}

const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(
    null
  );

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showToast = (message: string): void => {
    if (toastTimerRef.current !== null) {
      clearTimeout(toastTimerRef.current);
    }

    setToastMessage(message);

    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, 3000);
  };

  const addItem = (item: NewCartItem): void => {
    setItems((prevItems: CartItem[]): CartItem[] => {
      const existingItem = prevItems.find(
        (cartItem: CartItem) => cartItem.id === item.id
      );

      if (existingItem) {
        showToast(`${item.name} quantity updated in cart`);

        return prevItems.map((cartItem: CartItem): CartItem =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                quantity: cartItem.quantity + 1,
              }
            : cartItem
        );
      }

      showToast(`${item.name} added to cart`);

      return [
        ...prevItems,
        {
          ...item,
          quantity: 1,
        },
      ];
    });
  };

  const removeItem = (id: string): void => {
    setItems((prevItems: CartItem[]): CartItem[] =>
      prevItems.filter((item: CartItem) => item.id !== id)
    );

    showToast("Item removed from cart");
  };

  const updateQuantity = (id: string, quantity: number): void => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems((prevItems: CartItem[]): CartItem[] =>
      prevItems.map((item: CartItem): CartItem =>
        item.id === id
          ? {
              ...item,
              quantity,
            }
          : item
      )
    );
  };

  const clearCart = (): void => {
    setItems([]);
  };

  const getTotalItems = (): number => {
    return items.reduce(
      (total: number, item: CartItem) => total + item.quantity,
      0
    );
  };

  const getSubtotal = (): number => {
    return items.reduce(
      (total: number, item: CartItem) =>
        total + item.price * item.quantity,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getSubtotal,
        showToast,
        toastMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error(
      "useCart must be used within a CartProvider"
    );
  }

  return context;
}
