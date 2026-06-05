import { $ } from '../core/dom.js';
import { copyTextToClipboard } from '../utils/clipboard.js';
import { showToast } from './toast.js';

let currentAction = null;

const DEBUG_ACTION_MODAL = false;

function log(...args) {
  if (DEBUG_ACTION_MODAL) {
    console.log('[ActionModal]', ...args);
  }
}

function warn(...args) {
  if (DEBUG_ACTION_MODAL) {
    console.warn('[ActionModal]', ...args);
  }
}

function error(...args) {
  if (DEBUG_ACTION_MODAL) {
    console.error('[ActionModal]', ...args);
  }
}

function getModalElements() {
  return {
    actionModal: $('#actionModal'),
    actionModalIcon: $('#actionModalIcon'),
    actionModalTitle: $('#actionModalTitle'),
    actionModalText: $('#actionModalText'),
    actionModalPrimary: $('#actionModalPrimary'),
    actionModalSecondary: $('#actionModalSecondary'),
    actionModalClose: $('#actionModalClose'),
    actionModalBackdrop: $('.action-modal-backdrop')
  };
}

function isModalReady(elements) {
  const ready = Boolean(
    elements.actionModal &&
    elements.actionModalIcon &&
    elements.actionModalTitle &&
    elements.actionModalText &&
    elements.actionModalPrimary &&
    elements.actionModalSecondary
  );

  if (!ready) {
    warn('Modal is not ready', {
      actionModal: Boolean(elements.actionModal),
      actionModalIcon: Boolean(elements.actionModalIcon),
      actionModalTitle: Boolean(elements.actionModalTitle),
      actionModalText: Boolean(elements.actionModalText),
      actionModalPrimary: Boolean(elements.actionModalPrimary),
      actionModalSecondary: Boolean(elements.actionModalSecondary)
    });
  }

  return ready;
}

function getCleanUrlValue(url) {
  try {
    const parsedUrl = new URL(url, window.location.href);
    return parsedUrl.href;
  } catch (err) {
    warn('Could not parse URL, using raw URL', url, err);
    return url;
  }
}

