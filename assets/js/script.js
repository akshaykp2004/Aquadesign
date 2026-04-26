/* ============================================
   AQUASCAPING & CUSTOM AQUARIUM DESIGN
   Master JavaScript File
   ============================================ */

// ============================================
// 1. THEME MANAGEMENT (Dark/Light Mode)
// ============================================

class ThemeManager {
  constructor() {
    this.prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.theme = localStorage.getItem('theme') || (this.prefersDark ? 'dark' : 'light');
    this.init();
  }

  init() {
    this.applyTheme(this.theme);
    this.attachListeners();
  }

  applyTheme(theme) {
    const html = document.documentElement;
    html.setAttribute('data-theme', theme);
    this.theme = theme;
    localStorage.setItem('theme', theme);
    this.updateToggleIcon();
  }

  toggleTheme() {
    const newTheme = this.theme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
  }

  updateToggleIcon() {
    const toggles = document.querySelectorAll('.theme-toggle');
    const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;
    const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
    
    toggles.forEach(toggle => {
      toggle.innerHTML = this.theme === 'dark' ? sunIcon : moonIcon;
    });
    console.log(`Theme updated to: ${this.theme}`);
  }

  attachListeners() {
    const themeToggles = document.querySelectorAll('.theme-toggle');
    themeToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleTheme();
      });
    });
  }
}

// ============================================
// 2. RTL SUPPORT MANAGEMENT
// ============================================

class RTLManager {
  constructor() {
    this.isRTL = localStorage.getItem('rtl') === 'true';
    this.init();
  }

  init() {
    this.applyRTL(this.isRTL);
    this.attachListeners();
  }

  applyRTL(isRTL) {
    const html = document.documentElement;
    if (isRTL) {
      html.setAttribute('dir', 'rtl');
      document.body.style.direction = 'rtl';
    } else {
      html.removeAttribute('dir');
      document.body.style.direction = 'ltr';
    }
    this.isRTL = isRTL;
    localStorage.setItem('rtl', isRTL);
    this.updateToggleIcon();
  }

  toggleRTL() {
    this.applyRTL(!this.isRTL);
  }

  updateToggleIcon() {
    const toggle = document.querySelector('.rtl-toggle');
    if (toggle) {
      toggle.textContent = this.isRTL ? 'LTR' : 'RTL';
      toggle.style.fontSize = '0.8rem'; // Slightly smaller font for text labels
      toggle.style.fontWeight = '700';
    }
  }

  attachListeners() {
    const rtlToggle = document.querySelector('.rtl-toggle');
    if (rtlToggle) {
      rtlToggle.addEventListener('click', () => this.toggleRTL());
    }
  }
}

// ============================================
// 3. NAVIGATION & SMOOTH SCROLLING
// ============================================

class Navigation {
  constructor() {
    this.init();
  }

  init() {
    this.setupSmoothScroll();
    this.setupNavActiveState();
  }

  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          // Close mobile menu if open
          const navbarCollapse = document.querySelector('.navbar-collapse');
          if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            const toggler = document.querySelector('.navbar-toggler');
            toggler.click();
          }
        }
      });
    });
  }

  setupNavActiveState() {
    const navLinks = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
      let current = '';
      const sections = document.querySelectorAll('section[id]');
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 200) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    });
  }
}

// ============================================
// 4. INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================

class AnimationObserver {
  constructor() {
    this.init();
  }

  init() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all elements with animation classes
    document.querySelectorAll('[class*="fade-in"]').forEach(el => {
      observer.observe(el);
    });
  }
}

// ============================================
// 5. FORM HANDLING
// ============================================

class FormHandler {
  constructor() {
    this.init();
  }

  init() {
    this.setupContactForm();
    this.setupDashboardForms();
  }

  setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        
        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
          // Show success message
          const successMsg = document.createElement('div');
          successMsg.className = 'alert alert-success';
          successMsg.textContent = '✓ Thank you! We\'ll get back to you soon.';
          contactForm.insertBefore(successMsg, contactForm.firstChild);

          contactForm.reset();
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;

          setTimeout(() => successMsg.remove(), 5000);
        }, 1500);
      });
    }
  }

  setupDashboardForms() {
    const tankForm = document.getElementById('tankForm');
    if (tankForm) {
      tankForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(tankForm);
        this.showDashboardSuccess('Tank dimensions submitted successfully!');
        tankForm.reset();
      });
    }

    const schedulerForm = document.getElementById('schedulerForm');
    if (schedulerForm) {
      schedulerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(schedulerForm);
        this.showDashboardSuccess('Installation scheduled successfully!');
        schedulerForm.reset();
      });
    }
  }

  showDashboardSuccess(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-success alert-dismissible fade show';
    alert.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    const mainContent = document.querySelector('.dashboard-main');
    if (mainContent) {
      mainContent.insertBefore(alert, mainContent.firstChild);
    }
    setTimeout(() => alert.remove(), 4000);
  }
}

// ============================================
// 6. CAROUSEL / TESTIMONIALS SLIDER
// ============================================

class TestimonialSlider {
  constructor() {
    this.currentIndex = 0;
    this.init();
  }

