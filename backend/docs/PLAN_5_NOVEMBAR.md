# Plan do 1. novembra – AI Email Automation Hub

## 🎯 Cilj projekta
Do 5. novembra cilj je imati potpuno funkcionalnu **AI Email Automation Hub** React aplikaciju sa mogućnošću:
- Sinhronizacije mejlova u realnom vremenu  
- Prikazivanja AI analize (klasifikacija, sentiment, preporuke)  
- Kreiranja korisničkih naloga i unosa AI ključeva  
- Testiranja na demo Gmail nalozima  
- Pripreme za online prezentaciju Branislavu

---

## ⚙️ Glavne komponente
1. **Frontend (React + TypeScript + Shcdn)**
   - UI za prikaz mejlova, preporuka i akcija
   - Formular za unos korisničkog AI ključa i naloga
   - Integracija sa backend API-jem (sinhronizacija mejlova)
2. **Backend (Laravel 12)**
   - API rute za prijem i obradu mejlova (TODO: Napraviti Jobs za batch analizu)
   - Povezivanje sa Grok API-jem
   - Autentifikacija i enkripcija korisničkih podataka
3. **AI Servisi**
   - HTML analiza, klasifikacija, sentiment, preporuke (Servisi 1-4)
   - Akcije i sumarizacija (Servisi 5-8)
4. **Database**
   - Spremanje mejlova, korisničkih naloga i akcija
   - Praćenje statusa akcija

---

## 🗓️ Plan po danima

### 🧠 26. oktobar – Postavljanje osnove
- [x] Kreirati React projekat sa osnovnim strukturama (pages, components, services)
- [x] Dodati rutu za login/register
- [x] Konfigurisati `.env` fajl za AI ključeve i API endpoint-e

### ⚙️ 27. oktobar – Sinhronizacija mejlova
- [ ] Implementirati Gmail API konekciju (OAuth2)
- [ ] Testirati preuzimanje i prikaz mejlova u dashboardu
- [ ] Osigurati refresh token i automatsku obnovu sesije

### 🧩 28. oktobar – AI analiza (Servisi 1–4)
- [ ] Implementirati pozive prema Grok API-ju
- [ ] Generisati klasifikaciju, sentiment i preporuke
- [ ] Vizuelno prikazati rezultate analize na frontend-u

### 💬 29. oktobar – Akcije i eskalacija (Servisi 5–6)
- [ ] Dodati mogućnost kreiranja akcija (TODO, follow-up, call)
- [ ] Ugraditi logiku za urgentne mejlove i notifikacije

### 📊 30. oktobar – Praćenje i sumarizacija (Servisi 7–8)
- [ ] Implementirati tracking završetka akcija
- [ ] Generisati dnevni i nedeljni sumarni prikaz
- [ ] Testirati performanse (batch analiza do 40 mejlova)

### 🔧 31. oktobar – Testiranje i priprema prezentacije
- [ ] Testirati sve tokove (login, AI analiza, akcije)
- [ ] Finalni UI polishing (Shcdn stilovi, UX detalji)
- [ ] Snimiti demo video / pripremiti demo sesiju
- [ ] Deploy na Vercel i spremiti link za Branislava

---

## 🧠 Tehnički detalji
- **Frontend:** React + TypeScript + MUI + Axios
- **Backend:** Laravel 12
- **Auth:** JWT + bcrypt (OAuth2 (za Gmail) u sledecoj fazi)
- **AI API:**Grok API (fallback)
- **DB:** MtSQLL
- **Deploy:** Vercel (frontend), Gama Belgrade (backend)

---

## ✅ Završni koraci za Branislava
1. Branislav kreira korisnički nalog
2. Unosi sopstveni AI ključ i povezuje Gmail nalog
3. Pokreće sinhronizaciju i generiše prvi dnevni izvještaj
4. Pregledava dashboard sa preporukama i akcijama
5. Sistem spreman za demonstraciju

---

📅 **Rok:** 5. novembar  
👨‍💻 **Odgovoran:** Ivan Kukić  
🧩 **Verzija:** 1.0  
