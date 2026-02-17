/* Sydney Seals Freediving Club | main.js */

(function () {
  "use strict";

  /* ---- Mobile nav toggle ---- */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.classList.toggle("active");
      toggle.setAttribute("aria-expanded", open);
    });

    /* Close menu when a link is clicked */
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.classList.remove("active");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll(".faq__question").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq__item");
      var answer = item.querySelector(".faq__answer");
      var isOpen = item.classList.contains("active");

      /* Close all others */
      document.querySelectorAll(".faq__item.active").forEach(function (el) {
        if (el !== item) {
          el.classList.remove("active");
          el.querySelector(".faq__question").setAttribute("aria-expanded", "false");
          el.querySelector(".faq__answer").style.maxHeight = null;
        }
      });

      /* Toggle current */
      if (isOpen) {
        item.classList.remove("active");
        btn.setAttribute("aria-expanded", "false");
        answer.style.maxHeight = null;
      } else {
        item.classList.add("active");
        btn.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  /* ---- Active nav link highlighting ---- */
  var currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav__links a").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === currentPage) {
      a.classList.add("active");
    } else if (href !== currentPage) {
      /* Only remove if explicitly set in HTML and doesn't match */
    }
  });
})();
