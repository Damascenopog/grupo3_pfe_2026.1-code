const initNavbar = () => {
    const navContainer = document.querySelector(".nav-container");
    const toggleButton = navContainer?.querySelector(".menu-toggle");

    if (!navContainer || !toggleButton) return;

    const setMenuState = (isOpen) => {
        navContainer.classList.toggle("nav-open", isOpen);
        toggleButton.setAttribute("aria-expanded", String(isOpen));
    };

    const closeMenu = () => setMenuState(false);

    toggleButton.addEventListener("click", () => {
        const isOpen = !navContainer.classList.contains("nav-open");
        setMenuState(isOpen);
    });

    navContainer.querySelectorAll(".menu a, .actions a").forEach((link) => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= 860) {
                closeMenu();
            }
        });
    });

    document.addEventListener("click", (event) => {
        if (window.innerWidth > 860) return;
        if (!navContainer.contains(event.target)) {
            closeMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 860) {
            closeMenu();
        }
    });
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNavbar, { once: true });
} else {
    initNavbar();
}
