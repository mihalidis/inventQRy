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
} from '../services/firestore';
import { track } from '../services/analytics';

export interface SearchResult {
  item: Item;
  shelf: Shelf;
}

interface InventoryContextValue {
  shelves: Shelf[];
  items: Item[];
  loading: boolean;
  addShelf: (name: string, location: string) => Promise<string>;
  removeShelf: (shelfId: string) => Promise<void>;
  getShelfById: (shelfId: string) => Shelf | undefined;
  /** Yalnızca kullanıcının kendi rafları arasında arar (karar: yabancı raflar görünmez). */
  getShelfByQR: (qrCode: string) => Shelf | undefined;
  getItemsForShelf: (shelfId: string) => Item[];
  addItemToShelf: (shelfId: string, name: string, description: string) => Promise<void>;
  removeItemFromShelf: (shelfId: string, itemId: string) => Promise<void>;
  /** Yerel veri üzerinde ad ve açıklamada arar; sunucuya gitmez. */
  searchItems: (query: string) => SearchResult[];
}

export const InventoryContext = createContext<InventoryContextValue | null>(null);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  // Gerçek zamanlı dinleyiciler
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
      const id = await createShelfService(user.uid, name, location);
      track('shelf_created', { shelf_count: shelves.length + 1 });
      return id;
    },
    [user, shelves.length]
  );

  const removeShelf = useCallback(
    async (shelfId: string) => {
      if (!user) return;
      await deleteShelfWithItems(user.uid, shelfId);
      track('shelf_deleted');
    },
    [user]
  );

  const getShelfById = useCallback(
    (shelfId: string) => shelves.find((s) => s.id === shelfId),
    [shelves]
  );

  const getShelfByQR = useCallback(
    (qrCode: string) => shelves.find((s) => s.qrCode === qrCode),
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
      track('item_added', { has_description: description.length > 0 });
    },
    [user]
  );

  const removeItemFromShelf = useCallback(
    async (shelfId: string, itemId: string) => {
      if (!user) return;
      await deleteItemService(shelfId, itemId);
      track('item_removed');
    },
    [user]
  );

  const searchItems = useCallback(
    (q: string): SearchResult[] => {
      const lower = q.toLowerCase().trim();
      if (!lower) return [];
      const shelfMap = new Map(shelves.map((s) => [s.id, s]));
      const results: SearchResult[] = [];
      for (const item of items) {
        const shelf = shelfMap.get(item.shelfId);
        if (!shelf) continue;
        if (
          item.name.toLowerCase().includes(lower) ||
          item.description.toLowerCase().includes(lower) ||
          shelf.name.toLowerCase().includes(lower)
        ) {
          results.push({ item, shelf });
        }
      }
      return results;
    },
    [items, shelves]
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
