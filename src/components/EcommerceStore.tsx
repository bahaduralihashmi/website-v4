import { useEffect, useMemo, useState } from "react";
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  Truck,
  CheckCircle2,
  MessageSquare,
  PackageSearch,
  Building2,
  Upload,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import type { TireProduct } from "../data";
import {
  createOrder,
  generateOrderId,
  type CartItem,
  type CustomerDetails,
  type PaymentMethod,
} from "../lib/orderService";
import { storage } from "../lib/firebase";

const CART_KEY = "hbt-cart-v1";
const DELIVERY_CHARGE = 500;
const WHATSAPP_NUMBER = "923034572298";
const MCB_ACCOUNT = "1581298881001800";
const MCB_BANK = "MCB Bank";
const MAX_RECEIPT_SIZE = 5 * 1024 * 1024;

type StoreEventDetail = { tire: TireProduct };
type OrderSnapshot = {
  orderId: string;
  total: number;
  items: CartItem[];
  customer: CustomerDetails;
  subtotal: number;
  deliveryCharge: number;
  paymentMethod: PaymentMethod;
  paymentReceiptUrl?: string | null;
};

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

function paymentLabel(method: PaymentMethod) {
  if (method === "cod") return "Cash on Delivery";
  if (method === "bilty") return "Pay on Bilty Received";
  if (method === "bank") return "MCB Bank Transfer";
  return "Card / Online Payment";
}

