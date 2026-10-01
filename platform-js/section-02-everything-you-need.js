/**
 * Khee Khee - Section 02: Everything You Need Controller
 * Handles:
 * 1. Desktop Parallax & 3D Stage Tilt
 * 2. Mobile Image Carousel with Next / Prev buttons, Dots, and Touch Swipe
 */
function initEverythingSection() {
  // ==========================================
  // 1. DESKTOP PARALLAX CONTROLLER
  // ==========================================
  const section = document.querySelector('.everything-section');
  const desktopStage = document.querySelector('.desktop-parallax-view');
  const mainFrame = document.querySelector('.parallax-main-frame');
  const layerBriefing = document.querySelector('.parallax-layer-briefing');
  const layerSettings = document.querySelector('.parallax-layer-settings');
  const overlapBadgeTop = document.querySelector('.overlap-badge-top-left');
  const overlapBadgeBottom = document.querySelector('.overlap-badge-bottom-right');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop = window.matchMedia('(min-width: 992px)').matches;

  if (!prefersReducedMotion && isDesktop && section && desktopStage) {
    let ticking = false;
    const handleParallaxScroll = () => {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top <= windowHeight && rect.bottom >= 0) {
        const sectionCenter = rect.top + rect.height / 2;
        const progress = (windowHeight / 2 - sectionCenter) / (windowHeight / 2);

        const mainOffset = progress * 10;
        const briefingOffset = progress * -20;
        const settingsOffset = progress * 22;
        const badgeTopOffset = progress * -14;
        const badgeBottomOffset = progress * 16;

        if (mainFrame) mainFrame.style.transform = `translateY(${mainOffset.toFixed(1)}px)`;
        if (layerBriefing) layerBriefing.style.transform = `translateZ(35px) translateY(${briefingOffset.toFixed(1)}px)`;
        if (layerSettings) layerSettings.style.transform = `translateZ(40px) translateY(${settingsOffset.toFixed(1)}px)`;
        if (overlapBadgeTop) overlapBadgeTop.style.transform = `translateZ(50px) translateY(${badgeTopOffset.toFixed(1)}px)`;
        if (overlapBadgeBottom) overlapBadgeBottom.style.transform = `translateZ(50px) translateY(${badgeBottomOffset.toFixed(1)}px)`;
      }

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(handleParallaxScroll);
        ticking = true;
      }
    }, { passive: true });
    handleParallaxScroll();

    // Mouse-move tilt on stage
    desktopStage.addEventListener('mousemove', (e) => {
      const rect = desktopStage.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotX = -(y / rect.height) * 5;
      const rotY = (x / rect.width) * 5;
      desktopStage.style.transform = `perspective(1200px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
    });

    desktopStage.addEventListener('mouseleave', () => {
      desktopStage.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
    });
  }

  // ==========================================
  // 2. MOBILE IMAGE CAROUSEL CONTROLLER
  // ==========================================
  const viewport = document.querySelector('.carousel-viewport');
  const track = document.getElementById('product-carousel-track');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const dots = document.querySelectorAll('.carousel-dot');

  if (viewport && track && slides.length > 0) {
    let currentSlide = 0;
    const totalSlides = slides.length;

    const goToSlide = (index) => {
      if (index < 0) {
        currentSlide = totalSlides - 1;
      } else if (index >= totalSlides) {
        currentSlide = 0;
      } else {
        currentSlide = index;
      }

      // Move track by exactly 100% of viewport width per slide
      const viewportWidth = viewport.clientWidth || viewport.getBoundingClientRect().width;
      track.style.transform = `translateX(-${currentSlide * viewportWidth}px)`;

      // Update active states
      slides.forEach((s, idx) => {
        s.classList.toggle('is-active', idx === currentSlide);
      });

      // Update dots and accessibility
      dots.forEach((d, idx) => {
        const isActive = idx === currentSlide;
        d.classList.toggle('is-active', isActive);
        d.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    };

    // Initialize slide position
    goToSlide(0);

    // Keep slide aligned on resize or orientation change
    window.addEventListener('resize', () => {
      goToSlide(currentSlide);
    }, { passive: true });

    window.addEventListener('orientationchange', () => {
      setTimeout(() => goToSlide(currentSlide), 100);
    }, { passive: true });

    // Next / Prev Button Clicks
    prevBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      goToSlide(currentSlide - 1);
    });

    nextBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      goToSlide(currentSlide + 1);
    });

    // Dot Clicks
    dots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        const targetIndex = parseInt(dot.getAttribute('data-index') || '0', 10);
        goToSlide(targetIndex);
      });
    });

    // Touch Swipe Gestures (Direction-aware)
    let touchStartX = 0;
    let touchStartY = 0;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      // Only trigger slide navigation if horizontal swipe is dominant
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 35) {
        if (diffX > 0) {
          goToSlide(currentSlide - 1);
        } else {
          goToSlide(currentSlide + 1);
        }
      }
    }, { passive: true });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEverythingSection);
} else {
  initEverythingSection();
}
