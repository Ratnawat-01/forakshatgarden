document.addEventListener('DOMContentLoaded', () => {
  initNavbarTransition();
  initDependentAnimations(); // Must run BEFORE initScrollAnimations
  initScrollAnimations();
  initTypewriterEffect();
});

/* =========================================
   1. SCROLL ANIMATIONS (Intersection Observer)
   ========================================= */
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1 // Trigger slightly earlier
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add a small random delay for natural feel if no specific delay is set
        if (!entry.target.style.transitionDelay) {
          // No random delay, strict scroll trigger
        }

        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  animatedElements.forEach(el => observer.observe(el));
}

/* =========================================
   2. NAVBAR TRANSITION
   ========================================= */
function initNavbarTransition() {
  const navbar = document.querySelector('#mainNav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      navbar.classList.add('navbar-shrink');
    } else {
      navbar.classList.remove('navbar-shrink');
    }
  });
}

/* =========================================
   3. LAZY LOAD & DEPENDENCIES
   ========================================= */
function initDependentAnimations() {
  // 1. Stagger GALLERY Grid
  const galleryItems = document.querySelectorAll('.gallery-grid img');
  galleryItems.forEach((item, index) => {
    item.classList.add('animate-on-scroll', 'anim-scale');
    // Stagger based on column index (approx 4 columns)
    // This makes them cascade: 0ms, 100ms, 200ms, 300ms, then reset
    const delay = (index % 4) * 100;
    item.style.transitionDelay = `${delay}ms`;
  });

  // 2. Stagger AMENITIES Grid (if they don't have delays yet)
  const amenityCards = document.querySelectorAll('.amenities-grid .amenity-card');
  amenityCards.forEach((card, index) => {
    // Ensure they have base classes
    card.classList.add('animate-on-scroll', 'anim-scale', 'card-hover-effect');

    // Cascading delay (row by row feel)
    const delay = (index % 3) * 150;
    card.style.transitionDelay = `${delay}ms`;
  });
}

/* =========================================
   4. STICKY CTA (Mobile Only)
   ========================================= */

/* =========================================
   5. SMOOTH TEXT REVEAL
   ========================================= */
function initTypewriterEffect() {
  const element = document.getElementById('typewriter-text');
  if (!element) return;

  // 1. Get the full text
  const rawText = element.innerText;
  if (!rawText) return;

  // 2. Clear content
  element.innerText = '';

  // 3. Split into words
  const words = rawText.split(' ');

  let globalCharIndex = 0; // To keep the staggering continuous across words

  words.forEach((word, wordIndex) => {
    // Create a wrapper for the word to keep letters together
    const wordSpan = document.createElement('span');
    wordSpan.className = 'word-wrapper';

    // Split word into chars
    const chars = Array.from(word);

    chars.forEach((char) => {
      const charSpan = document.createElement('span');
      charSpan.textContent = char;
      charSpan.className = 'char-reveal';

      // Cascading delay based on global character count
      const delay = 300 + (globalCharIndex * 40);
      charSpan.style.animationDelay = `${delay}ms`;

      wordSpan.appendChild(charSpan);
      globalCharIndex++;
    });

    element.appendChild(wordSpan);

    // Add space after word (except the last one)
    if (wordIndex < words.length - 1) {
      const space = document.createTextNode(' ');
      element.appendChild(space);
      // Increment index for the space too so timing feels natural
      globalCharIndex++;
    }
  });
}
