"use strict";
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
const storage = {
  get(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },
  remove(key) { try { localStorage.removeItem(key); } catch {} }
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
let toastTimer;
function toast(message) {
  $("#toast").textContent = message;
  $("#toast").classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("#toast").classList.remove("show"), 3500);
}
function renderProfilePage() {
  if (!$("#profile-details")) return;
  const profile = storage.get("elan-profile", null);
  const active = !!profile?.name;
  $("#profile-empty").hidden = active;
  $("#profile-details").hidden = !active;
  if (!active) return;
  $("#profile-name").textContent = "Welcome, " + profile.name + ".";
  $("#profile-initial").textContent = profile.name.charAt(0).toUpperCase();
  $("#profile-full-name").textContent = profile.name;
  $("#profile-email-value").textContent = profile.email || "Not provided";
}
renderProfilePage();
if ($("#profile-logout")) {
  $("#profile-logout").addEventListener("click", () => {
    storage.remove("elan-profile");
    updateAccountLinks();
    renderProfilePage();
    toast("Your demo profile has been cleared.");
  });
}
