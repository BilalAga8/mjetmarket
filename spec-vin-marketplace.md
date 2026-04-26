# Specifikacion Teknik — VIN Tool + Marketplace Pjesësh
> Kopjo këtë dokument dhe dërgo te Claude Code. Çdo seksion është i pavarur dhe mund të dërgohet veç.

---

## KONTEKSTI I PROJEKTIT

Projekti është `shitetmakina` — Next.js 14 + Supabase + Tailwind. Faqja shet makina, pjesë këmbimi dhe lidh klientët me servise. Kodi ekzistues:
- `/app/pjese-kembimi/` — faqja aktuale e pjesëve me ikonat e kategorive
- `/components/PartRequestForm.tsx` — forma ekzistuese për kërkimin e pjesëve (NUK NDRYSHOHET)
- `/data/partCategories.ts` — lista e kategorive ekzistuese
- Supabase tabela `part_requests` — ruan kërkesat e klientëve

---

## PJESA 1 — TABELA E RE NË SUPABASE: `products`

Krijo tabelën e mëposhtme në Supabase (SQL):

```sql
create table products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  oem_code text,
  category text not null,
  quality text not null check (quality in ('oem', 'ekuivalente', 'ekonomike')),
  photo_key text,
  compatible_makes text[] default '{}',
  compatible_models text[] default '{}',
  year_from integer,
  year_to integer,
  price_from numeric(10,2),
  price_to numeric(10,2),
  shops_count integer default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);
```

Aktivizo RLS dhe shto policy:
```sql
alter table products enable row level security;
create policy "Public read" on products for select using (is_active = true);
create policy "Admin full" on products for all using (auth.role() = 'authenticated');
```

---

## PJESA 2 — FAQJA E RE: `/kontrollo` (VIN Tool i pavarur)

### Çfarë duhet të bëjë:
Klienti fut numrin e shasisë (VIN) → faqja tregon të dhënat e makinës + rekomandimet falas (vaji, filtrat, kanta e gomave, intervali servisit) + tre butonave CTA.

### Krijo skedarët:
- `/app/kontrollo/page.tsx` — Server component
- `/app/kontrollo/VinClient.tsx` — Client component me logjikën

### API i VIN (FALAS — pa API key):
```
https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/{VIN}?format=json
```

Nga ky API merr fushat:
- `Make` → marka
- `Model` → modeli
- `Model Year` → viti
- `Engine Configuration` → motori
- `Fuel Type - Primary` → karburanti
- `Transmission Style` → kambja
- `Displacement (L)` → cilindrata

### Logjika e Rekomandimeve (statike bazuar në të dhënat e VIN):

Krijo funksionin `getRecommendations(make, model, year, fuelType)` që kthen:

```typescript
interface Recommendations {
  engineOil: { type: string; viscosity: string; liters: number }
  oilFilter: string
  airFilter: string
  tireSize: string
  serviceInterval: string
  gearboxOil: string
}
```

Tabela statike e rekomandimeve (shembuj për markat kryesore):

```typescript
const oilMap: Record<string, { viscosity: string; liters: number; type: string }> = {
  "BMW_diesel":      { viscosity: "5W-30 Longlife", liters: 4.5, type: "LL-04" },
  "BMW_benzine":     { viscosity: "5W-30 Longlife", liters: 5.0, type: "LL-01" },
  "MERCEDES_diesel": { viscosity: "5W-30 229.51",   liters: 6.5, type: "MB 229.51" },
  "MERCEDES_benzine":{ viscosity: "5W-40 229.5",    liters: 7.0, type: "MB 229.5" },
  "VOLKSWAGEN_diesel":{ viscosity: "5W-30 504/507", liters: 4.3, type: "VW 507.00" },
  "VOLKSWAGEN_benzine":{ viscosity: "5W-40 502",    liters: 4.5, type: "VW 502.00" },
  "AUDI_diesel":     { viscosity: "5W-30 504/507",  liters: 4.5, type: "VW 507.00" },
  "AUDI_benzine":    { viscosity: "5W-40 502",      liters: 5.0, type: "VW 502.00" },
  "TOYOTA_diesel":   { viscosity: "5W-30",          liters: 4.5, type: "ACEA A5/B5" },
  "TOYOTA_benzine":  { viscosity: "0W-20",          liters: 4.2, type: "Toyota WS" },
  "DEFAULT":         { viscosity: "5W-40",          liters: 4.5, type: "ACEA A3/B4" },
}
```

Intervali servisit sipas markës (i paracaktuar):
- BMW, Mercedes, Audi, VW: çdo 15,000 km ose 1 vit
- Toyota, Honda, Hyundai: çdo 10,000 km ose 1 vit
- Të tjera: çdo 10,000 km ose 1 vit

