/**
 * Khee Khee - Section 06: Agency Teams Controller
 * Scroll reveal observer and subtle desktop card 3D tilt interaction.
 */
document.addEventListener('DOMContentLoaded', () => {
  const teamsSection = document.getElementById('stakeholders');
  if (!teamsSection) return;

  // 1. Scroll Reveal Observer
  const revealElements = teamsSection.querySelectorAll('.teams-reveal');
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

  // 2. Subtle Desktop 3D Card Hover Depth
  const hubCard = teamsSection.querySelector('.agency-hub-card');
  if (hubCard && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    hubCard.addEventListener('mousemove', (e) => {
      const rect = hubCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -1.8;
      const rotateY = ((x - centerX) / centerX) * 1.8;

      hubCard.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    hubCard.addEventListener('mouseleave', () => {
      hubCard.style.transform = '';
    });
  }
});
