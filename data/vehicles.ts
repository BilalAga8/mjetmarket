export type Category = "Makinë" | "Kamion" | "Motor" | "Varkë" | "Trailer" | "Tjetër";

export type Vehicle = {
  id: string | number;
  slug?: string;
  category: Category;
  brand: string;
  model: string;
  year: number;
  price: number;
  image: string;
  images: string[];
  fuel: string;
  km: number;
  hp: number;
  consumption: number;
  origin: string;
  sponsored: boolean;
  featured?: boolean;
  color: string;
  transmission: "Automatik" | "Manual";
  doors?: 2 | 3 | 4 | 5;
  engineCC: number;
  features: string[];
  tireCondition?: number;
  city?: string;
};

export const categoryIcons: Record<Category, string> = {
  "Makinë":  "🚗",
  "Kamion":  "🚛",
  "Motor":   "🏍️",
  "Varkë":   "⛵",
  "Trailer": "🚜",
  "Tjetër":  "🚌",
};

export const vehicles: Vehicle[] = [
  // ── MAKINA ──
  {
    id: 1,
    category: "Makinë",
    brand: "BMW",
    model: "320d",
    year: 2020,
    price: 18500,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
      "https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?w=800",
      "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=800",
      "https://images.unsplash.com/photo-1493238792000-8113da705763?w=800",
    ],
    fuel: "Naftë", km: 85000, hp: 190, consumption: 5.4, origin: "N/A",
    sponsored: true, featured: true, color: "E zezë", transmission: "Automatik", doors: 4, engineCC: 1995,
    features: ["Timon me ngrohje","Sedilje me ngrohje","Ftohje (AC)","Navigacion","Kamera prapa","Sensor parkimi","Bluetooth","Start/Stop automatik","Driver Airbag","Passenger Airbag","Side Airbag","Curtain Airbag","ABS (Anti-lock Brake System)","ESP (Electronic Stability Program)","EPS (Electric Power Steering)","TPMS (Tire Pressure Monitoring System)"],
  },
  {
    id: 2,
    category: "Makinë",
    brand: "Mercedes",
    model: "C200",
    year: 2019,
    price: 21000,
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800",
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800",
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800",
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800",
      "https://images.unsplash.com/photo-1562141961-b8df1586e393?w=800",
    ],
    fuel: "Benzinë", km: 62000, hp: 184, consumption: 6.8, origin: "N/A",
    sponsored: true, color: "E bardhë", transmission: "Automatik", doors: 4, engineCC: 1991,
    features: ["Timon me ngrohje","Sedilje me ngrohje","Sedilje me ftohje","Panoramik","Navigacion","Kamera 360°","Sensor parkimi","Lane assist","Driver Airbag","Passenger Airbag","ABS (Anti-lock Brake System)","ESP (Electronic Stability Program)"],
  },
  {
    id: 3,
    category: "Makinë",
    brand: "Audi",
    model: "A4",
    year: 2021,
    price: 23500,
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800",
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800",
      "https://images.unsplash.com/photo-1548703787-ada2b3d7e582?w=800",
      "https://images.unsplash.com/photo-1611566026373-c6c8da0ea861?w=800",
      "https://images.unsplash.com/photo-1543796076-c0a02ca2a0b3?w=800",
    ],
    fuel: "Naftë", km: 41000, hp: 204, consumption: 5.1, origin: "N/A",
    sponsored: false, color: "E gri", transmission: "Automatik", doors: 4, engineCC: 1968,
    features: ["Timon me ngrohje","Virtual Cockpit","Navigacion","Apple CarPlay / Android Auto","ABS (Anti-lock Brake System)","ESP (Electronic Stability Program)"],
  },
  {
    id: 4,
    category: "Makinë",
    brand: "Volkswagen",
    model: "Golf 7",
    year: 2018,
    price: 13900,
    image: "https://images.unsplash.com/photo-1541443131876-2ed820890a41?w=800",
    images: [
      "https://images.unsplash.com/photo-1541443131876-2ed820890a41?w=800",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800",
    ],
    fuel: "Benzinë", km: 110000, hp: 150, consumption: 7.2, origin: "N/A",
    sponsored: false, color: "E kaltër", transmission: "Manual", doors: 5, engineCC: 1498,
    features: ["Ftohje (AC)","Navigacion","Bluetooth","Apple CarPlay","Cruise control","ABS (Anti-lock Brake System)"],
  },
  // ── KAMIONË ──
  {
    id: 5,
    category: "Kamion",
    brand: "Mercedes-Benz",
    model: "Actros 1845",
    year: 2019,
    price: 65000,
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800",
    images: [
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800",
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    ],
    fuel: "Naftë", km: 320000, hp: 450, consumption: 28.0, origin: "N/A",
    sponsored: true, color: "E bardhë", transmission: "Automatik", engineCC: 12809,
    features: ["Klimë","Navigacion","Cruise control","ABS","ESP","Kabinë gjumi"],
  },
  {
    id: 6,
    category: "Kamion",
    brand: "Volvo",
    model: "FH 500",
    year: 2020,
    price: 72000,
    image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800",
    images: [
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800",
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800",
    ],
    fuel: "Naftë", km: 280000, hp: 500, consumption: 30.0, origin: "N/A",
    sponsored: false, color: "E kuqe", transmission: "Automatik", engineCC: 12777,
    features: ["Klimë","Navigacion","Kamera prapa","ABS","ESP","Kabinë gjumi"],
  },
  // ── MOTORRA ──
  {
    id: 7,
    category: "Motor",
    brand: "Honda",
    model: "CBR 600RR",
    year: 2021,
    price: 8500,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
      "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800",
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800",
      "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800",
    ],
    fuel: "Benzinë", km: 12000, hp: 120, consumption: 6.5, origin: "N/A",
    sponsored: false, color: "E kuqe", transmission: "Manual", engineCC: 599,
    features: ["ABS","Traction Control","Sedilje sportive","Ekran dixhital"],
  },
  {
    id: 8,
    category: "Motor",
    brand: "Yamaha",
    model: "MT-07",
    year: 2022,
    price: 7200,
    image: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800",
    images: [
      "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
      "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800",
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800",
    ],
    fuel: "Benzinë", km: 8000, hp: 73, consumption: 5.2, origin: "N/A",
    sponsored: true, color: "E zezë", transmission: "Manual", engineCC: 689,
    features: ["ABS","Quick Shifter","Ekran dixhital","LED dritat"],
  },
  // ── VARKA ──
  {
    id: 9,
    category: "Varkë",
    brand: "Bayliner",
    model: "VR5",
    year: 2020,
    price: 24000,
    image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800",
    images: [
      "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
      "https://images.unsplash.com/photo-1520390138845-fd2d229dd553?w=800",
      "https://images.unsplash.com/photo-1500514966906-fe245eea9344?w=800",
    ],
    fuel: "Benzinë", km: 150, hp: 175, consumption: 40.0, origin: "N/A",
    sponsored: false, color: "E bardhë", transmission: "Manual", engineCC: 3000,
    features: ["GPS Navigacion","Depth Finder","Stereo","Bimini Top","Anchor"],
  },
  {
    id: 10,
    category: "Varkë",
    brand: "Sea Ray",
    model: "SPX 210",
    year: 2019,
    price: 31000,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
      "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800",
      "https://images.unsplash.com/photo-1500514966906-fe245eea9344?w=800",
      "https://images.unsplash.com/photo-1520390138845-fd2d229dd553?w=800",
    ],
    fuel: "Benzinë", km: 200, hp: 200, consumption: 45.0, origin: "N/A",
    sponsored: true, color: "E bardhë", transmission: "Manual", engineCC: 3500,
    features: ["GPS Navigacion","Stereo","Bimini Top","Wakeboard Tower","Depth Finder"],
  },
  // ── TRAILERA ──
  {
    id: 11,
    category: "Trailer",
    brand: "Schmitz",
    model: "S.KO 24",
    year: 2018,
    price: 18000,
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800",
    images: [
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800",
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800",
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    ],
    fuel: "N/A", km: 0, hp: 0, consumption: 0, origin: "N/A",
    sponsored: false, color: "E gri", transmission: "Manual", engineCC: 0,
    features: ["Kapacitet 24 ton","Dysheme druri","Anët e hapshme","Sistemi frenimit ABS"],
  },
  // ── TË TJERA ──
  {
    id: 12,
    category: "Tjetër",
    brand: "Mercedes-Benz",
    model: "Sprinter 519",
    year: 2020,
    price: 35000,
    image: "https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800",
    images: [
      "https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800",
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800",
    ],
    fuel: "Naftë", km: 95000, hp: 190, consumption: 9.5, origin: "N/A",
    sponsored: false, color: "E bardhë", transmission: "Automatik", engineCC: 2987,
    features: ["Klimë","Navigacion","Kamera prapa","ABS","16 vende ulëse"],
  },
];
