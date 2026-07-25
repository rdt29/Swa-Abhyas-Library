// ---------------------------------------------------------
// Fallback gallery images (used only if ./Images.js is missing)
// ---------------------------------------------------------
const fallbackImages = [
  {
    src: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=700&auto=format&fit=crop",
    desc: "Bookshelves in the reading room",
  },
  {
    src: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=700&auto=format&fit=crop",
    desc: "Students at the shared study table",
  },
  {
    src: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=700&auto=format&fit=crop",
    desc: "Stack of reference books",
  },
  {
    src: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=700&auto=format&fit=crop",
    desc: "Open notebook and reading material",
  },
  {
    src: "https://images.unsplash.com/photo-1524578271613-d550eed382f6?q=80&w=700&auto=format&fit=crop",
    desc: "Quiet corner for individual reading",
  },
  {
    src: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=700&auto=format&fit=crop",
    desc: "Aisle view of the library",
  },
];

const demoTestimonials = [
  {
    text: "The silence rule actually gets followed here. It's the first place I've studied where I don't lose focus every ten minutes.",
    author: "Rajdeep Tiwari",
    rating: 5,
  },
  {
    text: "Having a fixed seat and locker made it easy to just show up and start working instead of setting up every day.",
    author: "S. Shah",
    rating: 5,
  },
  {
    text: "Good lighting, stable Wi-Fi, and it's never overcrowded. Exactly what I needed before my finals.",
    author: "A. Mehta",
    rating: 5,
  },
];

let imageSources = fallbackImages;

try {
  const mod = await import("./Images.js");
  if (Array.isArray(mod.imageSources) && mod.imageSources.length) {
    imageSources = mod.imageSources;
  }
} catch (err) {
  // Using fallback images
}

// ---------------------------------------------------------
// Sticky Navigation
// ---------------------------------------------------------

const nav = document.getElementById("siteNav");

function updateNavState() {
  nav.classList.toggle("is-scrolled", window.scrollY > 24);
}

updateNavState();
window.addEventListener("scroll", updateNavState, {
  passive: true,
});

// ---------------------------------------------------------
// Mobile Navigation
// ---------------------------------------------------------

const navToggle = document.getElementById("navToggle");
const navNav = document.querySelector(".nav__nav");

navToggle.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";

  navToggle.setAttribute("aria-expanded", String(!isOpen));
  navNav.classList.toggle("is-open", !isOpen);
});

document.querySelectorAll(".nav__links a").forEach((link) => {
  link.addEventListener("click", () => {
    navToggle.setAttribute("aria-expanded", "false");
    navNav.classList.remove("is-open");
  });
});

// ---------------------------------------------------------
// Active Navigation Highlight
// ---------------------------------------------------------

const navLinks = document.querySelectorAll(".nav__links a[data-nav]");

const sections = Array.from(navLinks)
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const id = "#" + entry.target.id;

      navLinks.forEach((link) => {
        if (link.getAttribute("href") === id) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    });
  },
  {
    rootMargin: "-45% 0px -50% 0px",
    threshold: 0,
  },
);
sections.forEach((section) => sectionObserver.observe(section));

// ---------------------------------------------------------
// Scroll Reveal
// ---------------------------------------------------------

const revealItems = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.15,
  },
);

revealItems.forEach((item) => revealObserver.observe(item));

// ---------------------------------------------------------
// Counter Animation
// ---------------------------------------------------------

function animateCounter(el) {
  const target = Number(el.dataset.count || 0);
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);

    el.textContent = Math.round(target * eased);

    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const counters = document.querySelectorAll(".stat__num");

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.6,
  },
);

counters.forEach((el) => counterObserver.observe(el));

// ---------------------------------------------------------
// Gallery
// ---------------------------------------------------------

const galleryGrid = document.getElementById("galleryGrid");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");

function populateGallery() {
  imageSources.forEach((item, index) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "gallery__item reveal";

    const img = document.createElement("img");

    img.src = item.src;
    img.loading = "lazy";
    img.alt = item.desc || `Library photo ${index + 1}`;

    button.appendChild(img);

    button.addEventListener("click", () => openLightbox(item.src, item.desc));

    galleryGrid.appendChild(button);
    revealObserver.observe(button);
  });
}

// ---------------------------------------------------------
// Google Reviews
// ---------------------------------------------------------

const API_KEY = "AIzaSyDCUMI5FjOu1Ru8fVpkH_IrAm9SLE9-nZ8";
const PLACE_ID = "ChIJF7tbBQCxgTkRCVLjuFvfh6g";

