import { useState, useEffect } from "react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { useAuth } from "@/context/AuthContext";
import { Link, useLocation } from "wouter";
import { Search, Clock, ArrowRight, CheckCircle2, Lock, Users, Package } from "lucide-react";
import { SiTiktok, SiInstagram, SiYoutube } from "react-icons/si";

const campaigns = [
  {
    id: 2,
    brand: "P2P Fit Tech AI",
    project: "TikTok & Instagram Launch Push",
    deliverable: "Product Demo + Lifestyle",
    platform: "TikTok + Instagram",
    contentStyle: "Tech Demo + Fitness Lifestyle",
    dueDate: "Apr 20, 2026",
    cpmTier: "Growth Premium",
    rate: "$3.00 CPM",
    budget: "$30k Pool",
    tags: ["TikTok", "Instagram", "Reels"],
    deadline: "Open",
    restricted: false,
    platformIcons: ["tiktok", "instagram"],
    logo: "/p2c-university/images/p2p-fittech-logo.jpeg",
    description: "P2P Fit Tech AI is the world's first AI-powered personal training platform — and it's rewriting what's possible in the fitness industry. This isn't just an app, it's a revolution. Powered by cutting-edge artificial intelligence, P2P delivers a true 1-on-1 training experience at scale, adapting in real time to each user's body, goals, and progress. For personal trainers, it means full financial independence — build your client base without limits, automate your programming, and get paid while you sleep. Create high-energy content that captures this breakthrough and makes viewers feel like they're witnessing something that's never existed before — because they are.",
  },
  {
    id: 6,
    brand: "P2P Fit Tech AI",
    project: "Creator Growth Program",
    deliverable: "Lifestyle + Demo Clips",
    platform: "TikTok + Instagram",
    contentStyle: "Fitness Lifestyle / Everyday Creators",
    dueDate: "May 10, 2026",
    cpmTier: "Growth",
    rate: "$2.00 CPM",
    budget: "$15k Pool",
    tags: ["TikTok", "Instagram", "Reels"],
    deadline: "Open",
    restricted: false,
    platformIcons: ["tiktok", "instagram"],
    logo: "/p2c-university/images/p2p-fittech-logo.jpeg",
    description: "P2P Fit Tech AI is the world's first AI-powered personal training platform — and it's rewriting what's possible in the fitness industry. This isn't just an app, it's a revolution. Powered by cutting-edge artificial intelligence, P2P delivers a true 1-on-1 training experience at scale, adapting in real time to each user's body, goals, and progress. For personal trainers, it means full financial independence — build your client base without limits, automate your programming, and get paid while you sleep. Create high-energy content that captures this breakthrough and makes viewers feel like they're witnessing something that's never existed before — because they are.",
  },
  {
    id: 7,
    brand: "P2P Fit Tech AI",
    project: "Starter Creator Wave",
    deliverable: "Short-Form Intro Clips",
    platform: "TikTok + Instagram",
    contentStyle: "Raw / Authentic / Beginner-Friendly",
    dueDate: "May 20, 2026",
    cpmTier: "Starter",
    rate: "$1.00 CPM",
    budget: "$5k Pool",
    tags: ["TikTok", "Instagram", "Reels"],
    deadline: "Open",
    restricted: false,
    platformIcons: ["tiktok", "instagram"],
    logo: "/p2c-university/images/p2p-fittech-logo.jpeg",
    description: "P2P Fit Tech AI is the world's first AI-powered personal training platform — and it's rewriting what's possible in the fitness industry. This isn't just an app, it's a revolution. Powered by cutting-edge artificial intelligence, P2P delivers a true 1-on-1 training experience at scale, adapting in real time to each user's body, goals, and progress. For personal trainers, it means full financial independence — build your client base without limits, automate your programming, and get paid while you sleep. Create high-energy content that captures this breakthrough and makes viewers feel like they're witnessing something that's never existed before — because they are.",
  },
  {
    id: 1,
    brand: "Coach Cashflow",
    project: "Instagram Page & Threads Growth",
    deliverable: "Motivational / Educational Clips",
    platform: "Instagram + Threads",
    contentStyle: "Personal Brand / Talking Head",
    dueDate: "May 1, 2026",
    cpmTier: "Growth",
    rate: "$2.00 CPM",
    budget: "$12k Pool",
    tags: ["Instagram", "Reels"],
    deadline: "Open",
    restricted: false,
    platformIcons: ["instagram"],
    logo: "/p2c-university/images/coach-cashflow-logo.jpeg",
    description: "Coach Cashflow is on a mission to show personal trainers and fitness coaches a smarter way to scale their income and explode their online presence. Create content that speaks directly to coaches who are grinding for clients but leaving money on the table. Inspire them to think bigger, grow their following, and build a business that works without them — this is the soft entry point into a bigger ecosystem that's changing the game for fitness professionals worldwide.",
  },
  {
    id: 3,
    brand: "P2Wm",
    project: "Multi-Platform Brand Campaign",
    deliverable: "Brand Lifestyle Content",
    platform: "TikTok + Instagram + YouTube",
    contentStyle: "Street / Luxury / Lifestyle — All Creator Types Welcome",
    dueDate: "Apr 30, 2026",
    cpmTier: "Growth",
    rate: "$2.00 CPM",
    budget: "$8k Pool",
    tags: ["TikTok", "Instagram", "Reels", "Shorts"],
    deadline: "Open",
    restricted: false,
    platformIcons: ["tiktok", "instagram", "youtube"],
    logo: "/p2c-university/images/p2wm-logo.png",
    description: "P2Wm isn't just a clothing brand — it's a statement. And the beauty of it? Every creator has a lane here. Whether you're a fitness creator, a lifestyle vlogger, a fashion Reels creator, a TikTok storyteller, or a YouTube Shorts personality — P2Wm fits your world. Worn by those who move different, think different, and refuse to blend in. Create content that captures that energy: raw, confident, unapologetic. Fit checks, lifestyle reels, behind-the-scenes drops, street style — whatever your format, bring it. P2Wm is for the ones who were built for more.",
  },
  {
    id: 4,
    brand: "TechFlow Audio",
    project: "Q3 Product Launch",
    deliverable: "Product Review",
    platform: "TikTok",
    contentStyle: "Unboxing + Review",
    dueDate: "Apr 1, 2026",
    cpmTier: "Growth",
    rate: "$2.00 CPM",
    budget: "$10k Pool",
    tags: ["TikTok", "Shorts"],
    deadline: "Closed",
    restricted: true,
    platformIcons: ["tiktok"],
    description: "Creator slots are full for this campaign.",
  },
  {
    id: 5,
    brand: "FitSupplement Co.",
    project: "Spring Push Campaign",
    deliverable: "UGC Testimonial",
    platform: "Instagram",
    contentStyle: "Lifestyle + Fitness",
    dueDate: "Mar 25, 2026",
    cpmTier: "Premium",
    rate: "$3.00 CPM",
    budget: "$25k Pool",
    tags: ["Instagram", "TikTok"],
    deadline: "Closed",
    restricted: true,
    platformIcons: ["instagram", "tiktok"],
    description: "Creator slots are full for this campaign.",
  },
];

