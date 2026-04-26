# Specifikacion Teknik — Marketplace Dyqanesh (Panel + Sistemi i Ofertave)
> Kopjo këtë dokument dhe dërgo te Claude Code. Implemento hap pas hapi, konfirmo çdo pjesë para se të vazhdosh.

---

## KONTEKSTI DHE RRJEDHA E PLOTË

```
Klienti plotëson formular (PartRequestForm ekzistues)
       ↓
Kërkesa ruhet në tabelën `part_requests` (ekziston)
       ↓
Dyqanet hyjnë në panelin e tyre → shohin të gjitha kërkesat e hapura
       ↓
Çdo dyqan dërgon ofertën e tij (çmim + kohë dorëzimi + shënim)
       ↓
Admini (pronari) sheh të gjitha ofertat për çdo kërkesë
       ↓
Admini zgjedh ofertën më të mirë dhe kontakton klientin
       ↓
Pagesa: Cash ose MoneyGram (jashtë platformës)
```

**Rëndësishme:**
- Admini krijon llogaritë e dyqaneve dhe u dërgon kredencialet — dyqanet NUK regjistrohen vetë
- Dyqanet shohin të gjitha kërkesat (jo vetëm kategoritë e tyre)
- Admini është gjithmonë në mes — konfirmon çdo ofertë para klientit
- Nuk ka sistem pagese online (për momentin)

---

## PJESA 1 — TABELA E RE NË SUPABASE: `shop_offers`

```sql
create table shop_offers (
  id uuid default gen_random_uuid() primary key,
  request_id uuid not null references part_requests(id) on delete cascade,
  shop_id uuid not null references auth.users(id),
  shop_name text not null,
  price numeric(10,2) not null,
  delivery_days integer not null,
  notes text,
  status text not null default 'pritje' check (status in ('pritje', 'zgjedhur', 'refuzuar')),
  created_at timestamptz default now()
);
```

```sql
alter table shop_offers enable row level security;

-- Dyqani sheh dhe menaxhon vetëm ofertat e veta
create policy "Shop sees own offers" on shop_offers
  for select using (auth.uid() = shop_id);

create policy "Shop inserts own offers" on shop_offers
  for insert with check (auth.uid() = shop_id);

create policy "Shop updates own offers" on shop_offers
  for update using (auth.uid() = shop_id);

-- Admini sheh gjithçka (përdor service role key nga server)
```

---

## PJESA 2 — TABELA E RE NË SUPABASE: `shop_profiles`

Ruan informacionin e dyqanit të lidhur me llogarinë Supabase Auth.

```sql
create table shop_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  city text,
  phone text,
  categories text[] default '{}',
  is_active boolean default true,
  created_at timestamptz default now()
);
```

```sql
alter table shop_profiles enable row level security;

create policy "Shop reads own profile" on shop_profiles
  for select using (auth.uid() = id);

create policy "Shop updates own profile" on shop_profiles
  for update using (auth.uid() = id);
```

---

## PJESA 3 — ADMIN: KRIJIMI I LLOGARIVE TË DYQANEVE

### Shto funksionalitet në `/app/admin/dyqanet/page.tsx` (ekziston):

Shto buton **"Krijo Llogari Dyqani"** pranë butonit ekzistues "+ Shto Partner".

**Modal i ri "Krijo Llogari Dyqani"** me fushat:
- Emri i dyqanit (input text) *
- Email (input email) * — do jetë username për login
- Fjalëkalimi (input password) * — admini e cakton
- Qyteti (input text)
- Telefoni (input text)

**Logjika e krijimit (Server Action):**
```typescript
// Përdor Supabase Admin client (service role key) — JO browser client
// 1. Krijo user në Supabase Auth
const { data: user } = await supabaseAdmin.auth.admin.createUser({
  email: form.email,
  password: form.password,
  email_confirm: true,
})

// 2. Shto profil në shop_profiles
await supabaseAdmin.from("shop_profiles").insert({
  id: user.user.id,
  name: form.name,
  city: form.city,
  phone: form.phone,
})
```

**Pas krijimit të suksesshëm** — shfaq mesazhin:
> "Llogaria u krijua. Kredencialet: Email: [email] · Fjalëkalimi: [password] — Dërgo këto te dyqani."

