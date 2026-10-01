/**
 * Khee Khee - Section 11: Why Khee Khee Controller
 * Scroll reveal observer and micro-interactions.
 */
document.addEventListener('DOMContentLoaded', () => {
  const whySection = document.getElementById('why-kheekhee');
  if (!whySection) return;

  const revealElements = whySection.querySelectorAll('.why-kheekhee-reveal');
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
