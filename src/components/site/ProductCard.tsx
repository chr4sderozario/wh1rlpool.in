import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import type { Product } from "@/lib/products";
import { formatINR } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const off = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  return (
    <Link
      to="/product/$slug"
      params={{ slug: product.slug }}
      className="group block"
    >
      <div className="relative overflow-hidden bg-card aspect-[4/5]">
        {product.badge && (
          <div className="absolute top-3 left-3 z-10 bg-electric text-electric-foreground text-[10px] font-bold tracking-wider px-2 py-1 uppercase">
            {product.badge}
          </div>
        )}
        <img
          src={product.image}
          alt={product.name}
          width={800}
          height={1000}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 inset-x-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
          <div className="bg-electric text-electric-foreground text-center text-xs font-bold uppercase tracking-wider py-2.5">
            Quick View
          </div>
        </div>
      </div>
      <div className="pt-4 space-y-1">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{product.team}</div>
        <h3 className="font-sans text-sm font-medium leading-tight">{product.name}</h3>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Star className="h-3 w-3 fill-electric text-electric" />
          {product.rating} · {product.reviewCount.toLocaleString("en-IN")} reviews
        </div>
        <div className="flex items-baseline gap-2 pt-1">
          <span className="font-display text-lg">{formatINR(product.price)}</span>
          <span className="text-xs text-muted-foreground line-through">{formatINR(product.mrp)}</span>
          <span className="text-xs text-electric font-medium">{off}% off</span>
        </div>
      </div>
    </Link>
  );
}
