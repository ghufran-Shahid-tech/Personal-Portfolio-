// SECTION SWITCHING
const buttons = document.querySelectorAll("nav button");
const sections = document.querySelectorAll(".section");

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    sections.forEach(sec => sec.classList.remove("active"));
    document.getElementById(btn.dataset.section).classList.add("active");
    window.scrollTo({top:0, behavior:"smooth"});
  });
});

// TYPING ANIMATION
const typingText = document.getElementById("typing-text");
const words = ["Cybersecurity Enthusiast", "Ethical Hacker", "AI & Automation Developer", "Prompt Engineer", "Graphics Designer", "Web Developer"];
let wordIndex = 0;
let letterIndex = 0;
let currentWord = "";
let isDeleting = false;

function type(){
  currentWord = words[wordIndex];
  if(isDeleting){
    typingText.textContent = currentWord.substring(0, letterIndex--);
    if(letterIndex < 0){
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }
  } else{
    typingText.textContent = currentWord.substring(0, letterIndex++);
    if(letterIndex > currentWord.length){
      isDeleting = true;
    }
  }
  setTimeout(type, isDeleting ? 50 : 150);
}
type();