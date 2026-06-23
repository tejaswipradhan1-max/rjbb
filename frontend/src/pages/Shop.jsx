import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SpiceDrops from "@/components/SpiceDrops";
import { TiltCard } from "@/components/ProductShowcase";
import { api } from "@/lib/api";
import { useCart } from "@/context/CartContext";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const { add } = useCart();
  useEffect(() => { api.get("/products").then(r => setProducts(r.data)).catch(() => {}); }, []);

  return (
    <div className="bg-[#050505] min-h-screen" data-testid="shop-page">
      <Navbar />
      <section className="relative pt-40 pb-20 overflow-hidden">
        <SpiceDrops count={18} />
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-gold" />
            <span className="text-[10px] tracking-luxe uppercase text-gold">The Atelier</span>
          </div>
          <h1 className="font-serif font-light text-5xl sm:text-6xl lg:text-7xl leading-[0.95]">
            The Full <span className="italic gold-text">Collection</span>
          </h1>
          <p className="mt-6 text-white/55 font-light max-w-xl">Single-origin spices and royal blends — every tin numbered, every spice unblended.</p>
        </div>
      </section>
      <section className="pb-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(p => <TiltCard key={p.id} product={p} onBuy={(prod) => add(prod, 1)} />)}
        </div>
      </section>
      <Footer />
      <CartDrawer />
    </div>
  );
}
