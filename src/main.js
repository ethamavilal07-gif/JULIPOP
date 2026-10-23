import { PRODUCTS, FRUIT_TOPPINGS, EXTRA_TOPPINGS, BUSINESS_CONFIG } from "./data/products.js";
import { generateWhatsAppUrl } from "./utils/whatsapp.js";

// ============================================================================
// ESTADO DE LA APLICACIÓN (Persistente en localStorage, sin MySQL)
// ============================================================================
const STORAGE_KEY = "julipop_cart_v1";

let cart = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
let activeFilter = "todos";

// Estado del Personalizador
let selectedBaseProduct = PRODUCTS[0]; // Por defecto: Rol de canela glaseado ($55)
let selectedToppings = [];
let customQuantity = 1;

// ============================================================================
// INICIALIZACIÓN
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  renderProductsGrid();
  renderCustomizer();
  updateCartUI();
  setupEventListeners();
});

// ============================================================================
// RENDERIZADO DEL MENÚ DE PRODUCTOS
// ============================================================================
function renderProductsGrid() {
  const grid = document.getElementById("products-grid");
  if (!grid) return;

  const filtered = activeFilter === "todos"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeFilter);

  grid.innerHTML = filtered.map((product) => `
    <article class="product-card bg-beige/45 border border-cafeRosado/30 rounded-3xl overflow-hidden flex flex-col justify-between shadow-sm">
      <div>
        <div class="relative h-56 overflow-hidden bg-beige">
          <img
            src="${product.image}"
            onerror="this.onerror=null; this.src='${product.fallbackImage}';"
            alt="${product.name}"
            class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <span class="absolute top-3 left-3 bg-crema/95 text-cafeOscuro text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            ${product.badge}
          </span>
          <span class="absolute bottom-3 right-3 bg-cafeOscuro text-crema font-display text-lg px-4 py-1 rounded-full shadow-md">
            $${product.price} ${BUSINESS_CONFIG.currency}
          </span>
        </div>

        <div class="p-6">
          <h3 class="font-display text-xl text-cafeOscuro">${product.name}</h3>
          <p class="text-sm text-cafeMedio mt-2 leading-relaxed">${product.description}</p>
        </div>
      </div>

      <div class="px-6 pb-6 pt-2 flex gap-2.5">
        <button
          data-add-id="${product.id}"
          class="add-direct-btn flex-1 bg-cafeOscuro hover:bg-cafeMedio text-crema py-3 px-4 rounded-2xl font-bold text-sm transition-all active:scale-95"
        >
          + Agregar al carrito
        </button>
        <button
          data-customize-id="${product.id}"
          class="customize-product-btn bg-crema hover:bg-cafeRosado hover:text-crema text-cafeOscuro border border-cafeOscuro/20 py-3 px-3.5 rounded-2xl font-bold text-xs transition-all"
          title="Agregar toppings a este rol"
        >
           Toppings
        </button>
      </div>
    </article>
  `).join("");

  // Eventos de botones de cada tarjeta
  document.querySelectorAll(".add-direct-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const prod = PRODUCTS.find((p) => p.id === btn.dataset.addId);
      if (prod) {
        addToCart(prod, [], 1);
      }
    });
  });

  document.querySelectorAll(".customize-product-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const prod = PRODUCTS.find((p) => p.id === btn.dataset.customizeId);
      if (prod) {
        selectedBaseProduct = prod;
        selectedToppings = [];
        customQuantity = 1;
        renderCustomizer();
        document.getElementById("personalizar")?.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

// ============================================================================
// RENDERIZADO DEL PERSONALIZADOR DE ROLES
// ============================================================================
function renderCustomizer() {
  const baseList = document.getElementById("customizer-base-list");
  const fruitList = document.getElementById("customizer-fruit-list");
  const extraList = document.getElementById("customizer-extra-list");

  // 1. Roles base
  baseList.innerHTML = PRODUCTS.map((prod) => {
    const isSelected = selectedBaseProduct.id === prod.id;
    return `
      <button
        type="button"
        data-base-id="${prod.id}"
        class="select-base-btn text-left p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between ${
          isSelected
            ? "border-cafeOscuro bg-beige/80 shadow-sm"
            : "border-beige bg-crema hover:border-cafeRosado"
        }"
      >
        <div class="pr-2">
          <span class="block font-bold text-sm text-cafeOscuro">${prod.name}</span>
          <span class="text-xs text-cafeMedio">$${prod.price} MXN</span>
        </div>
        <span class="w-5 h-5 rounded-full border-2 border-cafeOscuro flex items-center justify-center text-xs ${
          isSelected ? "bg-cafeOscuro text-crema" : ""
        }">
          ${isSelected ? "✓" : ""}
        </span>
      </button>
    `;
  }).join("");

  // 2. Toppings frutales
  fruitList.innerHTML = FRUIT_TOPPINGS.map((top) => renderToppingButton(top)).join("");

  // 3. Toppings adicionales
  extraList.innerHTML = EXTRA_TOPPINGS.map((top) => renderToppingButton(top)).join("");

  // Listeners de selección de base
  document.querySelectorAll(".select-base-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const found = PRODUCTS.find((p) => p.id === btn.dataset.baseId);
      if (found) {
        selectedBaseProduct = found;
        renderCustomizer();
      }
    });
  });

  // Listeners de selección de toppings
  document.querySelectorAll(".toggle-topping-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const toppingId = btn.dataset.toppingId;
      const allToppings = [...FRUIT_TOPPINGS, ...EXTRA_TOPPINGS];
      const toppingObj = allToppings.find((t) => t.id === toppingId);
      if (!toppingObj) return;

      const exists = selectedToppings.some((t) => t.id === toppingId);
      if (exists) {
        selectedToppings = selectedToppings.filter((t) => t.id !== toppingId);
      } else {
        selectedToppings.push(toppingObj);
      }
      renderCustomizer();
    });
  });

  updateCustomizerSummary();
}

