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
