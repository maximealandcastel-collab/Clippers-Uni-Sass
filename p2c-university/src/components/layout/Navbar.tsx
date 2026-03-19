import { Link, useLocation } from "wouter";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { Sun, Moon, Menu, X, User as UserIcon, LogOut, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { href: "/pricing", label: "Pricing" },
    { href: "/campaigns", label: "Campaigns" },
    { href: "/creators", label: "Creators" },
    { href: "/case-studies", label: "Success" },
    { href: "/about", label: "About" },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled 
          ? "bg-white/90 backdrop-blur-xl border-b shadow-sm"
          : "bg-white/80 backdrop-blur-md border-b border-border/40 py-2"
      )}
      style={isScrolled ? {
        borderBottom: '1px solid rgba(220,230,255,0.6)',
        boxShadow: '0 1px 0 rgba(37,99,235,0.06), 0 4px 16px -4px rgba(37,99,235,0.08)'
      } : undefined}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <img 
              src={`${import.meta.env.BASE_URL}images/logo.png`} 
              alt="Clippers University" 
              className="h-12 w-auto object-contain logo-glow group-hover:scale-105 transition-all duration-200"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location === link.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <Link 
                  href="/dashboard"
                  className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors"
                >
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <UserIcon className="w-4 h-4" />
                  )}
                  <span>Dashboard</span>
                </Link>
                <button 
                  onClick={logout}
                  className="p-2 text-muted-foreground hover:text-destructive rounded-full hover:bg-destructive/10 transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
                  Log in
                </Link>
                <Link 
                  href="/signup" 
                  className="px-5 py-2.5 text-sm font-bold bg-primary text-primary-foreground rounded-full shadow-md shadow-primary/20 hover:shadow-primary/35 hover:-translate-y-0.5 transition-all"
                >
                  Join Now
                </Link>
                <Link
                  href="/admin-login"
                  className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border border-border rounded-full hover:border-primary/50 hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin Login
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 md:hidden">
            <button onClick={toggleTheme} className="p-2 text-muted-foreground">
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-foreground">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-border shadow-xl py-4 px-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={cn(
                "px-4 py-3 rounded-lg font-medium",
                location === link.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="h-px bg-border my-2" />
          {user ? (
            <>
              <Link href="/dashboard" className="px-4 py-3 rounded-lg font-medium bg-secondary text-foreground">
                Dashboard
              </Link>
              <button onClick={logout} className="px-4 py-3 rounded-lg font-medium text-destructive text-left">
                Log out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Link href="/login" className="px-4 py-3 text-center rounded-lg border border-border font-medium">
                Log in
              </Link>
              <Link href="/signup" className="px-4 py-3 text-center rounded-lg bg-primary text-primary-foreground font-bold">
                Join Now
              </Link>
              <Link href="/admin-login" className="px-4 py-3 text-center rounded-lg border border-border font-medium text-muted-foreground flex items-center justify-center gap-2">
                <Shield className="w-4 h-4" />
                Admin Login
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
