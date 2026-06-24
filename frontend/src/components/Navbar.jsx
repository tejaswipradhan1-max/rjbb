import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, User, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

const LOGO_URL = "/images/logo-01.png";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count, setOpen } = useCart();
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 inset-x-0 z-40 glass border-b border-white/5">
      <nav className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3" data-testid="nav-logo">
          <img src={LOGO_URL} alt="Rajkumari" className="h-14 w-auto" style={{ mixBlendMode: "lighten" }} />
          <span className="font-serif text-2xl tracking-wide gold-text hidden sm:inline">Rjbb Foods Pvt Ltd.</span>
        </Link>

        <div className="hidden md:flex items-center gap-10 text-[11px] tracking-luxe uppercase text-white/70">
          <Link to="/" className="hover:text-white transition" data-testid="nav-home">Home</Link>
          <Link to="/shop" className="hover:text-white transition" data-testid="nav-shop">Collection</Link>
          <a href="/#story" className="hover:text-white transition" data-testid="nav-story">Heritage</a>
          <a href="/#why" className="hover:text-white transition" data-testid="nav-why">Why Rajkumari</a>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {user.role === "admin" && (
                <button onClick={() => navigate("/admin")} className="hidden md:inline text-[10px] tracking-luxe uppercase text-gold hover:text-white transition" data-testid="nav-admin">Admin</button>
              )}
              <span className="hidden md:inline text-[10px] tracking-luxe uppercase text-white/50" data-testid="nav-user">{user.name.split(" ")[0]}</span>
              <button onClick={logout} aria-label="Logout" className="text-white/70 hover:text-white" data-testid="nav-logout">
                <LogOut className="w-4 h-4" strokeWidth={1.2} />
              </button>
            </>
          ) : (
            <Link to="/login" className="text-white/70 hover:text-white" data-testid="nav-login">
              <User className="w-4 h-4" strokeWidth={1.2} />
            </Link>
          )}
          <button onClick={() => setOpen(true)} className="relative text-white/80 hover:text-white" data-testid="nav-cart">
            <ShoppingBag className="w-4 h-4" strokeWidth={1.2} />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-black text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-semibold" data-testid="nav-cart-count">{count}</span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
