export default function Navbar() {
  return (
    <div className="fixed top-6 left-0 w-full flex justify-center z-100 px-6 pointer-events-none">
      <nav className="flex items-center gap-5 px-5 py-2 rounded-full border border-red-500/20 bg-black/40 backdrop-blur-xl shadow-[0_0_25px_rgba(255,0,60,0.15)] transition-all hover:border-red-500/40 pointer-events-auto">
        
        {/* LOGO FRAME: High-Impact Branding Container */}
       

        {/* COMPACT LINKS: Luxury Spacing */}
        <div className="hidden md:flex items-center gap-7">
          {["Platform", "Resources", "Artists", "Contact"].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className="text-[9px] font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-[0.3em]"
            >
              {item}
            </a>
          ))}
        </div>

        {/* MINIMALIST ACTION BUTTON */}
        <button className="bg-red-600 hover:bg-red-500 text-white text-[9px] font-black px-5 py-2 rounded-full shadow-[0_4px_12px_rgba(255,0,60,0.3)] transition-all transform active:scale-95 tracking-0.1em uppercase">
          Schedule Demo
        </button>
      </nav>
    </div>
  );
}