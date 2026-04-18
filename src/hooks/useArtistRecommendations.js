import { useState, useCallback } from "react";

/**
 * Custom hook to manage artist recommendations
 * Recommendations are passed as props, not fetched from API
 */
export const useArtistRecommendations = (artists = [], onSelectArtist = null) => {
  const [notifying, setNotifying] = useState(null);

  // Function to handle artist selection - sends username to chat
  const handleNotifyArtist = useCallback(
    async (artistId) => {
      try {
        setNotifying(artistId);
        console.log("Artist selected:", artistId);

        // Find the artist by ID to get username
        const selectedArtist = artists.find(a => a.artist_id === artistId);
        if (selectedArtist && onSelectArtist) {
          // Send artist username to chat
          console.log("Sending artist to chat:", selectedArtist.username);
          onSelectArtist(selectedArtist.username);
        }
      } catch (err) {
        console.error("Error handling artist selection:", err);
      } finally {
        setNotifying(null);
      }
    },
    [artists, onSelectArtist]
  );

  return {
    artists,
    loading: false,
    error: null,
    notifying,
    handleNotifyArtist,
  };
};
