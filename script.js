/**
 * FUTURISTIC PORTFOLIO - MAIN JAVASCRIPT
 * Features: 3D Tilt, Section Switching, Typing Animation, Background Particles, Ripple Effects
 */

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
  tiltMaxAngle: 20,
  tiltSpeed: 400,
  bgParticleCount: 30,
  typingSpeed: 100,
  typingDeleteSpeed: 50,
  typingPause: 1500
};

// ============================================
// DOM ELEMENTS
// ============================================
const elements = {
  navButtons: document.querySelectorAll('.nav-btn'),
  sections: document.querySelectorAll('.section'),
  profileWrapper: document.getElementById('profile-wrapper'),
  profile3d: document.getElementById('profile-3d'),
  typingText: document.getElementById('typing-text'),
  particlesContainer: document.getElementById('particles-container'),
  tiltCards: document.querySelectorAll('[data-tilt]')
};

// ============================================
// SECTION SWITCHING
// ============================================
function initSectionSwitching() {
  elements.navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.section;

      // Update active nav button
      elements.navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Animate section transition
      const currentSection = document.querySelector('.section.active');
      const targetSection = document.getElementById(targetId);

      if (currentSection && currentSection !== targetSection) {
        // Animate out current section
        currentSection.style.animation = 'section-exit 0.3s ease forwards';

        setTimeout(() => {
          currentSection.classList.remove('active');
          currentSection.style.animation = '';

          // Activate and animate in new section
          targetSection.classList.add('active');
          targetSection.style.animation = 'section-enter 0.5s ease forwards';

          // Reset animation after completion
          setTimeout(() => {
            targetSection.style.animation = '';
          }, 500);
        }, 300);
      }

      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

// Add section exit animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes section-exit {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-20px);
    }
  }
