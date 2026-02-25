// --- CONFIGURACIÓN DE API LOCAL ---
const API_URL = '/api';

// State
let cart = [];
let allProducts = [];

// --- UTILITIES & UI COMPONENTS ---

// Toast Notification
function showToast(message, type = 'success') {
    // Create toast container if not exists
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed bottom-4 right-4 z-50 flex flex-col gap-2';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    toast.className = `${bgColor} text-white px-6 py-3 rounded shadow-lg transform transition-all duration-300 translate-y-10 opacity-0 flex items-center gap-2`;
    toast.innerHTML = `
        <span>${type === 'success' ? '✅' : '❌'}</span>
        <span class="font-medium text-sm">${message}</span>
    `;

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-10', 'opacity-0');
    });

    // Remove after 3s
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('mobile-menu-overlay');

    if (menu.classList.contains('-translate-x-full')) {
        menu.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden');
    } else {
        menu.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
    }
}

// Check click outside for user menu
window.onclick = function (event) {
    if (!event.target.matches('.user-menu-btn')) {
        const dropdowns = document.getElementsByClassName("user-menu-content");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (!openDropdown.classList.contains('hidden')) {
                openDropdown.classList.add('hidden');
            }
        }
    }
}

function toggleUserMenu(event) {
    if (event) event.stopPropagation();
    const menu = document.getElementById('user-menu-dropdown');
    if (menu) menu.classList.toggle('hidden');
}

// --- CORE LOGIC ---

// Fetch Products from Local API
async function fetchProducts() {
    try {
        console.log('🔍 Fetching products from:', `${API_URL}/productos`);
        const response = await fetch(`${API_URL}/productos`);
        const data = await response.json();
        const productos = data.productos || [];
        console.log(`✅ ${productos.length} productos cargados`);
        return productos;
    } catch (error) {
        console.error('❌ Error cargando productos:', error);
        showToast('Error al cargar productos', 'error');
        return [];
    }
}

// Render Functions
function renderProducts(lista) {
    const grid = document.getElementById('product-grid');
    const countEl = document.getElementById('products-count');

    if (countEl) countEl.textContent = `${lista.length} productos disponibles`;

    if (!lista || lista.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center py-20"><p class="text-gray-400 text-lg">No hay productos disponibles 😢</p></div>';
        return;
    }

    grid.innerHTML = lista.map(p => `
        <div class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group relative border border-gray-100">
            <!-- Badge Categoría -->
            <div class="absolute top-3 left-3 z-10">
                <span class="bg-black/70 backdrop-blur-sm text-white text-[10px] uppercase font-bold px-2 py-1 rounded-full tracking-wider">
                    ${p.categoria}
                </span>
            </div>

            <!-- Image Container -->
            <div class="relative aspect-[4/5] bg-gray-50 overflow-hidden cursor-pointer" onclick="openProductModal('${p._id}')">
                ${p.imagen_url ? `
                    <div class="w-full h-full relative">
                        <img src="${p.imagen_url}" 
                             loading="lazy"
                             class="product-image-main w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                             alt="${p.nombre}">
                    </div>
                ` : '<div class="w-full h-full flex items-center justify-center text-4xl bg-gray-100 text-gray-300">🖼️</div>'}
                
                <!-- Quick Add Overlay (Desktop) -->
                <div class="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden md:block z-20 bg-gradient-to-t from-black/50 to-transparent">
                    <button onclick="event.stopPropagation(); addToCart('${p._id}', '${p.nombre.replace(/'/g, "\\'")}', ${p.precio})" 
                        class="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-accent hover:text-white transition-colors shadow-lg flex items-center justify-center gap-2">
                        <span>Agregar</span>
                        <span class="text-xs font-normal opacity-70">$${p.precio.toFixed(2)}</span>
                    </button>
                </div>
            </div>
            
            <!-- Content -->
            <div class="p-4">
                <div class="mb-2">
                    <h3 class="font-bold text-gray-800 text-sm leading-tight line-clamp-2 group-hover:text-accent transition cursor-pointer" onclick="openProductModal('${p._id}')">
                        ${p.nombre}
                    </h3>
                    <p class="text-xs text-gray-400 mt-1 font-mono">${p.codigo}</p>
                </div>
                
                <div class="flex justify-between items-end mt-2">
                    <div>
                        <span class="text-lg font-extrabold text-gray-900">$${p.precio.toFixed(2)}</span>
                    </div>
                    <!-- Mobile Add Button -->
                    <button onclick="event.stopPropagation(); addToCart('${p._id}', '${p.nombre.replace(/'/g, "\\'")}', ${p.precio})" 
                        class="md:hidden bg-black text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-accent transition shadow-md active:scale-95">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Product Modal Logic
function openProductModal(id) {
    const product = allProducts.find(p => p._id === id);
    if (!product) return;

    // TODO: Implement Detailed Modal
    console.log('Opening product:', product);
    // For now, simpler interaction to verify extracting worked
}


// Cart Functions
function addToCart(id, nombre, precio) {
    cart.push({ id, nombre, precio });
    updateCartUI();

    // Add Cart Animation
    const cartBtn = document.querySelector('button[onclick="toggleCarrito()"]');
    if (cartBtn) {
        cartBtn.classList.add('scale-125', 'text-accent');
        setTimeout(() => cartBtn.classList.remove('scale-125', 'text-accent'), 200);
    }

    showToast(`Agregado: ${nombre}`);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function updateCartUI() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('total-price');
    const countEls = document.querySelectorAll('.cart-count-display'); // Mobile and Desktop badges

    // Update all badges
    countEls.forEach(el => {
        el.innerText = cart.length;
        el.classList.toggle('hidden', cart.length === 0);
    });

    const total = cart.reduce((sum, item) => sum + item.precio, 0);
    if (totalEl) totalEl.innerText = total.toFixed(2);

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center h-64 text-gray-400">
                <svg class="w-16 h-16 mb-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                <p class="text-gray-500 font-medium mb-4">Tu carrito está vacío</p>
                <button onclick="toggleCarrito()" class="px-6 py-2 bg-gray-100 text-gray-700 font-bold rounded-full hover:bg-gray-200 transition-colors shadow-sm">Seguir comprando</button>
            </div>
        `;
        return;
    }

    container.innerHTML = cart.map((item, index) => `
        <div class="flex items-center justify-between p-3 mb-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all transform hover:-translate-y-1 group">
            <div class="flex items-center gap-4">
                 <div class="w-12 h-12 bg-gray-50 flex items-center justify-center text-xl rounded-lg shadow-inner">🛍️</div>
                 <div>
                    <p class="font-bold text-sm text-gray-800 line-clamp-1 group-hover:text-accent transition-colors">${item.nombre}</p>
                    <p class="text-xs text-accent font-bold mt-1">$${item.precio.toFixed(2)}</p>
                 </div>
            </div>
            <button onclick="removeFromCart(${index})" class="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
        </div>
    `).join('');
}

