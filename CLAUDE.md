# InventQRy

Expo (React Native) + TypeScript + Firebase (Auth, Firestore) uygulaması. Raflara QR yapıştır, tarayıp içindeki eşyaları yönet.

## Komutlar

- `npm start` — Expo dev server
- `npm run ios` / `npm run android` — simülatörde çalıştır
- `npx tsc --noEmit` — tip kontrolü (test altyapısı henüz yok)
- `eas build --profile production` — mağaza build'i (bkz. `eas.json`)

## Yapı

- `src/screens/` ekranlar, `src/components/` paylaşılan bileşenler
- `src/context/` Auth, Inventory, Theme, Language provider'ları; `src/hooks/useInventory.ts`
- `src/services/firestore.ts` tüm Firestore erişimi burada, ekranlar doğrudan Firestore çağırmaz
- `src/i18n/translations.ts` tüm kullanıcı metinleri
- `src/utils/qr.ts` QR değeri üretme/ayrıştırma (`inventqry://shelf/<id>`)
- `src/services/analytics.ts` Sentry + PostHog; yeni kullanıcı eylemleri `track('<event>')` ile ölçülür, event adı `AnalyticsEvent` tipine eklenir
- Firestore koleksiyonları: `shelves`, `items`; her belge `userId` taşır. Kurallar `firestore.rules`'da; veri modeli değişirse kurallar da güncellenir ve `firebase deploy --only firestore` ile dağıtılır
- Terminoloji kararı: **Eşya** (EN: Item). "Ürün" kullanılmaz.

## Kurallar

- **Sabit metin yok.** Kullanıcının göreceği her metin `translations.ts`'e eklenir (`tr` ve `en` birlikte), ekranda `useLanguage().t` ile okunur. `Alert.alert` başlıkları ve butonları dahil.
- **Sabit renk yok.** `src/constants/theme.ts`'teki `Colors` kullanılmaz; her zaman `useTheme().colors`. Koyu temada kontrol et.
- **Tarih/sayı formatı** `useLanguage().language`'a göre yapılır, `'tr-TR'` sabiti yazılmaz.
- Yer tutuculu metinler için `format(t.key, { name })` kullanılır; string birleştirme yapılmaz.
- QR kodları temadan bağımsız beyaz zemin / siyah desen ile çizilir.
- Sentry native modül içerir: uygulama Expo Go'da değil development build ile çalışır (`npx expo run:ios`).
- Yeni ekran eklerken `RootStackParamList`'i (`src/types/inventory.ts`) ve `AppNavigator.tsx`'i güncelle.
- Her kullanıcıya görünen değişiklik `CHANGELOG.md` → `[Yayımlanmamış]` altına yazılır.
- Tamamlanan yol haritası maddeleri `docs/ROADMAP.md`'de işaretlenir.

## Sürüm çıkarma

`/release` skill'ini kullan. Adımlar `.claude/skills/release/SKILL.md`'de.
