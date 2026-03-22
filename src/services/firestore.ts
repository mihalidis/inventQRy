import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  writeBatch,
  serverTimestamp,
  orderBy,
  increment,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Shelf, Item } from '../types/inventory';
import { generateQRValue } from '../utils/qr';

// ─── Shelf Operations ───

export async function createShelf(
  userId: string,
  name: string,
  location: string
): Promise<string> {
  const docRef = await addDoc(collection(db, 'shelves'), {
    userId,
    name,
    location,
    qrCode: '', // will be set after we know the ID
    itemCount: 0,
    createdAt: serverTimestamp(),
  });

  // Update qrCode with the generated doc ID
  const batch = writeBatch(db);
  batch.update(docRef, { qrCode: generateQRValue(docRef.id) });
  await batch.commit();

  return docRef.id;
}

export async function deleteShelfWithItems(
  userId: string,
  shelfId: string
): Promise<void> {
  const batch = writeBatch(db);

  // Delete all items belonging to this shelf
  const itemsQuery = query(
    collection(db, 'items'),
    where('shelfId', '==', shelfId),
    where('userId', '==', userId)
  );
  const itemsSnap = await getDocs(itemsQuery);
  itemsSnap.forEach((d) => batch.delete(d.ref));

  // Delete the shelf
  batch.delete(doc(db, 'shelves', shelfId));
  await batch.commit();

}

export function subscribeToShelves(
  userId: string,
  callback: (shelves: Shelf[]) => void
): Unsubscribe {
  const q = query(
    collection(db, 'shelves'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const shelves: Shelf[] = snapshot.docs.map((d) => ({
      id: d.id,
      userId: d.data().userId,
      name: d.data().name,
      location: d.data().location,
      qrCode: d.data().qrCode || '',
      itemCount: d.data().itemCount || 0,
      createdAt: d.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    }));
    callback(shelves);
  });
}

// ─── Item Operations ───

export async function addItem(
  userId: string,
  shelfId: string,
  name: string,
  description: string
): Promise<string> {
  const docRef = await addDoc(collection(db, 'items'), {
    userId,
    shelfId,
    name,
    description,
    createdAt: serverTimestamp(),
  });

  const shelfRef = doc(db, 'shelves', shelfId);
  const batch = writeBatch(db);
  batch.update(shelfRef, { itemCount: increment(1) });
  await batch.commit();

  return docRef.id;
}

export async function deleteItem(
  shelfId: string,
  itemId: string
): Promise<void> {
  const batch = writeBatch(db);
  batch.delete(doc(db, 'items', itemId));
  batch.update(doc(db, 'shelves', shelfId), { itemCount: increment(-1) });
  await batch.commit();
}

export function subscribeToItems(
  userId: string,
  callback: (items: Item[]) => void,
  shelfId?: string
): Unsubscribe {
  const constraints = [
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  ];
  if (shelfId) {
    constraints.push(where('shelfId', '==', shelfId));
  }

  const q = query(collection(db, 'items'), ...constraints);

  return onSnapshot(q, (snapshot) => {
    const items: Item[] = snapshot.docs.map((d) => ({
      id: d.id,
      shelfId: d.data().shelfId,
      userId: d.data().userId,
      name: d.data().name,
      description: d.data().description || '',
      createdAt: d.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    }));
    callback(items);
  });
}

// ─── Search ───

export async function searchItemsByName(
  userId: string,
  searchQuery: string
): Promise<Item[]> {
  // Firestore doesn't support full-text search, so we fetch all user items
  // and filter client-side (fine for moderate datasets)
  const q = query(
    collection(db, 'items'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  const lower = searchQuery.toLowerCase().trim();
  if (!lower) return [];

  return snapshot.docs
    .map((d) => ({
      id: d.id,
      shelfId: d.data().shelfId,
      userId: d.data().userId,
      name: d.data().name,
      description: d.data().description || '',
      createdAt: d.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    }))
    .filter(
      (item) =>
        item.name.toLowerCase().includes(lower) ||
        item.description.toLowerCase().includes(lower)
    );
}

// ─── QR Lookup ───

export async function findShelfByQR(qrCode: string): Promise<Shelf | null> {
  const q = query(collection(db, 'shelves'), where('qrCode', '==', qrCode));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const d = snapshot.docs[0];
  return {
    id: d.id,
    userId: d.data().userId,
    name: d.data().name,
    location: d.data().location,
    qrCode: d.data().qrCode,
    itemCount: d.data().itemCount || 0,
    createdAt: d.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  };
}

