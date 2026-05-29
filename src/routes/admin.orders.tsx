import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/products";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/orders")({
  component: OrdersAdmin,
});

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

function OrdersAdmin() {
  const qc = useQueryClient();
  const { data: orders = [] } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Order updated");
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  if (orders.length === 0) {
    return <div className="border border-border p-8 text-center text-muted-foreground text-sm">No orders yet.</div>;
  }

  return (
    <div className="space-y-4">
      {orders.map((o) => (
        <div key={o.id} className="border border-border bg-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="font-display text-lg">{o.order_number}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {new Date(o.created_at).toLocaleString("en-IN")} · {o.payment_method.toUpperCase()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-electric">{formatINR(o.total)}</div>
              <select
                value={o.status}
                onChange={(e) => updateStatus.mutate({ id: o.id, status: e.target.value })}
                className="mt-2 bg-input border border-border px-2 py-1 text-xs uppercase tracking-widest"
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Customer</div>
              <div>{o.full_name}</div>
              <div className="text-muted-foreground text-xs">{o.email} · {o.phone}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Ship To</div>
              <div>{o.address}, {o.city}, {o.state} - {o.pincode}</div>
            </div>
          </div>
          <div className="mt-4 border-t border-border pt-3">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Items</div>
            <ul className="space-y-1 text-sm">
              {(o.items as any[]).map((it, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{it.name} · Size {it.size} × {it.quantity}</span>
                  <span>{formatINR(it.price * it.quantity)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
