import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

// Apple-style pinned scroll section: as user scrolls, three spice products
// reveal in sequence with cinematic fades / scales / parallax.
const slides = [
  {
    name: "Shuddh Haldi",
    hindi: "शुद्ध हल्दी",
    tag: "Stone-ground golden lineage.",
    color: "#FFB300",
    image: "/images/shuddh-haldi.png",
  },
  {
    name: "Shuddh Mirchi",
    hindi: "शुद्ध मिर्ची",
    tag: "Crimson heat. Slow ground.",
    color: "#E53935",
    image: "/images/shuddh-mirchi.png",
  },
  {
    name: "Shuddh Dhaniya",
    hindi: "शुद्ध धनिया",
    tag: "Cold-ground citrus aroma.",
    color: "#9CCC65",
    image: "/images/shuddh-dhaniya.png",
  },
];

function Slide({ progress, index, total, slide }) {
  // Each slide gets a window in [0,1] of scroll progress
  const segment = 1 / total;
  const start = index * segment;
  const end = (index + 1) * segment;
  // Fade/scale curve
  const opacity = useTransform(progress, [start - 0.05, start, end - 0.05, end], [0, 1, 1, 0]);
  const scale = useTransform(progress, [start, end], [1.05, 0.96]);
  const y = useTransform(progress, [start, end], [40, -40]);
  return (
    <motion.div
      style={{ opacity, scale, y }}
      className="absolute inset-0 flex items-center"
      data-testid={`cinematic-slide-${index}`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 w-full grid lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-gold" />
            <span className="text-[10px] tracking-luxe uppercase text-gold">Chapter 0{index + 1}</span>
          </div>
          <div className="font-serif italic text-2xl mb-3" style={{ color: slide.color }}>{slide.hindi}</div>
          <h3 className="font-serif font-light text-5xl sm:text-6xl lg:text-7xl leading-[0.95] mb-6">
            {slide.name.split(" ")[0]} <span className="italic gold-text">{slide.name.split(" ").slice(1).join(" ")}</span>
          </h3>
          <p className="text-lg text-white/60 font-light max-w-md">{slide.tag}</p>
        </div>
        <div className="lg:col-span-6 relative h-[480px] flex items-center justify-center">
          <div className="absolute w-[420px] h-[420px] rounded-full blur-3xl" style={{ background: `radial-gradient(circle, ${slide.color}55, transparent 70%)` }} />
          <img src={slide.image} alt={slide.name} className="relative w-[320px] lg:w-[380px] h-auto drop-shadow-[0_50px_100px_rgba(0,0,0,0.6)]" />
        </div>
      </div>
    </motion.div>
  );
}

export default function CinematicReveal() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  return (
    <section ref={ref} className="relative" style={{ height: `${slides.length * 100}vh`, position: "relative" }} data-testid="cinematic-section">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 spotlight" />
        {slides.map((s, i) => (
          <Slide key={s.name} progress={smooth} index={i} total={slides.length} slide={s} />
        ))}
        {/* slide indicator */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
          {slides.map((s, i) => (
            <Indicator key={s.name} progress={smooth} index={i} total={slides.length} />
          ))}
        </div>
        {/* footer */}
        <div className="absolute bottom-10 inset-x-0 text-center">
          <span className="text-[10px] tracking-luxe uppercase text-white/30">Scroll · Reveal · Repeat</span>
        </div>
      </div>
    </section>
  );
}

function Indicator({ progress, index, total }) {
  const segment = 1 / total;
  const start = index * segment;
  const end = (index + 1) * segment;
  const opacity = useTransform(progress, [start - 0.05, start, end - 0.05, end], [0.25, 1, 1, 0.25]);
  return <motion.span style={{ opacity }} className="block w-px h-10 bg-gold" />;
}
