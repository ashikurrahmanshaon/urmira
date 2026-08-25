// URMIRA Main Application Logic
import { categories, products, siteConfig, featuredProductSpotlight, whyUrmiraFeatures, brandStoryData } from './data/products.js';

// State
let cart = JSON.parse(localStorage.getItem('urmira_cart')) || [
  { ...products[0], quantity: 1 },
  { ...products[2], quantity: 1 }
];
let wishlist = JSON.parse(localStorage.getItem('urmira_wishlist')) || [1, 3];
let currentCategoryFilter = 'all';
let spotlightSelectedSize = featuredProductSpotlight.sizes.find(s => s.default) || featuredProductSpotlight.sizes[0];

// Convert English numbers to Bangla digits
export function toBanglaNumber(n) {
  if (n === null || n === undefined) return '';
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return n.toString().replace(/\d/g, d => banglaDigits[d]);
}

// Format Bangla Taka
export function formatTaka(amount) {
  return `৳${toBanglaNumber(amount.toLocaleString('en-IN'))}`;
}

// Toast Notification
export function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}" style="color: ${type === 'success' ? '#10b981' : '#ef4444'};"></i>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
  renderProducts();
  renderSpotlight();
  renderWhyUrmira();
  renderProductDetailsPage();
  updateCartUI();
  updateWishlistUI();
  setupEventListeners();
});