function renderToppingButton(topping) {
  const isSelected = selectedToppings.some((t) => t.id === topping.id);
  return `
    <button
      type="button"
      data-topping-id="${topping.id}"
      class="toggle-topping-btn p-3.5 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
        isSelected
          ? "border-cafeOscuro bg-cafeOscuro text-crema shadow-sm"
          : "border-beige bg-crema text-cafeOscuro hover:border-cafeRosado"
      }"
    >
      <div>
        <span class="text-lg mr-1">${topping.icon}</span>
        <span class="font-bold text-sm block mt-0.5">${topping.name}</span>
        <span class="text-xs ${isSelected ? "text-beige" : "text-cafeMedio"}">+$${topping.price} MXN</span>
      </div>
      <span class="w-5 h-5 rounded-md border flex items-center justify-center text-xs ${
        isSelected ? "border-crema bg-crema text-cafeOscuro font-bold" : "border-cafeOscuro/40"
      }">
        ${isSelected ? "✓" : "+"}
      </span>
    </button>
  `;
}

function updateCustomizerSummary() {
  const toppingsCost = selectedToppings.reduce((acc, t) => acc + t.price, 0);
  const unitPrice = selectedBaseProduct.price + toppingsCost;
  const totalPrice = unitPrice * customQuantity;

  document.getElementById("summary-base-name").textContent = selectedBaseProduct.name;
  document.getElementById("summary-base-price").textContent = `$${selectedBaseProduct.price}`;
  document.getElementById("custom-qty-value").textContent = customQuantity;
  document.getElementById("summary-unit-breakdown").textContent = `$${unitPrice} MXN por unidad`;
  document.getElementById("summary-total-price").textContent = `$${totalPrice} MXN`;

  const badgesContainer = document.getElementById("summary-toppings-badges");
  if (selectedToppings.length === 0) {
    badgesContainer.innerHTML = `<span class="text-xs text-cafeRosado italic">Sin toppings extra seleccionados</span>`;
  } else {
    badgesContainer.innerHTML = selectedToppings.map((t) => `
      <span class="inline-flex items-center gap-1.5 bg-beige text-cafeOscuro px-3 py-1 rounded-full text-xs font-bold">
        <span>${t.icon} ${t.name}</span>
        <span class="text-cafeMedio">(+$${t.price})</span>
      </span>
    `).join("");
  }
}

