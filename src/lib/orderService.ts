import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export type PaymentMethod = "cod" | "bilty" | "bank" | "card";

export interface CartItem {
  id: string;
  name: string;
  brand: string;
  size: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  whatsapp: string;
  email?: string;
  city: string;
  address: string;
  landmark?: string;
  notes?: string;
}

export interface OrderPayload {
  orderId: string;
  customer: CustomerDetails;
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: "pending" | "paid";
  orderStatus: "new";
  courier: "pending";
  trackingNumber: null;
}

export async function createOrder(payload: OrderPayload): Promise<string> {
  const docRef = await addDoc(collection(db, "orders"), {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export function generateOrderId(): string {
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `HBT-${new Date().getFullYear()}-${suffix}`;
}
