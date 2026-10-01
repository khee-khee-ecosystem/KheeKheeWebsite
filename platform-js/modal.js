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

  // Demo Form Submission
  if (demoForm) {
    demoForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = demoForm.querySelector('.form-submit-btn');
      const originalText = submitBtn ? submitBtn.textContent : 'Submit';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
      }

      if (formStatus) {
        formStatus.textContent = '';
        formStatus.className = 'form-status-msg';
      }

      try {
        const formData = new FormData(demoForm);
        const data = Object.fromEntries(formData.entries());

        // Simulated API call or existing lead hook
        await new Promise(resolve => setTimeout(resolve, 800));

        if (formStatus) {
          formStatus.textContent = 'Thank you! Our campaign specialist will contact you shortly.';
          formStatus.classList.add('success');
        }
        demoForm.reset();

        setTimeout(() => {
          closeModal();
          if (formStatus) {
            formStatus.textContent = '';
            formStatus.className = 'form-status-msg';
          }
        }, 2500);
      } catch (err) {
        if (formStatus) {
          formStatus.textContent = 'Something went wrong. Please try again or email info@kheekhee.com';
          formStatus.classList.add('error');
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
