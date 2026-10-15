# Bozzkurt AI — ilk prototip

Bu proje Android telefonda Chrome üzerinden açılıp ana ekrana kurulabilen bir **PWA (web uygulaması)** prototipidir.

## Bu sürüm neler yapıyor?
- Fotoğraf seçip ön izleme gösterir. Fotoğraf cihazdan dışarı gönderilmez.
- Dört hazır motosiklet videosu fikri sunar.
- Kendi fikrini yazmana izin verir.
- Video üretim aracına aktarabileceğin ayrıntılı Türkçe komut hazırlar.
- Komutu kopyalar veya `.txt` dosyası olarak indirir.
- Çevrimdışı açılabilmesi için temel dosyaları önbelleğe alır.

## Önemli sınır
Bu sürüm **henüz video dosyası üretmez**. Gerçek video üretimi için bir video modeli çalıştırmak veya bir sağlayıcının API'sini bağlamak gerekir. Ücretsiz, sınırsız ve hızlı video üretimi garanti edilemez. Bu nedenle uygulama var olmayan bir üretimi olmuş gibi göstermiyor ve senden API anahtarı istemiyor.

## Android telefonda deneme
PWA'nın yüklenebilmesi için dosyaları HTTPS üzerinden sunmak gerekir. ZIP'i bilgisayarda açıp bir statik barındırma servisine yükleyebilirsin. İlk test için GitHub Pages gibi statik hosting kullanılabilir.

1. ZIP'i çıkar.
2. Dosyaları bir GitHub deposunun kök dizinine yükle.
3. Depo ayarlarında **Pages** bölümünü açıp ana dal/kök klasörden yayınla.
4. Yayınlanan HTTPS adresini Android telefonda Chrome ile aç.
5. Chrome menüsünden **Ana ekrana ekle** veya **Uygulamayı yükle** seçeneğini seç.

Sadece `index.html` dosyasına dokunarak açmak, PWA yükleme ve çevrimdışı özelliklerini her zaman etkinleştirmez.

## Yerel bilgisayarda hızlı test
Python kuruluysa proje klasöründe terminal açıp çalıştır:

```bash
python -m http.server 8000
```

Aynı bilgisayarda `http://localhost:8000` adresini aç. Telefonla aynı Wi-Fi üzerinden test etmek için bilgisayarın yerel IP adresini kullanman ve güvenlik duvarında izin vermen gerekir.

## Sonraki teknik aşama: gerçek video üretimi
Önerilen mimari:
- Android/PWA arayüzü
- Sunucu tarafında küçük bir API
- Ücretsiz kota veya açık kaynak model destekleyen bir video üretim sağlayıcısı
- İş durumunu sorgulama, hata yönetimi ve video dosyası indirme

API anahtarını asla `app.js` içine yazma. Anahtar sunucuda gizli ortam değişkeni olarak tutulmalı. Bir servis seçmeden önce fiyat, ücretsiz kota, fotoğraf saklama politikası ve kullanım koşulları kontrol edilmelidir.

## Proje dosyaları
- `index.html` — uygulama ekranı
- `styles.css` — tasarım
- `app.js` — fikir seçimi, fotoğraf ön izlemesi ve prompt oluşturma
- `manifest.webmanifest` — yüklenebilir uygulama bilgileri
- `sw.js` — temel çevrimdışı önbellek
- `icons/icon.svg` — uygulama simgesi
