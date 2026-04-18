// ============================================================================
// E365 PLATFORM THEME CONFIGURATOR
// Yahan se aap website ke saare main colors aur theme customize kar sakte hain.
// JS format ki wajah se isko change karna bohot asaan hai bina CSS mein gaye.
// ============================================================================

export const themeSettings = {
  // 1. BRAND COLORS (Website ki pehchaan, button, links, aur highlights)
  // 'primary' color main buttons aur active tabs ke liye use hota hai (Jaise Sidebar aur Action buttons)
  "--theme-brand-primary": "#4f46e5", // Default: Indigo 600
  "--theme-brand-hover": "#4338ca",   // Button hover karne par jo deep color aata hai (Indigo 700)
  "--theme-brand-light": "#e0e7ff",   // Active tabs ke peeche ka halka color (Indigo 100)

  // 2. DASHBOARD BACKGROUNDS (Base aur surface layers)
  // 'base' puray dashboard ke peeche ka canvas hai, 'surface' cards aur sidebars hote hain
  "--theme-bg-base": "#f8fafc",       // Light dashboard background (Slate 50)
  "--theme-bg-surface": "#ffffff",    // Dashboard cards, sidebar aur navbar (White)

  // 3. TEXT COLORS (Headings aur normal padhne wala text)
  "--theme-text-main": "#0f172a",     // Dark text headings ke liye (Slate 900)
  "--theme-text-muted": "#64748b",    // Subtext, inactive menus aur details (Slate 500)

  // 4. ACCENTS & SYSTEM STATES (Success ticks, alerts, notifications)
  "--theme-accent-success": "#3b82f6", // Verified ticks, success messages (Blue 500)
  "--theme-accent-danger": "#ef4444",  // Delete/Logout buttons (Red 500)
};

// Yeh function app mount hone par automatically styles ko poori website HTML Document par laga dega
export const applyThemeTokens = () => {
  const root = document.documentElement;
  Object.entries(themeSettings).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
};
