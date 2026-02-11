import React from "react";

const artists = [
  { name: "Pritam", img: "/artists/pri.webp" },
  { name: "A.R. Rahman", img: "/artists/AR.webp" },
  { name: "Arijit Singh", img: "/artists/arijit.webp" },
  { name: "Sachin-Jigar", img: "/artists/sachin.webp" },
  { name: "Vishal-Shekhar", img: "/artists/vis.webp" },
  { name: "Atif Aslam", img: "/artists/aslam.webp" },
  { name: "Anirudh Ravichander", img: "/artists/ani.webp" },
  { name: "Udit Narayan", img: "/artists/udit.webp" },
  { name: "Yo Yo Honey Singh", img: "/artists/yo yo.webp" },
  { name: "Shankar-Ehsaan-Loy", img: "/artists/download (2).webp" },
];

export default function ArtistsPanel({ isOpen, onClose }) {
  return (
    <div
      onClick={onClose} // 👈 Click outside closes
      className={`fixed inset-0 z-40 flex justify-center items-start pt-28 px-6 transition-all duration-300 ${
        isOpen ? "opacity-100 backdrop-blur-sm bg-black/70" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* STOP CLICK FROM CLOSING WHEN CLICKING INSIDE PANEL */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-black/80 border border-red-500/20 rounded-2xl p-8 w-full max-w-6xl max-h-[80vh] overflow-y-auto shadow-[0_0_40px_rgba(255,0,60,0.2)] relative transition-all duration-300 transform ${
          isOpen ? "translate-y-0 scale-100" : "-translate-y-6 scale-95"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-sm"
        >
          ✕ Close
        </button>

        <h2 className="text-2xl font-bold text-red-500 mb-8 text-center">
          Available Artists
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {artists.map((artist, index) => (
            <div key={index} className="text-center group">
              <div className="relative w-32 h-32 mx-auto">
                <img
                  src={artist.img}
                  alt={artist.name}
                  className="w-32 h-32 object-cover rounded-full border-2 border-transparent transition-all duration-300 group-hover:border-red-500"
                />
                {/* GLOW EFFECT */}
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition duration-300 shadow-[0_0_25px_rgba(255,0,60,0.7)]"></div>
              </div>

              <h3 className="mt-3 text-white font-semibold">{artist.name}</h3>
              <p className="text-gray-400 text-sm">Artist</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
