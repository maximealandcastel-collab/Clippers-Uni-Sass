import { Link } from "wouter";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ArrowRight, TrendingUp, Scissors, Video, PenTool, Star, CheckCircle2, Zap, BarChart3, DollarSign } from "lucide-react";
import { SiTiktok, SiInstagram, SiYoutube } from "react-icons/si";

const creatorTypes = [
  {
    type: "Clipper",
    icon: Scissors,
    color: "from-blue-500 to-primary",
    desc: "Cut and distribute viral moments from top creators. You find the gold, we pay you per view.",
    perks: ["Up to $3.00 CPM", "100 uploads/month", "Priority campaign access"],
    stat: "150M+ views generated",
  },
  {
    type: "UGC Creator",
    icon: Video,
    color: "from-orange-500 to-red-500",
    desc: "Create original content for brand campaigns. Your creativity, our distribution network.",
    perks: ["Sponsored campaigns", "50 uploads/month", "Brand partnership access"],
    stat: "$2M+ paid to creators",
  },
  {
    type: "Content Team",
    icon: PenTool,
    color: "from-purple-500 to-pink-500",
    desc: "Run a full content operation. Scale your team with multi-account brand access.",
    perks: ["Team dashboard", "Unlimited submissions", "Dedicated account manager"],
    stat: "500+ elite creators",
  },
];

const platforms = [
  { icon: SiTiktok, name: "TikTok", color: "text-black dark:text-white", views: "90M+" },
  { icon: SiInstagram, name: "Instagram", color: "text-pink-500", views: "40M+" },
  { icon: SiYoutube, name: "YouTube", color: "text-red-600", views: "20M+" },
];

const steps = [
  { num: "01", title: "Sign Up Free", desc: "Create your creator profile. No fees, no gatekeeping." },
  { num: "02", title: "Connect Platforms", desc: "Link your TikTok, Instagram, or YouTube." },
  { num: "03", title: "Apply to Campaigns", desc: "Pick brand campaigns that match your niche." },
  { num: "04", title: "Submit & Earn", desc: "Post content. We track views. You get paid per 1,000." },
];

export default function Creators() {
  return (
    <div className="w-full">

      {/* Hero */}
      <section className="relative pt-24 pb-20 overflow-hidden bg-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[400px] bg-primary/8 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] rounded-full blur-[80px]" style={{ background: "rgba(255,107,0,0.07)" }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 border border-primary/20 text-primary text-sm font-semibold mb-6">
              <Zap className="w-4 h-4" /> 500+ Active Creators
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-tight mb-6 text-foreground">
              The Creator Network <br />
              <span className="text-primary">Built to Pay You</span>
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Join as a Clipper, UGC Creator, or Content Team. Connect your socials. Submit content. Earn performance-based CPM payouts every time your content hits.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.3} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="px-8 py-4 rounded-full bg-primary text-white font-bold text-lg hover:-translate-y-1 hover:shadow-[0_8px_32px_-8px_rgba(37,99,235,0.5)] transition-all flex items-center justify-center gap-2">
              Join as a Creator <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/pricing" className="px-8 py-4 rounded-full border border-border bg-white text-foreground font-semibold text-lg hover:border-primary/40 hover:bg-primary/5 transition-all flex items-center justify-center gap-2">
              View Pricing
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Platform Stats */}
      <section className="py-10 border-y border-border bg-secondary/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-6 text-center">
            {platforms.map((p, i) => (
              <AnimatedSection key={i} delay={i * 0.1} direction="up">
                <div className="flex flex-col items-center gap-2">
                  <p.icon className={`w-8 h-8 ${p.color}`} />
                  <div className="text-2xl font-display font-bold">{p.views}</div>
                  <div className="text-sm text-muted-foreground">{p.name} Views</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Creator Types */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Which Creator Are You?</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">Three paths. One platform. All built to generate income from your content.</p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-8">
            {creatorTypes.map((ct, i) => (
              <AnimatedSection key={i} delay={i * 0.15} direction="up">
                <div className="rounded-3xl border border-border p-8 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all bg-white h-full flex flex-col">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${ct.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <ct.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-bold mb-2">{ct.type}</h3>
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{ct.desc}</p>
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {ct.perks.map((perk, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        {perk}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/8 px-3 py-2 rounded-full w-fit border border-primary/15">
                    <TrendingUp className="w-3.5 h-3.5" /> {ct.stat}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-secondary/40 border-y border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">Four steps from signup to your first payout.</p>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <AnimatedSection key={i} delay={i * 0.12} direction="up">
                <div className="bg-white rounded-2xl p-6 border border-border shadow-sm h-full">
                  <div className="text-4xl font-display font-black text-primary/20 mb-3">{step.num}</div>
                  <h3 className="font-bold text-base mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CPM Breakdown */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Earn Per <span className="text-primary">1,000 Views</span>
            </h2>
            <p className="text-muted-foreground text-lg">The more you post, the more you earn. No cap.</p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { tier: "Starter", cpm: "$1.00", color: "border-border", badge: "Start here" },
              { tier: "Growth", cpm: "$2.00", color: "border-primary", badge: "Most common", highlight: true },
              { tier: "Premium", cpm: "$3.00", color: "border-orange-400", badge: "Top earners" },
            ].map((tier, i) => (
              <AnimatedSection key={i} delay={i * 0.1} direction="up">
                <div className={`rounded-2xl border-2 ${tier.color} p-8 text-center ${tier.highlight ? "bg-primary/4 shadow-lg shadow-primary/10" : "bg-white"}`}>
                  <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">{tier.badge}</div>
                  <div className="text-3xl font-display font-black mb-1">{tier.tier}</div>
                  <div className="flex items-center justify-center gap-1 mb-4">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <span className="text-4xl font-display font-black text-primary">{tier.cpm}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">per 1,000 qualified views</div>
                  {tier.highlight && (
                    <div className="mt-4 flex items-center justify-center gap-1.5 text-primary text-xs font-bold">
                      <Star className="w-3.5 h-3.5" fill="currentColor" /> Most creators land here
                    </div>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection className="text-center mt-10">
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              See full pricing breakdown →
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-1/4 left-1/4 w-[600px] h-[400px] rounded-full blur-[120px]" style={{ background: "rgba(255,255,255,0.06)" }} />
        </div>
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <AnimatedSection>
            <div className="flex items-center justify-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-white/70" />
              <span className="text-white/70 text-sm font-semibold uppercase tracking-widest">Creator Network</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Stop Working for Free</h2>
            <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
              Every view you generate deserves a payout. Join Clippers University and turn your content into consistent income.
            </p>
            <Link href="/signup" className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-white text-primary font-bold text-lg hover:bg-white/90 transition-all shadow-xl">
              Join Now — It's Free <ArrowRight className="w-5 h-5" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

    </div>
  );
}