// ============================================================================
// GESTIÓN DEL CARRITO DE COMPRAS
// ============================================================================
function addToCart(baseProduct, toppingsArray, quantity) {
  const sortedToppings = [...toppingsArray].sort((a, b) => a.id.localeCompare(b.id));
  const signature = `${baseProduct.id}__${sortedToppings.map((t) => t.id).join("-")}`;
  const toppingsTotal = sortedToppings.reduce((sum, t) => sum + t.price, 0);
  const unitPrice = baseProduct.price + toppingsTotal;

  const existingIndex = cart.findIndex((item) => item.signature === signature);

  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      signature,
      productId: baseProduct.id,
      productName: baseProduct.name,
      basePrice: baseProduct.price,
      toppings: sortedToppings,
      unitPrice,
      quantity
    });
  }

  saveCart();
  updateCartUI();
  showToast(`¡${quantity}x ${baseProduct.name} agregado al pedido!`);
}

function updateItemQuantity(signature, delta) {
  const index = cart.findIndex((item) => item.signature === signature);
  if (index === -1) return;

  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  saveCart();
  updateCartUI();
}

function removeCartItem(signature) {
  cart = cart.filter((item) => item.signature !== signature);
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function updateCartUI() {
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const grandTotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  document.getElementById("cart-badge").textContent = totalItems;
  document.getElementById("cart-total-nav").textContent = `$${grandTotal}`;
  document.getElementById("cart-items-count-subtitle").textContent = `${totalItems} producto(s) en tu canasta`;
  document.getElementById("cart-grand-total").textContent = `$${grandTotal} ${BUSINESS_CONFIG.currency}`;

  const container = document.getElementById("cart-items-container");

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="h-full flex flex-col items-center justify-center text-center py-12 text-cafeMedio">
        <span class="text-5xl mb-3"></span>
        <p class="font-display text-xl text-cafeOscuro">Tu carrito está vacío</p>
        <p class="text-xs mt-1 max-w-xs">Agrega un rol de canela del menú o arma el tuyo en el personalizador.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = cart.map((item) => {
    const subtotal = item.unitPrice * item.quantity;
    const toppingsHtml = item.toppings.length > 0
      ? `<div class="mt-1.5 flex flex-wrap gap-1">
          ${item.toppings.map((t) => `<span class="bg-beige px-2 py-0.5 rounded-md text-[11px] font-semibold text-cafeOscuro">+ ${t.name} ($${t.price})</span>`).join("")}
         </div>`
      : `<span class="block text-xs text-cafeRosado mt-0.5">Sin toppings extra</span>`;

    return `
      <div class="bg-beige/40 border border-cafeRosado/30 rounded-2xl p-4 space-y-3">
        <div class="flex items-start justify-between gap-2">
          <div>
            <h4 class="font-bold text-sm text-cafeOscuro">${item.productName}</h4>
            ${toppingsHtml}
          </div>
          <button data-remove="${item.signature}" class="remove-item-btn text-xs text-cafeRosado hover:text-cafeOscuro font-bold">
            Eliminar
          </button>
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-cafeRosado/20">
          <div class="flex items-center gap-2">
            <button data-minus="${item.signature}" class="qty-minus-btn w-7 h-7 rounded-lg bg-crema hover:bg-cafeOscuro hover:text-crema font-bold text-sm">-</button>
            <span class="font-bold text-sm w-6 text-center">${item.quantity}</span>
            <button data-plus="${item.signature}" class="qty-plus-btn w-7 h-7 rounded-lg bg-crema hover:bg-cafeOscuro hover:text-crema font-bold text-sm">+</button>
          </div>
          <div class="text-right">
            <span class="text-[11px] text-cafeMedio block">$${item.unitPrice} c/u</span>
            <span class="font-display text-lg text-cafeOscuro">$${subtotal} MXN</span>
          </div>
        </div>
      </div>
    `;
  }).join("");

  container.querySelectorAll(".qty-minus-btn").forEach((btn) => {
    btn.addEventListener("click", () => updateItemQuantity(btn.dataset.minus, -1));
  });
  container.querySelectorAll(".qty-plus-btn").forEach((btn) => {
    btn.addEventListener("click", () => updateItemQuantity(btn.dataset.plus, 1));
  });
  container.querySelectorAll(".remove-item-btn").forEach((btn) => {
    btn.addEventListener("click", () => removeCartItem(btn.dataset.remove));
  });
}

// ============================================================================
// EVENTOS GENERALES Y ENLACE DE WHATSAPP
// ============================================================================
function setupEventListeners() {
  // Filtros del menú
  document.querySelectorAll(".menu-filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeFilter = btn.dataset.filter;
      document.querySelectorAll(".menu-filter-btn").forEach((b) => {
        b.className = "menu-filter-btn bg-beige text-cafeOscuro hover:bg-cafeRosado hover:text-crema px-5 py-2.5 rounded-full text-sm font-bold transition-all";
      });
      btn.className = "menu-filter-btn bg-cafeOscuro text-crema px-5 py-2.5 rounded-full text-sm font-bold shadow-sm transition-all";
      renderProductsGrid();
    });
  });

  // Cantidad del personalizador
  document.getElementById("custom-qty-minus")?.addEventListener("click", () => {
    if (customQuantity > 1) {
      customQuantity--;
      updateCustomizerSummary();
    }
  });

  document.getElementById("custom-qty-plus")?.addEventListener("click", () => {
    customQuantity++;
    updateCustomizerSummary();
  });

  // Botón agregar rol personalizado
  document.getElementById("add-custom-to-cart-btn")?.addEventListener("click", () => {
    addToCart(selectedBaseProduct, selectedToppings, customQuantity);
    selectedToppings = [];
    customQuantity = 1;
    renderCustomizer();
    openCartDrawer();
  });

  // Abrir / Cerrar Carrito
  document.getElementById("open-cart-btn")?.addEventListener("click", openCartDrawer);
  document.getElementById("close-cart-btn")?.addEventListener("click", closeCartDrawer);
  document.getElementById("cart-overlay")?.addEventListener("click", closeCartDrawer);

  // Vaciar carrito
  document.getElementById("clear-cart-btn")?.addEventListener("click", () => {
    cart = [];
    saveCart();
    updateCartUI();
  });

  // Finalizar pedido por WhatsApp
  document.getElementById("checkout-whatsapp-btn")?.addEventListener("click", () => {
    if (cart.length === 0) {
      showToast("Agrega al menos un rol de canela antes de enviar tu pedido");
      return;
    }
    const customerName = document.getElementById("customer-name-input")?.value || "";
    const customerNotes = document.getElementById("customer-notes-input")?.value || "";
    const whatsappUrl = generateWhatsAppUrl(cart, customerName, customerNotes);
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  });
}

function openCartDrawer() {
  const overlay = document.getElementById("cart-overlay");
  const drawer = document.getElementById("cart-drawer");
  overlay.classList.remove("hidden");
  setTimeout(() => overlay.classList.remove("opacity-0"), 10);
  drawer.classList.remove("translate-x-full");
}

function closeCartDrawer() {
  const overlay = document.getElementById("cart-overlay");
  const drawer = document.getElementById("cart-drawer");
  overlay.classList.add("opacity-0");
  drawer.classList.add("translate-x-full");
  setTimeout(() => overlay.classList.add("hidden"), 300);
}

let toastTimeout;
function showToast(message) {
  const toast = document.getElementById("toast-notification");
  const text = document.getElementById("toast-message");
  if (!toast || !text) return;

  text.textContent = message;
  toast.classList.remove("opacity-0", "translate-y-4");

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.add("opacity-0", "translate-y-4");
  }, 2600);
}