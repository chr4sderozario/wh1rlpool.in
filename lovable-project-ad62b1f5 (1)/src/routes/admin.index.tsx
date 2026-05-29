import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/products";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const { data } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [{ count: orderCount }, { count: productCount }, { data: revenue }] = await Promise.all([
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("total"),
      ]);
      const sum = (revenue ?? []).reduce((n, o: any) => n + (o.total ?? 0), 0);
      return { orderCount: orderCount ?? 0, productCount: productCount ?? 0, revenue: sum };
    },
  });

  return (
    <div className="grid sm:grid-cols-3 gap-4">
      <Stat label="Total Orders" value={data?.orderCount ?? 0} />
      <Stat label="Products" value={data?.productCount ?? 0} />
      <Stat label="Revenue" value={formatINR(data?.revenue ?? 0)} />
      <div className="sm:col-span-3 mt-4 flex gap-3">
        <Link to="/admin/products" className="bg-electric text-electric-foreground px-5 py-3 text-sm font-bold uppercase tracking-widest">
          Manage Products
        </Link>
        <Link to="/admin/orders" className="border border-border px-5 py-3 text-sm font-bold uppercase tracking-widest hover:border-electric">
          View Orders
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="border border-border bg-card p-6">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-display text-4xl mt-2">{value}</div>
    </div>
  );
}
