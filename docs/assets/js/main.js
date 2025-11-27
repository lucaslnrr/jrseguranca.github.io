// JR Seguran�a � navega��o e intera��es b�sicas

document.addEventListener('DOMContentLoaded', () => {
  // Dismissible Novembro Azul banner
  try {
    const bannerId = 'novembro-azul-banner';
    const storageKey = 'banner_novembro_azul_2025_dismissed';
    const banner = document.getElementById(bannerId);
    if (banner) {
      const dismissed = (typeof localStorage !== 'undefined') ? localStorage.getItem(storageKey) === '1' : false;
      if (dismissed) {
        banner.setAttribute('hidden', 'hidden');
      } else {
        const closeBtn = banner.querySelector('.promo-banner__close');
        if (closeBtn) {
          closeBtn.addEventListener('click', () => {
            banner.setAttribute('hidden', 'hidden');
            try { localStorage.setItem(storageKey, '1'); } catch (e) {}
          });
        }
      }
    }
  } catch (e) { /* no-op */ }

  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav');
  const year = document.getElementById('year');
  const navLinks = nav ? nav.querySelectorAll('.nav__link') : [];

  const closeNav = () => {
    if (!nav || !toggle) return;
    nav.classList.remove('nav--open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('nav--open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => closeNav());
    });

    window.matchMedia('(min-width: 941px)').addEventListener('change', (event) => {
      if (event.matches) {
        closeNav();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeNav();
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId.length <= 1) return;
      const section = document.querySelector(targetId);
      if (!section) return;
      event.preventDefault();
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  if (navLinks.length) {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;
      const path = href.split('#')[0];
      if (path === currentPath || (!path && currentPath === 'index.html')) {
        link.classList.add('is-active');
      }
    });
  }

  // Footer credit is now static in HTML for each page

  const shouldUppercase = (element) => {
    if (!element || element.matches(':disabled,[readonly]')) return false;
    const optOut = element.getAttribute('data-uppercase');
    if (optOut && optOut.toLowerCase() === 'false') return false;
    if (element.tagName === 'TEXTAREA') return true;
    if (element.tagName === 'INPUT') {
      const type = (element.getAttribute('type') || 'text').toLowerCase();
      return ['text', 'search', 'tel', 'url', 'email'].includes(type);
    }
    return false;
  };

  const toUpper = (element) => {
    if (!shouldUppercase(element)) return;
    const value = element.value;
    if (typeof value === 'string' && value.length) {
      element.value = value.toUpperCase();
    }
  };

  document.addEventListener(
    'blur',
    (event) => {
      const target = event.target;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        toUpper(target);
      }
    },
    true
  );

  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', () => {
      form.querySelectorAll('input, textarea').forEach((field) => toUpper(field));
    });
  });

  // Hero slider
  const heroSlider = document.querySelector('.hero__slider');
  if (heroSlider) {
    const track = heroSlider.querySelector('.hero__slider-track');
    const slides = Array.from(heroSlider.querySelectorAll('.hero__slide'));
    const prevBtn = heroSlider.querySelector('.hero__slider-control--prev');
    const nextBtn = heroSlider.querySelector('.hero__slider-control--next');
    const dotsWrap = heroSlider.querySelector('.hero__slider-dots');
    const totalSlides = slides.length;
    let currentIndex = 0;
    let autoplayTimer = null;
    const autoplayInterval = 6000;

    if (dotsWrap) {
      slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', `Ir para imagem ${index + 1}`);
        dot.setAttribute('role', 'tab');
        dot.dataset.index = String(index);
        dot.addEventListener('click', () => {
          currentIndex = index;
          updateSlider();
          resetAutoplay();
        });
        dotsWrap.appendChild(dot);
      });
    }

    const dots = dotsWrap ? Array.from(dotsWrap.querySelectorAll('button')) : [];

    const updateSlider = () => {
      if (!track) return;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, index) => {
        dot.setAttribute('aria-current', index === currentIndex ? 'true' : 'false');
      });
    };

    const moveNext = () => {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateSlider();
    };

    const movePrev = () => {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateSlider();
    };

    const attachControl = (el, action) => {
      if (!el) return;
      el.addEventListener('click', () => {
        action();
        resetAutoplay();
      });
      el.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          action();
          resetAutoplay();
        }
      });
    };

    attachControl(nextBtn, moveNext);
    attachControl(prevBtn, movePrev);

    const startAutoplay = () => {
      autoplayTimer = window.setInterval(moveNext, autoplayInterval);
    };

    const stopAutoplay = () => {
      if (autoplayTimer) {
        window.clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    };

    const resetAutoplay = () => {
      stopAutoplay();
      startAutoplay();
    };

    heroSlider.addEventListener('mouseenter', stopAutoplay);
    heroSlider.addEventListener('mouseleave', startAutoplay);
    heroSlider.addEventListener('focusin', stopAutoplay);
    heroSlider.addEventListener('focusout', startAutoplay);

    updateSlider();
    startAutoplay();
  }

  // Booking form: show success message if redirected with ?enviado=1
  const searchParams = new URLSearchParams(window.location.search);
  const formSuccess = document.getElementById('form-success');
  if (searchParams.get('enviado') === '1' && formSuccess) {
    formSuccess.hidden = false;
    formSuccess.classList.add('is-visible');
    window.setTimeout(() => {
      formSuccess.classList.remove('is-visible');
      formSuccess.hidden = true;
      // remove query param to avoid repeated message on refresh
      if (history.replaceState) {
        // use href explicitly to be robust when opened from file://
        const url = new URL(window.location.href);
        url.searchParams.delete('enviado');
        history.replaceState({}, document.title, url.pathname + url.search + url.hash);
      }
    }, 6000);
  }

  // Inject a vertical image carousel into the Services section on the homepage, if missing
  try {
    const isHome = (function () {
      try {
        const path = (window.location && window.location.pathname) ? window.location.pathname : '';
        const last = path.split('/').pop();
        return !last || /^index\.html?$/i.test(last);
      } catch (_) { return true; }
    })();

    if (isHome) {
      const servicesWrapper = document.querySelector('.section.services .services__wrapper-upgrade');
      if (servicesWrapper && !servicesWrapper.querySelector('.services__art')) {
        const art = document.createElement('div');
        art.className = 'services__art';
        art.innerHTML = [
          '<div class="services__carousel" data-carousel="vertical" aria-label="Galeria de solu\u00e7\u00f5es">',
          '  <div class="services__carousel-viewport">',
          '    <div class="services__carousel-track">',
          '      <div class="services__carousel-slide">',
          '        <img src="assets/img/carousel1.jpeg" alt="" />',
          '      </div>',
          '      <div class="services__carousel-slide">',
          '        <img src="assets/img/carousel2.jpeg" alt="" />',
          '      </div>',
          '      <div class="services__carousel-slide">',
          '        <img src="assets/img/carousel3.jpeg" alt="" />',
          '      </div>',
          '      <div class="services__carousel-slide">',
          '        <img src="assets/img/carousel4.jpeg" alt="" />',
          '      </div>',
          '      <div class="services__carousel-slide">',
          '        <img src="assets/img/carousel5.jpeg" alt="" />',
          '      </div>',
          '      <div class="services__carousel-slide">',
          '        <img src="assets/img/carousel6.jpeg" alt="" />',
          '      </div>',
           '      <div class="services__carousel-slide">',
          '        <img src="assets/img/carousel7.jpeg" alt="" />',
          '      </div>',
           '      <div class="services__carousel-slide">',
          '        <img src="assets/img/carousel8.jpeg" alt="" />',
          '      </div>',
          '    </div>',
          '  </div>',
          '  <button class="services__carousel-control services__carousel-control--prev" type="button" aria-label="Anterior">',
          '    <i class="bi bi-chevron-up" aria-hidden="true"></i>',
          '  </button>',
          '  <button class="services__carousel-control services__carousel-control--next" type="button" aria-label="Pr\u00f3ximo">',
          '    <i class="bi bi-chevron-down" aria-hidden="true"></i>',
          '  </button>',
          '  <div class="services__carousel-dots" role="tablist" aria-label="Navega\u00e7\u00e3o do carrossel"></div>',
          '</div>'
        ].join('\n');
        servicesWrapper.appendChild(art);
      }
    }
  } catch (_) {}

  // vertical services carousel initializer
  document.querySelectorAll('[data-carousel="vertical"]').forEach((carousel) => {
    const track = carousel.querySelector('.services__carousel-track');
    const slides = Array.from(carousel.querySelectorAll('.services__carousel-slide'));
    const prev = carousel.querySelector('.services__carousel-control--prev');
    const next = carousel.querySelector('.services__carousel-control--next');
    const dots = carousel.querySelector('.services__carousel-dots');
    if (!track || slides.length === 0) return;
    let idx = 0;
    const total = slides.length;
    let t = null;
    const interval = 5000;

    // Compute cumulative offsets (pixels) for each slide to support variable heights
    let offsets = [];
    const computeOffsets = () => {
      offsets = [];
      let acc = 0;
      slides.forEach((s, i) => {
        offsets.push(acc);
        // use offsetHeight to include padding/border
        acc += s.offsetHeight;
      });
      // ensure track has min-height so percent flex-basis works
      return offsets;
    };

    const go = (i) => {
      idx = (i + total) % total;
      if (!offsets || offsets.length !== total) computeOffsets();
      const offset = offsets[idx] || 0;
      track.style.transform = `translateY(-${offset}px)`;
      if (dots) Array.from(dots.children).forEach((b, j) => b.setAttribute('aria-current', j === idx ? 'true' : 'false'));
    };

    const nextFn = () => go(idx + 1);
    const prevFn = () => go(idx - 1);

    if (dots) {
      slides.forEach((_, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', `Ir para imagem ${i + 1}`);
        b.addEventListener('click', () => { go(i); reset(); });
        dots.appendChild(b);
      });
    }

    if (next) next.addEventListener('click', () => { nextFn(); reset(); });
    if (prev) prev.addEventListener('click', () => { prevFn(); reset(); });

    const start = () => { t = window.setInterval(nextFn, interval); };
    const stop = () => { if (t) { window.clearInterval(t); t = null; } };
    const reset = () => { stop(); start(); };

    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    carousel.addEventListener('focusin', stop);
    carousel.addEventListener('focusout', start);

    // Recalculate offsets on load and resize so transforms stay correct
    window.addEventListener('resize', () => {
      computeOffsets();
      // ensure current position is reapplied after layout change
      requestAnimationFrame(() => go(idx));
    });

    // initial offsets computation after a short delay to allow images to load
    window.setTimeout(() => {
      computeOffsets();
      go(0);
    }, 50);

    document.addEventListener('keydown', (ev) => {
      if (!carousel.contains(document.activeElement)) return;
      if (ev.key === 'ArrowDown') { ev.preventDefault(); nextFn(); reset(); }
      if (ev.key === 'ArrowUp') { ev.preventDefault(); prevFn(); reset(); }
    });

    go(0);
    start();
  });

  

  // Prevent spam when honeypot is filled and ensure consent is checked client-side
  const bookingForm = document.getElementById('formulario');
  if (bookingForm) {
    const submitBtn = document.getElementById('form-submit');
    const setError = (id, message) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (message) {
        el.textContent = message;
        el.hidden = false;
        el.classList.add('is-visible');
      } else {
        el.textContent = '';
        el.hidden = true;
        el.classList.remove('is-visible');
      }
    };

    const validateEmail = (value) => {
      if (!value) return false;
      // simple email regex (not perfect but sufficient for client-side check)
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    };

    const validateForm = () => {
      let valid = true;
      const nome = bookingForm.querySelector('#nome');
      const empresa = bookingForm.querySelector('#empresa');
      const email = bookingForm.querySelector('#email');
      const mensagem = bookingForm.querySelector('#mensagem');
      const telefone = bookingForm.querySelector('#telefone');
      const consent = bookingForm.querySelector('#consent');

      setError('error-nome', '');
      setError('error-empresa', '');
      setError('error-email', '');
      setError('error-mensagem', '');
      setError('error-telefone', '');
      setError('error-consent', '');

      if (!nome || !nome.value.trim()) {
        setError('error-nome', 'Por favor, informe seu nome.');
        valid = false;
      }
      if (!empresa || !empresa.value.trim()) {
        setError('error-empresa', 'Por favor, informe a empresa.');
        valid = false;
      }
      if (!email || !validateEmail(email.value.trim())) {
        setError('error-email', 'Informe um e-mail v�lido.');
        valid = false;
      }
      if (!mensagem || !mensagem.value.trim()) {
        setError('error-mensagem', 'Por favor, descreva brevemente a necessidade.');
        valid = false;
      }
      if (telefone && telefone.value && telefone.value.trim().length < 6) {
        setError('error-telefone', 'Informe um telefone v�lido ou deixe em branco.');
        valid = false;
      }
      if (consent && !consent.checked) {
        setError('error-consent', '� necess�rio autorizar o contato para prosseguir.');
        valid = false;
      }

      return valid;
    };

    bookingForm.addEventListener('submit', (ev) => {
      const honeypot = bookingForm.querySelector('input[name="website"]');
      if (honeypot && honeypot.value) {
        // probable bot
        ev.preventDefault();
        return;
      }

      // run client-side validations
      const ok = validateForm();
      if (!ok) {
        ev.preventDefault();
        // focus first visible error field
        const firstErr = bookingForm.querySelector('.field-error.is-visible');
        if (firstErr) {
          const field = firstErr.previousElementSibling;
          if (field && (field.tagName === 'INPUT' || field.tagName === 'TEXTAREA')) {
            field.focus();
          }
        }
        return;
      }

      // disable submit to prevent double submit and show loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('is-loading');
      }
    });
  }
});

