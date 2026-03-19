import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Calendar as CalendarIcon, Clock, Video } from "lucide-react";
import { useState } from "react";

export default function BookACall() {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  // Generate mock dates (next 7 days)
  const dates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.getDate(),
      full: d
    };
  });

  const times = ["09:00 AM", "10:30 AM", "01:00 PM", "02:30 PM", "04:00 PM"];

  return (
    <div className="py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <AnimatedSection className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Book a Demo</h1>
          <p className="text-xl text-muted-foreground">Discover how P2C can scale your content strategy.</p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="bg-card border border-border rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl">
            
            {/* Left Sidebar Info */}
            <div className="w-full md:w-1/3 bg-secondary/50 p-8 border-r border-border">
              <div className="w-16 h-16 rounded-full overflow-hidden mb-6 border-2 border-primary">
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80" alt="Sales Rep" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-lg mb-1">James Wilson</h3>
              <p className="text-muted-foreground text-sm mb-8">Head of Partnerships</p>
              
              <div className="space-y-4 text-sm font-medium">
                <div className="flex items-center gap-3">
                  <Video className="w-5 h-5 text-primary" />
                  Google Meet
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  30 Minutes
                </div>
              </div>
            </div>

            {/* Right Booking Area */}
            <div className="w-full md:w-2/3 p-8">
              {step === 1 ? (
                <>
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" /> Select a Date
                  </h3>
                  
                  <div className="grid grid-cols-7 gap-2 mb-8">
                    {dates.map((d, i) => (
                      <button
                        key={i}
                        onClick={() => { setSelectedDate(i); setSelectedTime(null); }}
                        className={`py-3 rounded-xl flex flex-col items-center justify-center transition-all ${
                          selectedDate === i 
                            ? 'bg-primary text-primary-foreground shadow-md' 
                            : 'bg-background border border-border hover:border-primary'
                        }`}
                      >
                        <span className="text-xs uppercase font-bold opacity-80 mb-1">{d.day}</span>
                        <span className="text-lg font-bold">{d.date}</span>
                      </button>
                    ))}
                  </div>

                  {selectedDate !== null && (
                    <AnimatedSection direction="up" className="mb-8">
                      <h4 className="font-bold text-sm mb-4">Available Times</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {times.map(t => (
                          <button
                            key={t}
                            onClick={() => setSelectedTime(t)}
                            className={`py-2 rounded-lg text-sm font-medium transition-all ${
                              selectedTime === t 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-secondary text-foreground hover:bg-border'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </AnimatedSection>
                  )}

                  <div className="flex justify-end pt-6 border-t border-border mt-auto">
                    <button 
                      onClick={() => setStep(2)}
                      disabled={!selectedTime}
                      className="px-8 py-3 bg-foreground text-background font-bold rounded-xl disabled:opacity-50 transition-opacity"
                    >
                      Next Step
                    </button>
                  </div>
                </>
              ) : (
                <AnimatedSection direction="left">
                  <button onClick={() => setStep(1)} className="text-sm text-primary font-medium hover:underline mb-6 block">
                    ← Back to calendar
                  </button>
                  <h3 className="text-xl font-bold mb-6">Your Details</h3>
                  
                  <form className="space-y-5" onSubmit={e => { e.preventDefault(); alert("Meeting booked!"); setStep(1); setSelectedDate(null); setSelectedTime(null); }}>
                    <div>
                      <label className="block text-sm font-medium mb-2">Name</label>
                      <input required type="text" className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Work Email</label>
                      <input required type="email" className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Company / Channel URL</label>
                      <input required type="url" className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none" />
                    </div>
                    <button type="submit" className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 mt-4">
                      Confirm Booking
                    </button>
                  </form>
                </AnimatedSection>
              )}
            </div>

          </div>
        </AnimatedSection>

      </div>
    </div>
  );
}