// 1. Render Category Cards (6 Rectangular Cards)
function renderCategories() {
  const container = document.getElementById('categories-container');
  if (!container) return;

  container.innerHTML = categories.map(cat => `
    <div class="category-card" data-category="${cat.id}">
      <div class="category-card-img-wrap">
        <span class="category-card-badge">${cat.badge}</span>
        <img src="${cat.image}" alt="${cat.name}" loading="lazy" />
      </div>
      <div class="category-card-content">
        <h3 class="category-card-title">${cat.name}</h3>
        <span class="category-card-count">${cat.count}</span>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const catId = card.dataset.category;
      filterProductsByCategory(catId);
    });
  });
}

function filterProductsByCategory(catId) {
  if (!catId || catId === 'all') {
    renderProducts(products);
    return;
  }
  const filtered = products.filter(p => p.category === catId);
  const container = document.getElementById('products-container');
  if (container) {
    renderProducts(filtered);
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    window.location.href = `/shop.html?category=${catId}`;
  }
}

window.filterProductsByCategory = filterProductsByCategory;

window.filterShop = function(catId, btnElement) {
  const tabs = document.querySelectorAll('#shop-filter-tabs .filter-tab');
  tabs.forEach(t => {
    t.classList.remove('btn-primary', 'active');
    t.classList.add('btn-outline');
  });
  if (btnElement) {
    btnElement.classList.remove('btn-outline');
    btnElement.classList.add('btn-primary', 'active');
  }

  if (catId === 'all') {
    renderProducts(products);
  } else {
    const filtered = products.filter(p => p.category === catId);
    renderProducts(filtered);
  }
};

// 2. Render Best Sellers Products Grid (all 6 catalog products)
function renderProducts(productList = products) {
  const container = document.getElementById('products-container');
  if (!container) return;

  if (productList.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
        <i class="fa-solid fa-box-open" style="font-size: 36px; margin-bottom: 10px; color: var(--muted-gold);"></i>
        <p style="font-size: 16px; font-weight: 600;">কোনো পণ্য খুঁজে পাওয়া যায়নি!</p>
        <button class="btn btn-outline btn-sm" style="margin-top: 12px;" id="reset-filter-btn">সবগুলো পণ্য দেখুন</button>
      </div>
    `;
    document.getElementById('reset-filter-btn')?.addEventListener('click', () => {
      currentCategoryFilter = 'all';
      renderProducts(products);
    });
    return;
  }

  container.innerHTML = productList.map(product => {
    const isWishlisted = wishlist.includes(product.id);
    let badgeHtml = '';
    if (product.badge) {
      const badgeClass = product.badgeType === 'best' ? 'badge-bestseller' :
                          product.badgeType === 'new' ? 'badge-new' : 'badge-discount';
      badgeHtml = `<span class="badge ${badgeClass}">${product.badge}</span>`;
    }

    const waText = encodeURIComponent(`হ্যালো URMIRA, আমি "${product.name}" (মূল্য: ৳${product.price}) অর্ডার করতে চাই।`);
    const waUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${waText}`;

    return `
      <div class="product-card" data-product-id="${product.id}">
        <div>
          <div class="product-card-top">
            ${badgeHtml ? `<div class="product-tag-pill">${badgeHtml}</div>` : ''}
            
            <button class="product-wishlist-btn ${isWishlisted ? 'active-wishlist' : ''}" 
                    title="পছন্দের তালিকায় রাখুন"
                    onclick="window.toggleWishlist(${product.id})">
              <i class="fa-${isWishlisted ? 'solid' : 'regular'} fa-heart"></i>
            </button>

            <a href="/product.html?id=${product.id}">
              <img src="${product.image}" alt="${product.name}" loading="lazy" />
            </a>
          </div>

          <div class="product-info">
            <h3 class="product-title">
              <a href="/product.html?id=${product.id}" style="text-decoration: none; color: inherit;">${product.name}</a>
            </h3>
            
            <div class="product-rating-row">
              <div class="star-rating">
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star-half-stroke"></i>
              </div>
              <span class="rating-count">(${toBanglaNumber(product.reviewsCount)})</span>
            </div>

            <div class="product-price-row">
              <span class="current-price">${formatTaka(product.price)}</span>
              ${product.originalPrice ? `<span class="original-price">${formatTaka(product.originalPrice)}</span>` : ''}
            </div>
          </div>
        </div>

        <div class="product-card-actions">
          <button class="btn-card-add" onclick="window.addToCart(${product.id})">
            <i class="fa-solid fa-cart-plus"></i>
            <span>কার্ট যোগ করুন</span>
          </button>
          <a href="${waUrl}" target="_blank" rel="noopener" class="btn-card-whatsapp" title="WhatsApp এ অর্ডার করুন">
            <i class="fa-brands fa-whatsapp"></i>
          </a>
        </div>
      </div>
    `;
  }).join('');
}

// 3. Render Product Spotlight Section (Pure Desi Cow Ghee)
function renderSpotlight() {
  const container = document.getElementById('spotlight-container');
  if (!container) return;

  const item = featuredProductSpotlight;

  container.innerHTML = `
    <div class="spotlight-card">
      <div class="spotlight-gallery">
        <div class="spotlight-main-img-wrap">
          <img id="spotlight-main-img" src="${item.images[0]}" alt="${item.title}" />
        </div>
        <div class="spotlight-thumbnails">
          ${item.images.map((img, idx) => `
            <div class="spotlight-thumb ${idx === 0 ? 'active' : ''}" onclick="window.switchSpotlightImage('${img}', this)">
              <img src="${img}" alt="Thumbnail ${idx + 1}" />
            </div>
          `).join('')}
        </div>
      </div>

      <div class="spotlight-details">
        <div>
          <span class="label-pill" style="margin-bottom: 8px;"><i class="fa-solid fa-crown" style="color: var(--muted-gold);"></i> স্পেশাল স্পটলাইট</span>
          <h2 class="spotlight-title serif-font">${item.title}</h2>
          <p style="font-size: 13.5px; color: var(--muted-gold-dark); font-weight: 700; margin-top: 4px;">${item.tagline}</p>
        </div>

        <div class="product-rating-row">
          <div class="star-rating">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
          </div>
          <span class="rating-count" style="font-size: 13px; font-weight: 600; color: var(--dark-text);">৫.০ (${toBanglaNumber(item.reviewsCount)} ভেরিফাইড রিভিউ)</span>
        </div>

        <p class="spotlight-desc">${item.description}</p>

        <div class="spotlight-benefits-list">
          ${item.benefits.map(b => `
            <div class="spotlight-benefit-item">
              <i class="fa-solid fa-circle-check"></i>
              <span>${b}</span>
            </div>
          `).join('')}
        </div>

        <div class="spotlight-sizes-wrap">
          <span style="font-size: 13px; font-weight: 700; color: var(--dark-text);">সাইজ / ওজন সিলেক্ট করুন:</span>
          <div class="spotlight-size-pills">
            ${item.sizes.map(s => `
              <button class="size-pill ${s.key === spotlightSelectedSize.key ? 'active' : ''}" 
                      onclick="window.selectSpotlightSize('${s.key}')">
                ${s.label}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="spotlight-price-row">
          <span class="spotlight-price" id="spotlight-price-val">${formatTaka(spotlightSelectedSize.price)}</span>
          <span class="original-price" id="spotlight-orig-price" style="font-size: 15px;">${formatTaka(spotlightSelectedSize.originalPrice)}</span>
        </div>

        <div class="spotlight-actions">
          <button class="btn btn-primary" onclick="window.addSpotlightToCart()">
            <i class="fa-solid fa-bag-shopping"></i>
            <span>এখনই কার্টে নিন</span>
          </button>
          <a id="spotlight-wa-btn" href="#" target="_blank" rel="noopener" class="btn btn-whatsapp-hero">
            <i class="fa-brands fa-whatsapp" style="font-size: 18px; color: #25D366;"></i>
            <span>WhatsApp এ অর্ডার</span>
          </a>
        </div>
      </div>
    </div>
  `;

  updateSpotlightWhatsAppLink();
}

window.switchSpotlightImage = function(imgSrc, el) {
  const mainImg = document.getElementById('spotlight-main-img');
  if (mainImg) mainImg.src = imgSrc;
  document.querySelectorAll('.spotlight-thumb').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
};

window.selectSpotlightSize = function(sizeKey) {
  const size = featuredProductSpotlight.sizes.find(s => s.key === sizeKey);
  if (!size) return;
  spotlightSelectedSize = size;

  document.querySelectorAll('.size-pill').forEach(pill => {
    pill.classList.toggle('active', pill.textContent.trim() === size.label);
  });

  const priceEl = document.getElementById('spotlight-price-val');
  const origPriceEl = document.getElementById('spotlight-orig-price');
  if (priceEl) priceEl.textContent = formatTaka(size.price);
  if (origPriceEl) origPriceEl.textContent = formatTaka(size.originalPrice);

  updateSpotlightWhatsAppLink();
};

function updateSpotlightWhatsAppLink() {
  const waBtn = document.getElementById('spotlight-wa-btn');
  if (!waBtn) return;
  const msg = encodeURIComponent(`হ্যালো URMIRA, আমি খাঁটি দেশি গরুর ঘি (${spotlightSelectedSize.label}, মূল্য: ৳${spotlightSelectedSize.price}) অর্ডার করতে চাই।`);
  waBtn.href = `https://wa.me/${siteConfig.whatsappNumber}?text=${msg}`;
}

window.addSpotlightToCart = function() {
  const spotlightItem = {
    id: 300 + (spotlightSelectedSize.key === '250ml' ? 1 : spotlightSelectedSize.key === '500ml' ? 2 : 3),
    name: `খাঁটি দেশি গরুর ঘি (${spotlightSelectedSize.label})`,
    price: spotlightSelectedSize.price,
    originalPrice: spotlightSelectedSize.originalPrice,
    image: featuredProductSpotlight.images[0],
    quantity: 1
  };

  const existing = cart.find(i => i.id === spotlightItem.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push(spotlightItem);
  }

  saveCart();
  updateCartUI();
  showToast(`"${spotlightItem.name}" কার্টে যোগ করা হয়েছে! 🛒`);
  openCartDrawer();
};

// 4. Render Why URMIRA Cards (4 Value Cards)
function renderWhyUrmira() {
  const container = document.getElementById('why-urmira-container');
  if (!container) return;

  container.innerHTML = whyUrmiraFeatures.map(item => `
    <div class="why-card">
      <div class="why-icon-box">
        <i class="${item.icon}"></i>
      </div>
      <h3 class="serif-font">${item.title}</h3>
      <p>${item.desc}</p>
    </div>
  `).join('');
}

// Wishlist
window.toggleWishlist = function(productId) {
  const index = wishlist.indexOf(productId);
  const product = products.find(p => p.id === productId);
  if (index === -1) {
    wishlist.push(productId);
    showToast(`"${product?.name || 'পণ্য'}" উইশলিস্টে যুক্ত হয়েছে! ❤️`);
  } else {
    wishlist.splice(index, 1);
    showToast('উইশলিস্ট থেকে সরানো হয়েছে', 'error');
  }
  localStorage.setItem('urmira_wishlist', JSON.stringify(wishlist));
  renderProducts(currentCategoryFilter === 'all' ? products : products.filter(p => p.category === currentCategoryFilter));
  updateWishlistUI();
};

function updateWishlistUI() {
  document.querySelectorAll('.wishlist-counter').forEach(b => {
    b.textContent = toBanglaNumber(wishlist.length);
  });
}

// Cart Functionality
window.addToCart = function(productId, qty = 1) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += qty;
  } else {
    cart.push({ ...product, quantity: qty });
  }

  saveCart();
  updateCartUI();
  showToast(`"${product.name}" কার্টে যোগ করা হয়েছে! 🛒`);
  openCartDrawer();
};

window.updateCartQty = function(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== productId);
    showToast('পণ্যটি কার্ট থেকে মুছে ফেলা হয়েছে', 'error');
  }
  saveCart();
  updateCartUI();
};

