import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { useRef } from "react";
import SpiceDrops from "./SpiceDrops";

export default function Hero() {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const rotY = useTransform(sx, [-1, 1], [-22, 22]);
  const rotX = useTransform(sy, [-1, 1], [18, -18]);

  // Scroll-driven parallax (Apple-style)
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 800], [0, 220]);
  const heroOpacity = useTransform(scrollY, [0, 400, 700], [1, 0.7, 0]);
  const packetY = useTransform(scrollY, [0, 800], [0, -120]);
  const backdropX = useTransform(scrollY, [0, 800], [0, -150]);

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      className="relative min-h-screen flex items-center overflow-hidden noise"
      style={{ background: "radial-gradient(ellipse at 50% 30%, #1a0707 0%, #050505 60%)" }}
      data-testid="hero-section"
    >
      <div className="absolute inset-0 spotlight" />
      <SpiceDrops count={22} />

      {/* large faint serif backdrop word */}
      <motion.div style={{ x: backdropX }} className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="font-serif text-[22vw] leading-none text-white/[0.025] tracking-tight">Rajkumari</span>
      </motion.div>

      <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-16 w-full grid lg:grid-cols-12 gap-8 items-center pt-32 pb-20">
        {/* Left text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
          className="lg:col-span-7 z-10"
        >
          <div className="flex items-center gap-3 mb-8">
            <span className="h-px w-12 bg-gold" />
            <span className="text-[10px] tracking-luxe uppercase text-gold">Est. Royal Kitchens · 1947</span>
          </div>
          <h1 className="font-serif font-light tracking-tighter text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] text-white">
            {`India's Finest Spices,`}<br/>
            <span className="italic gold-text">Crafted for</span><br/>
            Royal Kitchens.
          </h1>
          <p className="mt-10 text-base lg:text-lg font-light text-white/60 tracking-wide max-w-lg">
            Purity. Heritage. Luxury. Stone-ground in small batches, sourced from the soil of single estates, and presented as an heirloom.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <a href="/shop" className="btn-gold" data-testid="hero-shop-btn">Explore the Collection</a>
            <a href="#story" className="btn-ghost" data-testid="hero-story-btn">The Heritage</a>
          </div>
        </motion.div>

        {/* Right 3D packet — actual product */}
        <motion.div style={{ y: packetY }} className="lg:col-span-5 relative h-[480px] lg:h-[640px] flex items-center justify-center" data-perspective="hero">
          <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: "1400px" }}>
          {/* golden halo */}
          <div className="absolute w-[380px] h-[380px] rounded-full" style={{ background: "radial-gradient(circle, rgba(212,175,55,0.45) 0%, transparent 70%)", filter: "blur(50px)" }} />
          <div className="absolute w-[260px] h-[260px] rounded-full" style={{ background: "radial-gradient(circle, rgba(229,57,53,0.3) 0%, transparent 70%)", filter: "blur(40px)" }} />
          <motion.div
            style={{ rotateY: rotY, rotateX: rotX, transformStyle: "preserve-3d" }}
            animate={{ y: [0, -16, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-[300px] lg:w-[400px]"
            data-testid="hero-3d-packet"
          >
            <img
              src="/images/shuddh-haldi.png"
              alt="Rajkumari Shuddh haldi"
              className="w-full h-auto drop-shadow-[0_60px_120px_rgba(140,17,17,0.6)]"
              style={{ filter: "saturate(1.1) contrast(1.05)" }}
            />
            {/* shimmer overlay */}
            <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-40" style={{
              background: "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)",
              backgroundSize: "300% 100%",
              animation: "shimmer 7s linear infinite",
            }} />
            {/* shadow */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[70%] h-8 rounded-full bg-black/70 blur-2xl" />
          </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* bottom golden fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#050505] to-transparent" />

      {/* scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[9px] tracking-luxe uppercase text-white/40">
        <span>Scroll</span>
        <span className="block w-px h-10 bg-gradient-to-b from-gold/60 to-transparent" />
      </div>
    </section>
  );
}
