import Link from "next/link";

export default function KushtetPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 py-10 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="text-sm text-gray-400 hover:text-green-600 transition-colors flex items-center gap-1 mb-4">
            ← Kthehu
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900">Kushtet e Përdorimit</h1>
          <p className="text-gray-400 text-sm mt-2">Përditësuar: Prill 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 prose prose-gray">
        <div className="flex flex-col gap-8">

          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-3">1. Pranimi i Kushteve</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Duke përdorur platformën ShitetMakina, ju pranoni plotësisht këto Kushte të Përdorimit. Nëse nuk jeni dakord me ndonjë nga kushtet, ju lutemi mos e përdorni shërbimin tonë. ShitetMakina rezervon të drejtën të ndryshojë këto kushte në çdo kohë, me njoftim paraprak te përdoruesit.
            </p>
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-3">2. Përshkrimi i Shërbimit</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              ShitetMakina është platformë online për shitjen dhe blerjen e mjeteve motorike në Shqipëri. Ne ofrojmë hapësirë për publikimin e njoftimeve dhe nuk marrim pjesë direkte në transaksionet ndërmjet blerësit dhe shitësit. ShitetMakina nuk është palë në asnjë marrëveshje midis përdoruesve.
            </p>
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-3">3. Regjistrimi dhe Llogaria</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              Për të publikuar njoftime, duhet të krijoni një llogari me të dhëna të sakta dhe të vërteta. Ju jeni përgjegjës për:
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2"><span className="text-green-500 shrink-0 mt-0.5">•</span> Ruajtjen e fjalëkalimit tuaj</li>
              <li className="flex items-start gap-2"><span className="text-green-500 shrink-0 mt-0.5">•</span> Të gjitha veprimet që kryhen nga llogaria juaj</li>
              <li className="flex items-start gap-2"><span className="text-green-500 shrink-0 mt-0.5">•</span> Saktësinë e informacionit të dhënë</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-3">4. Rregullat e Njoftimeve</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">Çdo njoftim i publikuar duhet të jetë:</p>
            <ul className="text-sm text-gray-600 space-y-2 mb-3">
              <li className="flex items-start gap-2"><span className="text-green-500 shrink-0 mt-0.5">•</span> I saktë dhe i plotë — informacioni duhet të korrespondojë me gjendjen reale të mjetit</li>
              <li className="flex items-start gap-2"><span className="text-green-500 shrink-0 mt-0.5">•</span> Fotot duhet të jenë të mjetit real, jo të marra nga interneti</li>
              <li className="flex items-start gap-2"><span className="text-green-500 shrink-0 mt-0.5">•</span> Çmimi duhet të jetë real dhe në euro ose lekë</li>
            </ul>
            <p className="text-sm text-gray-600 leading-relaxed">
              ShitetMakina rezervon të drejtën të fshijë çdo njoftim që shkel këto rregulla, pa njoftim paraprak.
            </p>
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-3">5. Pagesat dhe Paketat</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Disa shërbime të ShitetMakina janë me pagesë (Boost, Bronze, Silver, Gold). Pagesat janë të pakthyeshme pasi shërbimi është aktivizuar. ShitetMakina rezervon të drejtën të ndryshojë çmimet me njoftim 30-ditor paraprak.
            </p>
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-3">6. Kufizimi i Përgjegjësisë</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              ShitetMakina nuk mban përgjegjësi për saktësinë e njoftimeve të publikuara nga përdoruesit, për transaksionet e kryera ndërmjet palëve, ose për dëmet e mundshme që rrjedhin nga përdorimi i platformës. Blerësi dhe shitësi bien dakord drejtpërdrejt dhe mbajnë përgjegjësi personale.
            </p>
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-3">7. Kontakt</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Për çdo pyetje lidhur me Kushtet e Përdorimit, na kontaktoni në:{" "}
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
