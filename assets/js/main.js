/**
 * Zain Academy — Main Client Script (The Registrar's Ledger)
 * Vanilla JavaScript — Zero dependencies, fast and accessible.
 */

// 0. Institutional Loading Screen with Official Logo
// Only shows if the website takes a noticeable time to load on initial visit, never on every page click
(function initSitePreloader() {
  // If already opened in this browsing session, do not show loader again
  try {
    if (sessionStorage.getItem('za_site_opened')) {
      return;
    }
  } catch (e) {
    // ignore storage error
  }

  let preloader = null;
  let isReady = false;

  // Only spawn preloader if loading takes more than 350ms (e.g. slow initial load)
  const slowTimer = setTimeout(() => {
    if (isReady || document.readyState === 'complete') {
      return;
    }
    preloader = document.createElement('div');
    preloader.id = 'site-preloader';
    preloader.className = 'site-preloader';
    preloader.innerHTML = `
      <div class="preloader-card">
        <div class="preloader-logo-wrap">
          <img src="assets/img/logo.svg" alt="Zain Academy" class="preloader-logo">
        </div>
        <div class="preloader-progress-bar">
          <div class="preloader-progress-fill"></div>
        </div>
        <span class="preloader-status">Zain Academy &bull; Est. 2010</span>
      </div>
    `;
    document.body.prepend(preloader);
  }, 350);

  const dismissPreloader = () => {
    isReady = true;
    clearTimeout(slowTimer);
    try {
      sessionStorage.setItem('za_site_opened', '1');
    } catch (e) {}

    if (preloader) {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        if (preloader && preloader.parentNode) {
          preloader.remove();
        }
      }, 300);
    }
  };

  if (document.readyState === 'complete') {
    dismissPreloader();
  } else {
    window.addEventListener('load', dismissPreloader);
    setTimeout(dismissPreloader, 2500); // Safety fallback
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navigation Toggle
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const primaryNav = document.querySelector('.primary-nav');

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      primaryNav.classList.toggle('is-open');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !primaryNav.contains(e.target) && primaryNav.classList.contains('is-open')) {
        primaryNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && primaryNav.classList.contains('is-open')) {
        primaryNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }

  // 2. Scroll Reveal Animations
  const reveals = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window && reveals.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    });

    reveals.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is unsupported
    reveals.forEach(el => el.classList.add('is-revealed'));
  }

  // 3. Static Contact Form Handling
  const contactForm = document.getElementById('academyContactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('formName')?.value.trim() || '';
      const email = document.getElementById('formEmail')?.value.trim() || '';
      const phone = document.getElementById('formPhone')?.value.trim() || '';
      const program = document.getElementById('formProgram')?.value || 'General Inquiry';
      const message = document.getElementById('formMessage')?.value.trim() || '';

      if (!name || !email || !message) {
        alert('Please fill out all required fields (Name, Email, and Message).');
        return;
      }

      // Format pre-filled mailto URI
      const emailSubject = encodeURIComponent(`Admission / Inquiry: ${program} - ${name}`);
      const emailBody = encodeURIComponent(
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Phone/WhatsApp: ${phone}\n` +
        `Program/Class of Interest: ${program}\n\n` +
        `Inquiry Details:\n${message}\n\n` +
        `---\nSubmitted via Zain Academy Static Portal`
      );

      const targetEmail = 'zainmir9582@gmail.com';
      const mailtoUrl = `mailto:${targetEmail}?subject=${emailSubject}&body=${emailBody}`;

      // Show confirmation box
      if (formStatus) {
        formStatus.classList.add('success');
        formStatus.innerHTML = `
          <strong>Ledger Entry Recorded!</strong> Opening your email client to dispatch this message directly to <em>${targetEmail}</em>. 
          If your client did not launch automatically, you can <a href="${mailtoUrl}" style="color: #1b5e20; font-weight: bold; text-decoration: underline;">click here to send</a>.
        `;
      }

      // Trigger mailto link
      window.location.href = mailtoUrl;

      // Reset form
      contactForm.reset();
    });
  }

  // 4. Course Filter / Search (courses.html)
  const courseSearch = document.getElementById('courseSearch');
  const courseRows = document.querySelectorAll('.course-row');
  const deptFilters = document.querySelectorAll('.filter-dept-btn');

  if (courseRows.length > 0) {
    const filterCourses = () => {
      const searchTerm = courseSearch ? courseSearch.value.toLowerCase().trim() : '';
      const activeDeptBtn = document.querySelector('.filter-dept-btn.active');
      const activeDept = activeDeptBtn ? activeDeptBtn.dataset.dept : 'all';

      courseRows.forEach(row => {
        const title = row.querySelector('.course-main-title')?.textContent.toLowerCase() || '';
        const desc = row.querySelector('.course-desc')?.textContent.toLowerCase() || '';
        const dept = row.dataset.dept || 'all';

        const matchesSearch = title.includes(searchTerm) || desc.includes(searchTerm);
        const matchesDept = activeDept === 'all' || dept === activeDept;

        if (matchesSearch && matchesDept) {
          row.style.display = 'grid';
        } else {
          row.style.display = 'none';
        }
      });
    };

    if (courseSearch) {
      courseSearch.addEventListener('input', filterCourses);
    }

    deptFilters.forEach(btn => {
      btn.addEventListener('click', () => {
        deptFilters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterCourses();
      });
    });
  }

  // 5. Faculty Filter (faculty.html)
  const facultySearch = document.getElementById('facultySearch');
  const facultyCards = document.querySelectorAll('.faculty-card-item');

  if (facultySearch && facultyCards.length > 0) {
    facultySearch.addEventListener('input', () => {
      const term = facultySearch.value.toLowerCase().trim();
      facultyCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(term)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // 6. Gallery Modal Viewer
  const galleryItems = document.querySelectorAll('.gallery-real-card img');
  const imgModal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImageDisplay');
  const modalClose = document.getElementById('modalCloseBtn');

  if (galleryItems.length > 0 && imgModal && modalImg) {
    galleryItems.forEach(img => {
      img.addEventListener('click', () => {
        modalImg.src = img.src;
        modalImg.alt = img.alt || 'Gallery photo preview';
        imgModal.classList.add('is-active');
      });
    });

    if (modalClose) {
      modalClose.addEventListener('click', () => {
        imgModal.classList.remove('is-active');
      });
    }

    imgModal.addEventListener('click', (e) => {
      if (e.target === imgModal) {
        imgModal.classList.remove('is-active');
      }
    });
  }
});
