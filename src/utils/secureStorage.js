// ─── utils/secureStorage.js ──────────────────────────────────────────────────────
// Yeh localStorage ke liye base64 obfuscation helper hai, taaki plain text token leak na ho.
// Note: Yeh true encryption nahi hai, bas basic scanners ke khilaaf ek extra security layer add karta hai.

const PREFIX = '__sec_';

export const secureStorage = {
  setItem: (key, value) => {
    try {
      const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
      const encodedValue = window.btoa(encodeURIComponent(stringValue));
      localStorage.setItem(PREFIX + key, encodedValue);
    } catch (e) {
      console.error('[secureStorage] error saving value', e);
    }
  },
  
  getItem: (key) => {
    try {
      const encodedValue = localStorage.getItem(PREFIX + key);
      if (!encodedValue) return null;
      const decodedValue = decodeURIComponent(window.atob(encodedValue));
      
      try {
        return JSON.parse(decodedValue);
      } catch {
        return decodedValue;
      }
    } catch (e) {
      console.error('[secureStorage] error reading value', e);
      return null;
    }
  },
  
  removeItem: (key) => {
    localStorage.removeItem(PREFIX + key);
  },
  
  clear: () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }
};
