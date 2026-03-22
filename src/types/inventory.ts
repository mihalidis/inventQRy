export interface Item {
  id: string;
  shelfId: string;
  userId: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface Shelf {
  id: string;
  userId: string;
  name: string;
  location: string;
  qrCode: string;
  itemCount: number;
  createdAt: string;
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
  Profile: undefined;
  AppPreferences: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Scan: undefined;
  Shelves: undefined;
  Items: undefined;
};
