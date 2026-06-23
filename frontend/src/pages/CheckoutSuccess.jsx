import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { Crown, Check } from "lucide-react";
import SpiceDrops from "@/components/SpiceDrops";

export default function CheckoutSuccess() {
  const loc = useLocation();
  const navigate = useNavigate();
  const { clear } = useCart();
  const [status, setStatus] = useState("checking");
  const [data, setData] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(loc.search);
    const sid = params.get("session_id");
    if (!sid) { navigate("/"); return; }

    let attempts = 0;
    const poll = async () => {
      attempts += 1;
      try {
        const r = await api.get(`/checkout/status/${sid}`);
        setData(r.data);
        if (r.data.payment_status === "paid") { setStatus("paid"); clear(); return; }
        if (r.data.status === "expired") { setStatus("expired"); return; }
        if (attempts < 6) setTimeout(poll, 2000);
        else setStatus("timeout");
      } catch {
        if (attempts < 6) setTimeout(poll, 2000);
        else setStatus("error");
      }
    };
    poll();
  }, [loc.search, navigate, clear]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#050505] flex items-center justify-center" data-testid="checkout-success-page">
      <SpiceDrops count={20} />
      <div className="absolute inset-0 spotlight" />
      <div className="relative glass-strong p-14 max-w-lg mx-6 text-center">
        <div className="flex justify-center mb-8"><Crown className="w-6 h-6 text-gold" strokeWidth={1.2} /></div>
        {status === "checking" && (
          <>
            <div className="text-[10px] tracking-luxe uppercase text-gold mb-3">Verifying</div>
            <h1 className="font-serif font-light text-4xl">Confirming your royal order…</h1>
            <p className="mt-4 text-white/50 font-light text-sm">A moment of silence while the seal is verified.</p>
          </>
        )}
        {status === "paid" && (
          <>
            <div className="flex justify-center mb-6"><div className="w-14 h-14 rounded-full gold-bg flex items-center justify-center"><Check className="w-6 h-6 text-black" strokeWidth={2} /></div></div>
            <div className="text-[10px] tracking-luxe uppercase text-gold mb-3">Order Confirmed</div>
            <h1 className="font-serif font-light text-4xl">Sealed with gold.</h1>
            <p className="mt-4 text-white/60 font-light">Your tin is being prepared by hand. A confirmation has been engraved in our ledger.</p>
            <div className="gold-divider my-8" />
            <div className="font-serif text-3xl gold-text">₹{(data?.amount_total || 0).toFixed(0)}</div>
            <button onClick={() => navigate("/")} className="btn-ghost mt-8" data-testid="success-home-btn">Return Home</button>
          </>
        )}
        {(status === "timeout" || status === "error" || status === "expired") && (
          <>
            <div className="text-[10px] tracking-luxe uppercase text-royal mb-3">Pending</div>
            <h1 className="font-serif font-light text-3xl">We could not verify yet.</h1>
            <p className="mt-4 text-white/55 font-light">Please refresh or contact the concierge.</p>
            <button onClick={() => navigate("/")} className="btn-ghost mt-8" data-testid="success-home-btn">Return Home</button>
          </>
        )}
      </div>
    </div>
  );
}
