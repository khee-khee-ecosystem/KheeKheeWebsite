/**
 * Khee Khee - Section 01: Hero Interactive Controller
 * Handles metric count-up animations and interactive preview card 3D tilt.
 */
document.addEventListener('DOMContentLoaded', () => {
  const heroCard = document.querySelector('.preview-card');
  const metricCreators = document.getElementById('stat-creators');
  const metricReach = document.getElementById('stat-reach');
  const metricRoas = document.getElementById('stat-roas');

  // Check user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Interactive Metric Count-Up
  let animated = false;
  const countUp = (el, target, decimals = 0, suffix = '') => {
    if (!el) return;
    if (prefersReducedMotion) {
      el.textContent = target.toFixed(decimals) + suffix;
      return;
    }

    let start = 0;
    const duration = 1200;
    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = start + (target - start) * ease;
      el.textContent = current.toFixed(decimals) + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toFixed(decimals) + suffix;
      }
    };

    requestAnimationFrame(step);
  };

  const triggerStats = () => {
    if (animated) return;
    animated = true;
    countUp(metricCreators, 24, 0, '');
    countUp(metricReach, 1.8, 1, 'M');
    countUp(metricRoas, 4.2, 1, 'x');
  };

  // Observe when hero section is in view
  const heroSection = document.querySelector('.hero-section');
  if (heroSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          triggerStats();
          observer.disconnect();
        }
      });
    }, { threshold: 0.2 });

    observer.observe(heroSection);
  } else {
    triggerStats();
  }

  // 2. Subtle 3D Card Hover Tilt (Desktop Only)
  if (heroCard && window.matchMedia('(pointer: fine)').matches && !prefersReducedMotion) {
    const visualWrapper = document.querySelector('.hero-visual');
    if (visualWrapper) {
      visualWrapper.addEventListener('mousemove', (e) => {
        const rect = heroCard.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotateX = -(y / rect.height) * 8;
        const rotateY = (x / rect.width) * 8;

        heroCard.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-3px)`;
      });

      visualWrapper.addEventListener('mouseleave', () => {
        heroCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    }
  }
});
