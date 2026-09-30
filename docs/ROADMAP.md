# InventQRy — Ürün Analizi ve Yol Haritası

> Son güncelleme: 2026-09-30 · Sürüm: 1.0.0 · Durum: MVP, mağazaya çıkmadı

Bu doküman mevcut uygulamanın ürün/UX gözüyle değerlendirmesini ve fazlara bölünmüş yol haritasını içerir. Maddeler tamamlandıkça kutucukları işaretleyin; sürüm çıkarken tamamlanan maddeleri [CHANGELOG.md](../CHANGELOG.md)'ye taşıyın.

---

## 1. Genel değerlendirme

**Fikir:** Rafa/dolaba QR yapıştır, tarayıp içindekini gör, eşya ekle-çıkar. Net ve değerli bir değer önerisi.

**Mevcut durum:** Temel akış (raf oluştur → QR al → tara → eşya ekle) çalışıyor. Mimari temiz: Context + Firestore realtime dinleyiciler, tema ve dil altyapısı kurulmuş, Firestore çevrimdışı önbelleği açık.

**Ana problem:** Ürün MVP'nin yarısında kalmış. Birçok özellik yarım (koyu tema, dil, bildirim), bazı akışlar kırık (tarama → raf oluştur), ve QR uygulamasının asıl değer önerisi olan "yazdır ve yapıştır" ile "eşyayı taşı" deneyimleri zayıf. `expo-image-picker` ve `expo-image-manipulator` kurulu ama kullanılmıyor; fotoğraf özelliği planlanıp yapılmamış.

**Öncelik ilkesi:** Faz 0 bitmeden yeni özelliğe başlanmaz. İlk açılışta "yarım" hissi veren uygulama, en zor geri kazanılan kullanıcıyı kaybeder.

---

## 2. Tespit edilen sorunlar

### 2.1 Kullanıcıyı doğrudan etkileyen sorunlar

| # | Sorun | Nerede | Etki |
|---|---|---|---|
| 1 | **Her açılışta yeniden giriş.** `getAuth` persistence olmadan kullanılıyor; `AsyncStorage` kurulu ama Auth'a bağlanmamış. | `src/config/firebase.ts` | Kullanıcı kaybettiren en büyük sorun |
| 2 | **Koyu tema yarım.** ShelfDetail, AddShelf, ShelfCreatedQR, PrintQR, Search, Scan izin ekranları, ShelfCard, ItemCard, AddItemModal, SearchBar statik `Colors` kullanıyor. `app.json` → `userInterfaceStyle: "light"` olduğu için "Sistem Varsayılanı" iOS'ta çalışmaz. | İlgili ekranlar, `app.json` | Koyu temada beyaz kartlar, okunmayan yazılar |
| 3 | **Dil desteği yarım ve karışık.** AddShelf Türkçe sabit; ShelfDetail İngilizce sabit ("Print QR", "Add Item", "Remove Item"); AddItemModal karışık ("Eşya Ekle: X" + "Item Name"); Scan/Search tamamen İngilizce; silme uyarıları Türkçe sabit. Terminoloji tutarsız: tab'da "Ürünler", modalda "Eşya". Tarihler her yerde `tr-TR` sabit. | Tüm ekranlar | İngilizce seçen kullanıcı yarı Türkçe uygulama görür |
| 4 | **Tarama → "Raf oluştur" akışı kırık.** Kayıtsız QR taranınca AddShelf açılıyor ama yeni raf yeni ID alıyor; taranan QR asla o rafa bağlanmıyor. | `src/screens/ScanScreen.tsx` | Kullanıcı elindeki etiketi bir daha kullanamaz |
| 5 | **Başkasının rafı taranınca "Shelf not found".** `findShelfByQR` başka kullanıcının rafını bulabiliyor ama ShelfDetail sadece yerel state'e bakıyor. | `InventoryContext.tsx`, `ShelfDetailScreen.tsx` | Anlamsız hata; Firestore kuralları izin veriyorsa gizlilik sorunu |
| 6 | **Ölü menü öğeleri.** Profil'de "Hesap Ayarları" ve "Hakkında" tıklanınca hiçbir şey olmuyor. | `src/screens/ProfileScreen.tsx` | Kırık hissi |
| 7 | **Bildirim anahtarı sahte.** İzin alınıyor, token console'a yazılıyor, hiçbir bildirim gönderilmiyor. | `src/screens/AppPreferencesScreen.tsx` | Kullanıcı bir şey beklerken hiçbir şey olmaz |
| 8 | **Yükleme sırasında boş ekran flaşı.** HomeScreen `loading`'e bakmıyor; veri gelmeden "Henüz raf yok" görünüyor. | `src/screens/HomeScreen.tsx` | Her açılışta titreme |
| 9 | **Raf silme keşfedilemez.** Tek yol long-press, ipucu yok. Eşya silme anında ve geri alınamaz. | `src/components/ShelfCard.tsx` | Yanlışlıkla silme + özelliği bulamama |
| 10 | **Düzenleme yok.** Raf ve eşya alanları değiştirilemiyor; tek yol sil ve yeniden oluştur. | Tüm ekranlar | Temel CRUD eksik |
| 11 | **Arama her tuş vuruşunda sunucuya gidiyor.** Eşyalar zaten `items` state'inde canlı; buna rağmen `getDocs` çağrılıyor, debounce yok. | `src/services/firestore.ts`, `SearchScreen.tsx` | Yavaş arama, gereksiz Firestore okuma maliyeti |
| 12 | **Ürünler tab'ı boşken "Sonuç bulunamadı" diyor.** | `src/screens/ItemsScreen.tsx` | Kafa karıştırıcı |
| 13 | **Kamera arka planda açık kalıyor.** Tara tab'ından çıkınca CameraView çalışmaya devam ediyor. | `src/screens/ScanScreen.tsx` | Pil tüketimi |

