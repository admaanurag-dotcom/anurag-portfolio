/**
 * ==========================================================================
 * PORTFOLIO JAVASCRIPT LOGIC
 * Author: Anurag Reddy Adma
 * Features:
 * - Theme Switcher (Dark/Light with localStorage persistence)
 * - Mobile Navigation Menu Toggle
 * - Dynamic Role Typing Animation
 * - Smooth Scroll & Active Link Scrollspy
 * - Project Filter System
 * - Number Counter & Progress Bar Animations on Scroll
 * - Interactive Contact Form Validation & Feedback
 * - Back to Top Floating Button
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. THEME SWITCHER (DARK / LIGHT MODE)
     -------------------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Retrieve stored theme or fall back to 'dark'
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
    });
  }

  /* --------------------------------------------------------------------------
     2. MOBILE NAVIGATION DRAWER
     -------------------------------------------------------------------------- */
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-nav-cta a');

  function toggleMobileMenu() {
    const isOpen = mobileMenuBtn.classList.toggle('open');
    mobileDrawer.classList.toggle('open');
    mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }

  function closeMobileMenu() {
    mobileMenuBtn.classList.remove('open');
    mobileDrawer.classList.remove('open');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
  }

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    // Close mobile menu upon clicking any navigation link
    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close when clicking outside of drawer
    document.addEventListener('click', (e) => {
      if (!mobileDrawer.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  /* --------------------------------------------------------------------------
     3. DYNAMIC ROLE TYPEWRITER EFFECT
     -------------------------------------------------------------------------- */
  const dynamicRoleElement = document.getElementById('dynamic-role');
  const roles = [
    'Software Engineer',
    'AI & ML Specialist',
    'Full-Stack Developer',
    'Embedded Systems & IoT',
    'Automation Engineer'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeRole() {
    if (!dynamicRoleElement) return;

    const currentRole = roles[roleIndex];

    if (isDeleting) {
      // Removing characters
      dynamicRoleElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Deletion is faster
    } else {
      // Adding characters
      dynamicRoleElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at full word
      typingSpeed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Finished deleting, move to next word
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400; // Small delay before typing next word
    }

    setTimeout(typeRole, typingSpeed);
  }

  // Start typing loop
  setTimeout(typeRole, 600);

  /* --------------------------------------------------------------------------
     4. SCROLLSPY & ACTIVE NAVIGATION LINK HIGHLIGHTING
     -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');

  function highlightCurrentSection() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        desktopNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightCurrentSection, { passive: true });

  /* --------------------------------------------------------------------------
     5. PROJECT CATEGORY FILTERING
     -------------------------------------------------------------------------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button state
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        if (filterValue === 'all' || filterValue === cardCategory) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
     6. INTERSECTION OBSERVER FOR STATS
     -------------------------------------------------------------------------- */
  // Animate stat counters
  const statNumbers = document.querySelectorAll('.stat-number');
  if ('IntersectionObserver' in window && statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const stat = entry.target;
          const targetNum = parseInt(stat.getAttribute('data-count'), 10);
          const suffix = stat.textContent.includes('+') ? '+' : (stat.textContent.includes('%') ? '%' : '');
          let count = 0;
          const duration = 1500;
          const stepTime = Math.max(20, Math.floor(duration / (targetNum || 1)));

          const counterTimer = setInterval(() => {
            count++;
            stat.textContent = `${count}${suffix}`;
            if (count >= targetNum) {
              clearInterval(counterTimer);
              stat.textContent = `${targetNum}${suffix}`;
            }
          }, stepTime);

          observer.unobserve(stat);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => statsObserver.observe(stat));
  }

  /* --------------------------------------------------------------------------
     7. INTERACTIVE CONTACT FORM VALIDATION & SUBMISSION
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const formAlert = document.getElementById('form-alert');
  const submitBtn = document.getElementById('submit-btn');

  // Input fields
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');

  // Email regex validator
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Validate single input field helper
  function validateField(input, condition) {
    const group = input.closest('.form-group');
    if (!condition) {
      group.classList.add('has-error');
      return false;
    } else {
      group.classList.remove('has-error');
      return true;
    }
  }

  // Real-time input listeners to clear errors once user types valid info
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      validateField(nameInput, nameInput.value.trim().length >= 2);
    });
  }
  if (emailInput) {
    emailInput.addEventListener('input', () => {
      validateField(emailInput, isValidEmail(emailInput.value.trim()));
    });
  }
  if (subjectInput) {
    subjectInput.addEventListener('input', () => {
      validateField(subjectInput, subjectInput.value.trim().length >= 3);
    });
  }
  if (messageInput) {
    messageInput.addEventListener('input', () => {
      validateField(messageInput, messageInput.value.trim().length >= 10);
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Check all fields
      const isNameValid = validateField(nameInput, nameInput.value.trim().length >= 2);
      const isEmailValid = validateField(emailInput, isValidEmail(emailInput.value.trim()));
      const isSubjectValid = validateField(subjectInput, subjectInput.value.trim().length >= 3);
      const isMessageValid = validateField(messageInput, messageInput.value.trim().length >= 10);

      const isFormValid = isNameValid && isEmailValid && isSubjectValid && isMessageValid;

      if (!isFormValid) {
        showFormAlert('Please resolve the highlighted fields before submitting.', 'error');
        return;
      }

      // Real sending state with API submission and email client fallback
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span>Sending Message...</span>
        <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;">
          <line x1="12" y1="2" x2="12" y2="6"></line>
          <line x1="12" y1="18" x2="12" y2="22"></line>
          <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
          <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
          <line x1="2" y1="12" x2="6" y2="12"></line>
          <line x1="18" y1="12" x2="22" y2="12"></line>
          <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
          <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
        </svg>
      `;

      function triggerDirectMailto() {
        const nameVal = nameInput ? nameInput.value.trim() : '';
        const emailVal = emailInput ? emailInput.value.trim() : '';
        const subjectVal = encodeURIComponent(subjectInput ? subjectInput.value.trim() : 'Portfolio Contact Inquiry');
        const bodyContent = encodeURIComponent(`Hi Anurag,\n\nName: ${nameVal}\nEmail: ${emailVal}\n\nMessage:\n${messageInput ? messageInput.value.trim() : ''}`);

        const mailtoLink = `mailto:anuragreddyadma@gmail.com?subject=${subjectVal}&body=${bodyContent}`;
        showFormAlert('Launching your email client to send message to anuragreddyadma@gmail.com...', 'success');

        setTimeout(() => {
          window.location.href = mailtoLink;
        }, 300);
      }

      const formData = new FormData(contactForm);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
        .then(async (response) => {
          let result = {};
          try {
            result = await response.json();
          } catch (err) { }

          if (response.ok && result.success) {
            showFormAlert('Thank you! Your message has been sent successfully to anuragreddyadma@gmail.com.', 'success');
            contactForm.reset();
          } else {
            // If public endpoint needs key or returns, fall back seamlessly to prefilled email client
            triggerDirectMailto();
            contactForm.reset();
          }
        })
        .catch((error) => {
          // Offline or network error fallback
          triggerDirectMailto();
          contactForm.reset();
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;

          // Remove error states if any remained
          document.querySelectorAll('.form-group').forEach(group => group.classList.remove('has-error'));

          // Hide alert message after 8 seconds
          setTimeout(() => {
            if (formAlert) formAlert.classList.add('hidden');
          }, 8000);
        });
    });
  }

  function showFormAlert(message, type) {
    if (!formAlert) return;
    formAlert.textContent = message;
    formAlert.className = `form-alert ${type}`;
    formAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /* --------------------------------------------------------------------------
     8. FLOATING BACK TO TOP BUTTON
     -------------------------------------------------------------------------- */
  const floatingTopBtn = document.getElementById('floating-top-btn');

  function handleScrollTopVisibility() {
    if (!floatingTopBtn) return;
    if (window.pageYOffset > 350) {
      floatingTopBtn.classList.add('show');
    } else {
      floatingTopBtn.classList.remove('show');
    }
  }

  window.addEventListener('scroll', handleScrollTopVisibility, { passive: true });

  if (floatingTopBtn) {
    floatingTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* --------------------------------------------------------------------------
     9. AUTO-UPDATE COPYRIGHT YEAR
     -------------------------------------------------------------------------- */
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

});

// Add keyframe animation for the spinner dynamically
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);
