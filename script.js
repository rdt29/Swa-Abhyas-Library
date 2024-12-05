import { imageSources } from "./Images.js";
function show() {
  gsap.registerPlugin(ScrollTrigger);

  const locoScroll = new LocomotiveScroll({
    el: document.querySelector("#main"),
    smooth: true,
  });
  locoScroll.on("scroll", ScrollTrigger.update);

  ScrollTrigger.scrollerProxy("#main", {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, 0, 0)
        : locoScroll.scroll.instance.scroll.y;
    }, 
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    pinType: document.querySelector("#main").style.transform
      ? "transform"
      : "fixed",
  });

  ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

  ScrollTrigger.refresh();
}
show();

document.addEventListener("DOMContentLoaded", () => {
  gsap.from(".header", {
    duration: 1,
    y: -100,
    opacity: 0,
    ease: "power2.out",
  });

  gsap.from(".content .image img", {
    duration: 1.4,
    y: -50,
    opacity: 0,
    ease: "power4.out",
    delay: 0.5,
  });

  gsap.from(".content .info", {
    duration: 1.4,
    y: -60,
    opacity: 0,
    ease: "power4.out",
    delay: 1,
  });

  gsap.from(".features-title", {
    scrollTrigger: {
      trigger: ".features-title",
      scroller: "#main",
      scrub: 1,
      start: "top 80%",
      end: "top 55%",
    },
    duration: 1.4,
    opacity: 0,
    y: 50,
    ease: "power4.out",
  });

  gsap.from(".features-list .feature", {
    scrollTrigger: {
      trigger: ".features-title",
      scroller: "#main",
      scrub: 1,
      start: "top 70%",
      end: "top 45%",
    },
    duration: 1.4,
    opacity: 0,
    scale: 0.5,
    stagger: 0.2,
    ease: "power4.out",
  });

  gsap.from(".footer", {
    duration: 1,
    y: 100,
    opacity: 0,
    ease: "power2.out",

    scrollTrigger: {
      trigger: ".footer",
      scroller: "#main",
      // markers:true,
      scrub: 1,
      start: "top 98%",
      end: "top 45%",
    },
  });
});

gsap.from(".carousel", {
  duration: 1.4,
  opacity: 0,
  scale: 0.5,
  stagger: 0.2,
  scrollTrigger: {
    trigger: ".carousel",
    scroller: "#main",
    // markers:true,
    scrub: 1,
    start: "top 85%",
    end: "top 45%",
  },
});

// Function to open the modal and display the image and caption

function openModal(imageSrc, captionText) {
  const modal = document.getElementById("modal");
  const modalImage = document.getElementById("modal-image");
  const modalCaption = document.getElementById("modal-caption");

  // modal.style.display = "block";
  modalImage.src = imageSrc;
  modalCaption.textContent = captionText;

  gsap.from(modal, {
    duration: 0.4,
    scale: 0.5,
    opacity: 0,
    onStart: () => {
      modal.style.display = "block"; // Ensures the modal is visible and centered after the animation
    },
  });
  // Add event listener for "Esc" key
  document.addEventListener("keydown", handleKeyPress);
  document.querySelector(".close").addEventListener("click", closeModal);
}
// Close Modal
function closeModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "none";

  document.removeEventListener("keydown", handleKeyPress);
  document.querySelector(".close").removeEventListener("click", closeModal);
}

function handleKeyPress(event) {
  if (event.key === "Escape") {
    closeModal();
  }
}

function populateCarousel() {
  const carouselContainer = document.querySelector(".carousel-container");

  imageSources.forEach((item, index) => {
    const slideDiv = document.createElement("div");
    slideDiv.className = "carousel-slide";

    // Attach click event to open modal with the image and caption
    slideDiv.onclick = function () {
      openModal(item.src, item.desc);
    };

    const imgElement = document.createElement("img");
    imgElement.src = item.src;
    imgElement.alt = `Library Interior ${index + 1}`;

    const description = document.createElement("p");
    description.textContent = item.desc;

    slideDiv.appendChild(imgElement);
    slideDiv.appendChild(description);
    carouselContainer.appendChild(slideDiv);
  });
}

// Populate the carousel when the page loads
populateCarousel();

const scrollingContent = document.querySelector(".scrolling-content");
let isMouseDown = false;
let startX;
let scrollLeft;

function smoothScroll() {
  const scrollWidth = scrollingContent.scrollWidth;
  const clientWidth = scrollingContent.clientWidth + 1;

  // Reset to start when reaching the end

  if (scrollingContent.scrollLeft + clientWidth >= scrollWidth) {
    scrollingContent.scrollLeft = 0; 
  } else {
    scrollingContent.scrollLeft += 1;
  }
}
// Mouse/Touch event for manual scrolling
scrollingContent.addEventListener("mousedown", (e) => {
  isMouseDown = true;
  startX = e.pageX - scrollingContent.offsetLeft;
  scrollLeft = scrollingContent.scrollLeft;
});
scrollingContent.addEventListener("mouseleave", () => {
  isMouseDown = false;
});
scrollingContent.addEventListener("mouseup", () => {
  isMouseDown = false;
});
scrollingContent.addEventListener("mousemove", (e) => {
  if (!isMouseDown) return;
  e.preventDefault();
  const x = e.pageX - scrollingContent.offsetLeft;
  const walk = (x - startX) * 1; // 1 is the scroll speed multiplier
  scrollingContent.scrollLeft = scrollLeft - walk;
});

// Touch events for mobile scrolling
scrollingContent.addEventListener("touchstart", (e) => {
  isMouseDown = true;
  startX = e.touches[0].pageX - scrollingContent.offsetLeft;
  scrollLeft = scrollingContent.scrollLeft;
});
scrollingContent.addEventListener("touchend", () => {
  isMouseDown = false;
});
scrollingContent.addEventListener("touchmove", (e) => {
  if (!isMouseDown) return;
  e.preventDefault();
  const x = e.touches[0].pageX - scrollingContent.offsetLeft;
  const walk = (x - startX) * 1;
  scrollingContent.scrollLeft = scrollLeft - walk;
});

// Set an interval for continuous scroll (auto-scroll)
setInterval(smoothScroll, 5); // Adjust speed as needed
