import type { VercelRequest, VercelResponse } from "@vercel/node";

function clean(value: unknown, max = 1000) {
  return String(value ?? "").trim().slice(0, max);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const templateName = process.env.WHATSAPP_TEMPLATE_NAME || "hbt_new_order";
  const templateLanguage = process.env.WHATSAPP_TEMPLATE_LANGUAGE || "en_US";
  const recipient = clean(process.env.WHATSAPP_ORDER_RECIPIENT || req.body?.recipient, 30);
  const graphVersion = process.env.WHATSAPP_GRAPH_VERSION || "v23.0";

  if (!accessToken || !phoneNumberId || !recipient) {
    return res.status(503).json({
      error: "WhatsApp Cloud API is not configured",
      required: [
        "WHATSAPP_ACCESS_TOKEN",
        "WHATSAPP_PHONE_NUMBER_ID",
        "WHATSAPP_ORDER_RECIPIENT",
      ],
    });
  }

  const order = req.body?.order;
  if (!order?.orderId || !order?.customer || !Array.isArray(order.items)) {
    return res.status(400).json({ error: "Invalid order payload" });
  }

  const productLines = order.items
    .slice(0, 10)
    .map(
      (item: any) =>
        `${clean(item.brand, 40)} ${clean(item.name, 80)} | ${clean(item.size, 40)} x ${Number(item.quantity || 0)}`,
    )
    .join("; ");

  const parameters = [
    clean(order.orderId, 64),
    clean(order.customer.name, 120),
    clean(order.customer.phone, 30),
    clean(order.customer.whatsapp, 30),
    clean(order.customer.city, 100),
    clean(order.customer.address, 500),
    productLines || "No products",
    `PKR ${Number(order.total || 0).toLocaleString()}`,
    clean(order.paymentMethod, 30),
    order.paymentMethod === "bank" ? "MCB 1581298881001800" : "Pending",
  ].map((text) => ({ type: "text", text }));

  const url = `https://graph.facebook.com/${graphVersion}/${encodeURIComponent(phoneNumberId)}/messages`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: recipient,
      type: "template",
      template: {
        name: templateName,
        language: { code: templateLanguage },
        components: [
          {
            type: "body",
            parameters,
          },
        ],
      },
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error("WhatsApp Cloud API error", data);
    return res.status(502).json({ error: "WhatsApp notification failed", details: data });
  }

  return res.status(200).json({ ok: true, whatsapp: data });
}
