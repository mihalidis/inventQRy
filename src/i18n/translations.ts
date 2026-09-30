export type Language = 'tr' | 'en';

/**
 * `{name}` biçimindeki yer tutucuları değerlerle değiştirir.
 * Örn: format(t.deleteShelfMessage, { name: 'Kitaplık' })
 */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? `{${key}}`));
}

export interface Translations {
  // Ortak
  appName: string;
  version: string;
  save: string;
  cancel: string;
  back: string;
  delete: string;
  remove: string;
  ok: string;
  error: string;
  done: string;
  create: string;
  add: string;
  search: string;

  // Kimlik
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
  forgotPassword: string;
  resetPasswordTitle: string;
  resetPasswordSubtitle: string;
  sendResetLink: string;
  resetEmailSent: string;
  backToLogin: string;

  // Firebase hataları
  errEmailInUse: string;
  errInvalidEmail: string;
  errUserNotFound: string;
  errWrongPassword: string;
  errInvalidCredential: string;
  errTooManyRequests: string;
  errNetwork: string;
  errRequiresRecentLogin: string;
  errGeneric: string;

  // Sekmeler
  home: string;
  scan: string;
  shelves: string;
  items: string;

  // Ana sayfa
  scanNow: string;
  yourShelves: string;
  addShort: string;
  noShelvesYet: string;
  createFirstShelf: string;
  createShelf: string;

  // Raflar
  newShelf: string;
  createNewShelf: string;
  createShelfSubtitle: string;
  shelfName: string;
  shelfNamePlaceholder: string;
  shelfLocation: string;
  shelfLocationPlaceholder: string;
  shelfCreated: string;
  shelfCreatedSubtitle: string; // {name}
  shelfNotFound: string;
  deleteShelfTitle: string;
  deleteShelfMessage: string; // {name}
  itemCount: string; // {count}
  itemsHeader: string; // {count}
  createShelfFailed: string;

  // Raf detayı
  printQR: string;
  addItem: string;
  noItemsOnShelf: string;
  addFirstItem: string;
  removeItemTitle: string;
  removeItemMessage: string;
  addItemFailed: string;

  // Eşya ekleme
  addItemTo: string; // {shelf}
  itemName: string;
  itemNamePlaceholder: string;
  description: string;
  descriptionPlaceholder: string;
  shelfLabel: string; // {name}

  // Eşyalar
  allItems: string;
  noItemsYet: string;
  noItemsYetDesc: string;

  // Arama
  searchPlaceholder: string;
  searchItemsPlaceholder: string;
  searchTitle: string;
  searchHint: string;
  noResults: string;
  noResultsFor: string; // {query}

  // Tarama
  scanTitle: string;
  scanSubtitle: string;
  scanning: string;
  lookingUp: string;
  qrDetected: string;
  requestingCamera: string;
  cameraDenied: string;
  cameraDeniedDesc: string;
  openSettings: string;
  invalidQRTitle: string;
  invalidQRDesc: string;
  qrNotYoursTitle: string;
  qrNotYoursDesc: string;
  lookupFailed: string;
  torch: string;

  // QR yazdır
  qrLabel: string; // {name} {location}
  shareOrSave: string;
  exporting: string;
  exportFailed: string;
  savedTo: string; // {path}

  // Profil
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

  // Hesap ayarları
  displayName: string;
  updateName: string;
  nameUpdated: string;
  dangerZone: string;
  deleteAccount: string;
  deleteAccountDesc: string;
  deleteAccountConfirmTitle: string;
  deleteAccountConfirmMessage: string;
  enterPasswordToConfirm: string;
  deleteAccountButton: string;

  // Hakkında
  aboutAppDesc: string;
  privacyPolicy: string;
  licenses: string;
  madeWith: string;

  // Tercihler
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
}

