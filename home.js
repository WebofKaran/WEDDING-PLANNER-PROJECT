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
  const profile = storage.get("elan-profile", null);
  $$("[data-account-link]").forEach((link) => {
    link.textContent = profile?.name ? "Profile" : "Log in / Sign up";
    link.href = profile?.name ? "profile.html" : "login.html";
  });
function revealSections() {
  if (!window.IntersectionObserver || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const observer = new IntersectionObserver(entries => entries.forEach(({target, isIntersecting}) => {
    if (isIntersecting) { target.classList.replace("pending", "visible"); observer.unobserve(target); }
  }), {threshold: .08});
  $$(".reveal").forEach(el => { el.classList.add("pending"); observer.observe(el); });
}
const intro = $(".intro"), nudge = $(".login-nudge");
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
function dismiss() {
  nudge.hidden = true;
  try { sessionStorage.setItem("elan-nudge", "yes"); } catch {}
}
$("#guest").onclick = $("#dismiss-login").onclick = dismiss;
$("[data-login]").onclick = () => { dismiss(); location.href = "login.html"; };
function typeText(el) {
  const original = el.textContent.trim();
  const accessible = document.createElement("span");
  accessible.className = "typing-accessible";
  accessible.textContent = original;
  const visual = document.createElement("span");
  visual.setAttribute("aria-hidden", "true");
  el.replaceChildren(accessible, visual);
  const letters = [];
  for (const token of original.split(/(\s+)/)) {
    if (!token.trim()) { visual.append(token); continue; }
    const word = document.createElement("span");
    word.className = "typing-word";
    for (const char of token) {
      const letter = document.createElement("span");
      letter.className = "typing-character"; letter.textContent = char;
      word.append(letter); letters.push(letter);
    }
    visual.append(word);
  }
  const start = performance.now(), delay = Math.min(Number(el.dataset.typeSpeed) || 16, 8000 / letters.length);
  let shown = 0;
  function tick(now) {
    while (shown < letters.length && shown < (now - start) / delay) letters[shown++].classList.add("typed");
    if (shown < letters.length && !reduced.matches) requestAnimationFrame(tick);
    else el.textContent = original;
  }
  requestAnimationFrame(tick);
}
function startMotion() {
  if (document.body.classList.contains("page-motion-started")) return;
  document.body.classList.add("page-motion-started");
  revealSections();
  if (reduced.matches || !window.IntersectionObserver) return;
  const observer = new IntersectionObserver(entries => entries.forEach(({target, isIntersecting}) => {
    if (target.matches(".about-inner")) {
      $$(".about-photo").forEach(photo => {
        photo.classList.toggle("photo-in", isIntersecting); photo.classList.toggle("photo-wait", !isIntersecting);
      });
    } else if (isIntersecting) {
      if (target.hasAttribute("data-typewriter")) typeText(target);
      else target.classList.replace("photo-wait", "photo-in");
      observer.unobserve(target);
    }
  }), {threshold: .2});
  $$(".about-photo, .strip-row img, .services .card > img").forEach((photo, index) => {
    photo.classList.add("photo-motion", "photo-wait");
    photo.style.setProperty("--photo-delay", (index % 4) * 140 + "ms");
    photo.style.setProperty("--photo-x", index < 2 ? "-32px" : "32px");
    if (!photo.matches(".about-photo")) observer.observe(photo);
  });
  $$(".about-inner, [data-typewriter]").forEach(el => observer.observe(el));
}
function finish() {
  startMotion(); intro.hidden = true; document.body.classList.add("intro-complete");
  let dismissed = false;
  try { dismissed = !!sessionStorage.getItem("elan-nudge"); } catch {}
  if (!dismissed && !storage.get("elan-profile", null)) nudge.hidden = false;
}
const style = getComputedStyle(intro);
const duration = 1000 * (parseFloat(style.animationDelay) + parseFloat(style.animationDuration));
if (reduced.matches || !duration) finish();
else { setTimeout(startMotion, Math.max(0, duration - 200)); setTimeout(finish, duration); }
