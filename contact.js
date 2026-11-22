"use strict";
const contactPage = document.body;
contactPage.classList.add("page-script-contact");
const form = document.querySelector("#contact-form");
const date = document.querySelector("input[type=date]");
if (date) date.setAttribute("aria-label", "Wedding date");
if (form) {
  form.dataset.pageReady = "true";
  form.querySelectorAll("input, textarea, select").forEach(field => {
    field.addEventListener("blur", () => field.classList.toggle("has-value", Boolean(field.value)));
  });
}
