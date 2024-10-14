import React, { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';

// Define the Service type explicitly
export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

// Types
export type CartItemType = Service & { quantity: number };
export type CartState = Record<string, CartItemType>;
export type CartAction = 
  | { type: 'ADD'; item: Service; quantity?: number }
  | { type: 'REMOVE'; itemId: number }
  | { type: 'CLEAR' };

// Context
const CartItemsContext = createContext<CartState>({});
const CartDispatchContext = createContext<Dispatch<CartAction>>(() => {});

// Reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD': {
      const { item, quantity = 1 } = action;
      const existingItem = state[item.id];
      return {
        ...state,
        [item.id]: existingItem
          ? { ...existingItem, quantity: existingItem.quantity + quantity }
          : { ...item, quantity },
      };
    }
    case 'REMOVE': {
      const { [action.itemId]: removedItem, ...rest } = state;
      if (!removedItem) return state;
      return removedItem.quantity > 1
        ? { ...state, [action.itemId]: { ...removedItem, quantity: removedItem.quantity - 1 } }
        : rest;
    }
    case 'CLEAR':
      return {};
    default:
      return state;
  }
};

// Provider
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {});
  return (
    <CartItemsContext.Provider value={state}>
      <CartDispatchContext.Provider value={dispatch}>
        {children}
      </CartDispatchContext.Provider>
    </CartItemsContext.Provider>
  );
};

// Hooks
export const useCart = () => {
  const itemsById = useContext(CartItemsContext);
  const items = Object.values(itemsById);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const subTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { items, itemsById, count, subTotal };
};

export const useCartMutations = () => {
  const dispatch = useContext(CartDispatchContext);
  return {
    addToCart: (service: Service, quantity = 1) => dispatch({ type: 'ADD', item: service, quantity }),
    removeFromCart: (itemId: number) => dispatch({ type: 'REMOVE', itemId }),
    clearCart: () => dispatch({ type: 'CLEAR' }),
  };
};

export default CartProvider;