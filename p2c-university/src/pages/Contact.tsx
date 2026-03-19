import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { MessageSquare, ArrowRight, Calendar } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <AnimatedSection direction="none" className="text-center mb-12">
          <h1 className="text-5xl font-display font-bold mb-4">Let's Talk</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Whether you're a creator ready to earn or a brand looking to scale — we respond within 24 hours.
          </p>
        </AnimatedSection>

        <AnimatedSection direction="none" delay={0.1} className="mb-10">
          <Link href="/book-a-call" className="flex items-center justify-between p-6 bg-primary/10 border border-primary/30 rounded-2xl hover:bg-primary/15 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <div className="text-lg font-bold">Book a Call</div>
                <div className="text-sm text-muted-foreground">Schedule a 15-minute intro with our creator team</div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
          </Link>
        </AnimatedSection>

        <AnimatedSection direction="none" delay={0.15}>
          <div className="bg-card border border-border rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10" />

            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                <p className="text-muted-foreground">We'll get back to you within 24 hours.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-8 px-6 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input required type="text" className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input required type="email" className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors" placeholder="you@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea required rows={5} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors resize-none" placeholder="How can we help?" />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </AnimatedSection>

      </div>
    </div>
  );
}