**Lista e dyqaneve** — shto në fund të faqes `/admin/dyqanet` një seksion të ri:
"Llogaritë e Dyqaneve" me tabelë: Emri · Qyteti · Email · Aktiv · Buton "Çaktivizo"

---

## PJESA 4 — PANELI I DYQANIT: `/dyqani`

### Krijo skedarët:
- `/app/dyqani/layout.tsx` — layout me navbar të thjeshtë + logout
- `/app/dyqani/page.tsx` — redirect te `/dyqani/kerkesat`
- `/app/dyqani/kerkesat/page.tsx` — lista e kërkesave
- `/app/dyqani/ofertat-e-mia/page.tsx` — ofertat e dërguara

### `/app/dyqani/layout.tsx`:

Kontrollo që user-i është i loguar. Nëse jo → redirect te `/dyqani/login`.
Nëse është loguar por është admin → redirect te `/admin`.

Navbar i thjeshtë (i ndryshëm nga admin paneli):
- Logo "ShitetMakina" në të majtë (jeshile)
- Lidhjet: "Kërkesat" · "Ofertat e Mia"
- Djathtas: emri i dyqanit + buton "Dil"
- Stilim: i bardhë (NUK është dark theme si admin paneli)

### `/app/dyqani/login/page.tsx`:

Faqe e thjeshtë login me email + fjalëkalim.
- Titull: "Hyr në Panelin e Dyqanit"
- Pas login të suksesshëm → redirect te `/dyqani/kerkesat`
- Nëse gabon → mesazh: "Email ose fjalëkalim i gabuar"
- NUK ka "Harrova fjalëkalimin" (admini e rivendos)

### `/app/dyqani/kerkesat/page.tsx`:

**Server Component** — merr të gjitha kërkesat e hapura:
```typescript
const { data: requests } = await supabase
  .from("part_requests")
  .select("*, shop_offers(id, shop_id)")
  .eq("status", "pritje") // vetëm kërkesat e hapura
  .order("created_at", { ascending: false })
```

Kalos te Client Component `KerkestatClient`.

### `KerkestatClient.tsx`:

**Statistikat në krye (3 karta):**
- Kërkesa të hapura (numri total)
- Ofertat e mia sot
- Ofertat e pranuara total

**Lista e kërkesave** — çdo kërkesë si kartë (NUK tabelë, është mobile-friendly):

```
┌─────────────────────────────────────┐
│ BMW 320d · 2013          [E RE] 🔵  │
│ Filtri i vajit · OEM                │
│ ─────────────────────────────────── │
│ VIN: WBA3A5G5X...   📅 26 Prill     │
│ Shënime: urgjent, duhet sot         │
│                                     │
│ [Unë kam ofertuar: 28€ ✓]           │
│           OSE                       │
│           [Dërgo Ofertën →]         │
└─────────────────────────────────────┘
```

**Badge statusi i kartës:**
- 🔵 "E re" — nuk ka ofertuar ky dyqan
- 🟡 "Ofertuar" — ky dyqan ka dërguar ofertë (trego çmimin)
- 🟢 "Fituar" — oferta e këtij dyqani u zgjodh nga admini
- ⚫ "Mbyllur" — kërkesa u mbyll

**VIN i produktit** — trego vetëm 8 karakteret e para + "..." (për privatësi)

**Modal "Dërgo Ofertën"** — hapet kur klikon butonin:

```
┌──────────────────────────────────┐
│ Oferto për BMW 320d — Filtri vajit│
│                                  │
│ Çmimi (€) *                      │
│ [_______]                        │
│                                  │
│ Koha e dorëzimit *               │
│ ○ Sot    ○ 1-2 ditë   ○ 3-5 ditë │
│                                  │
│ Shënim (opsional)                │
│ [_______________________________] │
│                                  │
│ [Anulo]        [Dërgo Ofertën →] │
└──────────────────────────────────┘
```

Pas dërgimit → insert në `shop_offers` → karta shfaq "Ofertuar: [çmimi] €".

Dyqani mund të dërgojë **vetëm një ofertë** për çdo kërkesë. Nëse ka ofertuar tashmë → buton "Ndrysho Ofertën" (update, jo insert).

### `/app/dyqani/ofertat-e-mia/page.tsx`:

Tabelë e thjeshtë me të gjitha ofertat e dërguara nga ky dyqan:
- Kërkesa (marka + modeli + pjesa)
- Çmimi i ofertuar
- Data e dërgimit
- Statusi (Pritje / Zgjedhur ✓ / Refuzuar)

