import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Check, ExternalLink, AlertCircle } from "lucide-react";
import { SiTiktok, SiInstagram, SiSnapchat, SiYoutube } from "react-icons/si";
import { useAuth } from "@/context/AuthContext";

export default function Signup() {
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();
  const { signup } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    creator_type: "",
    tiktok_handle: "",
    instagram_handle: "",
    youtube_handle: "",
    snapchat_handle: "",
    niche: "",
    country: "",
  });

  const set = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

  const handleConnectPlatform = (platform: string) => {
    setConnectedPlatforms(prev =>
      prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
    );
  };

  const step1Valid = form.full_name.length >= 2 && form.email.includes("@") && form.password.length >= 8 && form.phone.length >= 7 && form.creator_type;

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setError("");
    try {
      await signup({
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        creator_type: form.creator_type,
        tiktok_handle: form.tiktok_handle || undefined,
        instagram_handle: form.instagram_handle || undefined,
        youtube_handle: form.youtube_handle || undefined,
        snapchat_handle: form.snapchat_handle || undefined,
      });
      setLocation("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Signup failed. Please try again.");
      setStep(1);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inp = "w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all";
  const sel = `${inp} appearance-none`;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10" />

      <div className="w-full max-w-2xl">
        <AnimatedSection direction="none" className="mb-8">
          <div className="flex justify-between items-center relative mb-8">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-secondary -z-10 rounded-full" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 rounded-full transition-all duration-500"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                step > i ? "bg-primary text-primary-foreground" :
                step === i ? "bg-card border-2 border-primary text-primary" : "bg-card border border-border text-muted-foreground"
              }`}>
                {step > i ? <Check className="w-5 h-5" /> : i}
              </div>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-center">
            {step === 1 ? "Create your account" : step === 2 ? "Creator Profile" : step === 3 ? "Connect Socials" : "Ready to launch"}
          </h1>
          <p className="text-center text-muted-foreground mt-2 text-sm">
            {step === 1 ? "Basic info and credentials" : step === 2 ? "Tell us about your content" : step === 3 ? "Link your social platforms" : "Review and confirm"}
          </p>
        </AnimatedSection>

        <AnimatedSection key={step} direction="left" className="bg-card border border-border rounded-3xl p-8 sm:p-10 shadow-xl">

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Step 1 — Credentials */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input value={form.full_name} onChange={e => set("full_name", e.target.value)} className={inp} placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input type="email" value={form.email} onChange={e => set("email", e.target.value)} className={inp} placeholder="john@example.com" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <input type="password" value={form.password} onChange={e => set("password", e.target.value)} className={inp} placeholder="••••••••" autoComplete="new-password" />
                  <p className="text-xs text-muted-foreground mt-1">Minimum 8 characters</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} className={inp} placeholder="+1 (555) 000-0000" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Creator Type</label>
                <select value={form.creator_type} onChange={e => set("creator_type", e.target.value)} className={sel}>
                  <option value="">Select your creator type...</option>
                  <option value="clipper">Clipper</option>
                  <option value="ugc">UGC Creator</option>
                  <option value="editor">Short-form Editor</option>
                  <option value="social_growth">Social Growth Creator</option>
                  <option value="multi_platform">Multi-platform Creator</option>
                </select>
              </div>
              <button
                onClick={() => step1Valid && setStep(2)}
                disabled={!step1Valid}
                className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 mt-4 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                Continue to Profile
              </button>
            </div>
          )}

          {/* Step 2 — Niche + Handles */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">Primary Content Niche</label>
                <select value={form.niche} onChange={e => set("niche", e.target.value)} className={sel}>
                  <option value="">Select a niche...</option>
                  <option value="gaming">Gaming & Esports</option>
                  <option value="finance">Finance & Crypto</option>
                  <option value="lifestyle">Lifestyle & Vlogs</option>
                  <option value="tech">Tech & Reviews</option>
                  <option value="fitness">Fitness & Health</option>
                  <option value="podcast">Podcast Highlights</option>
                  <option value="beauty">Beauty & Fashion</option>
                  <option value="education">Education & Tutorials</option>
                </select>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-2">TikTok Handle</label>
                  <input value={form.tiktok_handle} onChange={e => set("tiktok_handle", e.target.value)} className={inp} placeholder="@username" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Instagram Handle</label>
                  <input value={form.instagram_handle} onChange={e => set("instagram_handle", e.target.value)} className={inp} placeholder="@username" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">YouTube Handle</label>
                  <input value={form.youtube_handle} onChange={e => set("youtube_handle", e.target.value)} className={inp} placeholder="@channel" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Snapchat Handle</label>
                  <input value={form.snapchat_handle} onChange={e => set("snapchat_handle", e.target.value)} className={inp} placeholder="@username" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Country / Region</label>
                <select value={form.country} onChange={e => set("country", e.target.value)} className={sel}>
                  <option value="">Select country...</option>
                  <option value="us">United States</option>
                  <option value="uk">United Kingdom</option>
                  <option value="ca">Canada</option>
                  <option value="au">Australia</option>
                  <option value="de">Germany</option>
                  <option value="fr">France</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setStep(1)} className="w-1/3 py-3.5 bg-secondary text-foreground font-bold rounded-xl hover:bg-secondary/80">Back</button>
                <button onClick={() => setStep(3)} className="w-2/3 py-3.5 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90">Connect Socials</button>
              </div>
            </div>
          )}

          {/* Step 3 — Connect Platforms */}
          {step === 3 && (
            <div className="space-y-6">
              <p className="text-muted-foreground text-center mb-6">
                Connect your social accounts for automatic view tracking and campaign matching.
              </p>

              <div className="space-y-4">
                {([
                  { name: "TikTok",    Icon: SiTiktok,    desc: "Connect TikTok for clip tracking",          bg: "bg-black",       iconColor: "text-white", accent: "border-l-black dark:border-l-white/30" },
                  { name: "Instagram", Icon: SiInstagram, desc: "Connect Instagram for Reels tracking",      bg: "bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888]", iconColor: "text-white", accent: "border-l-pink-500" },
                  { name: "Snapchat",  Icon: SiSnapchat,  desc: "Connect Snapchat Spotlight",                bg: "bg-[#FFFC00]",   iconColor: "text-black", accent: "border-l-yellow-400" },
                  { name: "YouTube",   Icon: SiYoutube,   desc: "Connect YouTube for Shorts tracking",       bg: "bg-[#FF0000]",   iconColor: "text-white", accent: "border-l-red-500" },
                ] as const).map((platform) => (
                  <div key={platform.name} className={`flex items-center justify-between p-4 bg-background rounded-xl border border-border ${platform.accent} border-l-4`}>
                    <div className="flex items-center gap-3">
                      <span className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${platform.bg}`}>
                        <platform.Icon className={`w-5 h-5 ${platform.iconColor}`} />
                      </span>
                      <div>
                        <div className="font-semibold text-sm">{platform.name}</div>
                        <div className="text-xs text-muted-foreground">{platform.desc}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleConnectPlatform(platform.name)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-1.5 ${
                        connectedPlatforms.includes(platform.name)
                          ? "bg-primary/10 text-primary border border-primary/30"
                          : "bg-primary text-primary-foreground hover:opacity-90"
                      }`}
                    >
                      {connectedPlatforms.includes(platform.name) ? (
                        <><Check className="w-4 h-4" /> Connected</>
                      ) : (
                        <><ExternalLink className="w-4 h-4" /> Connect via OAuth</>
                      )}
                    </button>
                  </div>
                ))}
              </div>

              <p className="text-xs text-muted-foreground text-center">
                OAuth integration coming soon. Connections are simulated for onboarding preview.
              </p>

              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setStep(2)} className="w-1/3 py-3.5 bg-secondary text-foreground font-bold rounded-xl hover:bg-secondary/80">Back</button>
                <button onClick={() => setStep(4)} className="w-2/3 py-3.5 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90">
                  {connectedPlatforms.length > 0 ? "Continue" : "Skip for Now"}
                </button>
              </div>
            </div>
          )}

          {/* Step 4 — Confirm */}
          {step === 4 && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold">Application Complete!</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Based on your profile, you pre-qualify for our Growth Tier. Create your account to access the dashboard and start earning immediately.
              </p>

              <div className="bg-secondary/50 border border-border rounded-xl p-4 text-left my-6 max-w-md mx-auto">
                <div className="text-sm text-muted-foreground mb-1">Estimated Starting Rate</div>
                <div className="text-2xl font-display font-bold text-primary">$2.00 / CPM</div>
                <div className="text-xs text-muted-foreground mt-1">Growth Tier • per 1,000 qualified views</div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left max-w-md mx-auto">
                <div className="text-sm font-bold text-amber-800 mb-1">🏅 $20 Creator Badge Available</div>
                <div className="text-xs text-amber-700">Claim your badge from the dashboard after joining to unlock premium brand deals and your first $20 bonus.</div>
              </div>

              <div className="flex gap-4 max-w-md mx-auto">
                <button type="button" onClick={() => setStep(3)} disabled={isSubmitting} className="w-1/3 py-3.5 bg-secondary text-foreground font-bold rounded-xl hover:bg-secondary/80 disabled:opacity-50">Back</button>
                <button onClick={handleFinalSubmit} disabled={isSubmitting} className="w-2/3 py-3.5 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 disabled:opacity-50 flex justify-center items-center gap-2">
                  {isSubmitting
                    ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</>
                    : "Access Dashboard"
                  }
                </button>
              </div>
            </div>
          )}

        </AnimatedSection>

        {step === 1 && (
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Log in</Link>
          </div>
        )}
      </div>
    </div>
  );
}
