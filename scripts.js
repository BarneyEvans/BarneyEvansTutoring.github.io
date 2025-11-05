(function () {
  const menuItem = document.querySelector('.topnav__item--menu');
  if (!menuItem) {
    return;
  }

  const trigger = menuItem.querySelector('.topnav__link--has-menu');
  const dropdown = menuItem.querySelector('.topnav__dropdown');

  let clearTimer = null;
  const setHover = (state) => {
    if (state) {
      document.body.classList.add('is-nav-menu-hover');
      return;
    }
    document.body.classList.remove('is-nav-menu-hover');
  };

  const openMenu = () => {
    menuItem.classList.add('is-open');
    setHover(true);
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    menuItem.classList.remove('is-open');
    setHover(false);
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  };

  const scheduleClear = () => {
    if (clearTimer) {
      clearTimeout(clearTimer);
    }
    clearTimer = setTimeout(() => {
      closeMenu();
      clearTimer = null;
    }, 40);
  };

  // Hover/focus behaviour keeps the subtle page blur
  menuItem.addEventListener('pointerenter', () => {
    if (clearTimer) {
      clearTimeout(clearTimer);
      clearTimer = null;
    }
    setHover(true);
  });

  menuItem.addEventListener('pointerleave', () => {
    scheduleClear();
  });

  menuItem.addEventListener('focusin', () => {
    if (clearTimer) {
      clearTimeout(clearTimer);
      clearTimer = null;
    }
    setHover(true);
  });

  menuItem.addEventListener('focusout', () => {
    scheduleClear();
  });

  // Click to toggle
  if (trigger) {
    trigger.setAttribute('aria-expanded', 'false');
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      if (menuItem.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
        // Focus first item for accessibility
        const first = dropdown && dropdown.querySelector('a');
        if (first) first.focus();
      }
    });
  }

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!menuItem.contains(e.target)) {
      closeMenu();
    }
  });

  // Open via any element with .js-open-courses
  document.querySelectorAll('.js-open-courses').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openMenu();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const first = dropdown && dropdown.querySelector('a');
      if (first) {
        setTimeout(() => first.focus(), 200);
      }
    });
  });
})();

// Subtle shake of contact buttons after scrolling into view
(function () {
  const shakeContact = () => {
    document.querySelectorAll('.contact .contact__link').forEach((el) => {
      el.classList.add('is-shaking');
      el.addEventListener('animationend', () => el.classList.remove('is-shaking'), { once: true });
    });
  };

  // Trigger when clicking any link to #contact
  document.querySelectorAll('a[href="#contact"]').forEach((a) => {
    a.addEventListener('click', () => {
      // Wait a bit to allow smooth scroll to settle
      setTimeout(shakeContact, 420);
    });
  });
})();

