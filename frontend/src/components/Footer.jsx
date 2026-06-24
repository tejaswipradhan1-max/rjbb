import { Crown } from "lucide-react";

const LOGO_URL = "/images/logo-01.png";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black mt-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-20 grid md:grid-cols-4 gap-12">
        <div>
          <div className="flex items-center gap-3 mb-5">
            <img src={LOGO_URL} alt="Rajkumari" className="h-16 w-auto" style={{ mixBlendMode: "lighten" }} />
            
          </div>
          <p className="text-sm text-white/50 font-light leading-relaxed">{`India's most premium spice atelier. Crafted by RJBB Foods Pvt. Ltd.`}</p>
        </div>
        <div>
          <div className="text-[10px] tracking-luxe uppercase text-gold mb-5">Collection</div>
          <ul className="space-y-3 text-sm text-white/60 font-light">
            <li>Shuddh Haldi</li>
            <li>Shuddh Mirchi</li>
            <li>Shuddh Dhaniya</li>
            <li>Royal Garam Masala</li>
          </ul>
        </div>
        {/* <div>
          <div className="text-[10px] tracking-luxe uppercase text-gold mb-5">House</div>
          <ul className="space-y-3 text-sm text-white/60 font-light">
            <li>Heritage</li>
            <li>Stone Grinding</li>
            <li>Sourcing</li>
            <li>Concierge</li>
          </ul>
        </div> */}
        <div>
          <div className="text-[10px] tracking-luxe uppercase text-gold mb-5">From the House of Purity</div>
          <p className="text-sm text-white/60 font-light leading-relaxed">RJBB Foods Pvt. Ltd.<br/>Ramkrishna Nagar, Patna-27<br/>Bihar, India</p>
        </div>
      </div>
      <div className="gold-divider" />
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-6 text-[10px] tracking-luxe uppercase text-white/30 flex justify-between">
        <span>© 2026 Rajkumari by RJBB Foods</span>
        <span>Freshness · Purity · Tradition</span>
      </div>
    </footer>
  );
}
