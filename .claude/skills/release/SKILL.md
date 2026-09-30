---
name: release
description: InventQRy için yeni uygulama sürümü çıkarma. Sürüm numarasını artırır, CHANGELOG'u kapatır, ROADMAP'i günceller, commit ve tag atar. "sürüm çıkar", "release", "versiyon artır", "1.1.0'a geç" gibi isteklerde kullan.
---

# Sürüm çıkarma

Kullanıcı bir sürüm numarası verdiyse onu kullan (`/release 1.1.0`). Vermediyse `CHANGELOG.md`'deki `[Yayımlanmamış]` içeriğine bakıp öner: sadece **Düzeltildi** varsa patch, **Eklendi/Değişti** varsa minor, kırıcı değişiklik veya veri modeli değişimi varsa major. Öneriyi kullanıcıya onaylat, onaysız devam etme.

## Adımlar

1. **Ön kontrol**
   - `git status` temiz olmalı; değilse dur ve kullanıcıya söyle.
   - `npx tsc --noEmit` hatasız geçmeli.
   - `CHANGELOG.md` → `[Yayımlanmamış]` boş olmamalı. Boşsa kullanıcıya sor: git log'dan doldurmak ister mi?

2. **Sürüm numarasını güncelle** (üçü aynı olmalı)
   - `app.json` → `expo.version`
   - `package.json` → `version`
   - `package-lock.json` → üstteki iki `version` alanı (`npm version <x.y.z> --no-git-tag-version` üçünü birden yapar, tercih et)
   - iOS `buildNumber` / Android `versionCode` elle artırılmaz; `eas.json`'da `appVersionSource: remote` ve `autoIncrement: true` ayarlı, EAS halleder.

3. **CHANGELOG'u kapat**
   - `## [Yayımlanmamış]` başlığını `## [x.y.z] — YYYY-AA-GG` yap (bugünün tarihi).
   - Üstüne yeni, boş bir `## [Yayımlanmamış]` ekle.
   - Maddeleri kullanıcı diliyle yaz: "ShelfCard'a useTheme eklendi" değil, "Raf kartları koyu temada doğru görünüyor".

4. **ROADMAP'i güncelle**
   - `docs/ROADMAP.md` üst bilgisindeki "Sürüm:" alanını yeni sürüm yap, "Son güncelleme" tarihini güncelle.
   - Bu sürümde tamamlanan maddelerin kutucuklarını işaretle.

5. **Commit ve tag**
   - Tek commit: `chore(release): vx.y.z`
   - Tag: `git tag -a vx.y.z -m "vx.y.z"`
   - Push'u kullanıcı istemeden yapma; komutları yaz, sor.

6. **Build hatırlatması**
   - Bitirirken kullanıcıya şu komutları ver, çalıştırma:
     ```
     eas build --profile production --platform all
     eas submit --profile production --platform all
     ```
   - Mağaza metinleri değişmesi gerekiyorsa (yeni özellik varsa) "Bu sürümdeki yenilikler" metnini CHANGELOG'dan TR ve EN olarak üret.

## Yapılmayacaklar

- Sürüm numarasını sadece bir dosyada değiştirme.
- CHANGELOG'a teknik commit mesajlarını kopyalama.
- Kullanıcı onayı olmadan push, build veya submit.
