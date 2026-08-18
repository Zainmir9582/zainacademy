import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, ShieldAlert, CheckCircle, GraduationCap } from "lucide-react";
import { AuthService, FIREBASE_ACTIVE } from "../../firebase/db";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Listen to real auth state changes to avoid race conditions on logout
    const unsubscribe = AuthService.onAuthChanged((user) => {
      if (user) {
        navigate("/admin/dashboard");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email.trim() || !password) {
      setError("Please fill out all credentials.");
      return;
    }

    setLoading(true);

    try {
      await AuthService.login(email.trim(), password);
      navigate("/admin/dashboard");
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err?.message || "Invalid credentials. Please double check.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden">
      {/* Abstract background blur */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl -ml-20 -mb-20"></div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center gap-2 text-white">
            <div className="bg-emerald-500 text-slate-950 p-2.5 rounded-xl">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="font-display text-2xl font-extrabold tracking-tight">Zain Academy</span>
          </Link>
          <h2 className="font-display font-extrabold text-white text-3xl tracking-tight">
            Admin Portal Access
          </h2>
          <p className="text-slate-400 text-sm font-light">
            Authenticate to manage faculty records, programs, notifications, and settings.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6">
          {/* Status Badge */}
          <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 border ${
            FIREBASE_ACTIVE 
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
              : "bg-amber-500/10 border-amber-500/20 text-amber-400"
          }`}>
            {FIREBASE_ACTIVE ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Cloud Mode: Authenticating against live Firebase database.</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-4.5 h-4.5 text-amber-400 shrink-0" />
                <div>
                  <p className="font-semibold mb-0.5">Sandbox Mode Active</p>
                  <p className="opacity-80">Login with your administrator credentials.</p>
                </div>
              </>
            )}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg font-medium leading-relaxed">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="login-email" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 w-4.5 h-4.5 text-slate-500" />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@zainacademy.com"
                  className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-brand-teal focus:bg-slate-950 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="login-password" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Secret Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4.5 h-4.5 text-slate-500" />
                <input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-brand-teal focus:bg-slate-950 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-brand-teal hover:bg-teal-500 text-white font-bold rounded-xl text-sm tracking-wide shadow-lg shadow-teal-900/10 hover:shadow-teal-900/30 transition-all disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign Into Console"}
            </button>
          </form>
        </div>

        <div className="text-center">
          <Link to="/" className="text-slate-500 hover:text-slate-300 text-xs font-medium">
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
