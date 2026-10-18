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
const navSections = [...document.querySelectorAll("[data-nav]")];
const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const currentMenuLabel = document.querySelector(".menu-current");
let ticking = false;

const updateHeader = () => {
  const themeMarker = header.getBoundingClientRect().height + 18;
  const navMarker = Math.max(themeMarker, Math.min(window.innerHeight * 0.35, 320));
  let activeSection = themeSections[0];
  let activeNav = "";

  themeSections.forEach((section) => {
    if (section.getBoundingClientRect().top <= themeMarker) activeSection = section;
  });

  navSections.forEach((section) => {
    if (section.getBoundingClientRect().top <= navMarker) activeNav = section.dataset.nav;
  });

  header.dataset.currentTheme = activeSection?.dataset.theme || "dark";
  currentMenuLabel.textContent = activeNav.toUpperCase();

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${activeNav}`;
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
window.addEventListener("pageshow", requestHeaderUpdate);

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
