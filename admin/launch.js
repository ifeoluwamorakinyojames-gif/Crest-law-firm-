'use strict';
(async () => {
  const link = document.getElementById('secure-admin-link');
  const status = document.getElementById('admin-setup-status');
  try {
    const response = await fetch('./password-admin.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Configuration missing');
    const config = await response.json();
    const url = new URL(config.adminUrl);
    if (url.protocol !== 'https:' || !url.pathname.endsWith('/admin')) throw new Error('Invalid secure admin URL');
    link.href = url.href;
    link.hidden = false;
    status.textContent = 'Secure sign-in is hosted separately. Open the link above to enter your password.';
  } catch {
    status.textContent = 'The secure password-login backend has not been activated. No default password is currently usable.';
  }
})();
