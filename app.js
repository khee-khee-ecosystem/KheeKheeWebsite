const initApp = () => {
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
      link.addEventListener('click', () => {
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
    const revealElements = document.querySelectorAll('.reveal');
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

  // Run initial dashboard telemetry animations
  setTimeout(() => {
    animateStats();
    animateChart();
    setupScrollReveal();
    setupScreenshotRotation();
    setupOfferCardsTilt();
  }, 400);
};

// Robust check for DOM loading completion
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
