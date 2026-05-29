import { createFileRoute, notFound } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

const POLICIES = {
  shipping: {
    title: "Shipping Policy",
    body: [
      ["Coverage", "We ship across India to 27,000+ pincodes via India Post, Delhivery, BlueDart, and XpressBees."],
      ["Delivery time", "Metros: 2–4 business days. Tier 2/3: 4–7 business days. Remote: 7–10 days."],
      ["Charges", "FREE shipping on prepaid orders above ₹1499. Flat ₹99 below that. ₹50 extra for COD."],
      ["Order processing", "Orders confirmed before 2 PM ship the same day from our Mumbai warehouse."],
      ["Tracking", "Tracking link sent via SMS & email within 24 hours of dispatch."],
    ],
  },
  refund: {
    title: "Refund & Return Policy",
    body: [
      ["7-day returns", "Unworn jerseys with all tags intact can be returned within 7 days of delivery."],
      ["Refund timeline", "Once we receive and inspect the item, refund is initiated within 48 hours. Bank credit takes 5–7 business days."],
      ["Player-edition prints", "Custom player-name and number prints are non-returnable unless defective."],
      ["Defective items", "Got the wrong product or a defect? Email support@wh1rlpool.in within 48 hours with photos — we'll arrange a free pickup and a fresh replacement."],
      ["Refund mode", "Refunds go back to the original payment method (UPI, card, wallet). For COD orders, refund is sent via bank transfer."],
    ],
  },
} as const;

export const Route = createFileRoute("/policy/$type")({
  loader: ({ params }) => {
    const p = POLICIES[params.type as keyof typeof POLICIES];
    if (!p) throw notFound();
    return { policy: p, type: params.type };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.policy.title} — Wh1rlpool` },
      { name: "description", content: `${loaderData.policy.title} for Wh1rlpool orders across India.` },
      { property: "og:url", content: `/policy/${loaderData.type}` },
    ] : [],
    links: loaderData ? [{ rel: "canonical", href: `/policy/${loaderData.type}` }] : [],
  }),
  component: PolicyPage,
});

function PolicyPage() {
  const { policy } = Route.useLoaderData();
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="font-display text-4xl lg:text-6xl">{policy.title}</h1>
        <div className="mt-10 space-y-8">
          {policy.body.map((row: readonly [string, string]) => (
            <div key={row[0]}>
              <h2 className="font-display text-2xl text-electric">{row[0]}</h2>
              <p className="mt-2 text-muted-foreground leading-relaxed">{row[1]}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
