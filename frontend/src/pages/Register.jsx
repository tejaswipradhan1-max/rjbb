import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import SpiceDrops from "@/components/SpiceDrops";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_shuddh-essence/artifacts/ao5i2hue_Rajkumari%20logo-01.PNG";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success("Welcome to the house of Rajkumari.");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#050505]" data-testid="register-page">
      <SpiceDrops count={20} />
      <div className="absolute inset-0 spotlight" />
      <div className="relative glass-strong p-12 w-full max-w-md mx-6">
        <div className="flex items-center gap-3 mb-8">
          <img src={LOGO_URL} alt="Rajkumari" className="h-16 w-auto" style={{ mixBlendMode: "lighten" }} />
          <span className="font-serif text-3xl gold-text">Rajkumari</span>
        </div>
        <div className="text-[10px] tracking-luxe uppercase text-gold mb-3">Royal Concierge</div>
        <h1 className="font-serif font-light text-4xl mb-10">Request access.</h1>
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="text-[10px] tracking-luxe uppercase text-white/40">Name</label>
            <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-transparent border-b border-white/15 focus:border-gold outline-none py-3 text-white" data-testid="register-name" />
          </div>
          <div>
            <label className="text-[10px] tracking-luxe uppercase text-white/40">Email</label>
            <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full bg-transparent border-b border-white/15 focus:border-gold outline-none py-3 text-white" data-testid="register-email" />
          </div>
          <div>
            <label className="text-[10px] tracking-luxe uppercase text-white/40">Password</label>
            <input type="password" required minLength={6} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full bg-transparent border-b border-white/15 focus:border-gold outline-none py-3 text-white" data-testid="register-password" />
          </div>
          <button type="submit" disabled={loading} className="btn-gold w-full mt-8 disabled:opacity-40" data-testid="register-submit">{loading ? "Engraving…" : "Create Account"}</button>
        </form>
        <div className="mt-8 text-[11px] tracking-wide text-white/50 text-center">
          Already a patron? <Link to="/login" className="text-gold hover:underline" data-testid="register-to-login">Enter</Link>
        </div>
      </div>
    </div>
  );
}
