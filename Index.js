/**
 * APEXPARTS - Catálogo Automotriz
 * Estado, Filtros, Búsqueda y Carrito Persistente
 */

// DATA DE REPUESTOS
const PRODUCTS = [
    {
        id: "AP-101",
        name: "Pastillas de Freno Cerámicas Delanteras",
        category: "Frenos",
        brand: "Toyota",
        oem: "04465-02220",
        price: 185.00,
        stock: 12,
        image: "https://images.unsplash.com/photo-1600790142055-619df03207e6?w=400&q=80",
        badge: "OEM Genuine"
    },
    {
        id: "AP-102",
        name: "Discos Ventilados Perforados y Ranurados",
        category: "Frenos",
        brand: "Nissan",
        oem: "40206-4BA0A",
        price: 460.00,
        stock: 4,
        image: "https://images.unsplash.com/photo-1598449356475-b9f71db7d847?w=400&q=80",
        badge: "Racing Spec"
    },
    {
        id: "AP-103",
        name: "Amortiguadores Monotubo de Gas Traseros",
        category: "Suspensión",
        brand: "Honda",
        oem: "52611-T0A-A01",
        price: 320.00,
        stock: 8,
        image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=400&q=80",
        badge: "Alta Resistencia"
    },
    {
        id: "AP-104",
        name: "Coilovers Regulables en Altura y Dureza",
        category: "Suspensión",
        brand: "Subaru",
        oem: "20310-VA200",
        price: 1350.00,
        stock: 3,
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80",
        badge: "Track Edition"
    },
    {
        id: "AP-105",
        name: "Kit de Embrague Reforzado Stage 2",
        category: "Transmisión",
        brand: "Mitsubishi",
        oem: "2300A045",
        price: 890.00,
        stock: 5,
        image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=400&q=80",
        badge: "Heavy Duty"
    },
    {
        id: "AP-106",
        name: "Bomba de Gasolina de Alto Caudal 255 LPH",
        category: "Motor",
        brand: "Universal",
        oem: "GSS342",
        price: 280.00,
        stock: 14,
        image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&q=80",
        badge: "Performance"
    },
    {
        id: "AP-107",
        name: "Bujías de Iridio Laser Spark (Pack x4)",
        category: "Motor",
        brand: "Toyota",
        oem: "90919-01210",
        price: 160.00,
        stock: 22,
        image: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=400&q=80",
        badge: "OEM Genuine"
    },
    {
        id: "AP-108",
        name: "Alternador de Alto Rendimiento 140A",
        category: "Eléctrico",
        brand: "Nissan",
        oem: "23100-3TS2B",
        price: 740.00,
        stock: 0,
        image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&q=80",
        badge: "Sin Stock"
    }
];

// ESTADO GLOBAL DE LA APP
const state = {
    products: [...PRODUCTS],
    cart: JSON.parse(localStorage.getItem("apex_cart")) || [],
    filters: {
        search: "",
        category: "all",
        brand: "all",
        maxPrice: 1500,
        onlyInStock: false,
        sortBy: "featured"
    }
};

// ELEMENTOS DEL DOM
const elements = {
    productsGrid: document.getElementById("productsGrid"),
    noResults: document.getElementById("noResults"),
    visibleCount: document.getElementById("visibleCount"),
    searchInput: document.getElementById("searchInput"),
    clearSearchBtn: document.getElementById("clearSearchBtn"),
    categoryButtons: document.querySelectorAll("#categoryFilterContainer .pill"),
    brandSelect: document.getElementById("brandSelect"),
    priceRange: document.getElementById("priceRange"),
    priceValue: document.getElementById("priceValue"),
    stockOnlyCheckbox: document.getElementById("stockOnlyCheckbox"),
    sortSelect: document.getElementById("sortSelect"),
    resetFiltersBtn: document.getElementById("resetFiltersBtn"),
    emptyResetBtn: document.getElementById("emptyResetBtn"),

    // Carrito
    cartBtn: document.getElementById("cartBtn"),
    closeCartBtn: document.getElementById("closeCartBtn"),
    cartDrawer: document.getElementById("cartDrawer"),
    cartOverlay: document.getElementById("cartOverlay"),
    cartItemsList: document.getElementById("cartItemsList"),
    cartCountBadge: document.getElementById("cartCountBadge"),
    cartSubtotal: document.getElementById("cartSubtotal"),
    cartTotal: document.getElementById("cartTotal"),
    clearCartBtn: document.getElementById("clearCartBtn"),
    whatsappCheckoutBtn: document.getElementById("whatsappCheckoutBtn"),

    // Toast
    toast: document.getElementById("toastNotification"),
    toastMessage: document.getElementById("toastMessage")
};

// INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    updateCartBadge();
    setupEventListeners();
    if (window.lucide) lucide.createIcons();
});

// CONFIGURACIÓN DE LISTENERS
function setupEventListeners() {
    // Buscador con debounce
    elements.searchInput.addEventListener("input", (e) => {
        state.filters.search = e.target.value.trim().toLowerCase();
        elements.clearSearchBtn.classList.toggle("active", e.target.value.length > 0);
        renderProducts();
    });

    elements.clearSearchBtn.addEventListener("click", () => {
        elements.searchInput.value = "";
        state.filters.search = "";
        elements.clearSearchBtn.classList.remove("active");
        renderProducts();
    });

    // Filtro de categorías (Pills)
    elements.categoryButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            elements.categoryButtons.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            state.filters.category = btn.getAttribute("data-category");
            renderProducts();
        });
    });

    // Filtro de Marca
    elements.brandSelect.addEventListener("change", (e) => {
        state.filters.brand = e.target.value;
        renderProducts();
    });

    // Rango de precio
    elements.priceRange.addEventListener("input", (e) => {
        const val = Number(e.target.value);
        state.filters.maxPrice = val;
        elements.priceValue.textContent = `S/ ${val.toLocaleString("es-PE")}`;
        renderProducts();
    });

    // Checkbox de stock
    elements.stockOnlyCheckbox.addEventListener("change", (e) => {
        state.filters.onlyInStock = e.target.checked;
        renderProducts();
    });

    // Ordenamiento
    elements.sortSelect.addEventListener("change", (e) => {
        state.filters.sortBy = e.target.value;
        renderProducts();
    });

    // Botones de Reset
    elements.resetFiltersBtn.addEventListener("click", resetFilters);
    elements.emptyResetBtn.addEventListener("click", resetFilters);

    // Apertura y Cierre de Carrito
    elements.cartBtn.addEventListener("click", toggleCart);
    elements.closeCartBtn.addEventListener("click", toggleCart);
    elements.cartOverlay.addEventListener("click", toggleCart);

    // Acciones de Carrito
    elements.clearCartBtn.addEventListener("click", clearCart);
    elements.whatsappCheckoutBtn.addEventListener("click", checkoutWhatsApp);
}

// RESTABLECER FILTROS
function resetFilters() {
    state.filters = {
        search: "",
        category: "all",
        brand: "all",
        maxPrice: 1500,
        onlyInStock: false,
        sortBy: "featured"
    };

    elements.searchInput.value = "";
    elements.clearSearchBtn.classList.remove("active");
    elements.categoryButtons.forEach((b) => b.classList.toggle("active", b.getAttribute("data-category") === "all"));
    elements.brandSelect.value = "all";
    elements.priceRange.value = 1500;
    elements.priceValue.textContent = "S/ 1,500";
    elements.stockOnlyCheckbox.checked = false;
    elements.sortSelect.value = "featured";

    renderProducts();
}

