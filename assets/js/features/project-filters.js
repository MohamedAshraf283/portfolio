import { $$ } from '../core/dom.js';

export function initProjectFilters() {
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
}
