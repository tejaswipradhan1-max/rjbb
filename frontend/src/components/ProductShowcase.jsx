import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";

export function TiltCard({ product, onBuy }) {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 18 });
  const sy = useSpring(my, { stiffness: 120, damping: 18 });
  const rotY = useTransform(sx, [-1, 1], [-15, 15]);
  const rotX = useTransform(sy, [-1, 1], [12, -12]);
  const [hovered, setHovered] = useState(false);

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };
  const onLeave = () => { mx.set(0); my.set(0); setHovered(false); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      className="relative group"
      style={{ perspective: "1200px" }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
      data-testid={`product-card-${product.slug}`}
    >
      {/* glow */}
      <div
        className="absolute inset-0 blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-700"
        style={{ background: `radial-gradient(circle at 50% 50%, ${product.color}55, transparent 70%)` }}
      />
      <motion.div
        style={{ rotateY: rotY, rotateX: rotX, transformStyle: "preserve-3d" }}
        className="relative glass p-8 lg:p-10 h-[520px] flex flex-col"
      >
        <div className="text-[10px] tracking-luxe uppercase text-gold">{product.category === "blend" ? "Royal Blend" : "Single Origin"}</div>
        <div className="font-serif text-3xl lg:text-4xl mt-3 leading-tight">{product.name}</div>
        <div className="font-serif italic text-lg mt-1" style={{ color: product.color }}>{product.hindi_name}</div>

        <div className="relative flex-1 my-6 flex items-center justify-center overflow-hidden">
          <div className="absolute w-[60%] h-[60%] rounded-full blur-2xl" style={{ background: `radial-gradient(circle, ${product.color}66, transparent 70%)` }} />
          <motion.img
            src={product.image_url}
            alt={product.name}
            animate={hovered ? { scale: 1.08, rotate: 2 } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 w-full h-full object-cover rounded-sm"
            style={{ filter: "saturate(1.1) contrast(1.05)" }}
          />
        </div>

        <p className="text-sm text-white/55 font-light leading-relaxed line-clamp-2">{product.tagline}</p>

        <div className="mt-6 flex items-center justify-between">
          <div>
            <div className="text-[9px] tracking-luxe uppercase text-white/40">From</div>
            <div className="font-serif text-2xl text-white">₹{product.price_inr.toFixed(0)}</div>
          </div>
          <button onClick={() => onBuy(product)} className="btn-gold !py-3 !px-6 !text-[10px]" data-testid={`add-to-cart-${product.slug}`}>Add to Cart</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ProductShowcase({ products }) {
  const navigate = useNavigate();
  const { add } = useCart();
  const onBuy = (p) => { add(p, 1); };

  return (
    <section className="relative py-32 lg:py-40 noise" id="collection" data-testid="showcase-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-20 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-10 bg-gold" />
              <span className="text-[10px] tracking-luxe uppercase text-gold">The Collection</span>
            </div>
            <h2 className="font-serif font-light tracking-tight text-4xl sm:text-5xl lg:text-6xl leading-[1.05] max-w-2xl">
              Three spices.<br/><span className="italic gold-text">A thousand years of pedigree.</span>
            </h2>
          </div>
          <p className="text-white/55 font-light max-w-md text-base lg:text-lg leading-relaxed">
            Each tin is a quiet conversation between a single farm, a stone grinder, and the patience of slow craft.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.slice(0, 3).map(p => <TiltCard key={p.id} product={p} onBuy={onBuy} />)}
        </div>

        <div className="mt-16 text-center">
          <button onClick={() => navigate("/shop")} className="btn-ghost" data-testid="view-all-btn">View Full Collection</button>
        </div>
      </div>
    </section>
  );
}
