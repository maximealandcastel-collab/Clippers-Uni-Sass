import { useEffect, useState } from "react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { useLocation } from "wouter";
import {
  Users, FileText, Award, BarChart2, CheckCircle2, XCircle, Clock,
  Eye, TrendingUp, DollarSign, RefreshCw, ChevronDown, ChevronUp,
  Zap, CreditCard, AlertCircle, Lock, Trash2
} from "lucide-react";
import { SiTiktok, SiInstagram, SiYoutube, SiSnapchat } from "react-icons/si";
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

const PIE_COLORS = ["hsl(var(--primary))", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];

interface Creator {
  id: number; full_name: string; email: string; phone: string;
  creator_type: string; badge_status: string; tier: string;
  total_views: number; tiktok_views: number; instagram_views: number; youtube_views: number; snapchat_views: number;
  total_earnings_cents: number; created_at: string;
  stripe_onboarded: boolean; stripe_account_id?: string;
  tiktok_handle?: string; instagram_handle?: string; youtube_handle?: string; snapchat_handle?: string;
}
interface Submission {
  id: number; creator_id: number; campaign_name: string; platform: string;
  content_url: string; status: string; views: number; payout_cents: number;
  submitted_at: string; creator_name?: string;
}
interface Analytics {
  total_creators: number; total_views: number; total_earnings_cents: number;
  badge_stats: Record<string, number>;
  tier_stats: Record<string, number>;
  top_creators: Array<{ full_name: string; total_views: number; total_earnings_cents: number }>;
  recent_page_views: number;
  total_page_views: number;
  page_views_by_path: Array<{ path: string; visits: number }>;
}
interface GrowthData {
  creator_growth: Array<{ date: string; count: number; cumulative: number }>;
  submission_growth: Array<{ date: string; submissions: number; views: number }>;
  platform_views: { tiktok: number; instagram: number; youtube: number };
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-primary/10 text-primary",
    rejected: "bg-red-100 text-red-600",
    claimed: "bg-blue-100 text-blue-700",
    paid: "bg-green-100 text-green-700",
    eligible: "bg-purple-100 text-purple-700",
    not_claimed: "bg-secondary text-muted-foreground",
    verified: "bg-green-100 text-green-700",
    not_connected: "bg-secondary text-muted-foreground",
  };
  return (
    <span className={`px-2.5 py-1 text-xs font-bold rounded-full capitalize ${map[status] || "bg-secondary text-muted-foreground"}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

function MetricCard({ label, value, sub, icon: Icon, accent }: {
  label: string; value: string; sub?: string; icon: any; accent?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${accent ? "bg-primary text-white border-primary" : "bg-white border-border"}`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${accent ? "bg-white/20" : "bg-primary/8 border border-primary/12"}`}>
          <Icon className={`w-4 h-4 ${accent ? "text-white" : "text-primary"}`} />
        </div>
        {sub && <span className={`text-xs font-medium ${accent ? "text-white/70" : "text-muted-foreground"}`}>{sub}</span>}
      </div>
      <div className={`text-sm mb-0.5 ${accent ? "text-white/80" : "text-muted-foreground"}`}>{label}</div>
      <div className={`text-2xl font-bold font-display ${accent ? "text-white" : ""}`}>{value}</div>
    </div>
  );
}

export default function AdminCU() {
  const [authed, setAuthed] = useState(false);
  const [adminToken, setAdminToken] = useState("");
  const [tab, setTab] = useState<"overview" | "creators" | "submissions" | "payouts">("overview");
  const [creators, setCreators] = useState<Creator[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [growth, setGrowth] = useState<GrowthData | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [expandedCreator, setExpandedCreator] = useState<number | null>(null);
  const [payoutModal, setPayoutModal] = useState<{ creator: Creator } | null>(null);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutNote, setPayoutNote] = useState("");
  const [payoutError, setPayoutError] = useState("");
  const [deleteModal, setDeleteModal] = useState<Creator | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [, navigate] = useLocation();

  useEffect(() => {
    const stored = localStorage.getItem("cu_admin_token");
    if (stored) { setAdminToken(stored); setAuthed(true); }
    else navigate("/admin-login");
  }, []);

  const authHeaders = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` });

  const loadData = async () => {
    if (!adminToken) return;
    setLoading(true);
    const headers = { Authorization: `Bearer ${adminToken}` };
    const [creatorsRes, submissionsRes, analyticsRes, growthRes] = await Promise.all([
      fetch("/api/cu/admin/creators", { headers }),
      fetch("/api/cu/admin/submissions", { headers }),
      fetch("/api/cu/admin/analytics", { headers }),
      fetch("/api/cu/admin/analytics/growth", { headers }),
    ]);
    if (creatorsRes.ok) setCreators((await creatorsRes.json()).creators || []);
    if (submissionsRes.ok) setSubmissions((await submissionsRes.json()).submissions || []);
    if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
    if (growthRes.ok) setGrowth(await growthRes.json());
    setLoading(false);
  };

  useEffect(() => { if (authed) loadData(); }, [authed]);

  const approveSubmission = async (id: number) => {
    setActionLoading(l => ({ ...l, [`sub-${id}`]: true }));
    await fetch(`/api/cu/admin/submissions/${id}/approve`, { method: "POST", headers: authHeaders() });
    await loadData();
    setActionLoading(l => ({ ...l, [`sub-${id}`]: false }));
  };

  const rejectSubmission = async (id: number) => {
    setActionLoading(l => ({ ...l, [`sub-${id}`]: true }));
    await fetch(`/api/cu/admin/submissions/${id}/reject`, { method: "POST", headers: authHeaders() });
    await loadData();
    setActionLoading(l => ({ ...l, [`sub-${id}`]: false }));
  };

  const approveBadge = async (creatorId: number) => {
    setActionLoading(l => ({ ...l, [`badge-${creatorId}`]: true }));
    await fetch(`/api/cu/admin/creators/${creatorId}/badge/approve`, { method: "POST", headers: authHeaders() });
    await loadData();
    setActionLoading(l => ({ ...l, [`badge-${creatorId}`]: false }));
  };

  const deleteCreator = async () => {
    if (!deleteModal) return;
    setDeleteLoading(true);
    setDeleteError("");
    try {
      const res = await fetch(`/api/cu/admin/creator/${deleteModal.id}`, {
        method: "DELETE", headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) { setDeleteError(data.error || "Delete failed"); }
      else { setDeleteModal(null); setExpandedCreator(null); await loadData(); }
    } catch { setDeleteError("Network error. Please try again."); }
    setDeleteLoading(false);
  };

  const triggerPayout = async () => {
    if (!payoutModal) return;
    const cents = Math.round(parseFloat(payoutAmount) * 100);
    if (!cents || cents <= 0) { setPayoutError("Enter a valid amount"); return; }
    if (!payoutModal.creator.stripe_onboarded) { setPayoutError("Creator has not completed Stripe onboarding"); return; }
    setActionLoading(l => ({ ...l, [`payout-${payoutModal.creator.id}`]: true }));
    setPayoutError("");
    const res = await fetch("/api/cu/admin/payout", {
      method: "POST", headers: authHeaders(),
      body: JSON.stringify({ creator_id: payoutModal.creator.id, amount_cents: cents, note: payoutNote }),
    });
    const data = await res.json();
    if (!res.ok) { setPayoutError(data.error || "Payout failed"); }
    else { setPayoutModal(null); setPayoutAmount(""); setPayoutNote(""); await loadData(); }
    setActionLoading(l => ({ ...l, [`payout-${payoutModal.creator.id}`]: false }));
  };

  if (!authed) return null;

  const totalEarnings = (analytics?.total_earnings_cents ?? 0) / 100;
  const badgeData = Object.entries(analytics?.badge_stats ?? {}).map(([name, value]) => ({ name: name.replace(/_/g, " "), value }));
  const tierData = Object.entries(analytics?.tier_stats ?? {}).map(([name, value]) => ({ name, value }));
  const platformViews = growth?.platform_views ?? { tiktok: 0, instagram: 0, youtube: 0 };
  const totalPlatformViews = platformViews.tiktok + platformViews.instagram + platformViews.youtube;

  const pendingPayouts = creators.filter(c => c.stripe_onboarded && c.total_earnings_cents > 0);

  const tabs = [
    { key: "overview", label: "Overview", icon: BarChart2 },
    { key: "creators", label: `Creators (${creators.length})`, icon: Users },
    { key: "submissions", label: `Submissions (${submissions.length})`, icon: FileText },
    { key: "payouts", label: `Payouts`, icon: CreditCard },
  ] as const;

  return (
    <div className="py-8 bg-secondary/20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <AnimatedSection direction="none" className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">Founders Admin Panel</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Clippers University · Creator Operations</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={loadData} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg hover:bg-secondary/50 text-sm font-medium transition-colors disabled:opacity-60">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
            <button onClick={() => { localStorage.removeItem("cu_admin_token"); navigate("/admin-login"); }}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-lg hover:bg-red-100 text-sm font-medium transition-colors">
              Log Out
            </button>
          </div>
        </AnimatedSection>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-border rounded-xl p-1 mb-6 w-fit overflow-x-auto">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key as typeof tab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                tab === key ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}>
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {tab === "overview" && (
          <div className="space-y-6">

            {/* KPI row — Exolyt style top bar */}
            <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-0 divide-x divide-border">
                {[
                  { label: "Total Creators", value: analytics?.total_creators?.toLocaleString() ?? "0", icon: Users },
                  { label: "Onboarding", value: creators.filter(c => c.stripe_onboarded).length.toLocaleString(), icon: CreditCard, highlight: true },
                  { label: "Total Views", value: analytics?.total_views && analytics.total_views > 1e6 ? `${(analytics.total_views/1e6).toFixed(1)}M` : (analytics?.total_views ?? 0).toLocaleString(), icon: Eye },
                  { label: "Total Paid Out", value: `$${totalEarnings.toFixed(2)}`, icon: DollarSign },
                  { label: "Pending Review", value: submissions.filter(s => s.status === "pending").length.toString(), icon: Clock },
                  { label: "Page Visits (All Time)", value: (analytics?.total_page_views ?? 0).toLocaleString(), icon: TrendingUp },
                ].map((kpi, i) => (
                  <div key={i} className="flex flex-col items-center text-center px-4 py-2 first:pl-0 last:pr-0">
                    <div className={`text-2xl font-display font-black mb-0.5 ${(kpi as any).highlight ? "text-green-600" : ""}`}>{kpi.value}</div>
                    <div className="text-xs text-muted-foreground font-medium">{kpi.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform views — Exolyt style */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "TikTok Views", views: platformViews.tiktok, icon: SiTiktok, color: "text-black", bg: "bg-black/5" },
                { label: "Instagram Views", views: platformViews.instagram, icon: SiInstagram, color: "text-pink-500", bg: "bg-pink-50" },
                { label: "YouTube Views", views: platformViews.youtube, icon: SiYoutube, color: "text-red-600", bg: "bg-red-50" },
              ].map((p, i) => (
                <AnimatedSection key={i} delay={i * 0.08} direction="up">
                  <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${p.bg}`}><p.icon className={`w-5 h-5 ${p.color}`} /></div>
                      <span className="text-sm text-muted-foreground font-medium">{p.label}</span>
                    </div>
                    <div className="text-3xl font-display font-black">
                      {p.views > 1e6 ? `${(p.views/1e6).toFixed(1)}M` : p.views > 1000 ? `${(p.views/1000).toFixed(0)}K` : p.views || "—"}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">approved content</div>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            {/* Growth Chart — Exolyt style multi-line */}
            <AnimatedSection delay={0.2}>
              <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-base">Account Growth</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Creators · Submissions · Views over time</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-primary inline-block rounded" /> Creators</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-orange-400 inline-block rounded" /> Submissions</span>
                  </div>
                </div>
                {growth && growth.creator_growth.length > 0 ? (
                  <div className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={growth.creator_growth} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="gradCreators" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                        <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} />
                        <Area type="monotone" dataKey="cumulative" name="Total Creators" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#gradCreators)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[240px] flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Growth chart will populate as creators join</p>
                    </div>
                  </div>
                )}
              </div>
            </AnimatedSection>

            {/* Badge + Traffic + Top Creators row */}
            <div className="grid lg:grid-cols-3 gap-6">
              <AnimatedSection delay={0.3}>
                <div className="bg-white border border-border rounded-2xl p-6 shadow-sm h-full">
                  <h3 className="font-bold text-base mb-4 flex items-center gap-2"><Award className="w-4 h-4 text-primary" /> Badge Status</h3>
                  {badgeData.length > 0 ? (
                    <div className="flex items-center gap-4">
                      <div className="h-[180px] w-[180px] flex-shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={badgeData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
                              {badgeData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: "8px", fontSize: 12 }} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-2 flex-1">
                        {badgeData.map((d, i) => (
                          <div key={d.name} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                              <span className="capitalize text-muted-foreground">{d.name}</span>
                            </div>
                            <span className="font-bold">{d.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="h-[180px] flex items-center justify-center text-muted-foreground text-sm">No data yet</div>
                  )}
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.3}>
                <div className="bg-white border border-border rounded-2xl p-6 shadow-sm h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-base flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> Site Traffic</h3>
                    <div className="text-right">
                      <div className="text-xl font-black font-display">{(analytics?.total_page_views ?? 0).toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">all-time visits</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Last 30 days: {(analytics?.recent_page_views ?? 0).toLocaleString()} visits</div>
                  {analytics?.page_views_by_path?.length ? (
                    <div className="space-y-2">
                      {analytics.page_views_by_path.map((row, i) => {
                        const max = analytics.page_views_by_path[0].visits;
                        const pct = Math.round((row.visits / max) * 100);
                        return (
                          <div key={i}>
                            <div className="flex justify-between text-xs mb-0.5">
                              <span className="font-medium text-foreground truncate max-w-[160px]">{row.path === "/" ? "Home" : row.path}</span>
                              <span className="font-bold text-primary flex-shrink-0">{row.visits.toLocaleString()}</span>
                            </div>
                            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[100px] text-muted-foreground text-sm">No traffic data yet</div>
                  )}
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.4}>
                <div className="bg-white border border-border rounded-2xl p-6 shadow-sm h-full">
                  <h3 className="font-bold text-base mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> Top Creators</h3>
                  {analytics?.top_creators?.length ? (
                    <div className="space-y-3">
                      {analytics.top_creators.map((c, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                              {i + 1}
                            </div>
                            <span className="font-medium truncate">{c.full_name}</span>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="text-muted-foreground text-xs">{c.total_views.toLocaleString()} views</span>
                            <span className="font-bold text-primary">${(c.total_earnings_cents / 100).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[140px] text-muted-foreground text-sm">No creator data yet</div>
                  )}
                </div>
              </AnimatedSection>
            </div>
          </div>
        )}

        {/* ── CREATORS TAB ── */}
        {tab === "creators" && (
          <AnimatedSection direction="up">
            <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h3 className="font-bold text-lg flex items-center gap-2"><Users className="w-5 h-5 text-primary" /> All Creators</h3>
                <span className="text-sm text-muted-foreground">{creators.length} total</span>
              </div>
              {loading ? (
                <div className="p-12 text-center text-muted-foreground">Loading...</div>
              ) : creators.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">No creators yet</div>
              ) : (
                <div className="divide-y divide-border">
                  {creators.map(c => (
                    <div key={c.id}>
                      <div className="flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors cursor-pointer"
                        onClick={() => setExpandedCreator(expandedCreator === c.id ? null : c.id)}>
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">
                            {c.full_name[0]}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold truncate">{c.full_name}</div>
                            <div className="text-xs text-muted-foreground">{c.email} · {c.creator_type}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {/* Earnings amount */}
                          {c.total_earnings_cents > 0 && (
                            <span className="text-sm font-black text-primary tabular-nums hidden sm:block">
                              ${(c.total_earnings_cents / 100).toFixed(2)}
                            </span>
                          )}

                          {/* Payout button — always visible, locked or live */}
                          {c.stripe_onboarded ? (
                            <button
                              onClick={e => { e.stopPropagation(); setPayoutModal({ creator: c }); setPayoutAmount((c.total_earnings_cents / 100).toFixed(2)); setPayoutNote("CPM payout — Clippers University"); setPayoutError(""); }}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-sm shadow-primary/30"
                            >
                              <CreditCard className="w-3.5 h-3.5" /> Pay Out
                            </button>
                          ) : (
                            <div
                              title="Creator hasn't connected Stripe yet"
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-muted-foreground text-xs font-bold rounded-lg cursor-not-allowed select-none border border-border"
                            >
                              <Lock className="w-3 h-3" /> Pay Out
                            </div>
                          )}

                          <StatusBadge status={c.badge_status} />
                          <button
                            onClick={e => { e.stopPropagation(); setDeleteModal(c); setDeleteError(""); }}
                            title="Delete creator account"
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors flex-shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          {expandedCreator === c.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                        </div>
                      </div>
                      {expandedCreator === c.id && (
                        <div className="bg-secondary/20 px-6 pb-5 pt-3 border-t border-border">
                          {/* Platform Views Breakdown */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm mb-3">
                            {[
                              { icon: SiTiktok, label: "TikTok", views: c.tiktok_views, handle: c.tiktok_handle, color: "text-black", bg: "bg-black/5" },
                              { icon: SiInstagram, label: "Instagram", views: c.instagram_views, handle: c.instagram_handle, color: "text-pink-500", bg: "bg-pink-50" },
                              { icon: SiYoutube, label: "YouTube", views: c.youtube_views, handle: c.youtube_handle, color: "text-red-600", bg: "bg-red-50" },
                              { icon: SiSnapchat, label: "Snapchat", views: c.snapchat_views, handle: c.snapchat_handle, color: "text-yellow-500", bg: "bg-yellow-50" },
                            ].map((p, pi) => {
                              const PIcon = p.icon;
                              const v = p.views || 0;
                              const vLabel = v >= 1_000_000 ? `${(v/1_000_000).toFixed(1)}M` : v >= 1_000 ? `${(v/1_000).toFixed(0)}K` : v > 0 ? v.toLocaleString() : "—";
                              return (
                                <div key={pi} className={`rounded-xl p-3 border border-border ${p.bg}`}>
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <PIcon className={`w-3.5 h-3.5 ${p.color}`} />
                                    <span className="text-xs text-muted-foreground font-medium">{p.label}</span>
                                  </div>
                                  <div className="font-bold text-sm">{vLabel}</div>
                                  {p.handle && <div className="text-xs text-muted-foreground truncate mt-0.5">{p.handle}</div>}
                                </div>
                              );
                            })}
                          </div>

                          <div className="grid sm:grid-cols-3 gap-2 text-sm mb-3">
                            <div className="bg-white rounded-xl p-3 border border-border">
                              <div className="text-muted-foreground text-xs mb-1">Total Views</div>
                              <div className="font-bold">{(c.total_views || 0).toLocaleString()}</div>
                            </div>
                            <div className="bg-white rounded-xl p-3 border border-border">
                              <div className="text-muted-foreground text-xs mb-1">Total Earnings</div>
                              <div className="font-bold text-primary">${(c.total_earnings_cents / 100).toFixed(2)}</div>
                            </div>
                            <div className="bg-white rounded-xl p-3 border border-border">
                              <div className="text-muted-foreground text-xs mb-1">Stripe · Joined</div>
                              <div className={`font-bold text-xs ${c.stripe_onboarded ? "text-green-600" : "text-muted-foreground"}`}>
                                {c.stripe_onboarded ? "Stripe ✓" : "No Stripe"} · {new Date(c.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {(c.badge_status === "claimed" || c.badge_status === "eligible") && (
                              <button onClick={() => approveBadge(c.id)} disabled={actionLoading[`badge-${c.id}`]}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-lg hover:opacity-90 disabled:opacity-60">
                                <Award className="w-4 h-4" />
                                {actionLoading[`badge-${c.id}`] ? "Approving..." : "Approve $20 Badge"}
                              </button>
                            )}
                            {c.stripe_onboarded && submissions.some(s => s.creator_id === c.id && s.status === "approved") ? (
                              <button onClick={() => { setPayoutModal({ creator: c }); setPayoutAmount((c.total_earnings_cents / 100).toFixed(2)); setPayoutNote("CPM payout — Clippers University"); setPayoutError(""); }}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 shadow-sm shadow-green-600/30">
                                <CreditCard className="w-4 h-4" /> Send Payment
                              </button>
                            ) : c.stripe_onboarded ? (
                              <div className="flex items-center gap-2 px-4 py-2 bg-secondary text-muted-foreground text-sm font-medium rounded-lg border border-border cursor-not-allowed select-none"
                                title="No approved content yet">
                                <Lock className="w-3.5 h-3.5" /> Send Payment — awaiting approved content
                              </div>
                            ) : null}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </AnimatedSection>
        )}

        {/* ── SUBMISSIONS TAB ── */}
        {tab === "submissions" && (
          <AnimatedSection direction="up">
            <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h3 className="font-bold text-lg flex items-center gap-2"><FileText className="w-5 h-5 text-primary" /> Content Submissions</h3>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{submissions.filter(s => s.status === "pending").length} pending</span>
                </div>
              </div>
              {loading ? (
                <div className="p-12 text-center text-muted-foreground">Loading...</div>
              ) : submissions.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">No submissions yet</div>
              ) : (
                <div className="divide-y divide-border">
                  {submissions.map(sub => (
                    <div key={sub.id} className="p-4 hover:bg-secondary/10">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-semibold text-sm">{sub.campaign_name}</span>
                            <StatusBadge status={sub.status} />
                            <span className="text-xs text-muted-foreground capitalize">{sub.platform}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mb-2">
                            {sub.views.toLocaleString()} views · Est. ${(sub.payout_cents / 100).toFixed(2)} · {new Date(sub.submitted_at).toLocaleDateString()}
                          </div>
                          <a href={sub.content_url} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline truncate block max-w-sm">{sub.content_url}</a>
                        </div>
                        {sub.status === "pending" && (
                          <div className="flex gap-2 flex-shrink-0">
                            <button onClick={() => approveSubmission(sub.id)} disabled={actionLoading[`sub-${sub.id}`]}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:opacity-90 disabled:opacity-60">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {actionLoading[`sub-${sub.id}`] ? "..." : "Approve"}
                            </button>
                            <button onClick={() => rejectSubmission(sub.id)} disabled={actionLoading[`sub-${sub.id}`]}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-foreground text-xs font-bold rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-60">
                              <XCircle className="w-3.5 h-3.5" /> Reject
                            </button>
                          </div>
                        )}
                        {sub.status === "approved" && <span className="flex items-center gap-1 text-primary text-xs font-semibold flex-shrink-0"><CheckCircle2 className="w-4 h-4" /> Approved</span>}
                        {sub.status === "rejected" && <span className="flex items-center gap-1 text-red-500 text-xs font-semibold flex-shrink-0"><XCircle className="w-4 h-4" /> Rejected</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </AnimatedSection>
        )}

        {/* ── PAYOUTS TAB ── */}
        {tab === "payouts" && (
          <AnimatedSection direction="up" className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-4">
              <MetricCard
                label="Onboarding"
                value={creators.filter(c => c.stripe_onboarded).length.toLocaleString()}
                icon={CheckCircle2}
                accent
              />
              <MetricCard
                label="Not Onboarded"
                value={"0"}
                icon={AlertCircle}
              />
              <MetricCard label="Total Paid Out" value={`$${totalEarnings.toFixed(2)}`} icon={DollarSign} accent />
            </div>

            <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border">
                <h3 className="font-bold text-lg flex items-center gap-2"><CreditCard className="w-5 h-5 text-primary" /> Creator Payout Status</h3>
                <p className="text-sm text-muted-foreground mt-1">Only Stripe-onboarded creators can receive payouts.</p>
              </div>
              <div className="divide-y divide-border">
                {creators.length === 0 && <div className="p-12 text-center text-muted-foreground">No creators yet</div>}
                {creators.map(c => (
                  <div key={c.id} className="flex items-center justify-between p-4 hover:bg-secondary/10">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0 text-sm">
                        {c.full_name[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm truncate">{c.full_name}</div>
                        <div className="text-xs text-muted-foreground">{c.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-right hidden sm:block">
                        <div className="text-sm font-bold">${(c.total_earnings_cents / 100).toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">earned</div>
                      </div>
                      {c.stripe_onboarded ? (
                        <button onClick={() => { setPayoutModal({ creator: c }); setPayoutAmount(""); setPayoutNote(""); setPayoutError(""); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700">
                          <Zap className="w-3.5 h-3.5" /> Send Payout
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground bg-secondary px-3 py-1.5 rounded-lg">Stripe not set up</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        )}

      </div>

      {/* Payout Modal */}
      {payoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl border border-border">
            <h3 className="font-bold text-xl mb-1">Send Payout</h3>
            <p className="text-muted-foreground text-sm mb-6">To: <strong>{payoutModal.creator.full_name}</strong></p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Amount (USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-muted-foreground font-bold">$</span>
                  <input type="number" step="0.01" min="0.01" value={payoutAmount} onChange={e => setPayoutAmount(e.target.value)}
                    className="w-full border border-border rounded-xl px-4 py-3 pl-8 outline-none focus:border-primary text-sm"
                    placeholder="20.00" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Note (optional)</label>
                <input type="text" value={payoutNote} onChange={e => setPayoutNote(e.target.value)}
                  className="w-full border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-sm"
                  placeholder="CPM payout — March campaign" />
              </div>
              {payoutError && <p className="text-red-500 text-sm flex items-center gap-1.5"><AlertCircle className="w-4 h-4" /> {payoutError}</p>}
              <div className="flex gap-3 pt-1">
                <button onClick={() => setPayoutModal(null)} className="flex-1 px-4 py-3 border border-border rounded-xl text-sm font-semibold hover:bg-secondary transition-colors">Cancel</button>
                <button onClick={triggerPayout} disabled={actionLoading[`payout-${payoutModal.creator.id}`]}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-colors disabled:opacity-60">
                  {actionLoading[`payout-${payoutModal.creator.id}`] ? "Sending..." : "Send via Stripe"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Creator Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">Delete Account</h3>
                <p className="text-sm text-muted-foreground">This cannot be undone</p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5 text-sm text-red-700 space-y-1">
              <p className="font-semibold">You are about to permanently delete:</p>
              <p>· <strong>{deleteModal.full_name}</strong> ({deleteModal.email})</p>
              {deleteModal.stripe_account_id && <p>· Their Stripe connected account</p>}
              <p>· All submissions, applications &amp; transactions</p>
            </div>

            {deleteError && (
              <p className="text-red-500 text-sm flex items-center gap-1.5 mb-4">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {deleteError}
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setDeleteModal(null); setDeleteError(""); }}
                className="flex-1 px-4 py-3 border border-border rounded-xl text-sm font-semibold hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteCreator}
                disabled={deleteLoading}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {deleteLoading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Deleting...</>
                ) : (
                  <><Trash2 className="w-4 h-4" /> Delete Forever</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
