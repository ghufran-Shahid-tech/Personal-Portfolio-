
// SECTION SWITCHING
const buttons = document.querySelectorAll("nav button");
const sections = document.querySelectorAll(".section");

buttons.forEach(btn=>{
  btn.addEventListener("click",()=>{
    sections.forEach(sec=>sec.classList.remove("active"));
    document.getElementById(btn.dataset.section).classList.add("active");
    nav.classList.remove("show");
  });
});

// TYPING EFFECT
const words=[
  "Cybersecurity Enthusiast",
  "AI Developer",
  "Prompt Engineer",
  "Web Developer"
];
let i=0,j=0,del=false;
const typing=document.getElementById("typing");

function type(){
  if(!del){
    typing.textContent=words[i].substring(0,j++);
    if(j>words[i].length){del=true;setTimeout(type,1000);return;}
  }else{
    typing.textContent=words[i].substring(0,j--);
    if(j<0){del=false;i=(i+1)%words.length;}
  }
  setTimeout(type,del?50:120);
}
type();

// MOBILE MENU
const toggle=document.querySelector(".menu-toggle");
const nav=document.querySelector("nav");
toggle.onclick=()=>nav.classList.toggle("show");
