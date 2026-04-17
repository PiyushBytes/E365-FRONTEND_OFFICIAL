import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Generic Coverflow Carousel Component
 * Reusable carousel with 3D animations and manual navigation
 *
 * Props:
 * - items: Array of items to display
 * - renderCard: Function to render each card (receives: item, index, isCenter, offset, isExpired)
 * - onNavigate: Callback when active index changes
 * - loading: Boolean for loading state
 * - error: String for error message
 * - onError: Function to handle errors
 * - isExpired: Boolean to indicate if carousel is showing expired items (for styling)
 */
export default function Carousel({
  items = [],
  renderCard,
  onNavigate,
  loading = false,
  error = null,
  loadingMessage = "Loading...",
  errorMessage = "An error occurred",
  containerHeight = "520px",
  cardWidth = "180px",
  cardHeight = "280px",
  stageHeight = "360px",
  isExpired = false,
}) {
  const [active, setActive] = useState(0);
  const total = items.length;

  // Update parent when active index changes
  useEffect(() => {
    if (onNavigate) onNavigate(active);
  }, [active, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") setActive((a) => (a - 1 + total) % total);
      if (e.key === "ArrowRight") setActive((a) => (a + 1) % total);
    };
    if (total > 0) {
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
  }, [total]);

  // Get card transform based on position
  const getCardStyle = (index) => {
    let offset = index - active;
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;

    if (Math.abs(offset) > 1) return { display: "none" };

    const isCenter = offset === 0;
    const xPx = offset * 200;
    const rotY = offset * -28;
    const scale = isCenter ? 1 : 0.82;
    const tz = isCenter ? 0 : -60;

    return {
      position: "absolute",
      left: "50%",
      top: "50%",
      width: cardWidth,
      height: cardHeight,
      borderRadius: "28px",
      overflow: "hidden",
      cursor: isCenter ? "default" : "pointer",
      zIndex: isCenter ? 10 : 5,
      filter: isCenter ? "none" : "brightness(0.38) blur(1px)",
      transition: "all 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      transform: `translate(calc(-50% + ${xPx}px), -50%) scale(${scale}) rotateY(${rotY}deg) translateZ(${tz}px)`,
      willChange: "transform, filter",
    };
  };

  // Loading state
  if (loading) return null;

  // Error state
  if (error) return null;

  // Empty state
  if (items.length === 0) return null;

  return (
    <div
      style={{
        minHeight: containerHeight,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        padding: "20px 0",
      }}
    >
      {/* 3D Stage */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: stageHeight,
          perspective: "1100px",
          perspectiveOrigin: "50% 50%",
          transformStyle: "preserve-3d",
        }}
      >
        <AnimatePresence>
          {items.map((item, i) => {
            let offset = i - active;
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;

            const isCenter = offset === 0;

            return (
              <motion.div
                key={item.id || i}
                style={getCardStyle(i)}
                onClick={() => {
                  if (offset === -1) setActive((a) => (a - 1 + total) % total);
                  else if (offset === 1) setActive((a) => (a + 1) % total);
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderCard && renderCard(item, i, isCenter, offset, isExpired)}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Navigation Dots */}
      <div style={{ display: "flex", gap: "7px", marginTop: "16px" }}>
        {items.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Go to item ${i + 1}`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: i === active ? "22px" : "7px",
              height: "7px",
              borderRadius: "100px",
              background: i === active
                ? isExpired ? "#888" : "#ffffff"
                : isExpired ? "rgba(136,136,136,0.22)" : "rgba(255,255,255,0.22)",
              border: "none",
              padding: 0,
              cursor: "pointer",
              outline: "none",
              transition: "all 0.35s ease",
            }}
          />
        ))}
      </div>

      {/* Arrow Buttons */}
      <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
        {["‹", "›"].map((arrow, i) => (
          <motion.button
            key={arrow}
            whileHover={{ scale: 1.1, backgroundColor: isExpired ? "rgba(100,100,100,0.16)" : "rgba(255,255,255,0.16)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActive((a) => i === 0 ? (a - 1 + total) % total : (a + 1) % total)}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: isExpired ? "rgba(100,100,100,0.08)" : "rgba(255,255,255,0.08)",
              border: isExpired ? "1px solid rgba(100,100,100,0.15)" : "1px solid rgba(255,255,255,0.15)",
              color: isExpired ? "rgba(100,100,100,0.7)" : "rgba(255,255,255,0.7)",
              fontSize: "22px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              outline: "none",
              transition: "all 0.2s ease",
              lineHeight: 1,
              paddingBottom: "2px",
            }}
          >
            {arrow}
          </motion.button>
        ))}
      </div>

      {/* Counter */}
      <div style={{ marginTop: "8px" }}>
        <span style={{ fontSize: "12px", color: isExpired ? "rgba(136,136,136,0.6)" : "rgba(255,255,255,0.6)" }}>
          <span style={{ color: isExpired ? "#888" : "#3b82f6", fontWeight: 600 }}>{active + 1}</span> / {total}
        </span>
      </div>
    </div>
  );
}
