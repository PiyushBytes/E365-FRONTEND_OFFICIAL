import React from "react";
import StatsCard from "../common/StatsCard";
import ActiveBookingCard from "./ActiveBookingCard";
import { CreditCard, Calendar, CheckCircle2, Star } from "lucide-react";

export default function ClientOverviewTab({ data, querySummary }) {
  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <div className="relative rounded-3xl overflow-hidden p-8 border border-teal-300/40 bg-linear-to-br from-blue-50 via-emerald-50 to-teal-50">
        <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30" alt="Concert" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-linear-to-br from-teal-500/15 to-emerald-500/15" />
        <div className="relative z-10"><h2 className="text-4xl font-bold mb-4 text-slate-900">Plan Your Next <span className="bg-linear-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">Event</span></h2><p className="text-slate-700">Connect with top artists easily.</p></div>
      </div>
      <div className="grid grid-cols-4 gap-6">
        {[ { label: "Total Spent", value: data.stats?.totalSpent, icon: CreditCard }, { label: "Active Bookings", value: data.stats?.activeBookings, icon: Calendar }, { label: "Completed Events", value: data.stats?.completedEvents, icon: CheckCircle2 }, { label: "Saved Artists", value: data.stats?.savedArtists, icon: Star } ].map((stat, i) => <StatsCard key={i} {...stat} />)}
      </div>
      {/* querySummary?.summary && (
        <div className="bg-blue-600/20 p-6 rounded-xl">
          <h3 className="text-blue-400 font-bold mb-3">Query Summary</h3>
          <p>📅 Date: {querySummary.summary.event_date}</p><p>📍 Location: {querySummary.summary.event_location}</p><p>🎉 Type: {querySummary.summary.event_type}</p><p>💰 Budget: {querySummary.summary.budget}</p><p>⏱ Duration: {querySummary.summary.duration_hours}</p><p>🎤 Genre: {querySummary.summary.artist_genre}</p><p>📝 Notes: {querySummary.summary.additional_notes}</p>
        </div>
      ) */}
      <section>
        <h3 className="text-xl font-bold mb-4 text-slate-900">Active Bookings</h3>
        {data?.activeBookings?.map((booking) => <ActiveBookingCard key={booking.id} booking={booking} />)}
      </section>
    </div>
  );
}
