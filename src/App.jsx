// Yeh humari main App component hai jo puri application ko render karti hai
import React from "react";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    // Yahan par hum base styling apply kar rahe hain (e.g. black background)
    <div className="relative min-h-screen bg-black text-white selection:bg-red-500/30">
      {/* AppRoutes handle karega saare pages ki routing */}
      <AppRoutes />
    </div>
  );
}
