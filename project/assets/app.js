/* ============================================================
   COMPUTER HUB — shared app logic
   Header, footer, cart drawer, auth modal, toast, mobile menu,
   product card rendering, search, scroll reveal, accent tweak.
   ============================================================ */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };

  const CART_KEY = 'chub_cart_v1';
  let cart = {};
  try { cart = JSON.parse(localStorage.getItem(CART_KEY)) || {}; } catch (e) { cart = {}; }
  const saveCart = () => localStorage.setItem(CART_KEY, JSON.stringify(cart));

  const NAV = [
    { href: 'index.html',    label: 'หน้าแรก',    page: 'home' },
    { href: 'products.html', label: 'สินค้า',      page: 'products' },
    { href: 'builder.html',  label: 'จัดสเปกคอม',  page: 'builder' },
    { href: 'index.html#promo',   label: 'โปรโมชั่น',  page: 'promo' },
    { href: 'index.html#contact', label: 'ติดต่อเรา',  page: 'contact' },
  ];

  /* ---------------- Placeholder media ---------------- */
  function media(p, label) {
    const glyph = (typeof CATICON !== 'undefined' && CATICON[p.glyph]) ? CATICON[p.glyph] : '';
    return `<div class="ph">
      <div class="ph-glyph">${glyph}</div>
      <span class="ph-label">${label || (p.brand ? p.brand + ' · ' : '') + (CATMAP[p.cat] ? CATMAP[p.cat].en : '')}</span>
    </div>`;
  }

  /* ---------------- Product card ---------------- */
  function badgeHtml(p) {
    if (!p.badge) return '';
    const map = { hot: 'ขายดี', new: 'มาใหม่', sale: 'ลดราคา' };
    return `<div class="badges"><span class="badge ${p.badge}">${map[p.badge] || p.badge}</span></div>`;
  }
  function productCard(p) {
    const wasHtml = p.was ? `<span class="was">${baht(p.was)}</span>` : '';
    const esc = s => String(s).replace(/"/g, '&quot;');
    const card = el(`
      <article class="card" data-id="${p.id}" data-name="${esc(p.name.toLowerCase())}" data-cat="${p.cat}" data-brand="${esc((p.brand||'').toLowerCase())}" data-price="${p.price}">
        <div class="card-media">
          ${badgeHtml(p)}
          <button class="wish" aria-label="ถูกใจ">${ICN.heart}</button>
          ${media(p)}
        </div>
        <div class="card-body">
          <span class="card-cat">${CATMAP[p.cat] ? CATMAP[p.cat].name : ''}</span>
          <h3 class="card-name">${p.name}</h3>
          <p class="card-meta">${p.spec || ''}</p>
          <div class="card-foot">
            <div class="price">${wasHtml}${baht(p.price)}</div>
            <div class="card-actions">
              <button class="add-btn" aria-label="เพิ่มลงตะกร้า" title="เพิ่มลงตะกร้า">${ICN.cart}</button>
            </div>
          </div>
        </div>
      </article>`);
    card.querySelector('.add-btn').addEventListener('click', (e) => { e.stopPropagation(); addToCart(p.id); });
    card.querySelector('.wish').addEventListener('click', function (e) { e.stopPropagation(); this.classList.toggle('on'); });
    return card;
  }
  function renderProducts(container, list) {
    container.innerHTML = '';
    list.forEach(p => container.appendChild(productCard(p)));
  }

  /* ---------------- Cart ---------------- */
  function cartItems() { return Object.entries(cart).map(([id, q]) => ({ p: PMAP[id], q })).filter(x => x.p); }
  function cartCount() { return Object.values(cart).reduce((a, b) => a + b, 0); }
  function cartTotal() { return cartItems().reduce((a, x) => a + x.p.price * x.q, 0); }

  function addToCart(id, qty = 1, silent = false) {
    cart[id] = (cart[id] || 0) + qty; saveCart(); updateCartUI();
    const p = PMAP[id];
    if (!silent) toast(`เพิ่ม “${p ? p.name : 'สินค้า'}” ลงตะกร้าแล้ว`);
    const badge = $('#cartCount'); if (badge) { badge.classList.remove('show'); void badge.offsetWidth; badge.classList.add('show'); }
  }
  /* register a runtime product (e.g. builder-only part) so cart can render it */
  function registerProduct(p) { if (p && p.id && !PMAP[p.id]) PMAP[p.id] = p; }
  function setQty(id, q) { if (q <= 0) delete cart[id]; else cart[id] = q; saveCart(); updateCartUI(); }
  function removeFromCart(id) { delete cart[id]; saveCart(); updateCartUI(); }

  function updateCartUI() {
    const c = cartCount();
    const badge = $('#cartCount');
    if (badge) { badge.textContent = c; badge.classList.toggle('show', c > 0); }
    const body = $('#cartBody'), foot = $('#cartFoot');
    if (!body) return;
    const items = cartItems();
    if (!items.length) {
      body.innerHTML = `<div class="cart-empty">${ICN.cart}<p>ตะกร้าของคุณยังว่างอยู่</p></div>`;
      foot.style.display = 'none';
      return;
    }
    foot.style.display = 'block';
    body.innerHTML = '';
    items.forEach(({ p, q }) => {
      const line = el(`<div class="cart-line">
        <div class="thumb">${media(p)}</div>
        <div>
          <div class="cl-cat">${CATMAP[p.cat] ? CATMAP[p.cat].name : ''}</div>
          <div class="cl-name">${p.name}</div>
          <div class="qty"><button data-a="dec">−</button><span>${q}</span><button data-a="inc">+</button></div>
        </div>
        <div>
          <div class="cl-price">${baht(p.price * q)}</div>
          <button class="cl-remove">ลบ</button>
        </div>
      </div>`);
      line.querySelector('[data-a="inc"]').onclick = () => setQty(p.id, q + 1);
      line.querySelector('[data-a="dec"]').onclick = () => setQty(p.id, q - 1);
      line.querySelector('.cl-remove').onclick = () => removeFromCart(p.id);
      body.appendChild(line);
    });
    $('#cartTotal').textContent = baht(cartTotal());
  }

  /* ---------------- Toast ---------------- */
  let toastWrap;
  function toast(msg) {
    if (!toastWrap) { toastWrap = el('<div class="toast-wrap"></div>'); document.body.appendChild(toastWrap); }
    const t = el(`<div class="toast">${ICN.check}<span>${msg}</span></div>`);
    toastWrap.appendChild(t);
    setTimeout(() => { t.style.transition = 'opacity .3s, transform .3s'; t.style.opacity = '0'; t.style.transform = 'translateY(10px)'; setTimeout(() => t.remove(), 320); }, 2200);
  }

  /* ---------------- Open / close panels ---------------- */
  const scrim = () => $('#scrim');
  function openCart() { $('#cartDrawer').classList.add('show'); scrim().classList.add('show'); }
  function closeAll() {
    $$('.drawer.show, .mobile-menu.show').forEach(d => d.classList.remove('show'));
    const m = $('#authModal'); if (m) m.classList.remove('show');
    scrim().classList.remove('show');
  }
  function openAuth(mode) {
    const m = $('#authModal'); m.classList.add('show'); scrim().classList.add('show');
    switchTab(mode || 'login');
  }
  function switchTab(mode) {
    $$('#authTabs button').forEach(b => b.classList.toggle('active', b.dataset.tab === mode));
    $('#loginForm').style.display = mode === 'login' ? '' : 'none';
    $('#registerForm').style.display = mode === 'register' ? '' : 'none';
    $('#authTitle').textContent = mode === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก';
    $('#authSub').textContent = mode === 'login' ? 'ยินดีต้อนรับกลับสู่ COMPUTER HUB' : 'สร้างบัญชีเพื่อช้อปและจัดสเปกได้สะดวกขึ้น';
  }

  /* ---------------- Build shared chrome ---------------- */
  function buildHeader(page) {
    const menu = NAV.map(n => `<a href="${n.href}" class="${n.page === page ? 'active' : ''}">${n.label}</a>`).join('');
    return `<header class="site-header"><div class="wrap"><nav class="nav">
      <a class="brand" href="index.html"><span class="mark"><span>C</span></span><b>COMPUTER</b><em>HUB</em></a>
      <div class="searchbar header-search">${ICN.search}<input type="text" id="headerSearch" placeholder="ค้นหา การ์ดจอ, CPU, RAM, SSD, Monitor…"></div>
      <div class="nav-actions">
        <button class="btn btn-ghost btn-sm" id="btnRegister">สมัครสมาชิก</button>
        <button class="btn btn-dark btn-sm" id="btnLogin">เข้าสู่ระบบ</button>
        <button class="icon-btn" id="btnCart" aria-label="ตะกร้า">${ICN.cart}<span class="cart-count" id="cartCount">0</span></button>
        <button class="icon-btn hamburger" id="btnMenu" aria-label="เมนู">${ICN.menu}</button>
      </div>
    </nav></div></header>`;
  }

  function buildFooter() {
    const cats = CATEGORIES.slice(0, 6).map(c => `<li><a href="products.html?cat=${c.id}">${c.name}</a></li>`).join('');
    return `<footer class="site-footer" id="footer"><div class="wrap">
      <div class="foot-grid">
        <div>
          <a class="brand" href="index.html"><span class="mark"><span>C</span></span><b>COMPUTER</b><em>HUB</em></a>
          <p class="foot-desc">ร้านคอมพิวเตอร์และอุปกรณ์ไอทีออนไลน์ จัดสเปกตามงบ ประกอบฟรี รับประกันของแท้ทุกชิ้น</p>
          <div class="socials">
            <a href="#" aria-label="Facebook">${ICN.fb}</a>
            <a href="#" aria-label="Instagram">${ICN.ig}</a>
            <a href="#" aria-label="YouTube">${ICN.yt}</a>
            <a href="#" aria-label="Line">${ICN.chat}</a>
          </div>
        </div>
        <div><h4>เมนู</h4><ul>
          <li><a href="index.html">หน้าแรก</a></li>
          <li><a href="products.html">สินค้าทั้งหมด</a></li>
          <li><a href="builder.html">จัดสเปกคอม</a></li>
          <li><a href="index.html#promo">โปรโมชั่น</a></li>
          <li><a href="index.html#contact">ติดต่อเรา</a></li>
        </ul></div>
        <div><h4>หมวดหมู่</h4><ul>${cats}</ul></div>
        <div><h4>ติดต่อเรา</h4><ul>
          <li><a href="tel:020000000">โทร: 02-XXX-XXXX</a></li>
          <li><a href="#">Line: @computerhub</a></li>
          <li><a href="#">Facebook: Computer Hub Thailand</a></li>
          <li><a href="mailto:support@computerhub.co.th">support@computerhub.co.th</a></li>
          <li><a href="#">กรุงเทพมหานคร ประเทศไทย</a></li>
        </ul></div>
      </div>
      <div class="foot-bottom">
        <span>© 2026 COMPUTER HUB — สงวนลิขสิทธิ์</span>
        <span class="mono">นโยบายความเป็นส่วนตัว · เงื่อนไขการใช้งาน · การจัดส่ง</span>
      </div>
    </div></footer>`;
  }

  function buildChrome() {
    return `
    <div class="scrim" id="scrim"></div>

    <aside class="drawer" id="cartDrawer" aria-label="ตะกร้าสินค้า">
      <div class="drawer-head"><h3>ตะกร้าสินค้า</h3><button class="icon-btn" id="cartClose" aria-label="ปิด">${ICN.close}</button></div>
      <div class="drawer-body" id="cartBody"></div>
      <div class="drawer-foot" id="cartFoot">
        <div class="cart-total"><span class="lbl">ยอดรวม</span><span class="amt mono" id="cartTotal">฿0</span></div>
        <p class="cart-note">ส่งฟรีเมื่อสั่งซื้อครบ ฿3,000 · ประกอบฟรีเมื่อซื้อครบชุด</p>
        <button class="btn btn-primary btn-block" id="checkoutBtn">ดำเนินการสั่งซื้อ ${ICN.arrow}</button>
      </div>
    </aside>

    <div class="mobile-menu" id="mobileMenu">
      <div class="mm-head"><a class="brand" href="index.html"><span class="mark"><span>C</span></span><b>HUB</b></a><button class="icon-btn" id="mmClose">${ICN.close}</button></div>
      <div class="searchbar" style="margin:6px 0 14px"><span></span>${ICN.search}<input type="text" placeholder="ค้นหาสินค้า…" id="mmSearch"></div>
      ${NAV.map(n => `<a href="${n.href}">${n.label}</a>`).join('')}
      <div style="display:flex; gap:8px; margin-top:14px">
        <button class="btn btn-ghost btn-block" id="mmRegister">สมัครสมาชิก</button>
        <button class="btn btn-dark btn-block" id="mmLogin">เข้าสู่ระบบ</button>
      </div>
    </div>

    <div class="modal" id="authModal" aria-label="บัญชีผู้ใช้">
      <div class="modal-card">
        <div class="modal-head">
          <button class="close" id="authClose">${ICN.close}</button>
          <span class="eyebrow">บัญชีผู้ใช้</span>
          <h3 id="authTitle">เข้าสู่ระบบ</h3>
          <p id="authSub">ยินดีต้อนรับกลับสู่ COMPUTER HUB</p>
        </div>
        <div class="tabs" id="authTabs">
          <button data-tab="login" class="active">เข้าสู่ระบบ</button>
          <button data-tab="register">สมัครสมาชิก</button>
        </div>
        <div class="modal-body">
          <form id="loginForm" novalidate>
            <div class="field"><label>อีเมลหรือชื่อผู้ใช้</label><input name="user" type="text" placeholder="you@email.com"><div class="err">กรุณากรอกข้อมูล</div></div>
            <div class="field"><label>รหัสผ่าน</label><input name="pass" type="password" placeholder="••••••••"><div class="err">กรุณากรอกรหัสผ่าน</div></div>
            <div style="text-align:right; margin:-4px 0 16px"><a href="#" class="forgot">ลืมรหัสผ่าน?</a></div>
            <button class="btn btn-primary btn-block" type="submit">เข้าสู่ระบบ</button>
            <p class="modal-aux">ยังไม่มีบัญชี? <button type="button" data-go="register">สมัครสมาชิก</button></p>
          </form>
          <form id="registerForm" style="display:none" novalidate>
            <div class="field"><label>ชื่อผู้ใช้</label><input name="username" type="text" placeholder="ชื่อที่ใช้แสดง"><div class="err">กรุณากรอกชื่อผู้ใช้</div></div>
            <div class="field"><label>อีเมล</label><input name="email" type="email" placeholder="you@email.com"><div class="err">อีเมลไม่ถูกต้อง</div></div>
            <div class="field"><label>เบอร์โทร</label><input name="phone" type="tel" placeholder="08X-XXX-XXXX"><div class="err">กรุณากรอกเบอร์โทร</div></div>
            <div class="field-row">
              <div class="field"><label>รหัสผ่าน</label><input name="pass" type="password" placeholder="••••••••"><div class="err">อย่างน้อย 6 ตัวอักษร</div></div>
              <div class="field"><label>ยืนยันรหัสผ่าน</label><input name="pass2" type="password" placeholder="••••••••"><div class="err">รหัสผ่านไม่ตรงกัน</div></div>
            </div>
            <button class="btn btn-primary btn-block" type="submit" style="margin-top:6px">สมัครสมาชิก</button>
            <p class="modal-aux">มีบัญชีอยู่แล้ว? <button type="button" data-go="login">เข้าสู่ระบบ</button></p>
          </form>
        </div>
      </div>
    </div>`;
  }

  /* ---------------- Auth validation ---------------- */
  function bindAuth() {
    $$('#authTabs button').forEach(b => b.onclick = () => switchTab(b.dataset.tab));
    $$('[data-go]').forEach(b => b.onclick = () => switchTab(b.dataset.go));
    const mark = (input, bad) => { input.closest('.field').classList.toggle('invalid', bad); return !bad; };

    $('#loginForm').onsubmit = (e) => {
      e.preventDefault(); const f = e.target; let ok = true;
      ok = mark(f.user, !f.user.value.trim()) && ok;
      ok = mark(f.pass, !f.pass.value.trim()) && ok;
      if (ok) { closeAll(); toast('เข้าสู่ระบบสำเร็จ — ยินดีต้อนรับ!'); f.reset(); }
    };
    $('#registerForm').onsubmit = (e) => {
      e.preventDefault(); const f = e.target; let ok = true;
      ok = mark(f.username, !f.username.value.trim()) && ok;
      ok = mark(f.email, !/^\S+@\S+\.\S+$/.test(f.email.value)) && ok;
      ok = mark(f.phone, !f.phone.value.trim()) && ok;
      ok = mark(f.pass, f.pass.value.length < 6) && ok;
      ok = mark(f.pass2, f.pass2.value !== f.pass.value || !f.pass2.value) && ok;
      if (ok) { closeAll(); toast('สมัครสมาชิกสำเร็จ — ยินดีต้อนรับ!'); f.reset(); }
    };
    $$('.field input').forEach(i => i.addEventListener('input', () => i.closest('.field').classList.remove('invalid')));
  }

  /* ---------------- Scroll reveal ---------------- */
  function initReveal() {
    const io = new IntersectionObserver((ents) => {
      ents.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px' });
    $$('.reveal').forEach(n => io.observe(n));
  }

  /* ---------------- Accent tweak (host protocol-lite) ---------------- */
  function applyAccent(hex) {
    const map = {
      '#2b6bff': ['#1d4fd8', 'rgba(43,107,255,.10)', 'rgba(43,107,255,.28)', '0 12px 30px rgba(43,107,255,.28)'],
      '#1f9cf0': ['#1378c4', 'rgba(31,156,240,.10)', 'rgba(31,156,240,.28)', '0 12px 30px rgba(31,156,240,.28)'],
      '#19e57f': ['#0f9d57', 'rgba(25,229,127,.12)', 'rgba(25,229,127,.30)', '0 12px 30px rgba(25,229,127,.28)'],
      '#a855f7': ['#8a36df', 'rgba(168,85,247,.10)', 'rgba(168,85,247,.28)', '0 12px 30px rgba(168,85,247,.28)'],
    };
    const v = map[hex] || map['#2b6bff'];
    const r = document.documentElement.style;
    r.setProperty('--accent', hex);
    r.setProperty('--accent-ink', v[0]);
    r.setProperty('--accent-soft', v[1]);
    r.setProperty('--accent-line', v[2]);
    r.setProperty('--shadow-accent', v[3]);
  }

  /* ---------------- Tweaks panel (host protocol) ---------------- */
  const ACCENTS = [
    { hex: '#2b6bff', name: 'น้ำเงินไฟฟ้า' },
    { hex: '#1f9cf0', name: 'ฟ้า' },
    { hex: '#19e57f', name: 'เขียวนีออน' },
    { hex: '#a855f7', name: 'ม่วง' },
  ];
  const RADII = { tight: 10, regular: 18, round: 26 };

  function applyRadius(mode) {
    const v = RADII[mode] || 18;
    document.documentElement.style.setProperty('--r-lg', v + 'px');
    document.documentElement.style.setProperty('--r-xl', (v + 8) + 'px');
  }

  function buildTweaks() {
    const accent = localStorage.getItem('chub_accent') || '#2b6bff';
    const radius = localStorage.getItem('chub_radius') || 'regular';
    const panel = el(`
      <div class="tweaks" id="tweaksPanel">
        <div class="tweaks-head">
          <h4><span class="dot"></span> ปรับแต่งดีไซน์</h4>
          <button id="tweaksClose" aria-label="ปิด">${ICN.close}</button>
        </div>
        <div class="tweak-row">
          <span class="lbl">สี Accent</span>
          <div class="swatches" id="twAccent">
            ${ACCENTS.map(a => `<button class="swatch ${a.hex === accent ? 'on' : ''}" data-hex="${a.hex}" style="background:${a.hex}" title="${a.name}"></button>`).join('')}
          </div>
        </div>
        <div class="tweak-row">
          <span class="lbl">ความโค้งมุมการ์ด</span>
          <div class="seg" id="twRadius">
            <button data-r="tight" class="${radius==='tight'?'on':''}">เหลี่ยม</button>
            <button data-r="regular" class="${radius==='regular'?'on':''}">ปกติ</button>
            <button data-r="round" class="${radius==='round'?'on':''}">มน</button>
          </div>
        </div>
      </div>`);
    document.body.appendChild(panel);

    $$('#twAccent .swatch').forEach(b => b.onclick = () => {
      $$('#twAccent .swatch').forEach(x => x.classList.remove('on')); b.classList.add('on');
      applyAccent(b.dataset.hex); localStorage.setItem('chub_accent', b.dataset.hex);
      hostSet({ accent: b.dataset.hex });
    });
    $$('#twRadius button').forEach(b => b.onclick = () => {
      $$('#twRadius button').forEach(x => x.classList.remove('on')); b.classList.add('on');
      applyRadius(b.dataset.r); localStorage.setItem('chub_radius', b.dataset.r);
      hostSet({ radius: b.dataset.r });
    });
    $('#tweaksClose').onclick = () => { panel.classList.remove('show'); try { window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*'); } catch (e) {} };

    // host protocol
    window.addEventListener('message', (e) => {
      const t = e && e.data && e.data.type;
      if (t === '__activate_edit_mode') panel.classList.add('show');
      else if (t === '__deactivate_edit_mode') panel.classList.remove('show');
    });
    try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch (e) {}
  }
  function hostSet(edits) { try { window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*'); } catch (e) {} }
  function init(opts) {
    opts = opts || {};
    const page = opts.page || (document.body.dataset.page) || 'home';

    const hdrSlot = $('#headerSlot'); if (hdrSlot) hdrSlot.outerHTML = buildHeader(page);
    const ftrSlot = $('#footerSlot'); if (ftrSlot) ftrSlot.outerHTML = buildFooter();
    document.body.insertAdjacentHTML('beforeend', buildChrome());

    // wire header
    $('#btnCart').onclick = openCart;
    $('#btnLogin').onclick = () => openAuth('login');
    $('#btnRegister').onclick = () => openAuth('register');
    $('#btnMenu').onclick = () => { $('#mobileMenu').classList.add('show'); scrim().classList.add('show'); };
    $('#cartClose').onclick = closeAll;
    $('#mmClose').onclick = closeAll;
    $('#scrim').onclick = closeAll;
    $('#authClose').onclick = closeAll;
    $('#mmLogin').onclick = () => { closeAll(); openAuth('login'); };
    $('#mmRegister').onclick = () => { closeAll(); openAuth('register'); };
    $('#checkoutBtn').onclick = () => { if (cartCount()) { toast('กำลังไปหน้าชำระเงิน… (เดโม)'); } };
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });

    // header search -> products page
    const goSearch = (val) => { const q = (val || '').trim(); location.href = 'products.html' + (q ? ('?q=' + encodeURIComponent(q)) : ''); };
    const hs = $('#headerSearch'); if (hs) hs.addEventListener('keydown', e => { if (e.key === 'Enter') goSearch(hs.value); });
    const ms = $('#mmSearch'); if (ms) ms.addEventListener('keydown', e => { if (e.key === 'Enter') goSearch(ms.value); });

    bindAuth();
    updateCartUI();
    initReveal();

    // restore saved tweaks
    const savedAccent = localStorage.getItem('chub_accent'); if (savedAccent) applyAccent(savedAccent);
    const savedRadius = localStorage.getItem('chub_radius'); if (savedRadius) applyRadius(savedRadius);
    buildTweaks();
  }

  /* ---------------- Tweaks host protocol (set from disk EDITMODE) ---------------- */
  window.addEventListener('message', (e) => {
    const d = e.data || {};
    if (d.type === 'tweak:set' || d.type === 'tweak') {
      const k = d.key, val = d.value;
      if (k === 'accent') { applyAccent(val); localStorage.setItem('chub_accent', val); }
      if (k === 'radius') { applyRadius(val); localStorage.setItem('chub_radius', val); }
    }
  });

  window.CHUB = {
    init, addToCart, registerProduct, openCart, openAuth, renderProducts, productCard, media,
    PRODUCTS: (typeof PRODUCTS !== 'undefined' ? PRODUCTS : []),
    toast, applyAccent, cart: () => cart,
  };
})();
