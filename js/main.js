/* Sydney Seals Freediving Club | main.js */

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
  var lastFocusedElement = null;

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
    lastFocusedElement = document.activeElement;
    currentIndex = index;
    lightboxImg.src = displayedImages[index].src;
    lightboxImg.alt = displayedImages[index].alt;
    setCredit(index);
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
    /* Move focus into the lightbox */
    document.getElementById("lightboxClose").focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
    /* Restore focus to the element that opened the lightbox */
    if (lastFocusedElement) {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
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
    fetch("/gallery.json")
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var photos = shuffle(data.photos.slice());
        var limit = data.show || photos.length;
        displayedImages = photos.slice(0, limit);

        displayedImages.forEach(function (photo, i) {
          var div = document.createElement("div");
          div.className = "masonry__item";
          div.setAttribute("role", "button");
          div.setAttribute("tabindex", "0");
          div.setAttribute("aria-label", photo.alt + ". Click to enlarge.");
          var img = document.createElement("img");
          img.src = "/" + photo.src;
          img.alt = "";  /* alt on wrapper, not img, since wrapper is the interactive element */
          img.loading = "lazy";
          div.addEventListener("click", function () { openLightbox(i); });
          div.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openLightbox(i);
            }
          });
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

    var closeBtn = document.getElementById("lightboxClose");
    var prevBtn = document.getElementById("lightboxPrev");
    var nextBtn = document.getElementById("lightboxNext");

    closeBtn.addEventListener("click", closeLightbox);
    prevBtn.addEventListener("click", showPrev);
    nextBtn.addEventListener("click", showNext);

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    /* Focus trapping inside lightbox */
    var focusableInLightbox = [prevBtn, nextBtn, closeBtn];

    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();

      /* Trap Tab within lightbox */
      if (e.key === "Tab") {
        var currentFocus = document.activeElement;
        var idx = focusableInLightbox.indexOf(currentFocus);
        if (e.shiftKey) {
          if (idx <= 0) {
            e.preventDefault();
            focusableInLightbox[focusableInLightbox.length - 1].focus();
          }
        } else {
          if (idx >= focusableInLightbox.length - 1) {
            e.preventDefault();
            focusableInLightbox[0].focus();
          }
        }
      }
    });
  }

  /* ---- Scroll-driven animations (Intersection Observer) ---- */
  if (!prefersReducedMotion) {
    var animatedEls = document.querySelectorAll(".animate-on-scroll");
    var staggerEls = document.querySelectorAll(".values__item, .join__benefit, .committee__card");

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      animatedEls.forEach(function (el) { observer.observe(el); });

      /* Stagger children with delay */
      var staggerObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var parent = entry.target.parentElement;
            var siblings = parent.querySelectorAll(".values__item, .join__benefit, .committee__card");
            siblings.forEach(function (el, i) {
              el.style.transitionDelay = (i * 0.08) + "s";
              el.classList.add("in-view");
            });
            siblings.forEach(function (el) { staggerObserver.unobserve(el); });
          }
        });
      }, { threshold: 0.1 });

      staggerEls.forEach(function (el) { staggerObserver.observe(el); });
    } else {
      animatedEls.forEach(function (el) { el.classList.add("in-view"); });
      staggerEls.forEach(function (el) { el.classList.add("in-view"); });
    }
  }

  /* ---- Parallax hero video ---- */
  var heroVideo = document.querySelector(".hero__video");
  if (heroVideo && !prefersReducedMotion && window.matchMedia("(min-width: 769px)").matches) {
    var hero = document.querySelector(".hero");
    window.addEventListener("scroll", function () {
      var scrollY = window.pageYOffset;
      var heroBottom = hero.offsetTop + hero.offsetHeight;
      if (scrollY < heroBottom) {
        heroVideo.style.transform = "translateY(" + (scrollY * 0.3) + "px)";
      }
    }, { passive: true });
  }
})();
