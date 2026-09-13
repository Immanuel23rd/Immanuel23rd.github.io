document.addEventListener('DOMContentLoaded', () => {
  const topology = document.querySelector('.topology');
  if (topology && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('mousemove', event => {
      const x = (event.clientX / window.innerWidth - 0.5) * 14;
      const y = (event.clientY / window.innerHeight - 0.5) * 10;
      topology.style.transform = `translate(${x}px, ${y}px)`;
    }, { passive: true });
  }

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
});
