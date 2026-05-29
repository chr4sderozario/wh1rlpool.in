import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ProductCard } from "@/components/site/ProductCard";
import { byCategory, categories, type Category } from "@/lib/products";

export const Route = createFileRoute("/category/$cat")({
  loader: ({ params }) => {
    const cat = categories.find((c) => c.slug === params.cat);
    if (!cat) throw notFound();
    return { cat };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.cat.title} — Wh1rlpool` },
          { name: "description", content: `Shop ${loaderData.cat.title.toLowerCase()} at Wh1rlpool. ${loaderData.cat.description}.` },
          { property: "og:title", content: `${loaderData.cat.title} — Wh1rlpool` },
          { property: "og:url", content: `/category/${loaderData.cat.slug}` },
        ]
      : [],
    links: loaderData ? [{ rel: "canonical", href: `/category/${loaderData.cat.slug}` }] : [],
  }),
  component: CategoryPage,
});

function CategoryPage() {
  const { cat } = Route.useLoaderData();
  const items = byCategory(cat.slug as Category);
  return (
    <>
      <Header />
      <main>
        <section className="border-b border-border/40 bg-card">
          <div className="mx-auto max-w-7xl px-4 lg:px-8 py-16 lg:py-24">
            <div className="text-xs uppercase tracking-[0.3em] text-electric mb-3">
              <Link to="/" className="hover:text-foreground">Home</Link> / Category
            </div>
            <h1 className="font-display text-5xl lg:text-7xl">{cat.title}</h1>
            <p className="mt-3 text-muted-foreground max-w-xl">{cat.description}</p>
            <div className="mt-4 text-sm text-muted-foreground">{items.length} products</div>
          </div>
        </section>
        <div className="mx-auto max-w-7xl px-4 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-x-6">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
