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
function toggleItem(id) {
  const item = catalog.find(entry => entry.id === id);
  if (selected.includes(id)) selected = selected.filter(key => key !== id);
  else {
    if (item.group !== "services") selected = selected.filter(key => catalog.find(entry => entry.id === key).group !== item.group);
    selected.push(id);
  }
  save();
}
function save() {
  const saved = storage.set("elan-package", selected);
  $("#save-status").textContent = saved ? "Your selections are saved in this browser." : "Download your estimate to keep it.";
  render();
}
function render() {
  const holder = $("#package-items");
  holder.replaceChildren();
  if (!selected.length) holder.textContent = "Your story is a blank canvas. Select an option below to begin.";
  for (const item of items()) {
    const row = document.createElement("div");
    row.className = "package-row";
    row.innerHTML = "<span><small></small></span><span><button type='button' class='remove-item'>×</button></span>";
    $("small", row).textContent = item.group;
    row.firstChild.append(item.name);
    row.lastChild.prepend(money(item.price));
    $("button", row).setAttribute("aria-label", "Remove " + item.name);
    $("button", row).onclick = () => toggleItem(item.id);
    holder.append(row);
  }
  $$(".option-card").forEach(card => {
    const active = selected.includes(card.dataset.id);
    card.classList.toggle("selected", active);
    card.setAttribute("aria-pressed", String(active));
    $(".card-price", card).textContent = money(catalog.find(item => item.id === card.dataset.id).price);
  });
  $("#package-total").textContent = money(total());
  $("#request-package").disabled = $("#download-package").disabled = !selected.length;
}
$$(".option-card").forEach(card => card.onclick = () => toggleItem(card.dataset.id));
$("#clear-package").onclick = () => { selected = []; save(); };
$("#download-package").onclick = () => download("Elan-Wedding-Estimate.txt", estimate());
$("#request-package").onclick = () => location.href = "contact.html?" + new URLSearchParams({package: selected.join(",")});
render();
