export function initProjectFlipCards() {
  document.addEventListener('click', function (event) {
    const backButton = event.target.closest('.project-back-btn');

    if (backButton) {
      event.preventDefault();
      event.stopPropagation();

      const card = backButton.closest('.project-flip-card');

      if (card) {
        card.classList.remove('is-flipped');
      }

      return;
    }

    const frontFace = event.target.closest('.project-card-front');

    if (frontFace) {
      event.preventDefault();

      const card = frontFace.closest('.project-flip-card');

      if (card) {
        card.classList.add('is-flipped');
      }
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      document.querySelectorAll('.project-flip-card.is-flipped').forEach((card) => {
        card.classList.remove('is-flipped');
      });
    }

    if (event.key === 'Enter' || event.key === ' ') {
      const frontFace = document.activeElement;

      if (frontFace && frontFace.classList.contains('project-card-front')) {
        event.preventDefault();

        const card = frontFace.closest('.project-flip-card');

        if (card) {
          card.classList.add('is-flipped');
        }
      }
    }
  });
}
