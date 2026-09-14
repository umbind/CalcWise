export function triggerPageTranslation(langCode: string, onDone?: () => void) {
  if (typeof window === 'undefined') return;

  const targetCode = langCode === 'zh' ? 'zh-CN' : langCode;

  try {
    const host = window.location.hostname;
    const isRootDomain = host.includes('.');
    const rootDomain = isRootDomain ? host.split('.').slice(-2).join('.') : '';

    if (langCode === 'en') {
      // Clear translation cookies across all domain scopes
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + host + ';';
      if (rootDomain) {
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + rootDomain + ';';
      }
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + host + ';';

      // Reset combo in-place without page reload if possible
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (select) {
        select.value = '';
        select.dispatchEvent(new Event('change', { bubbles: true }));
        if (onDone) onDone();
        return;
      }
      // If combo not accessible, fall back to reload
      window.location.reload();
      return;
    }

    // Set cookie for target language (both standard path and host)
    const cookieVal = '/en/' + targetCode;
    document.cookie = 'googtrans=' + cookieVal + '; path=/;';
    try {
      document.cookie = 'googtrans=' + cookieVal + '; path=/; domain=' + host + ';';
    } catch (e) {}

    // Smooth polling for Google combo dropdown to translate in-place without reloading
    let attempts = 0;
    const checkCombo = () => {
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (select) {
        select.value = targetCode;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        if (onDone) onDone();
        return;
      }
      attempts++;
      if (attempts < 8) {
        setTimeout(checkCombo, 100);
      } else {
        // Fallback: reload with cookie if widget failed to mount within 800ms
        window.location.reload();
      }
    };

    checkCombo();
  } catch (err) {
    console.warn('Page translation trigger warning:', err);
    if (onDone) onDone();
  }
}
