/**
 * Khee Khee - Section 12: What Makes a Great Influencer Marketing Platform Controller
 * Scroll reveal observer and micro-interactions.
 */
document.addEventListener('DOMContentLoaded', () => {
  const evalSection = document.getElementById('platform-evaluation');
  if (!evalSection) return;

  const revealElements = evalSection.querySelectorAll('.evaluation-reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }
});
