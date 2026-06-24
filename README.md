# KolayTansiyon - Aile Sağlık Asistanı v2.0

[![React](https://img.shields.io/badge/react-18.2.0-blue.svg)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-3.3.0-38B2AC.svg)](https://tailwindcss.com/)
[![Web Speech API](https://img.shields.io/badge/Web_Speech_API-Supported-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

Özellikle yaşlı veya teknolojiyle arası iyi olmayan kullanıcılar ve onların aileleri için tasarlanmış kapsamlı, erişilebilir bir "Çoklu Kullanıcı Destekli (Multi-Tenant) Sağlık Yönetimi" uygulamasıdır.
React ve Tailwind CSS ile geliştirilmiştir.

## 👨‍💻 Geliştirici Bilgileri
* **Adı Soyadı:** Taha Erdoğan
* **Öğrenci Numarası:** 24010501016
* **GitHub Repository:** https://github.com/tahaerdogan-dev/KolayTansiyon

---

## 💻 Kullanılan Teknolojiler / Kütüphaneler
* **React (v18):** Bileşen tabanlı kullanıcı arayüzü ve state (durum) yönetimi (useState, useEffect hook'ları).
* **Tailwind CSS:** Responsive, hızlı ve yüksek kontrastlı modern arayüz tasarımı (CDN entegrasyonu ile).
* **Web Speech API:** Kullanıcının sağlık verilerini sesiyle girmesi (Speech-to-Text) ve alarmların cihaz üzerinden Türkçe sesli okunması (Text-to-Speech).
* **LocalStorage API:** Çoklu kullanıcı profillerinin ve verilerinin hiçbir sunucu gereksinimi olmadan tarayıcı hafızasında kalıcı ve izole olarak saklanması.

---

## 🚀 Yenilikler ve Temel Özellikler v2.0
* **Multi-Tenant (Çoklu Kullanıcı) Mimari:** Tek cihaz üzerinden sınırsız hasta profili oluşturma ve verileri izole etme.
* **Gelişmiş Alarm Motoru:** Kullanıcı "İçtim" diyene kadar her 6 saniyede bir kendini tekrarlayan inatçı ilaç alarmı, kişiselleştirilebilir zaman dilimleri ve "Aç/Tok" karnına tespiti.
* **Randevu Zamanlayıcı:** Geçmiş tarihe alarm kurulmasını engelleyen güvenlik koruması ve bir randevuya özel tarih/saat ile çoklu alarm ekleyebilme.
* **Gece Yarısı Sendromu Çözümü:** Uygulama açık kalsa dahi gece 00:00'ı geçtiğinde yeni günü algılayıp ilaç durumlarını otomatik sıfırlayan akıllı arka plan motoru.

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

## 🛠️ Kurulum Adımları (Detaylı)

Projeyi bilgisayarınızda yerel (localhost) olarak çalıştırmak için aşağıdaki adımları sırasıyla uygulayınız:

**1. Node.js Kurulumu:**
Bilgisayarınızda Node.js yüklü değilse, nodejs.org adresinden LTS (Önerilen) sürümünü indirip kurun.

**2. Proje Dosyalarını Hazırlama:**
Projeyi GitHub üzerinden zip olarak indirin ve arşivden çıkartarak bir klasör haline getirin.

**3. Terminali Açma:**
Zipten çıkardığınız proje klasörünün içine girin (package.json dosyasını gördüğünüz dizin). Klasör penceresinin en üstündeki dosya yolu adres çubuğuna tıklayıp **cmd** yazın ve klavyeden Enter tuşuna basın. Karşınıza siyah komut satırı (Terminal) açılacaktır.

**4. Bağımlılıkları Yükleme:**
Açılan siyah ekranda aşağıdaki komutu yazın ve Enter'a basın:
    
    npm install

*(Bu işlem, projenin çalışması için gereken React modüllerini internetten indirecektir. İnternet hızınıza göre 1-2 dakika sürebilir, işlemin tamamlanmasını bekleyin.)*

---

## 📖 Çalıştırma ve Kullanım Talimatları (Detaylı)

### Uygulamayı Başlatma
Kurulum bittikten sonra aynı siyah komut ekranına (Terminal) aşağıdaki komutu yazın ve Enter'a basın:
    
    npm start

**⚠️ ÖNEMLİ BAŞLATMA NOTLARI:**
* Komutu girdikten sonra terminal ekranında *"We're unable to detect target browsers. Would you like to add the defaults to your package.json? (Y/n)"* şeklinde sarı bir soru çıkabilir. Bu durumda klavyeden **y** tuşuna basıp Enter'a basın.
* Sistem projeyi derleyecektir (ilk açılışta 1 dakika kadar sürebilir). 
* İşlem bittiğinde uygulama varsayılan tarayıcınızda otomatik olarak açılacaktır. Eğer tarayıcınız otomatik olarak açılmazsa, kendiniz Chrome veya Edge tarayıcısını açıp adres çubuğuna **http://localhost:3000** yazarak projeye ulaşabilirsiniz.

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
