import React, { useState } from "react";

const ArtistDashboard = () => {
  const [available, setAvailable] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f0f0f] to-[#1a0000] text-white px-4 sm:px-8 lg:px-12 py-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-red-500 flex items-center justify-center text-sm text-gray-400">
            artist
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-wide">
              ARIJIT SINGH
            </h1>
            <p className="text-gray-400">Singer • Mumbai</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition px-5 py-2 rounded-full font-medium">
            Edit Profile
          </button>

          <button
            onClick={() => setAvailable(!available)}
            className={`px-6 py-2 rounded-full font-medium transition ${
              available
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-600 hover:bg-gray-700"
            }`}
          >
            {available ? "Available" : "Busy"}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: "Total Bookings", value: "28" },
          { label: "Pending Requests", value: "5" },
          { label: "Accepted", value: "21" },
          { label: "Revenue", value: "₹0K" },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl hover:border-red-500 transition"
          >
            <p className="text-gray-400 text-sm">{item.label}</p>
            <h2 className="text-3xl font-bold mt-2">{item.value}</h2>
          </div>
        ))}
      </div>

      {/* Booking Requests */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 sm:p-8 rounded-2xl">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6">
          NEW BOOKING REQUESTS
        </h2>

        {[
          {
            name: "Rahul Sharma",
            details: "Wedding • 12 March • Delhi • ₹90K",
          },
          {
            name: "Anita Verma",
            details: "Corporate • 20 March • Mumbai • ₹60K",
          },
        ].map((req, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-white/10 py-5"
          >
            <div>
              <p className="font-medium text-lg">{req.name}</p>
              <p className="text-gray-400 text-sm">{req.details}</p>
            </div>

            <div className="flex items-center flex-wrap gap-3">

              <button className="bg-red-600 hover:bg-red-700 transition px-4 py-1 rounded-full text-sm">
                Accept
              </button>

              <button className="border border-gray-500 hover:border-red-500 px-4 py-1 rounded-full text-sm">
                Reject
              </button>

              {/* Bot Icon */}
              <button
                className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:border-red-500 hover:bg-red-600/20 transition"
                title="Open Chat"
              >
                🤖
              </button>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ArtistDashboard;