`;
document.head.appendChild(styleSheet);

// ============================================
// TYPING ANIMATION
// ============================================
const typingWords = [
  'Cybersecurity Enthusiast',
  'Ethical Hacker',
  'AI & Automation Developer',
  'Prompt Engineer',
  'Graphics Designer',
  'Web Developer'
];

function initTypingAnimation() {
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;

  function type() {
    const currentWord = typingWords[wordIndex];

    if (isPaused) {
      setTimeout(() => {
        isPaused = false;
        isDeleting = true;
        type();
      }, CONFIG.typingPause);
      return;
    }

    if (isDeleting) {
      elements.typingText.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      elements.typingText.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? CONFIG.typingDeleteSpeed : CONFIG.typingSpeed;

    // Randomize speed slightly for natural feel
    typeSpeed += Math.random() * 50 - 25;

    if (!isDeleting && charIndex === currentWord.length) {
      isPaused = true;
      typeSpeed = CONFIG.typingPause;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % typingWords.length;
      typeSpeed = 300;
    }

    setTimeout(type, typeSpeed);
  }

  // Start typing animation
  setTimeout(type, 1000);
}

// ============================================
// ENHANCED 3D TILT EFFECT FOR PROFILE IMAGE WITH MOUSE/TOUCH
// ============================================
function initProfileTilt() {
  if (!elements.profileWrapper || !elements.profile3d) return;

  const wrapper = elements.profileWrapper;
  const image = elements.profile3d;
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  let bounds;
  let rafId = null;
  let currentRotateX = 0;
  let currentRotateY = 0;
  let targetRotateX = 0;
  let targetRotateY = 0;
  let isDragging = false;
  let startX, startY;

  function updateBounds() {
    bounds = wrapper.getBoundingClientRect();
  }

  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  function animate() {
    // Smooth interpolation
    currentRotateX = lerp(currentRotateX, targetRotateX, 0.1);
    currentRotateY = lerp(currentRotateY, targetRotateY, 0.1);

    // Apply transform with additional depth effects
    image.style.transform = `
      rotateX(${currentRotateX}deg) 
      rotateY(${currentRotateY}deg) 
      translateZ(${Math.abs(currentRotateX) + Math.abs(currentRotateY) * 0.5}px)
    `;

    // Adjust glow intensity based on tilt
    const glowIntensity = 0.35 + (Math.abs(currentRotateX) + Math.abs(currentRotateY)) / 100;
    const glow = image.querySelector('.profile-glow');
    if (glow) {
      glow.style.opacity = Math.min(glowIntensity, 0.7);
    }

    rafId = requestAnimationFrame(animate);
  }

  // Mouse events
  wrapper.addEventListener('mouseenter', () => {
    updateBounds();
    animate();
    image.style.transition = 'none';
  });

  wrapper.addEventListener('mousemove', (e) => {
    if (!bounds) updateBounds();

    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Calculate rotation (inverted for natural feel)
    targetRotateX = (mouseY / (bounds.height / 2)) * -CONFIG.tiltMaxAngle;
    targetRotateY = (mouseX / (bounds.width / 2)) * CONFIG.tiltMaxAngle;

    // Clamp values
    targetRotateX = Math.max(-CONFIG.tiltMaxAngle, Math.min(CONFIG.tiltMaxAngle, targetRotateX));
    targetRotateY = Math.max(-CONFIG.tiltMaxAngle, Math.min(CONFIG.tiltMaxAngle, targetRotateY));
  });

  wrapper.addEventListener('mouseleave', () => {
    targetRotateX = 0;
    targetRotateY = 0;

    // Add transition for smooth return
    image.style.transition = 'transform 0.5s ease';

    // Stop animation after return
    setTimeout(() => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      image.style.transform = '';
    }, 500);
  });

  // Touch events for mobile
  wrapper.addEventListener('touchstart', (e) => {
    e.preventDefault();
    updateBounds();
    isDragging = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    wrapper.classList.add('touched');

    animate();
    image.style.transition = 'none';
  }, { passive: false });

  wrapper.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    e.preventDefault();

    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;

    const deltaX = touchX - startX;
    const deltaY = touchY - startY;

    // Calculate rotation based on touch movement
    targetRotateY = (deltaX / bounds.width) * CONFIG.tiltMaxAngle * 2;
    targetRotateX = -(deltaY / bounds.height) * CONFIG.tiltMaxAngle * 2;

    // Clamp values
    targetRotateX = Math.max(-CONFIG.tiltMaxAngle, Math.min(CONFIG.tiltMaxAngle, targetRotateX));
    targetRotateY = Math.max(-CONFIG.tiltMaxAngle, Math.min(CONFIG.tiltMaxAngle, targetRotateY));
  }, { passive: false });

  wrapper.addEventListener('touchend', () => {
    isDragging = false;
    wrapper.classList.remove('touched');
    targetRotateX = 0;
    targetRotateY = 0;

    image.style.transition = 'transform 0.5s ease';

    setTimeout(() => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      image.style.transform = '';
    }, 500);
  });

  // Update bounds on resize
  window.addEventListener('resize', updateBounds, { passive: true });
}

// ============================================
// 3D TILT EFFECT FOR CARDS
// ============================================
function initCardTilt() {
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  if (isTouchDevice) return;

  elements.tiltCards.forEach(card => {
    const content = card.querySelector('.card-content');
    if (!content) return;

    let bounds;
    let rafId = null;
    let currentRotateX = 0;
    let currentRotateY = 0;
    let targetRotateX = 0;
    let targetRotateY = 0;

    function lerp(start, end, factor) {
      return start + (end - start) * factor;
    }

    function animate() {
      currentRotateX = lerp(currentRotateX, targetRotateX, 0.15);
      currentRotateY = lerp(currentRotateY, targetRotateY, 0.15);

      content.style.transform = `translateY(-10px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;

      rafId = requestAnimationFrame(animate);
    }

    card.addEventListener('mouseenter', () => {
      bounds = card.getBoundingClientRect();
      animate();
      content.style.transition = 'none';
    });

    card.addEventListener('mousemove', (e) => {
      if (!bounds) bounds = card.getBoundingClientRect();

      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;

      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      targetRotateX = (mouseY / (bounds.height / 2)) * -10;
      targetRotateY = (mouseX / (bounds.width / 2)) * 10;
    });

    card.addEventListener('mouseleave', () => {
      targetRotateX = 0;
      targetRotateY = 0;

      content.style.transition = 'transform 0.5s ease';
      content.style.transform = '';

      setTimeout(() => {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }, 500);
    });
  });
}

// ============================================
// BACKGROUND MOVING PARTICLES
// ============================================
function initBackgroundParticles() {
  if (!elements.particlesContainer) return;

  // Check for touch device - reduce particles on mobile
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  const particleCount = isTouchDevice ? 10 : CONFIG.bgParticleCount;

  for (let i = 0; i < particleCount; i++) {
    createBackgroundParticle();
  }
}

