/**
 * Khee Khee - Modal Controller (Book a Demo)
 * Accessible dialog handling, ESC key dismissal, and form submission feedback.
 */
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('demo-modal');
  const closeBtn = document.getElementById('close-modal');
  const demoButtons = document.querySelectorAll('.btn-book-demo');
  const demoForm = document.getElementById('demo-form');
  const formStatus = document.getElementById('form-status');

  if (!modal) return;

  const openModal = () => {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const firstInput = modal.querySelector('input[type="text"]');
    firstInput?.focus();
  };

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Attach open listener to all demo buttons
  demoButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  // Close handlers
  closeBtn?.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Demo Form Submission - Formspree Integration & GA4 Lead Tracking
  if (demoForm) {
    const RECAPTCHA_SITE_KEY = '6LfpeFwtAAAAAM5tZdY_evOuDC-Sy2KgO9bXQpQ-';

    demoForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = demoForm.querySelector('.form-submit-btn');
      const originalText = submitBtn ? submitBtn.textContent : 'Submit';

      const nameInput = demoForm.querySelector('#demo-name');
      const emailInput = demoForm.querySelector('#demo-email');
      const phoneInput = demoForm.querySelector('#demo-phone');
      const roleSelect = demoForm.querySelector('#demo-role');

      // Validation
      if (!nameInput?.value.trim() || !emailInput?.value.trim() || !phoneInput?.value.trim() || !roleSelect?.value) {
        if (formStatus) {
          formStatus.textContent = 'Please fill out all required fields.';
          formStatus.className = 'form-status-msg error';
        }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
      }

      if (formStatus) {
        formStatus.textContent = '';
        formStatus.className = 'form-status-msg';
      }

      const formData = new FormData(demoForm);

      // Execute Google reCAPTCHA v3 if loaded
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
            formData.set('g-recaptcha-response', token);
          }
        } catch (err) {
          console.warn('reCAPTCHA execution error:', err);
        }
      }

      try {
        const response = await fetch('https://formspree.io/f/mpqvdwav', {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          if (formStatus) {
            formStatus.textContent = 'Thank you! Our campaign specialist will contact you shortly.';
            formStatus.className = 'form-status-msg success';
          }
          demoForm.reset();

          // Google Analytics GA4 Lead Conversion Event
          if (typeof gtag === 'function') {
            gtag('event', 'generate_lead', {
              event_category: 'form',
              event_label: 'demo_modal'
            });
          }

          setTimeout(() => {
            closeModal();
            if (formStatus) {
              formStatus.textContent = '';
              formStatus.className = 'form-status-msg';
            }
          }, 2500);
        } else {
          throw new Error('Server error');
        }
      } catch (err) {
        if (formStatus) {
          formStatus.textContent = 'Something went wrong. Please try again or email info@kheekhee.com';
          formStatus.className = 'form-status-msg error';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      }
    });
  }
});
