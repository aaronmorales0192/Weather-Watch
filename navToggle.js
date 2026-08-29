// Mobile nav dropdown: toggles the nav-tabs menu open/closed when the
// hamburger button is tapped. On desktop widths the CSS keeps the tabs
// always visible as a normal row, so this only matters on mobile.

document.addEventListener('DOMContentLoaded', function () {
  const toggleBtn = document.querySelector('.nav-toggle');
  const navTabs = document.querySelector('.nav-tabs');

  if (!toggleBtn || !navTabs) return;

  toggleBtn.addEventListener('click', function () {
    const isOpen = navTabs.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
    toggleBtn.textContent = isOpen ? '✕' : '☰';
  });

  // Close the dropdown after a nav link is tapped, so it doesn't stay
  // open when the new page loads.
  navTabs.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navTabs.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.textContent = '☰';
    });
  });
});
