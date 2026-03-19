import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Check, X } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export default function Pricing() {
  const tiers = [
    {
      name: "Starter",
      cpm: "$1.00",
      description: "Perfect for new clippers building their portfolio.",
      features: [
        "Access to basic campaigns",
        "Net-45 payouts",
        "Basic analytics dashboard",
        "Community discord access",
      ],
      missing: [
        "Premium brand deals",
        "Dedicated account manager",
        "Early campaign access"
      ],
      popular: false
    },
    {
      name: "Growth",
      cpm: "$2.00",
      description: "For consistent creators hitting over 100k views/month.",
      features: [
        "Access to premium campaigns",
        "Net-30 payouts",
        "Advanced analytics & tracking",
        "VIP Discord channels",
        "Early campaign access"
      ],
      missing: [
        "Dedicated account manager"
      ],
      popular: true
    },
    {
      name: "Premium",
      cpm: "$3.00",
      description: "Our best performance tier for viral powerhouses.",
      features: [
        "Exclusive brand partnerships",
        "Net-15 fast payouts",
        "Dedicated account manager",
        "Custom branded referral links",
        "Priority support",
        "Algorithm consultation calls"
      ],
      missing: [],
      popular: false,
      highlighted: true
    }
  ];

  return (
    <div className="py-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            Simple, Transparent{" "}
            <span className="text-primary orange-underline">Payouts</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            We don't charge you a fee. You earn based on your performance. The better your content performs, the higher tier you unlock.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, i) => (
            <AnimatedSection key={tier.name} delay={i * 0.1}>
              <div className={cn(
                "relative flex flex-col h-full bg-card gloss-card rounded-3xl p-8 border transition-all duration-300 shadow-sm",
                tier.highlighted
                  ? "border-2 shadow-[0_0_40px_-10px_rgba(37,99,235,0.2)] -translate-y-2"
                  : tier.popular 
                    ? "border-primary shadow-[0_0_30px_-15px_rgba(37,99,235,0.15)] -translate-y-4" 
                    : "border-border hover:border-primary/40 hover:-translate-y-1 hover:shadow-md"
              )}
              >
                {tier.highlighted && (
                  <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-gradient-to-r from-primary to-[hsl(var(--highlight))]" />
                )}
                {tier.popular && !tier.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                {tier.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider text-white bg-[hsl(var(--highlight))]">
                    Elite Tier
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="text-2xl font-display font-bold mb-2">{tier.name}</h3>
                  <p className="text-muted-foreground text-sm h-10">{tier.description}</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className={cn(
                      "text-5xl font-display font-bold",
                      tier.highlighted ? "text-primary" : "text-foreground"
                    )}>{tier.cpm}</span>
                    <span className="text-muted-foreground font-medium">/ CPM</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">per 1,000 qualified views</p>
                </div>

                <div className="flex-grow space-y-4 mb-8">
                  {tier.features.map(f => (
                    <div key={f} className="flex gap-3 text-sm font-medium">
                      <Check className="w-5 h-5 text-primary shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                  {tier.missing.map(f => (
                    <div key={f} className="flex gap-3 text-sm text-muted-foreground/50">
                      <X className="w-5 h-5 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <Link 
                  href="/signup" 
                  className={cn(
                    "w-full py-4 rounded-xl font-bold text-center transition-all block",
                    tier.highlighted || tier.popular 
                      ? "bg-primary text-primary-foreground hover:opacity-90 shadow-md shadow-primary/20" 
                      : "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
                  )}
                >
                  Apply for {tier.name}
                </Link>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.4} className="mt-32 max-w-3xl mx-auto text-center p-12 rounded-3xl bg-gradient-to-b from-secondary/60 to-white border border-border shadow-sm">
          <div className="w-10 h-1 rounded-full mx-auto mb-6 bg-[hsl(var(--highlight))]" />
          <h3 className="text-3xl font-display font-bold mb-4">Enterprise Agency?</h3>
          <p className="text-muted-foreground mb-8">
            Are you managing a team of editors driving over 10M+ views per month? Let's talk about a custom arrangement.
          </p>
          <Link href="/book-a-call" className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity shadow-md shadow-primary/20 inline-block">
            Contact Enterprise Sales
          </Link>
        </AnimatedSection>

      </div>
    </div>
  );
}
