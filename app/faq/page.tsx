"use client";

import { useState } from "react";
import Link from "next/link";

const faqs = [
  {
    category: "Rreth MjetMarket",
    items: [
      {
        q: "Çfarë është MjetMarket?",
        a: "MjetMarket është platforma kryesore shqiptare për blerjen dhe shitjen e mjeteve. Lidhim blerësit me shitësit, ofrojmë listim të mjeteve të përdorura e të reja, dhe bashkojmë servise e furnitorë të pjesëve të këmbimit — të gjitha në një vend.",
      },
      {
        q: "A është falas të përdor platformën?",
        a: "Po, kërkimi dhe shikimi i njoftimeve është plotësisht falas. Regjistrimi si shitës dhe publikimi i njoftimeve bazë është gjithashtu pa kosto.",
      },
      {
        q: "Ku është aktiv MjetMarket?",
        a: "MjetMarket mbulon të gjithë Shqipërinë — Tiranë, Durrës, Vlorë, Shkodër, Elbasan, Korçë dhe qytete të tjera. Filtri i qytetit te faqja e kërkimit të ndihmon të gjesh mjete pranë teje.",
      },
    ],
  },
  {
    category: "Blerja e një mjeti",
    items: [
      {
        q: "Si mund të kërkoj një mjet?",
        a: "Shko te faqja Kërko Makina dhe përdor filtrat: marka, modeli, viti, kilometrat, çmimi, karburanti, transmisioni dhe qyteti. Rezultatet përditësohen automatikisht.",
      },
      {
        q: "A mund ta ndërroj mjetin tim me një tjetër?",
        a: "Po! Shumë shitës pranojnë ndërrimin — me apartament, me mjet tjetër, ose forma të tjera. Filtri 'Ndërroj' te kërkimi të tregon vetëm njoftimet që pranojnë ndërrimin.",
      },
      {
        q: "Si e kontaktoj shitësin?",
        a: "Brenda çdo njoftimi gjen numrin e telefonit dhe butonin e WhatsApp të shitësit. Kontaktimi është direkt mes teje dhe shitësit.",
      },
      {
        q: "A janë njoftimet të verifikuara?",
        a: "Çdo njoftim kalon nëpër shqyrtim para publikimit. Njoftimet me shenjën e verifikimit janë konfirmuar nga ekipi ynë.",
      },
    ],
  },
  {
    category: "Shitja e një mjeti",
    items: [
      {
        q: "Si e publikoj njoftimin tim?",
        a: "Krijo llogari, hyr tek 'Shto Njoftim' dhe plotëso formularin: kategoria e mjetit, marka, modeli, viti, kilometrat, çmimi, karburanti, transmisioni, qyteti, dhe deri 10 foto. Pas publikimit njoftimi shfaqet menjëherë.",
      },
      {
        q: "Sa foto mund të ngarkoja?",
        a: "Mund të ngarkosh deri në 10 foto për çdo njoftim. Rekomandojmë të paktën 5 foto nga kënde të ndryshme — jashtë, brendësi, motorri — për të tërhequr më shumë blerës.",
      },
      {
        q: "Çfarë kategorish mjetesh mund të listoj?",
        a: "Platforma mbështet: Makina, Kamionë, Motoçikleta, Varka, Rimorkio dhe Të tjera.",
      },
      {
        q: "Si e menaxhoj ose fshij njoftimin tim?",
        a: "Hyr te Profili im → Njoftimet e mia. Aty mund të redaktosh, çaktivizosh ose fshish çdo njoftim.",
      },
    ],
  },
  {
    category: "Pjesë Këmbimi & Servise",
    items: [
      {
        q: "A mund të gjej pjesë këmbimi në MjetMarket?",
        a: "Po, faqja Pjesë Këmbimi & Servise lisiston furnitorët e besuara të pjesëve të këmbimit sipas kategorisë. Mund t'i kontaktosh direkt për disponueshmërinë dhe çmimet.",
      },
      {
        q: "Si gjej një servis të besuar pranë meje?",
        a: "Te faqja Pjesë Këmbimi & Servise gjen listën e serviseve të verifikuara me emrin, qytetin dhe numrin e kontaktit. Të gjithë janë kontrolluar nga ekipi ynë.",
      },
      {
        q: "Si regjistrohem si servis ose furnitor?",
        a: "Na kontaktoni direkt nëpërmjet faqes Kontakt ose në info@shitetmakina.al dhe ekipi ynë do t'ju udhëzojë për listimin si partner.",
      },
    ],
  },
  {
    category: "Llogaria & Siguria",
    items: [
      {
        q: "Si krijoj llogari?",
        a: "Kliko 'Hyr / Regjistrohu' te shiriti i navigimit. Mund të regjistrohesh me email dhe fjalëkalim ose nëpërmjet Google.",
      },
      {
        q: "E harrova fjalëkalimin, çfarë bëj?",
        a: "Te faqja e hyrjes kliko 'Harrova fjalëkalimin'. Do të marrësh email me link për rivendosjen e fjalëkalimit.",
      },
      {
        q: "A janë të dhënat e mia të sigurta?",
        a: "Po. MjetMarket përdor enkriptim të plotë dhe nuk shpërndan të dhënat tuaja personale me palë të treta pa lejen tuaj. Shiko Politikën e Privatësisë për detaje të plota.",
      },
    ],
  },
];

export default function FaqPage() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
      {/* Header */}
      <div className="mb-10 text-center">
        <span className="inline-block bg-green-50 text-green-600 text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
          Pyetje të Shpeshta
        </span>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Si mund t&apos;ju ndihmojmë?</h1>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Gjeni përgjigjet për pyetjet më të shpeshta rreth platformës MjetMarket.
        </p>
      </div>

      {/* FAQ Sections */}
      <div className="space-y-10">
        {faqs.map((section) => (
          <div key={section.category}>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-green-600 mb-4">
              {section.category}
            </h2>
            <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
              {section.items.map((item) => {
                const id = `${section.category}-${item.q}`;
                const isOpen = open === id;
                return (
                  <div key={item.q} className="bg-white">
                    <button
                      onClick={() => setOpen(isOpen ? null : id)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left gap-4 hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-sm font-semibold text-gray-800">{item.q}</span>
                      <span className={`shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${isOpen ? "border-green-500 bg-green-500" : "border-gray-300"}`}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke={isOpen ? "white" : "#9ca3af"} strokeWidth="2" strokeLinecap="round">
                          {isOpen
                            ? <><line x1="2" y1="5" x2="8" y2="5" /></>
                            : <><line x1="5" y1="2" x2="5" y2="8" /><line x1="2" y1="5" x2="8" y2="5" /></>
                          }
                        </svg>
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-14 bg-green-50 rounded-2xl p-6 text-center">
        <p className="text-sm font-semibold text-gray-800 mb-1">Nuk gjete përgjigjen?</p>
        <p className="text-xs text-gray-500 mb-4">Ekipi ynë është gati të të ndihmojë çdo ditë.</p>
        <Link
          href="/kontakti"
          className="inline-block bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
        >
          Na Kontakto
        </Link>
      </div>
    </main>
  );
}
