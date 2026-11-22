"use strict";
const portfolioPage = document.body;
portfolioPage.classList.add("page-script-portfolio");
const gallery = document.querySelector(".gallery");
if (gallery) gallery.dataset.ready = "true";
document.querySelectorAll(".gallery-card").forEach(card => {
  card.addEventListener("focus", () => card.classList.add("is-focused"));
  card.addEventListener("blur", () => card.classList.remove("is-focused"));
});
