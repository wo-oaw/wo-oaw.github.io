const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const menu = document.querySelector("[data-menu]");
const year = document.querySelector("[data-year]");

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menu?.classList.toggle("is-open", !isOpen);
  menuButton.querySelector(".sr-only").textContent = isOpen ? "메뉴 열기" : "메뉴 닫기";
});

menu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuButton?.setAttribute("aria-expanded", "false");
    menu?.classList.remove("is-open");
  });
});

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (year) {
  year.textContent = String(new Date().getFullYear());
}
