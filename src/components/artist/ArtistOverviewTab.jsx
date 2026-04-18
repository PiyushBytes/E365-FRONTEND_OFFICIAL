import React from "react";
import RequestCard from "./RequestCard";
import { Ticket, ListMusic, Clock, CheckCircle2, CreditCard, Music2, MapPin, Languages, DollarSign, Briefcase, Loader2, User, TrendingUp, Zap, Eye, ArrowUpRight, Play, Disc3, Star, Calendar, BadgeCheck } from "lucide-react";
import { env } from "../../config/env";

export default function ArtistOverviewTab({ user, available, setAvailable, stats, requests, handleAccept, profile, profileLoading }) {
  const getAvatarUrl = (url, cacheBuster) => {
    if (!url) return null;
    if (url.startsWith('blob:') || url.startsWith('data:')) return url;
    const baseUrl = url.startsWith('http') ? url : `${env.API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    // Attach cache buster safely
    return cacheBuster ? `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}v=${cacheBuster}` : baseUrl;
  };

  const avatarCacheVal = profile?.updated_at ? new Date(profile.updated_at).getTime() : '1';

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
          HERO — Sleek enterprise header
         ═══════════════════════════════════════════════════════════════════ */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-10 -mt-4 sm:-mt-6 lg:-mt-10 mb-0">

        {profileLoading ? (
          <div className="flex items-center justify-center py-40 bg-white">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 rounded-full border-2 border-slate-100 border-t-indigo-600 animate-spin" />
              <span className="text-[11px] text-slate-400 uppercase tracking-[0.3em]">Loading</span>
            </div>
          </div>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-slate-50 border-b border-slate-200" />
            <div className="relative px-6 sm:px-10 lg:px-14 pt-10 sm:pt-14 pb-8 border-b border-slate-200 bg-white/50 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-center">
                
                {/* Clean profile photo */}
                <div className="shrink-0">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden shadow-md border-4 border-white">
                    {(profile?.profile_photo || profile?.profile_photo_url) ? (
                      <img src={getAvatarUrl(profile.profile_photo || profile.profile_photo_url, avatarCacheVal)} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100">
                        <User className="text-slate-400" size={48} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Artist info */}
                <div className="flex-1 min-w-0 space-y-2 pb-1">
                  <div className="flex items-center gap-2">
                    <BadgeCheck size={20} className="text-blue-500" fill="currentColor" stroke="white" />
                    <span className="text-[12px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full">Verified Artist</span>
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight">
                    {profile?.artist_username || user?.username || "Artist"}
                  </h1>
                  <p className="text-sm font-medium text-slate-500">
                    {stats.totalBookings || 0} total bookings · {genres.length > 0 ? genres.map(g => g.charAt(0).toUpperCase() + g.slice(1)).join(", ") : "Artist"}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          ACTION ROW — Clean enterprise controls
         ═══════════════════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-6 py-6 border-b border-slate-200 mb-8 mt-2">
        {/* Toggle switch styled button instead of giant play button */}
        <button
          onClick={() => setAvailable(!available)}
          className={`px-5 py-2.5 rounded-md flex items-center gap-2 font-semibold text-sm transition-all duration-200 ${
            available 
              ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100" 
              : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${available ? "bg-green-500" : "bg-slate-400"}`} />
          {available ? "Taking Bookings" : "Unavailable"}
        </button>

        {/* Quick meta pills */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3 ml-auto flex-wrap">
          {profile?.experience && (
            <span className="text-xs font-medium text-slate-600 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
              {profile.experience} yrs experience
            </span>
          )}
          {(profile?.min_price || profile?.max_price) && (
            <span className="text-xs font-medium text-slate-600 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
              {formatPrice(profile.min_price)} – {formatPrice(profile.max_price)}
            </span>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          OVERVIEW METRICS — Sleek enterprise cards
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Overview</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Bookings", value: stats.totalBookings, sub: "All time", icon: Disc3, color: "#6366f1" },
            { label: "Pending Requests", value: stats.pendingRequests, sub: "Needs action", icon: Clock, color: "#f59e0b" },
            { label: "Confirmed", value: stats.acceptedBookings, sub: "This month", icon: CheckCircle2, color: "#10b981" },
            { label: "Revenue", value: stats.revenue, sub: "Earnings", icon: TrendingUp, color: "#8b5cf6" },
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[12px] text-slate-500 font-semibold">{stat.label}</span>
                <stat.icon size={18} style={{ color: stat.color }} />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
              <div className="text-[12px] text-slate-400 font-medium">{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          ABOUT — Clean bio section
         ═══════════════════════════════════════════════════════════════════ */}
      {profile?.bio && (
        <section className="mb-10">
          <h2 className="text-lg font-bold text-slate-900 mb-4">About</h2>
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 sm:p-8">
            <p className="text-[15px] text-slate-600 leading-relaxed max-w-4xl">{profile.bio}</p>
            <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-slate-100">
              {genres.map((g, i) => (
                <span key={i} className="text-[12px] text-slate-700 bg-slate-100 px-3 py-1 rounded-full font-medium capitalize border border-slate-200">{g}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          ARTIST DETAILS — Standard grids
         ═══════════════════════════════════════════════════════════════════ */}
      {profile && !profileLoading && (
        <section className="mb-10 space-y-8 px-4 sm:px-0">

          {/* Cities */}
          {cities.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-slate-400" /> Available Cities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
                {cities.map((city, i) => (
                  <div key={i} className="bg-white border border-slate-200 shadow-sm rounded-lg p-4">
                    <div className="w-9 h-9 rounded-md bg-indigo-50 flex items-center justify-center mb-3">
                      <MapPin size={16} className="text-indigo-600" />
                    </div>
                    <p className="text-sm font-semibold text-slate-900 capitalize">{city}</p>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">Available</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Event Types */}
          {eventTypes.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar size={18} className="text-slate-400" /> Event Types
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
                {eventTypes.map((evt, i) => (
                  <div key={i} className="bg-white border border-slate-200 shadow-sm rounded-lg p-4">
                    <div className="w-9 h-9 rounded-md bg-purple-50 flex items-center justify-center mb-3">
                      <Star size={16} className="text-purple-600" />
                    </div>
                    <p className="text-sm font-semibold text-slate-900 capitalize">{evt}</p>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">Performing</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages + Duration row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {languages.length > 0 && (
              <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Languages size={15} className="text-slate-400" /> Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {languages.map((l, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-[12px] font-medium capitalize border border-slate-200">{l}</span>
                  ))}
                </div>
              </div>
            )}

            {(profile?.min_duration || profile?.max_duration) && (
              <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Clock size={15} className="text-slate-400" /> Performance Duration
                </h3>
                <div className="flex items-end gap-4">
                  <div>
                    <span className="text-3xl font-bold text-slate-900">{profile.min_duration}–{profile.max_duration}</span>
                    <span className="text-sm font-medium text-slate-500 ml-1.5">minutes</span>
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: "60%" }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          RECENT REQUESTS — Sleek List
         ═══════════════════════════════════════════════════════════════════ */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-900">Recent Requests</h2>
          {requests.length > 0 && (
            <button className="text-[12px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-wider transition-colors">
              Show all
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {requests.length ? requests.map((req, i) => (
            <RequestCard key={i} req={req} onAccept={handleAccept} onDecline={() => {}} />
          )) : (
            <div className="col-span-full py-16 text-center bg-white border border-slate-200 border-dashed rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-3">
                <Ticket size={24} />
              </div>
              <p className="text-sm font-semibold text-slate-600">No pending requests</p>
              <p className="text-[12px] text-slate-400 mt-1">New booking requests will show up here</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
