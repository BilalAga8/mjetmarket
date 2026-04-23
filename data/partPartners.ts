export interface PartPartner {
  id: string;
  name: string;
  city: string;
  discount: number;
  phone: string;
  logo: string;
}

export const partPartners: PartPartner[] = [
  { id: "A", name: "AutoParts Tirana",   city: "Tiranë",  discount: 10, phone: "+355 69 111 1111", logo: "AP" },
  { id: "B", name: "SpeedParts Albania", city: "Durrës",  discount: 5,  phone: "+355 68 222 2222", logo: "SP" },
  { id: "C", name: "Mekanik Pro",        city: "Tiranë",  discount: 15, phone: "+355 67 333 3333", logo: "MP" },
  { id: "D", name: "AL Auto Spare",      city: "Shkodër", discount: 20, phone: "+355 69 444 4444", logo: "AA" },
];
