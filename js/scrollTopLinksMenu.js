document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('#menu-btn'); // Using the ID selector instead
  const menuItems = document.querySelector('.below800pxnavlinks'); // Using the class of the nav links

  if (!menuBtn) {
      console.error('Menu button  not found!');
      return;
  }

  if (!menuItems) {
    console.error('Menu items not found!');
    return;
}

  menuBtn.addEventListener('click', () => {
      console.log('Menu button clicked');
      menuItems.classList.toggle('open'); // Toggle class to show/hide menu
      menuBtn.classList.toggle('open'); // Toggle class for the burger icon
  });
});
