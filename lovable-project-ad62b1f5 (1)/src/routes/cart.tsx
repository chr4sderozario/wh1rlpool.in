import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useCart } from "@/lib/cart-store";
import { formatINR } from "@/lib/products";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Wh1rlpool" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());
  const updateQty = useCart((s) => s.updateQty);
  const removeItem = useCart((s) => s.removeItem);
  const shipping = subtotal >= 1499 || subtotal === 0 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 lg:px-8 py-12 lg:py-16">
        <h1 className="font-display text-4xl lg:text-6xl mb-8">Your Cart</h1>

        {items.length === 0 ? (
          <div className="border border-border bg-card p-16 text-center">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Link to="/" className="inline-block mt-6 bg-electric text-electric-foreground px-7 py-4 text-sm font-bold uppercase tracking-widest">
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((i) => (
                <div key={`${i.productId}-${i.size}`} className="flex gap-4 border border-border bg-card p-4">
                  <img src={i.image} alt={i.name} width={120} height={150} className="h-32 w-24 sm:h-40 sm:w-32 object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{i.team}</div>
                    <div className="font-medium text-sm leading-tight">{i.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">Size: {i.size}</div>
                    <div className="font-display text-lg mt-2">{formatINR(i.price)}</div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-border">
                        <button onClick={() => updateQty(i.productId, i.size, i.quantity - 1)} className="p-2"><Minus className="h-3 w-3" /></button>
                        <div className="w-8 text-center text-sm">{i.quantity}</div>
                        <button onClick={() => updateQty(i.productId, i.size, i.quantity + 1)} className="p-2"><Plus className="h-3 w-3" /></button>
                      </div>
                      <button onClick={() => removeItem(i.productId, i.size)} className="text-muted-foreground hover:text-destructive" aria-label="Remove">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="border border-border bg-card p-6 h-fit lg:sticky lg:top-32">
              <h2 className="font-display text-2xl mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <Row label="Subtotal" value={formatINR(subtotal)} />
                <Row label="Shipping" value={shipping === 0 ? "FREE" : formatINR(shipping)} />
                <div className="border-t border-border my-3" />
                <Row label="Total" value={formatINR(total)} bold />
              </div>
              <Link
                to="/checkout"
                className="mt-6 w-full bg-electric text-electric-foreground py-4 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 glow-electric"
              >
                Checkout <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="mt-3 text-xs text-muted-foreground text-center">
                UPI · Cards · Wallets · COD · Razorpay secured
              </div>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className={bold ? "font-display text-lg" : "text-muted-foreground"}>{label}</span>
      <span className={bold ? "font-display text-lg text-electric" : ""}>{value}</span>
    </div>
  );
}
