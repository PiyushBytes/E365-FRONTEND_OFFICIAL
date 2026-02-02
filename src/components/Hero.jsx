export default function Hero() {
  return (
    <section className="text-center py-24 px-6">
      <h2 className="text-5xl font-bold mb-6">
        We Plan. You Celebrate.
      </h2>

      <p className="text-gray-400 max-w-2xl mx-auto mb-10">
        From college fests to weddings and concerts, E365 Events delivers
        unforgettable experiences with professional planning and production.
      </p>

      <div className="flex justify-center gap-6 flex-wrap">
        <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:scale-105 transition">
          Book an Event
        </button>
        <button className="border border-gray-600 px-6 py-3 rounded-lg hover:bg-gray-800 transition">
          View Services
        </button>
      </div>
    </section>
  );
}
