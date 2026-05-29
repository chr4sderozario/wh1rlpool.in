import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Wh1rlpool" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/login" });
    else if (!isAdmin) navigate({ to: "/" });
  }, [user, isAdmin, loading, navigate]);

  if (loading || !user || !isAdmin) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-24 text-center text-muted-foreground">Checking access...</main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-4xl lg:text-5xl">Admin Console</h1>
          <span className="text-xs uppercase tracking-widest text-electric">● Live</span>
        </div>
        <nav className="flex gap-1 border-b border-border mb-8">
          <TabLink to="/admin">Dashboard</TabLink>
          <TabLink to="/admin/products">Products</TabLink>
          <TabLink to="/admin/orders">Orders</TabLink>
        </nav>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

function TabLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: true }}
      activeProps={{ className: "border-electric text-electric" }}
      className="px-4 py-3 text-sm uppercase tracking-widest text-muted-foreground border-b-2 border-transparent hover:text-foreground"
    >
      {children}
    </Link>
  );
}
