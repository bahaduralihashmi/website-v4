import { useEffect, useMemo, useState } from "react";
import { ShoppingCart, X, Plus, Minus, Trash2, CreditCard, Banknote, Truck, CheckCircle2, MessageSquare, PackageSearch } from "lucide-react";
import type { TireProduct } from "../data";
import { createOrder, generateOrderId, type CartItem, type CustomerDetails, type PaymentMethod } from "../lib/orderService";

const CART_KEY = "hbt-cart-v1";
const DELIVERY_CHARGE = 500;
const WHATSAPP_NUMBER = "923034572298";

type StoreEventDetail = { tire: TireProduct };

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("hbt-cart-updated"));
}

export default function EcommerceStore() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [tracking, setTracking] = useState("");
  const [form, setForm] = useState<CustomerDetails>({ name: "", phone: "", whatsapp: "", email: "", city: "Lahore", address: "", landmark: "", notes: "" });

  useEffect(() => {
    setCart(readCart());
    const addHandler = (event: Event) => {
      const detail = (event as CustomEvent<StoreEventDetail>).detail;
      if (!detail?.tire) return;
      const tire = detail.tire;
      const existing = readCart();
      const found = existing.find((item) => item.id === tire.id);
      const next = found
        ? existing.map((item) => item.id === tire.id ? { ...item, quantity: Math.min(item.quantity + 1, Number(tire.stock) || 99) } : item)
        : [...existing, { id: tire.id, name: tire.name, brand: tire.brand, size: tire.size, price: Number(tire.price) || 0, quantity: 1, image: tire.image }];
      saveCart(next);
      setCart(next);
      setOpen(true);
    };
    const updateHandler = () => setCart(readCart());
    window.addEventListener("hbt-add-to-cart", addHandler as EventListener);
    window.addEventListener("hbt-cart-updated", updateHandler);
    return () => {
      window.removeEventListener("hbt-add-to-cart", addHandler as EventListener);
      window.removeEventListener("hbt-cart-updated", updateHandler);
    };
  }, []);

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const total = subtotal + (cart.length ? DELIVERY_CHARGE : 0);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  const changeQty = (id: string, delta: number) => {
    const next = cart.map((item) => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item);
    saveCart(next);
    setCart(next);
  };

  const removeItem = (id: string) => {
    const next = cart.filter((item) => item.id !== id);
    saveCart(next);
    setCart(next);
  };

  const whatsappOrder = (orderId: string, method: PaymentMethod) => {
    const lines = cart.map((item) => `• ${item.brand} ${item.name} | ${item.size} × ${item.quantity} = PKR ${(item.price * item.quantity).toLocaleString()}`);
    const message = [
      `🛒 NEW HBT ONLINE ORDER`,
      `Order: ${orderId}`,
      `Customer: ${form.name}`,
      `Phone: ${form.phone}`,
      `WhatsApp: ${form.whatsapp}`,
      `City: ${form.city}`,
      `Address: ${form.address}`,
      form.landmark ? `Landmark: ${form.landmark}` : "",
      "",
      "PRODUCTS:",
      ...lines,
      "",
      `Subtotal: PKR ${subtotal.toLocaleString()}`,
      `Delivery: PKR ${DELIVERY_CHARGE.toLocaleString()} (paid by buyer)`,
      `TOTAL: PKR ${total.toLocaleString()}`,
      `Payment: ${method === "cod" ? "Cash on Delivery" : method === "bilty" ? "Pay on Bilty Received" : "Card / Online Payment"}`,
      `Payment status: ${method === "card" ? "Pending online payment" : "Pending"}`,
      form.notes ? `Notes: ${form.notes}` : "",
    ].filter(Boolean).join("\n");
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  const placeOrder = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.whatsapp.trim() || !form.city.trim() || !form.address.trim() || !cart.length) return;
    setSubmitting(true);
    const orderId = generateOrderId();
    try {
      await createOrder({
        orderId,
        customer: form,
        items: cart,
        subtotal,
        deliveryCharge: DELIVERY_CHARGE,
        total,
        paymentMethod,
        paymentStatus: "pending",
        orderStatus: "new",
        courier: "pending",
        trackingNumber: null,
      });
      localStorage.setItem("hbt-last-order", JSON.stringify({ orderId, total, createdAt: Date.now() }));
      saveCart([]);
      setCart([]);
      setCheckout(false);
      setSuccess(orderId);
      setOpen(true);
      setTracking("");
    } catch (error) {
      console.error("Order creation failed", error);
      alert("We could not save your order. Please try again or contact HBT on WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="fixed right-5 bottom-24 sm:bottom-6 z-[55] w-14 h-14 rounded-full bg-brand-orange text-white shadow-2xl shadow-brand-orange/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform" aria-label={`Open shopping cart, ${count} items`}>
        <ShoppingCart className="w-6 h-6" />
        {count > 0 && <span className="absolute -top-1 -right-1 min-w-6 h-6 px-1 rounded-full bg-red-600 border-2 border-white text-white text-[11px] font-black flex items-center justify-center">{count}</span>}
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex justify-end" onClick={() => setOpen(false)}>
          <aside className="h-full w-full max-w-xl bg-white text-slate-900 shadow-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b px-5 py-4 flex items-center justify-between">
              <div><p className="text-xs font-mono uppercase tracking-widest text-brand-orange font-black">HBT Online Store</p><h2 className="text-xl font-black">{checkout ? "Secure Checkout" : success ? "Order Confirmed" : "Your Cart"}</h2></div>
              <button onClick={() => setOpen(false)} className="p-2 rounded-xl bg-slate-100"><X className="w-5 h-5" /></button>
            </div>

            {success ? (
              <div className="p-6 space-y-5">
                <div className="rounded-3xl bg-emerald-50 border border-emerald-200 p-6 text-center"><CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" /><h3 className="text-2xl font-black mt-3">Order placed</h3><p className="text-sm text-slate-600 mt-1">Your order number is <strong>{success}</strong>.</p></div>
                <a href={whatsappOrder(success, paymentMethod)} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 rounded-2xl bg-green-600 text-white py-4 font-black"><MessageSquare className="w-5 h-5" /> Send Order Details on WhatsApp</a>
                <div className="rounded-2xl bg-slate-50 p-4"><p className="font-bold">Track your order</p><p className="text-xs text-slate-500 mt-1">Courier tracking will appear here after HBT creates the shipment.</p><div className="flex gap-2 mt-3"><input value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="Order / tracking number" className="flex-1 border rounded-xl px-3 py-2" /><button className="px-4 rounded-xl bg-slate-900 text-white font-bold"><PackageSearch className="w-4 h-4" /></button></div></div>
                <button onClick={() => { setSuccess(null); setOpen(false); }} className="w-full py-3 rounded-xl border font-bold">Continue Shopping</button>
              </div>
            ) : checkout ? (
              <div className="p-5 space-y-5">
                <div className="rounded-2xl bg-slate-50 p-4"><p className="font-bold mb-3">Delivery details</p><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{(["name","phone","whatsapp","email","city","address","landmark","notes"] as const).map((key) => <input key={key} value={form[key] || ""} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={key === "name" ? "Full name *" : key === "phone" ? "Mobile number *" : key === "whatsapp" ? "WhatsApp number *" : key === "email" ? "Email (optional)" : key === "city" ? "City *" : key === "address" ? "Complete delivery address *" : key === "landmark" ? "Landmark (optional)" : "Order notes (optional)"} className={`border rounded-xl px-3 py-3 text-sm ${key === "address" || key === "notes" ? "sm:col-span-2" : ""}`} /></div></div>
                <div><p className="font-bold mb-3">Payment method</p><div className="grid grid-cols-1 gap-2"><button onClick={() => setPaymentMethod("cod")} className={`p-4 rounded-2xl border text-left flex gap-3 items-center ${paymentMethod === "cod" ? "border-brand-orange bg-brand-orange/5" : "border-slate-200"}`}><Banknote className="text-brand-orange" /><span><strong>Cash on Delivery</strong><small className="block text-slate-500">Pay when your order arrives.</small></span></button><button onClick={() => setPaymentMethod("bilty")} className={`p-4 rounded-2xl border text-left flex gap-3 items-center ${paymentMethod === "bilty" ? "border-brand-orange bg-brand-orange/5" : "border-slate-200"}`}><Truck className="text-brand-orange" /><span><strong>Pay on Bilty Received</strong><small className="block text-slate-500">Payment arrangement for shipped order.</small></span></button><button onClick={() => setPaymentMethod("card")} className={`p-4 rounded-2xl border text-left flex gap-3 items-center ${paymentMethod === "card" ? "border-brand-orange bg-brand-orange/5" : "border-slate-200"}`}><CreditCard className="text-brand-orange" /><span><strong>Card / Online Payment</strong><small className="block text-slate-500">Gateway will be connected in the payment phase.</small></span></button></div></div>
                <div className="rounded-2xl border p-4 space-y-2 text-sm"><div className="flex justify-between"><span>Subtotal</span><strong>PKR {subtotal.toLocaleString()}</strong></div><div className="flex justify-between"><span>Delivery (buyer pays)</span><strong>PKR {DELIVERY_CHARGE.toLocaleString()}</strong></div><div className="border-t pt-2 flex justify-between text-lg"><span className="font-black">Total</span><strong className="text-brand-orange">PKR {total.toLocaleString()}</strong></div></div>
                <button disabled={submitting || !form.name || !form.phone || !form.whatsapp || !form.city || !form.address} onClick={placeOrder} className="w-full py-4 rounded-2xl bg-brand-orange text-white font-black disabled:opacity-40">{submitting ? "Placing Order…" : `Place Order • PKR ${total.toLocaleString()}`}</button>
                <p className="text-[11px] text-slate-500 text-center">After placing the order, you can send the complete order and payment details directly to HBT WhatsApp.</p>
              </div>
            ) : (
              <div className="p-5 space-y-4">
                {!cart.length ? <div className="py-16 text-center text-slate-500"><ShoppingCart className="w-12 h-12 mx-auto opacity-30" /><p className="font-bold mt-3">Your cart is empty</p><p className="text-xs mt-1">Add tyres from the catalogue to start shopping.</p></div> : <>{cart.map((item) => <div key={item.id} className="flex gap-3 border rounded-2xl p-3"><img src={item.image} className="w-20 h-20 rounded-xl object-cover bg-slate-100" alt="" /><div className="flex-1 min-w-0"><p className="font-black text-sm truncate">{item.name}</p><p className="text-xs text-slate-500">{item.brand} • {item.size}</p><p className="text-brand-orange font-black mt-1">PKR {item.price.toLocaleString()}</p><div className="flex items-center gap-2 mt-2"><button onClick={() => changeQty(item.id, -1)} className="p-1.5 rounded-lg bg-slate-100"><Minus className="w-3 h-3" /></button><span className="text-xs font-black">{item.quantity}</span><button onClick={() => changeQty(item.id, 1)} className="p-1.5 rounded-lg bg-slate-100"><Plus className="w-3 h-3" /></button><button onClick={() => removeItem(item.id)} className="ml-auto p-1.5 rounded-lg bg-red-50 text-red-600"><Trash2 className="w-3 h-3" /></button></div></div></div>)}<div className="border-t pt-4 space-y-2"><div className="flex justify-between text-sm"><span>Subtotal</span><strong>PKR {subtotal.toLocaleString()}</strong></div><div className="flex justify-between text-sm"><span>Delivery</span><strong>PKR {DELIVERY_CHARGE.toLocaleString()}</strong></div><div className="flex justify-between text-xl font-black"><span>Total</span><strong className="text-brand-orange">PKR {total.toLocaleString()}</strong></div><button onClick={() => setCheckout(true)} className="w-full py-4 rounded-2xl bg-brand-orange text-white font-black mt-3">Buy Now / Checkout</button><a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello HBT, I need help with my online cart.")}`} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-green-600 text-white font-bold"><MessageSquare className="w-4 h-4" /> Ask on WhatsApp</a></div></>}
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
