import React from "react";
import StatsCard from "../common/StatsCard";
import LiveBookingsTable from "./LiveBookingsTable";
import AdminQuickActions from "./AdminQuickActions";

export default function AdminOverviewTab({ statsData, filteredBookings }) {
  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fade-up">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, idx) => <StatsCard key={idx} {...stat} />)}
      </div>
      <LiveBookingsTable bookings={filteredBookings} />
      <AdminQuickActions />
    </div>
  );
}
