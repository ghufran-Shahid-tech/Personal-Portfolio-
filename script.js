// ===== SECTION NAVIGATION =====
const navButtons = document.querySelectorAll('.nav-button');
const sections = document.querySelectorAll('.section-content');

navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    sections.forEach(sec => sec.classList.add('hidden'));
    document.getElementById(btn.dataset.section + '-section').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// ===== TYPING ANIMATION =====
const typingText = document.getElementById('typing-text');
const skills = ["Cybersecurity Enthusiast", "AI Developer", "Prompt Engineer", "Web Developer"];
let i = 0, j = 0, deleting = false;

function type() {
  const current = skills[i];
  if (deleting) {
    typingText.textContent = current.substring(0, j--);
  } else {
    typingText.textContent = current.substring(0, j++);
  }
  if (!deleting && j === current.length + 1) { deleting = true; setTimeout(type, 1000); return; }
  if (deleting && j < 0) { deleting = false; i = (i + 1) % skills.length; setTimeout(type, 500); return; }
  setTimeout(type, deleting ? 50 : 150);
}
type();

// ===== LUCIDE ICONS =====
lucide.createIcons();
