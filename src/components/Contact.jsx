import { Instagram, Twitter, Facebook, Phone } from "lucide-react";

export default function Contact() {
  const socialLinks = [
    { icon: <Instagram size={16} />, href: "#" },
    { icon: <Twitter size={16} />, href: "#" },
    { icon: <Facebook size={16} />, href: "#" },
  ];

  const statusItems = [
    // { label: "Stage", status: "Ready" },
    // { label: "Sound", status: "Active" },
    // { label: "Lighting", status: "Live" },
    // { label: "Artists", status: "Booked" },
  ];

  return (
    <section className="relative py-24 px-6 bg-gray-950 text-center overflow-hidden">
      {/* MAIN CTA SECTION */}
      <div className="relative z-10 mb-16">
        <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic text-white mb-6">
          READY TO <span className="text-red-600 drop-shadow-[0_0_20px_rgba(220,38,38,0.4)]">GO LIVE?</span>
        </h2>
        <div className="h-3px w-16 bg-red-600 mx-auto shadow-[0_0_15px_rgba(220,38,38,0.6)]" />
      </div>

      {/* CENTERED CONTACT & SOCIAL BAR */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-8 mb-24">
        {/* Phone Number */}
        <a 
          href="tel:+919876543210" 
          className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:border-red-500/50 hover:bg-white/10 transition-all duration-300 group"
        >
          <Phone size={16} className="text-white/60 group-hover:text-red-500 transition-colors" />
          <span className="text-xs font-bold tracking-[0.2em] text-white/80">+91 98765 43210</span>
        </a>

        {/* Vertical Divider */}
        <div className="hidden md:block h-6 w-1px bg-white/10" />

        {/* Social Icons */}
        <div className="flex items-center gap-4">
          {socialLinks.map((social, index) => (
            <a 
              key={index}
              href={social.href} 
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-red-600 hover:border-red-600 transition-all duration-300"
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>

      {/* BOTTOM STATUS LOGS */}
      <div className="max-w-6xl mx-auto pt-10 border-t border-white/5 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
        {statusItems.map((item) => (
          <div key={item.label} className="group flex items-center gap-4">
            {/* LED Glow Dot */}
            <div className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-20"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-600 shadow-[0_0_8px_rgba(255,0,0,1)]"></span>
            </div>

            <div className="flex flex-col items-start text-left">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 group-hover:text-white transition-all duration-500">
                {item.label}
              </span>
              <div className="h-3 overflow-hidden">
                <span className="text-[7px] font-black uppercase tracking-[0.2em] text-red-500/80 opacity-0 group-hover:opacity-100 transition-all duration-500 block translate-y-1 group-hover:translate-y-0">
                  SYSTEM::{item.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}