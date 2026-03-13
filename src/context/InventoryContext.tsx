import React, { createContext, useCallback, useMemo, useReducer } from 'react';
import { Item, Shelf } from '../types/inventory';
import { generateId, generateQRValue } from '../utils/qr';

interface InventoryState {
  shelves: Shelf[];
}

interface InventoryContextValue extends InventoryState {
  addShelf: (name: string, location: string) => Shelf;
  removeShelf: (shelfId: string) => void;
  getShelfById: (shelfId: string) => Shelf | undefined;
  getShelfByQR: (qrCode: string) => Shelf | undefined;
  addItemToShelf: (shelfId: string, name: string, description: string) => void;
  removeItemFromShelf: (shelfId: string, itemId: string) => void;
  searchItems: (query: string) => Array<{ item: Item; shelf: Shelf }>;
}

type Action =
  | { type: 'ADD_SHELF'; payload: Shelf }
  | { type: 'REMOVE_SHELF'; payload: string }
  | { type: 'ADD_ITEM'; payload: { shelfId: string; item: Item } }
  | { type: 'REMOVE_ITEM'; payload: { shelfId: string; itemId: string } };

function inventoryReducer(state: InventoryState, action: Action): InventoryState {
  switch (action.type) {
    case 'ADD_SHELF':
      return { ...state, shelves: [...state.shelves, action.payload] };

    case 'REMOVE_SHELF':
      return {
        ...state,
        shelves: state.shelves.filter((s) => s.id !== action.payload),
      };

    case 'ADD_ITEM':
      return {
        ...state,
        shelves: state.shelves.map((s) =>
          s.id === action.payload.shelfId
            ? { ...s, items: [...s.items, action.payload.item] }
            : s
        ),
      };

    case 'REMOVE_ITEM':
      return {
        ...state,
        shelves: state.shelves.map((s) =>
          s.id === action.payload.shelfId
            ? { ...s, items: s.items.filter((i) => i.id !== action.payload.itemId) }
            : s
        ),
      };

    default:
      return state;
  }
}

const initialState: InventoryState = { shelves: [] };

export const InventoryContext = createContext<InventoryContextValue | null>(null);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(inventoryReducer, initialState);

  const addShelf = useCallback((name: string, location: string): Shelf => {
    const id = generateId();
    const shelf: Shelf = {
      id,
      name,
      location,
      items: [],
      dateAdded: new Date().toISOString(),
      qrCode: generateQRValue(id),
    };
    dispatch({ type: 'ADD_SHELF', payload: shelf });
    return shelf;
  }, []);

  const removeShelf = useCallback((shelfId: string) => {
    dispatch({ type: 'REMOVE_SHELF', payload: shelfId });
  }, []);

  const getShelfById = useCallback(
    (shelfId: string) => state.shelves.find((s) => s.id === shelfId),
    [state.shelves]
  );

  const getShelfByQR = useCallback(
    (qrCode: string) => state.shelves.find((s) => s.qrCode === qrCode),
    [state.shelves]
  );

  const addItemToShelf = useCallback((shelfId: string, name: string, description: string) => {
    const item: Item = {
      id: generateId(),
      name,
      description,
      dateAdded: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_ITEM', payload: { shelfId, item } });
  }, []);

  const removeItemFromShelf = useCallback((shelfId: string, itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { shelfId, itemId } });
  }, []);

  const searchItems = useCallback(
    (query: string): Array<{ item: Item; shelf: Shelf }> => {
      const lowerQuery = query.toLowerCase().trim();
      if (!lowerQuery) return [];

      const results: Array<{ item: Item; shelf: Shelf }> = [];
      for (const shelf of state.shelves) {
        for (const item of shelf.items) {
          if (
            item.name.toLowerCase().includes(lowerQuery) ||
            item.description.toLowerCase().includes(lowerQuery)
          ) {
            results.push({ item, shelf });
          }
        }
      }
      return results;
    },
    [state.shelves]
  );

  const value = useMemo<InventoryContextValue>(
    () => ({
      shelves: state.shelves,
      addShelf,
      removeShelf,
      getShelfById,
      getShelfByQR,
      addItemToShelf,
      removeItemFromShelf,
      searchItems,
    }),
    [state.shelves, addShelf, removeShelf, getShelfById, getShelfByQR, addItemToShelf, removeItemFromShelf, searchItems]
  );

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
}
