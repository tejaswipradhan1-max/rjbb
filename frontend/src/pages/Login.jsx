import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import SpiceDrops from "@/components/SpiceDrops";

const LOGO_URL = "/images/logo-01.png";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_shuddh-essence/artifacts/ao5i2hue_Rajkumari%20logo-01.PNG";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const u = await login(email, password);
      toast.success(`Welcome back, ${u.name.split(" ")[0]}`);
      navigate(loc.state?.from || (u.role === "admin" ? "/admin" : "/"));
    } catch (err) {
      toast.error(err.response?.data?.detail || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#050505]" data-testid="login-page">
      <SpiceDrops count={16} />
      <div className="absolute inset-0 spotlight" />
      <div className="relative glass-strong p-12 w-full max-w-md mx-6">
        <div className="flex items-center gap-3 mb-8">
          <img src={LOGO_URL} alt="Rajkumari" className="h-16 w-auto" style={{ mixBlendMode: "lighten" }} />
          <span className="font-serif text-3xl gold-text">Rajkumari</span>
        </div>
        <div className="text-[10px] tracking-luxe uppercase text-gold mb-3">Royal Concierge</div>
        <h1 className="font-serif font-light text-4xl mb-10">Welcome back.</h1>
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="text-[10px] tracking-luxe uppercase text-white/40">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-transparent border-b border-white/15 focus:border-gold outline-none py-3 text-white" data-testid="login-email" />
          </div>
          <div>
            <label className="text-[10px] tracking-luxe uppercase text-white/40">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-transparent border-b border-white/15 focus:border-gold outline-none py-3 text-white" data-testid="login-password" />
          </div>
          <button type="submit" disabled={loading} className="btn-gold w-full mt-8 disabled:opacity-40" data-testid="login-submit">{loading ? "Entering…" : "Enter"}</button>
        </form>
        <div className="mt-8 text-[11px] tracking-wide text-white/50 text-center">
          New to the house? <Link to="/register" className="text-gold hover:underline" data-testid="login-to-register">Request access</Link>
        </div>
      </div>
    </div>
  );
}
