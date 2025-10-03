// Wider canvas + one-at-a-time + full-screen support
(function () {
  const tabs  = Array.from(document.querySelectorAll('.tabs .tab'));
  const cards = Array.from(document.querySelectorAll('.cards .card'));
  const viewAllToggle = document.getElementById('viewAllToggle');
  const wideToggle    = document.getElementById('wideToggle');

  const qs  = (s, r=document) => r.querySelector(s);
  const qsa = (s, r=document) => Array.from(r.querySelectorAll(s));

  // Lazy-load iframe only when needed
  function ensureIframeLoaded(cardEl) {
    const iframe = cardEl.querySelector('iframe');
    if (!iframe) return;
    if (!iframe.src || iframe.src === 'about:blank') {
      const src = iframe.getAttribute('data-src');
      if (src) iframe.src = src;
    }
  }

  // Activate tab → show only its card
  function setActive(targetSlug) {
    tabs.forEach(t => {
      const on = t.dataset.target === targetSlug;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    cards.forEach(card => {
      const on = card.id === `panel-${targetSlug}`;
      card.classList.toggle('active', on);
      card.style.display = on ? '' : 'none';
      if (on) ensureIframeLoaded(card);
    });
    sizeActive();
  }

  // Compute exact height for the active viz so it fills viewport
  function sizeActive() {
    if (document.body.classList.contains('view-all')) return; // grid mode
    const card = qs('.card.active');
    if (!card) return;

    const headerH     = qs('.site-header')?.offsetHeight || 0;
    const tabsH       = qs('.tabs')?.offsetHeight || 0;
    const content     = qs('.content');
    const cs          = content ? getComputedStyle(content) : null;
    const contentPad  = (parseFloat(cs?.paddingTop||'0')||0) + (parseFloat(cs?.paddingBottom||'0')||0);

    const cardHeaderH = qs('.card.active .card-header')?.offsetHeight || 0;
    const cardFooterH = qs('.card.active .card-footer')?.offsetHeight || 0;
    const padding     = 16; // small breathing room

    const availableForCard = window.innerHeight - (headerH + tabsH + contentPad + padding);
    const availableForViz  = availableForCard - (cardHeaderH + cardFooterH);

    card.style.minHeight = Math.max(360, availableForCard) + 'px';
    const viz = qs('.card.active .viz-wrap');
    if (viz) viz.style.height = Math.max(260, availableForViz) + 'px';
  }

  // Tab clicks
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      setActive(tab.dataset.target);
      viewAllToggle?.setAttribute('aria-pressed', 'false');
      document.body.classList.remove('view-all');
      qs('#content')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // View-All toggle (grid)
  viewAllToggle?.addEventListener('click', () => {
    const pressed = viewAllToggle.getAttribute('aria-pressed') === 'true';
    const next = !pressed;
    viewAllToggle.setAttribute('aria-pressed', String(next));
    document.body.classList.toggle('view-all', next);
    if (next) {
      cards.forEach(c => c.style.display = '');
      lazyLoadVisible();
    } else {
      const activeTab = tabs.find(t => t.classList.contains('active')) || tabs[0];
      setActive(activeTab.dataset.target);
    }
  });

  // Wider canvas toggle (edge-to-edge)
  wideToggle?.addEventListener('click', () => {
    const pressed = wideToggle.getAttribute('aria-pressed') === 'true';
    const next = !pressed;
    wideToggle.setAttribute('aria-pressed', String(next));
    document.body.classList.toggle('edge', next);
    sizeActive();
  });

  // Full screen button per card (uses native Fullscreen API)
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-action="fullscreen"]');
    if (!btn) return;
    const targetId = btn.getAttribute('data-target');
    const panel = document.getElementById(targetId);
    const viz   = panel?.querySelector('.viz-wrap');

    if (!viz) return;

    try {
      if (!document.fullscreenElement) {
        // ensure iframe is loaded before fullscreen
        ensureIframeLoaded(panel);
        await (viz.requestFullscreen?.() || panel.requestFullscreen?.());
        btn.textContent = 'Exit Full Screen';
      } else {
        await document.exitFullscreen();
        btn.textContent = 'Full Screen';
      }
    } catch {
      // fallback: open the iframe in a new tab if fullscreen not supported
      const url = panel.querySelector('iframe')?.getAttribute('data-src') || panel.querySelector('iframe')?.src;
      if (url) window.open(url, '_blank');
    }
  });

  // Keep grid lazy-loading efficient
  function lazyLoadVisible() {
    const vh = window.innerHeight;
    cards.forEach(card => {
      const r = card.getBoundingClientRect();
      if (r.bottom > 0 && r.top < vh) ensureIframeLoaded(card);
    });
  }

  window.addEventListener('resize', () => { sizeActive(); if (document.body.classList.contains('view-all')) lazyLoadVisible(); });
  window.addEventListener('scroll', () => { if (document.body.classList.contains('view-all')) lazyLoadVisible(); });

  // Init
  cards.forEach(c => { if (!c.classList.contains('active')) c.style.display = 'none'; });
  const firstActive = tabs.find(t => t.classList.contains('active')) || tabs[0];
  setActive(firstActive.dataset.target);

  // Reload + Copy link helpers
  qsa('[data-action="reload"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const frameId = btn.getAttribute('data-frame');
      const iframe = document.getElementById(frameId);
      if (iframe) iframe.src = iframe.src || iframe.getAttribute('data-src');
    });
  });
  qsa('[data-action="copylink"]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const slug = btn.getAttribute('data-slug');
      const url = new URL(location.href); url.hash = slug;
      try { await navigator.clipboard.writeText(url.toString()); btn.textContent='Copied!'; setTimeout(()=>btn.textContent='Copy Link',1200); } catch{}
    });
  });

  // Deep-link support (#campaign, etc.)
  const hash = location.hash.replace(/^#/, '');
  if (hash) {
    const t = tabs.find(t => t.dataset.target === hash);
    if (t) setActive(hash);
  }

  // Footer year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
