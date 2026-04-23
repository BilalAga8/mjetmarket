export type PackageType = "bronze" | "silver" | "gold";

export type Shop = {
  id: number;
  name: string;
  city: string;
  address: string;
  phone: string;
  website: string;
  verified: boolean;
  logo: string;
  package: PackageType;
};

export const shops: Shop[] = [
  {
    id: 1,
    name: "AutoParts Tirana",
    city: "Tiranë",
    address: "Rruga e Kavajës, nr. 142",
    phone: "069 123 4567",
    website: "autoparts-tirana.al",
    verified: true,
    logo: "AP",
    package: "gold",
  },
  {
    id: 2,
    name: "EuroPieces",
    city: "Durrës",
    address: "Bulevardi Epidamn, nr. 34",
    phone: "068 234 5678",
    website: "europieces.al",
    verified: true,
    logo: "EP",
    package: "silver",
  },
  {
    id: 3,
    name: "Motor Shop",
    city: "Shkodër",
    address: "Rruga 13 Dhjetori, nr. 8",
    phone: "067 345 6789",
    website: "",
    verified: false,
    logo: "MS",
    package: "bronze",
  },
  {
    id: 4,
    name: "AlbaParts",
    city: "Vlorë",
    address: "Rruga Sadik Zotaj, nr. 21",
    phone: "066 456 7890",
    website: "albaparts.al",
    verified: true,
    logo: "AL",
    package: "silver",
  },
];
