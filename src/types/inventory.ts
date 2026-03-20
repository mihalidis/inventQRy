export interface Item {
  id: string;
  name: string;
  description: string;
  dateAdded: string;
}

export interface Shelf {
  id: string;
  name: string;
  location: string;
  items: Item[];
  dateAdded: string;
  qrCode: string;
}

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  ShelfDetail: { shelfId: string };
  AddShelf: undefined;
  ShelfCreatedQR: { shelfId: string };
  Search: undefined;
  PrintQR: { shelfId: string };
};

export type BottomTabParamList = {
  Home: undefined;
  Scan: undefined;
  Shelves: undefined;
  Items: undefined;
};
