"use strict";
const profilePage = document.body;
profilePage.classList.add("page-script-profile");
const profilePanel = document.querySelector(".profile-panel");
if (profilePanel) profilePanel.dataset.pageReady = "true";
document.querySelectorAll(".profile-actions a").forEach(link => {
  link.addEventListener("click", () => link.classList.add("is-visited"), { once: true });
});
