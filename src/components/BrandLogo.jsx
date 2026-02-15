export default function BrandLogo() {
  return (
    <div className="fixed top-8 left-10 z-[200] hidden lg:block group cursor-pointer pointer-events-auto">
      
      {/* Premium Glass Frame Container */}
      <div className="relative flex items-center gap-4 p-2 pr-6 rounded-2xl bg-black/20 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-red-500/30 hover:bg-black/40 hover:shadow-[0_0_40px_rgba(255,0,60,0.15)] overflow-hidden">
        
        {/* Animated Glow Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        {/* Logo Icon Box */}
        <div className="relative w-12 h-12 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center shadow-inner overflow-hidden group-hover:bg-white/10 transition-colors duration-500">
          <img
            src="https://res.cloudinary.com/dbcbsalyr/image/upload/v1771113960/E365_logo_viskon.jpg"
            alt="E365 Logo"
            className="w-10 h-10 object-contain drop-shadow-[0_2px_10px_rgba(255,0,60,0.4)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 rounded-lg"
          />
        </div>

        {/* Text Details */}
        <div className="flex flex-col justify-center relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[18px] font-black tracking-[0.2em] text-white leading-none font-['Syncopate']">
              E365
            </span>
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_#ff003c]" />
          </div>

          <div className="flex flex-col mt-1 overflow-hidden h-3.5">
            <span className="block text-[8px] font-bold tracking-[0.3em] text-gray-400 uppercase transition-transform duration-500 group-hover:-translate-y-full delay-75">
              India Pvt Ltd
            </span>
            <span className="block text-[8px] font-bold tracking-[0.3em] text-red-500 uppercase transition-transform duration-500 translate-y-full group-hover:-translate-y-full delay-75">
              Premium Events
            </span>
          </div>
        </div>

        {/* Shine Effect */}
        <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
      </div>
    </div>
  );
}
