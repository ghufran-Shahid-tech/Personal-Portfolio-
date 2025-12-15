
// SECTION SWITCHING
const buttons = document.querySelectorAll("nav button");
const sections = document.querySelectorAll(".section");

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const targetId = btn.dataset.section;

    // Switch section
    sections.forEach(sec => sec.classList.remove("active"));
    document.getElementById(targetId).classList.add("active");

    // Active nav button
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

// Initial section
sections[0].classList.add("active");
buttons[0].classList.add("active");

// ================= TYPING ANIMATION =================
const typingText = document.getElementById("typing-text");

const words = [
  "Cybersecurity Enthusiast",
  "Ethical Hacker",
  "AI & Automation Developer",
  "Prompt Engineer",
  "Graphics Designer",
  "Web Developer"
];

let wordIndex = 0;
let letterIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentWord = words[wordIndex];

  if (isDeleting) {
    typingText.textContent = currentWord.slice(0, letterIndex--);
  } else {
    typingText.textContent = currentWord.slice(0, letterIndex++);
  }

  let speed = isDeleting ? 50 : 100;

  if (!isDeleting && letterIndex === currentWord.length + 1) {
    speed = 1200;
    isDeleting = true;
  }

  if (isDeleting && letterIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    speed = 400;
  }

  setTimeout(typeEffect, speed);
}

typeEffect();
