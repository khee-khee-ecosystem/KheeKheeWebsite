const initApp = () => {
  // Global reCAPTCHA v3 site key
  const RECAPTCHA_SITE_KEY = '6LfpeFwtAAAAAM5tZdY_evOuDC-Sy2KgO9bXQpQ-';

  // Initialize Lenis Smooth Scroll (only on desktop non-touch devices for maximum mobile performance)
  let lenisInstance = null;
  const isTouchOrMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth < 1024);
  if (typeof Lenis !== 'undefined' && !isTouchOrMobile) {
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.0,
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

  // 1. Sticky Navbar Transition (passive & debounced via RAF)
  let scrollTicking = false;
  const checkScroll = () => {
    const scrollY = lenisInstance ? lenisInstance.scroll : window.scrollY;
    if (scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    scrollTicking = false;
  };

  const onScroll = () => {
    if (!scrollTicking) {
      requestAnimationFrame(checkScroll);
      scrollTicking = true;
    }
  };

  if (lenisInstance) {
    lenisInstance.on('scroll', onScroll);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  checkScroll(); // Run immediately

  // 2. Mobile Menu Toggle
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });

    // Mobile Dropdown Toggle Handler
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          e.stopPropagation();
          const parentItem = toggle.closest('.nav-item-dropdown');
          if (parentItem) {
            parentItem.classList.toggle('active');
          }
        }
      });
    });

    // Close drawer on standard nav link clicks (excluding dropdown toggle)
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        if (link.classList.contains('dropdown-toggle')) {
          return;
        }
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
      });
    });

    // Close drawer when dropdown sub-items or mobile CTA buttons are tapped
    const dropdownItems = navMenu.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
      item.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
      });
    });

    const mobileCtaBtns = navMenu.querySelectorAll('.nav-mobile-ctas button, .nav-mobile-ctas a');
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

  // 4. Staggered Bar Chart GPU Entry Animation (100% composited transform)
  const animateChart = () => {
    const chartBars = document.querySelectorAll('.chart-bar-fill');
    chartBars.forEach((bar, index) => {
      bar.style.transform = 'scaleY(0)';
      requestAnimationFrame(() => {
        setTimeout(() => {
          bar.style.transform = 'scaleY(1)';
        }, 100 + index * 50);
      });
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

  // 6. Interactive Duo Screenshot Showcase (UI/UX Pro Max - Ambient Auto Rotating & Scroll Aware)
  const setupScreenshotShowcase = () => {
    const showcase = document.querySelector('.screenshots-showcase.duo-showcase') || document.querySelector('.screenshots-showcase');
    if (!showcase) return;

    const creatorItem = showcase.querySelector('.screenshot-creator');
    const agencyItem = showcase.querySelector('.screenshot-agency');
    if (!creatorItem || !agencyItem) return;

    let activePlatform = showcase.getAttribute('data-active') || 'creator';
    let intervalId = null;
    let isIntersecting = false;
    let isUserScrolling = false;
    let scrollPauseTimeout = null;
    const ROTATION_INTERVAL = 4500; // Refined, elegant 4.5s ambient showcase rotation

    const setActive = (platform) => {
      activePlatform = platform;
      showcase.setAttribute('data-active', platform);

      const isCreator = platform === 'creator';
      creatorItem.classList.toggle('is-active', isCreator);
      creatorItem.classList.toggle('is-companion', !isCreator);
      agencyItem.classList.toggle('is-active', !isCreator);
      agencyItem.classList.toggle('is-companion', isCreator);
    };

    const togglePlatform = () => {
      if (!isIntersecting || isUserScrolling) return;
      const next = activePlatform === 'creator' ? 'agency' : 'creator';
      setActive(next);
    };

    const startAutoRotation = () => {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }
      stopAutoRotation();
      if (isIntersecting && !isUserScrolling) {
        intervalId = setInterval(togglePlatform, ROTATION_INTERVAL);
      }
    };

    const stopAutoRotation = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    // Pause auto-rotation while user is scrolling to completely eliminate frame collision
    const handleScrollPause = () => {
      isUserScrolling = true;
      stopAutoRotation();
      if (scrollPauseTimeout) clearTimeout(scrollPauseTimeout);
      scrollPauseTimeout = setTimeout(() => {
        isUserScrolling = false;
        if (isIntersecting) {
          startAutoRotation();
        }
      }, 1000);
    };

    if (lenisInstance) {
      lenisInstance.on('scroll', handleScrollPause);
    } else {
      window.addEventListener('scroll', handleScrollPause, { passive: true });
    }

    // IntersectionObserver: only rotate when showcase section is actually visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isIntersecting = entry.isIntersecting && entry.intersectionRatio >= 0.25;
        if (isIntersecting) {
          startAutoRotation();
        } else {
          stopAutoRotation();
        }
      });
    }, {
      threshold: [0, 0.25, 0.5]
    });

    observer.observe(showcase);

    // Clicking either phone immediately switches focus and restarts timer
    creatorItem.addEventListener('click', () => {
      setActive('creator');
      startAutoRotation();
    });

    creatorItem.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setActive('creator');
        startAutoRotation();
      }
    });

    agencyItem.addEventListener('click', () => {
      setActive('agency');
      startAutoRotation();
    });

    agencyItem.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setActive('agency');
        startAutoRotation();
      }
    });

    // Mobile touch swipe support
    let touchStartX = 0;
    showcase.addEventListener('touchstart', (e) => {
      if (e.changedTouches && e.changedTouches.length > 0) {
        touchStartX = e.changedTouches[0].screenX;
      }
    }, { passive: true });

    showcase.addEventListener('touchend', (e) => {
      if (e.changedTouches && e.changedTouches.length > 0) {
        const touchEndX = e.changedTouches[0].screenX;
        const diffX = touchEndX - touchStartX;
        if (Math.abs(diffX) > 40) {
          if (diffX < 0 && activePlatform === 'creator') {
            setActive('agency');
          } else if (diffX > 0 && activePlatform === 'agency') {
            setActive('creator');
          }
          startAutoRotation();
        }
      }
    }, { passive: true });

    // Initialize state
    setActive(activePlatform);
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
      let intentField = document.getElementById('form-intent');
      if (!intentField) {
        const form = demoModal.querySelector('form');
        if (form) {
          intentField = document.createElement('input');
          intentField.type = 'hidden';
          intentField.id = 'form-intent';
          intentField.name = 'intent';
          form.prepend(intentField);
        }
      }
      if (intentField) intentField.value = intent;

      // Pre-select role if clicked from specific platform CTAs or on specific subpages
      // Pre-select role if clicked from specific platform CTAs or on specific subpages
      const roleSelect = document.getElementById('demo-role');
      if (roleSelect) {
        const path = window.location.pathname.toLowerCase();
        if (intent.includes('Agency') || intent.includes('Managing') || path.includes('agencies')) {
          roleSelect.value = 'Agency';
        } else if (intent.includes('Creator') || path.includes('creators') || path.includes('auto-dm-instagram') || path.includes('dm')) {
          roleSelect.value = 'Creator';
        } else if (intent.includes('Brand') || intent.includes('Campaign') || path.includes('brands')) {
          roleSelect.value = 'Brand';
        } else {
          roleSelect.value = '';
        }
      }

      // Update modal title + subtitle to match intent
      const path = window.location.pathname.toLowerCase();
      if (modalTitle) {
        if (path.includes('auto-dm-instagram') || path.includes('dm')) {
          modalTitle.textContent = 'Try Khee Khee / Book a Demo';
        } else if (intent === 'Free Sign Up for Creators' || intent === 'Join as Creator') {
          modalTitle.textContent = 'Free Sign Up for Creators';
        } else if (intent === 'Start with Free — Agency Access') {
          modalTitle.textContent = 'Start with Free — Agency OS';
        } else if (intent === 'Schedule Agency Demo') {
          modalTitle.textContent = 'Schedule Agency Walkthrough';
        } else if (intent === 'Sign Up for Free' || intent === 'Start with Free') {
          modalTitle.textContent = 'Create Your Free Account';
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
        if (path.includes('auto-dm-instagram') || path.includes('dm')) {
          modalSubtitle.textContent = 'Automate your Instagram Reel comments into direct messages, new followers, and sales.';
        } else if (intent === 'Free Sign Up for Creators' || intent === 'Join as Creator') {
          modalSubtitle.textContent = 'Create your verified creator profile, showcase your media kit, and receive direct collab opportunities.';
        } else if (intent === 'Start with Free — Agency Access') {
          modalSubtitle.textContent = 'Centralize campaign communication, manage creator rosters, and add your entire team.';
        } else if (intent === 'Schedule Agency Demo') {
          modalSubtitle.textContent = 'See how Khee Khee eliminates spreadsheet chaos for your influencer marketing agency.';
        } else if (intent === 'Sign Up for Free' || intent === 'Start with Free') {
          modalSubtitle.textContent = 'Join Khee Khee in seconds. Choose your role below to get instant access.';
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

      const submitBtn = demoModal.querySelector('.form-submit-btn');
      if (submitBtn) {
        if (intent.includes('Free') || intent.includes('Sign Up')) {
          submitBtn.textContent = 'Get Free Access →';
        } else {
          submitBtn.textContent = 'Submit';
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
    document.querySelectorAll('button, a, .btn-book-demo').forEach(el => {
      // Exclude FAQ accordions, form submit buttons, toggles, close buttons, modal contents
      if (
        el.closest('.contact-faq-box') ||
        el.closest('.homepage-faq-section') ||
        el.closest('.faq-grid-container') ||
        el.classList.contains('contact-faq-question') ||
        el.classList.contains('faq-card-button') ||
        el.classList.contains('menu-toggle') ||
        el.classList.contains('modal-close') ||
        el.classList.contains('form-submit-btn') ||
        el.closest('form') ||
        el.closest('.modal-card')
      ) {
        return;
      }

      const text = el.textContent.trim().toLowerCase();
      const href = el.getAttribute('href');

      // 1. Direct external links (e.g. app.kheekhee.com) should navigate naturally unless explicitly a demo trigger
      if (href && href.startsWith('http') && !el.classList.contains('btn-book-demo')) {
        return;
      }

      // 2. If it is a Sign Up for Free link/button, ensure direct redirection to app.kheekhee.com
      if (
        text.includes('sign up for free') ||
        text.includes('sign up free') ||
        text.includes('free sign up') ||
        text.includes('start with free') ||
        text.includes('join as creator') ||
        el.id === 'nav-signup' ||
        el.id === 'mob-nav-signup' ||
        el.id === 'hero-signup' ||
        el.id === 'signup-creator-btn' ||
        el.id === 'signup-agency-btn' ||
        el.id === 'cta-signup-free'
      ) {
        if (!href || href === '#') {
          el.addEventListener('click', (e) => {
            e.preventDefault();
            window.open('https://app.kheekhee.com', '_blank', 'noopener,noreferrer');
          });
        }
        return; // Don't bind openModal for Sign Up for Free or Join as Creator
      }

      // 3. Demo and lead capture triggers for modal
      let intent = null;
      if (text.includes('creator access')) {
        intent = 'Join as Creator';
      } else if (text.includes('agency demo') || text.includes('agency walkthrough') || text.includes('schedule agency demo')) {
        intent = 'Schedule Agency Demo';
      } else if (text.includes('scale your agency') || text.includes('start managing campaigns')) {
        intent = 'Scale Your Agency';
      } else if (text.includes('start a campaign')) {
        intent = 'Start a Campaign';
      } else if (text.includes('get started')) {
        intent = 'Get Started';
      } else if (text.includes('early access')) {
        intent = 'Get Early Access';
      } else if (text.includes('join waitlist') || text.includes('waitlist')) {
        intent = 'Join Waitlist';
      } else if (text.includes('book a demo') || text.includes('book demo') || el.classList.contains('btn-book-demo')) {
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

  // Live Form Input Sanitization & Validation for ALL lead forms (modal + inline)
  const setupFormValidation = () => {
    const forms = document.querySelectorAll('#demo-form, #inline-cta-form, .modal-form, .ajax-lead-form');
    forms.forEach(form => {
      const nameInput = form.querySelector('input[name="name"]');
      const emailInput = form.querySelector('input[name="email"]');
      const phoneInput = form.querySelector('input[name="phone"]');

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
    });
  };

  setupFormValidation();

  // Formspree AJAX submission — handles all lead/demo forms seamlessly
  const setupFormspree = () => {
    const forms = document.querySelectorAll('#demo-form, #inline-cta-form, .modal-form, .ajax-lead-form');
    forms.forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const statusEl = form.querySelector('.form-status-msg') || form.querySelector('#form-status') || form.querySelector('#inline-form-status') || document.getElementById('form-status');
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn ? submitBtn.textContent : 'Submit';

        const nameInput = form.querySelector('input[name="name"]');
        const emailInput = form.querySelector('input[name="email"]');
        const phoneInput = form.querySelector('input[name="phone"]');
        const roleInput = form.querySelector('select[name="role"]');

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
            statusEl.textContent = 'Please enter a valid work email address.';
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

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Submitting...';
        }
        if (statusEl) {
          statusEl.style.color = '#2563EB';
          statusEl.textContent = 'Submitting your request...';
        }

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
            if (statusEl) {
              statusEl.style.color = '#10B981';
              statusEl.textContent = '✓ Thank you! We received your request and will contact you shortly.';
            }
            if (submitBtn) {
              submitBtn.textContent = '✓ Submitted';
            }

            const demoModal = document.getElementById('demo-modal');
            if (demoModal && form.closest('#demo-modal')) {
              setTimeout(() => {
                demoModal.classList.remove('active');
                setTimeout(() => { demoModal.style.display = 'none'; }, 300);
                document.body.style.overflow = '';
                if (lenisInstance) lenisInstance.start();
                if (submitBtn) {
                  submitBtn.disabled = false;
                  submitBtn.textContent = originalBtnText;
                }
              }, 1200);
            } else {
              setTimeout(() => {
                if (submitBtn) {
                  submitBtn.disabled = false;
                  submitBtn.textContent = originalBtnText;
                }
                if (statusEl) {
                  statusEl.textContent = '';
                }
              }, 6000);
            }
          } else {
            throw new Error('Server error');
          }
        } catch (err) {
          if (statusEl) {
            statusEl.style.color = '#dc2626';
            statusEl.textContent = 'Something went wrong. Please try again.';
          }
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
          }
        }
      });
    });
  };

  setupFormspree();

  // FAQ Accordion Toggle Handler (with aria-expanded accessibility)
  const setupFaqAccordion = () => {
    const faqButtons = document.querySelectorAll('.faq-card-button, .contact-faq-question');
    faqButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-card-item, .contact-faq-item');
        if (!item) return;
        const isActive = item.classList.contains('active');
        
        // Close siblings if desired
        const parent = item.parentElement;
        if (parent) {
          parent.querySelectorAll('.faq-card-item, .contact-faq-item').forEach(child => {
            child.classList.remove('active');
            const childBtn = child.querySelector('.faq-card-button, .contact-faq-question');
            if (childBtn) childBtn.setAttribute('aria-expanded', 'false');
          });
        }

        if (!isActive) {
          item.classList.add('active');
          btn.setAttribute('aria-expanded', 'true');
        } else {
          item.classList.remove('active');
          btn.setAttribute('aria-expanded', 'false');
        }
      });
    });
  };

  // Run initial dashboard telemetry animations
  setTimeout(() => {
    animateStats();
    animateChart();
    setupScrollReveal();
    setupScreenshotShowcase();
    setupOfferCardsTilt();
    setupChooseTicker();
    setupFaqAccordion();
  }, 400);
};

// Robust check for DOM loading completion
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
