import Link from "next/link";

export default function PrivatesiaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 py-10 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="text-sm text-gray-400 hover:text-green-600 transition-colors flex items-center gap-1 mb-4">
            ← Kthehu
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900">Politika e Privatësisë</h1>
          <p className="text-gray-400 text-sm mt-2">Përditësuar: Prill 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col gap-8">

          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-3">1. Çfarë të dhënash mbledhim</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">Kur përdorni ShitetMakina, mund të mbledhim:</p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2"><span className="text-green-500 shrink-0 mt-0.5">•</span> <span><strong>Të dhëna regjistrimi:</strong> emri, mbiemri, email, numri i telefonit</span></li>
              <li className="flex items-start gap-2"><span className="text-green-500 shrink-0 mt-0.5">•</span> <span><strong>Të dhëna njoftimesh:</strong> informacioni i mjetit, fotografitë, çmimi</span></li>
              <li className="flex items-start gap-2"><span className="text-green-500 shrink-0 mt-0.5">•</span> <span><strong>Të dhëna teknike:</strong> adresa IP, tipi i shfletuesit, faqet e vizituara</span></li>
              <li className="flex items-start gap-2"><span className="text-green-500 shrink-0 mt-0.5">•</span> <span><strong>Newsletter:</strong> email-i juaj nëse keni pranuar të merrni njoftime</span></li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-3">2. Si i përdorim të dhënat</h2>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2"><span className="text-green-500 shrink-0 mt-0.5">•</span> Për të menaxhuar llogarinë dhe njoftimet tuaja</li>
              <li className="flex items-start gap-2"><span className="text-green-500 shrink-0 mt-0.5">•</span> Për të dërguar njoftime rreth ofertave të reja (vetëm nëse keni rënë dakord)</li>
              <li className="flex items-start gap-2"><span className="text-green-500 shrink-0 mt-0.5">•</span> Për të përmirësuar shërbimin dhe përvojën e përdorimit</li>
              <li className="flex items-start gap-2"><span className="text-green-500 shrink-0 mt-0.5">•</span> Për të procesuar pagesat (kur aktivizohen paketat)</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-3">3. Ndarja e të dhënave</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              ShitetMakina <strong>nuk shet dhe nuk jep</strong> të dhënat tuaja personale te palë të treta për qëllime marketingu. Të dhënat mund të ndahen vetëm me ofruesit e shërbimeve teknike (hosting, email) dhe vetëm në masën e nevojshme për funksionimin e platformës.
            </p>
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-3">4. Cookies</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Platforma përdor cookies për të ruajtur gjendjen e hyrjes dhe preferencat. Nuk përdorim cookies për reklama të palëve të treta. Mund të çaktivizoni cookies nga cilësimet e shfletuesit tuaj, por disa funksione mund të mos funksionojnë siç duhet.
            </p>
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-3">5. Të drejtat tuaja (GDPR)</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">Keni të drejtë të:</p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2"><span className="text-green-500 shrink-0 mt-0.5">•</span> Aksesoni të dhënat tuaja personale</li>
              <li className="flex items-start gap-2"><span className="text-green-500 shrink-0 mt-0.5">•</span> Kërkoni korrigjimin ose fshirjen e tyre</li>
              <li className="flex items-start gap-2"><span className="text-green-500 shrink-0 mt-0.5">•</span> Tërhiqeni pëlqimin për newsletter në çdo kohë</li>
              <li className="flex items-start gap-2"><span className="text-green-500 shrink-0 mt-0.5">•</span> Kërkoni eksportimin e të dhënave tuaja</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-3">6. Ruajtja e të dhënave</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Të dhënat tuaja ruhen për aq kohë sa llogaria juaj është aktive. Pas fshirjes së llogarisë, të dhënat fshihen brenda 30 ditëve, me përjashtim të atyre të nevojshme për detyrime ligjore.
            </p>
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-3">7. Kontakt</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Për çdo kërkesë lidhur me të dhënat tuaja personale:{" "}
              <a href="mailto:info@shitetmakina.al" className="text-green-600 hover:underline font-medium">
                info@shitetmakina.al
              </a>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
