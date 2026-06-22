import React, { useState, useEffect } from 'react';

// ==========================================
// ANA YÖNETİCİ BİLEŞEN: KİŞİ (AİLE) SEÇİM EKRANI
// ==========================================
export default function MainApp() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.tailwindcss.com';
    document.head.appendChild(script);
  }, []);

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('kt_Ailesi');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeUserId, setActiveUserId] = useState(null);
  const [newUserName, setNewUserName] = useState('');

  useEffect(() => {
    localStorage.setItem('kt_Ailesi', JSON.stringify(users));
  }, [users]);

  const addUser = (e) => {
    e.preventDefault();
    if (!newUserName) return;
    const newUser = { id: Date.now().toString(), name: newUserName };
    setUsers([...users, newUser]);
    setNewUserName('');
  };

  const deleteUser = (id) => {
    if (window.confirm("⚠️ Bu kişiyi ve ona ait TÜM sağlık verilerini silmek istediğinize emin misiniz?")) {
      setUsers(users.filter(u => u.id !== id));
      localStorage.removeItem(`kt_Veri_${id}`);
      localStorage.removeItem(`kt_Profil_${id}`);
      localStorage.removeItem(`kt_Ilac_${id}`);
      localStorage.removeItem(`kt_IlacGecmis_${id}`);
      localStorage.removeItem(`kt_Su_${id}`);
      localStorage.removeItem(`kt_His_${id}`);
      localStorage.removeItem(`kt_Randevu_${id}`);
      localStorage.removeItem(`kt_SonGiris_${id}`);
      localStorage.removeItem(`kt_AlarmAyar_${id}`);
    }
  };

  if (!activeUserId) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 max-w-md mx-auto">
        <h1 className="text-4xl font-black text-blue-900 mb-2 text-center tracking-tight">KolayTansiyon</h1>
        <p className="text-sm font-bold text-gray-500 mb-8 uppercase tracking-widest">Aile Sağlık Asistanı</p>

        <div className="w-full bg-white p-6 rounded-3xl shadow-2xl border border-gray-100">
          <h2 className="text-2xl font-black text-gray-800 mb-6 text-center">Kime Bakıyoruz?</h2>
          
          {users.length === 0 ? (
            <div className="text-center text-gray-500 mb-6 font-bold bg-gray-50 p-4 rounded-2xl border border-dashed border-gray-300">
              Sisteme kayıtlı kimse yok.<br/>Aşağıdan yeni bir kişi ekleyin.
            </div>
          ) : (
            <div className="space-y-3 mb-6 max-h-[50vh] overflow-y-auto pr-2">
              {users.map(u => (
                <div key={u.id} className="flex justify-between items-center bg-blue-50 border-2 border-blue-200 p-2 rounded-2xl shadow-sm transition-transform active:scale-95">
                  <button onClick={() => setActiveUserId(u.id)} className="flex-1 text-left text-xl font-black text-blue-900 flex items-center p-3">
                    <span className="text-4xl mr-4 drop-shadow-sm">👤</span> {u.name}
                  </button>
                  <button onClick={() => deleteUser(u.id)} className="p-3 text-red-500 text-sm font-bold bg-white rounded-xl border border-red-200 shadow-sm ml-2">Sil</button>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={addUser} className="bg-gray-100 p-5 rounded-2xl border border-gray-200 shadow-inner">
            <h3 className="font-black text-gray-700 mb-3 text-center">➕ Yeni Kişi Ekle</h3>
            <input type="text" value={newUserName} onChange={e => setNewUserName(e.target.value)} placeholder="Adı Soyadı (Örn: Dedem)" className="w-full p-4 rounded-xl border-2 border-gray-300 outline-none mb-3 font-bold text-lg text-center" required />
            <button type="submit" className="w-full bg-blue-600 text-white font-black py-4 rounded-xl shadow-md text-lg active:bg-blue-800 transition-colors">Sisteme Ekle</button>
          </form>
        </div>
      </div>
    );
  }

  const currentUser = users.find(u => u.id === activeUserId);
  return <KolayTansiyon key={activeUserId} userId={activeUserId} currentUser={currentUser} onSwitchUser={() => setActiveUserId(null)} />;
}

// ==========================================
// ALT BİLEŞEN: ASIL UYGULAMA (KİŞİYE ÖZEL)
// ==========================================
function KolayTansiyon({ userId, currentUser, onSwitchUser }) {
  
  const [activeTab, setActiveTab] = useState('home'); 
  
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem(`kt_Veri_${userId}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem(`kt_Profil_${userId}`);
    return saved ? JSON.parse(saved) : { name: currentUser.name, doctorPhone: '', sosPhone: '', bloodType: '', chronicDiseases: '', allergies: '' };
  });

  const [alarmSettings, setAlarmSettings] = useState(() => {
    const saved = localStorage.getItem(`kt_AlarmAyar_${userId}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        Sabah: parsed.Sabah || '09:00', SabahAktif: parsed.SabahAktif !== undefined ? parsed.SabahAktif : false,
        Öğle: parsed.Öğle || '13:00', ÖğleAktif: parsed.ÖğleAktif !== undefined ? parsed.ÖğleAktif : false,
        Akşam: parsed.Akşam || '20:00', AkşamAktif: parsed.AkşamAktif !== undefined ? parsed.AkşamAktif : false,
        Gece: parsed.Gece || '23:00', GeceAktif: parsed.GeceAktif !== undefined ? parsed.GeceAktif : false,
      };
    }
    return { 
      Sabah: '09:00', SabahAktif: false, 
      Öğle: '13:00', ÖğleAktif: false, 
      Akşam: '20:00', AkşamAktif: false, 
      Gece: '23:00', GeceAktif: false 
    };
  });

  const [medications, setMedications] = useState(() => {
    const saved = localStorage.getItem(`kt_Ilac_${userId}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [medHistory, setMedHistory] = useState(() => {
    const saved = localStorage.getItem(`kt_IlacGecmis_${userId}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [waterHistory, setWaterHistory] = useState(() => {
    const saved = localStorage.getItem(`kt_Su_${userId}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [moodHistory, setMoodHistory] = useState(() => {
    const saved = localStorage.getItem(`kt_His_${userId}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem(`kt_Randevu_${userId}`);
    return saved ? JSON.parse(saved) : [];
  });

  const getTodayDateString = () => new Date().toLocaleDateString('tr-TR');
  const [waterCount, setWaterCount] = useState(0);

  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFilters, setExportFilters] = useState({
    startDate: '', endDate: '', incTansiyon: true, incNabiz: true, incSu: true, incHis: true, incIlac: true
  });

  // İLK GİRİŞ VE GÜNLÜK SIFIRLAMA
  useEffect(() => {
    const today = getTodayDateString();
    const lastLoginKey = `kt_SonGiris_${userId}`;
    const lastLogin = localStorage.getItem(lastLoginKey);
    
    if (lastLogin !== today) {
      if (medications.length > 0) {
        const resetMeds = medications.map(m => ({ ...m, taken: false }));
        setMedications(resetMeds);
      }
      localStorage.setItem(lastLoginKey, today);
    }
  }, [medications, userId]);

  useEffect(() => {
    const today = getTodayDateString();
    const todayRecord = waterHistory.find(w => w.date === today);
    if (todayRecord) setWaterCount(todayRecord.count);
    else setWaterCount(0);
  }, [waterHistory]);

  const [isListening, setIsListening] = useState(false);
  const [activeMode, setActiveMode] = useState(null);
  const [manualInput, setManualInput] = useState('');
  
  const [newMedName, setNewMedName] = useState('');
  const [newMedPeriods, setNewMedPeriods] = useState(['Sabah']); 
  const [newMedUsage, setNewMedUsage] = useState('Tok');
  const [newMedInfo, setNewMedInfo] = useState('');
  
  const [newAppTitle, setNewAppTitle] = useState('');
  const [newAppLocation, setNewAppLocation] = useState('');
  const [newAppDate, setNewAppDate] = useState('');
  const [newAppTime, setNewAppTime] = useState('');
  
  const [newAppAlarms, setNewAppAlarms] = useState([]);
  const [tempAlarmType, setTempAlarmType] = useState('1440'); 
  const [tempCustomDate, setTempCustomDate] = useState('');
  const [tempCustomTime, setTempCustomTime] = useState('');
  
  const [activeReminder, setActiveReminder] = useState(null);
  const [activeAppReminder, setActiveAppReminder] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => { localStorage.setItem(`kt_Veri_${userId}`, JSON.stringify(history)); }, [history, userId]);
  useEffect(() => { localStorage.setItem(`kt_Profil_${userId}`, JSON.stringify(profile)); }, [profile, userId]);
  useEffect(() => { localStorage.setItem(`kt_AlarmAyar_${userId}`, JSON.stringify(alarmSettings)); }, [alarmSettings, userId]);
  useEffect(() => { localStorage.setItem(`kt_Ilac_${userId}`, JSON.stringify(medications)); }, [medications, userId]);
  useEffect(() => { localStorage.setItem(`kt_IlacGecmis_${userId}`, JSON.stringify(medHistory)); }, [medHistory, userId]);
  useEffect(() => { localStorage.setItem(`kt_Randevu_${userId}`, JSON.stringify(appointments)); }, [appointments, userId]);
  useEffect(() => { localStorage.setItem(`kt_Su_${userId}`, JSON.stringify(waterHistory)); }, [waterHistory, userId]);
  useEffect(() => { localStorage.setItem(`kt_His_${userId}`, JSON.stringify(moodHistory)); }, [moodHistory, userId]);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'tr-TR';
      utterance.rate = 0.85; 
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    let medAlarmInterval;
    if (activeReminder) {
      const usageText = activeReminder.usage === 'Aç' ? 'aç karnına' : activeReminder.usage === 'Tok' ? 'tok karnına' : '';
      const phrase = `İlaç zamanı! Lütfen ${activeReminder.name} ilacınızı ${usageText} için.`;
      speak(phrase);
      medAlarmInterval = setInterval(() => { speak(phrase); }, 6000);
    }
    return () => clearInterval(medAlarmInterval);
  }, [activeReminder]);

  useEffect(() => {
    let appAlarmInterval;
    if (activeAppReminder) {
      const phrase = `Hatırlatma! ${activeAppReminder.title} randevunuza az kaldı.`;
      speak(phrase);
      appAlarmInterval = setInterval(() => { speak(phrase); }, 6000);
    }
    return () => clearInterval(appAlarmInterval);
  }, [activeAppReminder]);

  // ANA MOTOR: Alarmlar ve Gece Yarısı Kontrolü
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      
      // HATA DÜZELTMESİ 2: Gece Yarısı Sendromu Kontrolü
      const currentTodayString = now.toLocaleDateString('tr-TR');
      if (localStorage.getItem(`kt_SonGiris_${userId}`) !== currentTodayString) {
        window.location.reload(); // Yeni güne geçildiğinde sistemi temizlemek için yeniden başlatır
      }

      const şuAnkiSaat = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      
      // Aynı saate denk gelen ilaçların kuyruklu (sırayla) çalmasını sağlayan yapı
      const saatiGelenİlaç = medications.find(med => {
        const isActive = alarmSettings[`${med.period}Aktif`] === true;
        return isActive && alarmSettings[med.period] === şuAnkiSaat && !med.taken;
      });
      
      if (saatiGelenİlaç && (!activeReminder || activeReminder.id !== saatiGelenİlaç.id)) {
        setActiveReminder(saatiGelenİlaç);
      }

      appointments.forEach(app => {
        if (app.alarms && app.alarms.length > 0) {
          app.alarms.forEach(alarm => {
            if (!alarm.rung && now.getTime() >= alarm.triggerTime && now.getTime() < app.appDateTime) {
              setActiveAppReminder(app);
              setAppointments(prev => prev.map(a => {
                if(a.id === app.id) {
                  return { ...a, alarms: a.alarms.map(al => al.id === alarm.id ? { ...al, rung: true } : al) }
                }
                return a;
              }));
            }
          });
        }
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [medications, activeReminder, appointments, alarmSettings, userId]);

  const extractNumbers = (text) => {
    let processedText = text.toLowerCase()
      .replace(/sıfır/g, '0').replace(/bir/g, '1').replace(/iki/g, '2').replace(/üç/g, '3')
      .replace(/dört/g, '4').replace(/beş/g, '5').replace(/altı/g, '6').replace(/yedi/g, '7')
      .replace(/sekiz/g, '8').replace(/dokuz/g, '9').replace(/on/g, '10').replace(/yirmi/g, '20')
      .replace(/otuz/g, '30').replace(/kırk/g, '40').replace(/elli/g, '50').replace(/altmış/g, '60')
      .replace(/atmış/g, '60').replace(/yetmiş/g, '70').replace(/seksen/g, '80').replace(/doksan/g, '90')
      .replace(/yüz/g, '100');
    return processedText.match(/\d+/g);
  };

  const parseAndSave = (text, mode) => {
    const matches = extractNumbers(text);
    if (!matches) return false;

    const now = new Date();
    const baseRecord = { id: Date.now(), date: now.toLocaleDateString('tr-TR'), time: now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }), type: mode };

    if (mode === 'bp') {
      if (matches.length < 2) return false;
      let sys = parseInt(matches[0]); let dia = parseInt(matches[1]);
      if (sys < 30) sys *= 10; if (dia < 30) dia *= 10;
      const status = (sys >= 140 || dia >= 90) ? 'high' : (sys <= 90 || dia <= 60) ? 'low' : 'normal';
      const msg = status === 'high' ? 'Yüksek tansiyon.' : status === 'low' ? 'Düşük tansiyon.' : 'Tansiyon normal.';
      setHistory([{ ...baseRecord, sys, dia, analysis: msg, status }, ...history]);
      setMessage('Kaydedildi!'); speak(`Tansiyonunuz ${sys}'e ${dia}. ${msg}`);
      return true;
    } else {
      let hr = parseInt(matches[0]);
      const status = hr > 100 ? 'high' : hr < 60 ? 'low' : 'normal';
      const msg = status === 'high' ? 'Nabzınız hızlı.' : status === 'low' ? 'Nabzınız yavaş.' : 'Nabzınız normal.';
      setHistory([{ ...baseRecord, hr, analysis: msg, status }, ...history]);
      setMessage('Kaydedildi!'); speak(`Nabzınız ${hr}. ${msg}`);
      return true;
    }
  };

  const startListening = (mode) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert('Ses tanıma desteklenmiyor.');
    const recognition = new SpeechRecognition();
    recognition.lang = 'tr-TR';
    recognition.onstart = () => { setIsListening(true); setActiveMode(mode); speak(mode === 'bp' ? 'Tansiyonunuzu söyleyin.' : 'Lütfen nabzım yetmiş şeklinde söyleyin.'); };
    recognition.onresult = (e) => { if (!parseAndSave(e.results[0][0].transcript, mode)) speak("Anlayamadım, tekrar söyleyin."); };
    recognition.onend = () => { setIsListening(false); setActiveMode(null); };
    recognition.start();
  };

  const getTrendAnalysis = () => {
    const bpRecords = history.filter(h => h.type === 'bp');
    if (bpRecords.length < 3) return { text: 'Trend analizi için 3 kayıt gerekli.', color: 'text-gray-500 bg-gray-50 border-gray-200', icon: '⚪' };
    const recentAvg = (bpRecords[0].sys + bpRecords[1].sys + bpRecords[2].sys) / 3;
    if (recentAvg >= 135) return { text: 'Tansiyonunuz yükselme eğiliminde.', color: 'text-red-600 bg-red-50 border-red-200', icon: '🔺' };
    if (recentAvg <= 100) return { text: 'Tansiyonunuz düşük seyrediyor.', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: '🔻' };
    return { text: 'Tansiyon gidişatınız stabil.', color: 'text-green-700 bg-green-50 border-green-200', icon: '🟢' };
  };

  const handleSOS = () => {
    if (!profile.sosPhone) return alert("Ayarlar sayfasından acil durum numarası ekleyin.");
    window.open(`tel:${profile.sosPhone}`, '_self');
  };

  const updateWater = (newCount) => {
    const today = getTodayDateString();
    setWaterCount(newCount);
    const updatedHistory = waterHistory.filter(w => w.date !== today);
    if (newCount > 0) updatedHistory.unshift({ date: today, count: newCount });
    setWaterHistory(updatedHistory);
  };

  const logMood = (moodLevel, text) => {
    const now = new Date();
    const updatedHistory = [{ id: Date.now(), date: getTodayDateString(), time: now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }), level: moodLevel, text: text }, ...moodHistory.filter(m => m.date !== getTodayDateString())];
    setMoodHistory(updatedHistory);
    speak(moodLevel === 'good' ? "Harika hissediyorsunuz!" : "Geçmiş olsun, bunu doktorunuza ileteceğiz.");
  };

  const togglePeriodSelection = (period) => {
    if (newMedPeriods.includes(period)) {
      setNewMedPeriods(newMedPeriods.filter(p => p !== period));
    } else {
      setNewMedPeriods([...newMedPeriods, period]);
    }
  };

  const addMedication = (e) => {
    e.preventDefault();
    if (!newMedName || newMedPeriods.length === 0) return alert("Lütfen ilaç adı ve en az bir zaman seçin.");
    
    const newMeds = newMedPeriods.map((period, index) => ({
      id: Date.now() + index, 
      name: newMedName,
      period: period,
      usage: newMedUsage,
      info: newMedInfo,
      taken: false
    }));

    setMedications([...medications, ...newMeds]);
    setNewMedName(''); 
    setNewMedInfo('');
    setNewMedPeriods(['Sabah']); 
    setNewMedUsage('Tok');
    speak(`${newMedName} ilacı seçtiğiniz zamanlar için kaydedildi.`);
  };

  const toggleMedication = (id) => {
    setMedications(medications.map(m => {
      if (m.id === id) {
        const isTaking = !m.taken;
        if (isTaking) {
          speak(`${m.name} içildi.`);
          setMedHistory([{ id: Date.now(), name: m.name, date: getTodayDateString(), time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) }, ...medHistory]);
        }
        return { ...m, taken: isTaking };
      }
      return m;
    }));
    if (activeReminder && activeReminder.id === id) {
      window.speechSynthesis.cancel();
      setActiveReminder(null);
    }
  };

  const addTempAlarm = () => {
    if(!newAppDate || !newAppTime) return alert("Lütfen önce randevunun kendi tarih ve saatini girin.");
    
    const [year, month, day] = newAppDate.split('-');
    const [hour, min] = newAppTime.split(':');
    const appDateTime = new Date(year, month - 1, day, hour, min).getTime();

    let triggerTime;
    let labelText = '';

    if (tempAlarmType === 'custom') {
      if(!tempCustomDate || !tempCustomTime) return alert("Özel alarm için tarih ve saat girmelisiniz.");
      const [cy, cm, cd] = tempCustomDate.split('-');
      const [ch, cmin] = tempCustomTime.split(':');
      triggerTime = new Date(cy, cm - 1, cd, ch, cmin).getTime();
      
      if (triggerTime >= appDateTime) {
        return alert("Mantık Hatası: Alarm, randevu saatinden sonra veya randevuyla aynı saatte çalamaz!");
      }
      if (triggerTime <= new Date().getTime()) {
        return alert("Geçmiş bir zamana alarm kuramazsınız.");
      }
      labelText = `${tempCustomDate} ${tempCustomTime} (Özel Zaman)`;

    } else {
      const minutes = parseInt(tempAlarmType);
      triggerTime = appDateTime - (minutes * 60000);
      if (triggerTime <= new Date().getTime()) {
        return alert("Seçtiğiniz bu alarm süresi geçmişte kalıyor. Lütfen daha kısa bir süre seçin.");
      }
      labelText = minutes === 60 ? '1 Saat Önce' : minutes === 180 ? '3 Saat Önce' : '1 Gün Önce';
    }

    setNewAppAlarms([...newAppAlarms, { id: Date.now(), triggerTime, label: labelText, rung: false }]);
  };

  const removeTempAlarm = (id) => {
    setNewAppAlarms(newAppAlarms.filter(a => a.id !== id));
  };

  const updateAppNote = (id, noteText) => setAppointments(appointments.map(app => app.id === id ? { ...app, notes: noteText } : app));
  const deleteRecord = (id) => setHistory(history.filter(h => h.id !== id));
  const deleteWaterRecord = (date) => setWaterHistory(waterHistory.filter(w => w.date !== date));
  const deleteMedHistory = (id) => setMedHistory(medHistory.filter(m => m.id !== id));
  const deleteMoodHistory = (id) => setMoodHistory(moodHistory.filter(m => m.id !== id));

  // HATA DÜZELTMESİ 1: Farklı cihazlar/tarayıcılar için Regex Tarih Ayrıştırıcı (iOS/Mac Uyumu)
  const parseTrDate = (dateStr) => {
    if (!dateStr) return 0;
    const parts = dateStr.split(/[./-]/); // Nokta, Eğik Çizgi veya Tire ayırıcılarını sorunsuz okur
    if (parts.length !== 3) return 0;
    const [d, m, y] = parts;
    return new Date(y, m - 1, d).getTime();
  };

  const generateReportData = () => {
    const startObj = exportFilters.startDate ? new Date(exportFilters.startDate).getTime() : 0;
    const endObj = exportFilters.endDate ? new Date(exportFilters.endDate).getTime() + 86400000 : Infinity;

    let text = `=======================================\n`;
    text += `   👨‍⚕️ SAĞLIK RAPORU: ${profile.name || currentUser.name}\n`;
    text += `   📅 Tarih: ${new Date().toLocaleDateString('tr-TR')}\n`;
    text += `=======================================\n\n`;

    if(profile.bloodType || profile.chronicDiseases) {
      text += `⚠️ TIBBİ BİLGİLER:\n`;
      text += `Kan Grubu: ${profile.bloodType || '-'}\n`;
      text += `Hastalıklar: ${profile.chronicDiseases || '-'}\n`;
      text += `Alerjiler: ${profile.allergies || '-'}\n\n`;
    }

    if (exportFilters.incIlac && medications.length > 0) {
      text += `💊 KULLANDIĞI İLAÇLAR:\n`;
      medications.forEach(m => { text += `- ${m.name} | Zaman: ${m.period} | Kullanım: ${m.usage} | Not: ${m.info || '-'}\n`; });
      text += `\n`;
    }

    if (exportFilters.incTansiyon || exportFilters.incNabiz) {
      text += `📊 TANSİYON VE NABIZ ÖLÇÜMLERİ:\n`;
      const fHist = history.filter(h => { const t = parseTrDate(h.date); return t >= startObj && t <= endObj; });
      if (fHist.length === 0) text += `(Bu tarih aralığında kayıt yok)\n`;
      fHist.forEach(h => {
        if (h.type === 'bp' && exportFilters.incTansiyon) text += `[${h.date} ${h.time}] Tansiyon: ${h.sys}/${h.dia} (${h.analysis})\n`;
        if (h.type === 'hr' && exportFilters.incNabiz) text += `[${h.date} ${h.time}] Nabız: ${h.hr} BPM (${h.analysis})\n`;
      });
      text += `\n`;
    }

    if (exportFilters.incSu) {
      text += `💧 SU TÜKETİMİ:\n`;
      const fWater = waterHistory.filter(w => { const t = parseTrDate(w.date); return t >= startObj && t <= endObj; });
      if (fWater.length === 0) text += `(Bu tarih aralığında kayıt yok)\n`;
      fWater.forEach(w => {
        const ml = w.count * 200;
        const displayVol = ml >= 1000 ? `${(ml/1000).toFixed(1).replace('.0', '')} Litre` : `${ml} ml`;
        text += `[${w.date}] ${w.count} Bardak (${displayVol})\n`;
      });
      text += `\n`;
    }

    if (exportFilters.incHis) {
      text += `🎭 ŞİKAYET / DURUM GEÇMİŞİ:\n`;
      const fMood = moodHistory.filter(m => { const t = parseTrDate(m.date); return t >= startObj && t <= endObj; });
      if (fMood.length === 0) text += `(Bu tarih aralığında kayıt yok)\n`;
      fMood.forEach(m => { text += `[${m.date} ${m.time}] Durum: ${m.text}\n`; });
      text += `\n`;
    }

    text += `=======================================\n`;
    text += `KolayTansiyon Akıllı Asistanı ile oluşturuldu.\n`;
    return text;
  };

  const shareViaWhatsAppFiltered = () => {
    const text = generateReportData();
    let url = `https://wa.me/`; 
    if (profile.doctorPhone) url += profile.doctorPhone.replace(/\D/g,'');
    url += `?text=${encodeURIComponent(text)}`; 
    window.open(url, '_blank');
    setShowExportModal(false);
  };

  const downloadReportFile = () => {
    const text = generateReportData();
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Rapor_${currentUser.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowExportModal(false);
    speak("Rapor cihazınıza indirildi.");
  };

  const clearAllData = () => {
    if (window.confirm(`⚠️ DİKKAT! Sadece ${currentUser.name} isimli kişiye ait tüm tansiyon, ilaç ve randevu kayıtlarınız kalıcı olarak silinecek. Emin misiniz?`)) {
      localStorage.removeItem(`kt_Veri_${userId}`);
      localStorage.removeItem(`kt_Profil_${userId}`);
      localStorage.removeItem(`kt_Ilac_${userId}`);
      localStorage.removeItem(`kt_IlacGecmis_${userId}`);
      localStorage.removeItem(`kt_Su_${userId}`);
      localStorage.removeItem(`kt_His_${userId}`);
      localStorage.removeItem(`kt_Randevu_${userId}`);
      localStorage.removeItem(`kt_SonGiris_${userId}`);
      localStorage.removeItem(`kt_AlarmAyar_${userId}`);
      window.location.reload();
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    let greeting = hour < 12 ? "Günaydın" : hour < 18 ? "İyi Günler" : "İyi Akşamlar";
    const firstName = profile.name ? profile.name.split(' ')[0] : currentUser.name.split(' ')[0];
    return `${greeting}, ${firstName}!`;
  };

  const localISOTime = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
  const todayMood = moodHistory.find(m => m.date === getTodayDateString())?.level;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans max-w-md mx-auto relative pb-28 shadow-2xl border border-gray-100">
      
      {/* İNATÇI İLAÇ ALARMI */}
      {activeReminder && (
        <div className="fixed inset-0 bg-red-600 z-[999] flex flex-col items-center justify-center p-6 text-white text-center animate-pulse">
          <div className="text-8xl mb-4 animate-bounce">🔔</div><h2 className="text-5xl font-black mb-4 drop-shadow-xl">İLAÇ ZAMANI!</h2>
          <div className="bg-white text-gray-800 p-6 rounded-3xl w-full shadow-2xl">
            <div className="text-4xl font-black text-red-600 mb-2">{activeReminder.name}</div>
            
            {activeReminder.usage !== 'Farketmez' && (
              <div className="text-2xl font-black text-white bg-blue-600 inline-block px-4 py-2 rounded-xl mb-4 shadow-md uppercase tracking-wider">
                {activeReminder.usage} KARNINA
              </div>
            )}
            
            <div className="text-xl font-bold text-gray-500">⏰ Zaman: {activeReminder.period} ({alarmSettings[activeReminder.period]})</div>
          </div>
          <button onClick={() => toggleMedication(activeReminder.id)} className="w-full bg-white text-green-700 py-6 rounded-3xl font-black text-4xl shadow-2xl mt-8 active:scale-95 transition-transform">İÇTİM ✓</button>
        </div>
      )}

      {/* İNATÇI RANDEVU ALARMI */}
      {activeAppReminder && (
        <div className="fixed inset-0 bg-purple-700 z-[999] flex flex-col items-center justify-center p-6 text-white text-center animate-pulse">
          <div className="text-8xl mb-4 animate-bounce">🏥</div><h2 className="text-4xl font-black mb-4 drop-shadow-xl">RANDEVU HATIRLATMASI!</h2>
          <div className="bg-white text-gray-800 p-6 rounded-3xl w-full shadow-2xl text-left border-4 border-purple-300">
            <div className="text-2xl font-black text-purple-900 mb-2">{activeAppReminder.title}</div>
            <div className="text-lg font-bold text-gray-600">Hastane: {activeAppReminder.location}</div>
            <div className="text-lg font-bold text-gray-600 mt-2">📅 Tarih: {activeAppReminder.date}</div>
            <div className="text-xl font-black text-red-600 mt-1">🕒 Saat: {activeAppReminder.time}</div>
          </div>
          <button onClick={() => { window.speechSynthesis.cancel(); setActiveAppReminder(null); }} className="w-full bg-white text-purple-700 py-5 rounded-3xl font-black text-2xl shadow-2xl mt-8 active:scale-95 transition-transform">TAMAM, ANLADIM ✓</button>
        </div>
      )}

      {/* RAPOR FİLTRELEME VE İNDİRME MODALI */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/70 z-[9999] flex justify-center items-center p-4">
          <div className="bg-white rounded-3xl w-full p-6 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-xl font-black text-blue-900">Rapor Oluştur</h2>
              <button onClick={() => setShowExportModal(false)} className="text-red-500 font-bold text-lg">Kapat ✕</button>
            </div>

            <p className="text-xs text-gray-500 font-bold mb-4">Göndermek istediğiniz verileri ve tarih aralığını seçin.</p>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div><label className="text-[10px] font-bold text-gray-600 uppercase">Başlangıç Tarihi</label><input type="date" value={exportFilters.startDate} onChange={e => setExportFilters({...exportFilters, startDate: e.target.value})} className="w-full p-2 border rounded-lg outline-none text-sm"/></div>
              <div><label className="text-[10px] font-bold text-gray-600 uppercase">Bitiş Tarihi</label><input type="date" value={exportFilters.endDate} onChange={e => setExportFilters({...exportFilters, endDate: e.target.value})} className="w-full p-2 border rounded-lg outline-none text-sm"/></div>
            </div>

            <div className="space-y-2 mb-6 bg-gray-50 p-3 rounded-xl border border-gray-200">
              <label className="flex items-center space-x-3"><input type="checkbox" checked={exportFilters.incIlac} onChange={e => setExportFilters({...exportFilters, incIlac: e.target.checked})} className="w-5 h-5 accent-blue-600"/><span className="font-bold text-gray-700">İlaç Listesi</span></label>
              <label className="flex items-center space-x-3"><input type="checkbox" checked={exportFilters.incTansiyon} onChange={e => setExportFilters({...exportFilters, incTansiyon: e.target.checked})} className="w-5 h-5 accent-blue-600"/><span className="font-bold text-gray-700">Tansiyon Ölçümleri</span></label>
              <label className="flex items-center space-x-3"><input type="checkbox" checked={exportFilters.incNabiz} onChange={e => setExportFilters({...exportFilters, incNabiz: e.target.checked})} className="w-5 h-5 accent-blue-600"/><span className="font-bold text-gray-700">Nabız Ölçümleri</span></label>
              <label className="flex items-center space-x-3"><input type="checkbox" checked={exportFilters.incSu} onChange={e => setExportFilters({...exportFilters, incSu: e.target.checked})} className="w-5 h-5 accent-blue-600"/><span className="font-bold text-gray-700">Su Tüketim Geçmiş</span></label>
              <label className="flex items-center space-x-3"><input type="checkbox" checked={exportFilters.incHis} onChange={e => setExportFilters({...exportFilters, incHis: e.target.checked})} className="w-5 h-5 accent-blue-600"/><span className="font-bold text-gray-700">Şikayet / His Durumu</span></label>
            </div>

            <div className="space-y-3">
              <button onClick={downloadReportFile} className="w-full bg-blue-600 text-white font-black py-4 rounded-xl shadow-md active:bg-blue-800 transition-colors flex justify-center items-center">
                <span className="text-xl mr-2">📄</span> Raporu Dosya Yap (.txt)
              </button>
              <button onClick={shareViaWhatsAppFiltered} className="w-full bg-[#25D366] text-white font-black py-4 rounded-xl shadow-md active:bg-green-700 transition-colors flex justify-center items-center">
                <span className="text-xl mr-2">💬</span> WhatsApp Metni Olarak Gönder
              </button>
            </div>
            <p className="text-[10px] text-center text-gray-400 font-bold mt-3">WhatsApp, harici dosya eklemeye izin vermez. Önce dosyayı indirip, WhatsApp'tan belge olarak gönderebilirsiniz.</p>
          </div>
        </div>
      )}

      {/* Z-INDEX ÇAKIŞMASI ÇÖZÜLEN ÜST MENÜ */}
      <div className="pt-6 pb-4 bg-white sticky top-0 z-50 border-b border-gray-200 px-4 flex justify-between items-center shadow-sm">
        <button onClick={onSwitchUser} className="text-md font-black text-blue-900 tracking-tight flex items-center bg-blue-50 px-3 py-2 rounded-xl border border-blue-200 active:scale-95 transition-transform shadow-sm">
          <span className="mr-2 text-xl">👥</span> {currentUser.name.split(' ')[0]}
        </button>
        <button onClick={handleSOS} className="bg-red-600 active:bg-red-800 text-white font-black px-4 py-2 rounded-xl text-lg shadow-md">🚨 SOS</button>
      </div>

      <div className="px-4 mt-4">
        
        {/* --- TAB 1: ANA EKRAN --- */}
        {activeTab === 'home' && (
          <div className="animate-fade-in space-y-5">
            <h2 className="text-2xl font-black text-gray-800">{getGreeting()} 👋</h2>

            <div className="bg-white p-4 rounded-2xl border shadow-sm text-center">
              <h3 className="font-bold text-gray-700 mb-3">Bugün Nasıl Hissediyorsun?</h3>
              <div className="flex justify-between gap-2">
                <button onClick={() => logMood('good', 'Çok İyiyim')} className={`flex-1 flex flex-col items-center p-2 rounded-xl transition border-2 ${todayMood === 'good' ? 'bg-green-100 border-green-500 shadow-md scale-105' : 'border-transparent hover:bg-green-50'}`}>
                  <span className="text-4xl mb-1">🟢</span><span className="font-bold text-sm text-green-700">İyiyim</span>
                </button>
                <button onClick={() => logMood('tired', 'Halsizim')} className={`flex-1 flex flex-col items-center p-2 rounded-xl transition border-2 ${todayMood === 'tired' ? 'bg-yellow-100 border-yellow-400 shadow-md scale-105' : 'border-transparent hover:bg-yellow-50'}`}>
                  <span className="text-4xl mb-1">🟡</span><span className="font-bold text-sm text-yellow-700">Halsizim</span>
                </button>
                <button onClick={() => logMood('bad', 'Ağrım Var')} className={`flex-1 flex flex-col items-center p-2 rounded-xl transition border-2 ${todayMood === 'bad' ? 'bg-red-100 border-red-500 shadow-md scale-105' : 'border-transparent hover:bg-red-50'}`}>
                  <span className="text-4xl mb-1">🔴</span><span className="font-bold text-sm text-red-700">Ağrım Var</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => startListening('bp')} className={`h-40 rounded-3xl flex flex-col items-center justify-center shadow-md ${isListening && activeMode === 'bp' ? 'bg-blue-400 animate-pulse' : 'bg-blue-600'}`}>
                <span className="text-white text-4xl mb-2">🩸</span><span className="text-white text-xl font-black">TANSİYON</span>
              </button>
              <button onClick={() => startListening('hr')} className={`h-40 rounded-3xl flex flex-col items-center justify-center shadow-md ${isListening && activeMode === 'hr' ? 'bg-red-400 animate-pulse' : 'bg-red-500'}`}>
                <span className="text-white text-4xl mb-2">❤️</span><span className="text-white text-xl font-black text-center">NABIZ</span>
              </button>
            </div>
            <p className="text-center text-xs font-bold text-gray-500">İpucu: "Nabzım yetmiş beş" derseniz daha kolay algılar.</p>
            {message && <div className="text-lg font-bold text-center bg-blue-50 p-4 rounded-xl text-blue-900 border border-blue-200">{message}</div>}

            <div className="bg-gray-100 p-4 rounded-2xl border border-gray-200 text-center">
              <label className="block text-sm font-bold text-gray-500 mb-2">Mikrofon çalışmazsa elle yazın:</label>
              <input type="text" value={manualInput} onChange={(e) => setManualInput(e.target.value)} placeholder="Örn: 120 80 veya 75" className="w-full mb-3 p-3 text-lg rounded-xl text-center border outline-none"/>
              <div className="flex gap-2">
                <button onClick={() => { parseAndSave(manualInput, 'bp'); setManualInput(''); }} className="flex-1 bg-blue-600 text-white py-2 rounded-xl font-bold">Tansiyon</button>
                <button onClick={() => { parseAndSave(manualInput, 'hr'); setManualInput(''); }} className="flex-1 bg-red-500 text-white py-2 rounded-xl font-bold">Nabız</button>
              </div>
            </div>

            <div className="bg-blue-50 p-5 rounded-2xl border-2 border-blue-200 shadow-sm text-center">
              <h3 className="font-black text-blue-900 mb-1">💧 Su Tüketimim</h3>
              <p className="text-sm font-bold text-gray-500 mb-1">{waterCount} bardak su içtiniz.</p>
              
              <p className="text-[11px] font-bold text-blue-400 mb-3">
                (1 Bardağı ≈ 200 ml | Toplam: {waterCount * 200 >= 1000 ? (waterCount * 0.2).toFixed(1).replace('.0', '') + ' Litre' : (waterCount * 200) + ' ml'})
              </p>

              <div className="grid grid-cols-4 gap-3 mb-4">
                {[...Array(Math.max(8, waterCount))].map((_, i) => (
                  <button key={i} onClick={() => { if (i < waterCount) updateWater(i); else { updateWater(i + 1); speak("Şifa olsun."); } }} 
                    className={`text-3xl p-2 rounded-xl border-2 transition-all ${i < waterCount ? 'bg-blue-500 border-blue-600 scale-105' : 'bg-white border-gray-300 opacity-40'}`}>🥛</button>
                ))}
              </div>
              <button onClick={() => { updateWater(waterCount + 1); speak("Bir bardak eklendi."); }} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-md">+1 Bardak Ekle</button>
            </div>
          </div>
        )}

        {/* --- TAB 2: RAPORLAR --- */}
        {activeTab === 'history' && (() => {
          const bpRecords = history.filter(h => h.type === 'bp');
          const hrRecords = history.filter(h => h.type === 'hr');
          
          const avgHr = hrRecords.length ? Math.round(hrRecords.reduce((a, c) => a + c.hr, 0) / hrRecords.length) : null;
          let hrTrend = null;
          if (avgHr) {
            hrTrend = avgHr > 100 ? { text: 'Ortalama nabzınız yüksek seyrediyor.', color: 'text-red-700 bg-red-50 border-red-200' } :
                      avgHr < 60 ? { text: 'Ortalama nabzınız düşük seyrediyor.', color: 'text-blue-700 bg-blue-50 border-blue-200' } :
                      { text: 'Ortalama nabzınız normal.', color: 'text-green-700 bg-green-50 border-green-200' };
          }

          return (
            <div className="animate-fade-in space-y-6">
              
              {history.length > 0 && (
                <div className={`p-4 rounded-2xl border-2 font-black text-lg text-center shadow-sm flex items-center justify-center ${getTrendAnalysis().color}`}>
                  <span className="text-2xl mr-2">{getTrendAnalysis().icon}</span>{getTrendAnalysis().text}
                </div>
              )}

              {(history.length > 0 || medications.length > 0) && (
                <button onClick={() => setShowExportModal(true)} className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-black text-lg shadow-md mb-2 border-b-4 border-green-700 active:scale-95 transition-transform flex justify-center items-center">
                  <span className="mr-2 text-2xl">📋</span> DOKTORA RAPOR GÖNDER
                </button>
              )}
              
              <div className="bg-white p-4 rounded-2xl border shadow-sm">
                <h3 className="font-black text-xl text-blue-900 mb-2">🩸 Tansiyon Geçmişi</h3>
                {bpRecords.length > 0 && (
                  <div className="flex justify-center gap-1 mb-4 text-[9px] font-black uppercase">
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded border border-red-200">Yüksek</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded border border-green-200">Normal</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded border border-blue-200">Düşük</span>
                  </div>
                )}
                {bpRecords.length === 0 ? <p className="text-gray-400 text-sm">Kayıt yok.</p> : (
                  <div className="space-y-3">
                    {bpRecords.map(r => (
                      <div key={r.id} className={`p-3 rounded-xl flex justify-between items-center border-l-4 ${r.status === 'high' ? 'bg-red-50 border-red-500' : r.status === 'low' ? 'bg-blue-50 border-blue-500' : 'bg-green-50 border-green-500'}`}>
                        <div><div className="font-bold">{r.date}</div><div className="text-xs text-gray-500">{r.time}</div></div>
                        <div className={`text-2xl font-black ${r.status === 'high' ? 'text-red-700' : r.status === 'low' ? 'text-blue-700' : 'text-green-700'}`}>{r.sys}/{r.dia}</div>
                        <button onClick={() => deleteRecord(r.id)} className="bg-white p-2 rounded-lg text-red-500 border border-red-200 text-xs font-bold">Sil</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white p-4 rounded-2xl border shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-black text-xl text-red-700">❤️ Nabız Geçmişi</h3>
                  {avgHr && <span className="text-sm font-bold text-gray-500">Ortalama: {avgHr}</span>}
                </div>
                {hrRecords.length > 0 && (
                  <div className="flex justify-center gap-1 mb-4 text-[9px] font-black uppercase">
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded border border-red-200">Yüksek</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded border border-green-200">Normal</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded border border-blue-200">Düşük</span>
                  </div>
                )}
                {hrTrend && <div className={`text-sm font-bold p-2 rounded-lg mb-3 border ${hrTrend.color}`}>{hrTrend.text}</div>}
                
                {hrRecords.length === 0 ? <p className="text-gray-400 text-sm">Kayıt yok.</p> : (
                  <div className="space-y-3">
                    {hrRecords.map(r => (
                      <div key={r.id} className={`p-3 rounded-xl flex justify-between items-center border-l-4 ${r.status === 'high' ? 'bg-red-50 border-red-500' : r.status === 'low' ? 'bg-blue-50 border-blue-400' : 'bg-green-50 border-green-500'}`}>
                        <div><div className="font-bold">{r.date}</div><div className="text-xs text-gray-500">{r.time}</div></div>
                        <div className={`text-2xl font-black ${r.status === 'high' ? 'text-red-700' : r.status === 'low' ? 'text-blue-700' : 'text-green-700'}`}>{r.hr}</div>
                        <button onClick={() => deleteRecord(r.id)} className="bg-white p-2 rounded-lg text-red-500 border border-red-200 text-xs font-bold">Sil</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white p-4 rounded-2xl border shadow-sm">
                <h3 className="font-black text-xl text-gray-700 mb-3">🎭 Duygu ve Şikayet Geçmişi</h3>
                {moodHistory.length === 0 ? <p className="text-gray-400 text-sm">Kayıt yok.</p> : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {moodHistory.map((m) => (
                      <div key={m.id} className="p-3 bg-gray-50 rounded-xl flex justify-between items-center border border-gray-200">
                        <div>
                          <div className={`font-black ${m.level === 'good' ? 'text-green-600' : m.level === 'tired' ? 'text-yellow-600' : 'text-red-600'}`}>
                            {m.level === 'good' ? '🟢 ' : m.level === 'tired' ? '🟡 ' : '🔴 '} {m.text}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{m.date} - {m.time}</div>
                        </div>
                        <button onClick={() => deleteMoodHistory(m.id)} className="bg-white p-2 rounded-lg text-red-500 border border-red-200 text-xs font-bold">Sil</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white p-4 rounded-2xl border shadow-sm">
                <h3 className="font-black text-xl text-blue-500 mb-3">💧 Su Geçmişi</h3>
                {waterHistory.length === 0 ? <p className="text-gray-400 text-sm">Kayıt yok.</p> : (
                  <div className="space-y-2">
                    {waterHistory.slice(0,7).map((w, idx) => (
                      <div key={idx} className="p-3 bg-blue-50 rounded-xl flex justify-between items-center border border-blue-100">
                        <div className="font-bold text-gray-700">{w.date}</div>
                        <div className="font-black text-blue-700 text-lg">
                          {w.count} Bardak 
                          <span className="text-xs text-blue-500 font-bold block">
                            ({w.count * 200 >= 1000 ? (w.count * 0.2).toFixed(1).replace('.0', '') + ' L' : (w.count * 200) + ' ml'})
                          </span>
                        </div>
                        <button onClick={() => deleteWaterRecord(w.date)} className="bg-white p-2 rounded-lg text-red-500 border border-red-200 text-xs font-bold">Sil</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          );
        })()}

        {/* --- TAB 3: İLAÇLAR --- */}
        {activeTab === 'meds' && (
          <div className="animate-fade-in space-y-6">
            
            <div className="bg-white p-4 rounded-2xl border shadow-sm">
              <h2 className="text-2xl font-black text-center mb-4 text-gray-800">💊 İlaçlarım</h2>
              <div className="space-y-3">
                {(() => {
                  const periodOrder = ['Sabah', 'Öğle', 'Akşam', 'Gece'];
                  const sortedMeds = [...medications].sort((a, b) => periodOrder.indexOf(a.period) - periodOrder.indexOf(b.period));
                  
                  if (sortedMeds.length === 0) return <p className="text-center text-gray-400 py-2">Kayıtlı ilaç yok.</p>;
                  
                  return sortedMeds.map(med => (
                    <div key={med.id} className={`p-4 rounded-xl border-2 transition-all ${med.taken ? 'bg-gray-50 opacity-60' : 'bg-yellow-50 border-yellow-200 shadow-sm'}`}>
                      <div className="flex justify-between">
                        <div>
                          <div className="text-xl font-black">{med.name}</div>
                          <div className="text-sm font-bold text-yellow-700 bg-yellow-100 inline-block px-2 py-1 rounded-md mt-1">Zamanı: {med.period} ({alarmSettings[med.period]})</div>
                          {med.usage !== 'Farketmez' && (
                            <span className="text-xs font-bold text-white bg-blue-500 px-2 py-1 rounded-md mt-1 ml-2 inline-block uppercase">
                              {med.usage}
                            </span>
                          )}
                        </div>
                        <button onClick={() => setMedications(medications.filter(m => m.id !== med.id))} className="text-red-500 text-sm font-bold">Sil</button>
                      </div>
                      {med.info && <div className="mt-2 text-sm font-bold text-gray-600">📌 {med.info}</div>}
                      <button onClick={() => toggleMedication(med.id)} className={`w-full mt-3 py-3 rounded-xl font-black text-lg ${med.taken ? 'bg-gray-300' : 'bg-yellow-500 text-white shadow-sm'}`}>{med.taken ? 'İÇİLDİ ✓' : 'İÇTİM'}</button>
                    </div>
                  ));
                })()}
              </div>

              <form onSubmit={addMedication} className="bg-yellow-50/50 p-4 rounded-xl border border-yellow-200 mt-5 space-y-4">
                <h3 className="font-bold text-sm text-yellow-800">➕ Yeni İlaç Ekle</h3>
                
                <input type="text" value={newMedName} onChange={(e) => setNewMedName(e.target.value)} placeholder="İlaç Adı (Örn: Tansiyon İlacı)" className="w-full p-3 border border-yellow-300 rounded-lg outline-none bg-white font-bold" required/>
                
                <div>
                  <label className="text-xs font-bold text-yellow-800 ml-1 mb-1 block">Aç mı Tok mu İçilecek?</label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setNewMedUsage('Aç')} className={`flex-1 py-2 rounded-lg font-bold text-xs border-2 transition-colors ${newMedUsage === 'Aç' ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-gray-600 border-gray-300'}`}>AÇ</button>
                    <button type="button" onClick={() => setNewMedUsage('Tok')} className={`flex-1 py-2 rounded-lg font-bold text-xs border-2 transition-colors ${newMedUsage === 'Tok' ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-gray-600 border-gray-300'}`}>TOK</button>
                    <button type="button" onClick={() => setNewMedUsage('Farketmez')} className={`flex-1 py-2 rounded-lg font-bold text-xs border-2 transition-colors ${newMedUsage === 'Farketmez' ? 'bg-gray-500 text-white border-gray-600' : 'bg-white text-gray-600 border-gray-300'}`}>FARKETMEZ</button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-yellow-800 ml-1 mb-1 block">Hangi Zamanlarda İçilecek?</label>
                  <div className="flex justify-between gap-2 mb-1">
                    {['Sabah', 'Öğle', 'Akşam', 'Gece'].map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => togglePeriodSelection(p)}
                        className={`flex-1 py-2 rounded-lg font-bold text-sm border-2 transition-colors ${newMedPeriods.includes(p) ? 'bg-yellow-500 text-white border-yellow-600' : 'bg-white text-gray-600 border-gray-300'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-500 font-bold ml-1 mb-3">Birden fazla zaman seçebilirsiniz.</p>
                </div>

                <input type="text" value={newMedInfo} onChange={(e) => setNewMedInfo(e.target.value)} placeholder="Ek Notlar (Örn: Yarım tablet içilecek)" className="w-full p-3 border border-yellow-300 rounded-lg outline-none"/>
                <button type="submit" className="w-full bg-yellow-600 text-white py-3 rounded-lg font-black text-lg shadow-md">İlacı Kaydet</button>
              </form>

              <div className="mt-6 border-t pt-4">
                <h3 className="font-black text-gray-700 mb-2">📋 İlaç İçme Geçmişi</h3>
                {medHistory.length === 0 ? <p className="text-sm text-gray-400">Henüz kayıt yok.</p> : (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {medHistory.map((m, i) => (
                      <div key={i} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded-lg border">
                        <div><span className="font-bold">{m.name}</span> <span className="text-gray-500">({m.date} - {m.time})</span></div>
                        <button onClick={() => deleteMedHistory(m.id)} className="text-red-500 font-bold ml-2">Sil</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* --- TAB 4: RANDEVULAR --- */}
        {activeTab === 'appointments' && (
          <div className="animate-fade-in space-y-6">
            
            <div className="bg-white p-4 rounded-2xl border shadow-sm">
              <h2 className="text-2xl font-black text-center mb-4 text-gray-800">🏥 Randevularım</h2>
              
              {appointments.length > 0 && (
                <div className="flex justify-center gap-2 mb-4 text-[10px] font-black uppercase">
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md border border-purple-200">Mor: Gelecek</span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-md border border-red-200">Kırmızı: Bugün</span>
                  <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-md border border-gray-300">Gri: Geçmiş</span>
                </div>
              )}

              <div className="space-y-4">
                {appointments.length === 0 && <p className="text-center text-gray-400 py-2">Kayıtlı randevu yok.</p>}
                
                {appointments.map(app => {
                  const isPast = app.date < localISOTime;
                  const isToday = app.date === localISOTime;
                  const bgClass = isPast ? 'bg-gray-100 border-gray-300' : isToday ? 'bg-red-50 border-red-300' : 'bg-purple-50 border-purple-200';
                  const titleClass = isPast ? 'text-gray-600' : isToday ? 'text-red-700' : 'text-purple-900';

                  return (
                    <div key={app.id} className={`p-4 border-2 rounded-xl ${bgClass}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className={`text-xl font-black ${titleClass}`}>{app.title}</div>
                          <div className="text-sm font-bold text-gray-600">{app.location}</div>
                          <div className="font-bold text-gray-700 mt-2">📅 {app.date} - 🕒 {app.time}</div>
                        </div>
                        <button onClick={() => setAppointments(appointments.filter(a => a.id !== app.id))} className="text-red-500 font-bold text-sm bg-white p-1 rounded-md border border-red-200 shadow-sm">İptal/Sil</button>
                      </div>
                      
                      {app.alarms && app.alarms.length > 0 && !isPast && (
                        <div className="mb-3">
                          <p className="text-[10px] font-bold text-purple-800 uppercase mb-1">⏰ Kurulu Alarmlar:</p>
                          <div className="flex flex-wrap gap-1">
                            {app.alarms.map(al => (
                              <span key={al.id} className={`text-[10px] font-bold px-2 py-1 rounded border ${al.rung ? 'bg-gray-200 text-gray-500 border-gray-300 line-through' : 'bg-purple-200 text-purple-800 border-purple-300'}`}>
                                {al.label}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {app.location && (
                        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(app.location)}`} target="_blank" rel="noreferrer" 
                           className="inline-block w-full text-center bg-blue-100 text-blue-700 font-bold p-3 rounded-xl mb-3 border border-blue-200 shadow-sm active:scale-95 transition-transform">
                          📍 Haritada Bul: {app.location}
                        </a>
                      )}
                      
                      <div className="mt-2">
                        <label className={`text-xs font-bold uppercase ${isPast ? 'text-gray-500' : 'text-purple-800'}`}>Doktorun Söyledikleri / Notlarım</label>
                        <textarea 
                          value={app.notes || ''} 
                          onChange={(e) => updateAppNote(app.id, e.target.value)} 
                          placeholder="Örn: 3 ay sonra tekrar kontrole gel..." 
                          className="w-full mt-1 p-2 rounded-lg border border-gray-300 text-sm outline-none resize-none bg-white"
                          rows="2"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-200 mt-5 space-y-3">
                <h3 className="font-bold text-sm text-purple-800">➕ Yeni Randevu Ekle</h3>
                
                <input type="text" value={newAppTitle} onChange={(e) => setNewAppTitle(e.target.value)} placeholder="Bölüm veya Doktor Adı" className="w-full p-3 border border-purple-300 rounded-lg outline-none bg-white font-bold" required/>
                
                <div>
                  <input type="text" value={newAppLocation} onChange={(e) => setNewAppLocation(e.target.value)} placeholder="Hastane Adı (Örn: Şişli Etfal İstanbul)" className="w-full p-3 border border-purple-300 rounded-lg outline-none bg-white font-bold" required/>
                  <p className="text-[10px] text-red-600 font-bold ml-1 mt-1">⚠️ Harita tahmini olabilir, yola çıkmadan önce adresi mutlaka teyit edin.</p>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <input type="date" min={localISOTime} value={newAppDate} onChange={(e) => setNewAppDate(e.target.value)} className="w-full p-3 border border-purple-300 rounded-lg outline-none font-bold text-gray-700" required/>
                  <input type="time" value={newAppTime} onChange={(e) => setNewAppTime(e.target.value)} className="w-full p-3 border border-purple-300 rounded-lg outline-none font-bold text-gray-700" required/>
                </div>

                <div className="bg-white p-3 rounded-xl border border-purple-200 shadow-sm mt-3">
                  <label className="text-xs font-bold text-purple-800 mb-2 block">🔔 Alarm Ekle (Birden fazla ekleyebilirsiniz)</label>
                  
                  {newAppAlarms.length > 0 && (
                    <div className="flex flex-col gap-1 mb-3">
                      {newAppAlarms.map(al => (
                        <div key={al.id} className="flex justify-between items-center bg-purple-100 p-2 rounded-lg border border-purple-200">
                          <span className="text-xs font-bold text-purple-900">{al.label}</span>
                          <button onClick={() => removeTempAlarm(al.id)} className="text-red-500 font-bold text-xs">Sil</button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-2">
                    <select value={tempAlarmType} onChange={(e) => setTempAlarmType(e.target.value)} className="w-full p-2 border border-purple-300 rounded-lg outline-none bg-gray-50 text-sm font-bold text-gray-700">
                      <option value="60">1 Saat Önce</option>
                      <option value="180">3 Saat Önce</option>
                      <option value="1440">1 Gün Önce</option>
                      <option value="custom">Özel Tarih ve Saat Seç</option>
                    </select>

                    {tempAlarmType === 'custom' && (
                      <div className="grid grid-cols-2 gap-2 animate-fade-in">
                        <input type="date" min={localISOTime} value={tempCustomDate} onChange={(e) => setTempCustomDate(e.target.value)} className="w-full p-2 border border-purple-300 rounded-lg outline-none text-xs font-bold text-gray-700" />
                        <input type="time" value={tempCustomTime} onChange={(e) => setTempCustomTime(e.target.value)} className="w-full p-2 border border-purple-300 rounded-lg outline-none text-xs font-bold text-gray-700" />
                      </div>
                    )}
                    
                    <button onClick={addTempAlarm} className="w-full bg-purple-200 text-purple-800 font-black py-2 rounded-lg border border-purple-300 active:bg-purple-300 text-sm transition-colors">
                      + Alarmı Ekle
                    </button>
                  </div>
                </div>

                <button onClick={() => {
                  if(!newAppTitle || !newAppDate || !newAppTime || !newAppLocation) return alert("Lütfen hastane, bölüm, tarih ve saat yazın.");
                  
                  const [year, month, day] = newAppDate.split('-');
                  const [hour, min] = newAppTime.split(':');
                  const appDateTime = new Date(year, month - 1, day, hour, min).getTime();
                  const now = new Date().getTime();

                  if (appDateTime < now) {
                    speak("Geçmiş bir tarihe randevu ekleyemezsiniz.");
                    return alert("Lütfen gelecekteki bir tarih ve saat seçin.");
                  }

                  setAppointments([...appointments, { 
                    id: Date.now(), 
                    title: newAppTitle, 
                    location: newAppLocation, 
                    date: newAppDate, 
                    time: newAppTime, 
                    appDateTime: appDateTime,
                    alarms: newAppAlarms, 
                    notes: '' 
                  }]);
                  
                  setNewAppTitle(''); setNewAppLocation(''); setNewAppDate(''); setNewAppTime(''); 
                  setNewAppAlarms([]); setTempAlarmType('1440'); setTempCustomDate(''); setTempCustomTime('');
                  speak("Randevunuz kaydedildi.");
                }} className="w-full bg-purple-700 text-white py-4 rounded-xl font-black text-lg shadow-md mt-4 active:scale-95 transition-transform">Randevuyu Kaydet</button>
              </div>
            </div>

          </div>
        )}

        {/* --- TAB 5: AYARLAR VE TIBBİ KİMLİK --- */}
        {activeTab === 'profile' && (
          <div className="animate-fade-in space-y-5">
            
            <div className="bg-yellow-50 p-5 rounded-2xl shadow-sm border border-yellow-200">
              <h3 className="font-black text-xl mb-2 text-yellow-900 flex items-center">
                <span className="mr-2 text-2xl">⏰</span> İlaç Alarmları
              </h3>
              <p className="text-xs text-yellow-700 mb-4 font-bold">İlk girişte varsayılan olarak kapalıdır. İlacınızı hatırlatmasını istediğiniz öğünü AÇIK hale getirin.</p>
              
              <div className="grid grid-cols-2 gap-3">
                {['Sabah', 'Öğle', 'Akşam', 'Gece'].map(period => {
                  const icon = period === 'Sabah' ? '🌅' : period === 'Öğle' ? '☀️' : period === 'Akşam' ? '🌆' : '🌙';
                  const isActive = alarmSettings[`${period}Aktif`] === true; 
                  
                  return (
                    <div key={period} className="bg-white p-2 rounded-xl border border-yellow-200 shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-yellow-800">{icon} {period}</label>
                        <button 
                          onClick={() => setAlarmSettings({...alarmSettings, [`${period}Aktif`]: !isActive})}
                          className={`text-[10px] px-2 py-1 rounded-md font-black text-white transition-colors ${isActive ? 'bg-green-500' : 'bg-gray-400'}`}>
                          {isActive ? 'AÇIK' : 'KAPALI'}
                        </button>
                      </div>
                      <input 
                        type="time" 
                        value={alarmSettings[period] || ''} 
                        onChange={(e) => setAlarmSettings({...alarmSettings, [period]: e.target.value})} 
                        disabled={!isActive}
                        className={`w-full p-2 border rounded-lg outline-none font-bold text-gray-700 transition-opacity ${isActive ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200 bg-gray-100 opacity-50'}`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-red-600 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20 text-6xl">⚕️</div>
              <h3 className="font-black text-2xl mb-4 border-b border-red-500 pb-2">Acil Tıbbi Kimlik</h3>
              <div className="space-y-3 relative z-10">
                <div><label className="text-red-200 text-xs font-bold uppercase">Kan Grubu</label><input type="text" value={profile.bloodType} onChange={(e) => setProfile({...profile, bloodType: e.target.value})} className="w-full bg-red-700 text-white p-2 rounded-lg font-bold placeholder-red-400 outline-none" placeholder="Örn: A Rh+"/></div>
                <div><label className="text-red-200 text-xs font-bold uppercase">Kronik Hastalıklar</label><input type="text" value={profile.chronicDiseases} onChange={(e) => setProfile({...profile, chronicDiseases: e.target.value})} className="w-full bg-red-700 text-white p-2 rounded-lg font-bold placeholder-red-400 outline-none" placeholder="Örn: Şeker, Astım"/></div>
                <div><label className="text-red-200 text-xs font-bold uppercase">Alerjiler</label><input type="text" value={profile.allergies} onChange={(e) => setProfile({...profile, allergies: e.target.value})} className="w-full bg-red-700 text-white p-2 rounded-lg font-bold placeholder-red-400 outline-none" placeholder="Örn: Penisilin"/></div>
              </div>
              <p className="text-xs text-red-200 mt-4 text-center">Bu bilgiler acil durumda sağlık ekipleri içindir.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border">
              <h3 className="font-black text-xl mb-4 text-gray-800">İletişim Ayarları</h3>
              <div className="space-y-4">
                <div><label className="block font-bold mb-1 text-gray-600">Adınız Soyadınız</label><input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" placeholder="Ahmet Yılmaz"/></div>
                <div><label className="block font-bold mb-1 text-gray-600">Doktor WhatsApp No</label><input type="tel" value={profile.doctorPhone} onChange={(e) => setProfile({...profile, doctorPhone: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" placeholder="905551234567"/></div>
                <div className="bg-red-50 p-3 rounded-xl border border-red-200"><label className="block font-black mb-1 text-red-800">🚨 Yakın Numarası (SOS)</label><input type="tel" value={profile.sosPhone} onChange={(e) => setProfile({...profile, sosPhone: e.target.value})} className="w-full p-3 border border-red-300 rounded-xl bg-white" placeholder="05321234567"/><p className="text-xs text-red-600 mt-1 font-bold">Yukarıdaki SOS butonuna basıldığında aranır.</p></div>
              </div>
            </div>

            <button onClick={clearAllData} className="w-full bg-red-100 text-red-700 py-3 rounded-xl font-bold border border-red-300 active:bg-red-200 transition-colors shadow-sm">
              🗑️ {currentUser.name.split(' ')[0]} Verilerini Sıfırla
            </button>
          </div>
        )}
      </div>

      {/* --- ALT NAVİGASYON --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-50">
        <div className="max-w-md mx-auto grid grid-cols-5 text-center py-2 pb-safe gap-1 px-1">
          <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center justify-center w-full h-full p-1 ${activeTab === 'home' ? 'text-blue-600' : 'text-gray-400'}`}>
            <span className="text-2xl mb-1">🏠</span><span className="text-[10px] font-black leading-tight">Ana Ekran</span>
          </button>
          <button onClick={() => setActiveTab('history')} className={`flex flex-col items-center justify-center w-full h-full p-1 ${activeTab === 'history' ? 'text-blue-600' : 'text-gray-400'}`}>
            <span className="text-2xl mb-1">📊</span><span className="text-[10px] font-black leading-tight">Raporlar</span>
          </button>
          <button onClick={() => setActiveTab('meds')} className={`flex flex-col items-center justify-center w-full h-full p-1 ${activeTab === 'meds' ? 'text-yellow-600' : 'text-gray-400'}`}>
            <span className="text-2xl mb-1">💊</span><span className="text-[10px] font-black leading-tight">İlaçlar</span>
          </button>
          <button onClick={() => setActiveTab('appointments')} className={`flex flex-col items-center justify-center w-full h-full p-1 ${activeTab === 'appointments' ? 'text-purple-600' : 'text-gray-400'}`}>
            <span className="text-2xl mb-1">🏥</span><span className="text-[10px] font-black leading-tight">Randevu</span>
          </button>
          <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center justify-center w-full h-full p-1 ${activeTab === 'profile' ? 'text-red-600' : 'text-gray-400'}`}>
            <span className="text-2xl mb-1">⚕️</span><span className="text-[10px] font-black leading-tight">Profil</span>
          </button>
        </div>
      </div>
    </div>
  );
}