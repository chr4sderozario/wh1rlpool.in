import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Package, Truck, MapPin, Search } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/track")({
  validateSearch: (s: Record<string, unknown>) => ({ id: (s.id as string) || "" }),
  head: () => ({ meta: [{ title: "Track Order — Wh1rlpool" }] }),
  component: TrackPage,
});

const STEPS = [
  { icon: Check, label: "Order Placed", date: "Today, 11:42 AM" },
  { icon: Package, label: "Packed", date: "Today, 4:10 PM" },
  { icon: Truck, label: "Shipped", date: "Tomorrow" },
  { icon: MapPin, label: "Out for Delivery" },
  { icon: Check, label: "Delivered" },
];

function TrackPage() {
  const { id } = Route.useSearch();
  const [orderId, setOrderId] = useState(id);
  const [tracked, setTracked] = useState(!!id);
  const currentStep = 2;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="font-display text-4xl lg:text-6xl">Track Your Order</h1>
        <p className="mt-2 text-muted-foreground">Enter your order ID to see the latest status.</p>

        <form
          onSubmit={(e) => { e.preventDefault(); setTracked(!!orderId); }}
          className="mt-8 flex gap-2"
        >
          <input
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="e.g. WH3X9K2P"
            className="flex-1 bg-input border border-border px-4 py-3 text-sm focus:border-electric focus:outline-none uppercase tracking-wider"
          />
          <button type="submit" className="bg-electric text-electric-foreground px-6 py-3 text-sm font-bold uppercase tracking-widest inline-flex items-center gap-2">
            <Search className="h-4 w-4" /> Track
          </button>
        </form>

        {tracked && orderId && (
          <div className="mt-10 border border-border bg-card p-6 lg:p-8">
            <div className="flex items-baseline justify-between flex-wrap gap-2">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Order</div>
                <div className="font-display text-2xl">#{orderId.toUpperCase()}</div>
              </div>
              <div className="text-electric text-xs uppercase tracking-widest font-bold">In Transit</div>
            </div>

            <div className="mt-8 space-y-6">
              {STEPS.map((s, i) => {
                const done = i <= currentStep;
                return (
                  <div key={s.label} className="flex items-start gap-4">
                    <div className={`grid h-10 w-10 place-items-center rounded-full shrink-0 ${done ? "bg-electric text-electric-foreground glow-electric" : "bg-muted text-muted-foreground"}`}>
                      <s.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 pt-2">
                      <div className={`font-medium ${done ? "" : "text-muted-foreground"}`}>{s.label}</div>
                      {s.date && <div className="text-xs text-muted-foreground mt-0.5">{s.date}</div>}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-border text-sm text-muted-foreground">
              Estimated delivery: <span className="text-foreground font-medium">3–5 business days</span> via India Post / Delhivery.
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
