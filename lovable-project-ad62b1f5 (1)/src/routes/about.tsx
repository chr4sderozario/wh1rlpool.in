import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import cultureImg from "@/assets/culture-banner.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Wh1rlpool" },
      { name: "description", content: "Wh1rlpool is India's home for authentic football jerseys at honest prices. Built by fans, for fans." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <section className="relative h-[50vh] min-h-[360px] overflow-hidden">
          <img src={cultureImg} alt="Football culture" width={1600} height={900} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-8 h-full flex items-end pb-12">
            <h1 className="font-display text-5xl lg:text-8xl leading-none">BUILT BY <span className="text-electric">FANS.</span></h1>
          </div>
        </section>
        <section className="mx-auto max-w-3xl px-4 py-16 space-y-6 text-lg leading-relaxed text-muted-foreground">
          <p>Wh1rlpool started with one question: why does it cost a month's rent to wear your favourite team?</p>
          <p>We're a small team of football obsessives based in Mumbai. We source authentic-grade jerseys directly, cut out the middlemen, and ship them across India at prices that don't sideline anyone.</p>
          <p>From Real Madrid to Argentina, from Pep's treble Barça to Vini Jr's new era — if it's on the pitch, it's in our drop.</p>
          <p className="text-foreground font-medium">Honest pricing. Authentic kits. Pan-India shipping. That's the playbook.</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
