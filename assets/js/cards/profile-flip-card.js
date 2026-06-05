export function initProfileFlipCard() {
  const heroFlipCard = document.querySelector('.hero-flip-card');
  const flipCardFront = document.querySelector('.flip-card-front');
  const flipCardBack = document.querySelector('.flip-card-back');

  if (!heroFlipCard || !flipCardFront || !flipCardBack) return;

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
