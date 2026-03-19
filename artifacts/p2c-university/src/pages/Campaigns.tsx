import { useState, useEffect } from "react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { useAuth } from "@/context/AuthContext";
import { Link, useLocation } from "wouter";
import { Search, Clock, ArrowRight, CheckCircle2, Lock, Users, Package, X, ChevronDown, ChevronUp, FileText, Zap, Target, Megaphone } from "lucide-react";
import { SiTiktok, SiInstagram, SiYoutube } from "react-icons/si";

const P2P_BRIEF = {
  overview: "P2P FitTech AI is a fitness app that uses AI to help people plan and improve their workouts. Your job is to spread the word through short, punchy videos that show viewers why this app is different.",
  whatToCreate: [
    "Quick explanation videos (how the app works)",
    "Before & after fitness transformation videos",
    '"This is how AI can fix your workouts"',
    '"Why your workout plan isn\'t working"',
    "Show results, progress, or transformations",
  ],
  structure: [
    { label: "Hook (first 2 sec)", value: '"Your workout plan might be wrong"' },
    { label: "Explain", value: '"This AI app builds workouts for you"' },
    { label: "Show value", value: "Results / benefits / transformation" },
    { label: "Call to action", value: '"Join the waitlist"' },
  ],
  cta: ['"Join the waitlist"', '"Link in bio"', '"Try it before everyone else"'],
  rules: ["Keep videos 15–30 seconds", "Speak clearly or use captions", "Focus on the app — not random gym content", "ALWAYS end with a CTA"],
  scripts: [
    { title: "Your workout is wrong", hook: "Your workout plan might be wrong.", body: "Most people just copy workouts online… but everyone's body is different. This AI app builds workouts just for you.", cta: "Join the waitlist." },
    { title: "AI trainer", hook: "AI just replaced your trainer.", body: "Instead of guessing your workouts, this app creates them based on YOU. Smarter. Faster. Better results.", cta: "Link in bio — join the waitlist." },
    { title: "Before & After", hook: "This is what happens when you stop guessing.", body: "Before: random workouts, no progress. After: structured plan using AI. Real results.", cta: "Join the waitlist." },
    { title: "Why you're not progressing", hook: "You're not seeing results for a reason.", body: "Your workouts aren't built for your body. That's the problem. This AI fixes that.", cta: "Try it early — join the waitlist." },
    { title: "Stop copying workouts", hook: "Stop copying workouts from TikTok.", body: "What works for them might not work for you. This AI builds YOUR plan.", cta: "Join the waitlist now." },
    { title: "Simple explanation", hook: "Let me explain this in 10 seconds.", body: "You input your info → AI builds your workout → You get better results. That's it.", cta: "Join the waitlist." },
    { title: "Future of fitness", hook: "This is the future of fitness.", body: "No more guessing. No more random plans. Just AI-built workouts that actually work.", cta: "Be early — join the waitlist." },
    { title: "Transformation mindset", hook: "The difference is structure.", body: "People fail because they don't have a plan. This AI gives you one instantly.", cta: "Join the waitlist." },
    { title: "Real talk", hook: "Be honest… your workouts aren't working.", body: "You've been guessing the whole time. This app fixes that with AI.", cta: "Join the waitlist." },
    { title: "Quick demo style", hook: "Watch this.", body: "You enter your info → AI builds your workout → You follow it → results. Simple.", cta: "Link in bio — join the waitlist." },
  ],
};

const COACH_CASHFLOW_BRIEF = {
  overview: "Coach Cashflow is on a mission to show personal trainers and fitness coaches a smarter way to scale their income and explode their online presence. Create content that speaks directly to coaches who are grinding for clients but leaving money on the table.",
  whatToCreate: [
    "Motivational clips for fitness coaches",
    "Educational content on growing an online coaching business",
    '"How coaches can make more money online"',
    "Talking-head style advice videos",
    "Inspire coaches to think bigger and grow their following",
  ],
  structure: [
    { label: "Hook", value: "Speak directly to a pain point coaches have" },
    { label: "Value", value: "Show them a smarter way to scale" },
    { label: "Story", value: "Make it personal and relatable" },
    { label: "CTA", value: "Direct them to learn more" },
  ],
  cta: ['"Build your coaching empire"', '"Link in bio"', '"Stop leaving money on the table"'],
  rules: ["Personal brand / talking head style", "Speak to fitness coaches specifically", "Keep it motivational and actionable", "Instagram Reels format"],
  scripts: [],
};

