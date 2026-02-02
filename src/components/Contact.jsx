export default function Contact() {
  return (
    <section className="py-20 px-6 bg-gray-950 text-center">
      <h2 className="text-4xl font-bold mb-6">Plan Your Event With Us</h2>

      <p className="text-gray-400 max-w-2xl mx-auto mb-10">
        Tell us about your event and our team will get in touch with the best
        plan, production setup, and pricing tailored to your needs.
      </p>

      <div className="flex flex-col md:flex-row justify-center gap-6">
        <button className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:scale-105 transition">
          Talk to Event Expert
        </button>

        <button className="border border-gray-600 px-8 py-3 rounded-lg hover:bg-gray-800 transition">
          Get a Quote
        </button>
      </div>
    </section>
  );
}
