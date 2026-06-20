import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ProductShowcase from "@/components/ProductShowcase";
import Storytelling from "@/components/Storytelling";
import WhyRajkumari from "@/components/WhyRajkumari";
import About from "@/components/About";
import CartDrawer from "@/components/CartDrawer";
import { api } from "@/lib/api";

export default function Home() {
  const [products, setProducts] = useState([]);
  useEffect(() => { api.get("/products").then(r => setProducts(r.data)).catch(() => {}); }, []);

  return (
    <div className="bg-[#050505] text-white" data-testid="home-page">
      <Navbar />
      <Hero />
      <ProductShowcase products={products} />
      <Storytelling />
      <WhyRajkumari />
      <About />
      <Footer />
      <CartDrawer />
    </div>
  );
}
