/**
 * Khee Khee - Footer Interactive Controller
 * Dynamic copyright year and footer interaction helpers.
 */
document.addEventListener('DOMContentLoaded', () => {
  const currentYearSpan = document.getElementById('footer-current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
});
