import { BRAND, LOOKS, PRODUCTS, BLOG_POSTS } from "./data.js";

/** ---------- Helpers ---------- **/
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const money = (n) => Number(n).toFixed(2);

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

/** ---------- Cart (localStorage) ---------- **/
const CART_KEY = "stylegod_cart_v1";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) ?? [];
  } catch {
    return [];
  }
}

function setCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCartCount();
}

function addToCart(productId) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  const cart = getCart();
  const found = cart.find((i) => i.id === productId);

  if (found) found.qty += 1;
  else cart.push({ id: productId, qty: 1 });

  setCart(cart);
  toast(`${product.name} added to cart ✔️`);
}

function removeFromCart(productId) {
  const cart = getCart().filter((i) => i.id !== productId);
  setCart(cart);
  renderCartPanel();
}

function changeQty(productId, delta) {
  const cart = getCart();
  const item = cart.find((i) => i.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    setCart(cart.filter((i) => i.id !== productId));
  } else {
    setCart(cart);
  }
  renderCartPanel();
}

function cartTotals() {
  const cart = getCart();
  let total = 0;
  let count = 0;

  for (const item of cart) {
    const product = PRODUCTS.find((p) => p.id === item.id);
    if (!product) continue;
    total += product.price * item.qty;
    count += item.qty;
  }
  return { total, count };
}

function renderCartCount() {
  const el = $("#cartCount");
  if (!el) return;
  el.textContent = cartTotals().count;
}

/** ---------- Toast ---------- **/
let toastTimer = null;
function toast(msg) {
  const el = $("#toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
}

/** ---------- UI: Header / brand ---------- **/
function renderBrandBits() {
  const brandNameEls = $$(".brandName");
  for (const el of brandNameEls) el.textContent = BRAND.name;

  const brandTagEls = $$(".brandTagline");
  for (const el of brandTagEls) el.textContent = BRAND.tagline;

  const igEls = $$(".brandInstagram");
  for (const el of igEls) el.href = BRAND.instagram;
}

/** ---------- Home: Looks ---------- **/
function renderLooksGrid() {
  const grid = $("#looksGrid");
  if (!grid) return;

  grid.innerHTML = LOOKS.map(
    (l) => `
    <a class="lookCard" href="${BRAND.instagram}" target="_blank" rel="noreferrer">
      <img src="${l.img}" alt="${l.title}" loading="lazy"/>
      <div class="lookMeta">
        <div class="lookTitle">${l.title}</div>
        <div class="lookSub">View on Instagram</div>
      </div>
    </a>
  `
  ).join("");
}

/** ---------- Shop: Products ---------- **/
function renderProductGrid() {
  const grid = $("#productGrid");
  if (!grid) return;

  const filters = $("#categoryFilters");
  const search = $("#shopSearch");

  const getFiltered = () => {
    const q = (search?.value ?? "").trim().toLowerCase();
    const active = filters?.querySelector("[data-active='true']")?.dataset?.cat ?? "All";

    return PRODUCTS.filter((p) => {
      const matchesCat = active === "All" ? true : p.category === active;
      const matchesQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchesCat && matchesQ;
    });
  };

  const render = () => {
    const list = getFiltered();
    grid.innerHTML = list
      .map(
        (p) => `
      <div class="productCard">
        <button class="productImgBtn" data-open-product="${p.id}" aria-label="Open ${p.name}">
          <img src="${p.img}" alt="${p.name}" loading="lazy"/>
        </button>
        <div class="productBody">
          <div class="productTop">
            <div>
              <div class="pill">${p.category}</div>
              <div class="productName">${p.name}</div>
            </div>
            <div class="productPrice">$${money(p.price)}</div>
          </div>
          <div class="productDesc">${p.description}</div>
          <div class="productActions">
            <button class="btn btnPrimary" data-add="${p.id}">Add to cart</button>
            <button class="btn btnGhost" data-open-product="${p.id}">Details</button>
          </div>
        </div>
      </div>
    `
      )
      .join("");

    // attach events
    $$("[data-add]").forEach((b) =>
      b.addEventListener("click", () => addToCart(b.dataset.add))
    );

    $$("[data-open-product]").forEach((b) =>
      b.addEventListener("click", () => openProductModal(b.dataset.openProduct))
    );
  };

  // Filters UI
  if (filters) {
    const cats = ["All", ...new Set(PRODUCTS.map((p) => p.category))];
    filters.innerHTML = cats
      .map(
        (c, idx) =>
          `<button class="chip" data-cat="${c}" data-active="${idx === 0}">${c}</button>`
      )
      .join("");

    $$(".chip", filters).forEach((chip) => {
      chip.addEventListener("click", () => {
        $$(".chip", filters).forEach((x) => x.dataset.active = "false");
        chip.dataset.active = "true";
        render();
      });
    });
  }

  if (search) search.addEventListener("input", render);

  render();
}

/** ---------- Product modal ---------- **/
function openProductModal(productId) {
  const p = PRODUCTS.find((x) => x.id === productId);
  const modal = $("#modal");
  const content = $("#modalContent");
  if (!p || !modal || !content) return;

  content.innerHTML = `
    <div class="modalGrid">
      <img class="modalImg" src="${p.img}" alt="${p.name}"/>
      <div>
        <div class="pill">${p.category}</div>
        <h2 class="modalTitle">${p.name}</h2>
        <div class="modalPrice">$${money(p.price)}</div>
        <p class="modalDesc">${p.description}</p>
        <div class="modalBtns">
          <button class="btn btnPrimary" id="modalAdd">Add to cart</button>
          <a class="btn btnGhost" href="${BRAND.instagram}" target="_blank" rel="noreferrer">See style inspo</a>
        </div>
        <div class="finePrint">Shipping + payments can be connected to Stripe when you’re ready.</div>
      </div>
    </div>
  `;

  $("#modalAdd")?.addEventListener("click", () => addToCart(p.id));
  modal.classList.add("open");
}

function setupModal() {
  const modal = $("#modal");
  if (!modal) return;

  $("#modalClose")?.addEventListener("click", () => modal.classList.remove("open"));
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("open");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") modal.classList.remove("open");
  });
}