// Mobile hamburger navigation
(function () {
  const hamburger = document.querySelector('.js-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  const coursesToggle = document.querySelector('.js-mobile-courses-toggle');
  const coursesSub = document.getElementById('mobile-courses');
  const motionQuery = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;
  const prefersReducedMotion = motionQuery ? motionQuery.matches : false;
  let subTransitionCleanup = null;
  let subRaf = null;

  const cancelSubTransition = () => {
    if (typeof subTransitionCleanup === 'function') {
      subTransitionCleanup();
      subTransitionCleanup = null;
    }
  };

  const cancelSubRaf = () => {
    if (subRaf !== null && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(subRaf);
    }
    subRaf = null;
  };

  const nextSubFrame = (callback) => {
    cancelSubRaf();
    if (typeof requestAnimationFrame !== 'function') {
      callback();
      return;
    }
    subRaf = requestAnimationFrame(() => {
      subRaf = null;
      callback();
    });
  };

  const onSubTransitionEnd = (callback) => {
    if (!coursesSub) return;
    const handler = (event) => {
      if (event.target !== coursesSub || event.propertyName !== 'max-height') return;
      coursesSub.removeEventListener('transitionend', handler);
      subTransitionCleanup = null;
      callback();
    };
    coursesSub.addEventListener('transitionend', handler);
    subTransitionCleanup = () => {
      coursesSub.removeEventListener('transitionend', handler);
      subTransitionCleanup = null;
    };
  };

  const openCoursesSub = () => {
    if (!coursesSub || coursesSub.classList.contains('is-open')) return;
    cancelSubTransition();
    cancelSubRaf();
    coursesSub.removeAttribute('hidden');
    coursesSub.setAttribute('aria-hidden', 'false');

    if (prefersReducedMotion) {
      coursesSub.classList.add('is-open');
      coursesSub.style.removeProperty('--mobile-sub-height');
      return;
    }

    coursesSub.style.setProperty('--mobile-sub-height', `${coursesSub.scrollHeight}px`);
    void coursesSub.offsetHeight;
    nextSubFrame(() => {
      coursesSub.classList.add('is-open');
    });
    onSubTransitionEnd(() => {
      coursesSub.style.removeProperty('--mobile-sub-height');
    });
  };

  const closeCoursesSub = (animate = true) => {
    if (!coursesSub || coursesSub.hasAttribute('hidden')) return;
    cancelSubTransition();
    cancelSubRaf();
    coursesSub.setAttribute('aria-hidden', 'true');

    const finish = () => {
      coursesSub.classList.remove('is-open');
      coursesSub.setAttribute('hidden', '');
      coursesSub.style.removeProperty('--mobile-sub-height');
    };

    if (!animate || prefersReducedMotion) {
      finish();
      return;
    }

    coursesSub.style.setProperty('--mobile-sub-height', `${coursesSub.scrollHeight}px`);
    void coursesSub.offsetHeight;
    nextSubFrame(() => {
      coursesSub.classList.remove('is-open');
    });
    onSubTransitionEnd(finish);
  };

  if (coursesSub) {
    coursesSub.setAttribute('aria-hidden', coursesSub.hasAttribute('hidden') ? 'true' : 'false');
  }

  const openMobile = () => {
    mobileMenu.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    if (mobileMenu) mobileMenu.setAttribute('aria-hidden', 'false');
    hamburger.classList.add('is-active');
    hamburger.setAttribute('aria-label', 'Close menu');
    document.body.classList.add('is-mobile-menu-open');
    const first = mobileMenu.querySelector('a,button');
    if (first) first.focus();
  };
  const closeMobile = () => {
    mobileMenu.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    if (mobileMenu) mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.classList.remove('is-active');
    hamburger.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('is-mobile-menu-open');
    if (coursesToggle) {
      coursesToggle.setAttribute('aria-expanded', 'false');
    }
    closeCoursesSub(false);
  };

  hamburger.addEventListener('click', () => {
    if (mobileMenu.classList.contains('is-open')) {
      closeMobile();
    } else {
      openMobile();
    }
  });

  document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
      closeMobile();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobile();
  });

  // Close the mobile menu if resizing to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 700) {
      closeMobile();
    }
  });

  if (coursesToggle && coursesSub) {
    coursesToggle.addEventListener('click', () => {
      const expanded = coursesToggle.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        coursesToggle.setAttribute('aria-expanded', 'false');
        closeCoursesSub(true);
      } else {
        coursesToggle.setAttribute('aria-expanded', 'true');
        openCoursesSub();
      }
    });
    // Keep parent highlighted while interacting inside submenu
    const addParentHighlight = () => coursesToggle.classList.add('is-child-hover');
    const removeParentHighlight = () => coursesToggle.classList.remove('is-child-hover');
    coursesSub.addEventListener('pointerenter', addParentHighlight);
    coursesSub.addEventListener('pointerleave', removeParentHighlight);
    coursesSub.addEventListener('focusin', addParentHighlight);
    coursesSub.addEventListener('focusout', (e) => {
      // Remove when focus fully leaves submenu
      if (!coursesSub.contains(e.relatedTarget)) removeParentHighlight();
    });
  }
})();
