// Toggle behavior for the Weather Models category cards
document.querySelectorAll('.model-category-label').forEach(function (button) {
  button.addEventListener('click', function () {
    const category = button.closest('.model-category');
    const isOpen = category.classList.contains('open');
 
    // close any other open categories
    document.querySelectorAll('.model-category.open').forEach(function (openCategory) {
      if (openCategory !== category) {
        openCategory.classList.remove('open');
        openCategory.querySelector('.model-category-label').setAttribute('aria-expanded', 'false');
      }
    });
 
    // toggle this one
    category.classList.toggle('open', !isOpen);
    button.setAttribute('aria-expanded', String(!isOpen));
  });
});
 