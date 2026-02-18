/* ============================================================
   TENUTRE — script.js
   Animations, Interactions & Effects
   ============================================================ */

'use strict';

// ============================================================
// UTILITIES
// ============================================================

/**
 * Debounce function to limit scroll/resize event frequency
 */
function debounce(func, wait = 16) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * Animate a counter from 0 to target value
 */
function animateCounter(element, target, duration = 2000, suffix = '') {
  if (!element) return;
  const startTime = performance.now();
  const startValue = 0;

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(startValue + (target - startValue) * eased);

    if (target >= 1000) {
      element.textContent = (current / 1000).toFixed(current >= 1000 ? 0 : 1) + 'K+';
    } else {
      element.textContent = current + suffix;
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      if (target >= 1000) {
        element.textContent = Math.round(target / 1000) + 'K+';
      } else {
        element.textContent = target + suffix;
      }
    }
  }

  requestAnimationFrame(update);
}

// ============================================================
// PARTICLE SYSTEM
// ============================================================

function createParticles(containerId, count = 50) {
  const container = document.getElementById(containerId);
  if (!container) return;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = (Math.random() * 20) + 's';
    particle.style.animationDuration = (15 + Math.random() * 10) + 's';
    particle.style.opacity = (0.2 + Math.random() * 0.5).toString();

    // Vary sizes
    const size = 1.5 + Math.random() * 3;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';

    container.appendChild(particle);
  }
}

// ============================================================
// NAVBAR
// ============================================================

function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = debounce(() => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, 10);

  window.addEventListener('scroll', handleScroll, { passive: true });
}

// ============================================================
// MOBILE MENU
// ============================================================

function initMobileMenu() {
  const hamburger = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  let isOpen = false;

  function toggleMenu() {
    isOpen = !isOpen;
    hamburger.classList.toggle('active', isOpen);
    mobileMenu.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen.toString());
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggleMenu);

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (isOpen) toggleMenu();
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) toggleMenu();
  });
}

// ============================================================
// SMOOTH SCROLL
// ============================================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const navbarHeight = 80;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}

// ============================================================
// SCROLL REVEAL (INTERSECTION OBSERVER)
// ============================================================

function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Only animate once
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -80px 0px'
    }
  );

  revealElements.forEach(el => observer.observe(el));
}

// ============================================================
// ANIMATED COUNTERS
// ============================================================

function initCounters() {
  // Hero stats
  const heroCounters = [
    { id: 'stat-clientes', target: 10000 },
    { id: 'stat-productos', target: 200 },
    { id: 'stat-anos', target: 5 },
  ];

  // Observe hero section to trigger counters
  const heroSection = document.getElementById('inicio');
  if (heroSection) {
    const heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Delay slightly for visual effect
            setTimeout(() => {
              heroCounters.forEach(({ id, target }) => {
                const el = document.getElementById(id);
                if (el) animateCounter(el, target, 2000);
              });
            }, 800);
            heroObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    heroObserver.observe(heroSection);
  }
}

// ============================================================
// PROGRESS BARS
// ============================================================

function initProgressBars() {
  const progressBars = document.querySelectorAll('.progress-bar-fill');
  if (!progressBars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const targetWidth = bar.getAttribute('data-width') || '0';
          // Small delay for stagger effect
          setTimeout(() => {
            bar.style.width = targetWidth + '%';
          }, 200);
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.3 }
  );

  progressBars.forEach(bar => observer.observe(bar));
}

// ============================================================
// FLIP CARDS
// ============================================================

function initFlipCards() {
  const flipCards = document.querySelectorAll('.service-card-flip');
  if (!flipCards.length) return;

  flipCards.forEach(card => {
    // Mobile: toggle flip on click/tap
    card.addEventListener('click', function () {
      // Only toggle on touch/mobile (desktop uses CSS :hover)
      if (window.matchMedia('(hover: none)').matches || window.innerWidth <= 1023) {
        this.classList.toggle('flipped');
      }
    });

    // Keyboard accessibility
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.classList.toggle('flipped');
      }
    });
  });
}

// ============================================================
// PARALLAX EFFECT (subtle)
// ============================================================

function initParallax() {
  const heroVisual = document.querySelector('.hero-visual-inner');
  const heroBg = document.querySelector('.hero-bg-gradient');

  if (!heroVisual && !heroBg) return;

  const handleParallax = debounce(() => {
    const scrolled = window.scrollY;

    if (heroVisual && scrolled < window.innerHeight) {
      heroVisual.style.transform = `translateY(${scrolled * 0.08}px)`;
    }

    if (heroBg && scrolled < window.innerHeight) {
      heroBg.style.transform = `translateY(${scrolled * 0.15}px)`;
    }
  }, 8);

  window.addEventListener('scroll', handleParallax, { passive: true });
}

// ============================================================
// NAVBAR ACTIVE LINK HIGHLIGHT
// ============================================================

function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === '#' + id) {
              link.style.color = 'var(--primary-400)';
            } else {
              link.style.color = '';
            }
          });
        }
      });
    },
    {
      threshold: 0.4,
      rootMargin: '-80px 0px -40% 0px'
    }
  );

  sections.forEach(section => observer.observe(section));
}

// ============================================================
// CARD HOVER GLOW EFFECT
// ============================================================

function initCardGlow() {
  const cards = document.querySelectorAll('.glass-card, .stat-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      this.style.background = `
        radial-gradient(
          circle at ${x}% ${y}%,
          rgba(30, 107, 60, 0.12) 0%,
          rgba(30, 107, 60, 0.05) 40%,
          rgba(30, 107, 60, 0.08) 100%
        )
      `;
    });

    card.addEventListener('mouseleave', function () {
      this.style.background = '';
    });
  });
}

// ============================================================
// HERO BADGE PULSE
// ============================================================

function initHeroBadge() {
  const badge = document.querySelector('.hero-badge');
  if (!badge) return;

  // Already handled by CSS animation
}

// ============================================================
// SCROLL TO TOP (on logo click)
// ============================================================

function initScrollToTop() {
  const logos = document.querySelectorAll('.navbar-logo');
  logos.forEach(logo => {
    logo.addEventListener('click', (e) => {
      if (logo.getAttribute('href') === '#inicio') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
}

// ============================================================
// PERFORMANCE: Reduce animations on low-end devices
// ============================================================

function checkReducedMotion() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    document.documentElement.style.setProperty('--transition-fast', '0.01ms');
    document.documentElement.style.setProperty('--transition-normal', '0.01ms');
    document.documentElement.style.setProperty('--transition-slow', '0.01ms');
  }
}

// ============================================================
// INITIALIZE ALL
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  // Core
  checkReducedMotion();
  initNavbar();
  initMobileMenu();
  initSmoothScroll();

  // Visual effects
  createParticles('particles-hero', 50);
  createParticles('particles-cta', 30);

  // Animations
  initScrollReveal();
  initCounters();
  initProgressBars();
  initFlipCards();
  initParallax();
  initActiveNavLinks();
  initCardGlow();
  initScrollToTop();

  // Log ready
  console.log('%c🌿 Tenutre — Web cargada correctamente', 'color: #1E6B3C; font-weight: bold; font-size: 14px;');
});

// ============================================================
// WINDOW RESIZE: Reset flip cards on desktop
// ============================================================

window.addEventListener('resize', debounce(() => {
  if (window.innerWidth > 1023) {
    document.querySelectorAll('.service-card-flip.flipped').forEach(card => {
      card.classList.remove('flipped');
    });
  }
}, 200));
