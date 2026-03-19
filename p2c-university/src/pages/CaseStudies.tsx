import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { PlayCircle } from "lucide-react";

function P2PFitTechLogo() {
  return (
    <div className="flex items-center gap-2.5 flex-shrink-0">
      <div className="w-9 h-9 rounded-full border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: "#FF6B00", background: "radial-gradient(circle at 40% 40%, #fff8f3, #ffe8d0)" }}>
        <span className="font-black text-[9px] leading-none" style={{ color: "#FF6B00" }}>P2P</span>
      </div>
      <span className="font-black text-base whitespace-nowrap" style={{ color: "#444" }}>
        P2P <span style={{ color: "#FF6B00" }}>Fit</span>Tech AI
      </span>
    </div>
  );
}

function HubFitLogo() {
  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#1A73E8" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="7" r="4" fill="white"/>
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="white"/>
        </svg>
      </div>
      <span className="font-black text-base whitespace-nowrap" style={{ color: "#1A73E8" }}>HubFit.io</span>
    </div>
  );
}

function TrainorizeLogo() {
  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#F5A623" }}>
        <span className="font-black text-base text-black leading-none">Tr</span>
      </div>
      <span className="font-black text-base whitespace-nowrap text-black">Trainerize</span>
    </div>
  );
}

function EmergentLogo() {
  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#111" }}>
        <span className="font-black text-lg text-white italic leading-none">e</span>
      </div>
      <span className="font-black text-base whitespace-nowrap" style={{ color: "#111" }}>Emergent</span>
    </div>
  );
}

function ResendLogo() {
  return (
    <div className="flex items-center px-5 py-2 rounded-xl flex-shrink-0" style={{ background: "#000" }}>
      <span className="font-black text-base text-white tracking-tight whitespace-nowrap">Resend</span>
    </div>
  );
}

function CursorLogo() {
  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
        <polygon points="20,2 38,12 38,28 20,38 2,28 2,12" fill="url(#cg)" stroke="#aaa" strokeWidth="1"/>
        <defs>
          <linearGradient id="cg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e0e0e0"/>
            <stop offset="50%" stopColor="#a0a0a0"/>
            <stop offset="100%" stopColor="#d0d0d0"/>
          </linearGradient>
        </defs>
      </svg>
      <span className="font-black text-base tracking-[0.15em] whitespace-nowrap" style={{ color: "#555" }}>CURSOR</span>
    </div>
  );
}

function ThreeHundredLogo() {
  return (
    <div className="flex items-center flex-shrink-0" style={{
      fontFamily: "serif",
      fontSize: "2rem",
      fontWeight: 900,
      letterSpacing: "-0.02em",
      background: "linear-gradient(180deg, #ff4444 0%, #cc0000 50%, #880000 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      filter: "drop-shadow(0 0 6px rgba(200,0,0,0.5))",
      lineHeight: 1,
    }}>
      300
    </div>
  );
}

function ChimeLogo() {
  return (
    <span className="font-black text-2xl whitespace-nowrap flex-shrink-0" style={{
      color: "#32C84B",
      letterSpacing: "-0.01em",
      fontFamily: "sans-serif",
    }}>
      chime
    </span>
  );
}

function TopDawgLawLogo() {
  return (
    <div className="flex items-center gap-0 flex-shrink-0 rounded-lg overflow-hidden" style={{ height: 44 }}>
      <div className="h-full flex items-center justify-center px-3 py-1" style={{ background: "#F5C518", minWidth: 80 }}>
        <div className="text-center">
          <div className="font-black text-[10px] leading-tight text-black uppercase tracking-wide">TOP DAWG</div>
          <div className="font-black text-[10px] leading-tight text-black uppercase tracking-wide">LAW</div>
        </div>
      </div>
      <div className="h-full flex items-center px-2" style={{ background: "#111" }}>
        <span className="text-white text-[9px] font-bold whitespace-nowrap">@TOPDAWGLAW</span>
      </div>
    </div>
  );
}

