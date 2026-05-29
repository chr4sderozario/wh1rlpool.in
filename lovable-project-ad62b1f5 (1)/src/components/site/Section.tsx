import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

export function Section({
  eyebrow,
  title,
  link,
  children,
}: {
  eyebrow?: string;
  title: string;
  link?: { to: string; label: string };
  children: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 lg:px-8 py-16 lg:py-24">
      <div className="flex items-end justify-between mb-8 lg:mb-12">
        <div>
          {eyebrow && (
            <div className="text-xs uppercase tracking-[0.3em] text-electric mb-2">{eyebrow}</div>
          )}
          <h2 className="font-display text-4xl lg:text-6xl">{title}</h2>
        </div>
        {link && (
          <Link
            to={link.to}
            className="hidden sm:inline-block text-sm uppercase tracking-widest text-muted-foreground hover:text-electric transition-colors border-b border-border hover:border-electric pb-1"
          >
            {link.label} →
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
