const initApp = () => {
  // Initialize Lenis Smooth Scroll
  let lenisInstance = null;
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1.0,
      smoothTouch: false,
      touchMultiplier: 2.0,
      infinite: false,
    });

    lenisInstance = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }

  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // 1. Sticky Navbar Transition
  const checkScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Run immediately

  // 2. Mobile Menu Toggle
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });

    // Close drawer on nav link clicks
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        if (link.classList.contains('dropdown-toggle') && window.innerWidth <= 768) {
          e.preventDefault();
          link.parentElement.classList.toggle('active');
          return;
        }
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
      });
    });

    // Close drawer when mobile CTA buttons are tapped
    const mobileCtaBtns = navMenu.querySelectorAll('.nav-mobile-ctas button');
    mobileCtaBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
      });
    });
  }

  // 3. Stats Count Up Animation
  const animateStats = () => {
    const metrics = [
      { id: 'stat-creators', target: 24, suffix: '', decimals: 0 },
      { id: 'stat-reach', target: 1.8, suffix: 'M', decimals: 1 },
      { id: 'stat-roas', target: 4.2, suffix: '×', decimals: 1 }
    ];

    metrics.forEach(metric => {
      const el = document.getElementById(metric.id);
      if (!el) return;

      let startVal = 0;
      let endVal = metric.target;
      let duration = 1200;
      let startTime = null;

      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        // Easing out quadratic
        const easeProgress = progress * (2 - progress);
        const currentVal = easeProgress * (endVal - startVal) + startVal;

        el.textContent = currentVal.toFixed(metric.decimals) + metric.suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = endVal.toFixed(metric.decimals) + metric.suffix;
        }
      };

      requestAnimationFrame(step);
    });
  };

  // 4. Staggered Bar Chart Height Entry Animation
  const animateChart = () => {
    const chartBars = document.querySelectorAll('.chart-bar-fill');
    const targetHeights = ['45%', '70%', '50%', '90%', '65%', '80%'];

    chartBars.forEach((bar, index) => {
      if (targetHeights[index]) {
        // Force layout repaint, then apply style for CSS transition to trigger
        bar.style.height = '0%';
        setTimeout(() => {
          bar.style.height = targetHeights[index];
        }, 150 + index * 80);
      }
    });
  };

  // 5. Scroll Reveal Observer
  const setupScrollReveal = () => {
    const revealElements = document.querySelectorAll('.reveal, .reveal-item');
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  };

  // 6. Screenshot Auto Rotation
  const setupScreenshotRotation = () => {
    const showcase = document.querySelector('.screenshots-showcase');
    const leftEl = document.querySelector('.screenshot-left');
    const rightEl = document.querySelector('.screenshot-right');
    const centerEl = document.querySelector('.screenshot-center');
    
    if (!showcase || !leftEl || !rightEl || !centerEl) return;
    
    const els = [leftEl, centerEl, rightEl];
    const classes = ['screenshot-left', 'screenshot-center', 'screenshot-right'];
    
    let intervalId;
    
    const rotate = () => {
      const lastClass = classes.pop();
      classes.unshift(lastClass);
      els.forEach((el, index) => {
        el.className = `screenshot-item ${classes[index]}`;
      });
    };
    
    const startRotation = () => {
      intervalId = setInterval(rotate, 3500);
    };
    
    const stopRotation = () => {
      clearInterval(intervalId);
    };
    
    startRotation();
    
    showcase.addEventListener('mouseenter', stopRotation);
    showcase.addEventListener('mouseleave', startRotation);
  };

  // 7. Interactive 3D Tilt Effect for Offer Cards
  const setupOfferCardsTilt = () => {
    const cards = document.querySelectorAll('.offer-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xc = x / rect.width - 0.5;
        const yc = y / rect.height - 0.5;
        
        // Calculate tilt angles (max 10 degrees)
        const angleX = -yc * 10;
        const angleY = xc * 10;
        
        card.style.transition = 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.1s cubic-bezier(0.25, 1, 0.5, 1)';
        card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-8px) scale(1.02)`;
        card.style.boxShadow = `
          ${-angleY * 1.5}px ${angleX * 1.5}px 35px -10px rgba(37, 99, 235, 0.18),
          0 10px 25px -5px rgba(37, 99, 235, 0.05)
        `;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transition = '';
        card.style.transform = '';
        card.style.boxShadow = '';
      });
    });
  };

  // 8. Why Brands Choose - Autoscroll Ticker
  const setupChooseTicker = () => {
    const items = document.querySelectorAll('.choose-ticker-item');
    if (!items.length) return;
    
    let currentIndex = 0;
    
    setInterval(() => {
      const activeItem = items[currentIndex];
      activeItem.classList.remove('active');
      activeItem.classList.add('exit');
      
      currentIndex = (currentIndex + 1) % items.length;
      
      const nextItem = items[currentIndex];
      nextItem.classList.remove('exit');
      nextItem.classList.add('active');
      
      // Clean up exit class after animation finishes
      setTimeout(() => {
        items.forEach((item, idx) => {
          if (idx !== currentIndex) {
            item.classList.remove('exit');
          }
        });
      }, 800);
    }, 3200);
  };

  // 9. Book a Demo Modal Logic
  const setupDemoModal = () => {
    const demoModal = document.getElementById('demo-modal');
    if (!demoModal) return;

    // Move modal to body so position:fixed is never broken by parent transforms
    document.body.appendChild(demoModal);

    const modalTitle = demoModal.querySelector('.modal-title');
    const modalSubtitle = demoModal.querySelector('.modal-subtitle');

    const openModal = (e, intent) => {
      if (e) e.preventDefault();

      // Reset Google reCAPTCHA every time the modal is opened
      if (typeof grecaptcha !== 'undefined') {
        try {
          grecaptcha.reset();
        } catch (err) {
          console.warn('reCAPTCHA reset failed', err);
        }
      }

      // Set the hidden intent field so Formspree receives it
      const intentField = document.getElementById('form-intent');
      if (intentField) intentField.value = intent;

      // Update modal title + subtitle to match intent
      if (modalTitle) {
        modalTitle.textContent = intent === 'Join Waitlist' ? 'Join the Waitlist' : 'Book a Demo';
      }
      if (modalSubtitle) {
        modalSubtitle.textContent = intent === 'Join Waitlist'
          ? 'Be the first to know when we launch. Leave your details below.'
          : 'Fill in the details below and we will get back to you shortly.';
      }

      demoModal.style.display = 'flex';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          demoModal.classList.add('active');
        });
      });
      document.body.style.overflow = 'hidden';
      if (lenisInstance) lenisInstance.stop();
    };

    const closeModal = () => {
      demoModal.classList.remove('active');
      setTimeout(() => {
        demoModal.style.display = 'none';
      }, 300);
      document.body.style.overflow = '';
      if (lenisInstance) lenisInstance.start();
    };

    // Bind all "Book a Demo" and "Join Waitlist" triggers with correct intent
    document.querySelectorAll('button, a').forEach(el => {
      const text = el.textContent.trim().toLowerCase();
      const isWaitlist = text.includes('join waitlist') || text.includes('waitlist');
      const isDemo = text.includes('book a demo') || el.classList.contains('btn-book-demo');

      if (isWaitlist) {
        el.addEventListener('click', (e) => openModal(e, 'Join Waitlist'));
      } else if (isDemo) {
        el.addEventListener('click', (e) => openModal(e, 'Book a Demo'));
      }
    });

    // Close on X button
    const closeBtn = document.getElementById('close-modal');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // Close on backdrop click
    demoModal.addEventListener('click', (e) => {
      if (e.target === demoModal) closeModal();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && demoModal.style.display === 'flex') closeModal();
    });
  };

  // Run modal setup immediately so triggers are bound before user interaction
  setupDemoModal();

  // Formspree AJAX submission — intercepts all demo forms on this page
  const setupFormspree = () => {
    const form = document.getElementById('demo-form');
    if (!form) return;

    const statusEl = document.getElementById('form-status');
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Verify Google reCAPTCHA first
      if (typeof grecaptcha !== 'undefined') {
        const response = grecaptcha.getResponse();
        if (!response) {
          if (statusEl) {
            statusEl.style.color = '#dc2626';
            statusEl.textContent = 'Please complete the reCAPTCHA verification.';
          }
          return;
        }
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      if (statusEl) statusEl.textContent = '';

      const data = new FormData(form);

      try {
        const response = await fetch('https://formspree.io/f/mpqvdwav', {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          form.reset();
          if (typeof grecaptcha !== 'undefined') grecaptcha.reset();
          submitBtn.textContent = 'Submit';
          submitBtn.disabled = false;
          const demoModal = document.getElementById('demo-modal');
          if (demoModal) {
            demoModal.classList.remove('active');
            setTimeout(() => { demoModal.style.display = 'none'; }, 300);
            document.body.style.overflow = '';
            if (lenisInstance) lenisInstance.start();
          }
        } else {
          throw new Error('Server error');
        }
      } catch (err) {
        if (statusEl) {
          statusEl.style.color = '#dc2626';
          statusEl.textContent = 'Something went wrong. Please try again.';
        }
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit';
        if (typeof grecaptcha !== 'undefined') grecaptcha.reset();
      }
    });
  };

  setupFormspree();

  // Run initial dashboard telemetry animations
  setTimeout(() => {
    animateStats();
    animateChart();
    setupScrollReveal();
    setupScreenshotRotation();
    setupOfferCardsTilt();
    setupChooseTicker();
  }, 400);
};

// Robust check for DOM loading completion
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
