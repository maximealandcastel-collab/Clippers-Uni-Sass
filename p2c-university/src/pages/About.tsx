import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Users, Target, Shield, Zap } from "lucide-react";

export default function About() {
  return (
    <div className="py-24">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <AnimatedSection className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6">
            Built by creators,<br />for <span className="text-primary text-glow">creators.</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            We started Clippers University because we were tired of seeing talented clippers and editors build massive audiences for brands while getting paid pennies.
          </p>
        </AnimatedSection>
      </section>

      {/* Story */}
      <section className="bg-card/50 border-y border-border py-24 mb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction="right">
              {/* placeholder for an image generated or via unsplash */}
              <div className="aspect-square bg-secondary rounded-3xl overflow-hidden border border-border shadow-2xl relative group">
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-500" />
                {/* coding/creative studio aesthetic */}
                <img 
                  src="https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=800&q=80" 
                  alt="Studio setup" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </AnimatedSection>
            
            <AnimatedSection direction="left">
              <h2 className="text-4xl font-display font-bold mb-6">The Content Revolution</h2>
              <div className="space-y-6 text-lg text-muted-foreground">
                <p>
                  In 2023, short-form content completely took over the internet. Brands realized they needed it, but traditional agencies were too slow and too expensive.
                </p>
                <p>
                  Meanwhile, a new breed of creator emerged: the "Clipper". Fast, agile, and culturally dialed-in. But the industry didn't know how to value them.
                </p>
                <p className="font-medium text-foreground border-l-4 border-primary pl-4 py-1">
                  Clippers University was founded to bridge this gap. We provide the infrastructure for clippers to get paid fairly (CPM) for the value they generate.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold mb-4">Our Core Values</h2>
          <p className="text-muted-foreground">What drives our platform forward.</p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Shield, title: "Transparency First", desc: "No hidden fees. You see exactly what the CPM is before you start clipping." },
            { icon: Zap, title: "Speed Wins", desc: "Fast payouts and quick campaign approvals. We move at the speed of the internet." },
            { icon: Users, title: "Creator Centric", desc: "We build tools that make your workflow easier, not harder." },
            { icon: Target, title: "Quality Driven", desc: "We only partner with premium brands that respect creator value." }
          ].map((v, i) => (
            <AnimatedSection key={i} delay={i * 0.1} direction="up">
              <div className="bg-card p-8 rounded-3xl border border-border h-full hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <v.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{v.title}</h3>
                <p className="text-muted-foreground">{v.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>
    </div>
  );
}
