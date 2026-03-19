import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { lazy, Suspense, useEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { Layout } from "./components/layout/Layout";
import { Flame } from "lucide-react";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const CaseStudies = lazy(() => import("./pages/CaseStudies"));
const Contact = lazy(() => import("./pages/Contact"));
const BookACall = lazy(() => import("./pages/BookACall"));
const Pricing = lazy(() => import("./pages/Pricing"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Campaigns = lazy(() => import("./pages/Campaigns"));
const Submit = lazy(() => import("./pages/Submit"));
const AdminCU = lazy(() => import("./pages/AdminCU"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const Creators = lazy(() => import("./pages/Creators"));
const NotFound = lazy(() => import("./pages/not-found"));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center shadow-lg shadow-primary/20 animate-pulse mb-4">
        <Flame className="w-6 h-6 text-white" />
      </div>
      <p className="text-muted-foreground font-medium animate-pulse">Loading...</p>
    </div>
  );
}

function PageTracker() {
  const [location] = useLocation();
  useEffect(() => {
    const visitorId = localStorage.getItem("cu_visitor_id") || (() => {
      const id = Math.random().toString(36).slice(2);
      localStorage.setItem("cu_visitor_id", id);
      return id;
    })();
    fetch("/api/cu/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: location, visitor_id: visitorId, referrer: document.referrer }),
    }).catch(() => {});
  }, [location]);
  return null;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <PageTracker />
          <Layout>
            <Suspense fallback={<PageLoader />}>
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/about" component={About} />
                <Route path="/case-studies" component={CaseStudies} />
                <Route path="/contact" component={Contact} />
                <Route path="/book-a-call" component={BookACall} />
                <Route path="/pricing" component={Pricing} />
                <Route path="/faq" component={FAQ} />
                <Route path="/signup" component={Signup} />
                <Route path="/login" component={Login} />
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/campaigns" component={Campaigns} />
                <Route path="/submit" component={Submit} />
                <Route path="/creators" component={Creators} />
                <Route path="/admin-login" component={AdminLogin} />
                <Route path="/admin-cu" component={AdminCU} />
                <Route component={NotFound} />
              </Switch>
            </Suspense>
          </Layout>
        </WouterRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
