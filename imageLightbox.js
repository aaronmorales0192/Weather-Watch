// Click-to-enlarge lightbox for images with the "enlargeable-image" class.
// Clicking an enlargeable image opens a fullscreen overlay with a larger version.
// Clicking the overlay (or the image again) closes it.

document.addEventListener('DOMContentLoaded', function () {
  const lightbox = document.getElementById('image-lightbox');
  const lightboxImg = document.getElementById('image-lightbox-img');

  if (!lightbox || !lightboxImg) return;

  document.querySelectorAll('.enlargeable-image').forEach(function (img) {
    img.addEventListener('click', function () {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
    });
  });

  // close when clicking anywhere on the overlay
  lightbox.addEventListener('click', function () {
    lightbox.classList.remove('open');
  });

  // close with the Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      lightbox.classList.remove('open');
    }
  });
});
