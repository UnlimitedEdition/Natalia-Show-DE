# UPUTSTVA ZA KORIŠĆENJE REALISTIČNOG SADRŽAJA

Ova dokumentacija objašnjava kako da postavite realističan sadržaj za vaš sajt i kako da ga prilagodite vašim potrebama, uključujući upute za upravljanje sadržajem na sva tri jezika (srpski, engleski i nemački).

## 1. PRIPREMA

1. Otvorite [Supabase Dashboard](https://supabase.com/dashboard)
2. Prijavite se sa vašim Supabase nalogom
3. Selektujte vaš projekat

## 2. IZVRŠAVANJE SQL SKRIPTE

1. Idite na "SQL Editor" sekciju u levom meniju
2. Kliknite na "New query"
3. Otvorite fajl `REALISTIC_CONTENT.sql` koji ste preuzeli sa projekta
4. Kopirajte ceo sadržaj i nalepite ga u SQL editor
5. Kliknite na "Run" dugme

## 3. KREIRANJE ADMIN KORISNIKA

Pošto je SQL skripta već sadrži komande za kreiranje admin korisnika, ali su zakomentarisane zbog sigurnosnih razloga, moraćete da ih ručno izvršite:

1. Selektujte sledeće linije u SQL editoru:

```sql
insert into auth.users (email, encrypted_password, email_confirmed_at)
values (
  'admin@example.com',
  crypt('admin123', gen_salt('bf')),
  now()
);

insert into admin_users (email, password_hash, full_name, is_active)
values (
  'admin@example.com',
  'admin123',
  'Admin User',
  true
);
```

2. Kliknite na "Run" dugme da izvršite ove komande

## 4. PRISTUP ADMIN PANELU

1. Posetite vaš sajt na adresi: `http://your-website.com/admin/auth`
2. Prijavite se sa sledećim kredencijalima:
   - Email: `admin@example.com`
   - Lozinka: `admin123`

## 5. STRUKTURA SADRŽAJA

Realističan sadržaj uključuje sledeće sekcije sa prevodima na sva tri jezika:

1. **Hero sekcija** - Glavni naslov sajta sa pozivom na akciju
2. **Podcast & Izveštaji sekcija** - Najnovije epizode sa detaljima
3. **Romska Veselja sekcija** - Slavlja i kulturni događaji sa brojkama pregleda
4. **Kuhinja sa Gostima sekcija** - Talk show format sa podsekcijama za različite goste
5. **Dijaspora & Balkan sekcija** - Priče koje povezuju dijasporu sa Balkanom
6. **Kontakt sekcija** - Kontakt forma i informacije

## 6. MENJANJE SADRŽAJA

### 6.1. Tekstualni sadržaj

1. U admin panelu kliknite na "Content Manager"
2. Izaberite sekciju koju želite da izmenite
3. Izaberite jezik (sr - srpski, en - engleski, de - nemački)
4. Pronađite sadržaj koji želite da izmenite
5. Kliknite na ikonicu za izmenu (olovka)
6. Unesite novi sadržaj
7. Kliknite na "Save" dugme

### 6.2. Media sadržaj

1. U admin panelu kliknite na "Media Manager"
2. Izaberite sekciju za koju želite da dodate media sadržaj
3. Kliknite na "Add Media" dugme
4. Popunite sledeća polja:
   - Media Type: Izaberite tip medija (image, video, social_video)
   - File URL (za slike i videe) ili Social URL (za YouTube): Unesite URL adresu medija
   - Title: Unesite naslov medija
   - Description: Unesite opis medija
   - Language: Izaberite jezik
   - Metadata: Dodatne informacije (trajanje, broj pregleda, itd.)
5. Kliknite na "Save" dugme

### 6.3. Pozadine sekcija

1. U admin panelu kliknite na "Page Section Manager"
2. Izaberite sekciju za koju želite da promenite pozadinu
3. Unesite URL adrese za pozadinsku sliku i/ili video
4. Kliknite na "Save" dugme

## 7. DODAVANJE PREVODA

Sadržaj je već unet za sva tri jezika (srpski, engleski i nemački). Ako želite da promenite neki prevod ili dodate nove prevode:

1. U "Content Manager" sekciji izaberite sadržaj koji želite da prevedete
2. Iz padajuće liste izaberite jezik na koji želite da prevedete sadržaj
3. Izmenite prevod
4. Kliknite na "Save" dugme

## 8. DODAVANJE REKLAMA

1. U admin panelu kliknite na "Advertisement Manager"
2. Kliknite na "Add Advertisement" dugme
3. Popunite sledeća polja:
   - Title: Naslov reklame
   - Content: Sadržaj reklame (tekst, HTML kod ili URL slike)
   - Position: Pozicija reklame (header, between_sections)
   - Language: Izaberite jezik (sr, en, de)
   - Is Active: Označite ako želite da reklama bude vidljiva
4. Kliknite na "Save" dugme

## 9. DODAVANJE NAJAVA DOGAĐAJA

1. U admin panelu kliknite na "Announcement Manager"
2. Kliknite na "Add Announcement" dugme
3. Popunite sledeća polja:
   - Title: Naslov najave
   - Content: Sadržaj najave
   - Language: Izaberite jezik (sr, en, de)
   - Is Active: Označite ako želite da najava bude vidljiva
4. Kliknite na "Save" dugme

## 10. KORISNI RESURSI

### 10.1. Besplatne slike

- [Unsplash](https://unsplash.com/) - Visokokvalitetne besplatne fotografije
- [Pixabay](https://pixabay.com/) - Besplatne fotografije, ilustracije i vektori
- [Pexels](https://pexels.com/) - Besplatne fotografije
- [Placehold](https://placehold.co/) - Placeholder slike za testiranje

### 10.2. YouTube embed linkovi

Za dodavanje YouTube videa koristite sledeći format:
```
https://www.youtube.com/embed/VIDEO_ID
```

Gde je `VIDEO_ID` deo URL adrese posle `v=` parametra.

Primer:
- Originalna YouTube adresa: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- Embed adresa: `https://www.youtube.com/embed/dQw4w9WgXcQ`

## 11. SIGURNOSNE NAPOMENE

1. Promenite podrazumevanu admin lozinku nakon prvog prijavljivanja
2. Redovno ažurirajte lozinke
3. Nemojte deliti kredencijale sa nepouzdanim osobama
4. Redovno pravite bekape vašeg sajta i baze podataka

## 12. POTENCIJALNI PROBLEMI I REŠENJA

### 12.1. Ne mogu da se prijavim kao admin

**Problem**: Greška pri prijavi sa admin kredencijalima
**Rešenje**: 
1. Proverite da li ste izvršili SQL komande za kreiranje admin korisnika
2. Proverite da li ste ispravno uneli email i lozinku
3. Ako problem i dalje postoji, pokušajte da se registrujete kao novi korisnik putem aplikacije

### 12.2. Ne prikazuju se slike

**Problem**: Slike se ne prikazuju na sajtu
**Rešenje**:
1. Proverite da li su URL adrese slika ispravne
2. Proverite da li slike postoje na zadatoj adresi
3. Proverite da li imate pristup tim slikama (neke slike mogu imati ograničen pristup)

### 12.3. Ne prikazuju se YouTube videi

**Problem**: YouTube videi se ne prikazuju na sajtu
**Rešenje**:
1. Proverite da li koristite ispravan embed format
2. Proverite da li je YouTube video javan
3. Proverite da li vam je internet konekcija stabilna

## 13. DODATNE NAPOMENE

Realističan sadržaj koji smo postavili uključuje:
- Sadržaj koji odražava stvarne teme sajta (podkasti, kulturna dešavanja, intervjui)
- Realistične brojke (broj pregleda, trajanje videa)
- Kontekstualne opise koji pokazuju kako bi stvarni sadržaj izgledao
- Placeholder slike koje ilustruju tip sadržaja koji bi trebalo da se prikaže
- **Prevode na sva tri jezika** (srpski, engleski, nemački)

Ovaj sadržaj služi kao vodič za krajnjeg korisnika kako bi razumeo kako da koristi sistem za dodavanje sopstvenog sadržaja na svim dostupnim jezicima.

## 14. DODATNA POMOĆ

Ako vam je potrebna dodatna pomoć, kontaktirajte vašeg developera ili posetite [Supabase dokumentaciju](https://supabase.com/docs).