### UI i faqes `/kontrollo`:

**Seksioni 1 — Hero me VIN input:**
- Titull: "Kontrollo Makinën Tënde — Falas"
- Nëntitull: "Fut numrin e shasisë dhe merr rekomandimet e plota të servisit, pa pagesë."
- Input VIN (font monospace) + buton "Kontrollo"
- Nën input: tekst i vogël "Gjendet në kartën gri të regjistrimit ose brenda derës së shoferit"

**Seksioni 2 — Pas VIN të vlefshëm (shfaqet pasi API kthen të dhëna):**

Dy kolona:
- **Kolona e majtë** — "Të dhënat e mjetit": marka, modeli, viti, motori, karburanti, kambja — si tabelë me rreshta
- **Kolona e djathtë** — "Rekomandimet falas": 5 karta me:
  - Vaji i motorrit (tipi + viskoziteti + sasia)
  - Filtri i vajit (kodi OEM rekomandues)
  - Filtri i ajrit (kodi OEM rekomandues)
  - Kanta e gomave (nëse disponohet nga VIN)
  - Intervali i servisit

**Seksioni 3 — Tre CTA butonë:**
- "Porosit Pjesë" → `/pjese-kembimi?vin={VIN}&make={make}&model={model}&year={year}`
- "Gjej Servis" → shfaq listën e serviseve (data nga Supabase tabela `services`)
- "Shpërnda Raportin" → `navigator.share` ose kopjo URL me parametrat

**Seksioni 4 — Gabim nëse VIN i pavlefshëm:**
- Mesazh: "VIN-i nuk u njoh. Kontrollo nëse e ke shtypur saktë ose plotëso të dhënat manualisht."
- Shfaq form manual: marka + modeli + viti + karburant

**Shënim i rëndësishëm:** VIN duhet të jetë 17 karaktere. Valido në frontend para se të bësh fetch.

### Meta tags për SEO (shto në `page.tsx`):
```typescript
export const metadata = {
  title: "Kontrollo Makinën me VIN — Falas | ShitetMakina",
  description: "Fut numrin e shasisë dhe merr menjëherë rekomandimet e vajit, filtrave dhe servisit për makinën tënde. Falas, pa regjistrim.",
}
```

---

## PJESA 3 — UPDATE FAQJA `/pjese-kembimi` (Marketplace me Kartela)

### Çfarë ndryshon:
Faqja aktuale tregon ikona kategorish. Duhet të shfaqë **kartelat e produkteve** nga tabela `products`, me filtrim sipas VIN.

### Ndryshimet në `/app/pjese-kembimi/page.tsx` (Server Component):

Shto fetch nga Supabase:
```typescript
const { data: products } = await supabase
  .from("products")
  .select("*")
  .eq("is_active", true)
  .order("created_at", { ascending: false })
```

Kalos `products` te `PjeseKembimiClient`.

### Ndryshimet në `/app/pjese-kembimi/PjeseKembimiClient.tsx`:

**Shto state të ri:**
```typescript
const [vin, setVin] = useState("")
const [vinData, setVinData] = useState<VinData | null>(null)
const [vinLoading, setVinLoading] = useState(false)
const [filterCategory, setFilterCategory] = useState("")
const [filterQuality, setFilterQuality] = useState("")
```

**Lexo parametrat URL** (sepse `/kontrollo` dërgon VIN + make/model/year):
```typescript
// Në useEffect lexo searchParams dhe pre-plotëso VIN nëse vjen nga /kontrollo
```

**VIN Bar në krye të faqes** (para gridës së kategorive ekzistuese):
- Input VIN + buton "Kontrollo makinën time"
- Pas konfirmimit shfaq: badge me të dhënat e makinës (p.sh. "BMW 320d 2013 ✓")
- Fshih ikonat e kategorive dhe shfaq **kartelat e produkteve** të filtruar

**Filtrim i produkteve pas VIN:**
```typescript
const filteredProducts = vinData
  ? products.filter(p =>
      (p.compatible_makes.length === 0 || p.compatible_makes.includes(vinData.make.toUpperCase())) &&
      (p.year_from === null || vinData.year >= p.year_from) &&
      (p.year_to === null || vinData.year <= p.year_to) &&
      (filterCategory === "" || p.category === filterCategory) &&
      (filterQuality === "" || p.quality === filterQuality)
    )
  : products.filter(p =>
      (filterCategory === "" || p.category === filterCategory) &&
      (filterQuality === "" || p.quality === filterQuality)
    )
```

