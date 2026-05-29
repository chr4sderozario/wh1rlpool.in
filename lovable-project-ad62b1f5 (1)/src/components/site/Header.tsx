import { Link } from "@tanstack/react-router";
import { ShoppingBag, Search, User, Menu, X, LogOut, Shield } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart-store";
import { useAuth } from "@/hooks/use-auth";

const nav = [
  { to: "/category/club", label: "Clubs" },
  { to: "/category/national", label: "National" },
  { to: "/category/retro", label: "Retro" },
  { to: "/category/player", label: "Player Editions" },
  { to: "/track", label: "Track Order" },
];

export function Header() {
  const count = useCart((s) => s.count());
  const { user, isAdmin, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="bg-electric text-electric-foreground text-[11px] font-medium tracking-wider uppercase py-1.5 text-center">
        Free shipping across India on orders above ₹1499 · COD available
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        <button className="lg:hidden -ml-2 p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link to="/" className="font-display text-2xl lg:text-3xl tracking-wider">
          WH<span className="text-electric">1</span>RLPOOL
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium uppercase tracking-wider">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-muted-foreground hover:text-foreground transition-colors"
              activeProps={{ className: "text-electric" }}
            >
              {n.label}
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin" className="text-electric flex items-center gap-1">
              <Shield className="h-4 w-4" /> Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-1">
          <button className="p-2 hover:text-electric transition-colors hidden sm:block" aria-label="Search">
            <Search className="h-5 w-5" />
          </button>
          {user ? (
            <div className="relative">
              <button onClick={() => setMenu(!menu)} className="p-2 hover:text-electric" aria-label="Account">
                <User className="h-5 w-5" />
              </button>
              {menu && (
                <div className="absolute right-0 top-full mt-1 w-48 border border-border bg-card shadow-xl">
                  <div className="px-4 py-3 border-b border-border text-xs">
                    <div className="text-muted-foreground">Signed in as</div>
                    <div className="truncate">{user.email}</div>
                  </div>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setMenu(false)} className="block px-4 py-2 text-sm hover:bg-electric/10">
                      Admin Console
                    </Link>
                  )}
                  <button
                    onClick={() => { setMenu(false); signOut(); }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-electric/10 flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="p-2 hover:text-electric transition-colors" aria-label="Sign in">
              <User className="h-5 w-5" />
            </Link>
          )}
          <Link to="/cart" className="relative p-2 hover:text-electric transition-colors" aria-label="Cart">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-electric text-[10px] font-bold text-electric-foreground px-1">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-border/40 px-4 py-4 flex flex-col gap-1 text-sm uppercase tracking-wider">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="py-3 border-b border-border/30 text-muted-foreground"
              activeProps={{ className: "text-electric" }}
            >
              {n.label}
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin" onClick={() => setOpen(false)} className="py-3 border-b border-border/30 text-electric">
              Admin
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
