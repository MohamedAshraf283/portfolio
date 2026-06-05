import { initNavigation, initActiveSectionNavigation, initSmoothInternalNavigation } from './ui/navigation.js';
import { initRevealAnimations } from './effects/reveal.js';
import { initCopyButtons } from './utils/clipboard.js';
import { initActionModal } from './ui/action-modal.js';
import { initProjectFilters } from './features/project-filters.js';
import { initInteractiveCards, initMagneticElements } from './effects/interactive-cards.js';
import { initFooterYear } from './ui/footer-year.js';
import { initProfileFlipCard } from './cards/profile-flip-card.js';
import { initTechMarquee } from './components/tech-marquee.js';
import { initProjectFlipCards } from './cards/project-flip-cards.js';

function initApp() {
  initNavigation();
  initRevealAnimations();
  initActiveSectionNavigation();
  initCopyButtons();
  initActionModal();
  initProjectFilters();
  initInteractiveCards();
  initMagneticElements();
  initFooterYear();
  initSmoothInternalNavigation();
  initProfileFlipCard();
  initTechMarquee();
  initProjectFlipCards();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp, { once: true });
} else {
  initApp();
}
