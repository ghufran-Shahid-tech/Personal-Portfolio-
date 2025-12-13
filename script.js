lucide.createIcons();

/* SECTION SWITCH */
const navBtns = document.querySelectorAll(".nav-btn");
const sections = document.querySelectorAll(".section");

navBtns.forEach(btn => {
  btn.onclick = () => {
    navBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    sections.forEach(s => s.classList.remove("active"));
    document.getElementById(btn.dataset.section).classList.add("active");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };
});

/* TYPING EFFECT */
const roles = [
  "Student",
  "Cybersecurity Enthusiast",
  "AI Automation",
  "Prompt Engineer",
  "Web Developer"
];

let i = 0, j = 0, del = false;
const typing = document.getElementById("typing-text");

(function type() {
  if (!typing) return;

  typing.textContent = roles[i].slice(0, j += del ? -1 : 1);

  if (j === roles[i].length) del = true;
  if (j === 0) { del = false; i = (i + 1) % roles.length; }

  setTimeout(type, del ? 60 : 110);
})();

/* PRESS EFFECT */
document.querySelectorAll(
  ".nav-btn, .cv-button, .skill-card, .portfolio-card, .social-links a"
).forEach(el => {
  el.addEventListener("mousedown", () => el.classList.add("is-pressed"));
  el.addEventListener("mouseup", () => el.classList.remove("is-pressed"));
  el.addEventListener("mouseleave", () => el.classList.remove("is-pressed"));
});
