import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useCart } from "@/context/CartContext";

export default function UpiModal({ open, onClose }) {
  const { items, total, clear } = useCart();
  const [phase, setPhase] = useState("form"); // form | qr | confirm | done
  const [form, setForm] = useState({ name: "", phone: "" });
  const [order, setOrder] = useState(null);
  const [ref, setRef] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) { setPhase("form"); setOrder(null); setRef(""); setForm({ name: "", phone: "" }); }
  }, [open]);

  const createOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await api.post("/checkout/upi", {
        items: items.map(i => ({ product_id: i.product.id, quantity: i.quantity })),
        customer_name: form.name,
        customer_phone: form.phone,
      });
      setOrder(r.data);
      setPhase("qr");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to create order");
    } finally { setLoading(false); }
  };

  const copyUpi = () => {
    navigator.clipboard.writeText(order.merchant_upi_id);
    setCopied(true);
    toast.success("UPI ID copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const submitRef = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(`/checkout/upi/${order.order_id}/confirm`, { upi_reference: ref });
      clear();
      setPhase("done");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to submit");
    } finally { setLoading(false); }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]" onClick={onClose}
            data-testid="upi-backdrop"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
            className="fixed inset-0 z-[61] flex items-center justify-center pointer-events-none p-6"
            data-testid="upi-modal"
          >
            <div className="glass-strong w-full max-w-md pointer-events-auto relative">
              <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">
                <div>
                  <div className="text-[10px] tracking-luxe uppercase text-gold">Pay via UPI</div>
                  <div className="font-serif text-2xl mt-1">
                    {phase === "form" && "Your Details"}
                    {phase === "qr" && "Scan & Pay"}
                    {phase === "confirm" && "Transaction Reference"}
                    {phase === "done" && "Awaiting Verification"}
                  </div>
                </div>
                <button onClick={onClose} className="text-white/60 hover:text-white" data-testid="upi-close">
                  <X className="w-5 h-5" strokeWidth={1.2} />
                </button>
              </div>

              {phase === "form" && (
                <form onSubmit={createOrder} className="p-8 space-y-5">
                  <div>
                    <label className="text-[10px] tracking-luxe uppercase text-white/40">Full Name</label>
                    <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-transparent border-b border-white/15 focus:border-gold outline-none py-3" data-testid="upi-name" />
                  </div>
                  <div>
                    <label className="text-[10px] tracking-luxe uppercase text-white/40">Phone</label>
                    <input required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full bg-transparent border-b border-white/15 focus:border-gold outline-none py-3" data-testid="upi-phone" />
                  </div>
                  <div className="flex items-baseline justify-between pt-4">
                    <span className="text-[10px] tracking-luxe uppercase text-white/40">Total</span>
                    <span className="font-serif text-3xl gold-text">₹{total.toFixed(0)}</span>
                  </div>
                  <button type="submit" disabled={loading} className="btn-gold w-full disabled:opacity-40" data-testid="upi-create">{loading ? "Preparing…" : "Generate UPI QR"}</button>
                </form>
              )}

              {phase === "qr" && order && (
                <div className="p-8 space-y-5">
                  <div className="bg-white p-4 mx-auto w-fit">
                    <img src={order.qr_url} alt="UPI QR" className="w-56 h-56 block" data-testid="upi-qr" />
                  </div>

                  <div className="text-center text-[11px] tracking-luxe uppercase text-white/50">
                    Scan with Any UPI App
                  </div>

                  <div className="glass p-4 flex items-center justify-between">
                    <div>
                      <div className="text-[9px] tracking-luxe uppercase text-white/40">UPI ID</div>
                      <div className="font-mono text-sm text-white mt-1" data-testid="upi-id">{order.merchant_upi_id}</div>
                    </div>
                    <button onClick={copyUpi} className="text-gold hover:text-white" data-testid="upi-copy">
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" strokeWidth={1.2} />}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <a href={order.upi_link} className="btn-gold !text-[10px] flex items-center justify-center gap-2" data-testid="upi-app-btn">
                      <Smartphone className="w-3 h-3" /> Open UPI App
                    </a>
                    <button onClick={() => setPhase("confirm")} className="btn-ghost !text-[10px]" data-testid="upi-paid-btn">I Have Paid</button>
                  </div>

                  <div className="flex items-baseline justify-between pt-2">
                    <span className="text-[10px] tracking-luxe uppercase text-white/40">Amount · Ref</span>
                    <span className="font-mono text-xs text-white/70">₹{order.total_inr.toFixed(0)} · RJK-{order.short_ref}</span>
                  </div>
                </div>
              )}

              {phase === "confirm" && (
                <form onSubmit={submitRef} className="p-8 space-y-5">
                  <p className="text-sm text-white/55 font-light leading-relaxed">
                    Please enter the UPI transaction reference (UTR) from your payment app. Your tin will be dispatched after the royal ledger verifies the payment.
                  </p>
                  <div>
                    <label className="text-[10px] tracking-luxe uppercase text-white/40">UPI Reference / UTR</label>
                    <input required minLength={4} value={ref} onChange={e => setRef(e.target.value)} className="w-full bg-transparent border-b border-white/15 focus:border-gold outline-none py-3 font-mono tracking-wider" data-testid="upi-ref-input" />
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setPhase("qr")} className="btn-ghost flex-1" data-testid="upi-back">Back</button>
                    <button type="submit" disabled={loading} className="btn-gold flex-1 disabled:opacity-40" data-testid="upi-submit-ref">{loading ? "Submitting…" : "Submit"}</button>
                  </div>
                </form>
              )}

              {phase === "done" && (
                <div className="p-8 text-center">
                  <div className="w-14 h-14 mx-auto gold-bg rounded-full flex items-center justify-center mb-6">
                    <Check className="w-6 h-6 text-black" strokeWidth={2} />
                  </div>
                  <div className="text-[10px] tracking-luxe uppercase text-gold mb-3">Submitted</div>
                  <div className="font-serif text-3xl mb-3">Sealed with gold.</div>
                  <p className="text-sm text-white/55 font-light leading-relaxed">Your reference has been added to the royal ledger. You will be notified once the concierge verifies your payment.</p>
                  <button onClick={onClose} className="btn-ghost mt-8" data-testid="upi-done-btn">Close</button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
