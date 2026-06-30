/* ============================================================
   AVKUS GmbH — Main JavaScript
   ============================================================ */

/* ── Scroll-aware header */
(function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;
  const update = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ── Mobile nav burger */
(function initBurger() {
  const burger = document.querySelector('.header__burger');
  const drawer = document.querySelector('.header__drawer');
  if (!burger || !drawer) return;

  burger.addEventListener('click', () => {
    const open = burger.classList.toggle('is-open');
    drawer.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('is-open');
      drawer.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
})();

/* ── Tab navigation */
(function initTabs() {
  document.querySelectorAll('.tab-nav').forEach(nav => {
    const items    = nav.querySelectorAll('.tab-nav__item');
    const container = nav.closest('[data-tabs]') || nav.parentElement;
    const panels   = container.querySelectorAll('.tab-panel');

    const activate = index => {
      items.forEach((item, i) => {
        item.classList.toggle('is-active', i === index);
        item.setAttribute('aria-selected', i === index);
      });
      panels.forEach((panel, i) => {
        panel.classList.toggle('is-active', i === index);
        if (i === index) panel.removeAttribute('hidden');
        else panel.setAttribute('hidden', '');
      });
    };

    items.forEach((item, i) => {
      item.addEventListener('click', () => activate(i));
      item.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') activate((i + 1) % items.length);
        if (e.key === 'ArrowLeft')  activate((i - 1 + items.length) % items.length);
      });
    });
  });
})();

/* ── Contact segment switcher */
(function initSegment() {
  document.querySelectorAll('.contact__segment-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.contact__segment-btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
    });
  });
})();

/* ── Language switcher */
(function initLang() {
  document.querySelectorAll('.lang-switcher__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.lang-switcher__btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
    });
  });
})();

/* ── Smooth anchor scroll */
(function initSmoothScroll() {
  const headerH = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10
  ) || 72;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href').slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - headerH, behavior: 'smooth' });
    });
  });
})();

/* ── Hero panel click → scroll to section + activate tab */
(function initHeroPanels() {
  document.querySelectorAll('.hero__panel[data-target]').forEach(panel => {
    panel.addEventListener('click', e => {
      if (e.target.closest('a, button')) return;
      const target = document.getElementById(panel.dataset.target);
      if (!target) return;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
      const tabBtn = panel.dataset.tab
        ? document.querySelector(`.tab-nav__item[data-tab="${panel.dataset.tab}"]`)
        : null;
      if (tabBtn) tabBtn.click();
    });
  });
})();

/* ── Scroll reveal */
(function initReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    return;
  }
  const obs = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); } }),
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

/* ── Active nav highlight */
(function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.header__nav-link[href^="#"]');
  if (!sections.length || !links.length) return;
  const obs = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting)
        links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === `#${e.target.id}`));
    }),
    { rootMargin: '-40% 0px -40% 0px' }
  );
  sections.forEach(s => obs.observe(s));
})();
