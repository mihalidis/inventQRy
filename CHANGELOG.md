# Changelog

Bu projedeki tüm önemli değişiklikler bu dosyada tutulur.

Biçim [Keep a Changelog](https://keepachangelog.com/tr/1.1.0/) standardına, sürümleme [Semantic Versioning](https://semver.org/lang/tr/) kurallarına uyar.

Kategoriler: **Eklendi** (yeni özellik), **Değişti** (mevcut davranışta değişiklik), **Düzeltildi** (hata düzeltmesi), **Kaldırıldı**, **Güvenlik**.

Geliştirme sırasında her değişiklik `[Yayımlanmamış]` başlığı altına yazılır. Sürüm çıkarken bu başlık sürüm numarası ve tarihle değiştirilir, üste yeni boş bir `[Yayımlanmamış]` açılır. Yol haritası için bkz. [docs/ROADMAP.md](docs/ROADMAP.md).

## [Yayımlanmamış]

### Eklendi
- Şifremi unuttum: giriş ekranından e-postayla sıfırlama bağlantısı gönderme
- Hesap Ayarları ekranı: görünen adı değiştirme ve hesabı kalıcı olarak silme (tüm raf ve eşyalarla birlikte)
- Hakkında ekranı: sürüm bilgisi ve gizlilik politikası bağlantısı
- Tarayıcıda el feneri düğmesi
- Kamera izni verilmediğinde "Ayarları Aç" düğmesi
- Arama artık raf adında da eşleşiyor
- Firestore güvenlik kuralları ve indeksler repoya eklendi (`firestore.rules`)
- Ölçüm altyapısı: Sentry (hata raporlama) ve PostHog (kullanım olayları); anahtarlar `.env` ile verilir
- Ürün analizi ve yol haritası dokümanı (`docs/ROADMAP.md`)
- Bu changelog

### Değiştirildi
- Terminoloji tekilleştirildi: her yerde "Eşya" (sekme adı "Ürünler" → "Eşyalar")
- Arama sunucuya gitmiyor, cihazdaki veri üzerinde anında çalışıyor
- Raf oluşturulduktan sonraki ekrana "QR Yazdır" kısayolu eklendi
- QR kodları her temada beyaz zeminde gösteriliyor (yazdırma ve tarama güvenilirliği için)
- Bildirim ayarı, gerçek bir bildirim özelliği gelene kadar kaldırıldı

### Düzeltildi
- Uygulama kapanıp açılınca oturum kaybolmuyor, yeniden giriş gerekmiyor
- Koyu tema tüm ekranlarda çalışıyor (raf detayı, raf ekleme, QR, arama, tarama, kartlar, eşya ekleme)
- "Sistem Varsayılanı" tema seçeneği artık cihaz ayarını takip ediyor
- İngilizce seçildiğinde Türkçe kalan metinler ve Türkçe seçildiğinde İngilizce kalan metinler düzeltildi
- Tarihler seçili dile göre biçimleniyor
- Açılışta veri yüklenirken "Henüz raf yok" görünüp kaybolması düzeltildi
- Profil'deki "Hesap Ayarları" ve "Hakkında" artık çalışıyor
- Başkasına ait veya silinmiş bir QR taranınca anlaşılır bir mesaj gösteriliyor
- Tara sekmesinden çıkınca kamera kapanıyor
- Eşyalar sekmesi boşken yanlış "Sonuç bulunamadı" metni düzeltildi
- Sürüm numarası `app.json`'dan okunuyor

## [1.0.0] — 2026-09-30

İlk sürüm.

### Eklendi
- Firebase e-posta/şifre ile giriş ve kayıt
- Raf oluşturma; her raf için otomatik QR kodu (`inventqry://shelf/<id>`)
- QR tarama ile rafa ulaşma
- Rafa eşya ekleme / silme, tüm eşyaları listeleme
- Eşya arama
- QR kodunu PNG olarak paylaşma / kaydetme
- Profil ekranı, toplam raf / eşya sayıları
- Açık / koyu / sistem teması (kısmi)
- Türkçe / İngilizce dil desteği (kısmi)
- Firestore çevrimdışı önbelleği
