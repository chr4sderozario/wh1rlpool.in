import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useCart } from "@/lib/cart-store";
import { formatINR } from "@/lib/products";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Wh1rlpool" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

const METHODS = [
  { id: "upi", label: "UPI", desc: "GPay, PhonePe, Paytm" },
  { id: "card", label: "Card", desc: "Credit / Debit" },
  { id: "wallet", label: "Wallet", desc: "Paytm, Amazon Pay" },
  { id: "cod", label: "Cash on Delivery", desc: "Pay when delivered" },
];

function CheckoutPage() {
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());
  const clear = useCart((s) => s.clear);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [method, setMethod] = useState("upi");
  const [loading, setLoading] = useState(false);

  const shipping = subtotal >= 1499 ? 0 : 99;
  const total = subtotal + shipping;

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    const fd = new FormData(e.target as HTMLFormElement);
    const orderNumber = "WH" + Math.random().toString(36).slice(2, 9).toUpperCase();
    const { error } = await supabase.from("orders").insert({
      order_number: orderNumber,
      user_id: user?.id ?? null,
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      full_name: `${fd.get("firstName") ?? ""} ${fd.get("lastName") ?? ""}`.trim(),
      address: String(fd.get("address") ?? ""),
      city: String(fd.get("city") ?? ""),
      state: String(fd.get("state") ?? ""),
      pincode: String(fd.get("pincode") ?? ""),
      payment_method: method,
      subtotal,
      shipping,
      total,
      items: items as any,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    clear();
    toast.success(`Order ${orderNumber} placed!`);
    navigate({ to: "/track", search: { id: orderNumber } });
  };

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 lg:px-8 py-12 lg:py-16">
        <h1 className="font-display text-4xl lg:text-6xl mb-8">Checkout</h1>

        <form onSubmit={placeOrder} className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card title="Contact">
              <div className="grid sm:grid-cols-2 gap-3">
                <Input label="Email" name="email" type="email" required />
                <Input label="Phone" name="phone" type="tel" required pattern="[0-9]{10}" placeholder="10-digit mobile" />
              </div>
            </Card>

            <Card title="Shipping Address">
              <div className="grid sm:grid-cols-2 gap-3">
                <Input label="First Name" name="firstName" required />
                <Input label="Last Name" name="lastName" required />
                <Input label="Address" name="address" required className="sm:col-span-2" />
                <Input label="City" name="city" required />
                <Input label="State" name="state" required />
                <Input label="Pincode" name="pincode" required pattern="[0-9]{6}" />
                <Input label="Country" defaultValue="India" disabled />
              </div>
            </Card>

            <Card title="Payment Method">
              <div className="grid sm:grid-cols-2 gap-3">
                {METHODS.map((m) => (
                  <label
                    key={m.id}
                    className={`border p-4 cursor-pointer transition-colors ${
                      method === m.id ? "border-electric bg-electric/5" : "border-border hover:border-foreground"
                    }`}
                  >
                    <input type="radio" name="method" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} className="sr-only" />
                    <div className="font-medium">{m.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">{m.desc}</div>
                  </label>
                ))}
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                Powered by Razorpay. Demo checkout — connect Lovable Cloud to enable live payments.
              </div>
            </Card>
          </div>

          <aside className="border border-border bg-card p-6 h-fit lg:sticky lg:top-32">
            <h2 className="font-display text-2xl mb-4">Summary</h2>
            <div className="space-y-3 max-h-64 overflow-auto">
              {items.map((i) => (
                <div key={`${i.productId}-${i.size}`} className="flex gap-3 text-sm">
                  <img src={i.image} alt={i.name} width={48} height={60} className="h-16 w-12 object-cover" />
                  <div className="flex-1">
                    <div className="font-medium leading-tight text-xs">{i.name}</div>
                    <div className="text-xs text-muted-foreground">Size {i.size} · Qty {i.quantity}</div>
                  </div>
                  <div className="text-sm">{formatINR(i.price * i.quantity)}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-border my-4" />
            <div className="space-y-2 text-sm">
              <Row label="Subtotal" value={formatINR(subtotal)} />
              <Row label="Shipping" value={shipping === 0 ? "FREE" : formatINR(shipping)} />
              <div className="border-t border-border my-2" />
              <div className="flex justify-between">
                <span className="font-display text-lg">Total</span>
                <span className="font-display text-lg text-electric">{formatINR(total)}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || items.length === 0}
              className="mt-6 w-full bg-electric text-electric-foreground py-4 text-sm font-bold uppercase tracking-widest disabled:opacity-50 glow-electric"
            >
              {loading ? "Processing..." : `Place Order · ${formatINR(total)}`}
            </button>
            <Link to="/cart" className="mt-3 block text-center text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
              ← Back to cart
            </Link>
          </aside>
        </form>
      </main>
      <Footer />
    </>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border bg-card p-6">
      <h2 className="font-display text-2xl mb-4">{title}</h2>
      {children}
    </div>
  );
}
function Input({ label, className = "", ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <input {...rest} className="mt-1.5 w-full bg-input border border-border px-3 py-3 text-sm focus:border-electric focus:outline-none" />
    </label>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{label}</span><span>{value}</span></div>;
}
