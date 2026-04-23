export type ServiceCategory =
  | "Servis Mekanik"
  | "Elektrik & Elektronikë"
  | "Bojaxhi"
  | "Veshje & Tapeçi"
  | "Xhama"
  | "Aksesore"
  | "Tjetër";

export type Service = {
  id: number;
  name: string;
  category: ServiceCategory;
  city: string;
  address: string;
  phone: string;
  website: string;
  verified: boolean;
  logo: string;
  description: string;
};

export const services: Service[] = [
  {
    id: 1,
    name: "Servis A&B",
    category: "Servis Mekanik",
    city: "Tiranë",
    address: "Rruga Dritan Hoxha, nr. 12",
    phone: "069 111 2233",
    website: "servisab.al",
    verified: true,
    logo: "AB",
    description: "Servis i përgjithshëm mekanik për të gjitha markat",
  },
  {
    id: 2,
    name: "Xhenerike Juli Motorrist",
    category: "Servis Mekanik",
    city: "Durrës",
    address: "Lagjia 1, Rruga Tregtare, nr. 45",
    phone: "068 222 3344",
    website: "",
    verified: true,
    logo: "JM",
    description: "Specializuar në motor dhe transmision",
  },
  {
    id: 3,
    name: "Xhenerik Edi Elektroauto",
    category: "Elektrik & Elektronikë",
    city: "Tiranë",
    address: "Rruga e Kavajës, nr. 89",
    phone: "067 333 4455",
    website: "elektroauto.al",
    verified: true,
    logo: "EE",
    description: "Sisteme elektrike, diagnozë kompjuterike, airbag",
  },
  {
    id: 4,
    name: "ColorPro Bojaxhi",
    category: "Bojaxhi",
    city: "Tiranë",
    address: "Autostrada Tiranë-Durrës, km 3",
    phone: "069 444 5566",
    website: "colorpro.al",
    verified: true,
    logo: "CP",
    description: "Rikolorim profesional, ndreqje karoserie dhe zingozim",
  },
  {
    id: 5,
    name: "LederAuto Veshje",
    category: "Veshje & Tapeçi",
    city: "Tiranë",
    address: "Rruga Myslym Shyri, nr. 34",
    phone: "066 555 6677",
    website: "",
    verified: false,
    logo: "LA",
    description: "Veshje sedilje me lëkurë, tapeçi, plafone dhe dysheme",
  },
  {
    id: 6,
    name: "ClearView Xhama",
    category: "Xhama",
    city: "Shkodër",
    address: "Rruga 28 Nëntorit, nr. 7",
    phone: "065 666 7788",
    website: "",
    verified: false,
    logo: "CV",
    description: "Zëvendësim dhe ngjim xhamash, xhama të zinj profesional",
  },
  {
    id: 7,
    name: "AutoStyle Aksesore",
    category: "Aksesore",
    city: "Tiranë",
    address: "Qendra Tregtare TEG, kati 0",
    phone: "069 777 8899",
    website: "autostyle.al",
    verified: true,
    logo: "AS",
    description: "Aksesore makinash, sisteme audio, kamera, alarm dhe tuning",
  },
];
