import { useNavigate } from "react-router-dom";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";

export default function CartDrawer() {
  const { open, setOpen, items, remove, updateQty, total, count } = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const checkout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    try {
      const payload = {
        items: items.map(i => ({ product_id: i.product.id, quantity: i.quantity })),
        origin_url: window.location.origin,
      };
      const r = await api.post("/checkout/session", payload);
      window.location.href = r.data.url;
    } catch (e) {
      toast.error(e.response?.data?.detail || "Checkout failed");
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" onClick={() => setOpen(false)}
            data-testid="cart-backdrop"
          />
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[440px] glass-strong z-50 flex flex-col"
            data-testid="cart-drawer"
          >
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">
              <div>
                <div className="text-[10px] tracking-luxe uppercase text-gold">Your Tin</div>
                <div className="font-serif text-2xl mt-1">Cart · {count}</div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white" data-testid="cart-close">
                <X className="w-5 h-5" strokeWidth={1.2} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
              {items.length === 0 && (
                <div className="text-center py-20 text-white/40 font-light">
                  <div className="font-serif text-2xl text-white/60">Your tin is empty.</div>
                  <p className="text-sm mt-2">A royal kitchen begins with a single spice.</p>
                </div>
              )}
              {items.map(it => (
                <div key={it.product.id} className="flex gap-4 border-b border-white/5 pb-6" data-testid={`cart-item-${it.product.slug}`}>
                  <img src={it.product.image_url} alt={it.product.name} className="w-20 h-24 object-cover" />
                  <div className="flex-1">
                    <div className="font-serif text-lg leading-tight">{it.product.name}</div>
                    <div className="text-[10px] tracking-luxe uppercase text-white/40 mt-1">{it.product.weight_g} g</div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border border-white/10">
                        <button onClick={() => updateQty(it.product.id, it.quantity - 1)} className="p-2 hover:bg-white/5" data-testid={`cart-dec-${it.product.slug}`}><Minus className="w-3 h-3" /></button>
                        <span className="px-3 text-sm">{it.quantity}</span>
                        <button onClick={() => updateQty(it.product.id, it.quantity + 1)} className="p-2 hover:bg-white/5" data-testid={`cart-inc-${it.product.slug}`}><Plus className="w-3 h-3" /></button>
                      </div>
                      <div className="font-serif text-lg gold-text">₹{(it.product.price_inr * it.quantity).toFixed(0)}</div>
                    </div>
                  </div>
                  <button onClick={() => remove(it.product.id)} className="text-white/40 hover:text-white self-start" data-testid={`cart-remove-${it.product.slug}`}>
                    <Trash2 className="w-4 h-4" strokeWidth={1.2} />
                  </button>
                </div>
              ))}
            </div>

            <div className="px-8 py-6 border-t border-white/5">
              <div className="flex items-baseline justify-between mb-6">
                <span className="text-[10px] tracking-luxe uppercase text-white/40">Subtotal</span>
                <span className="font-serif text-3xl gold-text" data-testid="cart-subtotal">₹{total.toFixed(0)}</span>
              </div>
              <button onClick={checkout} disabled={loading || items.length === 0} className="btn-gold w-full disabled:opacity-40" data-testid="cart-checkout-btn">
                {loading ? "Preparing…" : "Secure Checkout"}
              </button>
              <button onClick={() => { setOpen(false); navigate("/shop"); }} className="mt-3 w-full text-[10px] tracking-luxe uppercase text-white/50 hover:text-white py-3" data-testid="cart-continue">Continue Browsing</button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
