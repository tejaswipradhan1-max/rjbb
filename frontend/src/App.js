import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import CheckoutSuccess from "@/pages/CheckoutSuccess";
import Admin from "@/pages/Admin";

function App() {
  useEffect(() => { document.title = "Rajkumari · India's Finest Spices"; }, []);
  return (
    <div className="App">
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/checkout/success" element={<CheckoutSuccess />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </BrowserRouter>
          <Toaster theme="dark" position="bottom-right" toastOptions={{ style: { background: "#0a0a0a", border: "1px solid rgba(212,175,55,0.25)", color: "#fff", fontFamily: "Outfit" } }} />
        </CartProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
