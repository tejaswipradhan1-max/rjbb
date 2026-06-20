import { motion } from "framer-motion";
import { Sparkles, Leaf, Mountain, Shield, Flame, Hand } from "lucide-react";

const items = [
  { icon: Sparkles, title: "100% Pure & Natural", body: "No fillers. No dyes. No imitations. Only what the earth gave." },
  { icon: Mountain, title: "Stone Ground Processing", body: "Granite-on-granite, slow and silent. The way it has been for centuries." },
  { icon: Leaf, title: "No Preservatives", body: "Sealed at harvest. Drawn from estate to tin without compromise." },
  { icon: Shield, title: "Premium Quality Control", body: "Every batch is laboratory-verified for moisture, oil and origin." },
  { icon: Flame, title: "Authentic Indian Taste", body: "Recipes preserved in copper notebooks since the era of the Rajputs." },
  { icon: Hand, title: "Unpolished. Untouched.", body: "We never polish, bleach or dilute. Pedigree speaks for itself." },
];

export default function WhyRajkumari() {
  return (
    <section id="why" className="relative py-32 lg:py-40" data-testid="why-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="text-center max-w-3xl mx-auto">
          <div className="flex items-center gap-3 justify-center mb-6">
            <span className="h-px w-10 bg-gold" />
            <span className="text-[10px] tracking-luxe uppercase text-gold">The House Code</span>
            <span className="h-px w-10 bg-gold" />
          </div>
          <h2 className="font-serif font-light text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
            Six principles. <span className="italic gold-text">Zero compromises.</span>
          </h2>
        </div>

        <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
          {items.map((it, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.05 }}
              className="bg-[#050505] p-10 lg:p-12 group hover:bg-[#0a0606] transition-colors duration-500"
              data-testid={`why-item-${idx}`}
            >
              <it.icon className="w-6 h-6 text-gold mb-6" strokeWidth={1.1} />
              <div className="font-serif text-2xl lg:text-3xl mb-3 leading-tight">{it.title}</div>
              <p className="text-sm text-white/55 font-light leading-relaxed">{it.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
