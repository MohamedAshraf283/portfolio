import { $$ } from '../core/dom.js';

export function initInteractiveCards() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

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

export function initMagneticElements() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

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
