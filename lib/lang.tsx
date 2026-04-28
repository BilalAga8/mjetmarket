"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Lang = "sq" | "en";

export const translations = {
  sq: {
    // Navbar
    nav: {
      home: "Kreu",
      search: "Kërko Makina",
      parts: "Pjesë & Servise",
      vin: "Kontrollo VIN",
      blog: "Blog",
      faq: "FAQ",
      contact: "Kontakt",
      addListing: "+ Shto Njoftim",
      login: "Hyr / Regjistrohu",
      logout: "Dil",
      myProfile: "Profili im",
      closeMenu: "Mbyll menunë",
    },
    // VIN Tool
    vin: {
      badge: "Falas — pa regjistrim",
      title: "Kontrollo Makinën Tënde",
      subtitle: "Fut numrin e shasisë dhe merr rekomandimet e plota të servisit, pa pagesë.",
      placeholder: "p.sh. WBA3A5G5XDNN12345",
      checkBtn: "Kontrollo",
      checking: "Duke kontrolluar...",
      vinHint: "Gjendet në kartën gri të regjistrimit ose brenda derës së shoferit",
      errorLength: "VIN-i duhet të ketë saktësisht 17 karaktere.",
      errorNotFound: "VIN-i nuk u njoh. Kontrollo nëse e ke shtypur saktë ose plotëso të dhënat manualisht.",
      errorNetwork: "Gabim gjatë lidhjes me server-in. Provo përsëri.",
      manualTitle: "Plotëso të dhënat manualisht",
      brand: "Marka",
      model: "Modeli",
      year: "Viti",
      fuelType: "Karburanti",
      petrol: "Benzinë",
      diesel: "Diesel",
      cancel: "Anulo",
      getRecs: "Merr Rekomandimet",
      vehicleData: "Të dhënat e mjetit",
      freeRecs: "Rekomandimet falas",
      engineOil: "Vaji i motorrit",
      serviceInterval: "Intervali i servisit",
      gearboxOil: "Vaji i kambjes",
      orderParts: "Porosit Pjesë",
      filteredFor: "Filtruara për",
      findService: "Gjej Servis",
      serviceNearYou: "Servis pranë teje",
      shareReport: "Shpërnda Raportin",
      copied: "U kopjua!",
      copyLink: "Kopjo link-un",
      trustedServices: "Servise të besuara",
      noServices: "Nuk ka servise të listuara akoma.",
      call: "Telefono",
      emptyState: "Fut VIN-in e makinës tënde dhe kliko \"Kontrollo\" për të parë rekomandimet.",
      estimateTitle: "Vlerësim i përgjithshëm — jo specifik për këtë mjet",
      estimateBody: "Marka e kësaj makine nuk gjendet në bazën tonë të të dhënave. Vlerat e vajit janë standarde dhe mund të mos jenë të sakta për modelin tuaj.",
      estimateTip: "Për saktësi, dërgoni numrin e shasisë te mekaniku ose dyqani i pjesëve.",
      interval15: "Çdo 15,000 km ose 1 vit",
      interval10: "Çdo 10,000 km ose 1 vit",
      gearboxDiesel: "75W-90 GL-4 (ndërrimi çdo 60,000 km)",
      gearboxPetrol: "ATF Dexron VI ose MTF 75W-80 GL-4",
      dieselTipsTitle: "🛢️ Këshilla për mirëmbajtjen e motorit diesel",
      petrolTipsTitle: "⛽ Këshilla për mirëmbajtjen e motorit benzinë",
      manual: "manual",
      vehicleLabels: {
        make: "Marka", model: "Modeli", year: "Viti", body: "Lloji",
        fuel: "Karburanti", displacement: "Cilindrata", cylinders: "Cilindra",
        power: "Fuqia", turbo: "Turbo", transmission: "Kambja",
        speeds: "Marsheset", drive: "Traksi", doors: "Dyert", seats: "Vendet",
        steering: "Timoni", frontTire: "Gomat (para)", engine: "Motori",
        series: "Seria", trim: "Trim", plant: "Vendi prodhimit",
      },
      turboYes: "✓ Po",
      turboNo: "Jo",
      dieselTips: [
        {
          icon: "⛽", bg: "bg-blue-50",
          title: "Nafta e mirë — investim i zgjuar",
          text: "Përdorni karburant cilësor (V-Power, Ultimate ose ekuivalent). Nafta e dobët dëmton injektorët dhe pompën e karburantit — riparime shumë të kushtueshme.",
        },
        {
          icon: "🔩", bg: "bg-amber-50",
          title: "Ndërrimi i vajit & filtrave — çdo 10,000 km",
          text: "Motori diesel punon me presion të lartë. Vaji i ndotur shkakton konsum të akseleruar të motorrit. Mos e shtyni ndërrimin përtej 10,000 km.",
        },
        {
          icon: "❄️", bg: "bg-sky-50",
          title: "Antifrizi & radiatori — kontroll i rregullt",
          text: "Kontrolloni rregullisht nivelin e antifrizit dhe gjendjen e radiatorit. Mbinxehja është shkaktarja kryesore e dëmtimeve të mëdha të motorrit diesel.",
        },
      ],
      petrolTips: [
        {
          icon: "🔩", bg: "bg-amber-50",
          title: "Ndërrimi i vajit & filtrave — 7,000 deri 10,000 km",
          text: "Motori benzinë kërkon ndërrimin e vajit dhe filtrit të paktën çdo 7,000–10,000 km. Vaji i ndotur shkakton fërkimin e brendshëm dhe dëmton cilindrat.",
        },
        {
          icon: "🕯️", bg: "bg-orange-50",
          title: "Zëvendësimi i kandellave — para afatit",
          text: "Kandelet e konsumuara rrisin konsumin e karburantit, shkaktojnë ndezje të rreme (misfire) dhe dëmtojnë katalizatorin. Zëvendëso para afatit të prodhuesit.",
        },
      ],
      gasTip: {
        icon: "⚡", bg: "bg-yellow-50",
        title: "Kontrolli i bobinave — kritik për mjetet me gaz",
        text: "Mjetet me gaz (LPG/CNG) konsumojnë bobinат dhe kandelet më shpejt. Kontrolloni çdo 30,000 km — dështimi i bobinës shkakton dëme të rënda të motorrit.",
      },
      coilTip: {
        icon: "⚡", bg: "bg-purple-50",
        title: "Kontrolli i bobinave",
        text: "Kontrolloni bobinат dhe kabllot e ndezjes çdo 40,000–60,000 km. Bobina e dëmtuar shkakton humbje fuqie dhe konsum të lartë karburanti.",
      },
    },
    // Profili
    profili: {
      welcome: "Mirë se erdhe",
      manageDesc: "Këtu mund të menaxhosh njoftimet dhe llogarinë tënde",
      myListings: "Njoftimet e Mia",
      addVehicle: "+ Shto Mjet",
      addListing: "+ Posto makinën tënde tani",
      noListings: "Nuk ke asnjë njoftim aktiv.",
      active: "Aktiv",
      view: "Shiko",
      delete: "Fshij",
      deleteConfirm: "Fshij këtë mjet nga lista?",
      panel: "Paneli",
      listings: "Njoftimet",
      logbook: "Libri",
      messages: "Mesazhet",
      add: "Shto",
      stats: "Statistikat",
      settings: "Cilësimet",
      logout: "Dil nga llogaria",
      activeListings: "Njoftimet Aktive",
      totalViews: "Shikime Totale",
      contacts: "Kontaktime",
      favorites: "Të preferuara",
    },
  },

  en: {
    nav: {
      home: "Home",
      search: "Search Cars",
      parts: "Parts & Services",
      vin: "Check VIN",
      blog: "Blog",
      faq: "FAQ",
      contact: "Contact",
      addListing: "+ Add Listing",
      login: "Login / Register",
      logout: "Sign Out",
      myProfile: "My Profile",
      closeMenu: "Close menu",
    },
    vin: {
      badge: "Free — no registration",
      title: "Check Your Car",
      subtitle: "Enter the chassis number and get full service recommendations, for free.",
      placeholder: "e.g. WBA3A5G5XDNN12345",
      checkBtn: "Check",
      checking: "Checking...",
      vinHint: "Found on the vehicle registration card or inside the driver's door",
      errorLength: "VIN must be exactly 17 characters.",
      errorNotFound: "VIN not recognized. Check if entered correctly or fill in the details manually.",
      errorNetwork: "Connection error. Please try again.",
      manualTitle: "Fill in details manually",
      brand: "Make",
      model: "Model",
      year: "Year",
      fuelType: "Fuel Type",
      petrol: "Petrol",
      diesel: "Diesel",
      cancel: "Cancel",
      getRecs: "Get Recommendations",
      vehicleData: "Vehicle Data",
      freeRecs: "Free Recommendations",
      engineOil: "Engine Oil",
      serviceInterval: "Service Interval",
      gearboxOil: "Gearbox Oil",
      orderParts: "Order Parts",
      filteredFor: "Filtered for",
      findService: "Find Service",
      serviceNearYou: "Service near you",
      shareReport: "Share Report",
      copied: "Copied!",
      copyLink: "Copy link",
      trustedServices: "Trusted Services",
      noServices: "No services listed yet.",
      call: "Call",
      emptyState: "Enter your car's VIN and click \"Check\" to see recommendations.",
      estimateTitle: "General estimate — not specific to this vehicle",
      estimateBody: "This car's make is not in our database. The oil values are standard and may not be accurate for your model.",
      estimateTip: "For accuracy, send the chassis number to your mechanic or parts shop.",
      interval15: "Every 15,000 km or 1 year",
      interval10: "Every 10,000 km or 1 year",
      gearboxDiesel: "75W-90 GL-4 (change every 60,000 km)",
      gearboxPetrol: "ATF Dexron VI or MTF 75W-80 GL-4",
      dieselTipsTitle: "🛢️ Diesel engine maintenance tips",
      petrolTipsTitle: "⛽ Petrol engine maintenance tips",
      manual: "manual",
      vehicleLabels: {
        make: "Make", model: "Model", year: "Year", body: "Body Type",
        fuel: "Fuel Type", displacement: "Displacement", cylinders: "Cylinders",
        power: "Power", turbo: "Turbo", transmission: "Transmission",
        speeds: "Speeds", drive: "Drive Type", doors: "Doors", seats: "Seats",
        steering: "Steering", frontTire: "Front Tires", engine: "Engine",
        series: "Series", trim: "Trim", plant: "Country of Origin",
      },
      turboYes: "✓ Yes",
      turboNo: "No",
      dieselTips: [
        {
          icon: "⛽", bg: "bg-blue-50",
          title: "Quality fuel — a smart investment",
          text: "Use quality fuel (V-Power, Ultimate or equivalent). Poor fuel damages injectors and the fuel pump — very expensive repairs.",
        },
        {
          icon: "🔩", bg: "bg-amber-50",
          title: "Oil & filter change — every 10,000 km",
          text: "Diesel engines work under high pressure. Dirty oil causes accelerated engine wear. Do not delay the change beyond 10,000 km.",
        },
        {
          icon: "❄️", bg: "bg-sky-50",
          title: "Coolant & radiator — regular check",
          text: "Regularly check coolant level and radiator condition. Overheating is the main cause of major diesel engine damage.",
        },
      ],
      petrolTips: [
        {
          icon: "🔩", bg: "bg-amber-50",
          title: "Oil & filter change — 7,000 to 10,000 km",
          text: "Petrol engines require oil and filter changes at least every 7,000–10,000 km. Dirty oil causes internal friction and damages cylinders.",
        },
        {
          icon: "🕯️", bg: "bg-orange-50",
          title: "Spark plug replacement — before the deadline",
          text: "Worn spark plugs increase fuel consumption, cause misfires and damage the catalytic converter. Replace before the manufacturer's deadline.",
        },
      ],
      gasTip: {
        icon: "⚡", bg: "bg-yellow-50",
        title: "Coil check — critical for gas vehicles",
        text: "Gas vehicles (LPG/CNG) wear out coils and spark plugs faster. Check every 30,000 km — a failed coil causes serious engine damage.",
      },
      coilTip: {
        icon: "⚡", bg: "bg-purple-50",
        title: "Coil check",
        text: "Check coils and ignition wires every 40,000–60,000 km. A damaged coil causes power loss and high fuel consumption.",
      },
    },
    profili: {
      welcome: "Welcome back",
      manageDesc: "Manage your listings and account here",
      myListings: "My Listings",
      addVehicle: "+ Add Vehicle",
      addListing: "+ Post your car now",
      noListings: "You have no active listings.",
      active: "Active",
      view: "View",
      delete: "Delete",
      deleteConfirm: "Delete this vehicle from the list?",
      panel: "Dashboard",
      listings: "Listings",
      logbook: "Logbook",
      messages: "Messages",
      add: "Add",
      stats: "Statistics",
      settings: "Settings",
      logout: "Sign out",
      activeListings: "Active Listings",
      totalViews: "Total Views",
      contacts: "Contacts",
      favorites: "Favorites",
    },
  },
};

type Translations = typeof translations.sq;

const LanguageContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}>({
  lang: "sq",
  setLang: () => {},
  t: translations.sq,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("sq");

  useEffect(() => {
    const stored = localStorage.getItem("lang") as Lang | null;
    if (stored === "sq" || stored === "en") {
      setLangState(stored);
    } else {
      const browser = navigator.language.toLowerCase();
      setLangState(browser.startsWith("sq") ? "sq" : "en");
    }
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("lang", l);
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
