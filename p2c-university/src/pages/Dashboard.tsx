import { useEffect, useState } from "react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { useAuth } from "@/context/AuthContext";
import { useLocation, Link } from "wouter";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  Wallet, Eye, TrendingUp, Activity, Play, Bell, CheckCircle2, Clock, AlertCircle,
  User, Link as LinkIcon, FileText, Award, ArrowRight, Sparkles, Shield, CreditCard, ExternalLink, Loader2,
  Download, Package, Film, Image as ImageIcon, ChevronDown, ChevronUp
} from "lucide-react";
import { SiTiktok, SiInstagram, SiYoutube, SiSnapchat } from "react-icons/si";

const chartData = [
  { name: "Mon", views: 4000, earnings: 8 },
  { name: "Tue", views: 12000, earnings: 24 },
  { name: "Wed", views: 8000, earnings: 16 },
  { name: "Thu", views: 25000, earnings: 50 },
  { name: "Fri", views: 45000, earnings: 90 },
  { name: "Sat", views: 30000, earnings: 60 },
  { name: "Sun", views: 60000, earnings: 120 },
];

const statusColors: Record<string, string> = {
  approved: "bg-primary/10 text-primary",
  pending: "bg-neutral-500/10 text-neutral-400",
  revision: "bg-foreground/10 text-foreground",
  rejected: "bg-red-100 text-red-600",
};

type BundleFile = { label: string; url: string; size: string; type: "download" | "video" | "photo" };
type Bundle = { name: string; brand: string; files: BundleFile[] };

const statusIcons: Record<string, typeof CheckCircle2> = {
  approved: CheckCircle2,
  pending: Clock,
  revision: AlertCircle,
  rejected: AlertCircle,
};

