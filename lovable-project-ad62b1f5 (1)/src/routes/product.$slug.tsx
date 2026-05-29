import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Star, Truck, RefreshCw, ShieldCheck, Check, Plus, Minus } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ProductCard } from "@/components/site/ProductCard";
import { findProduct, formatINR, products } from "@/lib/products";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = findProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Wh1rlpool` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: loaderData.product.name },
          { property: "og:description", content: loaderData.product.description },
          { property: "og:url", content: `/product/${loaderData.product.slug}` },
          { property: "og:image", content: loaderData.product.image },
          { property: "og:type", content: "product" },
        ]
      : [],
    links: loaderData ? [{ rel: "canonical", href: `/product/${loaderData.product.slug}` }] : [],
    scripts: loaderData
      ? [{
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: loaderData.product.name,
            image: loaderData.product.image,
            description: loaderData.product.description,
            brand: { "@type": "Brand", name: "Wh1rlpool" },
            offers: {
              "@type": "Offer",
              priceCurrency: "INR",
              price: loaderData.product.price,
              availability: "https://schema.org/InStock",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: loaderData.product.rating,
              reviewCount: loaderData.product.reviewCount,
            },
          }),
        }]
      : [],
  }),
  component: ProductPage,
});

const SIZES = ["S", "M", "L", "XL", "XXL"];

function ProductPage() {
  const { product } = Route.useLoaderData();
  const [size, setSize] = useState("M");
  const [qty, setQty] = useState(1);
  const addItem = useCart((s) => s.addItem);
  const off = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAdd = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      team: product.team,
      image: product.image,
      price: product.price,
      size,
      quantity: qty,
    });
    toast.success(`${product.name} (${size}) added to cart`);
  };

  return (
    <>
      <Header />
      <main>
        <div className="mx-auto max-w-7xl px-4 lg:px-8 py-6 text-xs uppercase tracking-widest text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link> /{" "}
          <Link to="/category/$cat" params={{ cat: product.category }} className="hover:text-foreground">
            {product.category}
          </Link>{" "}
          / {product.team}
        </div>

        <div className="mx-auto max-w-7xl px-4 lg:px-8 grid lg:grid-cols-2 gap-8 lg:gap-16 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[product.image, product.image, product.image, product.image].map((src, i) => (
              <div key={i} className={`relative bg-card aspect-square overflow-hidden ${i === 0 ? "sm:col-span-2 aspect-[4/5]" : ""}`}>
                <img src={src} alt={`${product.name} view ${i + 1}`} width={800} height={1000} loading={i === 0 ? "eager" : "lazy"} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>

          <div className="lg:sticky lg:top-32 lg:self-start">
            <div className="text-xs uppercase tracking-[0.3em] text-electric mb-2">{product.team}</div>
            <h1 className="font-display text-4xl lg:text-5xl">{product.name}</h1>
            <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(product.rating) ? "fill-electric text-electric" : "text-muted"}`} />
                ))}
              </div>
              {product.rating} · {product.reviewCount.toLocaleString("en-IN")} reviews
            </div>

            <div className="flex items-baseline gap-3 mt-6">
              <div className="font-display text-4xl">{formatINR(product.price)}</div>
              <div className="text-muted-foreground line-through">{formatINR(product.mrp)}</div>
              <div className="text-electric text-sm font-bold">{off}% OFF</div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">Inclusive of all taxes</div>

            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs uppercase tracking-widest">Select Size</div>
                <button className="text-xs uppercase tracking-widest text-electric">Size Guide</button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`py-3 border text-sm font-medium transition-colors ${
                      size === s
                        ? "border-electric bg-electric text-electric-foreground"
                        : "border-border hover:border-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center border border-border">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3 hover:bg-accent" aria-label="Decrease">
                  <Minus className="h-3 w-3" />
                </button>
                <div className="w-10 text-center text-sm">{qty}</div>
                <button onClick={() => setQty((q) => q + 1)} className="p-3 hover:bg-accent" aria-label="Increase">
                  <Plus className="h-3 w-3" />
                </button>
              </div>
              <button
                onClick={handleAdd}
                className="flex-1 bg-electric text-electric-foreground py-4 text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity glow-electric"
              >
                Add to Cart
              </button>
            </div>
            <Link
              to="/checkout"
              onClick={handleAdd}
              className="mt-3 block w-full text-center border border-foreground py-4 text-sm font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors"
            >
              Buy Now
            </Link>

            <div className="mt-8 space-y-3 border-t border-border pt-6 text-sm">
              <div className="flex gap-3"><Truck className="h-4 w-4 text-electric shrink-0 mt-0.5" /><div><b className="font-medium">Free shipping</b> across India on prepaid orders</div></div>
              <div className="flex gap-3"><RefreshCw className="h-4 w-4 text-electric shrink-0 mt-0.5" /><div><b className="font-medium">7-day returns</b> for unworn jerseys with tags</div></div>
              <div className="flex gap-3"><ShieldCheck className="h-4 w-4 text-electric shrink-0 mt-0.5" /><div><b className="font-medium">100% authentic</b> stitching, fabric & crest</div></div>
              <div className="flex gap-3"><Check className="h-4 w-4 text-electric shrink-0 mt-0.5" /><div><b className="font-medium">COD available</b> across 27,000+ pincodes</div></div>
            </div>

            <div className="mt-8 border-t border-border pt-6">
              <h2 className="font-display text-2xl">Description</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>

        <section className="mx-auto max-w-7xl px-4 lg:px-8 py-16 border-t border-border/40">
          <h2 className="font-display text-3xl lg:text-4xl mb-8">You might also like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-x-6">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