function getSmartActionData(link) {
  /*
    تجاهل روابط التحميل الداخلية التي يتم إنشاؤها برمجيًا.
    هذا يمنع الـ Modal من اعتراض رابط الـ Blob الخاص بالتحميل.
  */
  if (link.hasAttribute('data-skip-action-modal')) {
    log('Ignored internal generated download link');
    return null;
  }

  const rawHref = link.getAttribute('href');

  /*
    تجاهل روابط Blob لأنها خاصة بالتحميل الداخلي فقط.
  */
  if (rawHref && rawHref.startsWith('blob:')) {
    log('Ignored blob download link');
    return null;
  }

  if (link.closest('.project-plate-actions')) {
    log('Ignored link inside project plate actions');
    return null;
  }

  if (!rawHref || rawHref.startsWith('#')) {
    log('Ignored internal or empty href', rawHref);
    return null;
  }

  const href = getCleanUrlValue(rawHref);
  const linkText = link.textContent.trim().replace(/\s+/g, ' ');

  log('Detected link click', {
    rawHref,
    href,
    hasDownload: link.hasAttribute('download'),
    classes: link.className,
    text: linkText
  });

  if (rawHref.includes('Mohamed_Ashraf_CV.pdf') || link.hasAttribute('download')) {
    log('CV action detected');

    return {
      type: 'cv',
      icon: '↧',
      title: 'CV Options',
      message: 'Do you want to view the CV in a new tab or download it directly?',
      primaryText: 'View CV',
      secondaryText: 'Download CV',
      href,
      downloadHref: href,
      downloadName: 'Mohamed_Ashraf_CV.pdf'
    };
  }

  if (rawHref.startsWith('mailto:')) {
    const email = rawHref.replace('mailto:', '').split('?')[0];

    return {
      type: 'email',
      icon: '✉',
      title: 'Email Action',
      message: 'Do you want to send an email now or copy the email address only?',
      primaryText: 'Send Email',
      secondaryText: 'Copy Email',
      href: rawHref,
      copyValue: email,
      copyMessage: 'Email copied successfully'
    };
  }

  if (rawHref.includes('wa.me')) {
    const phone = rawHref.split('wa.me/')[1]?.split(/[?#]/)[0] || linkText;

    return {
      type: 'whatsapp',
      icon: '☎',
      title: 'WhatsApp Action',
      message: 'Do you want to open WhatsApp chat or copy the phone number only?',
      primaryText: 'Open WhatsApp',
      secondaryText: 'Copy Number',
      href,
      copyValue: phone.startsWith('+') ? phone : `+${phone}`,
      copyMessage: 'Phone number copied successfully'
    };
  }

  if (rawHref.includes('linkedin.com')) {
    return {
      type: 'linkedin',
      icon: 'in',
      title: 'LinkedIn Action',
      message: 'Do you want to open the LinkedIn profile or copy the profile link only?',
      primaryText: 'Open LinkedIn',
      secondaryText: 'Copy Link',
      href,
      copyValue: href,
      copyMessage: 'LinkedIn link copied successfully'
    };
  }

  if (rawHref.includes('github.com')) {
    return {
      type: 'github',
      icon: '⌘',
      title: 'GitHub Action',
      message: 'Do you want to open the GitHub profile or copy the profile link only?',
      primaryText: 'Open GitHub',
      secondaryText: 'Copy Link',
      href,
      copyValue: href,
      copyMessage: 'GitHub link copied successfully'
    };
  }

  if (rawHref.includes('facebook.com')) {
    return {
      type: 'facebook',
      icon: 'f',
      title: 'Facebook Action',
      message: 'Do you want to open the Facebook profile or copy the profile link only?',
      primaryText: 'Open Facebook',
      secondaryText: 'Copy Link',
      href,
      copyValue: href,
      copyMessage: 'Facebook link copied successfully'
    };
  }

  if (rawHref.includes('instagram.com')) {
    return {
      type: 'instagram',
      icon: '◎',
      title: 'Instagram Action',
      message: 'Do you want to open the Instagram profile or copy the profile link only?',
      primaryText: 'Open Instagram',
      secondaryText: 'Copy Link',
      href,
      copyValue: href,
      copyMessage: 'Instagram link copied successfully'
    };
  }

  if (rawHref.includes('t.me')) {
    return {
      type: 'telegram',
      icon: '✈',
      title: 'Telegram Action',
      message: 'Do you want to open the Telegram profile or copy the profile link only?',
      primaryText: 'Open Telegram',
      secondaryText: 'Copy Link',
      href,
      copyValue: href,
      copyMessage: 'Telegram link copied successfully'
    };
  }

  if (rawHref.includes('google.com/maps')) {
    return {
      type: 'location',
      icon: '⌖',
      title: 'Location Action',
      message: 'Do you want to open the location in Google Maps or copy the location link only?',
      primaryText: 'Open Maps',
      secondaryText: 'Copy Link',
      href,
      copyValue: href,
      copyMessage: 'Location link copied successfully'
    };
  }

  log('No smart action matched for link', rawHref);
  return null;
}

function openActionModal(actionData) {
  const elements = getModalElements();

  console.group('[ActionModal] openActionModal');
  log('Action data:', actionData);

  if (!isModalReady(elements)) {
    console.groupEnd();
    return false;
  }

  currentAction = actionData;

  elements.actionModalIcon.textContent = actionData.icon;
  elements.actionModalTitle.textContent = actionData.title;
  elements.actionModalText.textContent = actionData.message;
  elements.actionModalPrimary.textContent = actionData.primaryText;
  elements.actionModalSecondary.textContent = actionData.secondaryText;

  elements.actionModal.classList.add('show');
  elements.actionModal.setAttribute('aria-hidden', 'false');

  log('Modal opened successfully');
  console.groupEnd();

  window.setTimeout(() => {
    elements.actionModalPrimary.focus();
  }, 80);

  return true;
}

/*
  لا يغلق المودال إلا عندما تستدعيه أنت صراحة.
*/
function closeActionModal() {
  const { actionModal } = getModalElements();

  if (!actionModal) {
    warn('closeActionModal called, but #actionModal not found');
    return;
  }

  actionModal.classList.remove('show');
  actionModal.setAttribute('aria-hidden', 'true');
  currentAction = null;

  log('Modal closed');
}

/*
  دالة تشخيصية:
  1. تفحص الرابط
  2. تجرب fetch لمعرفة هل الملف قابل للوصول
  3. تنشئ Blob
  4. تبدأ تحميل من Blob URL
*/
async function downloadCvFile(href, fileName = 'Mohamed_Ashraf_CV.pdf') {
  console.group('[ActionModal] downloadCvFile');

  log('Requested download:', {
    href,
    fileName,
    pageUrl: window.location.href,
    origin: window.location.origin,
    protocol: window.location.protocol
  });

  if (!href) {
    error('Download stopped: href is empty');
    console.groupEnd();
    return false;
  }

  try {
    log('Step 1: Fetching CV file...');

    const response = await fetch(href, {
      method: 'GET',
      cache: 'no-store'
    });

    log('Step 2: Fetch response received', {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get('content-type'),
      contentLength: response.headers.get('content-length')
    });

    if (!response.ok) {
      throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
    }

    log('Step 3: Converting response to Blob...');
    const blob = await response.blob();

    log('Step 4: Blob created', {
      blobType: blob.type,
      blobSize: blob.size
    });

    if (!blob.size) {
      throw new Error('Blob size is 0. File may be empty or blocked.');
    }

    const blobUrl = window.URL.createObjectURL(blob);

    log('Step 5: Blob URL created', blobUrl);

    const downloadLink = document.createElement('a');

    downloadLink.href = blobUrl;
    downloadLink.download = fileName;
    downloadLink.setAttribute('download', fileName);

    /*
      مهم جدًا:
      هذا الرابط داخلي للتحميل فقط.
      لا يجب أن يمسكه Smart Action Modal.
    */
    downloadLink.setAttribute('data-skip-action-modal', 'true');

    downloadLink.style.position = 'fixed';
    downloadLink.style.left = '-9999px';
    downloadLink.style.top = '-9999px';
    downloadLink.style.opacity = '0';

    document.body.appendChild(downloadLink);

    log('Step 6: Triggering native click on generated download link...');
    downloadLink.click();

    window.setTimeout(() => {
      downloadLink.remove();
      window.URL.revokeObjectURL(blobUrl);
      log('Step 7: Cleanup done');
    }, 1500);

    console.groupEnd();
    return true;
  } catch (err) {
    error('Blob download failed:', err);

    /*
      Fallback:
      نحاول تحميل مباشر من نفس الرابط.
      هذا قد يفتح PDF بدل تحميله حسب إعدادات المتصفح،
      لكنه يساعدنا نعرف هل المشكلة من fetch أم من download attribute.
    */
    try {
      warn('Trying fallback direct anchor download...');

      const fallbackLink = document.createElement('a');

      fallbackLink.href = href;
      fallbackLink.download = fileName;
      fallbackLink.setAttribute('download', fileName);
      fallbackLink.setAttribute('data-skip-action-modal', 'true');

      fallbackLink.style.position = 'fixed';
      fallbackLink.style.left = '-9999px';
      fallbackLink.style.top = '-9999px';

      document.body.appendChild(fallbackLink);
      fallbackLink.click();

      window.setTimeout(() => {
        fallbackLink.remove();
      }, 1000);

      warn('Fallback click executed');
    } catch (fallbackErr) {
      error('Fallback download also failed:', fallbackErr);
    }

    console.groupEnd();
    return false;
  }
}

export function initActionModal() {
  const elements = getModalElements();

  console.group('[ActionModal] initActionModal');
  log('Modal elements at init:', {
    actionModal: Boolean(elements.actionModal),
    actionModalIcon: Boolean(elements.actionModalIcon),
    actionModalTitle: Boolean(elements.actionModalTitle),
    actionModalText: Boolean(elements.actionModalText),
    actionModalPrimary: Boolean(elements.actionModalPrimary),
    actionModalSecondary: Boolean(elements.actionModalSecondary),
    actionModalClose: Boolean(elements.actionModalClose),
    actionModalBackdrop: Boolean(elements.actionModalBackdrop)
  });
  console.groupEnd();

  document.addEventListener('click', event => {
    const link = event.target.closest('a');

    if (!link) return;

    const actionData = getSmartActionData(link);

    if (!actionData) return;

    log('Preventing default link behavior and opening modal', actionData);

    event.preventDefault();

    const opened = openActionModal(actionData);

    if (!opened) {
      warn('Modal did not open. Running fallback action.');

      if (actionData.type === 'email') {
        window.location.href = actionData.href;
      } else {
        window.open(actionData.href, '_blank', 'noopener,noreferrer');
      }
    }
  });

  if (!isModalReady(elements)) {
    warn('Modal listeners for buttons were not attached because modal is not ready');
    return;
  }

  elements.actionModalPrimary.addEventListener('click', () => {
    console.group('[ActionModal] Primary button click');
    log('Current action:', currentAction);

    if (!currentAction) {
      warn('Primary clicked but currentAction is null');
      console.groupEnd();
      return;
    }

    if (currentAction.type === 'email') {
      log('Opening email href:', currentAction.href);
      window.location.href = currentAction.href;
    } else {
      log('Opening link in new tab:', currentAction.href);
      window.open(currentAction.href, '_blank', 'noopener,noreferrer');
    }

    closeActionModal();
    console.groupEnd();
  });

  elements.actionModalSecondary.addEventListener('click', async () => {
    console.group('[ActionModal] Secondary button click');
    log('Current action:', currentAction);

    if (!currentAction) {
      warn('Secondary clicked but currentAction is null');
      console.groupEnd();
      return;
    }

    if (currentAction.type === 'cv') {
      log('CV download selected');

      elements.actionModalSecondary.disabled = true;
      elements.actionModalSecondary.textContent = 'Preparing...';

      const downloadUrl = currentAction.downloadHref || currentAction.href;
      const downloadName = currentAction.downloadName || 'Mohamed_Ashraf_CV.pdf';

      log('Download parameters:', {
        downloadUrl,
        downloadName
      });

      const downloaded = await downloadCvFile(downloadUrl, downloadName);

      log('Download result:', downloaded);

      showToast(downloaded ? 'CV download started' : 'CV download failed - check console');

      elements.actionModalSecondary.disabled = false;
      elements.actionModalSecondary.textContent = currentAction.secondaryText || 'Download CV';

      /*
        لا نغلق المودال هنا.
        لو عايزه يقفل بعد محاولة التحميل، فك التعليق عن السطر التالي:
      */
      closeActionModal();

      console.groupEnd();
      return;
    }

    log('Copy action selected:', {
      copyValue: currentAction.copyValue,
      copyMessage: currentAction.copyMessage
    });

    await copyTextToClipboard(currentAction.copyValue, currentAction.copyMessage);
    closeActionModal();
    console.groupEnd();
  });

  elements.actionModalClose?.addEventListener('click', () => {
    log('Close button clicked');
    closeActionModal();
  });

  elements.actionModalBackdrop?.addEventListener('click', () => {
    log('Backdrop clicked');
    closeActionModal();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && elements.actionModal.classList.contains('show')) {
      log('Escape pressed');
      closeActionModal();
    }
  });
}