/** ---------- Cart panel ---------- **/
function setupCartPanel() {
  const openBtn = $("#openCart");
  const closeBtn = $("#closeCart");
  const panel = $("#cartPanel");

  if (openBtn && panel) openBtn.addEventListener("click", () => { panel.classList.add("open"); renderCartPanel(); });
  if (closeBtn && panel) closeBtn.addEventListener("click", () => panel.classList.remove("open"));
}

function renderCartPanel() {
  const listEl = $("#cartItems");
  const totalEl = $("#cartTotal");
  if (!listEl || !totalEl) return;

  const cart = getCart();
  if (cart.length === 0) {
    listEl.innerHTML = `<div class="emptyState">Your cart is empty. Add something elegant ✨</div>`;
    totalEl.textContent = "0.00";
    return;
  }

  const rows = cart.map((item) => {
    const p = PRODUCTS.find((x) => x.id === item.id);
    if (!p) return "";
    return `
      <div class="cartRow">
        <img class="cartThumb" src="${p.img}" alt="${p.name}"/>
        <div class="cartInfo">
          <div class="cartName">${p.name}</div>
          <div class="cartMeta">$${money(p.price)} • <span class="pill">${p.category}</span></div>
          <div class="qty">
            <button class="qtyBtn" data-qty="${p.id}" data-d="-1">–</button>
            <span class="qtyNum">${item.qty}</span>
            <button class="qtyBtn" data-qty="${p.id}" data-d="1">+</button>
            <button class="linkBtn" data-remove="${p.id}">Remove</button>
          </div>
        </div>
        <div class="cartLine">$${money(p.price * item.qty)}</div>
      </div>
    `;
  }).join("");

  listEl.innerHTML = rows;

  const { total } = cartTotals();
  totalEl.textContent = money(total);

  $$("[data-remove]").forEach((b) =>
    b.addEventListener("click", () => removeFromCart(b.dataset.remove))
  );

  $$("[data-qty]").forEach((b) =>
    b.addEventListener("click", () => changeQty(b.dataset.qty, Number(b.dataset.d)))
  );

  $("#checkoutBtn")?.addEventListener("click", () => {
    // Placeholder checkout:
    // You can replace this with Stripe Checkout later.
    toast("Checkout is ready for Stripe integration 💳");
  });
}

/** ---------- Blog ---------- **/
function renderBlogList() {
  const grid = $("#blogGrid");
  if (!grid) return;

  grid.innerHTML = BLOG_POSTS
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map(
      (p) => `
    <a class="postCard" href="post.html?slug=${encodeURIComponent(p.slug)}">
      <img src="${p.cover}" alt="${p.title}" loading="lazy"/>
      <div class="postBody">
        <div class="postDate">${formatDate(p.date)}</div>
        <div class="postTitle">${p.title}</div>
        <div class="postExcerpt">${p.excerpt}</div>
        <div class="postRead">Read post →</div>
      </div>
    </a>
  `
    )
    .join("");
}

function renderSinglePost() {
  const wrap = $("#postWrap");
  if (!wrap) return;

  const params = new URLSearchParams(location.search);
  const slug = params.get("slug");
  const post = BLOG_POSTS.find((p) => p.slug === slug) ?? BLOG_POSTS[0];

  wrap.innerHTML = `
    <div class="postHero">
      <img src="${post.cover}" alt="${post.title}" />
    </div>
    <div class="postHeader">
      <div class="postDate">${formatDate(post.date)}</div>
      <h1 class="postH1">${post.title}</h1>
      <p class="postLead">${post.excerpt}</p>
    </div>
    <article class="postContent">${markdownToHtml(post.content)}</article>
  `;
}

// super tiny markdown-ish renderer (safe-ish, no HTML injection from content)
function markdownToHtml(md) {
  const esc = (s) => s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

  const lines = esc(md).split("\n");

  const html = lines.map((line) => {
    const t = line.trim();
    if (!t) return "";
    if (t.startsWith("### ")) return `<h3>${t.slice(4)}</h3>`;
    if (t.startsWith("## ")) return `<h2>${t.slice(3)}</h2>`;
    if (t.startsWith("- ")) return `<li>${t.slice(2)}</li>`;
    if (t.startsWith("**") && t.endsWith("**") && t.length > 4) return `<p><strong>${t.slice(2, -2)}</strong></p>`;
    return `<p>${t}</p>`;
  }).join("\n");

  // wrap loose <li> in <ul>
  return html.replace(/(?:<li>.*<\/li>\s*)+/g, (m) => `<ul>${m}</ul>`);
}

/** ---------- Contact ---------- **/
function setupContactForm() {
  const form = $("#contactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#cName")?.value?.trim();
    toast(`Thanks ${name || "love"} — message received ✔️`);
    form.reset();
  });
}

/** ---------- Boot ---------- **/
function init() {
  renderBrandBits();
  setupModal();
  setupCartPanel();
  setupContactForm();
  renderCartCount();

  renderLooksGrid();
  renderProductGrid();
  renderBlogList();
  renderSinglePost();

  // If cart panel exists on page, keep it in sync
  window.addEventListener("storage", renderCartCount);
}

document.addEventListener("DOMContentLoaded", init);
