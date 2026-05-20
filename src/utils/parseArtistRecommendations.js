/**
 * Parse artist recommendations from message content
 * Handles JSON string content with card_type = "artist_recommendations"
 * Returns structured data with artists array extracted
 */
export const parseArtistRecommendations = (message = {}) => {
  let content = message.content ?? message.text ?? "";
  let artists = message.artists || [];
  let stage = message.stage;
  let botReply = message.bot_reply;

  // If content is a JSON string containing card_type, parse it
  if (typeof content === "string" && content.includes("card_type")) {
    try {
      const parsed = JSON.parse(content);
      if (parsed?.card_type === "artist_recommendations") {
        artists = parsed.artists || [];
        botReply = parsed.bot_reply || "Artist recommendations";
        stage = "recommending";
        content = botReply; // Use bot reply as the text to display
      }
    } catch (e) {
      // If JSON parsing fails, keep original content
    }
  } else if (content && typeof content === "object" && content.card_type === "artist_recommendations") {
    // Handle case where content is already an object
    artists = content.artists || [];
    botReply = content.bot_reply || "Artist recommendations";
    stage = "recommending";
    content = botReply;
  }

  return { text: content, artists, stage, botReply };
};
