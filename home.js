"use strict";
const homePage = document.body;
homePage.classList.add("page-script-home");
const hero = document.querySelector(".hero");
if (hero) hero.dataset.homepage = "true";
document.querySelectorAll(".hero-buttons a, .about-buttons a").forEach(link => {
  link.addEventListener("click", () => link.classList.add("is-visited"), { once: true });
});
