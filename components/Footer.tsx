import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-500 mt-16 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-14 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Logo & description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
                  <rect x="9" y="11" width="14" height="10" rx="2" />
                  <circle cx="12" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                </svg>
              </div>
              <span className="text-gray-900 text-lg font-extrabold tracking-tight">
                Shitet<span className="text-green-500">Makina</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs text-gray-500">
              Platforma numër 1 për blerjen dhe shitjen e makinave të përdorura dhe të reja në Shqipëri.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4 text-sm uppercase tracking-wide">Navigim</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/" className="hover:text-gray-900 transition-colors">Kreu</Link></li>
              <li><Link href="/kerko" className="hover:text-gray-900 transition-colors">Kërko Makina</Link></li>
              <li><Link href="/pjese-kembimi" className="hover:text-gray-900 transition-colors">Pjesë Këmbimi</Link></li>
              <li><Link href="#" className="hover:text-gray-900 transition-colors">Shto Njoftim</Link></li>
              <li><Link href="/kontakti" className="hover:text-gray-900 transition-colors">Kontakt</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4 text-sm uppercase tracking-wide">Kontakt</h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✉</span> info@shitetmakina.al
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✆</span> +355 69 000 0000
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">⌖</span> Tiranë, Shqipëri
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-200 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <span>© {new Date().getFullYear()} ShitetMakina. Të gjitha të drejtat e rezervuara.</span>
          <div className="flex gap-4">
            <Link href="/privatesia" className="hover:text-gray-900 transition-colors">Politika e Privatësisë</Link>
            <Link href="/kushtet" className="hover:text-gray-900 transition-colors">Kushtet e Përdorimit</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
