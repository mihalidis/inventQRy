import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { Item, Shelf } from '../types/inventory';
import { useAuth } from './AuthContext';
import {
  subscribeToShelves,
  subscribeToItems,
  createShelf as createShelfService,
  deleteShelfWithItems,
  addItem as addItemService,
  deleteItem as deleteItemService,
  searchItemsByName,
  findShelfByQR,
} from '../services/firestore';

interface InventoryContextValue {
  shelves: Shelf[];
  items: Item[];
  loading: boolean;
  addShelf: (name: string, location: string) => Promise<string>;
  removeShelf: (shelfId: string) => Promise<void>;
  getShelfById: (shelfId: string) => Shelf | undefined;
  getShelfByQR: (qrCode: string) => Promise<Shelf | null>;
  getItemsForShelf: (shelfId: string) => Item[];
  addItemToShelf: (shelfId: string, name: string, description: string) => Promise<void>;
  removeItemFromShelf: (shelfId: string, itemId: string) => Promise<void>;
  searchItems: (query: string) => Promise<Array<{ item: Item; shelf: Shelf }>>;
}

export const InventoryContext = createContext<InventoryContextValue | null>(null);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-time listeners
  useEffect(() => {
    if (!user) {
      setShelves([]);
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    let shelvesLoaded = false;
    let itemsLoaded = false;

    const checkLoaded = () => {
      if (shelvesLoaded && itemsLoaded) setLoading(false);
    };

    const unsubShelves = subscribeToShelves(user.uid, (s) => {
      setShelves(s);
      shelvesLoaded = true;
      checkLoaded();
    });

    const unsubItems = subscribeToItems(user.uid, (i) => {
      setItems(i);
      itemsLoaded = true;
      checkLoaded();
    });

    return () => {
      unsubShelves();
      unsubItems();
    };
  }, [user]);

  const addShelf = useCallback(
    async (name: string, location: string): Promise<string> => {
      if (!user) throw new Error('Not authenticated');
      return createShelfService(user.uid, name, location);
    },
    [user]
  );

  const removeShelf = useCallback(
    async (shelfId: string) => {
      if (!user) return;
      await deleteShelfWithItems(user.uid, shelfId);
    },
    [user]
  );

  const getShelfById = useCallback(
    (shelfId: string) => shelves.find((s) => s.id === shelfId),
    [shelves]
  );

  const getShelfByQR = useCallback(
    async (qrCode: string): Promise<Shelf | null> => {
      // First check local state
      const local = shelves.find((s) => s.qrCode === qrCode);
      if (local) return local;
      // Then check Firestore (could be another user's shelf)
      return findShelfByQR(qrCode);
    },
    [shelves]
  );

  const getItemsForShelf = useCallback(
    (shelfId: string) => items.filter((i) => i.shelfId === shelfId),
    [items]
  );

  const addItemToShelf = useCallback(
    async (shelfId: string, name: string, description: string) => {
      if (!user) return;
      await addItemService(user.uid, shelfId, name, description);
    },
    [user]
  );

  const removeItemFromShelf = useCallback(
    async (shelfId: string, itemId: string) => {
      if (!user) return;
      await deleteItemService(shelfId, itemId);
    },
    [user]
  );

  const searchItems = useCallback(
    async (q: string): Promise<Array<{ item: Item; shelf: Shelf }>> => {
      if (!user || !q.trim()) return [];
      const foundItems = await searchItemsByName(user.uid, q);
      return foundItems
        .map((item) => {
          const shelf = shelves.find((s) => s.id === item.shelfId);
          return shelf ? { item, shelf } : null;
        })
        .filter(Boolean) as Array<{ item: Item; shelf: Shelf }>;
    },
    [user, shelves]
  );

  const value = useMemo<InventoryContextValue>(
    () => ({
      shelves,
      items,
      loading,
      addShelf,
      removeShelf,
      getShelfById,
      getShelfByQR,
      getItemsForShelf,
      addItemToShelf,
      removeItemFromShelf,
      searchItems,
    }),
    [shelves, items, loading, addShelf, removeShelf, getShelfById, getShelfByQR, getItemsForShelf, addItemToShelf, removeItemFromShelf, searchItems]
  );

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
}
