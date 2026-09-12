export function triggerPageTranslation(langCode: string) {
  if (typeof window === 'undefined') return;

  const targetCode = langCode === 'zh' ? 'zh-CN' : langCode;

  try {
    const host = window.location.hostname;
    if (langCode === 'en') {
      // Clear translation cookie
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + host + ';';
      if (host.includes('.')) {
        const rootDomain = host.split('.').slice(-2).join('.');
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + rootDomain + ';';
      }
    } else {
      const cookieVal = '/en/' + targetCode;
      document.cookie = 'googtrans=' + cookieVal + '; path=/;';
      document.cookie = 'googtrans=' + cookieVal + '; path=/; domain=' + host + ';';
      if (host.includes('.')) {
        const rootDomain = host.split('.').slice(-2).join('.');
        document.cookie = 'googtrans=' + cookieVal + '; path=/; domain=.' + rootDomain + ';';
      }
    }

    // Try finding the Google combo dropdown
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (select) {
      select.value = targetCode;
      select.dispatchEvent(new Event('change'));
    } else {
      // If translate widget not initialized in DOM yet, reload with cookie
      window.location.reload();
    }
  } catch (err) {
    console.warn('Page translation trigger warning:', err);
  }
}
