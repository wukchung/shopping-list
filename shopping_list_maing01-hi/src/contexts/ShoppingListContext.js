import React, { createContext, useState, useContext } from 'react';

// Create a Context for the shopping lists
const ShoppingListContext = createContext();

export const ShoppingListProvider = ({ children }) => {
  const [shoppingLists, setShoppingLists] = useState([
    {
      id: 1,
      name: 'Grocery List',
      items: [
        { id: 1, name: 'Milk', done: false },
        { id: 2, name: 'Bread', done: false },
      ],
    },
    {
      id: 2,
      name: 'OBI',
      items: [
        { id: 1, name: 'Nails', done: false },
        { id: 2, name: 'Hammer', done: true },
      ],
    },
  ]);

  return (
    <ShoppingListContext.Provider value={{ shoppingLists, setShoppingLists }}>
      {children}
    </ShoppingListContext.Provider>
  );
};

// Custom hook to use the shopping list context
export const useShoppingList = () => {
  const context = useContext(ShoppingListContext);
  if (context === undefined) {
    throw new Error('useShoppingList must be used within a ShoppingListProvider');
  }
  return context;
};
