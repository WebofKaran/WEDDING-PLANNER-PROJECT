"use strict";
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
const storage = {
  get(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },
  set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } },
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
let authMode = "signup";
function setAuthMode(mode) {
  authMode = mode;
  $("#login-form").reset();
  $("#auth-password").type = "password";
  $("#toggle-password").textContent = "Show";
  $("#toggle-password").setAttribute("aria-pressed", "false");
  $("#auth-name-field").hidden = mode === "login";
  $("#auth-name").required = mode === "signup";
  $("#auth-submit").textContent = mode === "signup" ? "Create Demo Profile" : "Log In to Demo";
  $("#login-title").textContent = mode === "signup" ? "Your forever starts here." : "Welcome back.";
  $("#login-status").textContent = "";
  $$(".auth-mode").forEach((button) => {
    const active = button.dataset.mode === mode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}
function showAuthProfile(profile) {
  const active = !!profile?.name;
  $("#auth-fields").hidden = active;
  $("#auth-success").hidden = !active;
  $("#login-status").textContent = "";
  if (active) {
    $("#login-title").textContent = "Welcome, " + profile.name + ".";
    $("#profile-email").textContent = profile.email || "Local demo profile";
  } else setAuthMode("signup");
}
$$(".auth-mode").forEach((button) => button.addEventListener("click", () => setAuthMode(button.dataset.mode)));
$("#toggle-password").addEventListener("click", () => {
  const show = $("#auth-password").type === "password";
  $("#auth-password").type = show ? "text" : "password";
  $("#toggle-password").textContent = show ? "Hide" : "Show";
  $("#toggle-password").setAttribute("aria-pressed", String(show));
});
$("#login-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = $("#auth-email").value.trim();
  const name = authMode === "signup" ? $("#auth-name").value.trim() : email.split("@")[0];
  if (!name) {
    $("#login-status").textContent = "Please enter your name.";
    $("#auth-name").focus();
    return;
  }
  const profile = { name, email };
  const saved = storage.set("elan-profile", profile);
  $("#login-form").reset();
  $("#auth-password").type = "password";
  showAuthProfile(profile);
  updateAccountLinks();
  if (saved) {
    location.href = "profile.html";
    return;
  }
  $("#login-status").textContent = "Demo profile ready for this visit. Browser storage is unavailable.";
});
$("#logout").addEventListener("click", () => {
  storage.remove("elan-profile");
  updateAccountLinks();
  showAuthProfile(null);

  $("#login-status").textContent = "Logged out. Your local demo profile has been cleared.";
});
showAuthProfile(storage.get("elan-profile", null));
