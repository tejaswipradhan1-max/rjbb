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
            <p>Rajkumari was born in the back-kitchens of Rajasthan, where royal cooks served only what was pure, only what was slow, and only what carried the name of the soil it came from.</p>
            <p>Today, RJBB Foods Pvt. Ltd. carries forward that lineage — bridging single-origin Indian farms with a modern audience that refuses to compromise. Every Rajkumari tin is hand-numbered. Every batch is small. Every spice is the best a generation can ground.</p>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-8 max-w-md">
            <div>
              <div className="font-serif text-4xl gold-text">79</div>
              <div className="text-[10px] tracking-luxe uppercase text-white/50 mt-1">Years of Lineage</div>
            </div>
            <div>
              <div className="font-serif text-4xl gold-text">11</div>
              <div className="text-[10px] tracking-luxe uppercase text-white/50 mt-1">Estate Partners</div>
            </div>
            <div>
              <div className="font-serif text-4xl gold-text">0</div>
              <div className="text-[10px] tracking-luxe uppercase text-white/50 mt-1">Compromises</div>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.1 }}
          className="lg:col-span-5 relative h-[520px]"
        >
          <img src="https://images.pexels.com/photos/19450236/pexels-photo-19450236.jpeg" alt="Royal heritage" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 glass p-6">
            <div className="text-[10px] tracking-luxe uppercase text-gold mb-2">Hand Numbered Batch</div>
            <div className="font-serif text-2xl">No. 00041 / 02026</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
