document.addEventListener('DOMContentLoaded', () => {
  // 1. Get active app from URL parameter or localStorage
  const urlParams = new URLSearchParams(window.location.search);
  let app = urlParams.get('app');

  if (!app) {
    app = localStorage.getItem('selected_app');
  }

  // Fallback to 'taste' to ensure existing links don't break
  if (app !== 'taste' && app !== 'blat') {
    app = 'taste';
  }

  // Save selection
  localStorage.setItem('selected_app', app);

  // 2. Set current copyright year
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 3. Define app-specific display names and page-specific sub-titles
  const appNames = {
    taste: 'Taste',
    blat: 'Блат'
  };

  // 4. Update the page to reflect the selected app
  function updateAppUI(selectedApp) {
    // Save to localStorage
    localStorage.setItem('selected_app', selectedApp);
    
    // Toggle body theme classes
    if (selectedApp === 'blat') {
      document.body.classList.add('theme-blat');
    } else {
      document.body.classList.remove('theme-blat');
    }

    // Toggle content visibility
    document.querySelectorAll('[data-app]').forEach(el => {
      if (el.getAttribute('data-app') === selectedApp) {
        el.classList.add('active-app');
      } else {
        el.classList.remove('active-app');
      }
    });

    // Update switcher buttons state
    document.querySelectorAll('.switcher-btn').forEach(btn => {
      if (btn.getAttribute('data-target') === selectedApp) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update dynamically rendered app names in text
    document.querySelectorAll('.app-name-display').forEach(el => {
      el.textContent = appNames[selectedApp];
    });

    // Update document title and main title dynamically
    const pageType = document.body.getAttribute('data-page-type');
    let titlePrefix = appNames[selectedApp];
    
    if (pageType === 'faq') {
      document.title = `${titlePrefix} — FAQ`;
    } else if (pageType === 'privacy') {
      document.title = `${titlePrefix} — Политика конфиденциальности`;
    } else {
      document.title = `${titlePrefix} — Поддержка`;
    }

    // Update URL query parameter without reloading
    try {
      if (window.location.protocol !== 'file:') {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('app', selectedApp);
        window.history.replaceState({}, '', newUrl.toString());
      }
    } catch (e) {
      console.warn('Failed to update browser history:', e);
    }

    // Update all local nav links to preserve the selected app parameter
    document.querySelectorAll('a').forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href.startsWith('./') || !href.includes(':')) && href.includes('.html')) {
        const base = href.split('?')[0];
        link.setAttribute('href', `${base}?app=${selectedApp}`);
      }
    });
  }

  // 5. Initialize UI
  updateAppUI(app);

  // 6. Handle Switcher Clicks
  document.querySelectorAll('.switcher-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetApp = btn.getAttribute('data-target');
      if (targetApp === 'taste' || targetApp === 'blat') {
        updateAppUI(targetApp);
      }
    });
  });
});