Filtra: Të gjitha · Pritje · Zgjedhur · Refuzuar

---

## PJESA 5 — UPDATE ADMIN PANEL: Shto Ofertat në `/admin/pjeset`

Faqja ekzistuese `/admin/pjeset/page.tsx` tregon kërkesat. Duhet shtuar pamja e ofertave.

### Në modalin e detajeve (ekziston tashmë) shto seksionin "Ofertat e Dyqaneve":

```typescript
// Merr ofertat për kërkesën e zgjedhur
const { data: offers } = await supabase
  .from("shop_offers")
  .select("*")
  .eq("request_id", selected.id)
  .order("price", { ascending: true }) // rendit nga çmimi më i lirë
```

**Shfaqja e ofertave** brenda modalit të detajeve:

```
OFERTAT E DYQANEVE (3 oferta)
─────────────────────────────
🥇 AutoParts Tirana    28€    1-2 ditë   "kam në stok"    [Zgjidh]
   PartsPro Durrës     35€    3-5 ditë   "OEM origjinale"  [Zgjidh]
   SpeedParts           42€    sot        "dorëzoj vetë"    [Zgjidh]
─────────────────────────────
Nuk ka oferta ende — prit...
```

**Buton "Zgjidh"** — kliko për të zgjedhur ofertën fituese:
1. Update `shop_offers.status = 'zgjedhur'` për ofertën e zgjedhur
2. Update `shop_offers.status = 'refuzuar'` për të gjitha të tjerat
3. Update `part_requests.status = 'proces'`
4. Update `part_requests.assigned_partner` me emrin e dyqanit
5. Update `part_requests.client_price` me çmimin e ofertës

**Pas zgjedhjes** — shfaq konfirmimin:
> "Oferta e AutoParts Tirana (28€) u zgjodh. Kontakto klientin: [numri i telefonit]"

**Badge numri i ofertave** — në listën e kërkesave shto badge të vogël:
- "3 oferta" me ngjyrë jeshile nëse ka oferta
- "Pa oferta" me ngjyrë gri nëse nuk ka

---

## PJESA 6 — NJOFTIM ME EMAIL (OPSIONALE — bëje nëse është e lehtë)

Kur klienti dërgon kërkesë të re → dërgo email te të gjithë dyqanet aktive:

**Subject:** `Kërkesë e re: [Pjesa] për [Marka] [Modeli]`
**Body:**
```
Një klient kërkon: [pjesa]
Mjeti: [marka] [modeli] [viti]
Cilësia: [cilësia]
Hyr në panel dhe dërgo ofertën: https://shitetmakina.al/dyqani/kerkesat
```

Përdor **Resend** (falas deri 100 email/ditë) ose **Supabase Edge Functions**.
Nëse është komplekse — KALON këtë pjesë, nuk është e detyrueshme.

---

## PËRMBLEDHJE E SKEDARËVE QË KRIJOHEN/NDRYSHOHEN

| Veprim | Skedari |
|--------|---------|
| SUPABASE | Krijo tabelën `shop_offers` |
| SUPABASE | Krijo tabelën `shop_profiles` |
| KRIJO | `/app/dyqani/layout.tsx` |
| KRIJO | `/app/dyqani/page.tsx` |
| KRIJO | `/app/dyqani/login/page.tsx` |
| KRIJO | `/app/dyqani/kerkesat/page.tsx` + `KerkestatClient.tsx` |
| KRIJO | `/app/dyqani/ofertat-e-mia/page.tsx` |
| NDRYSHO | `/app/admin/dyqanet/page.tsx` — shto krijimin e llogarive |
| NDRYSHO | `/app/admin/pjeset/page.tsx` — shto seksionin e ofertave |

---

## RENDI I REKOMANDUAR I IMPLEMENTIMIT

1. Krijo tabelat `shop_offers` dhe `shop_profiles` në Supabase
2. Shto krijimin e llogarive në `/admin/dyqanet`
3. Krijo panelin e dyqanit `/dyqani` (layout + login + kerkesat)
4. Update admin panel `/admin/pjeset` me ofertat
5. Testo me një dyqan real: krijo llogari → hyr → oferto → zgjidh nga admin

---

*Spec i përgatitur për ShitetMakina — Prill 2026*
