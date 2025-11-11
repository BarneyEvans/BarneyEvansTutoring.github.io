// Removed unused desktop dropdown logic

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

  // No mobile submenu; only a single-level mobile menu is used
  const motionQuery = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;
  const prefersReducedMotion = motionQuery ? motionQuery.matches : false;
  // Submenu helpers removed

  // Submenu state removed

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
    // No submenu to close
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

  // No submenu listeners
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

// Python course roadmap interactivity
(function () {
  const container = document.getElementById('roadmap');
  if (!container) return;

  const lessons = [
    {id:1,title:'Foundations',shortDescription:'Core Python building blocks: variables, data types and simple arithmetic.',keyPoints:[
      'Introduce variables, constants and standard data types (integer, real, Boolean, character, string).',
      'Use arithmetic expressions with the required operators to calculate and store results correctly.',
      'Write and trace short sequential programs, identifying and fixing basic syntax and logic errors.'
    ],codeSnippet:['score = 5','total = score + 10']},
    {id:2,title:'Inputs & Strings',shortDescription:'Getting data into a program and working with text in an exam-style way.',keyPoints:[
      'Read user input from the keyboard and store it in appropriately typed variables.',
      'Convert between strings and numbers so input can be validated and used in calculations.',
      'Use core string operations (length, index/position, substring/slicing, concatenation) that appear in exam questions.'
    ],codeSnippet:['name = input("Name?")','print("Hello, " + name)']},
    {id:3,title:'Selection & Logic',shortDescription:'Making decisions in code with if/elif/else and logical conditions.',keyPoints:[
      'Use if, elif and else (including simple nesting) to control the flow of a program.',
      'Apply relational and Boolean operators (> , < , == , != , <= , >= , AND, OR, NOT) to build conditions.',
      'Trace and write branching algorithms in Python and exam-style pseudocode, predicting outputs for given inputs.'
    ],codeSnippet:['if mark >= 50:','    print("Pass")']},
    {id:4,title:'Loops (while)',shortDescription:'Condition-controlled loops that repeat while a condition is true.',keyPoints:[
      'Use condition-controlled (indefinite) iteration with while loops to repeat code until a condition is met.',
      'Understand exam reference forms such as WHILE…ENDWHILE and REPEAT…UNTIL, and how they match Python while loops.',
      'Trace and write algorithms that use while loops for tasks like input validation and simple menus.'
    ],codeSnippet:['while tries < 3:','    tries = tries + 1']},
    {id:5,title:'Loops (for)',shortDescription:'Count-controlled iteration over ranges and data structures.',keyPoints:[
      'Use count-controlled iteration with for loops to repeat code a fixed number of times.',
      'Apply for loops to process each item in a data structure such as a string or 1D list/array.',
      'Trace and construct algorithms with for loops, including simple nesting for tables and 2D structures.'
    ],codeSnippet:['for i in range(5):','    print(i)']},
    {id:6,title:'Functions',shortDescription:'Subroutines / functions to structure code and reuse logic.',keyPoints:[
      'Understand subroutines (procedures/functions) as named blocks used to structure programs.',
      'Define and call functions with parameters and return values, and distinguish them from procedures that do not return a value.',
      'Use local variables, parameters and return values to pass data in and out of subroutines in line with exam expectations.'
    ],codeSnippet:['def square(x):','    return x * x']},
    {id:7,title:'Lists',shortDescription:'Storing and accessing collections of values.',keyPoints:[
      'Declare and initialise 1D lists/arrays of a single data type, then read and update elements by index.',
      'Use iteration over every item in a list/array to calculate totals, counts or other simple results.',
      'Apply lists/arrays in typical exam tasks such as storing marks, names, menu options or other related values.'
    ],codeSnippet:['scores = [10, 7, 9]','first = scores[0]']},
    {id:8,title:'2D Lists',shortDescription:'Representing tables and grids of data.',keyPoints:[
      'Model tables and grids with 2D lists/arrays using row and column indexes.',
      'Read from and write to individual cells in a 2D structure (e.g. at [row][column]).',
      'Use nested loops over rows and columns to process whole tables in exam-style problems.'
    ],codeSnippet:['seats = [["A","B"],["C","D"]]','print(seats[1][0])']},
    {id:9,title:'Dictionaries',shortDescription:'Grouping related fields and looking up data by key.',keyPoints:[
      'Use records or key–value structures (e.g. Python dictionaries) to group related fields under one identifier.',
      'Implement lookups by ID/key to retrieve or update associated data, as in authentication or scoreboards.',
      'Decide when a look-up structure is more appropriate than a simple array based on how the problem describes the data.'
    ],codeSnippet:['scores = {"Ali": 8, "Sam": 10}','print(scores["Sam"])']},
    {id:10,title:'File Handling',shortDescription:'Saving and loading data from text files.',keyPoints:[
      'Open and close text files correctly, storing the file handle in a variable.',
      'Read from and write to files line by line, often using a loop to process all the data.',
      'Trace and write small algorithms that use file I/O, such as reading scores, updating them and outputting results.'
    ],codeSnippet:['file = open("scores.txt", "r")','line = file.readline()']},
    {id:11,title:'Searching',shortDescription:'Standard searching algorithms for working with lists/arrays.',keyPoints:[
      'Understand and explain how the linear search algorithm works and apply it step by step.',
      'Understand and explain how the binary search algorithm works, including the need for sorted data.',
      'Recognise, trace and compare linear and binary search from code or pseudocode, describing when each is suitable.'
    ],codeSnippet:['if target in items:','    print("Found")']},
    {id:12,title:'Sorting',shortDescription:'Standard sorting algorithms and how to reason about them in exams.',keyPoints:[
      'Understand and explain the steps of bubble sort, including how passes and swaps move values into order.',
      'Understand and explain the main idea of merge sort (and other listed standard sorts), following a given version.',
      'Trace and compare sorting algorithms on small data sets, describing their behaviour and relative efficiency at GCSE level.'
    ],codeSnippet:['if a > b:','    print(b, a)']}
  ];

  const viewport = document.querySelector('.py-info__viewport');
  const pills = Array.from(document.querySelectorAll('.lesson-pill'));
  const prefersReducedMotion = typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const getEls = (slide) => ({
    title: slide.querySelector('.py-info__title'),
    desc: slide.querySelector('.py-info__desc'),
    code: slide.querySelector('.py-info__code'),
    meta: slide.querySelector('.py-info__meta'),
    placeholder: slide.querySelector('.py-info__placeholder'),
  });

  let current = viewport ? viewport.querySelector('.py-info__slide.is-current') : null;
  let next = viewport ? viewport.querySelector('.py-info__slide.is-next') : null;

  const fillSlide = (slide, data) => {
    const els = getEls(slide);
    if (!data) {
      // Placeholder mode
      slide.classList.add('is-placeholder');
      if (els.placeholder) els.placeholder.textContent = 'Please click a lesson to find out more.';
      if (els.title) els.title.textContent = '';
      if (els.desc) els.desc.textContent = '';
      if (els.meta) els.meta.textContent = '';
      if (els.code) els.code.textContent = '';
      return;
    }
    // Content mode (one sentence + code)
    slide.classList.remove('is-placeholder');
    if (els.title) els.title.textContent = `${data.id}. ${data.title}`;
    if (els.desc) els.desc.textContent = data.shortDescription || '';
    if (els.meta) els.meta.textContent = `Lesson ${data.id} of 12`;
    if (els.code) els.code.textContent = (data.codeSnippet || []).join('\n');
  };

  const swapSlides = () => {
    if (!current || !next) return;
    current.classList.remove('is-current');
    current.setAttribute('aria-hidden', 'true');
    next.classList.add('is-current');
    next.removeAttribute('aria-hidden');
    // swap refs
    const tmp = current; current = next; next = tmp;
    // ensure next is ready for subsequent renders
    next.classList.remove('is-current');
    next.setAttribute('aria-hidden', 'true');
  };

  const setActivePill = (btn) => {
    pills.forEach(b => {
      const active = b === btn;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  };

  const render = (lessonId) => {
    const data = lessons.find(l => l.id === lessonId);
    if (!viewport || !current || !next) return;
    fillSlide(next, data);
    if (!prefersReducedMotion) {
      // allow CSS transition to cross-fade
      requestAnimationFrame(swapSlides);
    } else {
      swapSlides();
    }
  };

  pills.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-lesson'), 10);
      const isAlreadyActive = btn.classList.contains('is-active');
      if (isAlreadyActive) {
        // Toggle off and show placeholder
        setActivePill(null);
        fillSlide(next, null);
        swapSlides();
        if (history.replaceState) {
          history.replaceState(null, '', location.pathname + location.search);
        }
        return;
      }
      setActivePill(btn);
      render(id);
      if (history.replaceState) {
        history.replaceState(null, '', `#lesson-${id}`);
      }
    });
  });

  const parseHashLesson = () => {
    const h = (location.hash || '').replace('#','').toLowerCase();
    let id = null;
    if (/^lesson-\d+$/.test(h)) id = parseInt(h.split('-')[1], 10);
    else if (/^\d+$/.test(h)) id = parseInt(h, 10);
    return (id && id >= 1 && id <= 12) ? id : null;
  };

  const initDefault = () => {
    const id = parseHashLesson();
    if (id) {
      const btn = pills.find(b => parseInt(b.getAttribute('data-lesson'), 10) === id);
      if (btn) {
        setActivePill(btn);
        render(id);
        return;
      }
    }
    // placeholder
    if (current) fillSlide(current, null);
  };

  window.addEventListener('hashchange', () => {
    const id = parseHashLesson();
    if (!id) return;
    const btn = pills.find(b => parseInt(b.getAttribute('data-lesson'), 10) === id);
    if (btn) {
      setActivePill(btn);
      render(id);
    }
  });

  initDefault();
})();

// Nav link linger effect: slightly longer fade on hover-out
(function () {
  try {
    const motionQuery = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;
    const prefersReducedMotion = motionQuery ? motionQuery.matches : false;
    if (prefersReducedMotion) return;

    document.querySelectorAll('.topnav__link, .topnav__brand--icon, .topnav__mobile-link, .topnav__mobile-toggle').forEach((el) => {
      el.addEventListener('pointerenter', () => {
        el.classList.remove('is-leaving');
      });
      el.addEventListener('pointerleave', () => {
        el.classList.add('is-leaving');
        window.setTimeout(() => el.classList.remove('is-leaving'), 360);
      });
    });
  } catch (_) {
    // no-op if DOM not ready
  }
})();

 



