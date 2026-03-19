import { useState } from "react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { useAuth } from "@/context/AuthContext";
import { useLocation, Link } from "wouter";
import { Upload, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";

const CAMPAIGNS = [
  { id: "p2p-fittech-premium", name: "P2P Fit Tech AI — Premium", cpm: "$3.00", tier: "Premium" },
  { id: "p2p-fittech-growth", name: "P2P Fit Tech AI — Growth", cpm: "$2.00", tier: "Growth" },
  { id: "p2p-fittech-starter", name: "P2P Fit Tech AI — Starter", cpm: "$1.00", tier: "Starter" },
  { id: "coach-cashflow", name: "Coach Cashflow", cpm: "$2.00", tier: "Growth" },
  { id: "p2wm", name: "P2Wm", cpm: "$1.00", tier: "Starter" },
];

const PLATFORMS = ["TikTok", "Instagram Reels", "YouTube Shorts", "Snapchat Spotlight"];

export default function Submit() {
  const { user, token, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  const [form, setForm] = useState({
    campaign_id: "",
    platform: "",
    content_url: "",
    caption: "",
    views: "",
    likes: "",
    comments: "",
    shares: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isLoading && !user) {
    setLocation("/login");
    return null;
  }

  if (isLoading) return <div className="py-32 text-center text-muted-foreground">Loading...</div>;

  const selectedCampaign = CAMPAIGNS.find(c => c.id === form.campaign_id);

  const estimatedPayout = (() => {
    if (!selectedCampaign || !form.views) return null;
    const views = parseInt(form.views.replace(/,/g, ""));
    const cpmCents = parseFloat(selectedCampaign.cpm.replace("$", "")) * 100;
    if (isNaN(views) || views <= 0) return null;
    return ((views / 1000) * cpmCents / 100).toFixed(2);
  })();

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.campaign_id || !form.platform || !form.content_url) {
      setError("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    setError("");

    const selectedCamp = CAMPAIGNS.find(c => c.id === form.campaign_id);
    try {
      const res = await fetch("/api/cu/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          campaign_id: form.campaign_id,
          campaign_name: selectedCamp?.name || form.campaign_id,
          platform: form.platform,
          content_url: form.content_url,
          caption: form.caption,
          views: parseInt(form.views.replace(/,/g, "")) || 0,
          likes: parseInt(form.likes.replace(/,/g, "")) || 0,
          comments: parseInt(form.comments.replace(/,/g, "")) || 0,
          shares: parseInt(form.shares.replace(/,/g, "")) || 0,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Submission failed" }));
        throw new Error(err.error || "Submission failed");
      }
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inp = "w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm";
  const sel = `${inp} appearance-none`;

  if (success) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
        <AnimatedSection className="text-center max-w-md">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-display font-bold mb-3">Submission Received!</h2>
          <p className="text-muted-foreground mb-2">
            Your content has been submitted for review. Our team will review it within 24–48 hours.
          </p>
          {estimatedPayout && (
            <p className="text-primary font-bold text-lg mb-6">
              Estimated payout: ~${estimatedPayout}
            </p>
          )}
          <div className="flex gap-3 justify-center">
            <Link href="/dashboard">
              <button className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90">
                Go to Dashboard
              </button>
            </Link>
            <button
              onClick={() => { setSuccess(false); setForm({ campaign_id: "", platform: "", content_url: "", caption: "", views: "", likes: "", comments: "", shares: "" }); }}
              className="px-6 py-3 bg-secondary text-foreground font-bold rounded-xl hover:bg-secondary/80"
            >
              Submit Another
            </button>
          </div>
        </AnimatedSection>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 min-h-[calc(100vh-4rem)] bg-secondary/20">
      <div className="max-w-2xl mx-auto">
        <AnimatedSection direction="none" className="mb-8">
          <Link href="/dashboard">
            <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>
          </Link>
          <h1 className="text-3xl font-display font-bold mb-2">Submit Content</h1>
          <p className="text-muted-foreground">Submit your campaign content for CPM payout review.</p>
        </AnimatedSection>

        <AnimatedSection direction="up">
          <div className="bg-white border border-border rounded-2xl p-8 shadow-sm">
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campaign Selection */}
              <div>
                <label className="block text-sm font-semibold mb-2">Campaign <span className="text-red-500">*</span></label>
                <select value={form.campaign_id} onChange={e => set("campaign_id", e.target.value)} className={sel} required>
                  <option value="">Select a campaign...</option>
                  {CAMPAIGNS.map(c => (
                    <option key={c.id} value={c.id}>{c.name} — {c.cpm}/1K views</option>
                  ))}
                </select>
                {selectedCampaign && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Tier required: <span className="font-medium text-primary">{selectedCampaign.tier}</span> — Your tier: <span className="font-medium capitalize">{user?.tier}</span>
                  </p>
                )}
              </div>

              {/* Platform */}
              <div>
                <label className="block text-sm font-semibold mb-2">Platform <span className="text-red-500">*</span></label>
                <select value={form.platform} onChange={e => set("platform", e.target.value)} className={sel} required>
                  <option value="">Select platform...</option>
                  {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              {/* Content URL */}
              <div>
                <label className="block text-sm font-semibold mb-2">Content URL <span className="text-red-500">*</span></label>
                <input
                  type="url"
                  value={form.content_url}
                  onChange={e => set("content_url", e.target.value)}
                  className={inp}
                  placeholder="https://www.tiktok.com/@yourhandle/video/..."
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">Paste the direct link to your published video</p>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-sm font-semibold mb-2">Caption / Description</label>
                <textarea
                  value={form.caption}
                  onChange={e => set("caption", e.target.value)}
                  className={`${inp} resize-none`}
                  rows={3}
                  placeholder="Paste the caption you used on the post..."
                />
              </div>

              {/* Stats */}
              <div>
                <label className="block text-sm font-semibold mb-3">Current Stats (at time of submission)</label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: "views", label: "Views", placeholder: "e.g. 50000" },
                    { key: "likes", label: "Likes", placeholder: "e.g. 3200" },
                    { key: "comments", label: "Comments", placeholder: "e.g. 450" },
                    { key: "shares", label: "Shares", placeholder: "e.g. 120" },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
                      <input
                        type="text"
                        value={form[key as keyof typeof form]}
                        onChange={e => set(key, e.target.value)}
                        className={inp}
                        placeholder={placeholder}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Estimated Payout */}
              {estimatedPayout && (
                <div className="bg-primary/5 border border-primary/15 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Estimated Payout</div>
                    <div className="text-2xl font-display font-bold text-primary">${estimatedPayout}</div>
                    <div className="text-xs text-muted-foreground">Based on {parseInt(form.views).toLocaleString()} views at {selectedCampaign?.cpm}/1K</div>
                  </div>
                  <Upload className="w-8 h-8 text-primary/30" />
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
                ) : (
                  <><Upload className="w-5 h-5" /> Submit for Review</>
                )}
              </button>
            </form>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
