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

  /* --------------------------------------------------------------------------
     10. AI PORTFOLIO ASSISTANT (ANURAG AI)
     -------------------------------------------------------------------------- */
  const aiChatToggleBtn = document.getElementById('ai-chat-toggle');
  const aiChatWidget = document.getElementById('ai-chat-widget');
  const aiCloseBtn = document.getElementById('ai-close-chat');
  const aiClearBtn = document.getElementById('ai-clear-chat');
  const aiChatForm = document.getElementById('ai-chat-form');
  const aiChatInput = document.getElementById('ai-chat-input');
  const aiChatMessages = document.getElementById('ai-chat-messages');

  if (aiChatToggleBtn && aiChatWidget) {
    // Open/Close toggle
    aiChatToggleBtn.addEventListener('click', () => {
      const isClosed = aiChatWidget.classList.toggle('closed');
      aiChatWidget.setAttribute('aria-hidden', isClosed ? 'true' : 'false');
      if (!isClosed) {
        setTimeout(() => aiChatInput && aiChatInput.focus(), 300);
      }
    });

    if (aiCloseBtn) {
      aiCloseBtn.addEventListener('click', () => {
        aiChatWidget.classList.add('closed');
        aiChatWidget.setAttribute('aria-hidden', 'true');
      });
    }

    if (aiClearBtn) {
      aiClearBtn.addEventListener('click', () => {
        aiChatMessages.innerHTML = `
          <div class="ai-msg bot-msg">
            <div class="ai-msg-avatar">🤖</div>
            <div class="ai-msg-bubble">
              <p>Chat cleared! 👋 Feel free to ask me another question about Anurag's work, experience, or skills.</p>
            </div>
          </div>
          <div class="ai-chips-wrapper" id="ai-chips-container">
            <span class="ai-chips-label">Quick questions:</span>
            <div class="ai-chips-list">
              <button class="ai-chip" data-query="What projects has Anurag built?">What projects has Anurag built?</button>
              <button class="ai-chip" data-query="Tell me about his LRC project">Tell me about his LRC project</button>
              <button class="ai-chip" data-query="What technologies does he know?">What technologies does he know?</button>
              <button class="ai-chip" data-query="What did he do at T-Works?">What did he do at T-Works?</button>
              <button class="ai-chip" data-query="How can I contact Anurag?">How can I contact Anurag?</button>
            </div>
          </div>
        `;
        attachChipListeners();
      });
    }

    function appendUserMessage(text) {
      const userMsgDiv = document.createElement('div');
      userMsgDiv.className = 'ai-msg user-msg';
      userMsgDiv.innerHTML = `
        <div class="ai-msg-avatar">👤</div>
        <div class="ai-msg-bubble"><p>${escapeHtml(text)}</p></div>
      `;
      aiChatMessages.appendChild(userMsgDiv);
      aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
    }

    function showTypingIndicator() {
      const typingDiv = document.createElement('div');
      typingDiv.className = 'ai-msg bot-msg ai-typing-msg';
      typingDiv.id = 'ai-typing-indicator';
      typingDiv.innerHTML = `
        <div class="ai-msg-avatar">🤖</div>
        <div class="ai-msg-bubble ai-typing-indicator">
          <span></span><span></span><span></span>
        </div>
      `;
      aiChatMessages.appendChild(typingDiv);
      aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
    }

    function removeTypingIndicator() {
      const typingDiv = document.getElementById('ai-typing-indicator');
      if (typingDiv) typingDiv.remove();
    }

    function appendBotMessage(htmlContent) {
      removeTypingIndicator();
      const botMsgDiv = document.createElement('div');
      botMsgDiv.className = 'ai-msg bot-msg';
      botMsgDiv.innerHTML = `
        <div class="ai-msg-avatar">🤖</div>
        <div class="ai-msg-bubble">${htmlContent}</div>
      `;
      aiChatMessages.appendChild(botMsgDiv);
      aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
    }

    function escapeHtml(string) {
      const div = document.createElement('div');
      div.textContent = string;
      return div.innerHTML;
    }

    // Knowledge Engine
    function generateAssistantResponse(query) {
      const q = query.toLowerCase().trim();

      // Greetings (exact match or greeting words)
      if (/\b(hi|hello|hey|greetings|howdy|good\s+(morning|afternoon|evening)|yo)\b/i.test(q)) {
        return `<p>Hello! 👋 How can I help you learn more about Anurag today? You can ask about:</p>
                <p>• His <strong>featured projects</strong> (like LRC 2026 & DWIN HMI)<br>
                • His <strong>internship at T-Works</strong><br>
                • His <strong>tech stack & skills</strong><br>
                • How to <strong>contact or hire him</strong></p>`;
      }

      // Contact / Email / Phone / Location / Resume / CV
      if (/\b(contact|email|phone|mobile|call|reach|location|address|city|linkedin|github|resume|cv|hire|hiring)\b/i.test(q)) {
        return `<p>📬 <strong>Get in Touch with Anurag:</strong></p>
                <p>• <strong>Email:</strong> <a href="mailto:anuragreddyadma@gmail.com">anuragreddyadma@gmail.com</a><br>
                • <strong>Phone:</strong> <a href="tel:+919182236284">+91 91822 36284</a><br>
                • <strong>Location:</strong> Hyderabad, India<br>
                • <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/anurag-reddy-adma-48933b282" target="_blank">linkedin.com/in/anurag-reddy-adma</a><br>
                • <strong>GitHub:</strong> <a href="https://github.com/admaanurag-dotcom" target="_blank">github.com/admaanurag-dotcom</a><br>
                • <strong>Resume / CV:</strong> <a href="06_Anurag_Reddy_Adma_Resume.pdf" target="_blank">👁 View Resume</a> &bull; <a href="06_Anurag_Reddy_Adma_Resume.pdf" download="06_Anurag_Reddy_Adma_Resume.pdf">↓ Download PDF</a></p>
                <p>🔗 <a href="#contact" onclick="document.getElementById('ai-chat-widget').classList.add('closed')">Send a message directly</a></p>`;
      }

      // LRC Project
      if (/\b(lrc|lam\s*research|hackathon)\b/i.test(q)) {
        return `<p>🏆 <strong>LRC 2026 — Lam Research Challenge Hackathon Platform</strong></p>
                <p>Anurag architected this end-to-end hackathon management system powering <strong>49+ relational tables</strong>. It facilitates multi-role workflows for Admins, Evaluators, Observers, and Juries with real-time arena scoring and DigitalOcean Spaces storage.</p>
                <p>🔗 <a href="https://lrc2026.tworks.in/" target="_blank">Live Demo: lrc2026.tworks.in</a> &bull; <a href="#projects" onclick="document.getElementById('ai-chat-widget').classList.add('closed')">View in Projects</a></p>`;
      }

      // DWIN / Embedded / Roti Maker
      if (/\b(dwin|roti|embedded|hmi|dgus|uart|t5l|iot)\b/i.test(q)) {
        return `<p>⚙️ <strong>DWIN DGUS Smart Display & Industrial HMI Automation</strong></p>
                <p>Engineered smart display interfaces for commercial appliances (ITC Automated Roti Maker). Anurag built custom Python pipelines for video extraction, quantization, and ICL binary compilation with UART serial sync.</p>
                <p>🔗 <a href="#projects" onclick="document.getElementById('ai-chat-widget').classList.add('closed')">View Project Card</a></p>`;
      }

      // AI / ML / Retinal / Computer Vision
      if (/\b(retinal|vessel|segmentation|deep\s*learning|computer\s*vision|cnn|tensorflow|ai\s*model|machine\s*learning|ai|ml)\b/i.test(q)) {
        return `<p>🤖 <strong>Deep Learning & AI Capabilities</strong></p>
                <p>Anurag built a <strong>Deep Learning Retinal Blood Vessel Segmentation</strong> diagnostic system on DRIVE and STARE datasets, achieving <strong>0.982 AUC</strong> and <strong>95.4% sensitivity</strong> for automated diabetic retinopathy diagnosis.</p>
                <p>Skilled in Python, TensorFlow, Scikit-learn, CNN architectures, and data pipelines.</p>`;
      }

      // T-Works Internship / Work Experience
      if (/\b(t-works|tworks|intern|internship|experience|work|career)\b/i.test(q)) {
        return `<p>🏢 <strong>Automation Intern at T-Works (Nov 2025 – Present)</strong></p>
                <p>At T-Works (India's premier prototyping center in Hyderabad), Anurag:</p>
                <p>• Built the <strong>LRC 2026 platform</strong> for hackathon tracking.<br>
                • Developed Python toolchains for <strong>DWIN DGUS smart displays</strong> for industrial food appliances (ITC Automated Roti Maker).<br>
                • Engineered UART serial sync and automated graphic compilation.</p>
                <p>🔗 <a href="#experience" onclick="document.getElementById('ai-chat-widget').classList.add('closed')">Jump to Experience section</a></p>`;
      }

      // Projects (General / List / Games)
      if (/\b(project|projects|built|portfolio|apps|app|application|applications|flappy|snake|game|games)\b/i.test(q)) {
        return `<p>🚀 <strong>Featured Projects Built by Anurag:</strong></p>
                <p>1. <strong>LRC 2026</strong> (Full Stack) — Enterprise hackathon evaluation engine.<br>
                2. <strong>DWIN Roti Maker</strong> (Embedded/IoT) — Industrial HMI touchscreen toolchain.<br>
                3. <strong>Retinal Vessel Segmentation</strong> (AI/ML) — Deep learning CNN model with 0.982 AUC.<br>
                4. <strong>Faculty Management System</strong> (Full Stack) — Node.js/MySQL platform.<br>
                5. <strong>Flappy Bird & Snake</strong> (Games) — Interactive browser games.</p>
                <p>🔗 <a href="#projects" onclick="document.getElementById('ai-chat-widget').classList.add('closed')">Explore all in Projects section</a></p>`;
      }

      // Technologies / Skills
      if (/\b(tech|technology|technologies|skill|skills|stack|language|languages|python|javascript|typescript|react|node|express|mysql|postgres|sql|html|css|git)\b/i.test(q)) {
        return `<p>💻 <strong>Anurag's Technical Repertoire:</strong></p>
                <p>• <strong>Languages:</strong> Python, JavaScript (ES6+), TypeScript, C, C++, SQL, HTML5/CSS3<br>
                • <strong>Frontend & Web:</strong> React, Vanilla JS, Responsive Design, CSS Animations<br>
                • <strong>Backend & Cloud:</strong> Node.js, Express, MySQL, PostgreSQL, REST APIs, DigitalOcean<br>
                • <strong>AI & Data:</strong> TensorFlow, Scikit-learn, CNNs, OpenCV, Pandas/NumPy<br>
                • <strong>Embedded Systems:</strong> DWIN DGUS / T5L, UART, HMI Prototyping, Git</p>
                <p>🔗 <a href="#skills" onclick="document.getElementById('ai-chat-widget').classList.add('closed')">See full Skills section</a></p>`;
      }

      // Education
      if (/\b(education|college|university|degree|b\.?tech|academic|study|qualification|graduat)\b/i.test(q)) {
        return `<p>🎓 <strong>Academic Foundation:</strong></p>
                <p>• <strong>B.Tech in Computer Science & Engineering (AI & ML)</strong> — Specializing in machine learning, distributed systems, and modern software architectures.<br>
                • Active member of tech innovation hubs and hackathon teams.</p>
                <p>🔗 <a href="#education" onclick="document.getElementById('ai-chat-widget').classList.add('closed')">View Education Section</a></p>`;
      }

      // Who is Anurag / About / Bio
      if (/\b(who|about|anurag|bio|summary|background|profile|intro|details)\b/i.test(q)) {
        return `<p>👨‍💻 <strong>About Anurag Reddy Adma:</strong></p>
                <p>Anurag is an innovative Software Engineer and AI/ML Specialist with industry experience at <strong>T-Works</strong>. He blends full-stack web engineering, deep learning computer vision models, and industrial embedded systems (HMI/DWIN) to craft reliable, high-performance software.</p>
                <p>He is currently <strong>open for full-time software engineering roles and collaborations</strong>!</p>
                <p>🔗 <a href="#about" onclick="document.getElementById('ai-chat-widget').classList.add('closed')">Read full Bio</a></p>`;
      }

      // Fallback
      return `<p>I'd love to help with that! Here are a few questions you can ask me:</p>
              <p>• <em>"What projects has Anurag built?"</em><br>
              • <em>"Tell me about his LRC project"</em><br>
              • <em>"What did he do at T-Works?"</em><br>
              • <em>"What technologies does he know?"</em><br>
              • <em>"How can I contact Anurag?"</em></p>`;
    }

    function processQuery(queryText) {
      if (!queryText.trim()) return;
      appendUserMessage(queryText);
      showTypingIndicator();

      const responseDelay = Math.min(800, Math.max(350, queryText.length * 15));

      setTimeout(() => {
        const responseHtml = generateAssistantResponse(queryText);
        appendBotMessage(responseHtml);
      }, responseDelay);
    }

    if (aiChatForm) {
      aiChatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = aiChatInput.value;
        aiChatInput.value = '';
        processQuery(query);
      });
    }

    function attachChipListeners() {
      const chips = document.querySelectorAll('.ai-chip');
      chips.forEach(chip => {
        chip.addEventListener('click', () => {
          const query = chip.getAttribute('data-query');
          if (query) {
            processQuery(query);
          }
        });
      });
    }

    attachChipListeners();
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

