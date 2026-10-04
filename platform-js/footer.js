/**
 * Khee Khee - Footer Interactive Controller
 * Dynamic copyright year and footer interaction helpers.
 */
document.addEventListener('DOMContentLoaded', () => {
  const currentYear = new Date().getFullYear();
  const yearElements = document.querySelectorAll('#footer-current-year, #brand-monument-year');
  yearElements.forEach(el => {
    el.textContent = currentYear;
  });
});
