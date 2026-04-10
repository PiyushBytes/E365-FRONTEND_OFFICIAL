export const theme = {
  colors: {
    primary: {
      red: "#ff003c",
      glow: "rgba(255, 0, 60, 0.4)",
      focus: "#ef4444",
    },
    background: {
      default: "#000000",
      base: "#050505",
      input: "rgba(0, 0, 0, 0.4)",
      card: "#0f0f0f",
      // Chat specific gradients and backgrounds
      chatModal: "linear-gradient(145deg, #020817 0%, #0a1628 40%, #050d1a 100%)",
      chatInput: "#0B1221",
    },
    text: {
      default: "#ffffff",
      muted: "#9ca3af", // Tailwind gray-400
      lightMuted: "#d1d5db", // Tailwind gray-300
    },
    border: {
      default: "#374151", // Tailwind gray-700
      chat: "rgba(56,130,246,0.2)", // blue-400/20
    }
  },
  fonts: {
    heading: "'Syncopate', sans-serif", // For headlines (uppercase typically)
    body: "'Plus Jakarta Sans', sans-serif", // General body copy
  },
  shadows: {
    glowRed: "0 0 20px rgba(255, 0, 60, 0.4)",
    chatInput: "0 4px 30px rgba(0,0,0,0.5)",
  },
  transitions: {
    default: "all 0.3s ease-in-out",
    smooth: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
  }
};

export default theme;
