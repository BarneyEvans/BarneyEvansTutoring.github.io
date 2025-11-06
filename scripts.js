(function () {
  const menuItem = document.querySelector('.topnav__item--menu');
  if (!menuItem) {
    return;
  }

  const trigger = menuItem.querySelector('.topnav__link--has-menu');
  const dropdown = menuItem.querySelector('.topnav__dropdown');

  // Disable hover-open behaviour; menu opens only on click
  const setHover = () => {};

  const openMenu = () => {
    menuItem.classList.add('is-open');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    menuItem.classList.remove('is-open');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  };

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

// Contact buttons: use same slick press animation as CTAs (handled via CSS)

// Private Tutoring: two-card selector with dynamic panel
(function () {
  const cardsWrap = document.querySelector('.service-cards');
  const detailsWrap = document.getElementById('details');
  if (!cardsWrap || !detailsWrap) return;

  const csCard = document.getElementById('card-cs');
  const gcseCard = document.getElementById('card-gcse');
  const csPanel = document.getElementById('details-cs');
  const gcsePanel = document.getElementById('details-gcse');

  const prefersReducedMotion = typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const panelsByKey = { cs: csPanel, gcse: gcsePanel };
  const cardsByKey = { cs: csCard, gcse: gcseCard };

  const setPanelHeight = (panel, valuePx) => {
    if (!panel) return;
    if (valuePx === null) {
      panel.style.removeProperty('--panel-height');
      return;
    }
    panel.style.setProperty('--panel-height', `${valuePx}px`);
  };

  const openPanel = (panel, { mode = 'slide' } = {}) => {
    if (!panel) return;
    panel.removeAttribute('hidden');
    panel.setAttribute('aria-hidden', 'false');
    if (mode === 'fade') {
      panel.classList.add('is-fade-mode');
      // force reflow then fade in
      void panel.offsetHeight;
      panel.classList.add('is-open');
      const tidy = () => {
        panel.classList.remove('is-fade-mode');
        panel.removeEventListener('transitionend', tidy);
      };
      panel.addEventListener('transitionend', tidy);
      return;
    }
    // slide mode
    setPanelHeight(panel, panel.scrollHeight);
    void panel.offsetHeight; // reflow
    panel.classList.add('is-open');
    const tidy = () => {
      setPanelHeight(panel, null);
      panel.removeEventListener('transitionend', tidy);
    };
    panel.addEventListener('transitionend', tidy);
  };

  const closePanel = (panel, { mode = 'slide' } = {}) => {
    if (!panel || panel.hasAttribute('hidden')) return;
    if (mode === 'fade') {
      panel.classList.add('is-fade-mode');
      void panel.offsetHeight;
      panel.classList.remove('is-open');
      const tidy = () => {
        panel.setAttribute('hidden', '');
        panel.setAttribute('aria-hidden', 'true');
        panel.classList.remove('is-fade-mode');
        panel.removeEventListener('transitionend', tidy);
      };
      panel.addEventListener('transitionend', tidy);
      return;
    }
    // slide mode
    setPanelHeight(panel, panel.scrollHeight);
    void panel.offsetHeight;
    panel.classList.remove('is-open');
    setPanelHeight(panel, 0);
    const tidy = () => {
      panel.setAttribute('hidden', '');
      panel.setAttribute('aria-hidden', 'true');
      setPanelHeight(panel, null);
      panel.removeEventListener('transitionend', tidy);
    };
    panel.addEventListener('transitionend', tidy);
  };

  let currentKey = null;

  const setButtonLabels = () => {
    [csCard, gcseCard].forEach((c) => {
      if (!c) return;
      const btn = c.querySelector('.service-card__cta');
      if (!btn) return;
      if (!btn.dataset.closedLabel) {
        btn.dataset.closedLabel = btn.textContent.trim();
      }
      btn.textContent = (c.classList.contains('is-active')) ? 'Hide details' : btn.dataset.closedLabel;
    });
  };

  const activate = (key, { fromHash = false } = {}) => {
    const targetCard = cardsByKey[key];
    const targetPanel = panelsByKey[key];
    if (!targetCard || !targetPanel) return;

    // Toggle/collapse if clicking the same active card
    if (currentKey === key) {
      // collapse current
      const currentPanel = panelsByKey[currentKey];
      const currentCard = cardsByKey[currentKey];
      closePanel(currentPanel, { mode: 'slide' });
      currentCard.classList.remove('is-active');
      currentCard.setAttribute('aria-pressed', 'false');
      const b = currentCard.querySelector('.service-card__cta');
      if (b) b.setAttribute('aria-expanded', 'false');
      currentKey = null;
      setButtonLabels();
      // clear hash
      if (!fromHash && history.replaceState) {
        history.replaceState(null, '', location.pathname + location.search);
      }
      return;
    }

    // Determine if switching or initial open
    const isSwitch = currentKey !== null && currentKey !== key;
    const prevPanel = currentKey ? panelsByKey[currentKey] : null;
    const prevCard = currentKey ? cardsByKey[currentKey] : null;

    // Update active card states
    [csCard, gcseCard].forEach((c) => {
      if (!c) return;
      const active = c === targetCard;
      c.classList.toggle('is-active', active);
      const btn = c.querySelector('.service-card__cta');
      if (btn) btn.setAttribute('aria-expanded', active ? 'true' : 'false');
    });
    setButtonLabels();

    // Close previous and open new with appropriate animation
    if (isSwitch) {
      closePanel(prevPanel, { mode: 'fade' });
      openPanel(targetPanel, { mode: 'fade' });
    } else {
      openPanel(targetPanel, { mode: 'slide' });
    }

    currentKey = key;

    // Scroll to details only on initial open (not switching) and only on narrow viewports
    if (!fromHash && !isSwitch && window.innerWidth <= 820) {
      const topnav = document.querySelector('.topnav');
      const offset = topnav ? topnav.offsetHeight + 8 : 0;
      const y = (detailsWrap.getBoundingClientRect().top + window.scrollY) - offset;
      if (!prefersReducedMotion) {
        window.scrollTo({ top: y, behavior: 'smooth' });
      } else {
        window.scrollTo(0, y);
      }
    }
  };

  // Click handlers
  const handleActivateByBtn = (btn) => {
    const targetId = btn.getAttribute('aria-controls');
    if (!targetId) return;
    const key = /gcse/i.test(targetId) ? 'gcse' : 'cs';
    activate(key);
    // Update hash for deep link without jumping
    if (history.replaceState) {
      // set or clear hash based on whether a panel is open now
      const newHash = (key === currentKey) ? '' : `#${key}`; // currentKey updated inside activate
      if (newHash) history.replaceState(null, '', newHash);
      else history.replaceState(null, '', location.pathname + location.search);
    }
  };

  [csCard, gcseCard].forEach((card) => {
    if (!card) return;
    const btn = card.querySelector('.service-card__cta');
    if (btn) {
      btn.addEventListener('click', () => handleActivateByBtn(btn));
    }
  });

  // Deep link on load and hash changes
  const clearActive = () => {
    [csCard, gcseCard].forEach((c) => {
      if (!c) return;
      c.classList.remove('is-active');
      const btn = c.querySelector('.service-card__cta');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
    [csPanel, gcsePanel].forEach((p) => {
      if (!p) return;
      p.setAttribute('hidden', '');
      p.setAttribute('aria-hidden', 'true');
      p.classList.remove('is-open');
      setPanelHeight(p, null);
    });
    setButtonLabels();
  };

  const applyHash = (fromHash = false) => {
    const h = (location.hash || '').replace('#', '').toLowerCase();
    if (h === 'gcse') activate('gcse', { fromHash });
    else if (h === 'cs') activate('cs', { fromHash });
    else { clearActive(); currentKey = null; }
  };
  applyHash(true);
  window.addEventListener('hashchange', () => applyHash(true));
})();
