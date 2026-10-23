import { BUSINESS_CONFIG } from "../data/products.js";

/**
 * Construye el mensaje de WhatsApp con el desglose completo de la compra
 */
export function buildWhatsAppMessage(cart, customerName = "", customerNotes = "") {
  const lines = ["¡Hola JULIPOP! Quiero realizar el siguiente pedido:", ""];

  if (customerName.trim() !== "") {
    lines.push(` *Cliente:* ${customerName.trim()}`);
    lines.push("");
  }

  let totalOrder = 0;

  cart.forEach((item) => {
    const subtotal = item.unitPrice * item.quantity;
    totalOrder += subtotal;

    lines.push(`• *${item.quantity}x ${item.productName}* ($${item.unitPrice} MXN c/u)`);

    if (item.toppings && item.toppings.length > 0) {
      const toppingsNames = item.toppings
        .map((t) => `${t.name} (+$${t.price})`)
        .join(", ");
      lines.push(`   ↳ Toppings: ${toppingsNames}`);
    } else {
      lines.push(`   ↳ Sin toppings adicionales`);
    }

    lines.push(`   ↳ Subtotal: $${subtotal} ${BUSINESS_CONFIG.currency}`);
  });

  lines.push("");
  lines.push(`*Total: $${totalOrder} ${BUSINESS_CONFIG.currency}*`);

  if (customerNotes.trim() !== "") {
    lines.push("");
    lines.push(` *Notas del pedido:* ${customerNotes.trim()}`);
  }

  lines.push("");
  lines.push("¡Gracias!");

  return lines.join("\n");
}

/**
 * Genera el enlace https://wa.me/NUMERO?text=MENSAJE
 */
export function generateWhatsAppUrl(cart, customerName = "", customerNotes = "", customPhone = "") {
  const rawPhone = (customPhone || BUSINESS_CONFIG.whatsappNumber).replace(/\D/g, "");
  const message = buildWhatsAppMessage(cart, customerName, customerNotes);
  return `https://wa.me/${rawPhone}?text=${encodeURIComponent(message)}`;
}