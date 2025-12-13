/* ===============================
   CORE UTILITIES
================================ */
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* ===============================
   LUCIDE INIT
================================ */
if (window.lucide) {
  lucide.createIcons();
}

/* ===============================
   SECTION NAVIGATION (VIP)
================================ */
const navButtons = document.querySelectorAll(".nav-btn");
const sections = document.querySelectorAll(".section");

navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.section;
    if (!target) return;

    // active nav
    navButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // switch section
    sections.forEach(sec => sec.classList.remove("active"));
    const activeSection = document.getElementById(target);
    if (activeSection) activeSection.classList.add("active");

    // reset scroll
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

/* ===============================
   TYPING EFFECT (SMOOTH)
================================ */
const typingTarget = document.getElementById("typing-text");
if (typingTarget) {
  const roles = [
    "Student",
    "Cybersecurity Enthusiast",
    "AI Automation",
    "Prompt Engineer",
    "Web Developer"
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeLoop() {
    const text = roles[roleIndex];

    if (!deleting) {
      typingTarget.textContent = text.slice(0, ++charIndex);
      if (charIndex === text.length) {
        setTimeout(() => (deleting = true), 1200);
      }
    } else {
      typingTarget.textContent = text.slice(0, --charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }

    setTimeout(typeLoop, deleting ? 60 : 110);
  }

  typeLoop();
}

/* ===============================
   PRESS / TOUCH FEEDBACK
================================ */
function pressEffect(elements) {
  elements.forEach(el => {
    el.addEventListener("mousedown", () => el.classList.add("is-pressed"));
    el.addEventListener("mouseup", () => el.classList.remove("is-pressed"));
    el.addEventListener("mouseleave", () => el.classList.remove("is-pressed"));
    el.addEventListener("touchstart", () => el.classList.add("is-pressed"), { passive: true });
    el.addEventListener("touchend", () => el.classList.remove("is-pressed"));
  });
}

pressEffect(document.querySelectorAll(
  ".nav-btn, .cv-button, .skill-card, .portfolio-card, .social-links a"
));

/* ===============================
   CARD TILT (DESKTOP ONLY)
================================ */
if (!prefersReducedMotion && window.matchMedia("(hover:hover)").matches) {
  document.querySelectorAll(".skill-card, .portfolio-card").forEach(card => {
    card.addEventListener("mousemove", e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateX = ((y / rect.height) - 0.5) * -6;
      const rotateY = ((x / rect.width) - 0.5) * 6;

      card.style.transform = `
        perspective(600px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-6px)
      `;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

/* ===============================
   SECTION ENTRANCE STAGGER
================================ */
function staggerReveal(section) {
  if (prefersReducedMotion) return;

  const items = section.querySelectorAll(
    ".skill-card, .portfolio-card, .contact-item"
  );

  items.forEach((item, i) => {
    item.style.opacity = "0";
    item.style.transform = "translateY(12px)";
    setTimeout(() => {
      item.style.transition = "opacity .4s ease, transform .4s ease";
      item.style.opacity = "1";
      item.style.transform = "translateY(0)";
    }, i * 90);
  });
}

// observe section activation
sections.forEach(section => {
  const observer = new MutationObserver(() => {
    if (section.classList.contains("active")) {
      staggerReveal(section);
    }
  });
  observer.observe(section, { attributes: true });
});

/* ===============================
   KEYBOARD ACCESSIBILITY
================================ */
document.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const focused = document.activeElement;
    if (focused && focused.click) focused.click();
  }
});
