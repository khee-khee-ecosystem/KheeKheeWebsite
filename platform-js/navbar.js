/**
 * Khee Khee - Navbar Controller (Dark Theme)
 * Handles sticky scroll transitions, mobile drawer menu, accessibility states, and mobile dropdown toggles.
 */
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-toggle), .dropdown-item, .nav-mobile-ctas a, .nav-mobile-ctas button');

  // 1. Sticky Navbar Transition
  let isTicking = false;
  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
    isTicking = false;
  };

  window.addEventListener('scroll', () => {
    if (!isTicking) {
      requestAnimationFrame(handleScroll);
      isTicking = true;
    }
  }, { passive: true });
  handleScroll();

  // 2. Mobile Menu Toggle with Accessibility & Inert Isolation
  if (menuToggle && navMenu) {
    const setMenuState = (isOpen) => {
      if (isOpen) {
        navMenu.classList.add('active');
        menuToggle.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        navMenu.removeAttribute('inert');
        navMenu.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      } else {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        if (window.innerWidth <= 991) {
          navMenu.setAttribute('inert', '');
          navMenu.setAttribute('aria-hidden', 'true');
        } else {
          navMenu.removeAttribute('inert');
          navMenu.removeAttribute('aria-hidden');
        }
        document.body.style.overflow = '';
      }
    };

    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = !navMenu.classList.contains('active');
      setMenuState(willOpen);
    });

    // Close menu when clicking regular navigation links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        setMenuState(false);
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        setMenuState(false);
      }
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        setMenuState(false);
      }
    });

    // Sync state on window resize
    const handleResize = () => {
      if (window.innerWidth > 991) {
        navMenu.removeAttribute('inert');
        navMenu.removeAttribute('aria-hidden');
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      } else if (!navMenu.classList.contains('active')) {
        navMenu.setAttribute('inert', '');
        navMenu.setAttribute('aria-hidden', 'true');
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    // Initialize initial state on load
    handleResize();
  }

  // 3. Mobile Dropdown Toggles
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 991) {
        e.preventDefault();
        e.stopPropagation();
        const parent = toggle.closest('.nav-item-dropdown');
        if (parent) {
          parent.classList.toggle('active');
        }
      }
    });
  });
});

