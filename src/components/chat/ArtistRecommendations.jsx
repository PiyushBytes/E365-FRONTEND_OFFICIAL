import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader } from "lucide-react";
import Carousel from "../carousel/Carousel";
import { useArtistRecommendations } from "../../hooks/useArtistRecommendations";

export default function ArtistRecommendations({ isVisible, artists = [], onSelectArtist, isExpired = false }) {
  const { artists: artistsList, loading, error, notifying, handleNotifyArtist } = useArtistRecommendations(artists, onSelectArtist);

  if (!isVisible) return null;

  // Render card function for carousel
  const renderCard = (artist, index, isCenter, offset, isExpired) => (
    <>
      {/* Dark theme gradient background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isExpired
            ? "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)"
            : artist.profile?.gradient || "linear-gradient(135deg, #1f3a5f 0%, #2d5a8c 100%)",
        }}
      />

      {/* Artist photo */}
      <img
        src={artist.profile?.profile_photo || "https://via.placeholder.com/180x280?text=Artist"}
        alt={artist.username}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "top center",
          opacity: isExpired ? 0.4 : 0.85,
          filter: isExpired ? "grayscale(100%) brightness(0.6)" : "none",
        }}
      />

      {/* Content Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isExpired
            ? "linear-gradient(to bottom, rgba(40,40,40,0.6) 0%, rgba(20,20,20,0.9) 100%)"
            : "linear-gradient(to bottom, rgba(20,40,70,0.4) 0%, rgba(15,23,42,0.8) 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "12px",
        }}
      >
        {/* Top section - Username */}
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              color: isExpired ? "#808080" : "#e0e7ff",
              fontSize: "14px",
              fontWeight: 700,
              margin: "0",
              letterSpacing: "-0.3px",
            }}
          >
            @{artist.username}
          </p>
        </div>

        {/* Middle section - Genre & Stats */}
        <div style={{ textAlign: "center" }}>
          {artist.profile?.genres && artist.profile.genres.length > 0 && (
            <span
              style={{
                display: "inline-block",
                padding: "4px 10px",
                borderRadius: "12px",
                border: isExpired ? "1px solid rgba(128,128,128,0.4)" : "1px solid rgba(100, 184, 255, 0.4)",
                color: isExpired ? "rgba(128,128,128,0.7)" : "rgba(200, 220, 255, 0.9)",
                fontSize: "10px",
                background: isExpired ? "rgba(40,40,40,0.6)" : "rgba(15, 45, 90, 0.6)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                lineHeight: "1.2",
                marginBottom: "6px",
              }}
            >
              {artist.profile.genres[0]}
            </span>
          )}
          {artist.profile?.bio && (
            <p
              style={{
                color: isExpired ? "rgba(128,128,128,0.6)" : "rgba(200, 210, 230, 0.8)",
                fontSize: "9px",
                margin: "4px 0 0",
                lineHeight: "1.3",
                maxHeight: "30px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {artist.profile.bio}
            </p>
          )}
        </div>

        {/* Bottom section - Notification Button */}
        {isCenter && (
          <motion.button
            whileHover={{ scale: isExpired ? 1 : 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              if (!isExpired) handleNotifyArtist(artist.artist_id);
            }}
            disabled={notifying === artist.artist_id || isExpired}
            style={{
              alignSelf: "center",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: isExpired
                ? "rgba(80,80,80,0.5)"
                : notifying === artist.artist_id
                ? "rgba(70, 90, 120, 0.7)"
                : "linear-gradient(135deg, #1e8dd4, #06b6d4)",
              border: "none",
              color: isExpired ? "#666" : "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: isExpired ? "not-allowed" : "pointer",
              boxShadow: isExpired
                ? "none"
                : notifying === artist.artist_id
                ? "0 4px 12px rgba(0,0,0,0.3)"
                : "0 6px 20px rgba(6, 182, 212, 0.5)",
              transition: "all 0.3s ease",
            }}
          >
            {isExpired ? (
              <span style={{ fontSize: "18px" }}>✕</span>
            ) : notifying === artist.artist_id ? (
              <Loader size={16} className="animate-spin" />
            ) : (
              <Check size={16} strokeWidth={3} />
            )}
          </motion.button>
        )}
      </div>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full mt-2 px-6"
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between px-1">
          <h3 className="text-lg font-semibold text-white">Recommended Artists</h3>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <Loader size={24} className="text-blue-400 animate-spin" />
            <span className="ml-2 text-slate-400 text-sm">Finding best artists...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Carousel */}
        {!loading && !error && artistsList.length > 0 && (
          <Carousel
            items={artistsList}
            renderCard={renderCard}
            cardWidth="180px"
            cardHeight="280px"
            isExpired={isExpired}
          />
        )}

        {/* Empty State */}
        {!loading && !error && artistsList.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-sm">No artists found</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
