/**
 * Mugen LLC Luxury Animations
 * ==========================
 * Handle all animations, interactions, and UI behavior
 */

class LuxuryAnimations {
  constructor() {
    // Initialize properties
    this.initialized = false;
    this.scrollTriggers = [];
    this.header = document.querySelector('.header');
    this.loader = document.querySelector('.loader');
    this.navLinks = document.querySelectorAll('.nav-item a');
    this.menuTrigger = document.querySelector('.menu-trigger');
    this.nav = document.querySelector('.nav');
    this.faqItems = document.querySelectorAll('.faq-question');
    this.contactForm = document.getElementById('contactForm');
    this.pageLinks = document.querySelectorAll('a[href^="/"]:not([href*="#"]):not([target="_blank"])');
    this.magneticElements = document.querySelectorAll('.btn-magnetic');

    // Initialize
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeAnimations());
    } else {
      this.initializeAnimations();
    }
  }


  initializeAnimations() {
    if (this.initialized) return;
    this.initialized = true;

    // Initialize all animation components
    this.setupLoader();
    this.setupHeaderScroll();  // ヘッダーを最初に初期化
    this.setupScrollAnimations();
    this.setupMobileMenu();
    this.setupFaqAccordion();
    this.setupContactForm();
    this.setupPageTransitions();
    this.setupMagneticEffect();
    this.setupCounterAnimations();
    this.setupTextSplitting();
    this.setupScrollIndicator();
    this.setupCustomCursor();

    // Check if the page was reloaded mid-scroll
    // This ensures elements are visible if user refreshes the page while scrolled down
    this.handleScroll();

    // Setup scroll event listener
    window.addEventListener('scroll', this.handleScroll.bind(this));

    // Setup resize event listener
    window.addEventListener('resize', this.handleResize.bind(this));

    console.log('Luxury Animations initialized successfully');
  }

  setupLoader() {
    if (!this.loader) return;

    // Hide loader after page loaded
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.loader.classList.add('hidden');

        // Enable scroll after loader is hidden
        document.body.style.overflow = '';

        // Trigger initial animations
        this.revealInitialAnimations();
      }, 1000);
    });

    // Disable scroll during loading
    document.body.style.overflow = 'hidden';
  }

  revealInitialAnimations() {
    // Animate hero content if it exists
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      heroContent.classList.add('visible');
    }

    // Animate page title if it exists
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) {
      pageTitle.classList.add('visible');
    }

    // Check for elements in the initial viewport
    this.checkScrollTriggers();
  }

  setupScrollAnimations() {
    // Get all animated elements
    const animatedElements = document.querySelectorAll(
      '.fade-in, .fade-up, .fade-down, .fade-left, .fade-right, ' +
      '.scale-in, .text-reveal, .image-reveal, .staggered-grid, ' +
      '.timeline, .counter-wrapper, .split-heading'
    );

    // Create scroll triggers for each element
    animatedElements.forEach(element => {
      this.scrollTriggers.push({
        element,
        triggered: false,
        position: this.getElementPosition(element)
      });
    });
  }

  handleScroll() {
    // Update header class
    this.updateHeaderOnScroll();

    // Check and trigger animations
    this.checkScrollTriggers();
  }

  handleResize() {
    // Recalculate element positions on resize
    this.scrollTriggers.forEach(trigger => {
      trigger.position = this.getElementPosition(trigger.element);
    });

    // Check scroll triggers after resize
    this.checkScrollTriggers();
  }

  getElementPosition(element) {
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top + window.scrollY,
      bottom: rect.bottom + window.scrollY,
      height: rect.height
    };
  }

  checkScrollTriggers() {
    // Get current scroll position
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    // Check each trigger
    this.scrollTriggers.forEach(trigger => {
      if (trigger.triggered) return;

      // Calculate trigger position (15% from the bottom of the viewport)
      const triggerPosition = scrollY + windowHeight * 0.85;

      // Check if element is in view
      if (triggerPosition > trigger.position.top) {
        trigger.element.classList.add('visible');
        trigger.triggered = true;

        // Check for child elements that need animation
        const gridItems = trigger.element.querySelectorAll('.grid-item');
        if (gridItems.length) {
          gridItems.forEach(item => item.classList.add('visible'));
        }
      }
    });
  }

  updateHeaderOnScroll() {
    if (!this.header) return;

    // Add scrolled class when scrolled down
    if (window.scrollY > 50) {
      this.header.classList.add('header-scrolled');
    } else {
      this.header.classList.remove('header-scrolled');
    }
  }

  setupHeaderScroll() {
    if (!this.header) return;

    // Initialize header state
    this.updateHeaderOnScroll();

    // Add event listener for scroll
    window.addEventListener('scroll', () => this.updateHeaderOnScroll());
  }

  // luxury-animations.js の setupMobileMenu() 関数を
  // この内容に置き換えてください

  setupMobileMenu() {
    const menuTrigger = document.querySelector('.menu-trigger');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-item a');

    if (!menuTrigger || !nav) return;

    // メニュークリック処理
    menuTrigger.addEventListener('click', () => {
      const isActive = menuTrigger.classList.contains('active');

      if (isActive) {
        // メニューを閉じる
        menuTrigger.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
      } else {
        // メニューを開く
        menuTrigger.classList.add('active');
        nav.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });

    // ナビリンククリック時にメニューを閉じる
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuTrigger.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  setupFaqAccordion() {
    if (!this.faqItems.length) return;

    this.faqItems.forEach(question => {
      question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const isOpen = question.classList.contains('active');

        // Close all FAQs
        this.faqItems.forEach(item => {
          if (item !== question) {
            item.classList.remove('active');
            if (item.nextElementSibling) {
              item.nextElementSibling.style.maxHeight = null;
            }
          }
        });

        // Toggle clicked FAQ
        if (isOpen) {
          question.classList.remove('active');
          answer.style.maxHeight = null;
        } else {
          question.classList.add('active');
          answer.style.maxHeight = `${answer.scrollHeight}px`;
        }
      });

      // Keyboard accessibility
      question.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          question.click();
        }
      });
    });
  }

  setupContactForm() {
    // Disabled to allow Netlify Forms to handle submission natively
    return;

    /* Original code commented out for Netlify Forms compatibility
    if (!this.contactForm) return;

    this.contactForm.addEventListener('submit', e => {
      e.preventDefault();

      // Validate form
      const isValid = this.contactForm.checkValidity();

      if (isValid) {
        const submitButton = this.contactForm.querySelector('button[type="submit"]');
        if (!submitButton) return;

        // Update button state
        submitButton.disabled = true;
        submitButton.textContent = '送信中...';

        // Simulate API call (replace with actual API call)
        setTimeout(() => {
          // Success handling
          this.contactForm.reset();
          submitButton.textContent = '送信完了';

          // Show success message
          const successMessage = document.createElement('div');
          successMessage.className = 'form-success-message fade-in';
          successMessage.textContent = 'お問い合わせありがとうございます。担当者より折り返しご連絡いたします。';

          // Remove previous messages
          const previousMessage = this.contactForm.querySelector('.form-success-message');
          if (previousMessage) {
            previousMessage.remove();
          }

          this.contactForm.appendChild(successMessage);

          // Reset button after delay
          setTimeout(() => {
            submitButton.disabled = false;
            submitButton.textContent = '送信する';
          }, 3000);
        }, 1500);
      } else {
        // Highlight invalid fields
        const invalidFields = this.contactForm.querySelectorAll(':invalid');
        invalidFields.forEach(field => {
          field.classList.add('invalid');

          // Remove invalid class on input
          field.addEventListener('input', () => {
            if (field.validity.valid) {
              field.classList.remove('invalid');
            }
          });
        });
      }
    });
    */
  }

  setupPageTransitions() {
    if (!this.pageLinks.length) return;

    // Create transition element if not exists
    let transition = document.querySelector('.page-transition');
    if (!transition) {
      transition = document.createElement('div');
      transition.classList.add('page-transition');
      document.body.appendChild(transition);
    }

    // Add click handler to links
    this.pageLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const target = link.getAttribute('href');

        // Animate transition
        transition.classList.add('active');

        // Navigate after animation
        setTimeout(() => {
          window.location.href = target;
        }, 800);
      });
    });

    // Add transition class on page load if coming from another page
    if (document.referrer.includes(window.location.hostname)) {
      transition.classList.add('active');

      // Remove transition class after animation
      setTimeout(() => {
        transition.classList.add('exit');

        // Reset transition after exit animation
        setTimeout(() => {
          transition.classList.remove('active', 'exit');
        }, 800);
      }, 100);
    }
  }

  setupMagneticEffect() {
    if (!this.magneticElements.length) return;

    this.magneticElements.forEach(element => {
      // Skip if device doesn't support hover
      if (window.matchMedia('(hover: none)').matches) return;

      // Element dimensions and position
      let rect = element.getBoundingClientRect();

      // Update dimensions on resize
      window.addEventListener('resize', () => {
        rect = element.getBoundingClientRect();
      });

      // Calculate button center
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Track mouse position
      element.addEventListener('mousemove', e => {
        // Distance from center
        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;

        // Calculate movement (stronger near center, weaker at edges)
        const strength = 0.3;
        const moveX = distanceX * strength;
        const moveY = distanceY * strength;

        // Apply transform
        element.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });

      // Reset position on mouse leave
      element.addEventListener('mouseleave', () => {
        element.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  setupCounterAnimations() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    counters.forEach(counter => {
      // Get target value
      const target = parseInt(counter.getAttribute('data-target') || 0, 10);

      // Create counter animation trigger
      this.scrollTriggers.push({
        element: counter.parentElement || counter,
        triggered: false,
        position: this.getElementPosition(counter.parentElement || counter),
        callback: () => this.animateCounter(counter, target)
      });
    });
  }

  animateCounter(counter, target) {
    // Starting value
    let count = 0;

    // Calculate increment
    const duration = 2000; // milliseconds
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    const increment = target / totalFrames;

    // Animate counter
    const timer = setInterval(() => {
      count += increment;

      // Update counter value
      if (target < 10) {
        // For decimal values
        counter.textContent = Math.min(count, target).toFixed(1);
      } else {
        // For integer values
        counter.textContent = Math.floor(Math.min(count, target));
      }

      // Stop animation when target reached
      if (count >= target) {
        clearInterval(timer);
        counter.textContent = target;
      }
    }, frameDuration);
  }

  setupTextSplitting() {
    const splitHeadings = document.querySelectorAll('.split-heading');
    if (!splitHeadings.length) return;

    splitHeadings.forEach(heading => {
      // Skip if already processed
      if (heading.getAttribute('data-split') === 'true') return;

      // Get text content
      const text = heading.textContent;

      // Clear existing content
      heading.innerHTML = '';

      // Split text into characters and wrap each in a span
      [...text].forEach(char => {
        if (char === ' ') {
          heading.innerHTML += ' ';
        } else {
          heading.innerHTML += `<span class="char">${char}</span>`;
        }
      });

      // Mark as processed
      heading.setAttribute('data-split', 'true');
    });
  }

  setupScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (!scrollIndicator) return;

    // Show scroll indicator
    setTimeout(() => {
      scrollIndicator.style.opacity = '1';
    }, 1000);

    // Scroll to content when clicked
    scrollIndicator.addEventListener('click', () => {
      const firstSection = document.querySelector('.section');
      if (firstSection) {
        const offset = firstSection.offsetTop - 100;
        window.scrollTo({
          top: offset,
          behavior: 'smooth'
        });
      }
    });
  }

  setupCustomCursor() {
    // Check if device supports hover
   /* if (window.matchMedia('(hover: none)').matches) */return;

    // Create cursor elements
    const cursorOuter = document.createElement('div');
    cursorOuter.className = 'cursor-outer';

    const cursorInner = document.createElement('div');
    cursorInner.className = 'cursor-inner';

    // Append to body
    document.body.appendChild(cursorOuter);
    document.body.appendChild(cursorInner);

    // Track cursor position
    document.addEventListener('mousemove', e => {
      // Update cursor position
      cursorOuter.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      cursorInner.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });

    // Add hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn, input, textarea, select, .card, .faq-question');

    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        cursorOuter.classList.add('cursor-grow');
      });

      element.addEventListener('mouseleave', () => {
        cursorOuter.classList.remove('cursor-grow');
      });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      cursorOuter.style.display = 'none';
      cursorInner.style.display = 'none';
    });

    document.addEventListener('mouseenter', () => {
      cursorOuter.style.display = 'block';
      cursorInner.style.display = 'block';
    });
  }
}

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
  const luxuryAnimations = new LuxuryAnimations();
});
