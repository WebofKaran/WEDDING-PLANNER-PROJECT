"use strict";
const privacyPage = document.body;
privacyPage.classList.add("page-script-privacy");
const clearData = document.querySelector("#clear-data");
if (clearData) clearData.setAttribute("aria-describedby", "privacy-data-note");
const note = document.querySelector(".prose");
if (note && !document.querySelector("#privacy-data-note")) {
  const text = document.createElement("span");
  text.id = "privacy-data-note"; text.hidden = true;
  note.append(text);
}
