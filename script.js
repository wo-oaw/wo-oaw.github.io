const revealItems = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -5%" },
  );

  revealItems.forEach((item) => observer.observe(item));
}

const year = document.querySelector("[data-year]");
if (year) year.textContent = String(new Date().getFullYear());

const sectionLinks = [...document.querySelectorAll('.hero-rail nav a[href^="#"]')]
  .map((link) => {
    const section = document.querySelector(link.getAttribute("href"));
    return section ? { link, section } : null;
  })
  .filter(Boolean);

let navTicking = false;

const updateActiveSection = () => {
  const marker = window.scrollY + window.innerHeight * 0.45;
  let activeItem = null;

  sectionLinks.forEach((item) => {
    if (item.section.offsetTop <= marker) activeItem = item;
  });

  sectionLinks.forEach((item) => {
    const isActive = item === activeItem;
    item.link.classList.toggle("is-active", isActive);
    if (isActive) item.link.setAttribute("aria-current", "location");
    else item.link.removeAttribute("aria-current");
  });

  navTicking = false;
};

const requestNavUpdate = () => {
  if (navTicking) return;
  navTicking = true;
  window.requestAnimationFrame(updateActiveSection);
};

updateActiveSection();
window.addEventListener("scroll", requestNavUpdate, { passive: true });
window.addEventListener("resize", requestNavUpdate);