export const tr: Translations = {
  appName: 'InventQRy',
  version: 'Sürüm',
  save: 'Kaydet',
  cancel: 'İptal',
  back: 'Geri',
  delete: 'Sil',
  remove: 'Kaldır',
  ok: 'Tamam',
  error: 'Hata',
  done: 'Bitti',
  create: 'Oluştur',
  add: 'Ekle',
  search: 'Ara',

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
  forgotPassword: 'Şifremi unuttum',
  resetPasswordTitle: 'Şifre Sıfırlama',
  resetPasswordSubtitle: 'E-posta adresinizi girin, size bir sıfırlama bağlantısı gönderelim.',
  sendResetLink: 'Bağlantı Gönder',
  resetEmailSent: 'Sıfırlama bağlantısı e-posta adresinize gönderildi. Gelen kutunuzu kontrol edin.',
  backToLogin: 'Girişe dön',

  errEmailInUse: 'Bu e-posta adresi zaten kullanılıyor.',
  errInvalidEmail: 'Geçersiz e-posta adresi.',
  errUserNotFound: 'Bu e-posta ile kayıtlı kullanıcı bulunamadı.',
  errWrongPassword: 'Şifre hatalı.',
  errInvalidCredential: 'E-posta veya şifre hatalı.',
  errTooManyRequests: 'Çok fazla deneme yapıldı. Lütfen daha sonra tekrar deneyin.',
  errNetwork: 'Ağ bağlantısı hatası. İnternet bağlantınızı kontrol edin.',
  errRequiresRecentLogin: 'Güvenlik için lütfen çıkış yapıp yeniden giriş yapın.',
  errGeneric: 'Bir hata oluştu. Lütfen tekrar deneyin.',

  home: 'Ana Sayfa',
  scan: 'Tara',
  shelves: 'Raflar',
  items: 'Eşyalar',

  scanNow: 'Şimdi Tara',
  yourShelves: 'Raflarınız',
  addShort: '+ Ekle',
  noShelvesYet: 'Henüz raf yok',
  createFirstShelf: 'İlk rafınızı oluşturarak düzenlemeye başlayın',
  createShelf: 'Raf Oluştur',

  newShelf: 'Yeni',
  createNewShelf: 'Yeni Raf Oluştur',
  createShelfSubtitle: 'Rafınıza bir isim ve konum verin. QR kodu otomatik oluşturulacak.',
  shelfName: 'Raf Adı',
  shelfNamePlaceholder: 'örn: Kitaplık',
  shelfLocation: 'Konum',
  shelfLocationPlaceholder: 'örn: Salon, 2. Kat',
  shelfCreated: 'Raf Başarıyla Eklendi!',
  shelfCreatedSubtitle: '"{name}" rafı oluşturuldu ve QR kodu hazır.',
  shelfNotFound: 'Raf bulunamadı',
  deleteShelfTitle: 'Rafı Sil',
  deleteShelfMessage: '"{name}" rafını ve içindeki tüm eşyaları silmek istediğinize emin misiniz?',
  itemCount: '{count} eşya',
  itemsHeader: 'Eşyalar ({count})',
  createShelfFailed: 'Raf oluşturulamadı. Lütfen tekrar deneyin.',

  printQR: 'QR Yazdır',
  addItem: 'Eşya Ekle',
  noItemsOnShelf: 'Bu rafta henüz eşya yok',
  addFirstItem: 'İlk Eşyayı Ekle',
  removeItemTitle: 'Eşyayı Kaldır',
  removeItemMessage: 'Bu eşyayı raftan kaldırmak istediğinize emin misiniz?',
  addItemFailed: 'Eşya eklenemedi. Lütfen tekrar deneyin.',

  addItemTo: 'Eşya Ekle: {shelf}',
  itemName: 'Eşya Adı',
  itemNamePlaceholder: 'örn: Kış montu',
  description: 'Açıklama',
  descriptionPlaceholder: 'Açıklama (isteğe bağlı)',
  shelfLabel: 'Raf: {name}',

  allItems: 'Tüm Eşyalar',
  noItemsYet: 'Henüz eşya yok',
  noItemsYetDesc: 'Bir raf açıp eşya ekleyerek başlayın',

  searchPlaceholder: 'Ara...',
  searchItemsPlaceholder: 'Eşya ara...',
  searchTitle: 'Eşya ara',
  searchHint: 'Tüm raflarınızda aramak için yazın',
  noResults: 'Sonuç bulunamadı',
  noResultsFor: '"{query}" için eşya bulunamadı',

  scanTitle: 'QR Tara',
  scanSubtitle: 'Kameranızı raf QR koduna doğrultun',
  scanning: 'Taranıyor...',
  lookingUp: 'Aranıyor...',
  qrDetected: 'QR Algılandı!',
  requestingCamera: 'Kamera izni isteniyor...',
  cameraDenied: 'Kamera izni verilmedi',
  cameraDeniedDesc: 'QR taramak için ayarlardan kamera erişimine izin verin.',
  openSettings: 'Ayarları Aç',
  invalidQRTitle: 'Geçersiz QR',
  invalidQRDesc: 'Bu QR kodu bir InventQRy kodu değil.',
  qrNotYoursTitle: 'Raf Bulunamadı',
  qrNotYoursDesc: 'Bu QR size ait bir rafa bağlı değil. Silinmiş olabilir veya başka bir hesaba ait olabilir.',
  lookupFailed: 'QR kodu sorgulanamadı. Bağlantınızı kontrol edin.',
  torch: 'El feneri',

  qrLabel: 'Raf: {name}, {location}',
  shareOrSave: 'Paylaş / Kaydet',
  exporting: 'Hazırlanıyor...',
  exportFailed: 'QR kodu dışa aktarılamadı.',
  savedTo: 'QR kodu kaydedildi: {path}',

  profile: 'Profil',
  user: 'Kullanıcı',
  accountSettings: 'Hesap Ayarları',
  accountSettingsDesc: 'Adını değiştir, hesabını sil',
  appPreferences: 'Uygulama Tercihleri',
  appPreferencesDesc: 'Tema ve dil',
  about: 'Hakkında',
  aboutDesc: 'Sürüm bilgisi ve gizlilik',
  logout: 'Çıkış Yap',
  totalShelves: 'Toplam Raf',
  totalItems: 'Toplam Eşya',

  displayName: 'Görünen Ad',
  updateName: 'Adı Güncelle',
  nameUpdated: 'Adınız güncellendi.',
  dangerZone: 'Tehlikeli Bölge',
  deleteAccount: 'Hesabı Sil',
  deleteAccountDesc: 'Hesabınız, tüm raflarınız ve eşyalarınız kalıcı olarak silinir. Bu işlem geri alınamaz.',
  deleteAccountConfirmTitle: 'Hesabınızı silmek istediğinize emin misiniz?',
  deleteAccountConfirmMessage: 'Tüm verileriniz kalıcı olarak silinecek. Onaylamak için şifrenizi girin.',
  enterPasswordToConfirm: 'Şifreniz',
  deleteAccountButton: 'Hesabımı Kalıcı Olarak Sil',

  aboutAppDesc: 'Raflarınıza QR kod yapıştırın, tarayın ve içindekileri anında görün.',
  privacyPolicy: 'Gizlilik Politikası',
  licenses: 'Açık Kaynak Lisansları',
  madeWith: 'React Native ve Expo ile geliştirildi',

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
};

