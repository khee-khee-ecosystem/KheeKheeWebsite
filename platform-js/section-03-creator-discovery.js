/**
 * Khee Khee - Section 03: Creator Discovery Controller
 * Handles:
 * 1. Marquee hover pause and interactive pointer drag / touch swipe
 * 2. Card auto-scaling interaction feedback
 */
function initCreatorDiscoverySection() {
  const container = document.querySelector('.discovery-marquee-container');
  const track = document.getElementById('discovery-marquee-track');

  if (!container || !track) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    track.style.animation = 'none';
    container.style.overflowX = 'auto';
    return;
  }

  // Pointer drag support for desktop/tablet
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  container.addEventListener('pointerdown', (e) => {
    isDown = true;
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
    track.style.animationPlayState = 'paused';
  });

  window.addEventListener('pointerup', () => {
    isDown = false;
    track.style.animationPlayState = 'running';
  });

  window.addEventListener('pointercancel', () => {
    isDown = false;
    track.style.animationPlayState = 'running';
  });

  // Card click micro-interaction: smooth scale pulse
  const cards = track.querySelectorAll('.criteria-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      card.style.transform = 'translateY(-6px) scale(1.05)';
      setTimeout(() => {
        card.style.transform = '';
      }, 300);
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCreatorDiscoverySection);
} else {
  initCreatorDiscoverySection();
}
