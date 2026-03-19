import { useState } from "react";
import { useLocation } from "wouter";
import { Shield } from "lucide-react";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/cu/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError("Invalid username or password");
        setLoading(false);
        return;
      }
      localStorage.setItem("cu_admin_token", data.token);
      navigate("/admin-cu");
    } catch {
      setError("Connection error. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/20 px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-display font-bold">Admin Login</h1>
          <p className="text-sm text-muted-foreground mt-1">Clippers University — Staff Only</p>
        </div>

        <div className="bg-white border border-border rounded-2xl p-8 shadow-xl">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Username</label>
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-sm transition-colors"
                placeholder="Enter username"
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-border rounded-xl px-4 py-3 outline-none focus:border-primary text-sm transition-colors"
                placeholder="Enter password"
                autoComplete="current-password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity mt-2"
            >
              {loading ? "Verifying..." : "Access Dashboard"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Restricted access · Clippers University Admin
        </p>
      </div>
    </div>
  );
}
