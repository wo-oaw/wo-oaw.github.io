const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(".reveal");

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -6%" },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const header = document.querySelector("[data-header]");
const themeSections = [...document.querySelectorAll("[data-theme]")];
const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
let ticking = false;

const updateHeader = () => {
  const marker = window.scrollY + 90;
  let activeSection = themeSections[0];

  themeSections.forEach((section) => {
    if (section.offsetTop <= marker) activeSection = section;
  });

  header.dataset.currentTheme = activeSection?.dataset.theme || "dark";

  navLinks.forEach((link) => {
    const target = document.querySelector(link.getAttribute("href"));
    const isActive = target === activeSection;
    link.classList.toggle("is-active", isActive);
    if (isActive) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });

  ticking = false;
};

const requestHeaderUpdate = () => {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(updateHeader);
};

updateHeader();
window.addEventListener("scroll", requestHeaderUpdate, { passive: true });
window.addEventListener("resize", requestHeaderUpdate);

const menuButton = document.querySelector(".menu-button");
const siteNav = document.querySelector(".site-nav");

const closeMenu = () => {
  siteNav.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
};

menuButton.addEventListener("click", () => {
  const willOpen = !siteNav.classList.contains("is-open");
  siteNav.classList.toggle("is-open", willOpen);
  menuButton.setAttribute("aria-expanded", String(willOpen));
  document.body.classList.toggle("menu-open", willOpen);
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

window.addEventListener("resize", () => {
  if (window.innerWidth > 820) closeMenu();
});

const year = document.querySelector("[data-year]");
if (year) year.textContent = String(new Date().getFullYear());
