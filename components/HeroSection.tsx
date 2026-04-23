export default function HeroSection() {
  return (
    <section className="bg-gray-900 text-white py-20">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Gjej makinën e ëndrrave tënde
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Shfleto oferta të makinave të përdorura dhe të reja në Shqipëri.
        </p>
        <a
          href="#cars"
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition"
        >
          Shiko Makinat
        </a>
      </div>
    </section>
  );
}
