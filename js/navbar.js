document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const navContainer = document.querySelector(".nav-container");
  
    if (!menuToggle || !navContainer) return;
  
    menuToggle.addEventListener("click", () => {
      const isOpen = navContainer.classList.toggle("nav-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
  
    navContainer.querySelectorAll(".menu a, .actions a").forEach((link) => {
      link.addEventListener("click", () => {
        navContainer.classList.remove("nav-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  });