window.removeFromCart = function(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  updateCartUI();
  showToast('পণ্যটি কার্ট থেকে সরানো হয়েছে', 'error');
};

function saveCart() {
  localStorage.setItem('urmira_cart', JSON.stringify(cart));
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('.cart-counter').forEach(b => {
    b.textContent = toBanglaNumber(totalItems);
  });

  const container = document.getElementById('cart-drawer-items');
  const subtotalEl = document.getElementById('cart-subtotal-val');
  if (!container || !subtotalEl) return;

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  subtotalEl.textContent = formatTaka(subtotal);

  if (cart.length === 0) {
    container.innerHTML = `
      <div style="margin: auto; text-align: center; color: var(--text-muted); padding: 40px 20px;">
        <i class="fa-solid fa-basket-shopping" style="font-size: 48px; color: #d1c8b8; margin-bottom: 12px;"></i>
        <p style="font-size: 16px; font-weight: 700; color: var(--dark-text);">আপনার কার্ট খালি!</p>
        <p style="font-size: 13.5px; color: var(--text-muted); margin-top: 4px;">পছন্দের প্রাকৃতিক খাবার কার্টে যোগ করুন</p>
      </div>
    `;
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item-card">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
      <div class="cart-item-details">
        <h4 class="cart-item-title">${item.name}</h4>
        <div class="cart-item-price">${formatTaka(item.price)}</div>
        <div class="cart-qty-control">
          <button class="cart-qty-btn" onclick="window.updateCartQty(${item.id}, -1)">-</button>
          <span class="cart-qty-val">${toBanglaNumber(item.quantity)}</span>
          <button class="cart-qty-btn" onclick="window.updateCartQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <button onclick="window.removeFromCart(${item.id})" style="color: #ef4444; font-size: 16px; padding: 6px;" title="মুছুন">
        <i class="fa-regular fa-trash-can"></i>
      </button>
    </div>
  `).join('');
}

// Drawers & Modals
export function openCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('global-overlay');
  if (drawer && overlay) {
    drawer.classList.add('open');
    overlay.classList.add('active');
  }
}

export function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('global-overlay');
  if (drawer && overlay) {
    drawer.classList.remove('open');
    overlay.classList.remove('active');
  }
}

// Quick View Modal
window.openQuickView = function(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('quick-view-modal');
  const modalContent = document.getElementById('quick-view-content');
  const overlay = document.getElementById('global-overlay');

  if (!modal || !modalContent || !overlay) return;

  const waText = encodeURIComponent(`হ্যালো URMIRA, আমি "${product.name}" (মূল্য: ৳${product.price}) অর্ডার করতে চাই।`);

  modalContent.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 24px;">
      <div style="border-radius: var(--radius-sm); overflow: hidden; background: #fbf9f4;">
        <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 280px; object-fit: cover;" />
      </div>
      <div>
        <h3 class="serif-font" style="font-size: 20px; font-weight: 800; color: var(--primary-deep-green); margin-bottom: 6px;">${product.name}</h3>
        <p style="font-size: 12.5px; color: var(--muted-gold-dark); font-weight: 700; margin-bottom: 10px;">${product.englishName}</p>
        
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
          <span style="font-size: 22px; font-weight: 800; color: var(--primary-deep-green);">${formatTaka(product.price)}</span>
          ${product.originalPrice ? `<span style="font-size: 15px; color: #9ca3af; text-decoration: line-through;">${formatTaka(product.originalPrice)}</span>` : ''}
        </div>

        <p style="font-size: 14px; line-height: 1.6; color: var(--text-muted); margin-bottom: 14px;">${product.description}</p>

        <ul style="margin-bottom: 18px; display: flex; flex-direction: column; gap: 6px;">
          ${product.features.map(f => `
            <li style="font-size: 13px; display: flex; align-items: center; gap: 6px; color: var(--dark-text);">
              <i class="fa-solid fa-circle-check" style="color: var(--soft-leaf-green);"></i> ${f}
            </li>
          `).join('')}
        </ul>

        <div style="display: flex; gap: 10px;">
          <button class="btn btn-primary" style="flex: 1;" onclick="window.addToCart(${product.id}); window.closeModals();">
            <i class="fa-solid fa-cart-plus"></i> কার্টে যোগ করুন
          </button>
          <a href="https://wa.me/${siteConfig.whatsappNumber}?text=${waText}" target="_blank" rel="noopener" class="btn btn-whatsapp-hero" style="padding: 10px 14px;">
            <i class="fa-brands fa-whatsapp" style="font-size: 18px; color: #25D366;"></i>
          </a>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('open');
  overlay.classList.add('active');
};

// Checkout Modal
window.openCheckout = function() {
  if (cart.length === 0) {
    showToast('আপনার কার্ট খালি! অনুগ্রহ করে পণ্য যোগ করুন', 'error');
    return;
  }
  closeCartDrawer();
  const modal = document.getElementById('checkout-modal');
  const overlay = document.getElementById('global-overlay');
  if (modal && overlay) {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 70;
    const total = subtotal + shipping;

    document.getElementById('checkout-subtotal').textContent = formatTaka(subtotal);
    document.getElementById('checkout-shipping').textContent = formatTaka(shipping);
    document.getElementById('checkout-total').textContent = formatTaka(total);

    modal.classList.add('open');
    overlay.classList.add('active');
  }
};

window.closeModals = function() {
  document.querySelectorAll('.modal').forEach(m => m.classList.remove('open'));
  document.getElementById('cart-drawer')?.classList.remove('open');
  document.getElementById('mobile-drawer')?.classList.remove('open');
  document.getElementById('global-overlay')?.classList.remove('active');
};

// Event Listeners
function setupEventListeners() {
  document.querySelectorAll('.cart-open-trigger').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      openCartDrawer();
    });
  });

  document.getElementById('btn-close-cart')?.addEventListener('click', closeCartDrawer);

  document.getElementById('global-overlay')?.addEventListener('click', () => {
    window.closeModals();
  });

  // Mobile menu drawer
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const closeMobileDrawer = document.getElementById('btn-close-mobile-drawer');

  mobileToggle?.addEventListener('click', () => {
    mobileDrawer?.classList.add('open');
    document.getElementById('global-overlay')?.classList.add('active');
  });

  closeMobileDrawer?.addEventListener('click', () => {
    mobileDrawer?.classList.remove('open');
    document.getElementById('global-overlay')?.classList.remove('active');
  });

  // 3. Workable Search input with Instant Dropdown
  const searchInput = document.getElementById('header-search-input');
  const searchDropdown = document.getElementById('search-dropdown-menu');
  const searchResultsList = document.getElementById('search-results-list');
  const searchClearBtn = document.getElementById('search-clear-btn');

  function performSearch(query) {
    if (!query) {
      if (searchClearBtn) searchClearBtn.style.display = 'none';
      if (searchResultsList) searchResultsList.innerHTML = '';
      renderProducts(products);
      return;
    }

    if (searchClearBtn) searchClearBtn.style.display = 'flex';

    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.englishName.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    );

    // Render live dropdown list
    if (searchResultsList) {
      if (filtered.length === 0) {
        searchResultsList.innerHTML = `
          <div style="padding: 12px; text-align: center; color: var(--text-muted); font-size: 13px;">
            <i class="fa-solid fa-circle-info" style="margin-bottom: 4px; color: var(--muted-gold);"></i>
            <p>No products found for "${query}"</p>
          </div>
        `;
      } else {
        searchResultsList.innerHTML = filtered.map(p => `
          <div class="search-result-item" onclick="window.openQuickView(${p.id}); document.getElementById('search-dropdown-menu')?.classList.remove('active');">
            <img src="${p.image}" alt="${p.name}" class="search-result-img" />
            <div class="search-result-info">
              <h4 class="search-result-title">${p.name}</h4>
              <span class="search-result-price">${formatTaka(p.price)}</span>
            </div>
            <button class="btn btn-sm btn-outline" style="padding: 4px 10px; font-size: 12px;" onclick="event.stopPropagation(); window.addToCart(${p.id});">
              Add
            </button>
          </div>
        `).join('');
      }
    }

    // Also filter main product grid
    renderProducts(filtered);
  }

  searchInput?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    searchDropdown?.classList.add('active');
    performSearch(query);
  });

  searchInput?.addEventListener('focus', () => {
    searchDropdown?.classList.add('active');
    const query = searchInput.value.toLowerCase().trim();
    performSearch(query);
  });

  searchClearBtn?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    performSearch('');
    searchDropdown?.classList.remove('active');
  });

  // Global search tag trigger
  window.triggerSearchTag = function(tag) {
    if (searchInput) {
      searchInput.value = tag;
      searchDropdown?.classList.add('active');
      performSearch(tag.toLowerCase().trim());
      searchInput.focus();
    }
  };

  // Close search dropdown on click outside
  document.addEventListener('click', (e) => {
    if (!document.getElementById('header-search-box')?.contains(e.target)) {
      searchDropdown?.classList.remove('active');
    }
  });

  // Escape key closes search dropdown
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchDropdown?.classList.remove('active');
    }
  });

  // Checkout form
  document.getElementById('checkout-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('order-name').value;
    showToast(`ধন্যবাদ ${name}! আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।`, 'success');
    cart = [];
    saveCart();
    updateCartUI();
    window.closeModals();
  });

  // Newsletter form
  document.getElementById('newsletter-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletter-email').value;
    showToast(`ধন্যবাদ! আপনার সাবস্ক্রিপশন সফল হয়েছে (${email})`, 'success');
    document.getElementById('newsletter-email').value = '';
  });

  // Best sellers view all
  document.getElementById('view-all-products-btn')?.addEventListener('click', () => {
    currentCategoryFilter = 'all';
    renderProducts(products);
    showToast('সবগুলো জনপ্রিয় পণ্য প্রদর্শন করা হচ্ছে');
  });
}

// ==========================================================================
// 8. Dedicated Product Details Page Engine (Luxury E-commerce)
// ==========================================================================
let currentProductPageQty = 1;
let currentProductDetailsItem = null;
let selectedProductPagePrice = 0;
let selectedProductPageSizeLabel = '';

function renderProductDetailsPage() {
  const container = document.getElementById('product-details-container');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get('id'), 10) || 1;
  const product = products.find(p => p.id === productId) || products[0];
  currentProductDetailsItem = product;
  currentProductPageQty = 1;
  selectedProductPagePrice = product.price;
  selectedProductPageSizeLabel = product.unit;

  // Update Page Title and Breadcrumbs
  document.title = `${product.name} - URMIRA | প্রিমিয়াম খাঁটি খাবার`;
  const catObj = categories.find(c => c.id === product.category);
  const breadcrumbCat = document.getElementById('product-breadcrumb-category');
  const breadcrumbTitle = document.getElementById('product-breadcrumb-title');
  const tabReviewsCount = document.getElementById('tab-reviews-count');
  
  if (breadcrumbCat) breadcrumbCat.textContent = catObj ? catObj.name : 'প্রাকৃতিক খাদ্য';
  if (breadcrumbTitle) breadcrumbTitle.textContent = product.name;
  if (tabReviewsCount) tabReviewsCount.textContent = toBanglaNumber((product.reviews || []).length);

  const isWishlisted = wishlist.includes(product.id);
  const waText = encodeURIComponent(`হ্যালো URMIRA, আমি "${product.name}" (${selectedProductPageSizeLabel}, মূল্য: ৳${product.price}) অর্ডার করতে চাই।`);
  const waUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${waText}`;

  // Pack sizes options if available
  const sizeOptions = [
    { label: product.unit, price: product.price, origPrice: product.originalPrice, active: true },
    { label: "২x ডাবল প্যাক", price: Math.round(product.price * 1.9), origPrice: Math.round(product.price * 2.2), active: false }
  ];

  container.innerHTML = `
    <div class="product-detail-hero-grid">
      <!-- Product Image Gallery Left -->
      <div style="position: sticky; top: 96px;">
        <div class="product-gallery-card">
          ${product.badge ? `<span class="badge badge-bestseller" style="position: absolute; top: 18px; left: 18px; font-size: 13.5px; padding: 6px 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">${product.badge}</span>` : ''}
          
          <button class="product-wishlist-btn ${isWishlisted ? 'active-wishlist' : ''}" 
                  style="position: absolute; top: 18px; right: 18px; width: 44px; height: 44px; border-radius: 50%; font-size: 18px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);"
                  title="পছন্দের তালিকায় রাখুন"
                  onclick="window.toggleWishlist(${product.id})">
            <i class="fa-${isWishlisted ? 'solid' : 'regular'} fa-heart"></i>
          </button>

          <img id="main-product-img" src="${product.image}" alt="${product.name}" />
        </div>

        <!-- Purity and Trust Highlights -->
        <div class="product-trust-perks-grid">
          <div class="trust-perk-card">
            <div class="trust-perk-icon"><i class="fa-solid fa-leaf"></i></div>
            <div>
              <h4 style="font-size: 13px; font-weight: 700; color: var(--dark-text);">১০০% প্রাকৃতিক</h4>
              <p style="font-size: 11.5px; color: var(--text-muted); margin-top: 1px;">ভেজাল ও কেমিক্যালমুক্ত</p>
            </div>
          </div>
          <div class="trust-perk-card">
            <div class="trust-perk-icon"><i class="fa-solid fa-truck-fast"></i></div>
            <div>
              <h4 style="font-size: 13px; font-weight: 700; color: var(--dark-text);">ক্যাশ অন ডেলিভারি</h4>
              <p style="font-size: 11.5px; color: var(--text-muted); margin-top: 1px;">হাতে পেয়ে মূল্য পরিশোধ</p>
            </div>
          </div>
          <div class="trust-perk-card">
            <div class="trust-perk-icon"><i class="fa-solid fa-box-open"></i></div>
            <div>
              <h4 style="font-size: 13px; font-weight: 700; color: var(--dark-text);">ফুড-গ্রেড প্যাক</h4>
              <p style="font-size: 11.5px; color: var(--text-muted); margin-top: 1px;">তাজা ও স্বাস্থ্যসম্মত</p>
            </div>
          </div>
          <div class="trust-perk-card">
            <div class="trust-perk-icon"><i class="fa-solid fa-rotate-left"></i></div>
            <div>
              <h4 style="font-size: 13px; font-weight: 700; color: var(--dark-text);">সহজ রিটার্ন</h4>
              <p style="font-size: 11.5px; color: var(--text-muted); margin-top: 1px;">নিরাপদ রিফান্ড গ্যারান্টি</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Details Right -->
      <div>
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px; flex-wrap: wrap;">
          <span style="background: rgba(18, 59, 39, 0.08); color: var(--primary-deep-green); font-size: 13px; font-weight: 700; padding: 4px 12px; border-radius: var(--radius-full);">
            ${catObj ? catObj.name : 'প্রাকৃতিক খাদ্য'}
          </span>
          <span style="display: inline-flex; align-items: center; gap: 6px; color: #166534; font-size: 13px; font-weight: 700;">
            <span class="pulse-dot"></span> স্টকে আছে (তাজা ঘরোয়া ব্যাচ)
          </span>
        </div>

        <h1 class="serif-font" style="font-size: 32px; font-weight: 800; color: var(--primary-deep-green); line-height: 1.3;">${product.name}</h1>
        <p style="font-size: 14.5px; color: var(--muted-gold-dark); font-weight: 700; margin-top: 4px; letter-spacing: 0.5px;">${product.englishName}</p>

        <!-- Rating Row with Click to Scroll to Reviews -->
        <div class="product-rating-box">
          <div class="star-rating" style="font-size: 16px;">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
          </div>
          <span style="font-size: 14.5px; font-weight: 800; color: var(--dark-text);">${product.rating}</span>
          <button class="rating-badge-pill" onclick="window.scrollToReviewsTab()">
            <i class="fa-regular fa-comment-dots"></i>
            <span>${toBanglaNumber(product.reviewsCount)} ভেরিফাইড রিভিউ</span>
          </button>
        </div>

        <!-- Price Banner -->
        <div class="product-price-banner">
          <div style="display: flex; align-items: baseline; gap: 14px; flex-wrap: wrap;">
            <span style="font-size: 34px; font-weight: 800; color: var(--primary-deep-green); font-family: var(--font-sans);" id="product-detail-price">${formatTaka(product.price)}</span>
            ${product.originalPrice ? `<span style="font-size: 18px; color: var(--text-muted); text-decoration: line-through;">${formatTaka(product.originalPrice)}</span>` : ''}
            ${product.originalPrice ? `<span class="badge badge-discount">৳${toBanglaNumber(product.originalPrice - product.price)} সাশ্রয় (২১% ছাড়)</span>` : ''}
          </div>
          <p style="font-size: 13.5px; color: var(--text-muted); margin-top: 6px;">
            প্যাক সাইজ: <strong style="color: var(--dark-text);" id="selected-size-text">${product.unit}</strong> | ক্যাশ অন ডেলিভারি প্রযোজ্য
          </p>
        </div>

        <!-- Pack Size Variant Selector -->
        <div style="margin-bottom: 22px;">
          <span style="font-size: 13.5px; font-weight: 700; color: var(--dark-text); display: block; margin-bottom: 8px;">প্যাকেজ সাইজ পছন্দ করুন:</span>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;" id="product-size-pills">
            <button class="size-pill active" onclick="window.selectProductSize('${product.unit}', ${product.price}, this)">
              ${product.unit} — ${formatTaka(product.price)}
            </button>
            <button class="size-pill" onclick="window.selectProductSize('২x ডাবল প্যাক (স্পেশাল ছাড়)', ${Math.round(product.price * 1.9)}, this)">
              ২x ডাবল প্যাক — ${formatTaka(Math.round(product.price * 1.9))} (১০% এক্সট্রা ছাড়)
            </button>
          </div>
        </div>

        <!-- Short Description -->
        <p style="font-size: 15.5px; line-height: 1.7; color: var(--dark-text); margin-bottom: 22px;">
          ${product.description}
        </p>

        <!-- Key Features Checklist -->
        <div style="display: flex; flex-direction: column; gap: 9px; margin-bottom: 24px; background: #ffffff; padding: 18px 20px; border-radius: 14px; border: 1.5px solid var(--border-light); box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
          ${(product.features || []).map(f => `
            <div style="display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 600; color: var(--dark-text);">
              <i class="fa-solid fa-circle-check" style="color: var(--primary-deep-green); font-size: 16px;"></i>
              <span>${f}</span>
            </div>
          `).join('')}
        </div>

        <!-- Quantity Selector & Actions -->
        <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px;">
          <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
            <span style="font-size: 14.5px; font-weight: 700; color: var(--dark-text);">পরিমাণ (Quantity):</span>
            <div class="qty-stepper" style="height: 44px;">
              <button class="qty-btn" onclick="window.adjustProductPageQty(-1)"><i class="fa-solid fa-minus"></i></button>
              <input type="number" id="product-detail-qty" class="qty-input" value="1" min="1" max="50" readonly />
              <button class="qty-btn" onclick="window.adjustProductPageQty(1)"><i class="fa-solid fa-plus"></i></button>
            </div>
            <span style="font-size: 14px; font-weight: 700; color: var(--primary-deep-green);" id="product-qty-subtotal">
              (মোট: ${formatTaka(product.price)})
            </span>
          </div>

          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <button class="btn btn-primary btn-lg" style="flex: 1; min-width: 200px;" onclick="window.addProductPageToCart(${product.id})">
              <i class="fa-solid fa-basket-shopping"></i>
              <span>কার্টে যোগ করুন</span>
            </button>
            <button class="btn btn-gold btn-lg" style="flex: 1; min-width: 200px;" onclick="window.buyProductPageNow(${product.id})">
              <i class="fa-solid fa-bolt"></i>
              <span>সরাসরি অর্ডার করুন</span>
            </button>
          </div>

          <a id="product-page-wa-btn" href="${waUrl}" target="_blank" rel="noopener" class="btn btn-whatsapp-hero" style="width: 100%; justify-content: center; padding: 14px; font-size: 15.5px; font-weight: 700;">
            <i class="fa-brands fa-whatsapp" style="font-size: 22px;"></i>
            <span>WhatsApp-এ সরাসরি অর্ডার দিন</span>
          </a>
        </div>
      </div>
    </div>
  `;

  // Render Tabs Initial Content (Description)
  renderProductTabPane(product, 'desc');

  // Render Related Products
  const relatedContainer = document.getElementById('related-products-grid');
  if (relatedContainer) {
    const related = products.filter(p => p.id !== product.id).slice(0, 3);
    relatedContainer.innerHTML = related.map(p => `
      <div class="product-card" data-product-id="${p.id}">
        <div class="product-card-top">
          <a href="/product.html?id=${p.id}">
            <img src="${p.image}" alt="${p.name}" loading="lazy" />
          </a>
        </div>
        <div class="product-info">
          <h3 class="product-title">
            <a href="/product.html?id=${p.id}" style="text-decoration: none; color: inherit;">${p.name}</a>
          </h3>
          <div class="product-price-row">
            <span class="price-current">${formatTaka(p.price)}</span>
            <span class="product-unit">(${p.unit})</span>
          </div>
          <button class="btn btn-primary btn-sm" style="width: 100%; margin-top: 10px;" onclick="window.addToCart(${p.id})">
            <i class="fa-solid fa-basket-shopping"></i>
            <span>কার্টে যোগ করুন</span>
          </button>
        </div>
      </div>
    `).join('');
  }
}

function renderProductTabPane(product, tabName) {
  const content = document.getElementById('product-tab-content');
  if (!content) return;

  if (tabName === 'desc') {
    content.innerHTML = `
      <div style="max-width: 860px; line-height: 1.8; color: var(--dark-text);">
        <h3 class="serif-font" style="font-size: 22px; color: var(--primary-deep-green); margin-bottom: 12px;">পণ্যের বিশদ পরিচয়</h3>
        <p style="font-size: 15.5px; margin-bottom: 16px;">${product.longDescription || product.description}</p>
        
        <h4 style="font-size: 16px; font-weight: 700; color: var(--primary-deep-green); margin-top: 20px; margin-bottom: 10px;">কেন URMIRA-র ${product.name} সেরা?</h4>
        <ul style="padding-left: 20px; font-size: 15px; display: flex; flex-direction: column; gap: 8px;">
          ${(product.features || []).map(f => `<li><strong>${f}</strong> — শতভাগ বিশুদ্ধতার প্রতিশ্রুতি।</li>`).join('')}
          <li>পরিচ্ছন্ন স্বাস্থ্যকর পরিবেশে ঘরোয়া যত্নে প্রস্তুত।</li>
          <li>কোনো প্রকার রাসায়নিক, সিন্থেটিক রং বা কৃত্রিম প্রিজারভেটিভ নেই।</li>
        </ul>
      </div>
    `;
  } else if (tabName === 'ingredients') {
    const ingredients = product.ingredients || ["১০০% প্রাকৃতিক খাঁটি উপাদান"];
    const nutrition = product.nutrition || [
      { label: "পুষ্টিমান", value: "প্রাকৃতিক ভিটামিন ও মিনারেল সমৃদ্ধ" }
    ];

    content.innerHTML = `
      <div style="max-width: 860px;">
        <h3 class="serif-font" style="font-size: 22px; color: var(--primary-deep-green); margin-bottom: 14px;">ব্যবহৃত প্রাকৃতিক উপকরণ</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px;">
          ${ingredients.map(ing => `
            <span style="background: #f7f3ea; border: 1.5px solid var(--border-light); padding: 8px 16px; border-radius: var(--radius-full); font-size: 14px; font-weight: 600; color: var(--primary-deep-green);">
              <i class="fa-solid fa-leaf" style="color: var(--muted-gold); margin-right: 6px;"></i> ${ing}
            </span>
          `).join('')}
        </div>

        <h3 class="serif-font" style="font-size: 22px; color: var(--primary-deep-green); margin-bottom: 14px;">পুষ্টিমান তথ্য (Nutritional Values)</h3>
        <table class="nutrition-table">
          <tbody>
            ${nutrition.map(n => `
              <tr>
                <td style="font-weight: 700; color: var(--dark-text);">${n.label}</td>
                <td style="color: var(--primary-deep-green); font-weight: 700;">${n.value}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } else if (tabName === 'usage') {
    content.innerHTML = `
      <div style="max-width: 860px; line-height: 1.8; color: var(--dark-text);">
        <h3 class="serif-font" style="font-size: 22px; color: var(--primary-deep-green); margin-bottom: 12px;">ব্যবহারের নিয়ম ও পরামর্শ</h3>
        <p style="font-size: 15.5px; margin-bottom: 20px;">${product.usageTips || 'প্রতিদিনের স্বাস্থ্যকর ডায়েটের অংশ হিসেবে নিয়মিত গ্রহণ করুন।'}</p>

        <h3 class="serif-font" style="font-size: 22px; color: var(--primary-deep-green); margin-bottom: 12px;">সংরক্ষণ পদ্ধতি</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px;">
          <div style="background: #faf7ef; border: 1.5px solid var(--border-light); border-radius: 14px; padding: 18px;">
            <i class="fa-solid fa-sun" style="color: var(--muted-gold-dark); font-size: 26px; margin-bottom: 8px;"></i>
            <h4 style="font-size: 15px; font-weight: 700; color: var(--primary-deep-green);">শুষ্ক ও ছায়াযুক্ত স্থান</h4>
            <p style="font-size: 13.5px; color: var(--dark-text); margin-top: 4px;">সরাসরি সূর্যালোক ও অতিরিক্ত আর্দ্রতা থেকে দূরে স্বাভাবিক তাপমাত্রায় রাখুন।</p>
          </div>
          <div style="background: #faf7ef; border: 1.5px solid var(--border-light); border-radius: 14px; padding: 18px;">
            <i class="fa-solid fa-box" style="color: var(--muted-gold-dark); font-size: 26px; margin-bottom: 8px;"></i>
            <h4 style="font-size: 15px; font-weight: 700; color: var(--primary-deep-green);">বায়ুরোধী কাঁচের জার</h4>
            <p style="font-size: 13.5px; color: var(--dark-text); margin-top: 4px;">ব্যবহারের পর জারের ঢাকনা শক্ত করে বন্ধ রাখুন যাতে ফ্রেশনেস বজায় থাকে।</p>
          </div>
        </div>
      </div>
    `;
  } else if (tabName === 'reviews') {
    const reviews = product.reviews || [
      { author: "তাহমিদ হাসান", rating: 5, date: "১৫ আগস্ট, ২০২৪", comment: "অসাধারণ কোয়ালিটি! প্রোডাক্টটি একদম ফ্রেশ ও খাঁটি।" },
      { author: "রোকেয়া পারভীন", rating: 5, date: "৮ আগস্ট, ২০২৪", comment: "প্যাকেজিং খুবই সুন্দর ছিল এবং ডেলিভারিও খুব দ্রুত পেয়েছি।" }
    ];

    content.innerHTML = `
      <div style="max-width: 860px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;">
          <div>
            <h3 class="serif-font" style="font-size: 22px; color: var(--primary-deep-green);">ভেরিফাইড কাস্টমার রিভিউ</h3>
            <p style="font-size: 13.5px; color: var(--text-muted);">শতভাগ সন্তুষ্ট গ্রাহকের বাস্তব অভিজ্ঞতা</p>
          </div>
          <button class="btn btn-outline btn-sm" onclick="document.getElementById('add-review-form-wrap')?.classList.toggle('hidden-form')">
            <i class="fa-solid fa-pen"></i> রিভিউ লিখুন
          </button>
        </div>

        <!-- Add Review Form (Collapsible) -->
        <div id="add-review-form-wrap" class="hidden-form" style="background: #faf7ef; border: 1.5px solid var(--border-light); border-radius: 16px; padding: 22px; margin-bottom: 24px;">
          <h4 style="font-size: 16px; font-weight: 700; color: var(--primary-deep-green); margin-bottom: 12px;">আপনার মূল্যবান রিভিউ লিখুন</h4>
          <form onsubmit="window.submitProductReview(event)">
            <div class="form-group">
              <label style="font-size: 13px; font-weight: 700;">আপনার নাম *</label>
              <input type="text" id="review-user-name" class="form-input" placeholder="আপনার পুরো নাম" required />
            </div>
            <div class="form-group">
              <label style="font-size: 13px; font-weight: 700;">রেটিং প্রদান করুন *</label>
              <select id="review-user-rating" class="form-input" style="height: 42px;">
                <option value="5">⭐⭐⭐⭐⭐ (৫/৫ - অসাধারণ)</option>
                <option value="4">⭐⭐⭐⭐ (৪/৫ - খুব ভালো)</option>
                <option value="3">⭐⭐⭐ (৩/৫ - সন্তোষজনক)</option>
              </select>
            </div>
            <div class="form-group">
              <label style="font-size: 13px; font-weight: 700;">আপনার মতামত বা অভিজ্ঞতা *</label>
              <textarea id="review-user-comment" class="form-input" rows="3" placeholder="খাবারের স্বাদ, প্যাকেজিং বা গুণমান কেমন লেগেছে লিখুন..." required></textarea>
            </div>
            <button type="submit" class="btn btn-primary btn-sm">
              <i class="fa-solid fa-paper-plane"></i> রিভিউ জমা দিন
            </button>
          </form>
        </div>

        <div id="reviews-list-container">
          ${reviews.map(r => `
            <div class="review-card-item">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <div class="review-author-avatar">${r.author.charAt(0)}</div>
                  <div>
                    <span style="font-weight: 700; color: var(--primary-deep-green); font-size: 15px; display: block;">${r.author}</span>
                    <span style="background: #e2f7ea; color: #166534; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 4px;">
                      <i class="fa-solid fa-circle-check"></i> ভেরিফাইড ক্রেতা
                    </span>
                  </div>
                </div>
                <span style="font-size: 12.5px; color: var(--text-muted);">${r.date}</span>
              </div>
              <div class="star-rating" style="font-size: 13px; margin-bottom: 8px;">
                ${Array(r.rating || 5).fill('<i class="fa-solid fa-star"></i>').join('')}
              </div>
              <p style="font-size: 14.5px; color: var(--dark-text); line-height: 1.6;">${r.comment}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

window.selectProductSize = function(sizeLabel, price, btnElement) {
  selectedProductPageSizeLabel = sizeLabel;
  selectedProductPagePrice = price;

  const pills = document.querySelectorAll('#product-size-pills .size-pill');
  pills.forEach(p => p.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');

  const priceDisplay = document.getElementById('product-detail-price');
  const sizeText = document.getElementById('selected-size-text');
  const subtotalDisplay = document.getElementById('product-qty-subtotal');
  
  if (priceDisplay) priceDisplay.textContent = formatTaka(price);
  if (sizeText) sizeText.textContent = sizeLabel;
  if (subtotalDisplay) subtotalDisplay.textContent = `(মোট: ${formatTaka(price * currentProductPageQty)})`;

  // Update WhatsApp link
  if (currentProductDetailsItem) {
    const waText = encodeURIComponent(`হ্যালো URMIRA, আমি "${currentProductDetailsItem.name}" (${sizeLabel}, মূল্য: ৳${price}) অর্ডার করতে চাই।`);
    const waBtn = document.getElementById('product-page-wa-btn');
    if (waBtn) waBtn.href = `https://wa.me/${siteConfig.whatsappNumber}?text=${waText}`;
  }
};

window.scrollToReviewsTab = function() {
  const tabs = document.querySelectorAll('#product-info-tabs .product-tab-btn');
  tabs.forEach(t => t.classList.remove('active'));
  tabs[3]?.classList.add('active');
  if (currentProductDetailsItem) {
    renderProductTabPane(currentProductDetailsItem, 'reviews');
  }
  document.getElementById('product-info-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

window.switchProductTab = function(tabName, btnElement) {
  const tabs = document.querySelectorAll('#product-info-tabs .product-tab-btn');
  tabs.forEach(t => t.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');

  if (currentProductDetailsItem) {
    renderProductTabPane(currentProductDetailsItem, tabName);
  }
};

window.adjustProductPageQty = function(delta) {
  const qtyInput = document.getElementById('product-detail-qty');
  const subtotalDisplay = document.getElementById('product-qty-subtotal');
  if (!qtyInput) return;

  let newQty = currentProductPageQty + delta;
  if (newQty < 1) newQty = 1;
  if (newQty > 50) newQty = 50;

  currentProductPageQty = newQty;
  qtyInput.value = newQty;

  if (subtotalDisplay) {
    subtotalDisplay.textContent = `(মোট: ${formatTaka(selectedProductPagePrice * newQty)})`;
  }
};

window.addProductPageToCart = function(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += currentProductPageQty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: selectedProductPagePrice,
      unit: selectedProductPageSizeLabel,
      image: product.image,
      quantity: currentProductPageQty
    });
  }

  saveCart();
  updateCartUI();
  showToast(`"${product.name}" (${toBanglaNumber(currentProductPageQty)}টি) কার্টে যুক্ত হয়েছে!`);
  
  // Open Cart Drawer
  document.getElementById('cart-drawer')?.classList.add('open');
  document.getElementById('global-overlay')?.classList.add('active');
};

window.buyProductPageNow = function(productId) {
  window.addProductPageToCart(productId);
  window.openCheckout();
};

window.submitProductReview = function(e) {
  e.preventDefault();
  const nameInput = document.getElementById('review-user-name');
  const ratingInput = document.getElementById('review-user-rating');
  const commentInput = document.getElementById('review-user-comment');

  const newReview = {
    author: nameInput.value.trim(),
    rating: parseInt(ratingInput.value, 10) || 5,
    date: "আজকে",
    comment: commentInput.value.trim()
  };

  if (currentProductDetailsItem) {
    if (!currentProductDetailsItem.reviews) currentProductDetailsItem.reviews = [];
    currentProductDetailsItem.reviews.unshift(newReview);
  }

  showToast('আপনার রিভিউ সফলভাবে যুক্ত হয়েছে! ধন্যবাদ।', 'success');
  renderProductTabPane(currentProductDetailsItem, 'reviews');
};


