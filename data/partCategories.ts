export interface PartCategory {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  description: string;
}

export const partCategories: PartCategory[] = [
  { id: "filtro-vaji",       name: "Filtro Vaji",         nameEn: "Oil Filter",         icon: "🛢️",  description: "Filtro për ndërrimin e vajit" },
  { id: "filtro-ajri",       name: "Filtro Ajri",         nameEn: "Air Filter",         icon: "💨",  description: "Filtro e sistemit të ajrit" },
  { id: "filtro-kabine",     name: "Filtro Kabine",       nameEn: "Cabin Filter",       icon: "🌬️",  description: "Filtro e klimës dhe kabinës" },
  { id: "filtro-karburanti", name: "Filtro Karburanti",   nameEn: "Fuel Filter",        icon: "⛽",  description: "Filtro e sistemit të karburantit" },
  { id: "disqe-frenash",     name: "Disqe Frenash",       nameEn: "Brake Discs",        icon: "⭕",  description: "Disqe për sistemin e frenimit" },
  { id: "cubeta-frenash",    name: "Cubeta Frenash",      nameEn: "Brake Pads",         icon: "🔲",  description: "Cubeta për sistemin e frenimit" },
  { id: "rripa-timing",      name: "Rripa Timing",        nameEn: "Timing Belt/Chain",  icon: "🔗",  description: "Rripa ose zinxhiri i timing-ut" },
  { id: "rripa-alternatori", name: "Rripa Alternatori",   nameEn: "Serpentine Belt",    icon: "〰️",  description: "Rripa i alternatorit dhe pompës" },
  { id: "bateri",            name: "Bateri",              nameEn: "Battery",            icon: "🔋",  description: "Bateri makinash" },
  { id: "kandele",           name: "Kandele",             nameEn: "Spark Plugs",        icon: "⚡",  description: "Kandele ndezjeje" },
  { id: "amortizatore",      name: "Amortizatore",        nameEn: "Shock Absorbers",    icon: "🔩",  description: "Amortizatore dhe sustë" },
  { id: "rotula",            name: "Rotula",              nameEn: "Ball Joints",        icon: "⚙️",  description: "Rotula dhe nyje tingulli" },
  { id: "boshti",            name: "Boshti",              nameEn: "CV Axle / Driveshaft", icon: "↔️", description: "Boshti transmetimit dhe kapat" },
  { id: "pompe-uji",         name: "Pompë Uji",           nameEn: "Water Pump",         icon: "💧",  description: "Pompë e sistemit të ftohjes" },
  { id: "termostati",        name: "Termostati",          nameEn: "Thermostat",         icon: "🌡️",  description: "Termostat i motorit" },
  { id: "radiatori",         name: "Radiatori",           nameEn: "Radiator",           icon: "♨️",  description: "Radiator dhe pjesë ftohëse" },
  { id: "ventilatori",       name: "Ventilatori",         nameEn: "Cooling Fan",        icon: "🌀",  description: "Ventilator i radiatorit" },
  { id: "alternatori",       name: "Alternatori",         nameEn: "Alternator",         icon: "🔌",  description: "Alternator i makinës" },
  { id: "starterin",         name: "Starterin",           nameEn: "Starter Motor",      icon: "🔑",  description: "Motor starter" },
  { id: "pompe-karburanti",  name: "Pompë Karburanti",    nameEn: "Fuel Pump",          icon: "🔧",  description: "Pompë e karburantit" },
  { id: "inxhektore",        name: "Inxhektore",          nameEn: "Injectors",          icon: "💉",  description: "Inxhektore karburanti" },
  { id: "sensoret",          name: "Sensorë",             nameEn: "Sensors",            icon: "📡",  description: "Sensorë të ndryshëm (lambda, ABS, etj.)" },
  { id: "llambat",           name: "Llamba",              nameEn: "Bulbs & Lights",     icon: "💡",  description: "Llamba dhe ndriçim" },
  { id: "pasqyrat",          name: "Pasqyrat",            nameEn: "Mirrors",            icon: "🪞",  description: "Pasqyra anësore dhe brendshme" },
  { id: "zhveshja",          name: "Zhveshja",            nameEn: "Brake Shoes",        icon: "🛞",  description: "Zhveshje frenash (tambur)" },
];