**Foto gjenerike sipas kategorisë:**
Krijo funksionin `getCategoryPhoto(category: string): string` që kthen URL-in e fotos gjenerike nga `/public/parts/` sipas kategorisë. Shembull:
```typescript
const categoryPhotos: Record<string, string> = {
  "Filtri i vajit":      "/parts/oil-filter.jpg",
  "Filtri i ajrit":      "/parts/air-filter.jpg",
  "Kantuna frenave":     "/parts/brake-pads.jpg",
  "Disqe freni":         "/parts/brake-discs.jpg",
  "Amortizator":         "/parts/shock-absorber.jpg",
  "Remen":               "/parts/timing-belt.jpg",
  "DEFAULT":             "/parts/generic-part.jpg",
}
```

**Kartela e produktit** — shfaq për çdo produkt:
```
┌─────────────────────────┐
│ [FOTO 120px lartësi]    │
│  Badge "Përshtatet" ✓   │
├─────────────────────────┤
│ Emri i produktit        │
│ Kodi OEM · Cilësia      │
│ ● 4 dyqane ofertojnë    │
│                         │
│ nga  [12 – 28 €]        │
│           [Kërko Ofertë]│
└─────────────────────────┘
```

Buton "Kërko Ofertë" → hap modalin ekzistues `PartRequestForm` me:
- `preselectedPart={product.name}`
- VIN i paracaktuar nga state `vin`
- Marka/modeli/viti të paracaktuara nga `vinData`

**Kartela e fundit gjithmonë** (kartela "+" me border me vija):
- "Nuk gjen pjesën? Kërko manualisht →"
- Hap `PartRequestForm` bosh

**Sidebar filtrash** (majtas):
- Kategoria (dropdown ose lista me radio buttons)
- Cilësia: OEM / Ekuivalente / Ekonomike
- Disponueshmëria (për fazën e dytë)

**Nëse nuk ka produkte të shtuara ende:**
- Trego ikonat e kategorive ekzistuese (fallback si tani)
- Shto mesazh të vogël: "Produktet po shtohen së shpejti"

---

## PJESA 4 — ADMIN PANEL: `/admin/produktet` (Menaxhimi i Produkteve)

### Krijo skedarët:
- `/app/admin/produktet/page.tsx`

### Funksionaliteti:

**Lista e produkteve** — tabelë me kolonat:
- Foto (thumbnail 40x40)
- Emri + Kodi OEM
- Kategoria
- Cilësia (badge me ngjyrë: OEM=blu, Ekuivalente=portokalli, Ekonomike=gri)
- Kompatibliteti (p.sh. "BMW, Mercedes · 2010-2020")
- Çmimi nga-deri
- Aktiv (toggle)
- Buton "Edito" + "Fshij"

**Modal Shto/Edito produkt** — forma me fushat:
- Emri i produktit (input text) *
- Kodi OEM (input text)
- Kategoria (select nga lista e `partCategories`) *
- Cilësia (select: OEM / Ekuivalente / Ekonomike) *
- Foto — select nga lista e paracaktuar sipas kategorisë (NUK ka upload, foto janë statike)
- Marka të përshtatshme (input me tags: BMW, Mercedes, VW, Audi, Toyota, etj. — ose bosh = të gjitha)
- Modele të përshtatshme (input me tags — ose bosh = të gjitha)
- Viti nga — Viti deri (input number)
- Çmimi nga (€) — Çmimi deri (€)
- Numri i dyqaneve që ofertojnë (input number — për display)
- Aktiv (checkbox)

**Stilimi:** Ndiqe stilin ekzistues të admin panelit (dark theme: bg-gray-900, border-gray-800, text-white, buton green-500).

---

## PËRMBLEDHJE E SKEDARËVE QË KRIJOHEN/NDRYSHOHEN

| Veprim | Skedari |
|--------|---------|
| KRIJO | `/app/kontrollo/page.tsx` |
| KRIJO | `/app/kontrollo/VinClient.tsx` |
| KRIJO | `/app/admin/produktet/page.tsx` |
| NDRYSHO | `/app/pjese-kembimi/page.tsx` — shto fetch produkteve |
| NDRYSHO | `/app/pjese-kembimi/PjeseKembimiClient.tsx` — shto VIN bar + kartelat |
| KRIJO | `/public/parts/` — shto foto gjenerike (ose placeholder) |
| SUPABASE | Krijo tabelën `products` me SQL-in e mësipërm |

---

## RENDI I REKOMANDUAR I IMPLEMENTIMIT

1. Krijo tabelën `products` në Supabase
2. Krijo `/admin/produktet` — shto disa produkte test
3. Update `/pjese-kembimi` me kartelat
4. Krijo `/kontrollo` (VIN Tool i pavarur)
5. Foto gjenerike — vendos placeholder derisa ke foto reale

---

*Spec i përgatitur për ShitetMakina — Prill 2026*
