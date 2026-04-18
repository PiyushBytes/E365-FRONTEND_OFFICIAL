// Yeh humari main App component hai jo puri application ko render karti hai
import React from "react";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    // Yahan par hum base styling apply kar rahe hain (e.g. black background)
    <div className="relative min-h-[100dvh] bg-slate-50 text-slate-900 selection:bg-indigo-500/30 selection:text-indigo-900 font-sans antialiased overflow-x-hidden">
      {/* AppRoutes handle karega saare pages ki routing */}
      <AppRoutes />
    </div>
  );
}
