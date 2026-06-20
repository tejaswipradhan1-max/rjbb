import { motion } from "framer-motion";

export default function Storytelling() {
  return (
    <section id="story" className="relative py-32 lg:py-40 overflow-hidden noise" data-testid="story-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex items-center gap-3 mb-6">
          <span className="h-px w-10 bg-gold" />
          <span className="text-[10px] tracking-luxe uppercase text-gold">The Journey</span>
        </div>
        <h2 className="font-serif font-light text-4xl sm:text-5xl lg:text-6xl leading-[1.05] max-w-3xl">
          From a single field <span className="italic gold-text">to your royal table.</span>
        </h2>

        <div className="mt-20 grid lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Step 1 — large image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}
            className="lg:col-span-7 lg:row-span-2 relative overflow-hidden h-[480px]"
          >
            <img src="https://images.pexels.com/photos/4198656/pexels-photo-4198656.jpeg" alt="Stone ground spices" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="text-[10px] tracking-luxe uppercase text-gold mb-3">Chapter 01</div>
              <div className="font-serif text-3xl lg:text-4xl">Sourced from soil that remembers.</div>
              <p className="mt-3 text-white/60 text-sm max-w-md font-light leading-relaxed">Single-estate farms in Erode, Guntur and Kota — soil profiled, sun timed, harvest hand-picked.</p>
            </div>
          </motion.div>

          {/* Step 2 — text card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.1 }}
            className="lg:col-span-5 glass p-10 lg:p-12 flex flex-col justify-between min-h-[230px]"
          >
            <div className="text-[10px] tracking-luxe uppercase text-gold">Chapter 02</div>
            <div>
              <div className="font-serif text-3xl lg:text-4xl leading-tight">Stone ground in silence.</div>
              <p className="mt-3 text-white/60 text-sm font-light leading-relaxed">No heat. No haste. Two granite stones turning slowly — exactly as the palace chefs once demanded.</p>
            </div>
          </motion.div>

          {/* Step 3 — image card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }}
            className="lg:col-span-5 relative overflow-hidden min-h-[230px]"
          >
            <img src="https://images.pexels.com/photos/19450236/pexels-photo-19450236.jpeg" alt="Royal heritage" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="text-[10px] tracking-luxe uppercase text-gold mb-2">Chapter 03</div>
              <div className="font-serif text-2xl">Sealed in royal lineage.</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
