import { motion } from "framer-motion";

export default function About() {
  return (
    <section className="relative py-32 lg:py-40 overflow-hidden" data-testid="about-section">
      <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(ellipse at 80% 20%, #1a0707 0%, transparent 60%)" }} />
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative grid lg:grid-cols-12 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}
          className="lg:col-span-7"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-gold" />
            <span className="text-[10px] tracking-luxe uppercase text-gold">The House of Rajkumari</span>
          </div>
          <h2 className="font-serif font-light text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
            A legacy quietly <span className="italic gold-text">passed in copper tins.</span>
          </h2>
          <div className="mt-10 space-y-6 text-white/65 font-light leading-relaxed max-w-xl">
            <p>Rajkumari began in 2024 as RJBB Foods Pvt. Ltd., crafting premium Rajkumari brand spices from a modern Indian kitchen philosophy.</p>
            <p>We blend traditional heritage with contemporary quality. Every Rajkumari tin is hand-numbered. Every batch is small. Every spice is the best a generation can ground.</p>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-8 max-w-md">
            <div>
              <div className="font-serif text-4xl gold-text">2024</div>
              <div className="text-[10px] tracking-luxe uppercase text-white/50 mt-1">Founded with Purpose</div>
            </div>
            <div>
              <div className="font-serif text-4xl gold-text">100%</div>
              <div className="text-[10px] tracking-luxe uppercase text-white/50 mt-1"> Pure Ingredients</div>
            </div>
            <div>
              <div className="font-serif text-4xl gold-text">0</div>
              <div className="text-[10px] tracking-luxe uppercase text-white/50 mt-1"> Artificial Additives</div>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.1 }}
          className="lg:col-span-5 relative h-[520px]"
        >
          <img src="/images/design-guideline-19450236.png" alt="Royal heritage" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          {/* <div className="absolute bottom-6 left-6 right-6 glass p-6">
            <div className="text-[10px] tracking-luxe uppercase text-gold mb-2">Hand Numbered Batch</div>
            <div className="font-serif text-2xl">No. 00041 / 02026</div>
          </div> */}
        </motion.div>
      </div>
    </section>
  );
}
