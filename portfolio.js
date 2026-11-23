"use strict";
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
const storage = {
  get(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },
};
const menu = $(".menu-toggle");
function toggleMenu(open) {
  menu.setAttribute("aria-expanded", String(open));
  menu.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  $("#nav-links").classList.toggle("open", open);
}
menu.onclick = () => toggleMenu(menu.getAttribute("aria-expanded") !== "true");
document.addEventListener("keydown", event => { if (event.key === "Escape") toggleMenu(false); });
function updateAccountLinks() {
  const profile = storage.get("elan-profile", null);
  $$("[data-account-link]").forEach((link) => {
    link.textContent = profile?.name ? "Profile" : "Log in / Sign up";
    link.href = profile?.name ? "profile.html" : "login.html";
  });
}
updateAccountLinks();
function revealSections() {
  if (!window.IntersectionObserver || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const observer = new IntersectionObserver(entries => entries.forEach(({target, isIntersecting}) => {
    if (isIntersecting) { target.classList.replace("pending", "visible"); observer.unobserve(target); }
  }), {threshold: .08});
  $$(".reveal").forEach(el => { el.classList.add("pending"); observer.observe(el); });
}
revealSections();
$$("[data-close]").forEach((b) => b.addEventListener("click", () => b.closest("dialog").close()));
$$("dialog").forEach((d) =>
  d.addEventListener("click", (e) => {
    if (e.target === d) {
      const r = d.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) d.close();
    }
  })
);
$$("[data-filter]").forEach((button) =>
  button.addEventListener("click", () => {
    $$("[data-filter]").forEach((b) => {
      b.classList.toggle("active", b === button);
      b.setAttribute("aria-pressed", String(b === button));
    });
    $$(".gallery-card").forEach((card) => {
      card.hidden = button.dataset.filter !== "All" && card.dataset.category !== button.dataset.filter;
    });
  })
);
$$("[data-story]").forEach((button) => button.addEventListener("click", () => $("#story-" + button.dataset.story).showModal()));