function BadgeCard({ badgeStatus, onClaim, claiming }: { badgeStatus: string; onClaim: () => void; claiming: boolean }) {
  const statusMap: Record<string, { label: string; color: string; desc: string; icon: string }> = {
    not_claimed: { label: "Not Claimed", color: "bg-secondary text-muted-foreground", desc: "Claim your $20 Creator Badge to unlock premium campaigns and your first bonus.", icon: "🏅" },
    claimed: { label: "Claimed — Under Review", color: "bg-amber-100 text-amber-700", desc: "Your badge is being reviewed. Once approved, you'll receive your $20 payout.", icon: "⏳" },
    eligible: { label: "Eligible for Approval", color: "bg-blue-100 text-blue-700", desc: "You've met the requirements. Waiting for admin approval and payout.", icon: "✅" },
    approved: { label: "Approved", color: "bg-primary/10 text-primary", desc: "Badge approved! Your $20 payout has been initiated.", icon: "🎖️" },
    paid: { label: "Paid Out", color: "bg-green-100 text-green-700", desc: "You've received your $20 Creator Badge payout. Keep creating!", icon: "💰" },
  };

  const info = statusMap[badgeStatus] ?? statusMap.not_claimed;

  return (
    <div className="bg-gradient-to-br from-primary/5 via-white to-orange-50 border-2 border-primary/20 rounded-2xl p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{info.icon}</div>
          <div>
            <h3 className="font-bold text-lg leading-tight">$20 Creator Badge</h3>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${info.color}`}>{info.label}</span>
          </div>
        </div>
        <Shield className="w-6 h-6 text-primary opacity-40" />
      </div>
      <p className="text-sm text-muted-foreground mb-4">{info.desc}</p>
      {badgeStatus === "not_claimed" && (
        <button
          onClick={onClaim}
          disabled={claiming}
          className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {claiming ? (
            <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Claiming...</>
          ) : (
            <><Award className="w-4 h-4" /> Claim My $20 Badge</>
          )}
        </button>
      )}
      {(badgeStatus === "claimed" || badgeStatus === "eligible") && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Awaiting admin review — usually within 24–48 hours</span>
        </div>
      )}
      {(badgeStatus === "approved" || badgeStatus === "paid") && (
        <div className="flex items-center gap-2 text-sm text-primary font-medium">
          <CheckCircle2 className="w-4 h-4" />
          <span>Badge verified — You're a certified Clippers University creator</span>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { user, token, isLoading, refreshUser } = useAuth();
  const [, setLocation] = useLocation();
  const [submissions, setSubmissions] = useState<Array<{
    id: number; campaign_name: string; platform: string; status: string; submitted_at: string; payout_cents: number; views: number;
  }>>([]);
  const [applications, setApplications] = useState<Array<{
    id: number; campaign_id: number | string; campaign_name: string; status: string; applied_at: string;
  }>>([]);
  const [claiming, setClaiming] = useState(false);
  const [showBadgeDisclaimer, setShowBadgeDisclaimer] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [bundleExpanded, setBundleExpanded] = useState(true);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [stripeError, setStripeError] = useState("");
  const [showPayoutModal, setShowPayoutModal] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) setLocation("/login");
  }, [isLoading, user, setLocation]);

  useEffect(() => {
    if (!token || !user) return;
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch("/api/cu/submissions", { headers }).then(r => r.json()).catch(() => ({ submissions: [] })),
      fetch("/api/cu/applications", { headers }).then(r => r.json()).catch(() => ({ applications: [] })),
    ]).then(([subData, appData]) => {
      const apps = appData.applications || [];
      setSubmissions(subData.submissions || []);
      setApplications(apps);
      setDataLoading(false);
      const approvedBundleCampaigns = ["2", "6", "7"];
      const approvedApp = apps.find((a: { campaign_id: number | string; status: string }) =>
        a.status === "approved" && approvedBundleCampaigns.includes(String(a.campaign_id))
      );
      if (approvedApp) {
        fetch(`/api/cu/bundles/${approvedApp.campaign_id}`, { headers })
          .then(r => r.ok ? r.json() : null)
          .then(data => { if (data?.bundle) setBundle(data.bundle); })
          .catch(() => {});
      }
    });
  }, [token, user]);

  // Scroll to bundle section when navigated via #bundle hash
  useEffect(() => {
    if (!bundle) return;
    if (window.location.hash === "#bundle") {
      setTimeout(() => {
        document.getElementById("bundle")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 400);
    }
  }, [bundle]);

  // Auto-prompt payout setup for approved creators who haven't connected yet
  useEffect(() => {
    if (!user || user.stripe_onboarded) return;
    const dismissed = sessionStorage.getItem("stripe_modal_dismissed");
    if (dismissed) return;
    const timer = setTimeout(() => setShowPayoutModal(true), 1200);
    return () => clearTimeout(timer);
  }, [user]);

  // Handle Stripe Connect return
  useEffect(() => {
    if (!token || !user) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("stripe_return") === "1" || params.get("stripe_refresh") === "1") {
      fetch("/api/cu/connect/verify", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).then(r => r.json()).then(data => {
        if (data.onboarded) refreshUser();
      }).catch(() => {});
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [token, user]);

  const handleStripeConnect = async () => {
    if (!token) return;
    setStripeLoading(true);
    setStripeError("");
    try {
      const res = await fetch("/api/cu/connect/onboard", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) { setStripeError(data.error || "Failed to start onboarding"); }
      else { window.location.href = data.url; }
    } catch { setStripeError("Connection error. Please try again."); }
    setStripeLoading(false);
  };

  const handleClaimBadge = async () => {
    if (!token) return;
    setClaiming(true);
    try {
      const res = await fetch("/api/cu/badge/claim", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        await refreshUser();
      }
    } finally {
      setClaiming(false);
    }
  };

  const handleClaimBadgeRequest = () => {
    const alreadySeen = localStorage.getItem("cu_badge_disclaimer_seen");
    if (alreadySeen) {
      handleClaimBadge();
    } else {
      setShowBadgeDisclaimer(true);
    }
  };

  const handleDisclaimerConfirm = () => {
    localStorage.setItem("cu_badge_disclaimer_seen", "1");
    setShowBadgeDisclaimer(false);
    handleClaimBadge();
  };

  if (isLoading) {
    return <div className="py-32 text-center text-muted-foreground">Loading...</div>;
  }
  if (!user) return null;

  const earningsDollars = (user.total_earnings_cents / 100).toFixed(2);
  const viewsFormatted = user.total_views > 1000000
    ? `${(user.total_views / 1000000).toFixed(1)}M`
    : user.total_views > 1000
    ? `${(user.total_views / 1000).toFixed(0)}K`
    : user.total_views.toString();

  const cpmByTier: Record<string, string> = { Starter: "$1.00", Growth: "$2.00", Premium: "$3.00" };
  const cpm = cpmByTier[user.tier] ?? "$1.00";

  const statCards = [
    { label: "Total Earnings", value: `$${earningsDollars}`, change: "+0%", icon: Wallet },
    { label: "Total Views", value: viewsFormatted || "0", change: "All time", icon: Eye },
    { label: "Active Campaigns", value: applications.filter(a => a.status === "approved").length.toString(), change: "Approved", icon: Activity },
    { label: "CPM Tier", value: cpm, change: user.tier, icon: TrendingUp },
  ];

  const fmtViews = (v: number) => v >= 1_000_000 ? `${(v/1_000_000).toFixed(1)}M` : v >= 1_000 ? `${(v/1_000).toFixed(0)}K` : v > 0 ? v.toString() : null;
  const socials = [
    { platform: "TikTok", handle: user.tiktok_handle || null, views: user.tiktok_views || 0, icon: SiTiktok, color: "text-black dark:text-white", bg: "bg-black/5" },
    { platform: "Instagram", handle: user.instagram_handle || null, views: user.instagram_views || 0, icon: SiInstagram, color: "text-pink-500", bg: "bg-pink-50" },
    { platform: "YouTube", handle: user.youtube_handle || null, views: user.youtube_views || 0, icon: SiYoutube, color: "text-red-600", bg: "bg-red-50" },
    { platform: "Snapchat", handle: user.snapchat_handle || null, views: user.snapchat_views || 0, icon: SiSnapchat, color: "text-yellow-500", bg: "bg-yellow-50" },
  ];

  return (
    <div className="py-8 bg-secondary/30 min-h-screen">

      {/* ── Automatic Payout Setup Modal ── */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <CreditCard className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-display font-bold mb-2">Set Up Your Payout Account</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Connect your bank account through Stripe to automatically receive your CPM earnings. Takes less than 2 minutes — Stripe handles everything securely.
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {[
                "Instant setup via Stripe Express",
                "Direct bank deposit for all earnings",
                "Secure — we never see your bank details",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {stripeError && (
              <p className="text-red-500 text-xs mb-3 flex items-center gap-1.5 p-3 bg-red-50 rounded-xl border border-red-100">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />{stripeError}
              </p>
            )}

            <button
              onClick={async () => {
                setStripeError("");
                setStripeLoading(true);
                try {
                  const res = await fetch("/api/cu/connect/onboard", {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  const data = await res.json();
                  if (!res.ok) { setStripeError(data.error || "Failed to start onboarding"); }
                  else { window.location.href = data.url; }
                } catch { setStripeError("Connection error. Please try again."); }
                setStripeLoading(false);
              }}
              disabled={stripeLoading}
              className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:opacity-90 disabled:opacity-60 transition-opacity flex items-center justify-center gap-2 text-base mb-3"
            >
              {stripeLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Connecting...</> : <><CreditCard className="w-5 h-5" /> Connect Payout Account</>}
            </button>

            <button
              onClick={() => { sessionStorage.setItem("stripe_modal_dismissed", "1"); setShowPayoutModal(false); }}
              className="w-full py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              I'll do this later
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <AnimatedSection direction="none" className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-display font-bold mb-1">
              Welcome back, {user.full_name.split(" ")[0]}
            </h1>
            <p className="text-muted-foreground">Here's your performance overview.</p>
          </div>
          <Link href="/submit">
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition-opacity shadow-md shadow-primary/20">
              <Sparkles className="w-4 h-4" /> Submit Content
            </button>
          </Link>
        </AnimatedSection>

        {/* 48-Hour Warning Banner — new accounts with no Stripe + no applications */}
        {!user.stripe_onboarded && applications.length === 0 && (
          <AnimatedSection direction="up" className="mb-6">
            <div className="flex items-start gap-3 bg-red-600 text-white rounded-2xl px-5 py-4 shadow-lg shadow-red-600/25">
              <div className="text-2xl flex-shrink-0 mt-0.5">⚠️</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm leading-snug">
                  Action Required — You have 48 hours before your badge is removed
                </p>
                <p className="text-white/80 text-xs mt-1 leading-relaxed">
                  Please apply to a campaign and submit content to keep your account active. New accounts with no activity are removed after 48 hours.
                </p>
              </div>
              <Link href="/campaigns">
                <button className="flex-shrink-0 bg-white text-red-600 font-bold text-xs px-3 py-2 rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap">
                  View Campaigns
                </button>
              </Link>
            </div>
          </AnimatedSection>
        )}

        {/* Badge Section — prominent at top */}
        <AnimatedSection direction="up" className="mb-8">
          <BadgeCard
            badgeStatus={user.badge_status}
            onClaim={handleClaimBadgeRequest}
            claiming={claiming}
          />
        </AnimatedSection>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <AnimatedSection key={stat.label} delay={i * 0.1} direction="up">
              <div className="bg-white border border-border p-6 rounded-2xl gloss-card shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-primary/8 rounded-lg border border-primary/12">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.includes("+") ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                    {stat.change}
                  </span>
                </div>
                <div className="text-muted-foreground text-sm mb-1">{stat.label}</div>
                <div className="text-2xl font-bold font-display">{stat.value}</div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Profile + Socials Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <AnimatedSection delay={0.2}>
            <div className="bg-white border border-border rounded-2xl p-6 h-full shadow-sm gloss-card">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg">Your Profile</h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Name", value: user.full_name },
                  { label: "Email", value: user.email },
                  { label: "Phone", value: user.phone },
                  { label: "Creator Type", value: user.creator_type.replace("_", " ") },
                  { label: "Tier", value: user.tier },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm py-1.5 border-b border-border last:border-0">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium capitalize">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <div className="bg-white border border-border rounded-2xl p-6 h-full shadow-sm gloss-card flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-1">
                <LinkIcon className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg">Connected Socials</h3>
              </div>
              <div className="space-y-2">
                {socials.map((social, i) => {
                  const Icon = social.icon;
                  const connected = !!social.handle;
                  const viewLabel = fmtViews(social.views);
                  return (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-secondary/40">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2 rounded-lg flex-shrink-0 ${social.bg}`}>
                          <Icon className={`w-4 h-4 ${social.color}`} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold">{social.platform}</div>
                          <div className="text-xs text-muted-foreground truncate">{social.handle || "Not linked"}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                        {viewLabel ? (
                          <span className="text-sm font-bold text-primary">{viewLabel}</span>
                        ) : (
                          connected ? (
                            <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20">Connected</span>
                          ) : (
                            <span className="px-2.5 py-1 bg-secondary text-muted-foreground text-xs font-medium rounded-full">Not linked</span>
                          )
                        )}
                        {viewLabel && <span className="text-xs text-muted-foreground">views</span>}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Stripe Connect Setup */}
              <div className={`mt-2 rounded-xl p-4 border ${user.stripe_onboarded ? "bg-green-50 border-green-200" : "bg-primary/5 border-primary/20"}`}>
                <div className="flex items-center gap-3 mb-2">
                  <CreditCard className={`w-4 h-4 ${user.stripe_onboarded ? "text-green-600" : "text-primary"}`} />
                  <span className="font-bold text-sm">{user.stripe_onboarded ? "Payouts Active" : "Set Up Payouts"}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  {user.stripe_onboarded ? "Stripe verified — ready to receive earnings." : "Connect Stripe to receive your CPM earnings."}
                </p>
                {stripeError && <p className="text-red-500 text-xs mb-2 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{stripeError}</p>}
                {user.stripe_onboarded ? (
                  <div className="flex items-center gap-1.5 text-green-700 text-xs font-bold"><CheckCircle2 className="w-3.5 h-3.5" /> Verified</div>
                ) : (
                  <button onClick={handleStripeConnect} disabled={stripeLoading}
                    className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:opacity-90 disabled:opacity-60 transition-opacity">
                    {stripeLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ExternalLink className="w-3.5 h-3.5" />}
                    {stripeLoading ? "Connecting..." : "Connect with Stripe"}
                  </button>
                )}
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Chart + Recent Submissions */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <AnimatedSection delay={0.4} className="lg:col-span-2">
            <div className="bg-white border border-border rounded-2xl p-6 h-full shadow-sm gloss-card">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">Revenue Overview</h3>
                <select className="bg-secondary border-none text-sm rounded-md px-2 py-1 outline-none text-muted-foreground">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                </select>
              </div>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
                      itemStyle={{ color: "hsl(var(--foreground))" }}
                    />
                    <Area type="monotone" dataKey="earnings" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.5} className="lg:col-span-1">
            <div className="bg-white border border-border rounded-2xl p-6 h-full shadow-sm gloss-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Recent Submissions</h3>
                <Link href="/submit">
                  <span className="text-xs text-primary font-medium flex items-center gap-1 hover:underline cursor-pointer">
                    New <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              </div>
              {dataLoading ? (
                <div className="text-center text-muted-foreground text-sm py-8">Loading...</div>
              ) : submissions.length === 0 ? (
                <div className="text-center py-8">
                  <Play className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No submissions yet</p>
                  <Link href="/submit">
                    <button className="mt-3 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:opacity-90">Submit Content</button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {submissions.slice(0, 5).map((sub) => {
                    const StatusIcon = statusIcons[sub.status] || Clock;
                    return (
                      <div key={sub.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <StatusIcon className={`w-4 h-4 flex-shrink-0 ${sub.status === "approved" ? "text-primary" : "text-muted-foreground"}`} />
                          <div className="min-w-0">
                            <div className="text-sm font-semibold truncate">{sub.campaign_name}</div>
                            <div className="text-xs text-muted-foreground">{sub.platform} • {sub.views.toLocaleString()} views</div>
                          </div>
                        </div>
                        <div className="text-sm font-bold text-primary flex-shrink-0">
                          ${(sub.payout_cents / 100).toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </AnimatedSection>
        </div>

        {/* Applications + Campaign CTA */}
        <div className="grid lg:grid-cols-2 gap-6">
          <AnimatedSection delay={0.6}>
            <div className="bg-white border border-border rounded-2xl p-6 h-full shadow-sm gloss-card">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg">Campaign Applications</h3>
              </div>
              {dataLoading ? (
                <div className="text-center text-muted-foreground text-sm py-8">Loading...</div>
              ) : applications.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-3">No applications yet</p>
                  <Link href="/campaigns">
                    <button className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:opacity-90">Browse Campaigns</button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.map((app) => {
                    const StatusIcon = statusIcons[app.status] || Clock;
                    return (
                      <div key={app.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
                        <div className="flex items-center gap-3 min-w-0">
                          <StatusIcon className={`w-5 h-5 flex-shrink-0 ${app.status === "approved" ? "text-primary" : "text-muted-foreground"}`} />
                          <div className="min-w-0">
                            <div className="text-sm font-semibold truncate">{app.campaign_name}</div>
                            <div className="text-xs text-muted-foreground">{new Date(app.applied_at).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full capitalize flex-shrink-0 ${statusColors[app.status] || "bg-secondary text-muted-foreground"}`}>
                          {app.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.7}>
            <div className="bg-gradient-to-br from-primary/5 to-blue-50 border border-primary/20 rounded-2xl p-6 h-full shadow-sm flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <Bell className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg">Ready to Earn?</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Browse active brand campaigns and apply based on your creator tier. Once approved, submit your content to start earning CPM payouts.
              </p>
              <div className="space-y-3 mb-6">
                {[
                  { icon: "🚀", text: "P2P Fit Tech AI — up to $3.00 CPM (Premium)" },
                  { icon: "💼", text: "Coach Cashflow — Growth tier open" },
                  { icon: "🎯", text: "P2Wm — Starter tier available" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
              <div className="mt-auto space-y-3">
                <Link href="/campaigns">
                  <button className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 flex items-center justify-center gap-2">
                    Browse Campaigns <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <Link href="/submit">
                  <button className="w-full py-3 bg-secondary text-foreground font-bold rounded-xl hover:bg-secondary/80 transition-colors">
                    Submit Content
                  </button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Content Bundle Section — unlocked for approved P2P FitTech AI creators */}
        {bundle && (
          <AnimatedSection delay={0.8}>
            <div id="bundle" className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-lg">{bundle.name}</h3>
                      <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-bold rounded-full">UNLOCKED</span>
                    </div>
                    <p className="text-xs text-white/40">{bundle.brand} · Approved Creator Access</p>
                  </div>
                </div>
                <button
                  onClick={() => setBundleExpanded(v => !v)}
                  className="text-white/40 hover:text-white/80 transition-colors"
                >
                  {bundleExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {bundleExpanded && (
                <div className="p-6 space-y-8">
                  {/* Zip Pack Downloads */}
                  {bundle.files.filter(f => f.type === "download").length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Download className="w-4 h-4 text-primary" />
                        <span className="text-white/60 text-sm font-semibold uppercase tracking-wider">Full Content Packs</span>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {bundle.files.filter(f => f.type === "download").map((file, i) => (
                          <a
                            key={i}
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-between p-4 bg-white/5 hover:bg-primary/10 border border-white/10 hover:border-primary/40 rounded-xl transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Package className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <div className="text-white font-semibold text-sm">{file.label}</div>
                                <div className="text-white/40 text-xs">{file.size} · ZIP Archive</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-primary opacity-60 group-hover:opacity-100 transition-opacity">
                              <Download className="w-4 h-4" />
                              <span className="text-xs font-bold">Download</span>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Videos */}
                  {bundle.files.filter(f => f.type === "video").length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Film className="w-4 h-4 text-primary" />
                        <span className="text-white/60 text-sm font-semibold uppercase tracking-wider">Reference Videos</span>
                      </div>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {bundle.files.filter(f => f.type === "video").map((file, i) => (
                          <div key={i} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden group">
                            <div className="relative aspect-video bg-black">
                              <video
                                src={file.url}
                                className="w-full h-full object-cover"
                                preload="metadata"
                                muted
                                playsInline
                                onMouseEnter={e => (e.currentTarget as HTMLVideoElement).play().catch(() => {})}
                                onMouseLeave={e => { (e.currentTarget as HTMLVideoElement).pause(); (e.currentTarget as HTMLVideoElement).currentTime = 0; }}
                              />
                              <div className="absolute inset-0 flex items-center justify-center opacity-70 group-hover:opacity-0 transition-opacity pointer-events-none">
                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                  <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                                </div>
                              </div>
                            </div>
                            <div className="p-3 flex items-center justify-between">
                              <div>
                                <div className="text-white text-xs font-semibold">{file.label}</div>
                                <div className="text-white/40 text-xs">{file.size}</div>
                              </div>
                              <a
                                href={file.url}
                                download
                                className="w-8 h-8 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                                title="Download"
                              >
                                <Download className="w-3.5 h-3.5 text-primary" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Photos */}
                  {bundle.files.filter(f => f.type === "photo").length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <ImageIcon className="w-4 h-4 text-primary" />
                        <span className="text-white/60 text-sm font-semibold uppercase tracking-wider">Reference Photos</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                        {bundle.files.filter(f => f.type === "photo").map((file, i) => (
                          <div key={i} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden group">
                            <div className="relative aspect-square bg-black">
                              <img
                                src={file.url}
                                alt={file.label}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                            <div className="p-2 flex items-center justify-between">
                              <div className="text-white/60 text-xs">{file.label}</div>
                              <a
                                href={file.url}
                                download
                                className="w-7 h-7 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                                title="Download"
                              >
                                <Download className="w-3 h-3 text-primary" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-white/30 text-xs text-center">
                    This content is confidential and provided exclusively to approved {bundle.brand} creators. Do not redistribute.
                  </p>
                </div>
              )}
            </div>
          </AnimatedSection>
        )}

      </div>

      {/* Badge Disclaimer Modal — one-time popup */}
      {showBadgeDisclaimer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl flex-shrink-0">
                ⚠️
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">Before You Claim</h3>
                <p className="text-sm text-muted-foreground">Read this before continuing</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
              <p className="text-sm font-semibold text-amber-800 mb-2">Content is required to receive your $20</p>
              <p className="text-sm text-amber-700 leading-relaxed">
                Claiming the badge is just the first step. You must <strong>submit approved content</strong> for a campaign before your $20 payout is released. Simply claiming the badge without creating content will not result in payment.
              </p>
            </div>

            <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Apply to a campaign and get approved</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Post your content and submit the link</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Once content is reviewed and approved, your $20 is paid out</span>
              </li>
            </ul>

            <div className="flex gap-3">
              <button
                onClick={() => setShowBadgeDisclaimer(false)}
                className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDisclaimerConfirm}
                className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4" /> Got it — Claim Badge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
