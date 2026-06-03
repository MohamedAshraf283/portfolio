'use strict';

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const navToggle = $('.nav-toggle');
const navMenu = $('#navMenu');
const navLinks = $$('.nav-menu a');
const toast = $('#toast');


function showToast(message = 'Copied successfully') {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 1800);
}

function closeMobileMenu() {
  navToggle?.classList.remove('open');
  navMenu?.classList.remove('open');
  navToggle?.setAttribute('aria-expanded', 'false');
}

navToggle?.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

document.addEventListener('click', event => {
  if (!navMenu || !navToggle) return;
  if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) closeMobileMenu();
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    } else {
      entry.target.classList.remove('visible');
    }
  });
}, {
  threshold: 0.16,
  rootMargin: '0px 0px -8% 0px'
});

$$('.reveal').forEach(el => revealObserver.observe(el));

const sections = $$('main section[id]');
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
sections.forEach(section => navObserver.observe(section));

$$('[data-copy]').forEach(button => {
  button.addEventListener('click', async () => {
    const text = button.dataset.copy;
    try {
      await navigator.clipboard.writeText(text);
      showToast('Email copied successfully');
    } catch (error) {
      const input = document.createElement('input');
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      input.remove();
      showToast('Email copied successfully');
    }
  });
});

const filterButtons = $$('.filter-btn');
const projectCards = $$('.project-card');
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(btn => btn.classList.toggle('active', btn === button));
    projectCards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hide', !show);
    });
  });
});

if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  $$('.interactive-card').forEach(card => {
    card.addEventListener('mousemove', event => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rx = ((y / rect.height) - 0.5) * -5;
      const ry = ((x / rect.width) - 0.5) * 5;

      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  $$('.magnetic').forEach(element => {
    element.addEventListener('mouseleave', () => {
      element.style.transform = '';
    });

    element.addEventListener('mousemove', event => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      element.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
    });
  });
}

$('#year').textContent = new Date().getFullYear();
/* ================================
   Smooth Internal Navigation
================================ */

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

/* =========================================
   3D Flip Profile Card - Final Safe Version
========================================= */

const heroFlipCard = document.querySelector('.hero-flip-card');
const flipCardFront = document.querySelector('.flip-card-front');
const flipCardBack = document.querySelector('.flip-card-back');

if (heroFlipCard && flipCardFront && flipCardBack) {
  const flipToBack = () => {
    heroFlipCard.classList.add('is-flipped');
  };

  const flipToFront = () => {
    heroFlipCard.classList.remove('is-flipped');
  };

  /*
    القلب يتم فقط عند الضغط على واجهة الكارت الأمامية.
    ظهر الكارت لا يقلب عند الضغط عليه نهائيًا حتى تعمل الروابط.
  */
  flipCardFront.addEventListener('click', function (event) {
    event.preventDefault();
    flipToBack();
  });

  flipCardFront.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      flipToBack();
    }
  });

  /*
    منع أي ضغط داخل ظهر الكارت من الوصول لأي منطق Flip.
    هذا مهم جدًا لروابط GitHub / LinkedIn / WhatsApp.
  */
  flipCardBack.addEventListener('click', function (event) {
    event.stopPropagation();
  });

  /*
    زر Escape يرجع الكارت للواجهة الأمامية.
  */
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && heroFlipCard.classList.contains('is-flipped')) {
      flipToFront();
    }
  });

  flipCardFront.setAttribute('tabindex', '0');
  flipCardFront.setAttribute('role', 'button');
  flipCardFront.setAttribute('aria-label', 'Flip profile card');

  const flipBackButton = document.querySelector('.flip-back-btn');

  if (flipBackButton) {
    flipBackButton.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      flipToFront();
    });
  }
}

/* ================================
   Dynamic Technology Marquee
================================ */

const techStack = [
  'Python',
  'Django',
  'Laravel',
  'PHP',
  'REST APIs',
  'UiPath',
  'Power Apps',
  'n8n',
  'Playwright',
  'Selenium',
  'Docker',
  'MySQL'
];

const marqueeTrack = document.getElementById('techMarqueeTrack');

if (marqueeTrack) {
  const repeatCount = 7;

  for (let i = 0; i < repeatCount; i++) {
    const marqueeGroup = document.createElement('div');
    marqueeGroup.className = 'marquee-group';

    if (i > 0) {
      marqueeGroup.setAttribute('aria-hidden', 'true');
    }

    techStack.forEach((tech) => {
      const span = document.createElement('span');
      span.textContent = tech;
      marqueeGroup.appendChild(span);
    });

    marqueeTrack.appendChild(marqueeGroup);
  }
}