const P2WM_BRIEF = {
  overview: "P2Wm isn't just a clothing brand — it's a statement. Every creator has a lane here. Whether you're a fitness creator, lifestyle vlogger, fashion creator, or TikTok storyteller — P2Wm fits your world.",
  whatToCreate: [
    "Fit checks and outfit showcases",
    "Lifestyle reels wearing P2Wm",
    "Behind-the-scenes drops and unboxings",
    "Street style content",
    "Any format that shows confidence and individuality",
  ],
  structure: [
    { label: "Vibe", value: "Raw, confident, unapologetic" },
    { label: "Show", value: "The outfit / the lifestyle" },
    { label: "Energy", value: "Move different, think different" },
    { label: "CTA", value: "Tag @P2Wm or link in bio" },
  ],
  cta: ['"Worn by those who move different"', '"Link in bio"', '"Tag us @P2Wm"'],
  rules: ["All creator types welcome", "Show the clothing confidently", "Street / luxury / lifestyle aesthetic", "Multi-platform: TikTok, Instagram, YouTube Shorts"],
  scripts: [],
};

const campaignBriefs: Record<number, typeof P2P_BRIEF> = {
  2: P2P_BRIEF,
  6: P2P_BRIEF,
  7: P2P_BRIEF,
  1: COACH_CASHFLOW_BRIEF,
  3: P2WM_BRIEF,
};

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
    description: "P2P Fit Tech AI is the world's first AI-powered personal training platform. Create high-energy content that captures this breakthrough and makes viewers feel like they're witnessing something that's never existed before.",
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
    description: "Everyday creators showing how AI fitness works in real life. Authentic, relatable content that connects with everyday people looking to improve their health.",
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
    description: "Perfect for new creators. Raw, authentic, beginner-friendly intro clips introducing the world to P2P FitTech AI.",
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
    description: "Coach Cashflow is on a mission to show personal trainers a smarter way to scale their income. Create content that speaks directly to coaches who are grinding for clients but leaving money on the table.",
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
    description: "P2Wm isn't just a clothing brand — it's a statement. Every creator has a lane here. Fit checks, lifestyle reels, street style — whatever your format, bring it.",
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

