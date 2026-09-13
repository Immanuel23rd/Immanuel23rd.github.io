document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const topology = document.querySelector('.topology');
  const navLinks = [...document.querySelectorAll('.site-header nav a')];
  const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const year = document.querySelector('[data-year]');

  if (year) year.textContent = new Date().getFullYear();

  // Add a lightweight progress rail without changing the document structure.
  const progress = document.createElement('div');
  progress.className = 'page-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);

  const updateScrollState = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progressValue = scrollable > 0 ? window.scrollY / scrollable : 0;
    document.documentElement.style.setProperty('--scroll-progress', `${progressValue * 100}%`);
    const marker = window.scrollY + window.innerHeight * 0.28;
    let current = sections[0];
    sections.forEach(section => {
      if (section.offsetTop <= marker) current = section;
    });
    navLinks.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === `#${current?.id}`));
  };

  updateScrollState();
  window.addEventListener('scroll', updateScrollState, { passive: true });
  window.addEventListener('resize', updateScrollState, { passive: true });

  // Reveal content progressively as it enters the viewport.
  const revealTargets = document.querySelectorAll('.section-heading, .project-card, .method-intro, .method-card, .skill-block, .about-copy, .trajectory, .contact-section');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach(element => element.classList.add('is-visible'));
  } else {
    revealTargets.forEach((element, index) => {
      element.classList.add('reveal-item');
      element.style.setProperty('--reveal-delay', `${Math.min(index % 5, 4) * 55}ms`);
    });
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
    revealTargets.forEach(element => revealObserver.observe(element));
  }

  if (topology && !reducedMotion && finePointer) {
    window.addEventListener('pointermove', event => {
      const x = (event.clientX / window.innerWidth - 0.5) * 14;
      const y = (event.clientY / window.innerHeight - 0.5) * 10;
      topology.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }, { passive: true });
  }

  if (!reducedMotion && finePointer) {
    document.querySelectorAll('.project-card, .method-card, .skill-block').forEach(card => {
      card.addEventListener('pointermove', event => {
        const bounds = card.getBoundingClientRect();
        const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -3;
        const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 3;
        card.style.setProperty('--tilt-x', `${rotateX}deg`);
        card.style.setProperty('--tilt-y', `${rotateY}deg`);
        card.style.setProperty('--spot-x', `${event.clientX - bounds.left}px`);
        card.style.setProperty('--spot-y', `${event.clientY - bounds.top}px`);
        card.classList.add('is-tilting');
      });
      card.addEventListener('pointerleave', () => {
        card.classList.remove('is-tilting');
        card.style.removeProperty('--tilt-x');
        card.style.removeProperty('--tilt-y');
      });
    });
  }

  // Make the console feel alive without distracting from its content.
  const liveLabel = document.querySelector('.console-live');
  if (liveLabel && !reducedMotion) {
    window.setInterval(() => liveLabel.classList.toggle('is-pulsing'), 2200);
  }
});
