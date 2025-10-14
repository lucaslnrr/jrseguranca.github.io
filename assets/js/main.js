// JR Segurança – navegação e interações básicas

document.addEventListener('DOMContentLoaded', () => {
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
});
