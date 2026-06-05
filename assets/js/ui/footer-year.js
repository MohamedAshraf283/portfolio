import { $ } from '../core/dom.js';

export function initFooterYear() {
  const yearElement = $('#year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}
