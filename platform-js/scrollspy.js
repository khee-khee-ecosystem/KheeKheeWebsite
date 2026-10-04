/**
 * Khee Khee - Animated & Interactive Scroll Spy Controller
 * Tracks active section dynamically via IntersectionObserver, animates reading progress bar,
 * and handles smooth navigation with navbar offset.
 */
document.addEventListener('DOMContentLoaded', () => {
  const progressBar = document.getElementById('scroll-progress-bar');
  const dock = document.getElementById('scrollspy-dock');
  const items = document.querySelectorAll('.scrollspy-item');
  if (!items.length) return;

  const sectionIds = Array.from(items).map(item => item.getAttribute('data-section'));
  const sections = sectionIds
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const navbar = document.getElementById('navbar');
  const getNavHeight = () => (navbar ? navbar.offsetHeight : 64);

  // 1. Smooth Click with Navbar Offset
  items.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = item.getAttribute('data-section');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const navHeight = getNavHeight();
        const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
        history.pushState(null, '', `#${targetId}`);
        setActive(targetId);
      }
    });
  });

  const setActive = (id) => {
    items.forEach(item => {
      if (item.getAttribute('data-section') === id) {
        item.classList.add('active');
        item.setAttribute('aria-current', 'true');
      } else {
        item.classList.remove('active');
        item.removeAttribute('aria-current');
      }
    });
  };

  // 2. IntersectionObserver for Active Section Tracking
  let observer;
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -55% 0px',
      threshold: [0, 0.2, 0.5]
    };

    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach(sec => observer.observe(sec));
  }

  // 3. Smooth Top Reading Progress Bar & Dock Opacity
  let isTicking = false;
  const updateScrollState = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
      progressBar.setAttribute('aria-valuenow', Math.round(progress));
    }

    if (dock) {
      // Keep dock subtly translucent at the very top (Hero) and fully vivid as soon as scrolling begins
      if (scrollTop < 80) {
        dock.style.opacity = '0.55';
      } else {
        dock.style.opacity = '1';
      }
    }

    isTicking = false;
  };

  window.addEventListener('scroll', () => {
    if (!isTicking) {
      requestAnimationFrame(updateScrollState);
      isTicking = true;
    }
  }, { passive: true });

  updateScrollState();
});
