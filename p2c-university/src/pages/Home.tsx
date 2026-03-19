import { Link } from "wouter";
import { ArrowRight, Play, BarChart3, Target, Zap, ShieldCheck, CheckCircle2, Scissors, Video, PenTool, Share2, Layers, Star, TrendingUp } from "lucide-react";
import { SiTiktok, SiInstagram, SiSnapchat, SiYoutube } from "react-icons/si";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="w-full">
      {/* Section 1: Hero */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-48 overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
          {/* Blue ambient blobs */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] opacity-60 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[150px] opacity-40" />
          {/* Orange aurora — centered behind the headline */}
          <div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[380px] rounded-full blur-[90px]"
            style={{ background: 'radial-gradient(ellipse at center, rgba(255,107,0,0.28) 0%, rgba(255,107,0,0.10) 55%, transparent 80%)', animation: 'pulse 4s ease-in-out infinite' }}
          />
          {/* Top-right warm streak */}
          <div 
            className="absolute top-0 right-1/3 w-[350px] h-[250px] rounded-full blur-[80px]"
            style={{ background: 'radial-gradient(ellipse at center, rgba(255,107,0,0.18) 0%, transparent 70%)', animation: 'pulse 6s ease-in-out infinite alternate' }}
          />
          {/* Bottom-left ember */}
          <div 
            className="absolute bottom-8 left-1/4 w-[280px] h-[180px] rounded-full blur-[70px]"
            style={{ background: 'radial-gradient(ellipse at center, rgba(255,140,0,0.15) 0%, transparent 70%)', animation: 'pulse 5s ease-in-out infinite 1s' }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/25 bg-primary/8 text-primary mb-8 font-medium text-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                Now accepting applications for Q3
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={0.1}>
              <div className="flex justify-center mb-6">
                <img
                  src={`${import.meta.env.BASE_URL}images/logo-full.png`}
                  alt="Clippers University"
                  className="hero-logo-animate w-40 sm:w-52 md:w-64 lg:w-72 h-auto object-contain select-none"
                  draggable={false}
                  fetchPriority="high"
                />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight leading-[1.15] mb-8 text-primary drop-shadow-[0_2px_16px_rgba(37,99,235,0.15)]">
                The Creator Network Built for Clippers, UGC Talent,{" "}
                <span className="orange-underline">and Viral</span>{" "}
                Content Teams
              </h1>
            </AnimatedSection>
            
            <AnimatedSection delay={0.3}>
              <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
                Join, connect your socials, create and submit content, and earn through performance-based CPM opportunities. Stop working for free.
              </p>
            </AnimatedSection>
            
            <AnimatedSection delay={0.3} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/signup" 
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-primary text-white font-bold text-lg hover:-translate-y-1 hover:shadow-[0_8px_32px_-8px_rgba(37,99,235,0.5)] transition-all flex items-center justify-center gap-2 border border-primary/20"
              >
                Join as a Creator
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/book-a-call" 
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white border border-border text-foreground font-semibold text-lg hover:border-primary/40 hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
              >
                Book a Call
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Marquee: Clippers University — between Hero and Stats Bar */}
      <div className="overflow-hidden bg-primary py-5 select-none">
        <div className="marquee-track flex whitespace-nowrap">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="inline-flex items-center gap-6 px-6 text-white font-display font-bold text-3xl md:text-4xl uppercase tracking-widest">
              CLIPPERS UNIVERSITY
              <span className="inline-block w-3 h-3 rounded-full bg-white/40" style={{ backgroundColor: '#FF6B00', opacity: 0.7 }} />
            </span>
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={`dup-${i}`} className="inline-flex items-center gap-6 px-6 text-white font-display font-bold text-3xl md:text-4xl uppercase tracking-widest" aria-hidden>
              CLIPPERS UNIVERSITY
              <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: '#FF6B00', opacity: 0.7 }} />
            </span>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <section className="py-12 border-y border-border bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center divide-x divide-border/50">
            {[
              { label: "Elite Creators", value: "500+" },
              { label: "Paid to Creators", value: "$2M+" },
              { label: "Monthly Views", value: "150M+" },
              { label: "Active Brands", value: "50+" }
            ].map((stat, i) => (
              <AnimatedSection key={i} delay={0.1 * i} direction="none" className="flex flex-col gap-2">
                <span className="text-4xl md:text-5xl font-display font-bold text-primary" style={{ borderBottom: i === 0 ? '3px solid hsl(0 72% 48%)' : undefined, display: 'inline-block', paddingBottom: i === 0 ? '2px' : undefined }}>
                  {stat.value}
                </span>
                <span className="text-muted-foreground font-medium">{stat.label}</span>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Influencer Social Proof — Content That Moves Millions */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[250px] rounded-full blur-[80px]" style={{ background: 'rgba(255,107,0,0.06)' }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/20 text-primary text-sm font-semibold mb-5">
              <TrendingUp className="w-4 h-4" /> Viral Content Engine
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Content That Moves{" "}
              <span className="text-primary orange-underline">Millions</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Our clippers work with content from the world's biggest names. The bigger the creator, the bigger your payout potential.
            </p>
          </AnimatedSection>

          {/* Auto-scrolling marquee of influencer cards */}
          <div className="overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8 px-0 select-none">
            <div className="influencer-track flex gap-4 w-max">
              {[...Array(2)].map((_, setIdx) => (
                [
                  { img: `${import.meta.env.BASE_URL}images/kai-cenat.jpeg`,     name: "Kai Cenat",         type: "Streamer",       views: "850M+" },
                  { img: `${import.meta.env.BASE_URL}images/ishowspeed.jpeg`,    name: "IShowSpeed",        type: "Streamer",       views: "620M+" },
                  { img: `${import.meta.env.BASE_URL}images/tate-brothers.png`,  name: "Andrew & Tristan",  type: "Entrepreneurs",  views: "480M+" },
                  { img: `${import.meta.env.BASE_URL}images/bts.jpeg`,           name: "BTS",               type: "K-Pop Icons",    views: "1.2B+" },
                  { img: `${import.meta.env.BASE_URL}images/ice-spice.jpeg`,     name: "Ice Spice",         type: "Artist",         views: "390M+" },
                ].map((person, i) => (
                  <div
                    key={`${setIdx}-${i}`}
                    aria-hidden={setIdx === 1}
                    className="group relative rounded-2xl overflow-hidden flex-shrink-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                    style={{ width: "180px", height: "240px" }}
                  >
                    <img
                      src={person.img}
                      alt={person.name}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="text-white font-bold text-xs leading-tight">{person.name}</div>
                      <div className="text-white/65 text-[10px] mb-1.5">{person.type}</div>
                      <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20">
                        <TrendingUp className="w-2.5 h-2.5 text-white" />
                        <span className="text-white text-[10px] font-bold">{person.views}</span>
                      </div>
                    </div>
                  </div>
                ))
              ))}
            </div>
          </div>

          <AnimatedSection className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              Clip their content. Earn per 1,000 qualified views. <Link href="/signup" className="text-primary font-bold hover:underline">Start today →</Link>
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Section: UGC Video Showcase — scrolling strip */}
      <section className="py-16 bg-[#0a0a0f] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-[120px]" style={{ background: "rgba(30,64,175,0.18)" }} />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[200px] rounded-full blur-[100px]" style={{ background: "rgba(255,107,0,0.12)" }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/70 text-sm font-semibold mb-4">
            <Video className="w-4 h-4" /> UGC Content Examples
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">
            Real UGC. Real Results.
          </h2>
          <p className="text-white/50 text-base max-w-xl mx-auto">
            This is what our creators produce. Authentic, scroll-stopping content that converts for brands.
          </p>
        </div>

        {/* Scrolling video strip */}
        <div className="overflow-hidden select-none">
          <div className="ugc-video-track flex gap-6 w-max px-6">
            {[...Array(2)].map((_, setIdx) => (
              [
                { src: `${import.meta.env.BASE_URL}videos/ugc-1.mp4`, label: "Street UGC", tag: "Ad Creative" },
                { src: `${import.meta.env.BASE_URL}videos/ugc-2.mp4`, label: "AI Actor", tag: "Brand Spot" },
                { src: `${import.meta.env.BASE_URL}videos/ugc-3.mp4`, label: "Creator Reel", tag: "Organic" },
                { src: `${import.meta.env.BASE_URL}videos/ugc-4.mp4`, label: "FitTech AI", tag: "Product" },
              ].map((vid, i) => (
                <div
                  key={`${setIdx}-${i}`}
                  aria-hidden={setIdx === 1}
                  className="relative flex-shrink-0 rounded-[22px] overflow-hidden shadow-2xl border border-white/10"
                  style={{ width: "180px", height: "320px" }}
                >
                  {/* Phone notch decoration */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-black/60 rounded-full z-20" />
                  <video
                    src={vid.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                  {/* Bottom label */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                    <div className="text-white font-bold text-xs leading-tight mb-1">{vid.label}</div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "rgba(255,107,0,0.85)" }}>
                      {vid.tag}
                    </span>
                  </div>
                  {/* TikTok-style side actions */}
                  <div className="absolute right-2 bottom-16 z-10 flex flex-col items-center gap-3">
                    <SiTiktok className="w-4 h-4 text-white/80" />
                  </div>
                </div>
              ))
            ))}
          </div>
        </div>

        <div className="text-center mt-10 relative z-10">
          <Link href="/signup"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold text-sm transition-all"
            style={{ background: "hsl(var(--primary))", color: "white" }}>
            Become a UGC Creator <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Section 3: Creator Types */}
      <section className="py-24 bg-secondary/40 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Built for{" "}
              <span className="text-primary orange-underline">Every Creator Type</span>
            </h2>
            <p className="text-lg text-muted-foreground">Whether you clip, edit, or create from scratch — there's a place for you here.</p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { icon: Scissors, title: "Clippers", desc: "Turn long-form content into viral short-form clips." },
              { icon: Video, title: "UGC Creators", desc: "Create authentic user-generated content for brands." },
              { icon: PenTool, title: "Editors", desc: "Professional post-production and motion graphics." },
              { icon: Share2, title: "Social Growth", desc: "Scale accounts and build audiences organically." },
              { icon: Layers, title: "Multi-Platform", desc: "Distribute content across TikTok, IG, YT & Snap." },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="group h-full bg-card gloss-card rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-all hover:-translate-y-1 text-center shadow-sm hover:shadow-md">
                  <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/15 transition-colors border border-primary/12">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Platform Connections */}
      <section className="py-24 lg:py-32 relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction="right">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Connect Your Platforms</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Link your social accounts once. We track your views and handle the payouts automatically every 30 days.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "TikTok",    bg: "bg-black",                  Icon: SiTiktok,    iconColor: "text-white" },
                  { name: "Instagram", bg: "bg-gradient-to-br from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888]", Icon: SiInstagram, iconColor: "text-white" },
                  { name: "Snapchat",  bg: "bg-[#FFFC00]",              Icon: SiSnapchat,  iconColor: "text-black" },
                  { name: "YouTube",   bg: "bg-[#FF0000]",              Icon: SiYoutube,   iconColor: "text-white" },
                ].map((platform, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group gloss-card">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", platform.bg)}>
                      <platform.Icon className={cn("w-5 h-5", platform.iconColor)} />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{platform.name}</div>
                      <div className="text-xs text-muted-foreground group-hover:text-primary transition-colors">Connect →</div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4">More platforms coming soon. Architecture supports easy expansion.</p>
            </AnimatedSection>

            <AnimatedSection direction="left" className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 to-transparent rounded-3xl blur-2xl -z-10" />
              <div className="bg-card border border-border/60 rounded-2xl overflow-hidden shadow-xl relative z-10 gloss-card">
                <div className="border-b border-border p-4 bg-primary/5 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-neutral-300" />
                    <div className="w-3 h-3 rounded-full bg-neutral-300" />
                    <div className="w-3 h-3 rounded-full bg-neutral-300" />
                  </div>
                  <div className="mx-auto text-xs font-medium text-muted-foreground">Earnings Dashboard</div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-end mb-8">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Total Earned (30 Days)</div>
                      <div className="text-4xl font-display font-bold text-foreground">$12,450.00</div>
                    </div>
                    <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-bold flex items-center gap-1 border border-primary/20">
                      +24% <ArrowRight className="w-3 h-3 -rotate-45" />
                    </div>
                  </div>
                  <div className="h-40 flex items-end justify-between gap-2">
                    {[30, 45, 25, 60, 50, 80, 65, 100].map((h, i) => (
                      <div key={i} className="w-full bg-primary/10 rounded-t-sm relative group">
                        <div 
                          className="absolute bottom-0 w-full bg-gradient-to-t from-primary to-blue-400 rounded-t-sm transition-all duration-500 group-hover:opacity-80"
                          style={{ height: `${h}%` }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Section 5: CPM / Earnings Tiers */}
      <section className="py-24 bg-secondary/40 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Transparent <span className="text-primary">CPM Rates</span>
            </h2>
            <p className="text-lg text-muted-foreground">Clear earnings per 1,000 qualified views. The better your content performs, the higher your tier.</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { tier: "Starter", rate: "$1.00", desc: "Perfect for new clippers building their portfolio.", features: ["Access to basic campaigns", "Monthly payouts", "Performance tracking", "Community access"] },
              { tier: "Growth", rate: "$2.00", desc: "For consistent creators hitting over 100k views/month.", features: ["Access to premium campaigns", "Priority brand matching", "Dedicated support", "Advanced analytics"], popular: true },
              { tier: "Premium", rate: "$3.00", desc: "Our best performance tier for viral powerhouses.", features: ["All Growth features", "Exclusive brand partnerships", "Custom campaign briefs", "Revenue share bonuses", "1-on-1 strategy calls"], highlighted: true },
            ].map((plan, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
                <div className={cn(
                  "relative h-full bg-card gloss-card rounded-2xl p-8 border transition-all hover:-translate-y-1 shadow-sm",
                  plan.highlighted 
                    ? "border-primary shadow-[0_0_40px_-10px_rgba(37,99,235,0.2)] scale-[1.02]" 
                    : "border-border/60 hover:border-primary/30 hover:shadow-md"
                )}>
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full uppercase tracking-wider">
                      Best Performance Tier
                    </div>
                  )}
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-foreground text-background text-xs font-bold rounded-full uppercase tracking-wider">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-2">{plan.tier}</h3>
                  <p className="text-sm text-muted-foreground mb-6">{plan.desc}</p>
                  <div className="mb-6">
                    <span className={cn("text-5xl font-display font-extrabold", plan.highlighted ? "text-primary" : "text-foreground")}>{plan.rate}</span>
                    <span className="text-muted-foreground ml-1">/ CPM</span>
                    <div className="text-xs text-muted-foreground mt-1">per 1,000 qualified views</div>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link 
                    href="/signup" 
                    className={cn(
                      "block text-center py-3 rounded-xl font-bold transition-all",
                      plan.highlighted 
                        ? "bg-primary text-primary-foreground hover:opacity-90 shadow-md shadow-primary/20" 
                        : "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
                    )}
                  >
                    Get Started
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-8 max-w-2xl mx-auto">
            Actual payout structure may depend on campaign quality, platform, retention, watch time, engagement, and posting consistency.
          </p>
        </div>
      </section>

      {/* Section 6: Why Join */}
      <section className="py-24 lg:py-32 relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Why Join{" "}
              <span className="text-primary orange-underline">Clippers University?</span>
            </h2>
            <p className="text-lg text-muted-foreground">Everything you need to scale your content business, in one platform.</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Target, title: "Access to Campaigns", desc: "Browse and apply to high-paying brand campaigns matched to your niche and audience." },
              { icon: BarChart3, title: "Consistent Workflow", desc: "Never run out of work. Our pipeline ensures a steady stream of paid opportunities." },
              { icon: Zap, title: "Track Submissions", desc: "Upload, submit, and track the status of your content — all from one dashboard." },
              { icon: Layers, title: "Multi-Platform Support", desc: "Create for TikTok, Instagram Reels, YouTube Shorts, Snapchat, and more." },
              { icon: TrendingUp, title: "Scale Your Earnings", desc: "Progress through CPM tiers as your content performance grows." },
              { icon: ShieldCheck, title: "Built for Teams", desc: "Designed for modern short-form content teams and solo creators alike." },
            ].map((feature, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="group h-full bg-card gloss-card rounded-2xl p-8 border border-border/60 hover:border-primary/30 transition-all hover:-translate-y-1 shadow-sm hover:shadow-md">
                  <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors border border-primary/12">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: Testimonials / Case Study Preview */}
      <section className="py-24 bg-secondary/40 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Creator <span className="text-primary">Success Stories</span>
            </h2>
            <p className="text-lg text-muted-foreground">Real creators, real results. See how P2C is changing the game.</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Marcus T.", category: "Gaming Clipper", metric: "2.4M views/mo", earnings: "$4,800/mo", growth: "+340%", quote: "P2C turned my hobby into a full-time income. The campaign matching is unreal.", badge: "Top Earner" },
              { name: "Sarah K.", category: "UGC Creator", metric: "890K views/mo", earnings: "$2,670/mo", growth: "+210%", quote: "Finally, a platform that actually pays creators fairly. The Growth tier is a game-changer." },
              { name: "Devon R.", category: "Short-form Editor", metric: "5.1M views/mo", earnings: "$15,300/mo", growth: "+580%", quote: "Went from editing for free to Premium tier in 3 months. This is the future of creator work.", badge: "Premium Tier" },
            ].map((creator, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
                <div className="h-full bg-card gloss-card rounded-2xl p-8 border border-border/60 hover:border-primary/30 transition-all flex flex-col shadow-sm hover:shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                    {creator.badge && (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full border text-highlight border-highlight\/4 bg-highlight\/6">
                        {creator.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground italic mb-6 flex-grow">"{creator.quote}"</p>
                  <div className="border-t border-border pt-4">
                    <div className="font-bold">{creator.name}</div>
                    <div className="text-sm text-primary font-medium">{creator.category}</div>
                    <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                      <div>
                        <div className="text-xs text-muted-foreground">Views</div>
                        <div className="text-sm font-bold">{creator.metric.split("/")[0]}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Earnings</div>
                        <div className="text-sm font-bold text-primary">{creator.earnings.split("/")[0]}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Growth</div>
                        <div className="text-sm font-bold text-highlight">{creator.growth}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="text-center mt-12">
            <Link href="/case-studies" className="inline-flex items-center gap-2 text-primary font-bold hover:underline text-lg">
              View All Case Studies <ArrowRight className="w-5 h-5" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Section 8: Final CTA Banner */}
      <section className="py-32 relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <AnimatedSection>
            <h2 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Ready to start{" "}
              <span className="text-primary orange-underline">creating and earning?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join hundreds of creators who have already turned their clipping skills into a full-time career.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/signup" 
                className="px-8 py-4 rounded-full bg-primary text-white font-bold text-lg hover:-translate-y-1 hover:shadow-[0_8px_32px_-8px_rgba(37,99,235,0.5)] transition-all flex items-center justify-center gap-2 border border-primary/20"
              >
                Join Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/book-a-call" 
                className="px-8 py-4 rounded-full bg-white border border-border font-bold text-lg hover:border-primary/40 hover:bg-primary/5 transition-all flex items-center justify-center"
              >
                Book a Call
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
