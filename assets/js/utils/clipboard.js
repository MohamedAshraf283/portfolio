import { $$ } from '../core/dom.js';
import { showToast } from '../ui/toast.js';

export async function copyTextToClipboard(text, successMessage = 'Copied successfully') {
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    showToast(successMessage);
  } catch (error) {
    const input = document.createElement('input');
    input.value = text;
    input.setAttribute('readonly', 'readonly');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    input.style.pointerEvents = 'none';

    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    input.remove();

    showToast(successMessage);
  }
}

export function initCopyButtons() {
  $$('[data-copy]').forEach(button => {
    button.addEventListener('click', async () => {
      const text = button.dataset.copy;
      await copyTextToClipboard(text, 'Email copied successfully');
    });
  });
}