  init() {
    const slider = document.querySelector('[data-testimonial-slider]');
    if (!slider) return;

    this.slides = slider.querySelectorAll('[data-testimonial-slide]');
    this.totalSlides = this.slides.length;

    if (this.totalSlides <= 1) return;

    this.createControls(slider);
    this.startAutoSlide();
    this.showSlide(0);
  }

  createControls(container) {
    const controls = document.createElement('div');
    controls.className = 'testimonial-controls';

    for (let i = 0; i < this.totalSlides; i++) {
      const dot = document.createElement('button');
      dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dot.addEventListener('click', () => {
        this.currentIndex = i;
        this.showSlide(i);
      });
      controls.appendChild(dot);
    }

    container.appendChild(controls);
  }

  showSlide(index) {
    this.slides.forEach((slide, i) => {
      slide.style.opacity = i === index ? '1' : '0';
      slide.style.position = i === index ? 'relative' : 'absolute';
      slide.style.visibility = i === index ? 'visible' : 'hidden';
      slide.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    });

    document.querySelectorAll('.testimonial-dot').forEach((dot, i) => {
      if (i === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  startAutoSlide() {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
      this.showSlide(this.currentIndex);
    }, 5000);
  }
}

// ============================================
// 7. DASHBOARD FUNCTIONALITY
// ============================================

class DashboardManager {
  constructor() {
    this.currentTab = 'overview';
    this.init();
  }

  init() {
    this.setupDashboardTabs();
    this.generateMockChart();
  }

  setupDashboardTabs() {
    const sidebarLinks = document.querySelectorAll('[data-dashboard-tab]');
    sidebarLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tabName = link.getAttribute('data-dashboard-tab');
        this.switchTab(tabName);
      });
    });
  }

  switchTab(tabName) {
    // Update active link
    document.querySelectorAll('[data-dashboard-tab]').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-dashboard-tab') === tabName) {
        link.classList.add('active');
      }
    });

    // Update content visibility
    document.querySelectorAll('[data-dashboard-content]').forEach(content => {
      content.style.display = content.getAttribute('data-dashboard-content') === tabName ? 'block' : 'none';
    });

    this.currentTab = tabName;
  }

  generateMockChart() {
    const chartContainer = document.querySelector('[data-mock-chart]');
    if (!chartContainer) return;

    // Simple bar chart mock
    const data = [
      { label: 'Week 1', value: 30 },
      { label: 'Week 2', value: 55 },
      { label: 'Week 3', value: 75 },
      { label: 'Week 4', value: 90 }
    ];

    const html = data.map(item => `
      <div style="margin-bottom: 15px;">
        <div style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 5px;">
          ${item.label}
        </div>
        <div style="background: var(--border-color); height: 30px; border-radius: 5px; overflow: hidden;">
          <div style="background: linear-gradient(90deg, #2EC4B6, #6eddd8); height: 100%; width: ${item.value}%; transition: width 0.5s ease;"></div>
        </div>
        <div style="font-weight: 600; color: var(--text-primary); margin-top: 5px; text-align: right;">
          ${item.value}%
        </div>
      </div>
    `).join('');

    chartContainer.innerHTML = html;
  }
}

// ============================================
// 8. GALLERY LIGHTBOX
// ============================================

class GalleryLightbox {
  constructor() {
    this.currentIndex = 0;
    this.images = [];
    this.init();
  }

  init() {
    this.setupGalleryItems();
  }

  setupGalleryItems() {
    const galleryItems = document.querySelectorAll('[data-gallery-item]');
    if (galleryItems.length === 0) return;

    galleryItems.forEach((item, index) => {
      item.style.cursor = 'pointer';
      item.addEventListener('click', () => this.openLightbox(index, galleryItems));
    });
  }

  openLightbox(index, items) {
    this.currentIndex = index;
    this.images = Array.from(items);

    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.95);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    `;

    const img = items[index].querySelector('img');
    const imgClone = img.cloneNode();
    imgClone.style.cssText = 'max-width: 90%; max-height: 90%; border-radius: 10px;';

    const close = document.createElement('button');
    close.textContent = '✕';
    close.style.cssText = `
      position: absolute;
      top: 20px;
      right: 30px;
      background: none;
      border: none;
      color: white;
      font-size: 2rem;
      cursor: pointer;
      z-index: 10001;
    `;
    close.addEventListener('click', () => lightbox.remove());

    const prev = document.createElement('button');
    prev.textContent = '‹';
    prev.style.cssText = `
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      font-size: 2rem;
      padding: 10px 15px;
      cursor: pointer;
      border-radius: 5px;
      z-index: 10001;
    `;
    prev.addEventListener('click', () => {
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
      this.updateLightbox(lightbox, imgClone);
    });

    const next = document.createElement('button');
    next.textContent = '›';
    next.style.cssText = `
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      font-size: 2rem;
      padding: 10px 15px;
      cursor: pointer;
      border-radius: 5px;
      z-index: 10001;
    `;
    next.addEventListener('click', () => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
      this.updateLightbox(lightbox, imgClone);
    });

    lightbox.appendChild(imgClone);
    lightbox.appendChild(close);
    lightbox.appendChild(prev);
    lightbox.appendChild(next);
    document.body.appendChild(lightbox);

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') lightbox.remove();
    });
  }

  updateLightbox(lightbox, imgElement) {
    const newImg = this.images[this.currentIndex].querySelector('img').cloneNode();
    newImg.style.cssText = 'max-width: 90%; max-height: 90%; border-radius: 10px;';
    imgElement.replaceWith(newImg);
  }
}

// ============================================
// 9. LAZY LOADING IMAGES
// ============================================

class LazyLoadImages {
  constructor() {
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }
}

// ============================================
// 10. SCROLL ANIMATIONS STAGGER
// ============================================

class ScrollAnimation {
  constructor() {
    this.init();
  }

  init() {
    const style = document.createElement('style');
    style.textContent = `
      [class*="fade-in"] {
        opacity: 0;
        animation: fadeIn 0.6s ease-out forwards;
      }
      
