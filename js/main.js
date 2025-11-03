/**
 * Mugen LLC Main JavaScript
 * ========================
 * Main script for the Mugen LLC website
 */

/**
 * LuxurySite class - Main controller for the site
 */
class LuxurySite {
  constructor() {
    // Initialize properties
    this.initialized = false;

    // Initialize
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeSite());
    } else {
      this.initializeSite();
    }

    // Initialize polyfills
    this.initPolyfills();
  }

  initializeSite() {
    if (this.initialized) return;
    this.initialized = true;

    console.log('Mugen LLC Luxury Site Initialized');

    // Initialize global site features
    this.setupUtilities();
    this.setupAccessibility();
    this.setupForms();
    this.setupAnalytics();
  }

  initPolyfills() {
    // Polyfill for smooth scrolling in older browsers
    if (!('scrollBehavior' in document.documentElement.style)) {
      import('https://cdnjs.cloudflare.com/ajax/libs/smoothscroll-polyfill/0.4.4/smoothscroll.min.js')
        .then(() => {
          window.__forceSmoothScrollPolyfill__ = true;
          window.scrollTo({ top: window.scrollY });
        });
    }

    // Polyfill for IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      import('https://cdnjs.cloudflare.com/ajax/libs/intersection-observer/0.12.0/intersection-observer.min.js');
    }
  }

  setupUtilities() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          // Calculate offset considering fixed header
          const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
          const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

          // Smooth scroll to target
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Update URL hash
          history.pushState(null, null, targetId);
        }
      });
    });

    // Handle back/forward browser navigation
    window.addEventListener('popstate', () => {
      if (window.location.hash) {
        const targetElement = document.querySelector(window.location.hash);
        if (targetElement) {
          const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
          const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      } else {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    });

    // Create image placeholder loader for lazy-loaded images
    this.setupImagePlaceholders();
  }

  setupImagePlaceholders() {
    // Find image placeholders
    const placeholders = document.querySelectorAll('.img-placeholder');

    placeholders.forEach(placeholder => {
      // Get specified image path
      const imagePath = placeholder.getAttribute('data-src');
      if (!imagePath) return;

      // Create image element
      const img = new Image();

      // Set up image load event
      img.onload = function () {
        // Replace placeholder with actual image
        const imageElement = document.createElement('img');
        imageElement.src = imagePath;
        imageElement.alt = placeholder.getAttribute('data-alt') || '';
        imageElement.className = 'loaded-image';

        // Add any additional classes
        const classes = placeholder.getAttribute('data-class');
        if (classes) {
          classes.split(' ').forEach(cls => {
            if (cls) imageElement.classList.add(cls);
          });
        }

        // Replace placeholder with image
        placeholder.parentNode.replaceChild(imageElement, placeholder);
      };

      // Set image source to start loading
      img.src = imagePath;
    });
  }

  setupAccessibility() {
    // Focus trap for modals
    document.querySelectorAll('[data-modal]').forEach(modal => {
      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length) {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Trap focus within modal
        modal.addEventListener('keydown', e => {
          if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        });
      }
    });

    // Skip to content link
    /*
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'コンテンツにスキップ';
    document.body.insertBefore(skipLink, document.body.firstChild);
    */

    // Add main ID if not present
    const mainContent = document.querySelector('main');
    if (mainContent && !mainContent.id) {
      mainContent.id = 'main';
    }

    // Add proper ARIA attributes to interactive elements
    document.querySelectorAll('.faq-question').forEach(question => {
      const answer = question.nextElementSibling;
      const id = `faq-${Math.random().toString(36).substring(2, 9)}`;

      question.setAttribute('aria-expanded', 'false');
      question.setAttribute('aria-controls', id);
      answer.id = id;

      question.addEventListener('click', () => {
        const expanded = question.getAttribute('aria-expanded') === 'true';
        question.setAttribute('aria-expanded', (!expanded).toString());
      });
    });
  }

  setupForms() {
    // Form validation enhancement
    document.querySelectorAll('form').forEach(form => {
      // Add custom validation messages
      const inputs = form.querySelectorAll('input, textarea, select');

      inputs.forEach(input => {
        // Skip if already has a message
        if (input.dataset.validationMessage) return;

        // Set custom validation message based on type
        if (input.required) {
          if (input.type === 'email') {
            input.dataset.validationMessage = '有効なメールアドレスを入力してください。';
          } else {
            input.dataset.validationMessage = 'この項目は必須です。';
          }
        }

        // Show validation message on invalid input
        input.addEventListener('invalid', e => {
          e.preventDefault();

          // Create or update validation message
          let message = input.nextElementSibling;
          if (!message || !message.classList.contains('validation-message')) {
            message = document.createElement('div');
            message.className = 'validation-message';
            input.parentNode.insertBefore(message, input.nextElementSibling);
          }

          message.textContent = input.dataset.validationMessage || input.validationMessage;
          input.classList.add('invalid');
        });

        // Clear validation message on input
        input.addEventListener('input', () => {
          const message = input.nextElementSibling;
          if (message && message.classList.contains('validation-message')) {
            message.textContent = '';
          }

          if (input.validity.valid) {
            input.classList.remove('invalid');
          }
        });
      });
    });
  }

  setupAnalytics() {
    // Track page views
    this.trackPageView();

    // Track events
    this.setupEventTracking();
  }

  trackPageView() {
    // Simple page view tracking (replace with your analytics solution)
    const pageData = {
      title: document.title,
      url: window.location.href,
      referrer: document.referrer,
      timestamp: new Date().toISOString()
    };

    // Log page view (replace with actual analytics call)
    console.debug('Page View:', pageData);
  }

  setupEventTracking() {
    // Track form submissions
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', () => {
        // Log form submission (replace with actual analytics call)
        console.debug('Form Submitted:', {
          formId: form.id || 'unknown',
          formAction: form.action,
          timestamp: new Date().toISOString()
        });
      });
    });

    // Track link clicks
    document.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        // Skip for same-page links
        if (link.getAttribute('href')?.startsWith('#')) return;

        // Log link click (replace with actual analytics call)
        console.debug('Link Clicked:', {
          text: link.textContent?.trim(),
          href: link.href,
          timestamp: new Date().toISOString()
        });
      });
    });

    // Track button clicks
    document.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', () => {
        // Log button click (replace with actual analytics call)
        console.debug('Button Clicked:', {
          text: button.textContent?.trim(),
          id: button.id || 'unknown',
          timestamp: new Date().toISOString()
        });
      });
    });
  }
}

// Initialize site
document.addEventListener('DOMContentLoaded', () => {
  window.luxurySite = new LuxurySite();
});

// Add script load event for external scripts
window.addEventListener('load', () => {
  // Check if all scripts are loaded
  if (typeof THREE === 'undefined') {
    console.warn('THREE.js is not loaded. Some visual effects may not work properly.');
  }
});
