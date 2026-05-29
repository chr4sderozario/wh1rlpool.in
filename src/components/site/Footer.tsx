import { Link } from "@tanstack/react-router";
import { Instagram, Twitter, Youtube, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card mt-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-16">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="font-display text-3xl tracking-wider">
              WH<span className="text-electric">1</span>RLPOOL
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground leading-relaxed">
              Authentic football jerseys at honest prices. Shipped pan-India from our Mumbai warehouse.
              Built for the streets, made for the matchday.
            </p>
            <div className="mt-6 flex gap-2">
              {[Instagram, Twitter, Youtube, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-10 w-10 place-items-center rounded-full border border-border hover:border-electric hover:text-electric transition-colors"
                  aria-label="Social"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol
            title="Shop"
            links={[
              { to: "/category/club", label: "Club Jerseys" },
              { to: "/category/national", label: "National Teams" },
              { to: "/category/retro", label: "Retro" },
              { to: "/category/player", label: "Player Editions" },
            ]}
          />
          <FooterCol
            title="Help"
            links={[
              { to: "/policy/shipping", label: "Shipping Policy" },
              { to: "/policy/refund", label: "Refund Policy" },
              { to: "/track", label: "Track Order" },
              { to: "/contact", label: "Contact" },
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              { to: "/about", label: "About" },
              { to: "/contact", label: "Contact" },
              { to: "/policy/shipping", label: "Shipping" },
              { to: "/policy/refund", label: "Refunds" },
            ]}
          />
        </div>

        <div className="mt-16 pt-8 border-t border-border/40 flex flex-col sm:flex-row gap-3 justify-between text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Wh1rlpool. All rights reserved.</div>
          <div className="flex gap-4">
            <span>Razorpay Secured</span>
            <span>·</span>
            <span>UPI · Cards · Wallets · COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <h4 className="font-display text-sm tracking-widest text-electric uppercase">{title}</h4>
      <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="hover:text-foreground transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