// Services cards: reveal on scroll + lazy-load hover backgrounds
document.addEventListener('DOMContentLoaded', () => {
  try {
    const cards = Array.from(document.querySelectorAll('.section--services .service-stack'));
    if (!cards.length) return;

    const loadBg = (card) => {
      if (!card) return;
      const loaded = card.getAttribute('data-bg-loaded');
      if (loaded === 'true') return;
      const bgEl = card.querySelector('.service-bg');
      if (!bgEl) return;
      const src = bgEl.getAttribute('data-bg');
      if (!src) return;
      // Preload image via Image() then set as background — works for file:// and avoids relying on element load events
      const pre = new Image();
      pre.onload = () => {
        try {
          bgEl.style.backgroundImage = `url('${src}')`;
        } catch (e) {
          bgEl.setAttribute('style', (bgEl.getAttribute('style') || '') + `;background-image:url('${src}')`);
        }
        requestAnimationFrame(() => { bgEl.style.opacity = '1'; });
        card.setAttribute('data-bg-loaded', 'true');
      };
      pre.onerror = () => {
        // On error, still attempt to set background so the UI degrades gracefully
        try {
          bgEl.style.backgroundImage = `url('${src}')`;
        } catch (e) {
          bgEl.setAttribute('style', (bgEl.getAttribute('style') || '') + `;background-image:url('${src}')`);
        }
        requestAnimationFrame(() => { bgEl.style.opacity = '1'; });
        card.setAttribute('data-bg-loaded', 'true');
      };
      pre.src = src;
    };

    const onEnter = (entries, obs) => {
      entries.forEach((entry) => {
        const el = entry.target;
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          loadBg(el);
          obs.unobserve(el);
        }
      });
    };

    const io = new IntersectionObserver(onEnter, { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    cards.forEach((c) => {
      io.observe(c);
      // also lazy-load on first hover for faster perceived interaction
      c.addEventListener('mouseenter', function hoverLoad() {
        loadBg(c);
        c.removeEventListener('mouseenter', hoverLoad);
      });
    });
  } catch (e) {
    // swallow to avoid breaking other scripts
    // console.warn('Services lazy-load failed', e);
  }
});

// Ensure overlay panel shows the card title + description (and move the text inside it)
document.addEventListener('DOMContentLoaded', () => {
  try {
    const stacks = Array.from(document.querySelectorAll('.section--services .service-stack'));
    const titles = [ 'Gest�o do eSocial','Inspe��es T�cnicas','Elabora��o de Programas e Laudos','Assessoria em Seguran�a do Trabalho','Treinamentos de Seguran�a','Acompanhamento de Execu��o de Obra' ];
    const descs = [
      '', '', '', '', '', ''
    ];
    stacks.forEach((stack, idx) => {
      const overlay = stack.querySelector('.service-overlay');
      if (!overlay) return;
      let panel = overlay.querySelector('.overlay-panel');
      if (!panel) {
        panel = document.createElement('div');
        panel.className = 'overlay-panel';
        overlay.appendChild(panel);
      }
      const t = titles[idx] || '';
      const d = descs[idx] || '';
      panel.innerHTML = `${t ? `<h3>${t}</h3>` : ''}${d ? `<p>${d}</p>` : ''}`;
    });
  } catch (e) {
    // no-op
  }
});



// Projects: image modal open/close and view buttons
try {
  document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('project-modal');
    if (!modal) return;
    const imgEl = modal.querySelector('.project-modal__image');
    const closeBtn = modal.querySelector('.project-modal__close');
    const open = (src, alt) => {
      if (imgEl) {
        imgEl.setAttribute('src', src || '');
        imgEl.setAttribute('alt', alt || 'Projeto ampliado');
      }
      modal.classList.add('is-open');
      modal.removeAttribute('hidden');
    };
    const close = () => {
      modal.classList.remove('is-open');
      modal.setAttribute('hidden', 'hidden');
      if (imgEl) imgEl.setAttribute('src', '');
    };
    document.querySelectorAll('.project-view').forEach((btn) => {
      btn.addEventListener('click', (ev) => {
        ev.preventDefault();
        const media = btn.closest('.project-media');
        const img = media ? media.querySelector('img') : null;
        const src = img ? img.getAttribute('src') : '';
        const alt = img ? img.getAttribute('alt') : '';
        open(src, alt);
      });
    });
    if (closeBtn) closeBtn.addEventListener('click', close);
    modal.addEventListener('click', (ev) => { if (ev.target === modal) close(); });
    document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') close(); });
  });
} catch (e) {}
// Ensure vertical carousel images preload (avoid blank slides)
try {
  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('.services__carousel .services__carousel-slide img').forEach(function(img){
      try { img.setAttribute('loading','eager'); img.setAttribute('decoding','sync'); } catch(e) {}
      if (!img.complete) { var pre = new Image(); pre.src = img.src; }
    });
  });
} catch (e) {}
