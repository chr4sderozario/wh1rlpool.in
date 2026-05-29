import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Truck, ShieldCheck, RefreshCw, Star } from "lucide-react";
import heroImg from "@/assets/hero-stadium.jpg";
import cultureImg from "@/assets/culture-banner.jpg";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ProductCard } from "@/components/site/ProductCard";
import { Section } from "@/components/site/Section";
import { featured, bestSellers, newArrivals, categories } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Wh1rlpool — Authentic Football Jerseys in India" },
      { name: "description", content: "Premium football jerseys at honest prices. Real Madrid, Barcelona, United, PSG, Argentina, Brazil. Pan-India delivery with COD & Razorpay." },
      { property: "og:title", content: "Wh1rlpool — Authentic Football Jerseys" },
      { property: "og:description", content: "Premium football jerseys at honest prices, shipped pan-India." },
      { property: "og:url", content: "/" },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "preload", as: "image", href: heroImg, fetchpriority: "high" } as never,
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Categories />
        <Section eyebrow="Drop 01" title="Featured Drops" link={{ to: "/category/club", label: "Shop All" }}>
          <Grid items={featured()} />
        </Section>
        <CultureBanner />
        <Section eyebrow="The Heat" title="Best Sellers" link={{ to: "/category/club", label: "Shop All" }}>
          <Grid items={bestSellers()} />
        </Section>
        <Trust />
        <Section eyebrow="Just In" title="New Arrivals" link={{ to: "/category/national", label: "Shop All" }}>
          <Grid items={newArrivals()} />
        </Section>
        <Reviews />
      </main>
      <Footer />
    </>
  );
}

function Hero() {
  return (
    <section className="relative h-[88vh] min-h-[600px] overflow-hidden">
      <img
        src={heroImg}
        alt="Football player in stadium under electric blue lights"
        width={1920}
        height={1280}
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/60" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-8 h-full flex flex-col justify-end pb-16 lg:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <div className="text-xs uppercase tracking-[0.3em] text-electric mb-4">
            Season 24 / 25 · Now Live
          </div>
          <h1 className="font-display text-6xl sm:text-7xl lg:text-9xl leading-[0.85] tracking-tight">
            WEAR THE
            <br />
            <span className="text-electric">BADGE.</span>
            <br />
            <span className="text-stroke">OWN THE GAME.</span>
          </h1>
          <p className="mt-6 max-w-md text-base lg:text-lg text-muted-foreground">
            Authentic football jerseys, honest pricing, shipped across India.
            Built for fans, not flippers.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/category/club"
              className="group inline-flex items-center gap-2 bg-electric text-electric-foreground px-7 py-4 text-sm font-bold uppercase tracking-widest hover:gap-4 transition-all glow-electric"
            >
              Shop Jerseys <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/category/player"
              className="inline-flex items-center gap-2 border border-foreground/30 px-7 py-4 text-sm font-bold uppercase tracking-widest hover:border-electric hover:text-electric transition-colors"
            >
              Player Editions
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Marquee() {
  const text = "★ AUTHENTIC FIT ★ PAN-INDIA SHIPPING ★ COD AVAILABLE ★ RAZORPAY SECURED ★ 7-DAY RETURNS ★";
  return (
    <div className="border-y border-border/40 bg-card overflow-hidden py-4">
      <div className="flex whitespace-nowrap marquee">
        <div className="font-display text-2xl tracking-wider px-8">{text.repeat(4)}</div>
        <div className="font-display text-2xl tracking-wider px-8" aria-hidden>{text.repeat(4)}</div>
      </div>
    </div>
  );
}

function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-4 lg:px-8 py-16">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((c) => (
          <Link
            key={c.slug}
            to="/category/$cat"
            params={{ cat: c.slug }}
            className="group relative overflow-hidden aspect-[4/5] sm:aspect-[3/4] bg-card border border-border/50 hover:border-electric transition-colors p-6 flex flex-col justify-between"
          >
            <div className="text-xs uppercase tracking-[0.3em] text-electric">0{categories.indexOf(c) + 1}</div>
            <div>
              <h3 className="font-display text-3xl lg:text-4xl">{c.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{c.description}</p>
              <div className="mt-4 text-xs uppercase tracking-widest text-foreground group-hover:text-electric transition-colors inline-flex items-center gap-2">
                Shop <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Grid({ items }: { items: ReturnType<typeof featured> }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-x-6">
      {items.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

function CultureBanner() {
  return (
    <section className="relative h-[60vh] min-h-[400px] overflow-hidden my-16">
      <img src={cultureImg} alt="Football culture in India" width={1600} height={900} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-8 h-full flex items-center">
        <div className="max-w-xl">
          <div className="text-xs uppercase tracking-[0.3em] text-electric mb-4">Culture</div>
          <h2 className="font-display text-5xl lg:text-7xl leading-none">
            FOR THE
            <br />
            <span className="text-electric">10TH MAN.</span>
          </h2>
          <p className="mt-6 text-muted-foreground max-w-md">
            From gully matches in Mumbai to fan parks in Kolkata. We kit out India's
            football tribe — at prices that don't bench you.
          </p>
        </div>
      </div>
    </section>
  );
}

function Trust() {
  const items = [
    { icon: Truck, title: "Free India Shipping", desc: "On orders above ₹1499" },
    { icon: ShieldCheck, title: "Razorpay Secured", desc: "UPI · Cards · Wallets" },
    { icon: RefreshCw, title: "Easy Returns", desc: "7-day no-question returns" },
    { icon: Star, title: "4.8 / 5 Rated", desc: "12,000+ happy fans" },
  ];
  return (
    <section className="border-y border-border/40 bg-card">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-12 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((i) => (
          <div key={i.title} className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center bg-electric/10 text-electric rounded-full shrink-0">
              <i.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display text-lg leading-tight">{i.title}</div>
              <div className="text-xs text-muted-foreground">{i.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Reviews() {
  const reviews = [
    { name: "Arjun K.", city: "Mumbai", text: "Real Madrid kit fit perfectly. Quality is top tier for the price. Delivered in 3 days.", rating: 5 },
    { name: "Rohan S.", city: "Bangalore", text: "Messi player edition is unreal. Stitching, print, everything legit. Will order again.", rating: 5 },
    { name: "Aditya M.", city: "Delhi", text: "Bought the Brazil retro. COD worked smoothly. Wh1rlpool is the real deal.", rating: 5 },
    { name: "Karan P.", city: "Pune", text: "Better than what I expected at this price. Fabric is breathable, perfect for matchdays.", rating: 5 },
  ];
  return (
    <Section eyebrow="Voices" title="From The Tribe">
      <div className="grid gap-4 lg:grid-cols-4">
        {reviews.map((r) => (
          <div key={r.name} className="border border-border/50 bg-card p-6">
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: r.rating }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-electric text-electric" />
              ))}
            </div>
            <p className="text-sm leading-relaxed">"{r.text}"</p>
            <div className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">
              {r.name} · {r.city}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