function CampaignBriefModal({
  campaign,
  brief,
  onApply,
  onClose,
  applying,
  alreadyApplied,
}: {
  campaign: typeof campaigns[0];
  brief: typeof P2P_BRIEF;
  onApply: () => void;
  onClose: () => void;
  applying: boolean;
  alreadyApplied: boolean;
}) {
  const [openScript, setOpenScript] = useState<number | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl my-4 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-primary/80 p-6 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border-2 border-white/30 flex-shrink-0">
              {(campaign as any).logo ? (
                <img src={(campaign as any).logo} alt={campaign.brand} className="w-full h-full object-cover" />
              ) : (
                <span className="w-full h-full flex items-center justify-center text-primary font-bold text-xl">{campaign.brand[0]}</span>
              )}
            </div>
            <div>
              <div className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-0.5">Campaign Brief</div>
              <h2 className="font-bold text-xl leading-tight">{campaign.brand}</h2>
              <p className="text-white/80 text-sm">{campaign.project}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">{campaign.rate}</span>
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">{campaign.budget}</span>
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">{campaign.platform}</span>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
          {/* Overview */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
              <FileText className="w-4 h-4" /> Overview
            </div>
            <p className="text-sm text-foreground leading-relaxed">{brief.overview}</p>
          </div>

          {/* What to Create */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
              <Zap className="w-4 h-4 text-primary" /> 🎥 What To Create
            </div>
            <ul className="space-y-2">
              {brief.whatToCreate.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Video Structure */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
              <Target className="w-4 h-4 text-primary" /> ⚡ How To Structure Your Videos
            </div>
            <div className="space-y-2">
              {brief.structure.map((step, i) => (
                <div key={i} className="flex gap-3 items-start bg-secondary/40 rounded-xl px-4 py-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                  <div>
                    <div className="font-bold text-xs text-muted-foreground uppercase">{step.label}</div>
                    <div className="text-sm font-medium mt-0.5">{step.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
              <Megaphone className="w-4 h-4 text-primary" /> 📢 CTA (Very Important)
            </div>
            <p className="text-xs text-muted-foreground mb-2">Always end your video with one of these:</p>
            <div className="flex flex-wrap gap-2">
              {brief.cta.map((c, i) => (
                <span key={i} className="bg-primary/10 text-primary text-sm font-bold px-3 py-1.5 rounded-lg border border-primary/20">{c}</span>
              ))}
            </div>
          </div>

          {/* Rules */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="font-bold text-sm text-red-700 mb-2">❗ Rules</div>
            <ul className="space-y-1">
              {brief.rules.map((r, i) => (
                <li key={i} className="text-sm text-red-600 flex items-start gap-2">
                  <span className="font-bold">·</span> {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Scripts */}
          {brief.scripts.length > 0 && (
            <div>
              <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">🎬 {brief.scripts.length} Content Scripts</div>
              <div className="space-y-2">
                {brief.scripts.map((script, i) => (
                  <div key={i} className="border border-border rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenScript(openScript === i ? null : i)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-secondary/30 transition-colors"
                    >
                      <span className="font-semibold text-sm">Script {i + 1}: "{script.title}"</span>
                      {openScript === i ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                    </button>
                    {openScript === i && (
                      <div className="px-4 pb-4 space-y-3 text-sm border-t border-border pt-3">
                        <div><span className="font-bold text-primary">Hook: </span>{script.hook}</div>
                        <div><span className="font-bold">Content: </span>{script.body}</div>
                        <div className="bg-primary/10 text-primary font-bold px-3 py-2 rounded-lg border border-primary/20">CTA: {script.cta}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer apply */}
        <div className="p-5 border-t border-border bg-secondary/20 flex gap-3">
          <button onClick={onClose} className="px-4 py-3 border border-border rounded-xl text-sm font-semibold hover:bg-secondary transition-colors">
            Close
          </button>
          {alreadyApplied ? (
            <div className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-100 text-green-700 font-bold rounded-xl text-sm">
              <CheckCircle2 className="w-4 h-4" /> Applied — Awaiting Approval
            </div>
          ) : (
            <button
              onClick={onApply}
              disabled={applying}
              className="flex-1 py-3 bg-primary text-white font-bold rounded-xl text-sm hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {applying ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Applying...</>
              ) : (
                <><CheckCircle2 className="w-4 h-4" /> I've Read This — Apply Now</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export { campaigns, campaignBriefs, BUNDLE_CAMPAIGN_IDS };

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
  const [briefCampaign, setBriefCampaign] = useState<typeof campaigns[0] | null>(null);

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
        setBriefCampaign(null);
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
          <Link href="/signup" className="text-primary font-bold hover:underline">Join free →</Link>
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
                <button key={tag} onClick={() => setPlatformFilter(tag)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${platformFilter === tag ? "bg-primary text-primary-foreground" : "bg-background border border-border text-muted-foreground hover:bg-secondary"}`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">CPM Tier</div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {tierFilters.map(tag => (
                <button key={tag} onClick={() => setTierFilter(tag)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${tierFilter === tag ? "bg-primary text-primary-foreground" : "bg-background border border-border text-muted-foreground hover:bg-secondary"}`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {applyError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{applyError}</div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign, i) => (
            <AnimatedSection key={campaign.id} delay={i * 0.05}>
              <div className={`relative bg-white border rounded-2xl overflow-hidden flex flex-col h-full transition-all group ${
                campaign.restricted ? "border-neutral-200 opacity-75 grayscale-[30%]" : "border-primary/30 hover:border-[#FF6B00] hover:shadow-[0_0_0_2px_rgba(255,107,0,0.15)]"
              }`}>
                {campaign.restricted && (
                  <div className="absolute top-0 left-0 right-0 z-10 bg-neutral-800/90 backdrop-blur-sm py-2 px-4 flex items-center justify-center gap-2">
                    <Users className="w-4 h-4 text-neutral-300" />
                    <span className="text-xs font-bold text-neutral-200 uppercase tracking-widest">Capacity Full — Too Many Creators</span>
                    <Lock className="w-3.5 h-3.5 text-neutral-400" />
                  </div>
                )}

                <div className={`p-6 flex-grow ${campaign.restricted ? "pt-12" : ""}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-border flex items-center justify-center shrink-0">
                      {(campaign as any).logo ? (
                        <img src={(campaign as any).logo} alt={campaign.brand} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl font-bold text-primary font-display">{campaign.brand.charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {campaign.platformIcons.map(p => (
                          <span key={p} className={`w-6 h-6 rounded-md flex items-center justify-center text-white ${platformBg[p] ?? "bg-neutral-500"}`}>
                            <PlatformIcon name={p} />
                          </span>
                        ))}
                      </div>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${tierColors[campaign.cpmTier]}`}>{campaign.cpmTier}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-1">{campaign.brand}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{campaign.project}</p>
                  {!campaign.restricted && (
                    <p className="text-xs text-muted-foreground mb-4 leading-relaxed line-clamp-3">{campaign.description}</p>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    {campaign.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 bg-secondary text-xs font-medium rounded-md text-foreground">{tag}</span>
                    ))}
                  </div>

                  {!campaign.restricted && (
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><div className="text-xs text-muted-foreground mb-0.5">Platform</div><div className="font-semibold text-sm">{campaign.platform}</div></div>
                      <div><div className="text-xs text-muted-foreground mb-0.5">Content Style</div><div className="font-semibold text-sm">{campaign.contentStyle}</div></div>
                      <div><div className="text-xs text-muted-foreground mb-0.5">Payout Rate</div><div className="font-semibold text-sm text-primary">{campaign.rate}</div></div>
                      <div><div className="text-xs text-muted-foreground mb-0.5">Budget Pool</div><div className="font-semibold text-sm">{campaign.budget}</div></div>
                    </div>
                  )}
                </div>

                {/* Content bundle unlock banner */}
                {BUNDLE_CAMPAIGN_IDS.includes(campaign.id) && approvedCampaigns.includes(campaign.id) && (
                  <Link href="/dashboard#bundle"
                    className="mx-4 mb-3 flex items-center justify-between gap-3 px-4 py-3 bg-[#0a0a0a] hover:bg-primary/90 rounded-xl transition-colors group">
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

                <div className={`p-4 border-t flex justify-between items-center ${campaign.restricted ? "border-neutral-100 bg-neutral-50" : "border-border bg-secondary/20"}`}>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />{campaign.deadline}
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
                    <button
                      onClick={() => setBriefCampaign(campaign)}
                      className="text-sm font-bold text-primary flex items-center gap-1 hover:underline"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Applied — View Brief
                    </button>
                  ) : user ? (
                    <button
                      onClick={() => setBriefCampaign(campaign)}
                      className="px-4 py-1.5 bg-primary text-primary-foreground text-sm font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5"
                    >
                      View Brief <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <Link href="/signup"
                      className="px-4 py-1.5 bg-secondary border border-border text-sm font-bold rounded-lg hover:border-primary transition-colors flex items-center gap-1">
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

      {/* Campaign Brief Modal */}
      {briefCampaign && campaignBriefs[briefCampaign.id] && (
        <CampaignBriefModal
          campaign={briefCampaign}
          brief={campaignBriefs[briefCampaign.id]}
          onApply={() => handleApply(briefCampaign)}
          onClose={() => setBriefCampaign(null)}
          applying={applyingId === briefCampaign.id}
          alreadyApplied={appliedCampaigns.includes(briefCampaign.id)}
        />
      )}
    </div>
  );
}
