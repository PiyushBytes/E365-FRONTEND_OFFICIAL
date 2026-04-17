import React from "react";
import RequestCard from "./RequestCard";
import { Ticket, ListMusic, Clock, CheckCircle2, CreditCard, Music2, MapPin, Languages, DollarSign, Briefcase, Loader2, User, TrendingUp, Zap, Eye, ArrowUpRight, Play, Disc3, Star, Calendar } from "lucide-react";

export default function ArtistOverviewTab({ user, available, setAvailable, stats, requests, handleAccept, profile, profileLoading }) {

  const genres = profile?.genres_list?.length ? profile.genres_list : (profile?.genres ? profile.genres.split(",").map(g => g.trim()) : []);
  const cities = profile?.cities_list?.length ? profile.cities_list : (profile?.cities ? profile.cities.split(",").map(c => c.trim()) : []);
  const eventTypes = profile?.event_types_list?.length ? profile.event_types_list : (profile?.event_types ? profile.event_types.split(",").map(e => e.trim()) : []);
  const languages = profile?.languages_list?.length ? profile.languages_list : (profile?.languages ? profile.languages.split(",").map(l => l.trim()) : []);

  // Format price nicely
  const formatPrice = (val) => {
    const num = Number(val);
    if (num >= 100000) return `₹${(num / 100000).toFixed(num % 100000 === 0 ? 0 : 1)}L`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(0)}K`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  return (
    <div className="max-w-350 mx-auto pb-16">

      {/* ═══════════════════════════════════════════════════════════════════
          HERO — Spotify-style full-bleed artist header
         ═══════════════════════════════════════════════════════════════════ */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-10 -mt-4 sm:-mt-6 lg:-mt-10 mb-0">

        {profileLoading ? (
          <div className="flex items-center justify-center py-40 bg-linear-to-b from-zinc-900 to-black">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-white/40 animate-spin" />
              <span className="text-[11px] text-zinc-600 uppercase tracking-[0.3em]">Loading</span>
            </div>
          </div>
        ) : (
          <>
            {/* Background — profile photo blurred as ambient background */}
            <div className="absolute inset-0 overflow-hidden">
              {profile?.profile_photo && (
                <img src={profile.profile_photo} alt="" className="w-full h-full object-cover scale-110 blur-[80px] opacity-30" />
              )}
              <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/70 to-black" />
            </div>

            <div className="relative px-4 sm:px-6 lg:px-14 pt-12 sm:pt-16 lg:pt-20 pb-8 sm:pb-10">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 items-start sm:items-end">

                {/* Album-art style profile photo */}
                <div className="shrink-0 group">
                  <div className="w-32 h-32 sm:w-48 sm:h-48 lg:w-60 lg:h-60 rounded-md overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.5)]">
                    {profile?.profile_photo ? (
                      <img src={profile.profile_photo} alt="Profile" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-zinc-800 to-zinc-900">
                        <User className="text-zinc-700" size={48} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Artist info */}
                <div className="flex-1 min-w-0 space-y-3 pb-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-sky-400" fill="currentColor" />
                    <span className="text-[12px] font-semibold text-sky-400">Verified Artist</span>
                  </div>
                  <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] wrap-break-word overflow-hidden">
                    {profile?.artist_username || user?.username || "Artist"}
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-400 pt-1 truncate">
                    {stats.totalBookings || 0} total bookings · {genres.length > 0 ? genres.map(g => g.charAt(0).toUpperCase() + g.slice(1)).join(", ") : "Artist"}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          ACTION ROW — Spotify-style play button + controls
         ═══════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 px-4 sm:px-6 lg:px-10 py-6 sm:py-8 -mx-4 sm:-mx-6 lg:-mx-10 bg-linear-to-b from-black/0 to-transparent">
        {/* Big play-style button */}
        <button
          onClick={() => setAvailable(!available)}
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 hover:scale-105 ${
            available
              ? "bg-[#1ed760] hover:bg-[#1fdf64] shadow-[0_8px_24px_rgba(30,215,96,0.3)]"
              : "bg-zinc-700 hover:bg-zinc-600"
          }`}
        >
          <Play size={20} fill="black" className="text-black ml-0.5" />
        </button>

        <div className="flex flex-col">
          <span className={`text-xs sm:text-sm font-bold ${available ? "text-[#1ed760]" : "text-zinc-500"}`}>
            {available ? "Available · Taking Bookings" : "Currently Unavailable"}
          </span>
          <span className="text-[10px] sm:text-[11px] text-zinc-600">Toggle your availability</span>
        </div>

        {/* Quick meta pills */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3 ml-auto flex-wrap">
          {profile?.experience && (
            <span className="text-xs text-zinc-400 bg-zinc-900 px-2.5 lg:px-3 py-1 lg:py-1.5 rounded-full border border-zinc-800 whitespace-nowrap">
              {profile.experience} yrs experience
            </span>
          )}
          {(profile?.min_price || profile?.max_price) && (
            <span className="text-xs text-zinc-400 bg-zinc-900 px-2.5 lg:px-3 py-1 lg:py-1.5 rounded-full border border-zinc-800 whitespace-nowrap">
              {formatPrice(profile.min_price)} – {formatPrice(profile.max_price)}
            </span>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          OVERVIEW METRICS — Like Spotify's "Overview" section
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="mb-10 px-4 sm:px-0">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-5">Overview</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {[
            { label: "Total Bookings", value: stats.totalBookings, sub: "All time", icon: Disc3, color: "#818cf8" },
            { label: "Pending Requests", value: stats.pendingRequests, sub: "Needs action", icon: Clock, color: "#fbbf24" },
            { label: "Confirmed", value: stats.acceptedBookings, sub: "This month", icon: CheckCircle2, color: "#34d399" },
            { label: "Revenue", value: stats.revenue, sub: "Earnings", icon: TrendingUp, color: "#c084fc" },
          ].map((stat, i) => (
            <div key={i} className="group bg-zinc-900/60 hover:bg-zinc-800/70 rounded-lg p-3 sm:p-5 transition-all duration-300 cursor-default">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <stat.icon size={14} style={{ color: stat.color }} />
                <span className="text-[10px] sm:text-[11px] text-zinc-500 font-medium uppercase tracking-wider line-clamp-1">{stat.label}</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">{stat.value}</div>
              <div className="text-[10px] sm:text-[11px] text-zinc-600">{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          ABOUT — Bio section like Spotify artist "About"
         ═══════════════════════════════════════════════════════════════════ */}
      {profile?.bio && (
        <section className="mb-10 px-4 sm:px-0">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">About</h2>
          <div className="relative rounded-lg overflow-hidden">
            {/* Background ambient from profile photo */}
            <div className="absolute inset-0">
              {profile?.profile_photo && (
                <img src={profile.profile_photo} alt="" className="w-full h-full object-cover blur-2xl opacity-15 scale-150" />
              )}
              <div className="absolute inset-0 bg-zinc-900/80" />
            </div>
            <div className="relative p-4 sm:p-6 lg:p-8">
              <p className="text-sm sm:text-[15px] text-zinc-300 leading-relaxed max-w-3xl">{profile.bio}</p>
              <div className="flex flex-wrap gap-2 mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-white/5">
                {genres.map((g, i) => (
                  <span key={i} className="text-[10px] sm:text-[11px] text-zinc-400 bg-white/5 px-2.5 sm:px-3 py-1 rounded-full font-medium capitalize">{g}</span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          ARTIST DETAILS — Horizontal card sections like Spotify "Popular cities"
         ═══════════════════════════════════════════════════════════════════ */}
      {profile && !profileLoading && (
        <section className="mb-10 space-y-8 px-4 sm:px-0">

          {/* Cities */}
          {cities.length > 0 && (
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <MapPin size={16} className="text-zinc-500 shrink-0" /> Available Cities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
                {cities.map((city, i) => (
                  <div key={i} className="group bg-zinc-900/60 hover:bg-zinc-800/60 rounded-lg p-3 sm:p-4 transition-all cursor-default">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-teal-500/20 to-cyan-500/10 flex items-center justify-center mb-2 sm:mb-3 shrink-0">
                      <MapPin size={14} className="text-teal-400" />
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-white capitalize line-clamp-2">{city}</p>
                    <p className="text-[10px] sm:text-[11px] text-zinc-600 mt-0.5">Available</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Event Types */}
          {eventTypes.length > 0 && (
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <Calendar size={16} className="text-zinc-500 shrink-0" /> Event Types
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
                {eventTypes.map((evt, i) => (
                  <div key={i} className="group bg-zinc-900/60 hover:bg-zinc-800/60 rounded-lg p-3 sm:p-4 transition-all cursor-default">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-violet-500/20 to-fuchsia-500/10 flex items-center justify-center mb-2 sm:mb-3 shrink-0">
                      <Star size={14} className="text-violet-400" />
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-white capitalize line-clamp-2">{evt}</p>
                    <p className="text-[10px] sm:text-[11px] text-zinc-600 mt-0.5">Performing</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages + Duration row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {languages.length > 0 && (
              <div className="bg-zinc-900/60 rounded-lg p-4 sm:p-5">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Languages size={15} className="text-zinc-500 shrink-0" /> Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {languages.map((l, i) => (
                    <span key={i} className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-amber-500/10 text-amber-300/80 text-[11px] sm:text-[12px] font-medium capitalize whitespace-nowrap">{l}</span>
                  ))}
                </div>
              </div>
            )}

            {(profile?.min_duration || profile?.max_duration) && (
              <div className="bg-zinc-900/60 rounded-lg p-4 sm:p-5">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Clock size={15} className="text-zinc-500 shrink-0" /> Performance Duration
                </h3>
                <div className="flex items-end gap-3 sm:gap-4">
                  <div className="shrink-0">
                    <span className="text-2xl sm:text-3xl font-black text-white">{profile.min_duration}–{profile.max_duration}</span>
                    <span className="text-xs sm:text-sm text-zinc-500 ml-1.5">min</span>
                  </div>
                  <div className="flex-1 pb-1.5 sm:pb-2 min-w-0">
                    <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-linear-to-r from-sky-500 to-teal-400 rounded-full" style={{ width: "60%" }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          RECENT REQUESTS — Like "Upcoming releases" section
         ═══════════════════════════════════════════════════════════════════ */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-white">Recent Requests</h2>
          {requests.length > 0 && (
            <button className="text-[12px] font-bold text-zinc-400 hover:text-white uppercase tracking-wider transition-colors">
              Show all
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          {requests.length ? requests.map((req, i) => (
            <RequestCard key={i} req={req} onAccept={handleAccept} onDecline={() => {}} />
          )) : (
            <div className="col-span-full py-20 text-center bg-zinc-900/40 rounded-lg">
              <Ticket size={28} className="text-zinc-800 mx-auto mb-3" />
              <p className="text-sm text-zinc-500">No pending requests</p>
              <p className="text-[11px] text-zinc-700 mt-1">New booking requests will show up here</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