### 2.2 Mağazaya çıkmadan önce zorunlu olanlar

- **Hesap silme.** Apple, hesap oluşturan tüm uygulamalarda uygulama içinden hesap silme zorunlu tutuyor. Yok.
- **Şifremi unuttum.** Firebase'de tek satır (`sendPasswordResetEmail`), ekranda yok. Şifresini unutan kullanıcı tamamen kilitlenir.
- **Firestore güvenlik kuralları** repoda yok. "Kim başkasının rafını okuyabilir?" kararı verilip kurala yazılmalı.
- **Gizlilik politikası URL'i** ve kayıt ekranında KVKK / kullanım koşulları onayı.
- Kamera izni reddedildiğinde **"Ayarları Aç"** butonu yok.
- Sürüm numarası Profile'da elle "1.0.0" yazılmış; `expo-constants` ile `app.json`'dan okunmalı.

### 2.3 Ürün / UX gözlemleri

**Bilgi mimarisi.** Ana Sayfa ile Raflar tab'ı neredeyse aynı içeriği gösteriyor. Ana Sayfa'da 160px logo ekranın üçte birini alıyor ve bilgi taşımıyor. Seçenekler: (a) Ana Sayfa'yı kaldırıp 3 tab'a in (Raflar · Tara · Ürünler), (b) gerçek bir panoya çevir: son eklenen eşyalar, hızlı tara, boş raflar, toplam sayılar. Tara tab'ı ortada ve vurgulu olmalı; uygulamanın kalbi o.

**Yazdırma deneyimi zayıf.** QR etiket uygulamasında tek seferde tek QR PNG paylaşılıyor. 15 rafı olan kullanıcı 15 kez tek tek yapmak zorunda. Gerekli: çoklu seçim → A4 ızgara PDF (`expo-print`), etiket boyutu seçimi, QR altında raf adı + konum.

**Eşya modeli çok ince.** Sadece ad + açıklama. İlk istenecekler: fotoğraf, adet, kategori/etiket, son kullanma tarihi (kiler/dolap senaryosu). Son kullanma tarihi bildirimlere gerçek amaç verir.

**"Taşı" akışı yok.** Eşyayı bir raftan başka rafa taşımak için sil + yeniden ekle gerekiyor. Öneri: eşya → "Taşı" → kamera → hedef raf QR'ı taranır → bitti. Uygulamanın en akılda kalıcı hareketi olabilir.

**Tek kullanıcılı.** Ev düzeni hane halkı işi; paylaşılan "ev/alan" kavramı orta vadede en büyük büyüme kaldıracı. Veri modeli `userId` → `spaceId`'ye evrilmeli; Faz 1'de buna hazırlık yapılmalı.

