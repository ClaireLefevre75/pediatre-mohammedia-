/* ═══════════════════════════════════════════════
   CABINET DR FATIMA BOUZZITE — main.js
═══════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── Navbar scroll effect ─── */
  const navbar = document.getElementById('navbar');
  function onScroll() {
    if (!navbar) return;
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    // Floating buttons visibility
    const floatingBtns = document.getElementById('floatingBtns');
    if (floatingBtns) {
      if (window.scrollY > 400) {
        floatingBtns.classList.add('visible');
      } else {
        floatingBtns.classList.remove('visible');
      }
    }
    // Active nav link
    highlightActiveNav();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run once on load

  /* ─── Mobile nav toggle ─── */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  function closeMenu() {
    navToggle.classList.remove('open');
    navMenu.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        navToggle.classList.add('open');
        navMenu.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  overlay.addEventListener('click', closeMenu);

  // Close on nav link click
  if (navMenu) {
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ─── Smooth scroll for anchor links ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = navbar ? navbar.offsetHeight : 0;
      const targetY = target.getBoundingClientRect().top + window.scrollY - navH - 8;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });

  /* ─── Reveal on scroll (IntersectionObserver) ─── */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger cards in a grid
          const siblings = Array.from(entry.target.parentElement.children).filter(
            el => el.classList.contains('reveal')
          );
          const delay = siblings.indexOf(entry.target) * 80;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all immediately
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ─── Active nav link on scroll ─── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightActiveNav() {
    const scrollPos = window.scrollY + (navbar ? navbar.offsetHeight : 0) + 80;
    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + section.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  /* ─── Animated counter for stats ─── */
  function animateCounter(el, target, duration) {
    const start = performance.now();
    const isFloat = String(target).includes('.');
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      const value = Math.round(ease * target);
      el.textContent = isFloat ? value.toFixed(1) : value.toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const statNums = document.querySelectorAll('.stat-num');
  let statsAnimated = false;

  function tryAnimateStats() {
    if (statsAnimated) return;
    const statsSection = document.querySelector('.stats');
    if (!statsSection) return;
    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      statsAnimated = true;
      statNums.forEach(el => {
        const text = el.textContent.trim();
        const num = parseFloat(text.replace(/[^0-9.]/g, ''));
        if (!isNaN(num)) {
          const suffix = el.querySelector('.stat-plus');
          const suffixHTML = suffix ? suffix.outerHTML : '';
          el.innerHTML = '0' + suffixHTML;
          // Re-query after innerHTML change
          const numNode = el.childNodes[0];
          animateCounter({ textContent: '0', set: (v) => { numNode.textContent = v; el.innerHTML = v + suffixHTML; } }, num, 1800);
        }
      });
    }
  }

  window.addEventListener('scroll', tryAnimateStats, { passive: true });
  tryAnimateStats();

  /* ─── Add active style to CSS dynamically ─── */
  const style = document.createElement('style');
  style.textContent = `
    .nav-link.active {
      color: var(--primary) !important;
      background: var(--primary-xlight);
      border-radius: 8px;
    }
    .navbar:not(.scrolled) .nav-link.active {
      color: var(--white) !important;
      background: rgba(255,255,255,0.15);
    }
  `;
  document.head.appendChild(style);

})();
