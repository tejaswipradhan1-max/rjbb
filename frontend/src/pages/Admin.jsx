import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Crown, Package, Users, ShoppingBag } from "lucide-react";

export default function Admin() {
  const { user, loading } = useAuth();
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (user?.role !== "admin") return;
    api.get("/admin/orders").then(r => setOrders(r.data)).catch(() => {});
    api.get("/admin/users").then(r => setUsers(r.data)).catch(() => {});
    api.get("/products").then(r => setProducts(r.data)).catch(() => {});
  }, [user]);

  const markPaid = async (id) => {
    try {
      await api.post(`/admin/orders/${id}/mark-paid`);
      const r = await api.get("/admin/orders");
      setOrders(r.data);
    } catch (e) { /* noop */ }
  };

  if (loading) return <div className="min-h-screen bg-[#050505]" />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;

  return (
    <div className="bg-[#050505] min-h-screen" data-testid="admin-page">
      <Navbar />
      <section className="pt-32 pb-12 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex items-center gap-3 mb-4">
          <Crown className="w-5 h-5 text-gold" strokeWidth={1.2} />
          <span className="text-[10px] tracking-luxe uppercase text-gold">Royal Ledger</span>
        </div>
        <h1 className="font-serif font-light text-5xl lg:text-6xl">Atelier <span className="italic gold-text">Admin</span></h1>

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          <StatCard icon={ShoppingBag} label="Orders" value={orders.length} />
          <StatCard icon={Users} label="Patrons" value={users.length} />
          <StatCard icon={Package} label="Products" value={products.length} />
        </div>

        <div className="mt-12 flex gap-6 border-b border-white/10">
          {["orders", "users", "products"].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`pb-4 text-[11px] tracking-luxe uppercase transition ${tab === t ? "text-gold border-b border-gold" : "text-white/40 hover:text-white"}`} data-testid={`admin-tab-${t}`}>{t}</button>
          ))}
        </div>

        <div className="mt-10">
          {tab === "orders" && (
            <div className="glass p-2">
              <Table headers={["Order", "Email", "Method", "UPI Ref", "Total", "Status", "Action"]}>
                {orders.length === 0 && <Row cells={["No orders yet."]} />}
                {orders.map(o => (
                  <tr key={o.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors" data-testid={`order-row-${o.id}`}>
                    <td className="py-4 px-4 font-light text-white/80">{o.id.slice(0, 8)}</td>
                    <td className="py-4 px-4 font-light text-white/80">{o.user_email || "guest"}</td>
                    <td className="py-4 px-4 font-light text-white/80 uppercase text-[10px] tracking-luxe">{o.payment_method || "card"}</td>
                    <td className="py-4 px-4 font-mono text-xs text-white/60">{o.upi_reference || "—"}</td>
                    <td className="py-4 px-4 font-serif text-gold">₹{o.total_inr.toFixed(0)}</td>
                    <td className="py-4 px-4">
                      <span className={`text-[10px] tracking-luxe uppercase ${o.payment_status === "paid" ? "text-gold" : "text-white/50"}`}>{o.payment_status}</span>
                    </td>
                    <td className="py-4 px-4">
                      {o.payment_status !== "paid" && (
                        <button onClick={() => markPaid(o.id)} className="text-[10px] tracking-luxe uppercase text-gold hover:text-white border border-gold/30 px-3 py-1.5" data-testid={`mark-paid-${o.id.slice(0,8)}`}>Mark Paid</button>
                      )}
                    </td>
                  </tr>
                ))}
              </Table>
            </div>
          )}
          {tab === "users" && (
            <div className="glass p-2">
              <Table headers={["Name", "Email", "Role", "Joined"]}>
                {users.map(u => <Row key={u.id} cells={[u.name, u.email, u.role, new Date(u.created_at).toLocaleDateString()]} />)}
              </Table>
            </div>
          )}
          {tab === "products" && (
            <div className="glass p-2">
              <Table headers={["Name", "Category", "Price", "Stock"]}>
                {products.map(p => <Row key={p.id} cells={[p.name, p.category, `₹${p.price_inr}`, p.stock]} />)}
              </Table>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="glass p-8" data-testid={`stat-${label.toLowerCase()}`}>
    <Icon className="w-5 h-5 text-gold mb-4" strokeWidth={1.2} />
    <div className="text-[10px] tracking-luxe uppercase text-white/40">{label}</div>
    <div className="font-serif text-5xl gold-text mt-2">{value}</div>
  </div>
);

const Table = ({ headers, children }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="text-[10px] tracking-luxe uppercase text-white/40 border-b border-white/5">
          {headers.map(h => <th key={h} className="text-left py-4 px-4 font-normal">{h}</th>)}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

const Row = ({ cells }) => (
  <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
    {cells.map((c, i) => <td key={i} className="py-4 px-4 font-light text-white/80">{c}</td>)}
  </tr>
);
