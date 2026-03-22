export type Language = 'tr' | 'en';

export interface Translations {
  // Common
  appName: string;
  version: string;
  save: string;
  cancel: string;
  back: string;

  // Auth
  welcome: string;
  loginSubtitle: string;
  email: string;
  password: string;
  login: string;
  noAccount: string;
  register: string;
  createAccount: string;
  registerSubtitle: string;
  fullName: string;
  confirmPassword: string;
  hasAccount: string;
  passwordMismatch: string;
  enterEmail: string;
  enterPassword: string;
  enterName: string;
  setPassword: string;
  weakPassword: string;

  // Tabs
  home: string;
  scan: string;
  shelves: string;
  items: string;

  // Home
  scanNow: string;
  yourShelves: string;
  add: string;
  noShelvesYet: string;
  createFirstShelf: string;
  createShelf: string;

  // Profile
  profile: string;
  user: string;
  accountSettings: string;
  accountSettingsDesc: string;
  appPreferences: string;
  appPreferencesDesc: string;
  about: string;
  aboutDesc: string;
  logout: string;
  totalShelves: string;
  totalItems: string;

  // Preferences
  language: string;
  languageDesc: string;
  theme: string;
  themeDesc: string;
  notifications: string;
  notificationsDesc: string;
  turkish: string;
  english: string;
  lightTheme: string;
  darkTheme: string;
  systemTheme: string;
  pushNotifications: string;
  pushNotificationsDesc: string;
  notificationPermDenied: string;

  // Shelves
  newShelf: string;
  createNewShelf: string;
  shelfName: string;
  shelfLocation: string;
  allItems: string;

  // Search
  searchPlaceholder: string;
  noResults: string;

  // Items
  addItem: string;
  printQR: string;
  done: string;
}

export const tr: Translations = {
  appName: 'InventQRy',
  version: 'Versiyon',
  save: 'Kaydet',
  cancel: 'İptal',
  back: 'Geri',

  welcome: 'Hoş Geldiniz',
  loginSubtitle: 'Hesabınıza giriş yapın',
  email: 'E-posta',
  password: 'Şifre',
  login: 'Giriş Yap',
  noAccount: 'Hesabınız yok mu?',
  register: 'Kayıt Ol',
  createAccount: 'Hesap Oluştur',
  registerSubtitle: 'Bilgilerinizi girerek kayıt olun',
  fullName: 'Ad Soyad',
  confirmPassword: 'Şifre Tekrar',
  hasAccount: 'Zaten hesabınız var mı?',
  passwordMismatch: 'Şifreler eşleşmiyor.',
  enterEmail: 'Lütfen e-posta adresinizi girin.',
  enterPassword: 'Lütfen şifrenizi girin.',
  enterName: 'Lütfen adınızı ve soyadınızı girin.',
  setPassword: 'Lütfen bir şifre belirleyin.',
  weakPassword: 'Şifre en az 6 karakter olmalıdır.',

  home: 'Ana Sayfa',
  scan: 'Tara',
  shelves: 'Raflar',
  items: 'Ürünler',

  scanNow: 'Şimdi Tara',
  yourShelves: 'Raflarınız',
  add: '+ Ekle',
  noShelvesYet: 'Henüz raf yok',
  createFirstShelf: 'İlk rafınızı oluşturarak düzenlemeye başlayın',
  createShelf: 'Raf Oluştur',

  profile: 'Profil',
  user: 'Kullanıcı',
  accountSettings: 'Hesap Ayarları',
  accountSettingsDesc: 'Profil bilgilerini düzenle',
  appPreferences: 'Uygulama Tercihleri',
  appPreferencesDesc: 'Bildirimler, tema ve dil',
  about: 'Hakkında',
  aboutDesc: 'Sürüm bilgisi ve lisanslar',
  logout: 'Çıkış Yap',
  totalShelves: 'Toplam Raf',
  totalItems: 'Toplam Ürün',

  language: 'Dil',
  languageDesc: 'Uygulama dilini değiştir',
  theme: 'Tema',
  themeDesc: 'Görünüm tercihini ayarla',
  notifications: 'Bildirimler',
  notificationsDesc: 'Bildirim tercihlerini yönet',
  turkish: 'Türkçe',
  english: 'English',
  lightTheme: 'Açık',
  darkTheme: 'Koyu',
  systemTheme: 'Sistem Varsayılanı',
  pushNotifications: 'Anlık Bildirimler',
  pushNotificationsDesc: 'Push bildirimlerini aç veya kapat',
  notificationPermDenied: 'Bildirim izni reddedildi. Ayarlardan izin verin.',

  newShelf: '+ Yeni',
  createNewShelf: 'Yeni Raf Oluştur',
  shelfName: 'Raf Adı',
  shelfLocation: 'Konum',
  allItems: 'Tüm Ürünler',

  searchPlaceholder: 'Ara...',
  noResults: 'Sonuç bulunamadı',

  addItem: 'Ürün Ekle',
  printQR: 'QR Yazdır',
  done: 'Bitti',
};

export const en: Translations = {
  appName: 'InventQRy',
  version: 'Version',
  save: 'Save',
  cancel: 'Cancel',
  back: 'Back',

  welcome: 'Welcome',
  loginSubtitle: 'Sign in to your account',
  email: 'Email',
  password: 'Password',
  login: 'Sign In',
  noAccount: "Don't have an account?",
  register: 'Sign Up',
  createAccount: 'Create Account',
  registerSubtitle: 'Enter your details to sign up',
  fullName: 'Full Name',
  confirmPassword: 'Confirm Password',
  hasAccount: 'Already have an account?',
  passwordMismatch: 'Passwords do not match.',
  enterEmail: 'Please enter your email.',
  enterPassword: 'Please enter your password.',
  enterName: 'Please enter your full name.',
  setPassword: 'Please set a password.',
  weakPassword: 'Password must be at least 6 characters.',

  home: 'Home',
  scan: 'Scan',
  shelves: 'Shelves',
  items: 'Items',

  scanNow: 'Scan Now',
  yourShelves: 'Your Shelves',
  add: '+ Add',
  noShelvesYet: 'No shelves yet',
  createFirstShelf: 'Create your first shelf to start organizing',
  createShelf: 'Create Shelf',

  profile: 'Profile',
  user: 'User',
  accountSettings: 'Account Settings',
  accountSettingsDesc: 'Edit your profile info',
  appPreferences: 'App Preferences',
  appPreferencesDesc: 'Notifications, theme and language',
  about: 'About',
  aboutDesc: 'Version info and licenses',
  logout: 'Log Out',
  totalShelves: 'Total Shelves',
  totalItems: 'Total Items',

  language: 'Language',
  languageDesc: 'Change app language',
  theme: 'Theme',
  themeDesc: 'Set appearance preference',
  notifications: 'Notifications',
  notificationsDesc: 'Manage notification preferences',
  turkish: 'Türkçe',
  english: 'English',
  lightTheme: 'Light',
  darkTheme: 'Dark',
  systemTheme: 'System Default',
  pushNotifications: 'Push Notifications',
  pushNotificationsDesc: 'Enable or disable push notifications',
  notificationPermDenied: 'Notification permission denied. Enable in Settings.',

  newShelf: '+ New',
  createNewShelf: 'Create New Shelf',
  shelfName: 'Shelf Name',
  shelfLocation: 'Location',
  allItems: 'All Items',

  searchPlaceholder: 'Search...',
  noResults: 'No results found',

  addItem: 'Add Item',
  printQR: 'Print QR',
  done: 'Done',
};

export const translations: Record<Language, Translations> = { tr, en };