function createBackgroundParticle() {
  const particle = document.createElement('div');
  particle.className = 'bg-particle';

  // Random properties
  const size = Math.random() * 6 + 2;
  const left = Math.random() * 100;
  const delay = Math.random() * 20;
  const duration = Math.random() * 15 + 10;
  const opacity = Math.random() * 0.4 + 0.2;

  particle.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    left: ${left}%;
    animation-delay: ${delay}s;
    animation-duration: ${duration}s;
    opacity: ${opacity};
  `;

  elements.particlesContainer.appendChild(particle);

  // Remove and recreate particle after animation
  setTimeout(() => {
    particle.remove();
    createBackgroundParticle();
  }, (delay + duration) * 1000);
}

// ============================================
// RIPPLE EFFECT FOR BUTTONS
// ============================================
function initRippleEffect() {
  const rippleElements = document.querySelectorAll('[data-ripple]');

  rippleElements.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Create ripple element
      const ripple = document.createElement('span');
      ripple.className = 'ripple-wave';
      ripple.style.cssText = `
        position: absolute;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%);
        border-radius: 50%;
        left: ${x - 10}px;
        top: ${y - 10}px;
        pointer-events: none;
        animation: ripple-expand 0.6s ease-out forwards;
      `;

      this.appendChild(ripple);

      // Add active class for CSS ripple
      this.classList.add('ripple-active');

      setTimeout(() => {
        ripple.remove();
        this.classList.remove('ripple-active');
      }, 600);
    });
  });
}

// Add ripple expand animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes ripple-expand {
    0% {
      transform: scale(0);
      opacity: 0.8;
    }
    100% {
      transform: scale(15);
      opacity: 0;
    }
  }
`;
document.head.appendChild(rippleStyle);

// ============================================
// PARALLAX BACKGROUND ON MOUSE MOVE
// ============================================
function initParallaxBackground() {
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  if (isTouchDevice) return;

  const blobs = document.querySelectorAll('.gradient-blob');
  let rafId = null;
  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;

  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  function updateParallax() {
    currentX = lerp(currentX, mouseX, 0.05);
    currentY = lerp(currentY, mouseY, 0.05);

    blobs.forEach((blob, index) => {
      const speed = (index + 1) * 15;
      const x = currentX * speed;
      const y = currentY * speed;
      blob.style.transform = `translate(${x}px, ${y}px) scale(${1 + index * 0.05})`;
    });

    rafId = requestAnimationFrame(updateParallax);
  }

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

    if (!rafId) {
      rafId = requestAnimationFrame(updateParallax);
    }
  });

  // Start animation
  rafId = requestAnimationFrame(updateParallax);
}

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);

  // Observe all cards
  document.querySelectorAll('.skill-card, .portfolio-card, .contact-card').forEach(card => {
    observer.observe(card);
  });
}

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      navbar.style.background = 'rgba(11, 11, 11, 0.9)';
      navbar.style.backdropFilter = 'blur(25px)';
    } else {
      navbar.style.background = 'rgba(11, 11, 11, 0.7)';
      navbar.style.backdropFilter = 'blur(20px)';
    }

    lastScroll = currentScroll;
  }, { passive: true });
}

// ============================================
// BUTTON CLICK HANDLERS
// ============================================
function initButtonHandlers() {
  // CV Download button
  const cvBtn = document.getElementById('cv-btn');
  if (cvBtn) {
    cvBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showNotification('CV download coming soon!');
    });
  }

  // Portfolio buttons
  document.querySelectorAll('.btn-portfolio').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (btn.textContent.includes('Coming Soon')) {
        e.preventDefault();
        showNotification('Project coming soon!');
      }
    });
  });
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================
function showNotification(message) {
  // Remove existing notification
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background: linear-gradient(135deg, #7b2cff, #4a8dff);
    color: white;
    padding: 14px 28px;
    border-radius: 50px;
    font-size: 0.95rem;
    font-weight: 500;
    box-shadow: 0 10px 30px rgba(123, 44, 255, 0.4);
    z-index: 10000;
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  `;

  document.body.appendChild(notification);

  // Animate in
  requestAnimationFrame(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(-50%) translateY(0)';
  });

  // Remove after delay
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(-50%) translateY(100px)';
    setTimeout(() => notification.remove(), 400);
  }, 2500);
}

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
function initPerformanceOptimizations() {
  // Use passive event listeners for scroll
  window.addEventListener('scroll', () => {}, { passive: true });

  // Throttle resize events
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Recalculate any dimension-dependent values
    }, 250);
  }, { passive: true });

  // Pause animations when tab is hidden
  document.addEventListener('visibilitychange', () => {
    document.body.style.animationPlayState = document.hidden ? 'paused' : 'running';
  });
}

// ============================================
// INITIALIZATION
// ============================================
function init() {
  // Initialize all features
  initSectionSwitching();
  initTypingAnimation();
  initProfileTilt();
  initCardTilt();
  initBackgroundParticles();
  initRippleEffect();
  initParallaxBackground();
  initScrollAnimations();
  initNavbarScroll();
  initButtonHandlers();
  initPerformanceOptimizations();

  // Set initial active section
  elements.sections[0]?.classList.add('active');
  elements.navButtons[0]?.classList.add('active');

  console.log('🚀 Portfolio initialized successfully!');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// ============================================
// EXPORT FOR TESTING (if needed)
// ============================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CONFIG, init };
}
