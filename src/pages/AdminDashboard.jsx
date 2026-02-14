import React from "react";

const AdminDashboard = () => {
  return (
    <div className="relative min-h-screen bg-black text-white px-4 sm:px-8 lg:px-12 py-8 overflow-hidden">

      {/* Red Radial Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] bg-red-600/20 rounded-full blur-[180px]" />
        <div className="absolute bottom-[-250px] left-[-200px] w-[700px] h-[700px] bg-red-700/10 rounded-full blur-[200px]" />
      </div>

      {/* Header */}
      <div className="mb-14">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-widest">
          ADMIN CONTROL CENTER
        </h1>
        <p className="text-gray-400 mt-3">
          Platform Intelligence & Business Oversight
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-16">
        {[
          { label: "Total Artists", value: "42" },
          { label: "Total Clients", value: "128" },
          { label: "Booking Requests", value: "63" },
          { label: "Revenue Generated", value: "₹12.5L" },
          { label: "Active Conversations", value: "9" },
        ].map((item, index) => (
          <div
            key={index}
            className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl hover:border-red-600 transition"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-transparent rounded-t-3xl"></div>

            <p className="text-gray-400 text-sm">{item.label}</p>
            <h2 className="text-3xl font-bold mt-4">{item.value}</h2>
          </div>
        ))}
      </div>

      {/* Live Booking */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8">
          LIVE BOOKING ACTIVITY
        </h2>

        <div className="space-y-6">
          {[
            {
              client: "Rahul Sharma",
              artist: "Arijit Singh",
              event: "Wedding",
              date: "12 March",
              budget: "₹90K",
              status: "Pending",
            },
            {
              client: "Anita Verma",
              artist: "DJ Nova",
              event: "Corporate",
              date: "20 March",
              budget: "₹60K",
              status: "Accepted",
            },
          ].map((req, index) => (
            <div
              key={index}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 border-b border-white/10 pb-4"
            >
              <p>{req.client}</p>
              <p>{req.artist}</p>
              <p>{req.event}</p>
              <p>{req.date}</p>
              <p className="font-medium">{req.budget}</p>
              <p
                className={`font-semibold ${
                  req.status === "Accepted"
                    ? "text-green-400"
                    : "text-yellow-400"
                }`}
              >
                {req.status}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Artist Management */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8">
          ARTIST MANAGEMENT
        </h2>

        <div className="space-y-6">
          {[
            { name: "Arijit Singh", category: "Singer", status: "Active" },
            { name: "DJ Nova", category: "DJ", status: "Inactive" },
          ].map((artist, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-white/10 pb-4"
            >
              <div>
                <p className="text-lg font-medium">{artist.name}</p>
                <p className="text-gray-400 text-sm">
                  {artist.category}
                </p>
              </div>

              <button
                className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                  artist.status === "Active"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-600 hover:bg-gray-700"
                }`}
              >
                {artist.status}
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
