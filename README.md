# KolayTansiyon - Aile Sağlık Asistanı v2.0

[![React](https://img.shields.io/badge/react-18.2.0-blue.svg)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-3.3.0-38B2AC.svg)](https://tailwindcss.com/)
[![Web Speech API](https://img.shields.io/badge/Web_Speech_API-Supported-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

Özellikle yaşlı veya teknolojiyle arası iyi olmayan kullanıcılar ve onların aileleri için tasarlanmış kapsamlı, erişilebilir bir "Çoklu Kullanıcı Destekli (Multi-Tenant) Sağlık Yönetimi" uygulamasıdır.
React ve Tailwind CSS ile geliştirilmiştir.

## 👨‍💻 Geliştirici Bilgileri
* **Adı Soyadı:** Taha Erdoğan
* **Öğrenci Numarası:** 24010501016
* **GitHub Repository:** https://github.com/tahaerdogan-dev

---

## 🚀 Yenilikler ve Temel Özellikler v2.0

### ✅ Çoklu Kullanıcı Mimarisi (Multi-Tenant)
* Tek cihaz üzerinden sınırsız hasta profili oluşturma.
* Kullanıcı verilerinin (Tansiyon, İlaç, Randevu) LocalStorage üzerinde benzersiz ID'lerle izole edilmesi.
* Uygulama açık kalsa dahi gece 00:00'ı geçtiğinde yeni günü algılayıp ilaç durumlarını otomatik sıfırlayan akıllı motor.

### ✅ Gelişmiş Uyarı ve Alarm Motoru
* **İnatçı İlaç Alarmları:** Kullanıcı onaylayana kadar her 6 saniyede bir sesli uyarıyı tekrarlayan (snooze) mekanizma.
* **Özel Zaman Dilimleri:** Sabah, Öğle, Akşam ve Gece öğünleri için kişiselleştirilebilir saat atamaları.
* **Aç/Tok Tespiti:** İlaca özel kullanım talimatlarının alarm anında dev ekranda gösterilmesi.
* **Çoklu Randevu Alarmları:** Geçmiş tarihe alarm kurulmasını engelleyen güvenlik koruması ve bir randevuya tamamen özel tarih/saat ile sınırsız alarm ekleyebilme.

### ✅ Veri Analizi ve Tıbbi Raporlama
* Tansiyon ve nabız değerlerinin anlık trend analizi.
* Su tüketiminin bardak üzerinden dinamik Litre/Mililitre (ml) dönüşümü.
* Belirlenen tarih aralığında verileri filtreleyip `.txt` formatında rapora dönüştürme ve indirme.

### ✅ Erişilebilirlik (A11y) ve UX
* Web Speech API motoru ile sesli veri girişi ve alarmların yaşlılara uygun yavaşlıkta Türkçe seslendirilmesi.
* Yüksek kontrastlı arayüz, devasa tıklama alanları ve çapraz platform (iOS/Windows) tarih uyumluluğu.

---

## 📁 Proje Klasör Yapısı

```text
KolayTansiyon/
├── public/                      
│   └── index.html               # Uygulamanın ana DOM şablonu
├── src/                         
│   ├── App.js                   # Tüm iş mantığını ve arayüzü barındıran Ana Bileşen
│   └── index.js                 # React DOM entegrasyonu
├── package.json                 # Proje bağımlılıkları ve npm scriptleri
└── README.md              # Proje dokümantasyonu (Bu dosya)
```

---

## 🛠️ Kurulum

### Gereksinimler
* Node.js (v14.0.0 veya üzeri)
* npm (v6.0.0 veya üzeri)

### Kurulum Adımları
1. Proje dosyalarını bilgisayarınıza indirin veya `git clone` ile klonlayın.
2. Terminali açarak projenin kök dizinine gidin.
3. Gerekli kütüphaneleri ve bağımlılıkları yüklemek için aşağıdaki komutu çalıştırın:
   `npm install`

---

## 📖 Çalıştırma ve Kullanım Talimatları

### Geliştirici Ortamını Başlatma
Terminal üzerinde aşağıdaki komutu çalıştırarak projeyi başlatın:
`npm start`
Uygulama otomatik olarak `http://localhost:3000` adresinde açılacaktır. *(Not: Tailwind CSS CDN kullanıldığı için aktif bir internet bağlantısı gerekmektedir).*

### Temel Senaryo
1. Karşılama ekranında hastanın adını girerek sisteme kaydedin.
2. Oluşturduğunuz profile tıklayarak hastanın ana kontrol paneline giriş yapın.
3. Mikrofon ikonlarına tıklayarak veya manuel giriş yaparak tansiyon ve nabız değerlerinizi kaydedin.
4. "İlaçlar" sekmesine giderek "Aç/Tok" bilgisiyle yeni ilaçlar ekleyin.
5. "Profil" sekmesine girerek, eklediğiniz ilaçların saatlerini düzenleyin veya istemediklerinizi kapatın.
6. "Raporlar" sekmesinden doktorunuz için verileri tarih bazında filtreleyip çıktı alın.

---

## 🔒 Güvenlik ve Mimari Yaklaşımlar

* **Veri İzolasyonu:** Hiçbir sunucu bağımlılığı gerektirmeden "Offline-First" (Çevrimdışı Öncelikli) prensibiyle çalışır. Tüm sağlık verileri cihazın LocalStorage hafızasında kişiye özel izole anahtarlarla saklanır.
* **Input Validation (Girdi Doğrulama):** İlaç, randevu ve tarih girişlerinde geçmiş zaman kısıtlamaları uygulanmıştır. Hatalı girişleri ve mantık çökmelerini engellemek için formlar gönderim öncesi denetlenir.

---

## 🐛 Bilinen Sorunlar ve Gelecek Geliştirmeler (TODO)

* [ ] Bulut Senkronizasyonu: Firebase kullanılarak verilerin buluta yedeklenmesi.
* [ ] Gelişmiş Grafikleme: Recharts kütüphanesi entegre edilerek ölçümlerin çizgi grafik (Line Chart) ile görselleştirilmesi.
* [ ] PWA Entegrasyonu: Cihazlara doğrudan native bir uygulama gibi yüklenebilmesi için Service Worker eklenmesi.
* [ ] Doktor Giriş Paneli: Doktorların hastalarının verilerini uzaktan görebileceği ayrı bir yetkilendirme sistemi.

---

## 📝 Kaynakça ve Yararlanılan Bağlantılar

* React State Yönetimi: https://react.dev/learn/managing-state
* Tailwind CSS Dokümantasyonu: https://tailwindcss.com/docs
* Web Speech API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
