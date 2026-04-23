export default function AdminPerdoruesit() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Përdoruesit</h1>
          <p className="text-gray-500 text-sm mt-1">0 përdorues të regjistruar</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
        <div className="text-4xl mb-4">👤</div>
        <p className="text-white font-semibold mb-2">Asnjë përdorues akoma</p>
        <p className="text-gray-500 text-sm">
          Pas lidhjes me backend, këtu do shfaqen të gjithë përdoruesit e regjistruar.
        </p>
      </div>
    </div>
  );
}
