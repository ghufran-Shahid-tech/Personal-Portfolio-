// IIFE to avoid polluting global scope
(() => {
    'use strict';

    // =================== LUCIDE ICONS ===================
    if (typeof window !== 'undefined' && window.lucide && typeof window.lucide.createIcons === 'function') {
        try {
            window.lucide.createIcons();
        } catch (e) {
            // fail silently if lucide fails
            // console.warn('lucide.createIcons failed', e);
        }
    }

    // =================== CURRENT YEAR ===================
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.textContent = String(new Date().getFullYear());
    }

    // =================== NAVIGATION & SMOOTH SCROLL ===================
    const navButtons = Array.from(document.querySelectorAll('.nav-button'));
    function setActiveNav(button) {
        navButtons.forEach(b => b.classList.remove('active'));
        if (button) button.classList.add('active');
    }
    if (navButtons.length) {
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // If it's a link, let it behave like a link but still smooth scroll if target exists
                e.preventDefault();
                setActiveNav(btn);

                const section = btn.dataset.section || (btn.getAttribute('href') || '').replace(/^#/, '');
                const target = section ? document.getElementById(`${section}-section`) || document.getElementById(section) : null;
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // Update the URL hash without jumping
                    if (history && typeof history.replaceState === 'function' && section) {
                        history.replaceState(null, '', `#${section}`);
                    }
                }
                // For responsive nav: close menu if open
                const navMenu = document.getElementById('nav-menu');
                const menuToggle = document.getElementById('menu-toggle');
                if (navMenu && !navMenu.classList.contains('hidden') && menuToggle) {
                    navMenu.classList.add('hidden');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });

        // Set initial active based on hash or first button
        const initialHash = (location.hash || '').replace('#', '');
        const initialBtn = navButtons.find(b => (b.dataset.section === initialHash) || (b.getAttribute('href') || '').endsWith(`#${initialHash}`)) || navButtons[0];
        setActiveNav(initialBtn);
    }

    // =================== INTERSECTION OBSERVER HELPERS ===================
    const supportsIntersectionObserver = 'IntersectionObserver' in window;

    // =================== FADE-UP ANIMATIONS ===================
    const animatedTexts = Array.from(document.querySelectorAll('.animated-text'));
    if (animatedTexts.length) {
        if (supportsIntersectionObserver) {
            const fadeObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-animated');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            animatedTexts.forEach(el => fadeObserver.observe(el));
        } else {
            // fallback: reveal all
            animatedTexts.forEach(el => el.classList.add('is-animated'));
        }
    }

    // =================== PORTFOLIO FADE-BOUNCE ===================
    const portfolioItems = Array.from(document.querySelectorAll('.portfolio-item'));
    if (portfolioItems.length) {
        portfolioItems.forEach((item, index) => {
            // Use inline style for stagger; CSS should use transition-delay if using class
            item.style.transitionDelay = `${index * 0.1}s`;
        });

        if (supportsIntersectionObserver) {
            const portfolioObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-bounce', 'show');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            portfolioItems.forEach(item => portfolioObserver.observe(item));
        } else {
            portfolioItems.forEach(item => item.classList.add('fade-bounce', 'show'));
        }
    }

    // =================== TYPING ANIMATION ===================
    (function typingAnimation() {
        const typingText = document.getElementById('typing-text');
        if (!typingText) return;

        const words = ["Cybersecurity", "AI Automation", "Prompt Engineering", "Web Development", "Graphics Designing"];
        if (!words.length) return;

        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typingSpeed = 120;
        const deletingSpeed = 80;
        const pauseAfterWord = 1000;

        function tick() {
            const current = words[wordIndex];
            if (!isDeleting) {
                charIndex++;
                typingText.textContent = current.substring(0, charIndex);
                if (charIndex === current.length) {
                    isDeleting = true;
                    setTimeout(tick, pauseAfterWord);
                } else {
                    setTimeout(tick, typingSpeed);
                }
            } else {
                charIndex--;
                typingText.textContent = current.substring(0, charIndex);
                if (charIndex === 0) {
                    isDeleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                    setTimeout(tick, 500);
                } else {
                    setTimeout(tick, deletingSpeed);
                }
            }
        }
        tick();
    })();

    // =================== CV MODAL ===================
    (function cvModalInit() {
        const cvCard = document.getElementById('cvCard');
        const cvModal = document.getElementById('cvModal');
        const cvClose = document.getElementById('cvModalClose');

        if (!cvCard || !cvModal || !cvClose) return;

        function openModal() {
            cvModal.style.display = 'flex';
            cvModal.setAttribute('aria-hidden', 'false');
            cvClose.focus();
            document.body.style.overflow = 'hidden'; // prevent background scroll
        }
        function closeModal() {
            cvModal.style.display = 'none';
            cvModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            cvCard.focus();
        }

        cvCard.addEventListener('click', openModal);
        cvCard.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal();
            }
        });

        cvClose.addEventListener('click', closeModal);
        cvClose.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                closeModal();
            }
        });

        cvModal.addEventListener('click', e => {
            if (e.target === cvModal) closeModal();
        });

        // Close on Escape
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && cvModal.style.display === 'flex') {
                closeModal();
            }
        });
    })();

    // =================== BUTTON PRESS EFFECTS ===================
    (function pressEffects() {
        const pressButtons = Array.from(document.querySelectorAll('.nav-button, .download-cv-button, .social-icon-link, .portfolio-button'));
        if (!pressButtons.length) return;

        const add = (el) => el.classList.add('is-pressed');
        const remove = (el) => el.classList.remove('is-pressed');

        pressButtons.forEach(btn => {
            // pointer events cover mouse/touch/pen
            btn.addEventListener('pointerdown', () => add(btn));
            btn.addEventListener('pointerup', () => remove(btn));
            btn.addEventListener('pointercancel', () => remove(btn));
            btn.addEventListener('pointerleave', () => remove(btn));
            // keyboard feedback
            btn.addEventListener('keydown', (e) => {
                if (e.key === ' ' || e.key === 'Enter') add(btn);
            });
            btn.addEventListener('keyup', (e) => {
                if (e.key === ' ' || e.key === 'Enter') remove(btn);
            });
        });
    })();

    // =================== ADDITIONAL SCROLL ANIMATIONS (Parallax) ===================
    (function parallax() {
        const profileImg = document.querySelector('.glowing-image-container');
        if (!profileImg) return;
        let ticking = false;

        function onScroll() {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.scrollY || window.pageYOffset;
                    profileImg.style.transform = `translateY(${scrollY * 0.08}px)`;
                    ticking = false;
                });
                ticking = true;
            }
        }

        // passive listener for better performance
        window.addEventListener('scroll', onScroll, { passive: true });
        // init position
        onScroll();
    })();

    // =================== RESPONSIVE MENU ===================
    (function responsiveMenu() {
        const menuToggle = document.getElementById('menu-toggle');
        const navMenu = document.getElementById('nav-menu');
        if (!menuToggle || !navMenu) return;

        menuToggle.addEventListener('click', () => {
            const isHidden = navMenu.classList.toggle('hidden');
            // Update aria-expanded
            menuToggle.setAttribute('aria-expanded', String(!isHidden));
        });

        // Close menu on nav link click
        navMenu.addEventListener('click', (e) => {
            const target = e.target;
            if (target && target.matches('a')) {
                navMenu.classList.add('hidden');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    })();

    // =================== REVEAL EFFECTS ON LOAD ===================
    window.addEventListener('load', () => {
        const els = Array.from(document.querySelectorAll('.fade-bounce'));
        els.forEach((el, index) => {
            setTimeout(() => el.classList.add('show'), index * 150);
        });
    });

    // =================== Graceful Fallbacks ===================
    // If IntersectionObserver isn't available, ensure elements still show
    if (!supportsIntersectionObserver) {
        document.querySelectorAll('.animated-text, .portfolio-item, .fade-bounce').forEach(el => {
            el.classList.add('is-animated', 'fade-bounce', 'show');
        });
    }

})();
