const initApp = () => {
  // Initialize Lenis Smooth Scroll
  let lenisInstance = null;
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
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

    // Dynamic reCAPTCHA v3 Lazy Loader
    const RECAPTCHA_SITE_KEY = '6LfpeFwtAAAAAM5tZdY_evOuDC-Sy2KgO9bXQpQ-';
    let recaptchaLoaded = false;
    const loadRecaptcha = () => {
      if (recaptchaLoaded || document.querySelector('script[src*="recaptcha"]')) {
        return;
      }
      recaptchaLoaded = true;
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    };

    const openModal = (e, intent) => {
      if (e) e.preventDefault();

      // Ensure reCAPTCHA script is loaded
      loadRecaptcha();

      // Set the hidden intent field so Formspree receives it
      const intentField = document.getElementById('form-intent');
      if (intentField) intentField.value = intent;

      // Pre-select role if clicked from specific platform CTAs or on specific subpages
      const roleSelect = document.getElementById('demo-role');
      if (roleSelect) {
        const path = window.location.pathname.toLowerCase();
        if (intent.includes('Agency') || intent.includes('Managing') || path.includes('agencies')) {
          roleSelect.value = 'Agency';
        } else if (intent.includes('Creator') || path.includes('creators')) {
          roleSelect.value = 'Creator';
        } else if (intent.includes('Brand') || intent.includes('Campaign') || intent.includes('Get Started') || path.includes('brands')) {
          roleSelect.value = 'Brand';
        } else {
          roleSelect.value = '';
        }
      }

      // Update modal title + subtitle to match intent
      const path = window.location.pathname.toLowerCase();
      if (modalTitle) {
        if (intent === 'Join as Creator') {
          modalTitle.textContent = 'Join as Creator';
        } else if (intent === 'Start a Campaign' || intent === 'Get Started') {
          modalTitle.textContent = 'Start a Campaign';
        } else if (intent === 'Start Managing Campaigns' || (path.includes('agencies') && intent === 'Book a Demo')) {
          modalTitle.textContent = 'Scale Your Agency';
        } else if (intent === 'Get Early Access') {
          modalTitle.textContent = 'Get Early Access';
        } else if (intent === 'Join Waitlist') {
          modalTitle.textContent = 'Join the Waitlist';
        } else {
          modalTitle.textContent = 'Book a Demo';
        }
      }

      if (modalSubtitle) {
        if (intent === 'Join as Creator') {
          modalSubtitle.textContent = 'Apply to join our creator platform. Fill in your details below.';
        } else if (intent === 'Start a Campaign' || intent === 'Get Started') {
          modalSubtitle.textContent = 'Launch influencer campaigns with ease. Fill in your details below.';
        } else if (intent === 'Start Managing Campaigns' || (path.includes('agencies') && intent === 'Book a Demo')) {
          modalSubtitle.textContent = 'Streamline agency operations. Fill in your details below.';
        } else if (intent === 'Get Early Access' || intent === 'Join Waitlist') {
          modalSubtitle.textContent = 'Be the first to know when we launch. Leave your details below.';
        } else {
          modalSubtitle.textContent = 'Fill in the details below and we will get back to you shortly.';
        }
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

    // Bind all CTA triggers with specific intent
    document.querySelectorAll('button, a').forEach(el => {
      const text = el.textContent.trim().toLowerCase();

      let intent = null;
      if (text.includes('join as creator')) {
        intent = 'Join as Creator';
      } else if (text.includes('start a campaign')) {
        intent = 'Start a Campaign';
      } else if (text.includes('start managing campaigns')) {
        intent = 'Start Managing Campaigns';
      } else if (text.includes('get started')) {
        intent = 'Get Started';
      } else if (text.includes('early access')) {
        intent = 'Get Early Access';
      } else if (text.includes('join waitlist') || text.includes('waitlist')) {
        intent = 'Join Waitlist';
      } else if (text.includes('book a demo') || el.classList.contains('btn-book-demo')) {
        intent = 'Book a Demo';
      }

      if (intent) {
        el.removeAttribute('onclick');
        el.addEventListener('click', (e) => openModal(e, intent));
        el.addEventListener('mouseenter', loadRecaptcha, { once: true });
        el.addEventListener('focusin', loadRecaptcha, { once: true });
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

  // 10. Image Lazy Loading with IntersectionObserver
  const setupLazyLoading = () => {
    const lazyImages = document.querySelectorAll('img.lazy-load');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const image = entry.target;
            if (image.dataset.src) {
              image.src = image.dataset.src;
              image.removeAttribute('data-src');
            }
            image.addEventListener('load', () => {
              image.classList.add('loaded');
            });
            if (image.complete) {
              image.classList.add('loaded');
            }
            observer.unobserve(image);
          }
        });
      }, {
        rootMargin: '100px 0px',
        threshold: 0.01
      });

      lazyImages.forEach(image => {
        imageObserver.observe(image);
      });
    } else {
      // Fallback for older browsers
      lazyImages.forEach(image => {
        if (image.dataset.src) {
          image.src = image.dataset.src;
          image.removeAttribute('data-src');
          image.classList.add('loaded');
        }
      });
    }
  };

  setupLazyLoading();

  // Live Form Input Sanitization & Validation
  const setupFormValidation = () => {
    const form = document.getElementById('demo-form');
    if (!form) return;

    const nameInput = document.getElementById('demo-name');
    const emailInput = document.getElementById('demo-email');
    const phoneInput = document.getElementById('demo-phone');

    // 1. Name field: strip numbers and invalid symbols as user types
    if (nameInput) {
      nameInput.setAttribute('pattern', "[a-zA-Z\\s'\\-]+");
      nameInput.addEventListener('input', () => {
        nameInput.value = nameInput.value.replace(/[^a-zA-Z\s'\-]/g, '');
      });
    }

    // 2. Phone field: allow digits only, max 10 digits
    if (phoneInput) {
      phoneInput.setAttribute('maxlength', '10');
      phoneInput.setAttribute('pattern', '[0-9]{10}');
      phoneInput.setAttribute('inputmode', 'numeric');
      if (!phoneInput.getAttribute('placeholder') || phoneInput.getAttribute('placeholder').includes('+91')) {
        phoneInput.setAttribute('placeholder', '9876543210');
      }
      phoneInput.addEventListener('input', () => {
        phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 10);
      });
    }

    // 3. Email field: strip spaces
    if (emailInput) {
      emailInput.addEventListener('input', () => {
        emailInput.value = emailInput.value.replace(/\s/g, '');
      });
    }
  };

  setupFormValidation();

  // Formspree AJAX submission — intercepts all demo forms on this page
  const setupFormspree = () => {
    const form = document.getElementById('demo-form');
    if (!form) return;

    const statusEl = document.getElementById('form-status');
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('demo-name');
      const emailInput = document.getElementById('demo-email');
      const phoneInput = document.getElementById('demo-phone');
      const roleInput = document.getElementById('demo-role');

      const nameVal = nameInput ? nameInput.value.trim() : '';
      const emailVal = emailInput ? emailInput.value.trim() : '';
      const phoneVal = phoneInput ? phoneInput.value.trim() : '';
      const roleVal = roleInput ? roleInput.value : '';

      // 1. Validate Name (letters only, no numbers)
      if (!nameVal || nameVal.length < 2 || /\d/.test(nameVal)) {
        if (statusEl) {
          statusEl.style.color = '#dc2626';
          statusEl.textContent = 'Please enter a valid full name (letters only, no numbers).';
        }
        if (nameInput) nameInput.focus();
        return;
      }

      // 2. Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailVal || !emailRegex.test(emailVal)) {
        if (statusEl) {
          statusEl.style.color = '#dc2626';
          statusEl.textContent = 'Please enter a valid email address.';
        }
        if (emailInput) emailInput.focus();
        return;
      }

      // 3. Validate Phone Number (must be exactly 10 digits)
      if (!phoneVal || !/^\d{10}$/.test(phoneVal)) {
        if (statusEl) {
          statusEl.style.color = '#dc2626';
          statusEl.textContent = 'Please enter a valid 10-digit phone number.';
        }
        if (phoneInput) phoneInput.focus();
        return;
      }

      // 4. Validate Role Selection
      if (!roleVal) {
        if (statusEl) {
          statusEl.style.color = '#dc2626';
          statusEl.textContent = 'Please select your role.';
        }
        if (roleInput) roleInput.focus();
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      if (statusEl) statusEl.textContent = '';

      const data = new FormData(form);

      // Execute Google reCAPTCHA v3 if script is loaded
      if (typeof grecaptcha !== 'undefined') {
        try {
          const token = await new Promise((resolve) => {
            grecaptcha.ready(() => {
              grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'submit' })
                .then(resolve)
                .catch((err) => {
                  console.warn('reCAPTCHA execute failed:', err);
                  resolve(null);
                });
            });
          });
          if (token) {
            data.set('g-recaptcha-response', token);
          }
        } catch (err) {
          console.warn('reCAPTCHA execution error:', err);
        }
      }

      try {
        const response = await fetch('https://formspree.io/f/mpqvdwav', {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          form.reset();
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
