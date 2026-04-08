import { motion } from "framer-motion";
import { Music, MapPin, Activity, Calendar, ArrowRight } from "lucide-react";

export default function ChatHome({ onSend }) {
  const ACTIONS = [
    { label: "Plan Event", desc: "Create timelines", prompt: "I want to plan an event", icon: Calendar, pos: "top-[20px] left-[-30px]" },
    { label: "Book Artist", desc: "Top performers", prompt: "I want to book an artist", icon: Music, pos: "bottom-[30px] left-[-30px]" },
    { label: "Find Venue", desc: "Halls & resorts", prompt: "Help me find a venue", icon: MapPin, pos: "top-[20px] right-[-30px]" },
    { label: "Price Quote", desc: "Instant estimates", prompt: "I need a price quote", icon: Activity, pos: "bottom-[30px] right-[-30px]" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -30 }}
      className="h-full flex flex-col items-center justify-center px-6 relative w-full"
    >
      <div className="flex flex-col items-center mb-6 mt-[-40px]">
        <h2 className="text-3xl md:text-[46px] font-medium text-center mb-4 tracking-tight leading-[1.1] text-white uppercase">
          Your AI assistant for <br /> smarter event planning.
        </h2>
        <p className="text-blue-100/60 text-center max-w-lg text-[14px] leading-relaxed font-light">
          Harness the power of AI to automate tasks, streamline workflows, and boost your planning efficiency — all in one simple platform.
        </p>
      </div>

      {/* Main interaction canvas */}
      <div className="relative w-full max-w-[800px] h-[320px] flex items-center justify-center shrink-0 hidden md:flex">
        
        {/* Deep Glow behind orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] bg-blue-500/20 blur-[80px] rounded-full pointer-events-none mix-blend-screen" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] bg-cyan-400/20 blur-[50px] rounded-full pointer-events-none mix-blend-screen" />

        {/* The glowing orb */}
        <div className="relative w-[220px] h-[220px] z-20 flex items-center justify-center rounded-full ring-1 ring-blue-400/30"
          style={{ boxShadow: "0 0 80px rgba(56,130,246,0.3), inset 0 0 40px rgba(56,130,246,0.4)" }}
        >
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 rounded-full border border-transparent border-t-blue-400/80 border-r-cyan-300/40 opacity-80"
          />
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-2 rounded-full border border-transparent border-b-blue-300/80 border-l-cyan-300/40 opacity-80"
          />
          <div className="w-[200px] h-[200px] rounded-full overflow-hidden bg-[#0A1024] border border-blue-400/30 relative">
            <video autoPlay loop muted playsInline className="w-full h-full object-cover scale-[1.3] opacity-80 mix-blend-screen" src="/Videos/agent.mp4" />
            <div className="absolute inset-0 rounded-full bg-blue-500/10 mix-blend-overlay pointer-events-none" />
          </div>
        </div>

        {/* Connection Lines (SVG) perfectly mapping to overlapping cards */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 800 400">
          <defs>
            <linearGradient id="line-glow-left" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(56,130,246,0.1)" />
              <stop offset="100%" stopColor="rgba(56,130,246,0.9)" />
            </linearGradient>
            <linearGradient id="line-glow-right" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(56,130,246,0.9)" />
              <stop offset="100%" stopColor="rgba(56,130,246,0.1)" />
            </linearGradient>
          </defs>
          
          {/* Top Left */}
          <path d="M 200 60 C 280 60, 280 200, 310 200" fill="none" stroke="url(#line-glow-left)" strokeWidth="1.5" />
          <circle cx="310" cy="200" r="3" fill="#60a5fa" className="animate-pulse" />

          {/* Bottom Left */}
          <path d="M 200 340 C 280 340, 280 200, 310 200" fill="none" stroke="url(#line-glow-left)" strokeWidth="1.5" />
          <circle cx="200" cy="340" r="3" fill="#60a5fa" />

          {/* Top Right */}
          <path d="M 600 60 C 520 60, 520 200, 490 200" fill="none" stroke="url(#line-glow-right)" strokeWidth="1.5" />
          <circle cx="490" cy="200" r="3" fill="#60a5fa" className="animate-pulse" />

          {/* Bottom Right */}
          <path d="M 600 340 C 520 340, 520 200, 490 200" fill="none" stroke="url(#line-glow-right)" strokeWidth="1.5" />
          <circle cx="600" cy="340" r="3" fill="#60a5fa" />
        </svg>

        {/* Action Cards positioned around orb overlapping edges purely using explicit offsets */}
        {ACTIONS.map((a, i) => (
          <motion.button key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.1, type: "spring", damping: 20 }}
            onClick={() => onSend(a.prompt)}
            className={`absolute ${a.pos} w-[220px] z-30 flex flex-col items-start p-4 rounded-3xl transition-all duration-300 bg-[#0B1221]/80 backdrop-blur-xl border border-blue-400/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)] hover:border-blue-400 hover:shadow-[0_0_30px_rgba(56,130,246,0.3)] hover:-translate-y-1 group`}
          >
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
            <div className="flex items-center gap-2 mb-3 w-full relative z-10">
               <span className="text-white text-[15px] font-medium tracking-wide flex-1 text-left">{a.label}</span>
               <div className="w-6 h-6 rounded-full bg-[#1A2642] flex items-center justify-center border border-blue-500/30 group-hover:bg-blue-500 group-hover:text-white transition-colors text-blue-400 shadow-[0_0_10px_rgba(56,130,246,0.1)]">
                 <ArrowRight size={12} />
               </div>
            </div>
            <div className="text-[13px] text-blue-200/50 flex items-center gap-2 relative z-10">
               <a.icon size={13} className="text-cyan-400/80" />
               {a.desc}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Mobile fallback layout (stacked) */}
      <div className="flex flex-col gap-3 w-full max-w-[320px] mt-8 md:hidden relative z-20">
          {ACTIONS.map((a, i) => (
            <motion.button key={i} onClick={() => onSend(a.prompt)}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-[#0B1221]/90 backdrop-blur-md border border-blue-400/20 text-white shadow-lg"
            >
              <div className="flex items-center gap-3">
                 <a.icon size={18} className="text-cyan-400" />
                 <span className="font-medium text-sm">{a.label}</span>
              </div>
              <ArrowRight size={14} className="text-blue-400" />
            </motion.button>
          ))}
      </div>

    </motion.div>
  );
}
