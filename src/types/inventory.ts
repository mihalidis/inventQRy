export interface Item {
  id: string;
  name: string;
  description: string;
  dateAdded: string;
  image?: string;
}

export interface Shelf {
  id: string;
  name: string;
  location: string;
  items: Item[];
  dateAdded: string;
  qrCode: string;
}

export type RootStackParamList = {
  MainTabs: undefined;
  ShelfDetail: { shelfId: string };
  AddShelf: undefined;
  Search: undefined;
  PrintQR: { shelfId: string };
};

export type BottomTabParamList = {
  Home: undefined;
  Scan: undefined;
  Shelves: undefined;
  Items: undefined;
};
