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

            <img src="${product.image}" alt="${product.name}" loading="lazy" onclick="window.openQuickView(${product.id})" style="cursor: pointer;" />
          </div>

          <div class="product-info">
            <h3 class="product-title" onclick="window.openQuickView(${product.id})">${product.name}</h3>
            
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

// Category filter
function filterProductsByCategory(catId) {
  currentCategoryFilter = catId;
  const filtered = products.filter(p => p.category === catId);
  renderProducts(filtered);
  showToast(`"${categories.find(c => c.id === catId)?.name}" ফিল্টার করা হয়েছে`);

  const el = document.getElementById('best-sellers-section');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
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
