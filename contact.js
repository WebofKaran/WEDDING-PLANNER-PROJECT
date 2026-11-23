"use strict";
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
const storage = {
  get(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },
  set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } },
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
const money = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
function download(name, content) {
  const a = document.createElement("a");
  const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
const catalog = CATALOG;
let selected = storage.get("elan-package", []);
if (!Array.isArray(selected)) selected = [];
selected = selected.filter((id, i, a) => typeof id === "string" && a.indexOf(id) === i && catalog.some((item) => item.id === id));
for (const group of ["planning", "style", "experience"]) {
  const ids = catalog.filter((item) => item.group === group && selected.includes(item.id)).map((item) => item.id);
  if (ids.length > 1) selected = selected.filter((id) => !ids.slice(1).includes(id));
}
const items = () => catalog.filter((item) => selected.includes(item.id));
const total = () => items().reduce((sum, item) => sum + item.price, 0);
function estimate() {
  return "ELAN WEDDINGS — MY PACKAGE\n\n" + items().map((item) => item.name + " — " + money(item.price)).join("\n") + "\n\nEstimated total: " + money(total()) +
    "\nIllustrative starting prices. Final vendor quotes, taxes, travel and accommodation are additional. No booking has been made.";
}
let toastTimer;
function toast(message) {
  $("#toast").textContent = message;
  $("#toast").classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("#toast").classList.remove("show"), 3500);
}
const query = new URLSearchParams(location.search).get("package");
if (query !== null) selected = [...new Set(query.split(","))].filter((id) => catalog.some((i) => i.id === id));
if (selected.length) {
  const panel = $("#contact-package");
  const title = document.createElement("h3");
  title.textContent = "My Package";
  const text = document.createElement("p");
  text.textContent = items().length + " selections · " + money(total());
  const edit = document.createElement("a");
  edit.href = "custom-service-builder.html";
  edit.textContent = "Edit your package";
  panel.append(title, text, edit);
  storage.set("elan-package", selected);
}
const date = $("input[type=date]");
const now = new Date();
date.min = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");
const profile = storage.get("elan-profile", null);
if (profile?.name) $("input[name=name]", $("#contact-form")).value = profile.name;
if (profile?.email) $("input[name=email]", $("#contact-form")).value = profile.email;
let enquiry = "";
$("#contact-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  if (!String(data.get("name")).trim() || !String(data.get("message")).trim()) {
    toast("Please enter your name and wedding vision.");
    return;
  }
  enquiry = "Hello Elan Weddings,\n\n" + ["name", "email", "phone", "date", "city", "guests", "message"].map((key) =>
    key.toUpperCase() + ": " + (data.get(key) || "Not decided")
  ).join("\n") + "\n\n" + (selected.length ? estimate() : "I would like help creating my wedding package.");
  $("#send-email").href = "mailto:everafter@gmail.com?subject=" + encodeURIComponent("Wedding enquiry — " + data.get("name")) + "&body=" + encodeURIComponent(enquiry);
  $("#enquiry-result").hidden = false;
  $("#enquiry-result").scrollIntoView({ behavior: "smooth", block: "nearest" });
});
$("#contact-form").oninput = () => { $("#enquiry-result").hidden = true; };
$("#download-enquiry").onclick = () => download("Elan-Wedding-Enquiry.txt", enquiry);
