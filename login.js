"use strict";
const loginPage = document.body;
loginPage.classList.add("page-script-login");
const authForm = document.querySelector("#login-form");
if (authForm) {
  authForm.dataset.pageReady = "true";
  authForm.querySelectorAll("input").forEach(input => input.addEventListener("input", () => {
    input.setAttribute("aria-invalid", String(!input.checkValidity()));
  }));
}
