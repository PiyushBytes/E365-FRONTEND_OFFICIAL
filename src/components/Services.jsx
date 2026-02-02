export default function Services() {
  const services = [
    "Stage & Set Design",
    "Sound & Light Production",
    "Artist Management",
    "Event Branding & Promotion",
    "Logistics & Crowd Management",
    "Catering & Hospitality",
  ];

  return (
    <section className="py-20 px-6">
      <h2 className="text-4xl font-bold text-center mb-12">
        Our Event Services
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-white transition"
          >
            <p className="text-lg font-medium">{service}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