export const en: Translations = {
  appName: 'InventQRy',
  version: 'Version',
  save: 'Save',
  cancel: 'Cancel',
  back: 'Back',
  delete: 'Delete',
  remove: 'Remove',
  ok: 'OK',
  error: 'Error',
  done: 'Done',
  create: 'Create',
  add: 'Add',
  search: 'Search',

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
  forgotPassword: 'Forgot password?',
  resetPasswordTitle: 'Reset Password',
  resetPasswordSubtitle: "Enter your email and we'll send you a reset link.",
  sendResetLink: 'Send Link',
  resetEmailSent: 'A reset link has been sent to your email. Check your inbox.',
  backToLogin: 'Back to sign in',

  errEmailInUse: 'This email is already in use.',
  errInvalidEmail: 'Invalid email address.',
  errUserNotFound: 'No account found with this email.',
  errWrongPassword: 'Incorrect password.',
  errInvalidCredential: 'Incorrect email or password.',
  errTooManyRequests: 'Too many attempts. Please try again later.',
  errNetwork: 'Network error. Check your internet connection.',
  errRequiresRecentLogin: 'For security, please sign out and sign in again.',
  errGeneric: 'Something went wrong. Please try again.',

  home: 'Home',
  scan: 'Scan',
  shelves: 'Shelves',
  items: 'Items',

  scanNow: 'Scan Now',
  yourShelves: 'Your Shelves',
  addShort: '+ Add',
  noShelvesYet: 'No shelves yet',
  createFirstShelf: 'Create your first shelf to start organizing',
  createShelf: 'Create Shelf',

  newShelf: 'New',
  createNewShelf: 'Create New Shelf',
  createShelfSubtitle: 'Give your shelf a name and location. A QR code will be generated automatically.',
  shelfName: 'Shelf Name',
  shelfNamePlaceholder: 'e.g. Bookcase',
  shelfLocation: 'Location',
  shelfLocationPlaceholder: 'e.g. Living room, 2nd floor',
  shelfCreated: 'Shelf Created!',
  shelfCreatedSubtitle: '"{name}" has been created and its QR code is ready.',
  shelfNotFound: 'Shelf not found',
  deleteShelfTitle: 'Delete Shelf',
  deleteShelfMessage: 'Are you sure you want to delete "{name}" and all items on it?',
  itemCount: '{count} items',
  itemsHeader: 'Items ({count})',
  createShelfFailed: 'Could not create shelf. Please try again.',

  printQR: 'Print QR',
  addItem: 'Add Item',
  noItemsOnShelf: 'No items on this shelf yet',
  addFirstItem: 'Add First Item',
  removeItemTitle: 'Remove Item',
  removeItemMessage: 'Are you sure you want to remove this item from the shelf?',
  addItemFailed: 'Could not add item. Please try again.',

  addItemTo: 'Add Item: {shelf}',
  itemName: 'Item Name',
  itemNamePlaceholder: 'e.g. Winter coat',
  description: 'Description',
  descriptionPlaceholder: 'Description (optional)',
  shelfLabel: 'Shelf: {name}',

  allItems: 'All Items',
  noItemsYet: 'No items yet',
  noItemsYetDesc: 'Open a shelf and add an item to get started',

  searchPlaceholder: 'Search...',
  searchItemsPlaceholder: 'Search for items...',
  searchTitle: 'Search items',
  searchHint: 'Type to search across all your shelves',
  noResults: 'No results found',
  noResultsFor: 'No items found for "{query}"',

  scanTitle: 'Scan QR',
  scanSubtitle: 'Point your camera at a shelf QR code',
  scanning: 'Scanning...',
  lookingUp: 'Looking up...',
  qrDetected: 'QR Detected!',
  requestingCamera: 'Requesting camera permission...',
  cameraDenied: 'Camera permission denied',
  cameraDeniedDesc: 'Allow camera access in Settings to scan QR codes.',
  openSettings: 'Open Settings',
  invalidQRTitle: 'Invalid QR',
  invalidQRDesc: 'This QR code is not an InventQRy code.',
  qrNotYoursTitle: 'Shelf Not Found',
  qrNotYoursDesc: 'This QR is not linked to one of your shelves. It may have been deleted or belong to another account.',
  lookupFailed: 'Could not look up the QR code. Check your connection.',
  torch: 'Flashlight',

  qrLabel: 'Shelf: {name}, {location}',
  shareOrSave: 'Share / Save',
  exporting: 'Preparing...',
  exportFailed: 'Could not export the QR code.',
  savedTo: 'QR code saved to: {path}',

  profile: 'Profile',
  user: 'User',
  accountSettings: 'Account Settings',
  accountSettingsDesc: 'Change your name, delete your account',
  appPreferences: 'App Preferences',
  appPreferencesDesc: 'Theme and language',
  about: 'About',
  aboutDesc: 'Version info and privacy',
  logout: 'Log Out',
  totalShelves: 'Total Shelves',
  totalItems: 'Total Items',

  displayName: 'Display Name',
  updateName: 'Update Name',
  nameUpdated: 'Your name has been updated.',
  dangerZone: 'Danger Zone',
  deleteAccount: 'Delete Account',
  deleteAccountDesc: 'Your account, all shelves and items will be permanently deleted. This cannot be undone.',
  deleteAccountConfirmTitle: 'Are you sure you want to delete your account?',
  deleteAccountConfirmMessage: 'All your data will be permanently deleted. Enter your password to confirm.',
  enterPasswordToConfirm: 'Your password',
  deleteAccountButton: 'Permanently Delete My Account',

  aboutAppDesc: 'Stick QR codes on your shelves, scan them and instantly see what is inside.',
  privacyPolicy: 'Privacy Policy',
  licenses: 'Open Source Licenses',
  madeWith: 'Built with React Native and Expo',

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
};

export const translations: Record<Language, Translations> = { tr, en };

/** Tarih biçimlendirme için dil koduna karşılık gelen locale. */
export const locales: Record<Language, string> = { tr: 'tr-TR', en: 'en-US' };
