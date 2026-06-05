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

export function initTechMarquee() {
  const marqueeTrack = document.getElementById('techMarqueeTrack');

  if (!marqueeTrack) return;

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
