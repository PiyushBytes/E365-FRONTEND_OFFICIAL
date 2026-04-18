import { Calendar, MapPin, Music, DollarSign, Clock } from "lucide-react";

export default function QueryDetails({ queryData }) {
  if (!queryData) return null;

  return (
    <div className="bg-linear-to-r from-blue-500/10 to-cyan-500/10 border border-blue-400/30 rounded-xl p-4 mb-4">
      <h3 className="text-sm font-bold text-slate-100 mb-3 uppercase tracking-wider">Event Details</h3>

      <div className="grid grid-cols-2 gap-3">
        {/* Event Date */}
        {queryData.event_date && (
          <div className="flex items-start gap-2">
            <Calendar size={16} className="text-cyan-400 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider">Date</p>
              <p className="text-sm font-semibold text-slate-100 truncate">
                {new Date(queryData.event_date).toLocaleDateString("en-IN")}
              </p>
            </div>
          </div>
        )}

        {/* Location */}
        {queryData.event_location && (
          <div className="flex items-start gap-2">
            <MapPin size={16} className="text-cyan-400 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider">Location</p>
              <p className="text-sm font-semibold text-slate-100 truncate">{queryData.event_location}</p>
            </div>
          </div>
        )}

        {/* Event Type */}
        {queryData.event_type && (
          <div className="flex items-start gap-2">
            <Music size={16} className="text-cyan-400 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider">Type</p>
              <p className="text-sm font-semibold text-slate-100 truncate">{queryData.event_type}</p>
            </div>
          </div>
        )}

        {/* Budget */}
        {queryData.budget && (
          <div className="flex items-start gap-2">
            <DollarSign size={16} className="text-cyan-400 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider">Budget</p>
              <p className="text-sm font-semibold text-slate-100 truncate">₹{queryData.budget}</p>
            </div>
          </div>
        )}

        {/* Duration */}
        {queryData.duration_hours && (
          <div className="flex items-start gap-2">
            <Clock size={16} className="text-cyan-400 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider">Duration</p>
              <p className="text-sm font-semibold text-slate-100 truncate">{queryData.duration_hours}h</p>
            </div>
          </div>
        )}

        {/* Artist Genre */}
        {queryData.artist_genre && (
          <div className="flex items-start gap-2">
            <Music size={16} className="text-cyan-400 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider">Genre</p>
              <p className="text-sm font-semibold text-slate-100 truncate">{queryData.artist_genre}</p>
            </div>
          </div>
        )}
      </div>

      {/* Additional Notes */}
      {queryData.additional_notes && (
        <div className="mt-3 pt-3 border-t border-blue-400/20">
          <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">Notes</p>
          <p className="text-sm text-slate-200 line-clamp-2">{queryData.additional_notes}</p>
        </div>
      )}
    </div>
  );
}
