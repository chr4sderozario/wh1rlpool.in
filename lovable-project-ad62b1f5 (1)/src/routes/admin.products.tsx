import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/products";
import { toast } from "sonner";
import { Trash2, Plus, X } from "lucide-react";

export const Route = createFileRoute("/admin/products")({
  component: ProductsAdmin,
});

interface DBProduct {
  id: string;
  slug: string;
  name: string;
  team: string;
  category: string;
  price: number;
  mrp: number;
  image_url: string;
  badge: string | null;
  best_seller: boolean;
  new_arrival: boolean;
  featured: boolean;
  player: string | null;
  description: string;
  in_stock: boolean;
}

const empty = {
  slug: "",
  name: "",
  team: "",
  category: "club",
  price: 1499,
  mrp: 4999,
  image_url: "",
  badge: "",
  best_seller: false,
  new_arrival: false,
  featured: false,
  player: "",
  description: "",
  in_stock: true,
};

function ProductsAdmin() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<typeof empty>(empty);

  const { data: products = [] } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as DBProduct[];
    },
  });

  const createMut = useMutation({
    mutationFn: async (p: typeof empty) => {
      const { error } = await supabase.from("products").insert({
        ...p,
        badge: p.badge || null,
        player: p.player || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Product added");
      setShowForm(false);
      setForm(empty);
      qc.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Product removed");
      qc.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">{products.length} live listings</p>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 bg-electric text-electric-foreground px-4 py-2 text-sm font-bold uppercase tracking-widest"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Cancel" : "Add Product"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createMut.mutate(form);
          }}
          className="border border-border bg-card p-6 mb-8 grid sm:grid-cols-2 gap-3"
        >
          <Input label="Name" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Input label="Slug" required value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} placeholder="real-madrid-home-2425" />
          <Input label="Team" required value={form.team} onChange={(v) => setForm({ ...form, team: v })} />
          <Select
            label="Category"
            value={form.category}
            onChange={(v) => setForm({ ...form, category: v })}
            options={[
              { value: "club", label: "Club" },
              { value: "national", label: "National" },
              { value: "retro", label: "Retro" },
              { value: "player", label: "Player Edition" },
            ]}
          />
          <Input label="Price (₹)" type="number" required value={String(form.price)} onChange={(v) => setForm({ ...form, price: Number(v) })} />
          <Input label="MRP (₹)" type="number" required value={String(form.mrp)} onChange={(v) => setForm({ ...form, mrp: Number(v) })} />
          <Input label="Image URL" required value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} className="sm:col-span-2" placeholder="https://..." />
          <Input label="Badge (optional)" value={form.badge} onChange={(v) => setForm({ ...form, badge: v })} />
          <Input label="Player (optional)" value={form.player} onChange={(v) => setForm({ ...form, player: v })} />
          <label className="sm:col-span-2 block">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Description</span>
            <textarea
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="mt-1.5 w-full bg-input border border-border px-3 py-3 text-sm focus:border-electric focus:outline-none"
            />
          </label>
          <div className="sm:col-span-2 flex flex-wrap gap-4 text-sm">
            <Check label="Featured" value={form.featured} onChange={(v) => setForm({ ...form, featured: v })} />
            <Check label="Best Seller" value={form.best_seller} onChange={(v) => setForm({ ...form, best_seller: v })} />
            <Check label="New Arrival" value={form.new_arrival} onChange={(v) => setForm({ ...form, new_arrival: v })} />
            <Check label="In Stock" value={form.in_stock} onChange={(v) => setForm({ ...form, in_stock: v })} />
          </div>
          <button
            type="submit"
            disabled={createMut.isPending}
            className="sm:col-span-2 bg-electric text-electric-foreground py-3 text-sm font-bold uppercase tracking-widest disabled:opacity-50"
          >
            {createMut.isPending ? "Adding..." : "Add Product"}
          </button>
        </form>
      )}

      <div className="border border-border">
        {products.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">No products yet. Add your first listing.</div>
        ) : (
          products.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-4 border-b border-border last:border-0">
              <img src={p.image_url} alt={p.name} className="h-16 w-12 object-cover bg-muted" />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.team} · {p.category}</div>
              </div>
              <div className="text-sm text-electric font-bold">{formatINR(p.price)}</div>
              <button
                onClick={() => {
                  if (confirm(`Remove "${p.name}"?`)) deleteMut.mutate(p.id);
                }}
                className="p-2 text-muted-foreground hover:text-destructive"
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, className = "", ...rest }: { label: string; value: string; onChange: (v: string) => void; className?: string } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <input {...rest} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5 w-full bg-input border border-border px-3 py-3 text-sm focus:border-electric focus:outline-none" />
    </label>
  );
}
function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5 w-full bg-input border border-border px-3 py-3 text-sm focus:border-electric focus:outline-none">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}
function Check({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} className="accent-electric" />
      <span className="text-xs uppercase tracking-widest">{label}</span>
    </label>
  );
}
