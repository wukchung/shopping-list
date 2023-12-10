import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchShoppingLists, updateShoppingList } from '../services/ShoppingListAPI';

const ShoppingListContext = createContext();

const useMockData = true; // Toggle this to switch between mock data and real API

// Mock data for development purposes
const mockShoppingLists = [
  {
    id: 1,
    name: 'Billa',
    items: [
      { id: 1, name: 'Mlíčko', done: false },
      { id: 2, name: 'Chlebík', done: false },
    ],
  },
  {
    id: 2,
    name: 'Obi',
    items: [
      { id: 1, name: 'Hřebíky', done: false },
      { id: 2, name: 'Kladivo', done: true },
    ],
  },
];

export const ShoppingListProvider = ({ children }) => {
  const [shoppingLists, setShoppingLists] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = useMockData ? mockShoppingLists : await fetchShoppingLists();
      setShoppingLists(data);
    };
    fetchData();
  }, [useMockData]);

  const handleUpdateList = async (listId, updatedList) => {
    if (useMockData) {
      // Mock update logic
      const updatedLists = shoppingLists.map(list =>
        list.id === listId ? { ...list, ...updatedList } : list
      );
      setShoppingLists(updatedLists);
    } else {
      // Server update logic
      await updateShoppingList(listId, updatedList);
      // Optionally refetch lists or update locally
      const updatedLists = shoppingLists.map(list =>
        list.id === listId ? { ...list, ...updatedList } : list
      );
      setShoppingLists(updatedLists);
    }
  };

  return (
    <ShoppingListContext.Provider value={{ shoppingLists, setShoppingLists, handleUpdateList }}>
      {children}
    </ShoppingListContext.Provider>
  );
};

export const useShoppingList = () => {
  const context = useContext(ShoppingListContext);
  if (context === undefined) {
    throw new Error('useShoppingList must be used within a ShoppingListProvider');
  }
  return context;
};
