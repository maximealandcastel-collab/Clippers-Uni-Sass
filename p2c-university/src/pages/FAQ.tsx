import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

const faqs = [
  {
    q: "How does the CPM payout actually work?",
    a: "We track the views generated from the unique links or branded content you post. Once a month, we tally your qualified views and multiply them by your tier's CPM rate. For example, 1,000,000 views at Growth tier ($2.00 CPM) = $2,000 payout."
  },
  {
    q: "What counts as a 'qualified view'?",
    a: "A qualified view is an organic, non-botted view from the target geographic region of the campaign (usually Tier 1 countries like US, UK, CA, AU). Our analytics system automatically filters out suspicious traffic."
  },
  {
    q: "When and how do I get paid?",
    a: "Payouts are processed automatically via Stripe or Wire Transfer on a Net-30 basis (or Net-15 for Premium tier) at the end of each calendar month. The minimum withdrawal threshold is $50."
  },
  {
    q: "Do I need a large following to join?",
    a: "Not necessarily. Our Starter tier is perfect for new clippers who are good at making viral content, even on fresh accounts. The algorithm cares about the content quality, not your follower count."
  },
  {
    q: "Are the raw materials provided?",
    a: "Yes! Once accepted into a campaign, you get access to a Google Drive folder with high-quality raw footage, brand assets, and a brief outlining the campaign goals."
  },
  {
    q: "Can I use AI voiceovers or automated editing?",
    a: "While we allow AI tools to assist your workflow, low-effort fully automated spam channels are often rejected. Brands are paying for high-quality, engaging content that fits current trends."
  },
  {
    q: "How do I upgrade my tier?",
    a: "Tiers are automatically reviewed every 30 days. If you consistently hit the view threshold for the next tier while maintaining high content quality, your account manager will upgrade you."
  },
  {
    q: "What if my video gets taken down?",
    a: "If a video is removed by the platform (TikTok/YouTube) due to community guidelines, the views generated prior to removal may still be counted depending on the campaign terms, provided it wasn't removed for malicious reasons."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <AnimatedSection className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground">Everything you need to know about earning with P2C.</p>
        </AnimatedSection>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <AnimatedSection key={i} delay={i * 0.05} direction="up">
              <div 
                className={cn(
                  "border rounded-2xl overflow-hidden transition-all duration-300",
                  openIndex === i ? "border-primary bg-secondary/30" : "border-border bg-card hover:border-primary/50"
                )}
              >
                <button
                  className="w-full text-left px-6 py-5 flex justify-between items-center focus:outline-none"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                >
                  <span className="font-bold text-lg pr-8">{faq.q}</span>
                  <ChevronDown className={cn(
                    "w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300",
                    openIndex === i && "rotate-180 text-primary"
                  )} />
                </button>
                <div 
                  className={cn(
                    "px-6 overflow-hidden transition-all duration-300 ease-in-out",
                    openIndex === i ? "max-h-96 pb-5 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.5} className="mt-16 text-center p-8 bg-card border border-border rounded-3xl">
          <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
          <p className="text-muted-foreground mb-6">Our support team is ready to help you out.</p>
          <Link href="/contact" className="inline-flex px-6 py-3 rounded-lg bg-secondary text-foreground font-semibold hover:bg-secondary/80 transition-colors">
            Contact Support
          </Link>
        </AnimatedSection>

      </div>
    </div>
  );
}