export default function EcommerceStore() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [success, setSuccess] = useState<OrderSnapshot | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptError, setReceiptError] = useState("");
  const [tracking, setTracking] = useState("");
  const [form, setForm] = useState<CustomerDetails>({
    name: "",
    phone: "",
    whatsapp: "",
    email: "",
    city: "Lahore",
    address: "",
    landmark: "",
    notes: "",
  });

  useEffect(() => {
    setCart(readCart());
    const addHandler = (event: Event) => {
      const detail = (event as CustomEvent<StoreEventDetail>).detail;
      if (!detail?.tire) return;
      const tire = detail.tire;
      const existing = readCart();
      const stock = Math.max(1, Number(tire.stock) || 99);
      const found = existing.find((item) => item.id === tire.id);
      const next = found
        ? existing.map((item) =>
            item.id === tire.id ? { ...item, quantity: Math.min(item.quantity + 1, stock) } : item,
          )
        : [
            ...existing,
            {
              id: tire.id,
              name: tire.name || "Tyre",
              brand: tire.brand || "HBT",
              size: tire.size || "",
              price: Number(tire.price) || 0,
              quantity: 1,
              image: tire.image,
            },
          ];
      saveCart(next);
      setCart(next);
      setOpen(true);
    };
    const updateHandler = () => setCart(readCart());
    window.addEventListener("hbt-add-to-cart", addHandler);
    window.addEventListener("hbt-cart-updated", updateHandler);
    return () => {
      window.removeEventListener("hbt-add-to-cart", addHandler);
      window.removeEventListener("hbt-cart-updated", updateHandler);
    };
  }, []);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.price || 0) * item.quantity, 0),
    [cart],
  );
  const total = subtotal + (cart.length ? DELIVERY_CHARGE : 0);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  const changeQty = (id: string, delta: number) => {
    const next = cart.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item,
    );
    saveCart(next);
    setCart(next);
  };

  const removeItem = (id: string) => {
    const next = cart.filter((item) => item.id !== id);
    saveCart(next);
    setCart(next);
  };

  const handleReceipt = (file: File | null) => {
    setReceiptError("");
    if (!file) {
      setReceiptFile(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setReceiptFile(null);
      setReceiptError("Please upload a payment receipt image (JPG, PNG or WebP).");
      return;
    }
    if (file.size > MAX_RECEIPT_SIZE) {
      setReceiptFile(null);
      setReceiptError("Receipt image must be 5 MB or smaller.");
      return;
    }
    setReceiptFile(file);
  };

  const uploadReceipt = async (orderId: string) => {
    if (!receiptFile) return null;
    const safeName = receiptFile.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 120);
    const receiptRef = ref(storage, `payment-receipts/${orderId}/${Date.now()}-${safeName}`);
    const snapshot = await uploadBytes(receiptRef, receiptFile, {
      contentType: receiptFile.type,
      customMetadata: { orderId, purpose: "mcb-payment-receipt" },
    });
    return getDownloadURL(snapshot.ref);
  };

  const placeOrder = async () => {
    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.whatsapp.trim() ||
      !form.city.trim() ||
      !form.address.trim() ||
      !cart.length
    ) return;

    if (paymentMethod === "bank" && !receiptFile) {
      setReceiptError("Please upload your MCB payment receipt before placing the order.");
      return;
    }

    if (paymentMethod === "card") {
      alert("MCB eGate card checkout is not activated yet. Please use MCB Bank Transfer, COD, or Bilty until the MCB merchant gateway credentials are configured.");
      return;
    }

    setSubmitting(true);
    setReceiptError("");
    const orderId = generateOrderId();

    try {
      const paymentReceiptUrl = paymentMethod === "bank" ? await uploadReceipt(orderId) : null;
      const paymentStatus = paymentMethod === "bank" ? "pending_verification" : "pending";

      const snapshot: OrderSnapshot = {
        orderId,
        total,
        items: cart,
        customer: form,
        subtotal,
        deliveryCharge: DELIVERY_CHARGE,
        paymentMethod,
        paymentReceiptUrl,
      };

      await createOrder({
        orderId,
        customer: form,
        items: cart,
        subtotal,
        deliveryCharge: DELIVERY_CHARGE,
        total,
        paymentMethod,
        paymentStatus,
        orderStatus: "new",
        courier: "pending",
        trackingNumber: null,
        paymentReceiptUrl,
      });

      localStorage.setItem("hbt-last-order", JSON.stringify(snapshot));
      saveCart([]);
      setCart([]);
      setReceiptFile(null);
      setCheckout(false);
      setSuccess(snapshot);
      setOpen(true);
      setTracking("");
    } catch (error) {
      console.error("Order creation failed", error);
      setReceiptError("We could not complete the order. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputFields = ["name", "phone", "whatsapp", "email", "city", "address", "landmark", "notes"] as const;
  const placeholderFor = (key: (typeof inputFields)[number]) => ({
    name: "Full name *",
    phone: "Mobile number *",
    whatsapp: "WhatsApp number *",
    email: "Email (optional)",
    city: "City *",
    address: "Complete delivery address *",
    landmark: "Landmark (optional)",
    notes: "Order notes (optional)",
  })[key];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed right-5 bottom-24 sm:bottom-6 z-[55] w-14 h-14 rounded-full bg-brand-orange text-white shadow-2xl shadow-brand-orange/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        aria-label={`Open shopping cart, ${count} items`}
      >
        <ShoppingCart className="w-6 h-6" />
        {count > 0 && <span className="absolute -top-1 -right-1 min-w-6 h-6 px-1 rounded-full bg-red-600 border-2 border-white text-white text-[11px] font-black flex items-center justify-center">{count}</span>}
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex justify-end" onClick={() => setOpen(false)}>
          <aside className="h-full w-full max-w-xl bg-white text-slate-900 shadow-2xl overflow-y-auto" onClick={(event) => event.stopPropagation()}>
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-brand-orange font-black">HBT Online Store</p>
                <h2 className="text-xl font-black">{checkout ? "Secure Checkout" : success ? "Order Confirmed" : "Your Cart"}</h2>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 rounded-xl bg-slate-100" aria-label="Close store"><X className="w-5 h-5" /></button>
            </div>

            {success ? (
              <div className="p-6 space-y-5">
                <div className="rounded-3xl bg-emerald-50 border border-emerald-200 p-6 text-center">
                  <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
                  <h3 className="text-2xl font-black mt-3">Order placed</h3>
                  <p className="text-sm text-slate-600 mt-1">Your order number is <strong>{success.orderId}</strong>.</p>
                  {success.paymentMethod === "bank" && <p className="text-sm text-amber-700 mt-2 font-semibold">Payment receipt received. HBT will verify the transfer before dispatch.</p>}
                </div>

                {success.paymentMethod === "bank" && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                    <div className="flex items-center gap-2 font-black"><Building2 className="w-5 h-5 text-brand-orange" /> MCB Bank Transfer</div>
                    <div className="mt-3 rounded-xl bg-white border p-4 space-y-3">
                      <div><p className="text-xs text-slate-500">Bank</p><p className="font-black">{MCB_BANK}</p></div>
                      <div><p className="text-xs text-slate-500">Account Number</p><p className="text-lg font-black tracking-wider">{MCB_ACCOUNT}</p></div>
                      <div><p className="text-xs text-slate-500">Transferred amount</p><p className="text-lg font-black text-brand-orange">PKR {success.total.toLocaleString()}</p></div>
                    </div>
                  </div>
                )}

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-bold">Track your order</p>
                  <p className="text-xs text-slate-500 mt-1">Courier tracking will become available when a tracking number is assigned.</p>
                  <div className="flex gap-2 mt-3">
                    <input value={tracking} onChange={(event) => setTracking(event.target.value)} placeholder="Order / tracking number" className="flex-1 border rounded-xl px-3 py-2" />
                    <button type="button" onClick={() => alert(tracking.trim() ? `Tracking number saved for lookup: ${tracking.trim()}` : "Enter an order or tracking number first.")} className="px-4 rounded-xl bg-slate-900 text-white font-bold" aria-label="Check tracking"><PackageSearch className="w-4 h-4" /></button>
                  </div>
                </div>

                <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hello HBT, I need help with order ${success.orderId}.`)}`} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 text-white font-bold"><MessageSquare className="w-4 h-4" />Customer Support on WhatsApp</a>
                <button onClick={() => { setSuccess(null); setOpen(false); }} className="w-full py-3 rounded-xl border font-bold">Continue Shopping</button>
              </div>
            ) : checkout ? (
              <div className="p-5 space-y-5">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-bold mb-3">Delivery details</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {inputFields.map((key) => (
                      <input key={key} value={form[key] || ""} onChange={(event) => setForm({ ...form, [key]: event.target.value })} placeholder={placeholderFor(key)} className={`border rounded-xl px-3 py-3 text-sm ${key === "address" || key === "notes" ? "sm:col-span-2" : ""}`} />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-bold mb-3">Payment method</p>
                  <div className="grid grid-cols-1 gap-2">
                    <button type="button" onClick={() => setPaymentMethod("cod")} className={`p-4 rounded-2xl border text-left flex gap-3 items-center ${paymentMethod === "cod" ? "border-brand-orange bg-brand-orange/5" : "border-slate-200"}`}>
                      <Banknote className="text-brand-orange" /><span><strong>Cash on Delivery</strong><small className="block text-slate-500">Pay when your order arrives.</small></span>
                    </button>
                    <button type="button" onClick={() => setPaymentMethod("bilty")} className={`p-4 rounded-2xl border text-left flex gap-3 items-center ${paymentMethod === "bilty" ? "border-brand-orange bg-brand-orange/5" : "border-slate-200"}`}>
                      <Truck className="text-brand-orange" /><span><strong>Pay on Bilty Received</strong><small className="block text-slate-500">Payment arrangement for shipped order.</small></span>
                    </button>
                    <button type="button" onClick={() => setPaymentMethod("bank")} className={`p-4 rounded-2xl border text-left flex gap-3 items-center ${paymentMethod === "bank" ? "border-brand-orange bg-brand-orange/5" : "border-slate-200"}`}>
                      <Building2 className="text-brand-orange" /><span><strong>MCB Bank Transfer</strong><small className="block text-slate-500">Transfer the exact order total and upload your receipt.</small></span>
                    </button>

                    {paymentMethod === "bank" && (
                      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 space-y-4">
                        <div>
                          <p className="font-black">MCB payment details</p>
                          <p className="text-sm mt-2">Bank: <strong>{MCB_BANK}</strong></p>
                          <p className="text-sm">Account Number: <strong className="tracking-wide">{MCB_ACCOUNT}</strong></p>
                          <p className="text-sm mt-2">Amount to transfer: <strong className="text-brand-orange">PKR {total.toLocaleString()}</strong></p>
                        </div>
                        <div className="rounded-xl bg-white border p-4">
                          <label className="flex items-center gap-2 font-bold text-sm cursor-pointer">
                            <Upload className="w-4 h-4 text-brand-orange" /> Upload payment receipt
                            <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => handleReceipt(event.target.files?.[0] || null)} />
                          </label>
                          <p className="text-xs text-slate-500 mt-2">Upload the receipt/screenshot from your banking app. Maximum 5 MB.</p>
                          {receiptFile && <p className="text-xs font-semibold text-emerald-700 mt-2">✓ {receiptFile.name}</p>}
                          {receiptError && <p className="text-xs font-semibold text-red-600 mt-2">{receiptError}</p>}
                        </div>
                        <p className="text-[11px] text-slate-600">Your receipt is stored with the order for payment verification. Do not upload passwords, OTPs, PINs or card details.</p>
                      </div>
                    )}

                    <button type="button" onClick={() => setPaymentMethod("card")} className={`p-4 rounded-2xl border text-left flex gap-3 items-center ${paymentMethod === "card" ? "border-brand-orange bg-brand-orange/5" : "border-slate-200"}`}>
                      <CreditCard className="text-brand-orange" /><span><strong>Card / Online Payment</strong><small className="block text-slate-500">Secure MCB eGate checkout — card details are entered on the payment gateway.</small></span>
                    </button>

                    {paymentMethod === "card" && (
                      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                        <div className="flex gap-2 items-start"><ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" /><div><p className="font-black">Secure card payment</p><p className="text-xs text-slate-600 mt-1">HBT will never store your card number, CVV, expiry date or OTP. The actual MCB eGate merchant integration must be activated before card payments can be accepted.</p></div></div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border p-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span>Subtotal</span><strong>PKR {subtotal.toLocaleString()}</strong></div>
                  <div className="flex justify-between"><span>Delivery (buyer pays)</span><strong>PKR {DELIVERY_CHARGE.toLocaleString()}</strong></div>
                  <div className="border-t pt-2 flex justify-between text-lg"><span className="font-black">Total</span><strong className="text-brand-orange">PKR {total.toLocaleString()}</strong></div>
                </div>

                <button type="button" disabled={submitting || paymentMethod === "card" || !form.name.trim() || !form.phone.trim() || !form.whatsapp.trim() || !form.city.trim() || !form.address.trim()} onClick={placeOrder} className="w-full py-4 rounded-2xl bg-brand-orange text-white font-black disabled:opacity-40">
                  {submitting ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Processing…</span> : paymentMethod === "bank" ? `Submit Bank Payment • PKR ${total.toLocaleString()}` : `Place Order • PKR ${total.toLocaleString()}`}
                </button>
                <p className="text-[11px] text-slate-500 text-center">Delivery charge is paid by the buyer. MCB transfer orders are verified before dispatch.</p>
              </div>
            ) : (
              <div className="p-5 space-y-4">
                {!cart.length ? (
                  <div className="py-16 text-center text-slate-500"><ShoppingCart className="w-12 h-12 mx-auto opacity-30" /><p className="font-bold mt-3">Your cart is empty</p><p className="text-xs mt-1">Add tyres from the catalogue to start shopping.</p></div>
                ) : (
                  <>
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-3 border rounded-2xl p-3">
                        {item.image ? <img src={item.image} className="w-20 h-20 rounded-xl object-cover bg-slate-100" alt="" /> : <div className="w-20 h-20 rounded-xl bg-slate-100" />}
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-sm truncate">{item.name}</p>
                          <p className="text-xs text-slate-500">{item.brand} • {item.size}</p>
                          <p className="text-brand-orange font-black mt-1">PKR {Number(item.price).toLocaleString()}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button type="button" onClick={() => changeQty(item.id, -1)} className="p-1.5 rounded-lg bg-slate-100" aria-label="Decrease quantity"><Minus className="w-3 h-3" /></button>
                            <span className="text-xs font-black">{item.quantity}</span>
                            <button type="button" onClick={() => changeQty(item.id, 1)} className="p-1.5 rounded-lg bg-slate-100" aria-label="Increase quantity"><Plus className="w-3 h-3" /></button>
                            <button type="button" onClick={() => removeItem(item.id)} className="ml-auto p-1.5 rounded-lg bg-red-50 text-red-600" aria-label="Remove item"><Trash2 className="w-3 h-3" /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between text-sm"><span>Subtotal</span><strong>PKR {subtotal.toLocaleString()}</strong></div>
                      <div className="flex justify-between text-sm"><span>Delivery</span><strong>PKR {DELIVERY_CHARGE.toLocaleString()}</strong></div>
                      <div className="flex justify-between text-xl font-black"><span>Total</span><strong className="text-brand-orange">PKR {total.toLocaleString()}</strong></div>
                      <button type="button" onClick={() => setCheckout(true)} className="w-full py-4 rounded-2xl bg-brand-orange text-white font-black mt-3">Buy Now / Checkout</button>
                      <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello HBT, I need help with my online cart.")}`} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-green-600 text-white font-bold"><MessageSquare className="w-4 h-4" />Ask on WhatsApp</a>
                    </div>
                  </>
                )}
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
