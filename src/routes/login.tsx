import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign In — Wh1rlpool" }, { name: "robots", content: "noindex" }] }),
  component: LoginPage,
});

const ADMIN_EMAIL = "sohanjohn@wh1rlpool.com";

function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup" | "admin">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate({ to: isAdmin ? "/admin" : "/" });
    }
  }, [user, isAdmin, navigate]);

  // One-time admin bootstrap (idempotent)
  useEffect(() => {
    fetch("/api/public/bootstrap-admin").catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        toast.success("Account created! Signing you in...");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
      }
    } catch (err: any) {
      toast.error(err.message ?? "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Ensure admin user exists before attempting sign-in
      await fetch("/api/public/bootstrap-admin").catch(() => {});
      const { error } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password: adminPassword,
      });
      if (error) throw error;
      toast.success("Welcome, Admin");
      navigate({ to: "/admin" });
    } catch (err: any) {
      toast.error("Invalid admin password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="mx-auto max-w-md px-4 py-16 lg:py-24">
        <h1 className="font-display text-4xl lg:text-5xl text-center">
          {mode === "admin" ? "Admin Access" : mode === "login" ? "Welcome Back" : "Join the Tribe"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground text-center">
          {mode === "admin"
            ? "Restricted area · enter admin password"
            : mode === "login"
            ? "Sign in to continue"
            : "Create an account to track orders & faster checkout"}
        </p>

        {mode === "admin" ? (
          <form className="mt-8 space-y-4 border border-electric/40 bg-card p-6" onSubmit={handleAdminLogin}>
            <Field
              label="Admin Password"
              type="password"
              required
              autoFocus
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-electric text-electric-foreground py-3 text-sm font-bold uppercase tracking-widest glow-electric disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Enter Admin Console"}
            </button>
          </form>
        ) : (
          <form className="mt-8 space-y-4 border border-border bg-card p-6" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <Field label="Full Name" type="text" required value={name} onChange={(e) => setName(e.target.value)} />
            )}
            <Field label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <Field label="Password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-electric text-electric-foreground py-3 text-sm font-bold uppercase tracking-widest glow-electric disabled:opacity-50"
            >
              {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>
        )}

        {mode !== "admin" && (
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" ? "New here?" : "Already a member?"}{" "}
            <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-electric font-medium">
              {mode === "login" ? "Create account" : "Sign in"}
            </button>
          </div>
        )}

        <div className="mt-6 flex items-center gap-3 text-[10px] uppercase tracking-widest text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          <span>Staff</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <button
          type="button"
          onClick={() => setMode(mode === "admin" ? "login" : "admin")}
          className="mt-4 w-full border border-electric/40 bg-transparent py-3 text-xs font-bold uppercase tracking-widest text-electric hover:bg-electric/10 transition-colors"
        >
          {mode === "admin" ? "← Customer Sign In" : "🛡 Admin Login"}
        </button>

        <Link to="/" className="mt-8 block text-center text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
          ← Back to home
        </Link>
      </main>
      <Footer />
    </>
  );
}

function Field({ label, ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <input {...rest} className="mt-1.5 w-full bg-input border border-border px-3 py-3 text-sm focus:border-electric focus:outline-none" />
    </label>
  );
}