      [class*="fade-in-up"] {
        animation-name: fadeInUp;
      }
      
      [class*="fade-in-left"] {
        animation-name: fadeInLeft;
      }
      
      [class*="fade-in-right"] {
        animation-name: fadeInRight;
      }
      
      @keyframes fadeIn {
        to { opacity: 1; }
      }
      
      @keyframes fadeInUp {
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes fadeInLeft {
        to { opacity: 1; transform: translateX(0); }
      }
      
      @keyframes fadeInRight {
        to { opacity: 1; transform: translateX(0); }
      }
    `;
    document.head.appendChild(style);

    // Stagger animations on elements with data-stagger
    const staggerElements = document.querySelectorAll('[data-stagger]');
    staggerElements.forEach((el, index) => {
      el.style.animationDelay = (index * 0.1) + 's';
    });
  }
}

// ============================================
// 11. SMOOTH PAGE TRANSITIONS
// ============================================

class PageTransition {
  constructor() {
    this.init();
  }

  init() {
    // Add fade-in on page load
    window.addEventListener('load', () => {
      document.body.style.animation = 'fadeIn 0.5s ease-in-out';
    });

    // Handle internal links
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
      link.addEventListener('click', (e) => {
        // Allow default behavior for now
        // In a real SPA, you'd handle this with AJAX
      });
    });
  }
}

// ============================================
// 12. FAQ ACCORDION
// ============================================

class FAQAccordion {
  constructor() {
    this.init();
  }

  init() {
    const faqItems = document.querySelectorAll('[data-faq-item]');
    if (faqItems.length === 0) return;

    faqItems.forEach(item => {
      const toggle = item.querySelector('[data-faq-toggle]');
      toggle.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other items
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
        });

        // Toggle current item
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  }
}

// ============================================
// 13. UTILITY FUNCTIONS
// ============================================

const Utils = {
  // Debounce function
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Add animation delay to elements
  addAnimationDelay(selector, baseDelay = 0.1) {
    document.querySelectorAll(selector).forEach((el, index) => {
      el.style.animationDelay = (baseDelay * index) + 's';
    });
  },

  // Smooth scroll to element
  scrollTo(element, offset = 100) {
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({
      top: elementPosition - offset,
      behavior: 'smooth'
    });
  }
};

// ============================================
// 13. INITIALIZATION ON DOM READY
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all managers
  const themeManager = new ThemeManager();
  const rtlManager = new RTLManager();
  const navigation = new Navigation();
  const animationObserver = new AnimationObserver();
  const formHandler = new FormHandler();
  const testimonialSlider = new TestimonialSlider();
  const dashboardManager = new DashboardManager();
  const galleryLightbox = new GalleryLightbox();
  const lazyLoadImages = new LazyLoadImages();
  const scrollAnimation = new ScrollAnimation();
  const pageTransition = new PageTransition();
  const faqAccordion = new FAQAccordion();

  // Add stagger animation to card elements
  Utils.addAnimationDelay('[data-animate-card]', 0.1);

  // Setup smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && document.querySelector(href)) {
        e.preventDefault();
        Utils.scrollTo(document.querySelector(href), 80);
      }
    });
  });

  // Add water wave animation to elements with class
  const waterWaveElements = document.querySelectorAll('.water-wave');
  if (waterWaveElements.length > 0) {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes waterWave {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }
      .water-wave { animation: waterWave 3s ease-in-out infinite; }
    `;
    document.head.appendChild(style);
  }

  console.log('✓ Aquascaping website initialized successfully!');
  console.log('Current Theme:', themeManager.theme);
});

// ============================================
// 14. PERFORMANCE: DEBOUNCED SCROLL & RESIZE
// ============================================

window.addEventListener('scroll', Utils.debounce(() => {
  // Trigger animations on scroll if needed
  document.querySelectorAll('[class*="fade-in"]').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('animate-visible');
    }
  });
}, 100));

window.addEventListener('resize', Utils.debounce(() => {
  // Handle resize events
}, 150));

// ============================================
// 15. SERVICE WORKER FOR PWA (Optional)
// ============================================

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Service Worker registration failed, app will still work
    });
  });
}
