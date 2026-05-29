import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Instagram } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Wh1rlpool" },
      { name: "description", content: "Get in touch with Wh1rlpool. Email, WhatsApp, and Instagram support." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-16">
        <h1 className="font-display text-5xl lg:text-7xl">Get In Touch</h1>
        <p className="mt-3 text-muted-foreground max-w-xl">Questions about sizing, orders, or shipping? We reply within 24 hours.</p>

        <div className="mt-12 grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Info icon={Mail} title="Email" value="support@wh1rlpool.in" />
            <Info icon={Phone} title="WhatsApp" value="+91 90000 00000" />
            <Info icon={Instagram} title="Instagram" value="@wh1rlpool.in" />
            <Info icon={MapPin} title="Warehouse" value="Andheri East, Mumbai 400069" />
          </div>

          <form className="border border-border bg-card p-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <Field label="Name" required />
            <Field label="Email" type="email" required />
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Message</span>
              <textarea rows={5} required className="mt-1.5 w-full bg-input border border-border px-3 py-3 text-sm focus:border-electric focus:outline-none" />
            </label>
            <button type="submit" className="w-full bg-electric text-electric-foreground py-3 text-sm font-bold uppercase tracking-widest glow-electric">Send Message</button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Info({ icon: Icon, title, value }: { icon: React.ComponentType<{ className?: string }>; title: string; value: string }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="grid h-12 w-12 place-items-center bg-electric/10 text-electric rounded-full"><Icon className="h-5 w-5" /></div>
      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{title}</div>
        <div className="font-medium mt-0.5">{value}</div>
      </div>
    </div>
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