async function loadTestimonials() {
  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${PLACE_ID}?fields=reviews&key=${API_KEY}`,
    );

    if (!response.ok) throw new Error("API Error");

    const data = await response.json();

    if (!data.reviews || !data.reviews.length) {
      throw new Error("No Reviews");
    }

    renderTestimonials(
      data.reviews.map((review) => ({
        text: review.text?.text,
        author: review.authorAttribution?.displayName,
        rating: review.rating,
        googleMapsUri: review.googleMapsUri,
      })),
    );
  } catch (err) {
    console.error(err);
    renderTestimonials(demoTestimonials);
  }
}

function renderTestimonials(testimonials) {
  const container = document.getElementById("testimonials-container");

  const reviews = testimonials.filter((t) => t.rating === 5);

  container.innerHTML = reviews
    .map(
      (t) => `
<figure class="testimonial">

<div class="testimonial-header">

<div class="testimonial-author">
${t.author}
</div>

<div class="testimonial-stars">

${Array.from(
  { length: t.rating },
  () => `
        <svg class="star" viewBox="0 0 24 24">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
        `,
).join("")}

        </div>

        </div>

        <blockquote>
        ${t.text}
        </blockquote>

        <div class="testimonial-footer">

        <a
        href="${t.googleMapsUri || "#"}"
        target="_blank"
        rel="noopener"
        class="google-review-btn"
        >

        <div class="google-left">

        <svg class="google-icon" viewBox="0 0 48 48">

        <path fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.3-.4-3.5z"/>

        <path fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15.2 18.9 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>

        <path fill="#4CAF50"
        d="M24 44c5.2 0 10-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.2-8H6.5C9.8 36.2 16.3 44 24 44z"/>

        <path fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-1.1 3-3.3 5.3-6.2 6.8l6.2 5.2C39 36.4 44 31 44 24c0-1.3-.1-2.3-.4-3.5z"/>

        </svg>

        <span>View on Google</span>

        </div>

        <i class="ri-arrow-right-line"></i>

        </a>

        </div>

        </figure>
`,
    )
    .join("");

  document.querySelectorAll(".testimonial").forEach((card) => {
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.opacity = "1";
    card.style.visibility = "visible";
    card.style.transform = "none";
  });
}

loadTestimonials();
// ---------------------------------------------------------
// Reviews Carousel
// ---------------------------------------------------------

const reviewsTrack = document.querySelector(".reviews-track");
const prevBtn = document.querySelector(".review-nav.prev");
const nextBtn = document.querySelector(".review-nav.next");

let autoSlide;

function getCardWidth() {
  const card = document.querySelector(".testimonial");
  if (!card) return 0;

  const gap = 24;

  return card.offsetWidth + gap;
}

function slideNext() {
  if (!reviewsTrack) return;

  const amount = getCardWidth();

  reviewsTrack.scrollBy({
    left: amount,
    behavior: "smooth",
  });

  if (
    reviewsTrack.scrollLeft + reviewsTrack.clientWidth >=
    reviewsTrack.scrollWidth - amount
  ) {
    setTimeout(() => {
      reviewsTrack.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    }, 800);
  }
}

function slidePrev() {
  if (!reviewsTrack) return;

  const amount = getCardWidth();

  if (reviewsTrack.scrollLeft <= amount) {
    reviewsTrack.scrollTo({
      left: reviewsTrack.scrollWidth,
      behavior: "smooth",
    });

    return;
  }

  reviewsTrack.scrollBy({
    left: -amount,
    behavior: "smooth",
  });
}

function startAutoSlide() {
  stopAutoSlide();

  autoSlide = setInterval(() => {
    slideNext();
  }, 5000);
}

function stopAutoSlide() {
  clearInterval(autoSlide);
}

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    slideNext();
    startAutoSlide();
  });
}

if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    slidePrev();
    startAutoSlide();
  });
}

if (reviewsTrack) {
  reviewsTrack.addEventListener("mouseenter", stopAutoSlide);
  reviewsTrack.addEventListener("mouseleave", startAutoSlide);

  reviewsTrack.addEventListener("touchstart", stopAutoSlide, {
    passive: true,
  });

  reviewsTrack.addEventListener("touchend", startAutoSlide);
}

window.addEventListener("load", () => {
  setTimeout(startAutoSlide, 1000);
});

// ---------------------------------------------------------
// Gallery Lightbox
// ---------------------------------------------------------

function openLightbox(src, caption) {
  lightboxImage.src = src;
  lightboxImage.alt = caption || "";
  lightboxCaption.textContent = caption || "";

  lightbox.showModal();
}

lightboxClose.addEventListener("click", () => {
  lightbox.close();
});

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    lightbox.close();
  }
});

populateGallery();
// ---------------------------------------------------------
// Contact Form (Static Website)
// ---------------------------------------------------------

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("cf-name").value.trim();
    const email = document.getElementById("cf-email").value.trim();
    const message = document.getElementById("cf-message").value.trim();

    if (!name || !email || !message) {
      formStatus.textContent = "Please fill in all fields before sending.";
      return;
    }

    const subject = encodeURIComponent(`Enquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}

            Email: ${email}

            Message:
            ${message}

            ----------------------------------------

            This enquiry was submitted through the Swa Abhyas Library website.

            Website: ${window.location.origin}
`,
    );

    window.location.href = `mailto:swaabhyas4success@gmail.com?subject=${subject}&body=${body}`;

    formStatus.textContent = "Opening your email application...";

    contactForm.reset();
  });
}

// ---------------------------------------------------------
// Smooth Scroll Offset
// ---------------------------------------------------------

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));

    if (!target) return;

    e.preventDefault();

    const navHeight = document.getElementById("siteNav").offsetHeight;

    window.scrollTo({
      top: target.offsetTop - navHeight,
      behavior: "smooth",
    });
  });
});

// ---------------------------------------------------------
// Refresh reveal animations after reviews load
// ---------------------------------------------------------

function refreshRevealAnimations() {
  document.querySelectorAll(".testimonial").forEach((item) => {
    item.classList.add("is-visible");
  });
}

setTimeout(refreshRevealAnimations, 500);

// ---------------------------------------------------------
// Resize carousel correctly
// ---------------------------------------------------------

window.addEventListener("resize", () => {
  stopAutoSlide();
  startAutoSlide();
});

// ---------------------------------------------------------
// End of File
// ---------------------------------------------------------