const BRAND_LOGOS = [
  { key: "p2p",       component: <P2PFitTechLogo /> },
  { key: "hubfit",    component: <HubFitLogo /> },
  { key: "trainerize",component: <TrainorizeLogo /> },
  { key: "emergent",  component: <EmergentLogo /> },
  { key: "resend",    component: <ResendLogo /> },
  { key: "cursor",    component: <CursorLogo /> },
  { key: "300",       component: <ThreeHundredLogo /> },
  { key: "chime",     component: <ChimeLogo /> },
  { key: "topdawg",   component: <TopDawgLawLogo /> },
];

const TRACK = [...BRAND_LOGOS, ...BRAND_LOGOS, ...BRAND_LOGOS];

export default function CaseStudies() {
  const cases = [
    {
      name: "Marcus T.",
      niche: "Gaming Highlights",
      stat: "300%",
      statLabel: "Revenue Growth",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
      story: "Marcus went from making $0 posting Valorant clips to generating a full-time income by switching to our Growth Tier campaigns."
    },
    {
      name: "Sarah K.",
      niche: "UGC / Lifestyle",
      stat: "500+",
      statLabel: "Brand Deals Delivered",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
      story: "By utilizing our smart matching, Sarah automated her outreach and now strictly focuses on creating high-converting UGC."
    },
    {
      name: "Alex & Team",
      niche: "Podcast Editor",
      stat: "$50k",
      statLabel: "Monthly Revenue",
      image: "https://images.unsplash.com/photo-1598550880863-4e8aa3d0ddb4?w=800&q=80",
      story: "A small team of 3 editors scaled their podcast clipping agency using P2C's premium enterprise infrastructure."
    },
    {
      name: "David R.",
      niche: "Tech Shorts",
      stat: "10M",
      statLabel: "Monthly Views",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
      story: "David unlocked our Premium Tier within 60 days, gaining access to exclusive tech brand budgets at $3.00 CPM."
    }
  ];

  return (
    <div className="w-full">

      {/* ── Hero ── */}
      <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-6">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            Creator <span className="text-primary">Success</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Read how top clippers and editors are utilizing Clippers University to scale their income and build sustainable businesses.
          </p>
        </AnimatedSection>
      </div>

      {/* ── Partnership Brands Ticker ── */}
      <AnimatedSection delay={0.1}>
        <div className="border-y border-border bg-white py-10 overflow-hidden select-none mb-16" style={{ boxShadow: "inset 0 1px 0 0 #f0f0f0, inset 0 -1px 0 0 #f0f0f0" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-7 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
              Brands We've Partnered With
            </p>
          </div>

          <div className="overflow-hidden">
            <div className="logo-track flex items-center gap-0 w-max">
              {TRACK.map((brand, i) => (
                <div
                  key={`${brand.key}-${i}`}
                  aria-hidden={i >= BRAND_LOGOS.length * 2}
                  className="flex items-center px-10 py-1 flex-shrink-0 transition-all duration-300 hover:scale-105 cursor-default"
                >
                  {brand.component}
                  <span className="inline-block w-px h-8 bg-border ml-10 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ── Creator Success Stories ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid md:grid-cols-2 gap-8">
          {cases.map((c, i) => (
            <AnimatedSection key={c.name} delay={i * 0.1}>
              <div className="group rounded-3xl bg-card border border-border overflow-hidden hover:border-primary/50 transition-all duration-500">
                <div className="aspect-[16/9] relative overflow-hidden">
                  <div className="absolute inset-0 bg-background/20 mix-blend-overlay z-10" />
                  <img
                    src={c.image}
                    alt={c.niche}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-20" />
                  <div className="absolute bottom-6 left-6 z-30">
                    <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full mb-3 inline-block">
                      {c.niche}
                    </span>
                    <h3 className="text-3xl font-display font-bold text-white">{c.name}</h3>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-center gap-6 mb-6 pb-6 border-b border-border">
                    <div>
                      <div className="text-4xl font-display font-bold text-primary mb-1">{c.stat}</div>
                      <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{c.statLabel}</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-6">{c.story}</p>
                  <button className="flex items-center gap-2 text-sm font-bold text-foreground hover:text-primary transition-colors">
                    <PlayCircle className="w-5 h-5" />
                    Watch Interview
                  </button>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>

    </div>
  );
}
