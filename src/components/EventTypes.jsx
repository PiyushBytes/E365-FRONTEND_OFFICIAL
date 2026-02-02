export default function EventTypes() {
  const events = [
    { title: "College Fests", desc: "Full-scale campus events with stage, sound & artists" },
    { title: "Weddings", desc: "Elegant wedding planning and complete décor management" },
    { title: "Concerts", desc: "Live shows with professional production & crowd control" },
    { title: "Corporate Events", desc: "Product launches, conferences & brand activations" },
  ];

  return (
    <section className="py-20 px-6 bg-gray-950">
      <h2 className="text-4xl font-bold text-center mb-14">
        Events We Specialize In
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {events.map((event, index) => (
          <div
            key={index}
            className="p-6 rounded-xl border border-gray-800 hover:border-white transition bg-black"
          >
            <h3 className="text-xl font-semibold mb-3">{event.title}</h3>
            <p className="text-gray-400 text-sm">{event.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
