/**
 * KHEE KHEE - SECTION 16: FREQUENTLY ASKED QUESTIONS (FAQ)
 * Controller for accessible accordion toggles, keyboard interactions, and scroll reveals.
 */
document.addEventListener('DOMContentLoaded', () => {
  const faqSection = document.querySelector('.faq-section');
  if (!faqSection) return;

  // 1. Intersection Observer for Scroll Reveal
  const reveals = faqSection.querySelectorAll('.faq-reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  // 2. Accordion Functionality
  const triggers = faqSection.querySelectorAll('.faq-trigger');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.faq-item');
      if (!item) return;

      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      if (isExpanded) {
        // Collapse
        item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        // Expand
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // 3. Deep link support (e.g., #faq-2)
  if (window.location.hash) {
    const targetEl = document.querySelector(window.location.hash);
    if (targetEl && targetEl.classList.contains('faq-item')) {
      targetEl.classList.add('is-open');
      const trigger = targetEl.querySelector('.faq-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
      setTimeout(() => {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }
});
