export default function BrandLogo() {
  return (
    <div className="fixed top-8 left-10 z-150 hidden lg:flex items-center gap-5 group cursor-pointer pointer-events-auto">
      <div className="relative w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center backdrop-blur-2xl shadow-2xl transition-all duration-500 group-hover:border-red-500/50 group-hover:shadow-[0_0_40px_rgba(255,0,60,0.25)]">
        <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <img
          src="/Logos/logo1.png"
          alt="E365"
          className="w-10 h-10 object-contain drop-shadow-[0_0_12px_rgba(255,0,60,0.6)] group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      <div className="flex flex-col select-none">
        <div className="flex items-baseline gap-1">
          <span className="text-[14px] font-black tracking-[0.5em] text-white leading-none uppercase">
            E365
          </span>
          <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse shadow-[0_0_8px_#ff003c]" />
        </div>

        <span className="text-[9px] font-extrabold tracking-[0.3em] text-red-500 uppercase mt-2 opacity-80 group-hover:opacity-100 transition-opacity">
          INDIA PVT LTD
        </span>
      </div>

      <div className="h-8 w-px bg-linear-to-b from-transparent via-white/20 to-transparent ml-2 opacity-0 group-hover:opacity-100 transition-all duration-700" />
    </div>
  );
}
