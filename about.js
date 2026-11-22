"use strict";
const aboutPage = document.body;
aboutPage.classList.add("page-script-about");
const story = document.querySelector("#story");
const approach = document.querySelector("#approach");
if (story) story.setAttribute("data-section", "story");
if (approach) approach.setAttribute("data-section", "approach");
document.querySelectorAll(".split, .three-grid article").forEach((item, index) => {
  item.style.setProperty("--page-delay", `${index * 80}ms`);
});
