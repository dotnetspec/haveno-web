const menubtn = document.querySelector(".menu-btn");
let menuOpen = false;

menubtn.addEventListener("click", () => {
  if (!menuOpen) {
    menubtn.classList.add("open");
    menuOpen = true;
  } else {
    menubtn.classList.remove("open");
    menuOpen = false;
  }
});