const platformFilters = ["All", "TikTok", "Instagram", "Reels"];
const tierFilters = ["All", "Starter", "Growth", "Growth Premium", "Premium"];

const BUNDLE_CAMPAIGN_IDS = [2, 6, 7];

export default function Campaigns() {
  const { user, token } = useAuth();
  const [, setLocation] = useLocation();
  const [platformFilter, setPlatformFilter] = useState("All");
  const [tierFilter, setTierFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedCampaigns, setAppliedCampaigns] = useState<number[]>([]);
  const [approvedCampaigns, setApprovedCampaigns] = useState<number[]>([]);
  const [applyingId, setApplyingId] = useState<number | null>(null);
  const [applyError, setApplyError] = useState<string>("");

  useEffect(() => {
    if (!token || !user) return;
    fetch("/api/cu/applications", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : { applications: [] })
      .then(data => {
        const apps: { campaign_id: number | string; status: string }[] = data.applications || [];
        setAppliedCampaigns(apps.map(a => Number(a.campaign_id)));
        setApprovedCampaigns(apps.filter(a => a.status === "approved").map(a => Number(a.campaign_id)));
      })
      .catch(() => {});
  }, [token, user]);

  const filteredCampaigns = campaigns.filter(c => {
    const matchesPlatform = platformFilter === "All" || c.tags.includes(platformFilter);
    const matchesTier = tierFilter === "All" || c.cpmTier === tierFilter;
    const matchesSearch = searchQuery === "" || c.brand.toLowerCase().includes(searchQuery.toLowerCase()) || c.project.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesTier && matchesSearch;
  });

  const handleApply = async (campaign: typeof campaigns[0]) => {
    if (!user || !token) { setLocation("/login"); return; }
    if (appliedCampaigns.includes(campaign.id)) return;
    setApplyingId(campaign.id);
    setApplyError("");
    try {
      const slugId = campaign.brand.toLowerCase().replace(/\s+/g, "-") + "-" + campaign.id;
      const res = await fetch(`/api/cu/campaigns/${slugId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ campaign_name: `${campaign.brand} — ${campaign.project}` }),
      });
      if (res.ok || res.status === 409) {
        setAppliedCampaigns(prev => [...prev, campaign.id]);
      } else {
        const err = await res.json().catch(() => ({ error: "Apply failed" }));
        setApplyError(err.error || "Apply failed");
      }
    } catch {
      setApplyError("Network error. Please try again.");
    } finally {
      setApplyingId(null);
    }
  };

  const tierColors: Record<string, string> = {
    Starter: "bg-neutral-100 text-neutral-500 border border-neutral-200",
    Growth: "bg-primary/10 text-primary border border-primary/20",
    Premium: "bg-amber-50 text-amber-700 border border-amber-200",
    "Growth Premium": "bg-gradient-to-r from-primary/20 to-amber-100 text-amber-700 border border-amber-300 font-black",
  };

  const platformBg: Record<string, string> = {
    tiktok: "bg-black",
    instagram: "bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888]",
    youtube: "bg-[#FF0000]",
  };

  const PlatformIcon = ({ name }: { name: string }) => {
    if (name === "tiktok") return <SiTiktok className="w-3.5 h-3.5" />;
    if (name === "instagram") return <SiInstagram className="w-3.5 h-3.5" />;
    if (name === "youtube") return <SiYoutube className="w-3.5 h-3.5" />;
    return null;
  };

  return (
    <div className="py-12 bg-secondary/10 min-h-screen">
      {!user && (
        <div className="bg-primary/10 border-b border-primary/20 py-3 px-4 text-center text-sm">
          <span className="text-muted-foreground">Browse open campaigns below. </span>
          <Link href="/signup" className="text-primary font-bold hover:underline">
            Join free →
          </Link>
          <span className="text-muted-foreground"> to apply and start earning.</span>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 mt-8">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <AnimatedSection direction="none">
            <h1 className="text-4xl font-display font-bold mb-2">Campaign Marketplace</h1>
            <p className="text-muted-foreground">Find and apply to high-paying brand campaigns.</p>
          </AnimatedSection>

          <AnimatedSection direction="none" delay={0.1} className="w-full md:w-auto">
            <div className="relative md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search brands or projects..."
                className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-primary text-sm"
              />
            </div>
          </AnimatedSection>
        </div>

        {/* Filters */}
        <AnimatedSection direction="none" delay={0.15} className="mb-8 space-y-4">
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Platform</div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {platformFilters.map(tag => (
                <button
                  key={tag}
                  onClick={() => setPlatformFilter(tag)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    platformFilter === tag
                      ? "bg-primary text-primary-foreground"
                      : "bg-background border border-border text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">CPM Tier</div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {tierFilters.map(tag => (
                <button
                  key={tag}
                  onClick={() => setTierFilter(tag)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    tierFilter === tag
                      ? "bg-primary text-primary-foreground"
                      : "bg-background border border-border text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign, i) => (
            <AnimatedSection key={campaign.id} delay={i * 0.05}>
              <div className={`relative bg-white border rounded-2xl overflow-hidden flex flex-col h-full transition-all group ${
                campaign.restricted
                  ? "border-neutral-200 opacity-75 grayscale-[30%]"
                  : "border-primary/30 hover:border-[#FF6B00] hover:shadow-[0_0_0_2px_rgba(255,107,0,0.15)]"
              }`}>

                {/* Restricted overlay banner */}
                {campaign.restricted && (
                  <div className="absolute top-0 left-0 right-0 z-10 bg-neutral-800/90 backdrop-blur-sm py-2 px-4 flex items-center justify-center gap-2">
                    <Users className="w-4 h-4 text-neutral-300" />
                    <span className="text-xs font-bold text-neutral-200 uppercase tracking-widest">Capacity Full — Too Many Creators</span>
                    <Lock className="w-3.5 h-3.5 text-neutral-400" />
                  </div>
                )}

                <div className={`p-6 flex-grow ${campaign.restricted ? "pt-12" : ""}`}>
                  <div className="flex justify-between items-start mb-4">
                    {/* Brand logo */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-border flex items-center justify-center shrink-0">
                      {(campaign as any).logo ? (
                        <img src={(campaign as any).logo} alt={campaign.brand} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl font-bold text-primary font-display">{campaign.brand.charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Platform icons */}
                      <div className="flex gap-1">
                        {campaign.platformIcons.map(p => (
                          <span key={p} className={`w-6 h-6 rounded-md flex items-center justify-center text-white ${platformBg[p] ?? "bg-neutral-500"}`}>
                            <PlatformIcon name={p} />
                          </span>
                        ))}
                      </div>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${tierColors[campaign.cpmTier]}`}>
                        {campaign.cpmTier}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-1">{campaign.brand}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{campaign.project}</p>

                  {!campaign.restricted && (
                    <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{campaign.description}</p>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    {campaign.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 bg-secondary text-xs font-medium rounded-md text-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {!campaign.restricted && (
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-xs text-muted-foreground mb-0.5">Platform</div>
                        <div className="font-semibold text-sm">{campaign.platform}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-0.5">Content Style</div>
                        <div className="font-semibold text-sm">{campaign.contentStyle}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-0.5">Payout Rate</div>
                        <div className="font-semibold text-sm text-primary">{campaign.rate}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-0.5">Budget Pool</div>
                        <div className="font-semibold text-sm">{campaign.budget}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content bundle unlock banner — approved P2P creators only */}
                {BUNDLE_CAMPAIGN_IDS.includes(campaign.id) && approvedCampaigns.includes(campaign.id) && (
                  <Link
                    href="/dashboard#bundle"
                    className="mx-4 mb-3 flex items-center justify-between gap-3 px-4 py-3 bg-[#0a0a0a] hover:bg-primary/90 rounded-xl transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                        <Package className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <div className="text-white text-xs font-bold leading-tight">Content Bundle Unlocked</div>
                        <div className="text-white/50 text-xs group-hover:text-white/70 transition-colors">4 videos · 5 photos — ready to download</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-primary group-hover:text-white transition-colors shrink-0" />
                  </Link>
                )}

                <div className={`p-4 border-t flex justify-between items-center ${
                  campaign.restricted ? "border-neutral-100 bg-neutral-50" : "border-border bg-secondary/20"
                }`}>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    {campaign.deadline}
                  </div>

                  {campaign.restricted ? (
                    <span className="px-4 py-1.5 bg-neutral-200 text-neutral-500 text-sm font-bold rounded-lg flex items-center gap-1.5 cursor-not-allowed select-none">
                      <Lock className="w-3.5 h-3.5" /> Restricted
                    </span>
                  ) : approvedCampaigns.includes(campaign.id) ? (
                    <span className="text-sm font-bold text-green-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Approved
                    </span>
                  ) : appliedCampaigns.includes(campaign.id) ? (
                    <span className="text-sm font-bold text-primary flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Applied
                    </span>
                  ) : user ? (
                    <button
                      onClick={() => handleApply(campaign)}
                      disabled={applyingId === campaign.id}
                      className="px-4 py-1.5 bg-primary text-primary-foreground text-sm font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1 disabled:opacity-60"
                    >
                      {applyingId === campaign.id ? "Applying..." : <><span>Apply</span> <ArrowRight className="w-4 h-4" /></>}
                    </button>
                  ) : (
                    <Link
                      href="/signup"
                      className="px-4 py-1.5 bg-secondary border border-border text-sm font-bold rounded-lg hover:border-primary transition-colors flex items-center gap-1"
                    >
                      <Lock className="w-3.5 h-3.5" /> Join to Apply
                    </Link>
                  )}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg font-medium mb-2">No campaigns match your filters</p>
            <p className="text-sm">Try adjusting your search or filter criteria.</p>
          </div>
        )}

      </div>
    </div>
  );
}
