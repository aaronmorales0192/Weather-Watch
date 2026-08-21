// Generic click-to-toggle cards.
// Any element with class "toggle-card" containing a ".toggle-card-label" button
// and a ".toggle-card-panel" will expand/collapse that panel on click.
// Clicking one card closes any other open card in the same group.

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.toggle-card-label').forEach(function (button) {
    button.addEventListener('click', function () {
      const card = button.closest('.toggle-card');
      const isOpen = card.classList.contains('open');
      const group = card.closest('.toggle-card-group');

      // close any other open cards in the same group
      if (group) {
        group.querySelectorAll('.toggle-card.open').forEach(function (openCard) {
          if (openCard !== card) {
            openCard.classList.remove('open');
            openCard.querySelector('.toggle-card-label').setAttribute('aria-expanded', 'false');
          }
        });
      }

      // toggle this one
      card.classList.toggle('open', !isOpen);
      button.setAttribute('aria-expanded', String(!isOpen));
    });
  });
});
