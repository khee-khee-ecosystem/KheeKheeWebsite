/**
 * Khee Khee - Section 04: Manage Influencer Campaigns From One Workspace
 * Interactive logic: Staggered intersection observer reveal & card micro-interactions
 */

(function () {
  'use strict';

  function initWorkspaceSection() {
    var workspaceSection = document.getElementById('workspace');
    if (!workspaceSection) return;

    // 1. Staggered Scroll Reveal Observer
    var revealElements = workspaceSection.querySelectorAll('.workspace-reveal');
    if ('IntersectionObserver' in window) {
      var observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.12
      };

      var revealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      revealElements.forEach(function (el) {
        revealObserver.observe(el);
      });
    } else {
      // Fallback for older browsers
      revealElements.forEach(function (el) {
        el.classList.add('is-visible');
      });
    }

    // 2. Card Micro-Interactions (Click pulse / keyboard focus)
    var cards = workspaceSection.querySelectorAll('.workspace-card');
    cards.forEach(function (card) {
      card.setAttribute('tabindex', '0');

      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerCardPulse(card);
        }
      });

      card.addEventListener('click', function () {
        triggerCardPulse(card);
      });
    });

    function triggerCardPulse(card) {
      card.style.transform = 'translateY(-7px) scale(1.015)';
      card.style.borderColor = 'rgba(56, 189, 248, 0.6)';
      setTimeout(function () {
        card.style.transform = '';
        card.style.borderColor = '';
      }, 300);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWorkspaceSection);
  } else {
    initWorkspaceSection();
  }
})();
