
// =================== LUCIDE ICONS ===================
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}

// =================== CURRENT YEAR ===================
document.getElementById("current-year").textContent = new Date().getFullYear();

// =================== NAVIGATION & SMOOTH SCROLL ===================
const navButtons = document.querySelectorAll('.nav-button');
navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const section = btn.dataset.section;
        const target = document.getElementById(`${section}-section`);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// =================== FADE-UP ANIMATIONS ===================
const animatedTexts = document.querySelectorAll('.animated-text');
const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-animated');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });
animatedTexts.forEach(el => fadeObserver.observe(el));

// =================== PORTFOLIO FADE-BOUNCE ===================
const portfolioItems = document.querySelectorAll('.portfolio-item');
portfolioItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.1}s`; // stagger effect
});
const portfolioObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-bounce', 'show');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });
portfolioItems.forEach(item => portfolioObserver.observe(item));

// =================== TYPING ANIMATION ===================
const typingText = document.getElementById('typing-text');
if (typingText) {
    const words = ["Cybersecurity", "AI Automation", "Prompt Engineering", "Web Development", "Graphics Designing"];
    let i = 0, j = 0, currentWord = '', isDeleting = false;

    function type() {
        if (i >= words.length) i = 0;
        currentWord = words[i];
        typingText.textContent = currentWord.substring(0, j);

        if (!isDeleting) {
            if (j < currentWord.length) {
                j++;
                setTimeout(type, 150);
            } else {
                isDeleting = true;
                setTimeout(type, 1000);
            }
        } else {
            if (j > 0) {
                j--;
                setTimeout(type, 100);
            } else {
                isDeleting = false;
                i++;
                setTimeout(type, 500);
            }
        }
    }
    type();
}

// =================== CV MODAL ===================
const cvCard = document.getElementById('cvCard'); // Add this ID to your CV card
const cvModal = document.getElementById('cvModal');
const cvClose = document.getElementById('cvModalClose');

if (cvCard && cvModal && cvClose) {
    cvCard.addEventListener('click', () => {
        cvModal.style.display = 'flex';
    });
    cvClose.addEventListener('click', () => {
        cvModal.style.display = 'none';
    });
    cvModal.addEventListener('click', e => {
        if (e.target === cvModal) cvModal.style.display = 'none';
    });
}

// =================== BUTTON PRESS EFFECTS ===================
const pressButtons = document.querySelectorAll('.nav-button, .download-cv-button, .social-icon-link, .portfolio-button');
pressButtons.forEach(btn => {
    btn.addEventListener('mousedown', () => btn.classList.add('is-pressed'));
    btn.addEventListener('mouseup', () => btn.classList.remove('is-pressed'));
    btn.addEventListener('mouseleave', () => btn.classList.remove('is-pressed'));
});

// =================== ADDITIONAL SCROLL ANIMATIONS ===================
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    // Parallax effect for profile image
    const profileImg = document.querySelector('.glowing-image-container');
    if (profileImg) profileImg.style.transform = `translateY(${scrollY * 0.1}px)`;
});

// =================== RESPONSIVE MENU (OPTIONAL) ===================
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('hidden');
    });
}

// =================== REVEAL EFFECTS ON LOAD ===================
window.addEventListener('load', () => {
    document.querySelectorAll('.fade-bounce').forEach((el, index) => {
        setTimeout(() => el.classList.add('show'), index * 150);
    });
});