**Onboarding yok.** Yeni kullanıcı "QR'ı nereye yapıştıracağım" bilmiyor. 3 adımlı ilk açılış: Raf oluştur → QR'ı yazdır ve yapıştır → Tara.

**Görsel / erişilebilirlik.** Tüm uygulama monospace font (SometypeMono); başlıklarda karakter veriyor ama uzun Türkçe gövde metinlerde okunabilirliği düşürüyor. Gövde için sans-serif düşünülmeli. İkon butonlarında `accessibilityLabel` yok. Tarayıcıda el feneri yok (karanlık dolap içi asıl senaryo).

**Ölçüm yok.** Analytics ve crash raporlama yok; hangi özelliğin kullanıldığı bilinmiyor.

---

## 3. Yol haritası

### Faz 0 — Stabilizasyon (1–2 hafta) → v1.1.0

Mevcut sürümü "bitmiş" hale getirmek. Yeni özellik yok.

**Kimlik ve veri**
- [x] Auth persistence: `initializeAuth` + `getReactNativePersistence(AsyncStorage)`
- [x] Şifremi unuttum ekranı/akışı (`sendPasswordResetEmail`)
- [x] Hesap silme (Profil → Hesap Ayarları; şifreyle yeniden doğrulama → Firestore verisi → Auth kullanıcısı)
- [x] Firestore güvenlik kurallarını yaz (`firestore.rules`, `firestore.indexes.json`, `firebase.json`) — **dağıtım bekliyor:** `firebase deploy --only firestore`
- [x] Tarama akışını düzelt: yalnızca kendi raflar aranır, bulunamayan QR tek mesajla geçilir (karar #2)

**Tema ve dil**
- [x] Koyu temayı tüm ekran ve bileşenlere yay (`Colors` sabiti kaldırıldı)
- [x] `app.json` → `userInterfaceStyle: "automatic"`
- [x] Tüm sabit metinleri `translations.ts`'e taşı (`format()` yardımcısıyla yer tutucu desteği)
- [x] Terminoloji: "Eşya" (karar #1)
- [x] Tarih formatlarını `language`'a bağla (`locales` haritası)

**Kırık / yarım UX**
- [x] Home'da `loading` kontrolü, boş durum flaşını gider
- [x] Ölü menü öğelerini bağla (Hesap Ayarları ekranı, Hakkında ekranı)
- [x] Bildirim anahtarını gizle (kod ve paket duruyor, Faz 2'de geri gelir)
- [x] Aramayı yerel `items` üzerinden yap; sunucu araması kaldırıldı, raf adında da arar
- [x] Eşyalar tab'ı boş durum metnini düzelt
- [x] Kamera izni reddedilince "Ayarları Aç"
- [x] Tara tab'ı odak dışındayken kamerayı kapat
- [x] Sürüm numarasını `expo-constants` ile oku
- [x] *(Faz 1'den öne alındı)* Tarayıcıda el feneri

**Ölçüm**
- [x] PostHog kurulumu (`src/services/analytics.ts`) — olaylar: signed_up, logged_in, shelf_created, shelf_deleted, item_added, item_removed, qr_scanned, qr_scan_not_found, qr_shared, search_used, account_deleted — **anahtar bekliyor:** `.env` → `EXPO_PUBLIC_POSTHOG_KEY`
- [x] Sentry kurulumu — **DSN bekliyor:** `.env` → `EXPO_PUBLIC_SENTRY_DSN`. Not: Sentry native modül içerir, Expo Go'da çalışmaz; development build gerekir (`npx expo run:ios` veya `eas build --profile development`)

**Faz 0 kapanış için kalan (kod dışı)**
- [x] Firestore kurallarını dağıt (Console üzerinden, 2026-09-30)
- [ ] Dağıtılan kuralları uygulamada test et: raf oluştur → eşya ekle → sil
- [ ] Sentry ve PostHog projelerini aç, anahtarları `.env`'e yaz
- [ ] Development build al, cihazda tüm akışları koyu/açık tema ve TR/EN ile gez
- [ ] Gizlilik politikası URL'i (`EXPO_PUBLIC_PRIVACY_POLICY_URL`) — Faz 3 ile ortak

### Faz 1 — Temel değer önerisini tamamla (3–4 hafta) → v1.2.0

- [ ] Raf düzenleme (ad, konum)
- [ ] Eşya düzenleme (ad, açıklama)
- [ ] Eşya fotoğrafı: kamera/galeri → `image-manipulator` ile küçült → Firebase Storage
- [ ] Adet alanı
- [ ] Kaydırarak sil + "Geri Al" snackbar; long-press yerine görünür "…" menüsü
- [ ] Toplu QR yazdırma: çoklu raf seçimi → A4 ızgara PDF (`expo-print`) → paylaş
- [ ] QR etiketinde raf adı + konum, etiket boyutu seçimi
- [x] Tarayıcıda el feneri *(Faz 0'da yapıldı)*
- [ ] "Taşı" akışı: eşya → hedef raf QR'ını tara
- [ ] Ana Sayfa'yı panoya çevir veya kaldır; Tara'yı ortadaki vurgulu tab yap
- [ ] 3 adımlı onboarding (ilk açılışta, atlanabilir)
- [ ] Gövde fontunu sans-serif'e çevir; başlıklarda mono kalabilir
- [ ] İkon butonlarına `accessibilityLabel`
- [ ] Veri modelinde `spaceId` hazırlığı (şimdilik kullanıcı = tek alan)

### Faz 2 — Büyüme özellikleri (1–2 ay) → v2.0.0

- [ ] Paylaşılan alanlar: "ev" oluştur, davet linki, çok kullanıcı
- [ ] Kategori / etiket
- [ ] Filtre ve sıralama (rafa, tarihe, kategoriye göre)
- [ ] Eşya detay ekranı (büyük fotoğraf, taşınma geçmişi)
- [ ] Son kullanma tarihi + hatırlatma bildirimi (bildirim özelliği burada anlam kazanır)
- [ ] Google / Apple ile giriş
- [ ] QR deep link: uygulama yüklü değilse mağazaya yönlendiren web sayfası

### Faz 3 — Mağaza hazırlığı (Faz 1 ile paralel)

- [ ] Gizlilik politikası sayfası ve URL'i
- [ ] KVKK metni, kayıt ekranında onay kutusu
- [ ] Mağaza ekran görüntüleri ve metinleri (TR + EN)
- [ ] README'deki kırık görsel linkini düzelt, ekran görüntüleri ekle
- [ ] EAS build profillerini gözden geçir, `eas submit` ayarları
- [ ] Temel testler: Firestore servis fonksiyonları, `qr.ts` parse/generate

---

## 4. Başarı metrikleri

| Metrik | Tanım | Neden |
|---|---|---|
| **Aktivasyon** | Kayıt olanların ilk 24 saatte hem raf oluşturup hem QR tarayan yüzdesi | İkisi birden, uygulamayı anladığının kanıtı |
| **Yazdırma oranı** | Raf oluşturanların QR'ı paylaşan/yazdıran yüzdesi | Yazdırmayan kullanıcı uygulamayı fiilen kullanamaz |
| **Haftalık geri dönüş** | 7 gün içinde tekrar açan kullanıcı oranı | Alışkanlık oluşuyor mu |
| **Kullanıcı başına eşya** | Ortalama eşya sayısı | Derinlik / bağlılık |

---

## 5. Kararlar

### Verilen kararlar (2026-09-30)

1. **Terminoloji:** **Eşya** (EN: Item). Tab adı "Eşyalar". "Ürün" hiçbir yerde kullanılmaz.
2. **Başkasının QR'ı:** Kullanıcı yalnızca kendi raflarını okuyabilir; Firestore kuralı bunu zorunlu kılar. Yabancı QR taranınca: "Bu QR size ait bir rafa bağlı değil." Paylaşılan alanlar Faz 2'de bu kararı genişletir.
3. **Ölçüm:** **Sentry** (crash) + **PostHog** (analytics). İkisi de Expo managed workflow ile uyumlu.

### Açık kararlar

4. **Ana Sayfa:** kaldır mı, panoya çevir mi? (Faz 1'den önce)
5. **Fotoğraf depolama:** Firebase Storage önerilir; maliyet onayı gerekiyor. (Faz 1'den önce)
