import { $, $$ } from '../core/dom.js';

function closeMobileMenu(navToggle, navMenu) {
  navToggle?.classList.remove('open');
  navMenu?.classList.remove('open');
  navToggle?.setAttribute('aria-expanded', 'false');
}

export function initNavigation() {
  const navToggle = $('.nav-toggle');
  const navMenu = $('#navMenu');
  const navLinks = $$('.nav-menu a');

  navToggle?.addEventListener('click', () => {
    if (!navMenu) return;

    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => closeMobileMenu(navToggle, navMenu));
  });

  document.addEventListener('click', event => {
    if (!navMenu || !navToggle) return;
    if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
      closeMobileMenu(navToggle, navMenu);
    }
  });
}

export function initActiveSectionNavigation() {
  const navLinks = $$('.nav-menu a');
  const sections = $$('main section[id]');

  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

  sections.forEach(section => navObserver.observe(section));
}

export function initSmoothInternalNavigation() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (event) {
      const targetId = this.getAttribute('href');

      if (!targetId || targetId === '#') {
        return;
      }

      const targetElement = document.querySelector(targetId);

      if (!targetElement) {
        return;
      }

      event.preventDefault();

      if (targetId === '#top') {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });

        history.replaceState(null, '', window.location.pathname);
        return;
      }

      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  });
}
