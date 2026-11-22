"use strict";
const builderPage = document.body;
builderPage.classList.add("page-script-builder");
const builder = document.querySelector(".builder-layout");
if (builder) builder.dataset.interactive = "true";
document.querySelectorAll(".option-card").forEach(card => {
  card.setAttribute("role", "button");
  card.setAttribute("tabindex", "0");
  card.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); card.click(); }
  });
});