// New Modal Checkout Flow
function openCheckoutModal() {
    if (cart.length === 0) return showToast("El carrito está vacío", "error");

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    if (!user.email || !token) {
        showToast('Inicia sesión para continuar', 'error');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
    }

    const modal = document.getElementById('checkout-modal');
    if (!modal) return; // Fallback?

    // Populate Modal
    const list = document.getElementById('checkout-review-list');
    const total = document.getElementById('checkout-total-display');

    if (list) {
        list.innerHTML = cart.map(item => `
            <div class="flex justify-between py-2 border-b border-dashed border-gray-200 last:border-0">
                <span class="text-sm text-gray-600">${item.nombre}</span>
                <span class="text-sm font-medium">$${item.precio.toFixed(2)}</span>
            </div>
        `).join('');
    }

    if (total) {
        const sum = cart.reduce((a, b) => a + b.precio, 0);
        total.innerText = `$${sum.toFixed(2)}`;
    }

    modal.classList.remove('hidden');
}

function closeCheckoutModal() {
    document.getElementById('checkout-modal').classList.add('hidden');
}

async function confirmCheckout() {
    const btn = document.getElementById('btn-confirm-checkout');
    btn.disabled = true;
    btn.innerHTML = `<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Procesando...`;

    const token = localStorage.getItem('token');

    try {
        // Agrupar items por ID
        const groupedCart = cart.reduce((acc, item) => {
            if (!acc[item.id]) {
                acc[item.id] = { producto: item.id, cantidad: 0 };
            }
            acc[item.id].cantidad += 1;
            return acc;
        }, {});

        const payload = {
            productos: Object.values(groupedCart),
            total: cart.reduce((sum, item) => sum + item.precio, 0)
        };

        const response = await fetch(`${API_URL}/checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            closeCheckoutModal();
            toggleCarrito(); // Close sidebar
            cart = [];
            updateCartUI();

            // Show Success Modal or Toast
            showToast('¡Compra realizada con éxito!', 'success');

            // Open Orders History
            setTimeout(() => {
                openOrdersModal();
            }, 1000);

        } else {
            showToast(data.error || 'Error al procesar pago', 'error');
        }
    } catch (error) {
        console.error('Checkout error:', error);
        showToast('Error de conexión', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'Confirmar Pago';
    }
}

// --- HISTORIAL DE ÓRDENES ---
async function openOrdersModal() {
    const modal = document.getElementById('orders-modal');
    const listContainer = document.getElementById('orders-list');
    modal.classList.remove('hidden');

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch(`${API_URL}/checkout/ordenes`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        if (data.ordenes && data.ordenes.length > 0) {
            listContainer.innerHTML = data.ordenes.map(orden => `
                <div class="border rounded-lg p-4 mb-3 hover:bg-gray-50 transition bg-white shadow-sm">
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <p class="font-bold text-sm text-gray-900">#${orden._id.slice(-6).toUpperCase()}</p>
                            <p class="text-[10px] text-gray-400 uppercase tracking-wide">${new Date(orden.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span class="px-2 py-1 text-[10px] font-bold uppercase rounded bg-gray-100 text-gray-600">
                            ${orden.estado}
                        </span>
                    </div>
                    <div class="text-sm text-gray-700 mb-2 border-t border-gray-100 pt-2 mt-2">
                        <ul class="text-xs text-gray-500 space-y-1">
                            ${orden.productos.map(p => `
                                <li class="flex justify-between">
                                    <span>${p.producto ? p.producto.nombre : 'Producto eliminado'}</span>
                                    <span>x${p.cantidad}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    <div class="text-right font-black text-gray-900 text-lg">
                        $${orden.total.toFixed(2)}
                    </div>
                </div>
            `).join('');
        } else {
            listContainer.innerHTML = `
                <div class="text-center py-12">
                    <div class="text-6xl mb-4 opacity-20">🛍️</div>
                    <p class="text-gray-500 font-medium">Aún no has realizado compras.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error cargando órdenes:', error);
        listContainer.innerHTML = '<p class="text-red-500 text-center">Error al cargar historial</p>';
    }
}

function closeOrdersModal() {
    document.getElementById('orders-modal').classList.add('hidden');
}

function toggleCarrito() {
    const sidebar = document.getElementById('carrito-sidebar');
    const overlay = document.getElementById('carrito-overlay');

    if (sidebar.classList.contains('translate-x-full')) {
        // Open
        sidebar.classList.remove('translate-x-full', 'hidden');
        overlay.classList.remove('hidden');
        setTimeout(() => overlay.classList.remove('opacity-0'), 10); // Fade in
    } else {
        // Close
        sidebar.classList.add('translate-x-full');
        overlay.classList.add('opacity-0');
        setTimeout(() => {
            overlay.classList.add('hidden');
            // sidebar.classList.add('hidden'); // Keep it visible for transition, just translated
        }, 300);
    }
}

// Filter Function
function filterProducts(gender) {
    console.log(`🔍 Filtrando por género: ${gender}`);

    // UI Update for Active Filter (Desktop)
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.dataset.gender === gender) link.classList.add('text-accent');
        else link.classList.remove('text-accent');
    });

    const filtered = gender === 'todos'
        ? allProducts
        : allProducts.filter(p => p.genero === gender || p.genero === 'Unisex');

    renderProducts(filtered);

    // Close mobile menu if open
    const menu = document.getElementById('mobile-menu');
    if (menu && !menu.classList.contains('-translate-x-full')) {
        toggleMobileMenu();
    }
}

// Auth Functions
function checkUserSession() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    updateAuthUI(user);
}

function updateAuthUI(user) {
    const authEls = document.querySelectorAll('.auth-section'); // Class for multple places (mobile/desktop)
    const userEls = document.querySelectorAll('.user-section');
    const userNameEls = document.querySelectorAll('.user-name-display');
    const adminLinks = document.querySelectorAll('.admin-link');

    if (user && user.email) {
        authEls.forEach(el => el.classList.add('hidden'));
        userEls.forEach(el => el.classList.remove('hidden'));
        userNameEls.forEach(el => el.textContent = user.nombre || user.email.split('@')[0]);

        if (user.nivel === 'admin') {
            adminLinks.forEach(el => el.classList.remove('hidden'));
        } else {
            adminLinks.forEach(el => el.classList.add('hidden'));
        }
    } else {
        authEls.forEach(el => el.classList.remove('hidden'));
        userEls.forEach(el => el.classList.add('hidden'));
        adminLinks.forEach(el => el.classList.add('hidden'));
    }
}

function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.reload();
}

// Global functions for inline HTML calls
window.toggleMobileMenu = toggleMobileMenu;
window.filterProducts = filterProducts;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.toggleCarrito = toggleCarrito;
window.openCheckoutModal = openCheckoutModal;
window.closeCheckoutModal = closeCheckoutModal;
window.confirmCheckout = confirmCheckout;
window.openOrdersModal = openOrdersModal;
window.closeOrdersModal = closeOrdersModal;
window.openProductModal = openProductModal;
window.toggleUserMenu = toggleUserMenu;
window.logout = logout;


// Initialize App
async function initializeApp() {
    console.log('🚀 Iniciando aplicación...');
    const produtos = await fetchProducts();
    allProducts = produtos;
    renderProducts(produtos);
    checkUserSession();
}

document.addEventListener('DOMContentLoaded', initializeApp);
