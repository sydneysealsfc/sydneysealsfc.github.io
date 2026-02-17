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

  /* ---- Gallery (loaded from gallery.json) ---- */
  var galleryGrid = document.getElementById("galleryGrid");
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxCredit = document.getElementById("lightboxCredit");
  var displayedImages = [];
  var currentIndex = 0;

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }

  function setCredit(index) {
    var c = displayedImages[index].credit;
    lightboxCredit.textContent = c ? "Photo: " + c : "";
  }

  function openLightbox(index) {
    currentIndex = index;
    lightboxImg.src = displayedImages[index].src;
    lightboxImg.alt = displayedImages[index].alt;
    setCredit(index);
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + displayedImages.length) % displayedImages.length;
    lightboxImg.src = displayedImages[currentIndex].src;
    lightboxImg.alt = displayedImages[currentIndex].alt;
    setCredit(currentIndex);
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % displayedImages.length;
    lightboxImg.src = displayedImages[currentIndex].src;
    lightboxImg.alt = displayedImages[currentIndex].alt;
    setCredit(currentIndex);
  }

  if (galleryGrid && lightbox) {
    fetch("gallery.json")
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var photos = shuffle(data.photos.slice());
        var limit = data.show || photos.length;
        displayedImages = photos.slice(0, limit);

        displayedImages.forEach(function (photo, i) {
          var div = document.createElement("div");
          div.className = "masonry__item";
          var img = document.createElement("img");
          img.src = photo.src;
          img.alt = photo.alt;
          img.loading = "lazy";
          img.addEventListener("click", function () { openLightbox(i); });
          div.appendChild(img);
          if (photo.credit) {
            var credit = document.createElement("span");
            credit.className = "masonry__credit";
            credit.textContent = "Photo: " + photo.credit;
            div.appendChild(credit);
          }
          galleryGrid.appendChild(div);
        });
      });

    document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
    document.getElementById("lightboxPrev").addEventListener("click", showPrev);
    document.getElementById("lightboxNext").addEventListener("click", showNext);

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    });
  }

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
