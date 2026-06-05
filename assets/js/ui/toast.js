import { $ } from '../core/dom.js';

let toastTimer = null;

export function showToast(message = 'Copied successfully') {
  const toast = $('#toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('show'), 1800);
}