// FILTRADO Y RENDERIZADO DE PRODUCTOS
function renderProducts() {
    let filtered = state.products.filter((item) => {
        const matchesSearch =
            item.name.toLowerCase().includes(state.filters.search) ||
            item.oem.toLowerCase().includes(state.filters.search) ||
            item.brand.toLowerCase().includes(state.filters.search);

        const matchesCategory = state.filters.category === "all" || item.category === state.filters.category;
        const matchesBrand = state.filters.brand === "all" || item.brand === state.filters.brand;
        const matchesPrice = item.price <= state.filters.maxPrice;
        const matchesStock = !state.filters.onlyInStock || item.stock > 0;

        return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesStock;
    });

    // Ordenamiento
    if (state.filters.sortBy === "price-asc") {
        filtered.sort((a, b) => a.price - b.price);
    } else if (state.filters.sortBy === "price-desc") {
        filtered.sort((a, b) => b.price - a.price);
    } else if (state.filters.sortBy === "name-asc") {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Render al DOM
    elements.visibleCount.textContent = filtered.length;

    if (filtered.length === 0) {
        elements.productsGrid.innerHTML = "";
        elements.noResults.classList.remove("hidden");
        return;
    }

    elements.noResults.classList.add("hidden");
    elements.productsGrid.innerHTML = filtered.map((prod) => `
    <article class="product-card">
      <div class="product-thumb">
        <span class="badge-tag">${prod.badge}</span>
        <img src="${prod.image}" alt="${prod.name}" loading="lazy">
      </div>
      <div class="product-info">
        <span class="oem-code">OEM: ${prod.oem}</span>
        <h3 class="product-name">${prod.name}</h3>
        <span class="product-compatibility">Compatibilidad: <strong>${prod.brand}</strong></span>
        
        <div class="product-card-footer">
          <span class="product-price">S/ ${prod.price.toFixed(2)}</span>
          <button 
            class="btn-add" 
            onclick="addToCart('${prod.id}')" 
            title="Añadir al carrito" 
            ${prod.stock === 0 ? "disabled style='opacity:0.4; cursor:not-allowed;'" : ""}
          >
            <i data-lucide="plus"></i>
          </button>
        </div>
      </div>
    </article>
  `).join("");

    if (window.lucide) lucide.createIcons();
}

// LOGICA DE CARRITO DE COMPRAS
window.addToCart = function (productId) {
    const product = state.products.find((p) => p.id === productId);
    if (!product || product.stock === 0) return;

    const existing = state.cart.find((item) => item.id === productId);

    if (existing) {
        if (existing.quantity >= product.stock) {
            showToast(`Stock máximo alcanzado para este repuesto`);
            return;
        }
        existing.quantity += 1;
    } else {
        state.cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartBadge();
    renderCartItems();
    showToast(`${product.name} añadido`);
};

function updateQuantity(productId, delta) {
    const item = state.cart.find((i) => i.id === productId);
    if (!item) return;

    item.quantity += delta;

    if (item.quantity <= 0) {
        state.cart = state.cart.filter((i) => i.id !== productId);
    }

    saveCart();
    updateCartBadge();
    renderCartItems();
}

function removeFromCart(productId) {
    state.cart = state.cart.filter((i) => i.id !== productId);
    saveCart();
    updateCartBadge();
    renderCartItems();
}

function clearCart() {
    state.cart = [];
    saveCart();
    updateCartBadge();
    renderCartItems();
}

function saveCart() {
    localStorage.setItem("apex_cart", JSON.stringify(state.cart));
}

function updateCartBadge() {
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    elements.cartCountBadge.textContent = totalItems;
}

function renderCartItems() {
    if (state.cart.length === 0) {
        elements.cartItemsList.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; color: var(--smoke-muted);">
        <i data-lucide="shopping-cart" style="width: 48px; height: 48px; margin: 0 auto 1rem; opacity: 0.3;"></i>
        <p>Tu carrito está vacío</p>
      </div>
    `;
        elements.cartSubtotal.textContent = "S/ 0.00";
        elements.cartTotal.textContent = "S/ 0.00";
        if (window.lucide) lucide.createIcons();
        return;
    }

    elements.cartItemsList.innerHTML = state.cart.map((item) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-details">
        <div>
          <h4 class="cart-item-title">${item.name}</h4>
          <span class="cart-item-price">S/ ${(item.price * item.quantity).toFixed(2)}</span>
        </div>
        <div class="cart-item-ctrls">
          <div class="qty-control">
            <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
            <span class="qty-display">${item.quantity}</span>
            <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
          </div>
          <button class="cart-item-delete" onclick="removeFromCart('${item.id}')" title="Eliminar">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </div>
    </div>
  `).join("");

    const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    elements.cartSubtotal.textContent = `S/ ${total.toFixed(2)}`;
    elements.cartTotal.textContent = `S/ ${total.toFixed(2)}`;

    if (window.lucide) lucide.createIcons();
}

function toggleCart() {
    const isOpen = elements.cartDrawer.classList.contains("open");
    if (!isOpen) {
        renderCartItems();
        elements.cartDrawer.classList.add("open");
        elements.cartOverlay.classList.add("open");
    } else {
        elements.cartDrawer.classList.remove("open");
        elements.cartOverlay.classList.remove("open");
    }
}

// CHECKOUT POR WHATSAPP
function checkoutWhatsApp() {
    if (state.cart.length === 0) {
        showToast("El carrito está vacío");
        return;
    }

    let message = "¡Hola! Quisiera realizar el pedido de los siguientes repuestos de ApexParts:\n\n";
    let total = 0;

    state.cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        message += `${index + 1}. ${item.name} (OEM: ${item.oem})\n   Cant: ${item.quantity} | Subtotal: S/ ${subtotal.toFixed(2)}\n`;
    });

    message += `\n*TOTAL ESTIMADO: S/ ${total.toFixed(2)}*\n¿Tienen disponibilidad para entrega?`;

    const encodedUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(encodedUrl, "_blank");
}

// NOTIFICACIÓN FLOTANTE (TOAST)
let toastTimer = null;
function showToast(msg) {
    elements.toastMessage.textContent = msg;
    elements.toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        elements.toast.classList.remove("show");
    }, 2600);
}

// EXPOSICIÓN GLOBAL DE MÉTODOS PARA ATRIBUTOS HTML ONCLICK
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;