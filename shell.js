(function () {
  var PAGE_ORDER = ['index', 'about', 'research', 'design', 'chapters', 'process', 'thanks'];
  var STORAGE_KEY = 'within-nav-indicator';

  var state = {
    navigating: false,
    currentPage: null,
    prevTarget: null,
    nextTarget: null,
    prevArmed: false,
    nextArmed: false,
    threshold: 4,
    delay: 280,
    pullOpenDistance: 240,
    armedLockUntil: 0,
    armedGraceMs: 960,
    armedConfirmReadyAt: 0,
    armedConfirmCooldownMs: 360,
    nextLockUntil: 0,
    nextGraceMs: 960,
    nextConfirmReadyAt: 0,
    nextConfirmCooldownMs: 360
  };

  var nav = document.querySelector('.nav');
  var navIndicator = nav ? nav.querySelector('.nav-indicator') : null;
  var navActiveLink = nav ? nav.querySelector('.nav a.active') : null;
  var pageContentEl = document.getElementById('page-content');
  var pageStylesEl = document.getElementById('page-styles');
  var revealObserver = null;

  function resolveUrl(url) {
    var a = document.createElement('a');
    a.href = url;
    return a.href;
  }

  function isPjaxTarget(href) {
    if (!href) return false;
    if (/(?:about|research|design|chapters|process|thanks)\/index\.html/.test(href)) return true;
    if (/chapter-\d+\/index\.html/.test(href)) return true;
    if (/(?:^|\/|\.\/)index\.html$/.test(href)) return true;
    return false;
  }

  function normalizeNavTarget(href) {
    if (!href) return null;
    if (href.indexOf('about/index.html') !== -1) return 'about';
    if (href.indexOf('research/index.html') !== -1) return 'research';
    if (href.indexOf('design/index.html') !== -1) return 'design';
    if (href.indexOf('chapters/index.html') !== -1) return 'chapters';
    if (href.indexOf('process/index.html') !== -1) return 'process';
    if (href.indexOf('thanks/index.html') !== -1) return 'thanks';
    if (/index\.html(?:[?#].*)?$/.test(href)) return 'index';
    return null;
  }

  function getNavDirection(href) {
    var targetKey = normalizeNavTarget(href);
    var currentIndex = PAGE_ORDER.indexOf(state.currentPage);
    var targetIndex = PAGE_ORDER.indexOf(targetKey);
    if (currentIndex === -1 || targetIndex === -1) return 'next';
    return targetIndex < currentIndex ? 'prev' : 'next';
  }

  function getNavIndicatorMetrics(link) {
    if (!nav || !link) return null;
    return { x: link.offsetLeft, y: link.offsetTop, width: link.offsetWidth, height: link.offsetHeight };
  }

  function applyNavIndicator(metrics, immediate) {
    if (!nav || !navIndicator || !metrics) return;
    if (immediate) {
      var prev = navIndicator.style.transition;
      navIndicator.style.transition = 'none';
      navIndicator.style.width = metrics.width + 'px';
      navIndicator.style.height = metrics.height + 'px';
      navIndicator.style.transform = 'translate(' + metrics.x + 'px,' + metrics.y + 'px)';
      navIndicator.offsetWidth;
      navIndicator.style.transition = prev;
    } else {
      navIndicator.style.width = metrics.width + 'px';
      navIndicator.style.height = metrics.height + 'px';
      navIndicator.style.transform = 'translate(' + metrics.x + 'px,' + metrics.y + 'px)';
    }
    nav.classList.add('is-indicator-ready');
  }

  function saveNavIndicatorMetrics(metrics, pageKey) {
    if (!metrics) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        page: pageKey || null,
        x: metrics.x, y: metrics.y,
        width: metrics.width, height: metrics.height
      }));
    } catch (e) {}
  }

  function syncActiveNavIndicator(immediate) {
    if (!nav) return;
    var activeLink = nav.querySelector('.nav a.active');
    if (!activeLink) return;
    navActiveLink = activeLink;
    var metrics = getNavIndicatorMetrics(activeLink);
    applyNavIndicator(metrics, immediate);
    saveNavIndicatorMetrics(metrics, state.currentPage);
  }

  function animateNavIndicatorFromPrevious() {
    if (!navIndicator || !navActiveLink) return;
    var currentMetrics = getNavIndicatorMetrics(navActiveLink);
    if (!currentMetrics) return;
    var previousMetrics = null;
    try {
      previousMetrics = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null');
    } catch (e) {
      previousMetrics = null;
    }
    if (previousMetrics && typeof previousMetrics.x === 'number' && typeof previousMetrics.y === 'number' &&
        typeof previousMetrics.width === 'number' && typeof previousMetrics.height === 'number') {
      applyNavIndicator(previousMetrics, true);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          applyNavIndicator(currentMetrics, false);
          saveNavIndicatorMetrics(currentMetrics, state.currentPage);
        });
      });
    } else {
      applyNavIndicator(currentMetrics, true);
      saveNavIndicatorMetrics(currentMetrics, state.currentPage);
    }
  }

  function rememberCurrentNavIndicator() {
    if (!nav) return;
    var activeLink = nav.querySelector('.nav a.active');
    if (!activeLink) return;
    saveNavIndicatorMetrics(getNavIndicatorMetrics(activeLink), state.currentPage);
  }

  function moveNavIndicatorToLink(link) {
    if (!link) return;
    var metrics = getNavIndicatorMetrics(link);
    if (!metrics) return;
    applyNavIndicator(metrics, false);
    saveNavIndicatorMetrics(metrics, normalizeNavTarget(link.getAttribute('href')) || state.currentPage);
  }

  function findNavLinkByTarget(href) {
    if (!nav || !href) return null;
    var targetKey = normalizeNavTarget(href);
    if (!targetKey) return null;
    var links = nav.querySelectorAll('.nav a[href]');
    for (var i = 0; i < links.length; i += 1) {
      if (normalizeNavTarget(links[i].getAttribute('href')) === targetKey) {
        return links[i];
      }
    }
    return null;
  }

  function updateNavActive(doc) {
    if (!nav) return;
    var newNavLinks = doc.querySelectorAll('.nav a');
    var currentLinks = nav.querySelectorAll('.nav a');
    var oldActive = nav.querySelector('.nav a.active');
    if (oldActive) oldActive.classList.remove('active');

    for (var i = 0; i < currentLinks.length && i < newNavLinks.length; i++) {
      var nextHref = newNavLinks[i].getAttribute('href');
      if (nextHref) {
        currentLinks[i].setAttribute('href', nextHref);
      }
      currentLinks[i].classList.toggle('active', newNavLinks[i].classList.contains('active'));
      if (currentLinks[i].classList.contains('active')) {
        navActiveLink = currentLinks[i];
      }
    }
  }

  function applyPull(distance) {
    var wrap = pageContentEl ? pageContentEl.querySelector('.wrap') : null;
    if (wrap) {
      wrap.style.transform = distance ? 'translateY(' + distance + 'px)' : '';
    }
  }

  function clearPrevArm() {
    state.prevArmed = false;
    state.armedLockUntil = 0;
    state.armedConfirmReadyAt = 0;
    document.body.classList.remove('is-prev-armed');
  }

  function clearNextArm() {
    state.nextArmed = false;
    state.nextLockUntil = 0;
    state.nextConfirmReadyAt = 0;
    document.body.classList.remove('is-next-armed');
  }

  function openPrevPull() {
    if (!state.prevTarget || state.navigating) return;
    var now = Date.now();
    clearNextArm();
    state.prevArmed = true;
    state.armedLockUntil = now + state.armedGraceMs;
    state.armedConfirmReadyAt = now + state.armedConfirmCooldownMs;
    document.body.classList.add('is-prev-armed');
    applyPull(state.pullOpenDistance);
  }

  function openNextPull() {
    if (!state.nextTarget || state.navigating) return;
    var now = Date.now();
    clearPrevArm();
    state.nextArmed = true;
    state.nextLockUntil = now + state.nextGraceMs;
    state.nextConfirmReadyAt = now + state.nextConfirmCooldownMs;
    document.body.classList.add('is-next-armed');
    applyPull(-state.pullOpenDistance);
  }

  function closePull() {
    clearPrevArm();
    clearNextArm();
    applyPull(0);
  }

  function getMaxScroll() {
    return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }

  function resetWheelState() {
    state.prevArmed = false;
    state.nextArmed = false;
    state.armedLockUntil = 0;
    state.armedConfirmReadyAt = 0;
    state.nextLockUntil = 0;
    state.nextConfirmReadyAt = 0;
    document.body.classList.remove('is-prev-armed', 'is-next-armed');
    applyPull(0);
  }

  function clearRevealAnimations() {
    if (revealObserver) {
      revealObserver.disconnect();
      revealObserver = null;
    }
    if (!pageContentEl) return;
    var revealed = pageContentEl.querySelectorAll('.reveal-item');
    revealed.forEach(function (el) {
      el.classList.remove('reveal-item', 'is-visible');
      el.removeAttribute('data-reveal');
      el.style.removeProperty('--reveal-delay');
    });
  }

  function setupRevealAnimations() {
    if (!pageContentEl) return;
    clearRevealAnimations();

    var selectorMap = {
      about: [
        '.hero',
        '.section',
        '.hero-actions'
      ],
      design: [
        '.hero-note',
        '.section'
      ],
      thanks: [
        '.thanks-card'
      ],
      research: [
        '.hero-note',
        '.section'
      ],
      process: [
        '.chapter-section',
        '.section-block'
      ]
    };

    var selectors = selectorMap[state.currentPage];
    if (!selectors || !selectors.length) return;

    var nodeMap = new Map();
    selectors.forEach(function (selector) {
      pageContentEl.querySelectorAll(selector).forEach(function (el) {
        if (!nodeMap.has(el)) {
          nodeMap.set(el, true);
        }
      });
    });

    var nodes = Array.from(nodeMap.keys());
    if (!nodes.length) return;

    nodes.forEach(function (el, index) {
      el.classList.add('reveal-item');
      el.style.setProperty('--reveal-delay', Math.min(index * 56, 320) + 'ms');
      if (el.matches('.hero, .thanks-card')) {
        el.setAttribute('data-reveal', 'hero');
      } else if (el.matches('.hero-actions, .steps, .gallery, .chapter-section, .section-block')) {
        el.setAttribute('data-reveal', 'soft');
      }
    });

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nodes.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, {
      threshold: 0.14,
      rootMargin: '0px 0px -8% 0px'
    });

    nodes.forEach(function (el, index) {
      if (index < 2) {
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            el.classList.add('is-visible');
          });
        });
      } else {
        revealObserver.observe(el);
      }
    });
  }

  function loadPage(url, mode, direction) {
    if (state.navigating) return;
    if (!isPjaxTarget(url)) {
      window.location.href = url;
      return;
    }
    state.navigating = true;

    if (mode !== 'click') {
      rememberCurrentNavIndicator();
      moveNavIndicatorToLink(findNavLinkByTarget(url));
    }
    closePull();

    var leaveClass = mode === 'click' ? 'is-leaving-click'
      : (direction === 'prev' ? 'is-leaving-prev' : 'is-leaving-next');
    document.body.classList.add(leaveClass);

    var absoluteUrl = resolveUrl(url);

    var fetchPromise = fetch(url, { credentials: 'same-origin' })
      .then(function (res) { return res.text(); });

    var animDelay = mode === 'click' ? 150 : state.delay;

    setTimeout(function () {
      fetchPromise.then(function (html) {
        swapPage(html, absoluteUrl, mode, direction);
      }).catch(function () {
        window.location.href = url;
      });
    }, animDelay);
  }

  function swapPage(html, absoluteUrl, mode, direction) {
    var doc;
    try {
      doc = new DOMParser().parseFromString(html, 'text/html');
    } catch (e) {
      state.navigating = false;
      window.location.href = absoluteUrl;
      return;
    }

    try {
      var enterClass = mode === 'click' ? 'is-entering-click'
        : (direction === 'prev' ? 'is-entering-prev' : 'is-entering-next');

      document.body.classList.add(enterClass);

      document.body.classList.remove('is-leaving-click', 'is-leaving-prev', 'is-leaving-next');

      document.title = doc.title;

      var oldPageClass = document.body.className.match(/page-\S+/g);
      if (oldPageClass) {
        oldPageClass.forEach(function (c) { document.body.classList.remove(c); });
      }
      var newPageClass = doc.body.className.match(/page-\S+/g);
      if (newPageClass) {
        newPageClass.forEach(function (c) { document.body.classList.add(c); });
      }

      if (typeof window.__chapterBoardCleanup === 'function') {
        try {
          window.__chapterBoardCleanup();
        } catch (e) {}
      }
      if (typeof window.__designMechanismCleanup === 'function') {
        try {
          window.__designMechanismCleanup();
        } catch (e) {}
      }
      if (typeof window.__pageCleanup === 'function') {
        try {
          window.__pageCleanup();
        } catch (e) {}
      }
      document.body.style.overflow = '';

      var newStyles = doc.getElementById('page-styles');
      if (pageStylesEl && newStyles) {
        pageStylesEl.textContent = newStyles.textContent;
      }

      var newContent = doc.getElementById('page-content');
      if (pageContentEl && newContent) {
        pageContentEl.innerHTML = newContent.innerHTML;
      }

      updateNavActive(doc);

      var configScript = doc.getElementById('page-config');
      if (configScript) {
        try {
          (0, eval)(configScript.textContent);
        } catch (e) {}
      }
      var config = window.__pageConfig || {};
      state.currentPage = config.current || 'index';
      state.prevTarget = config.prev || null;
      state.nextTarget = config.next || null;

      var oldPageScript = document.getElementById('page-script');
      if (oldPageScript) oldPageScript.remove();

      var newPageScript = doc.getElementById('page-script');
      if (newPageScript) {
        var scriptEl = document.createElement('script');
        scriptEl.id = 'page-script';
        scriptEl.textContent = '(function(){' + newPageScript.textContent + '})();';
        document.body.appendChild(scriptEl);
      }

      document.body.offsetHeight;

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          document.body.classList.remove(enterClass);
        });
      });

      try {
        history.pushState({ page: state.currentPage, url: absoluteUrl }, '', absoluteUrl);
      } catch (e) {}

      resetWheelState();
      state.navigating = false;
      window.scrollTo(0, 0);

      animateNavIndicatorFromPrevious();
      setupRevealAnimations();
      preloadAdjacentImages();

    } catch (e) {
      state.navigating = false;
      window.location.href = absoluteUrl;
    }
  }

  function preloadAdjacentImages() {
    var targets = [state.prevTarget, state.nextTarget];
    targets.forEach(function (url) {
      if (!url || !/chapter-\d+/.test(url)) return;
      var base = url.replace(/index\.html$/, '');
      var img = new Image();
      img.src = base + 'images/overview.webp';
    });
  }

  function handleWheel(event) {
    if (event.ctrlKey || event.metaKey) {
      return;
    }

    if (state.navigating) {
      event.preventDefault();
      return;
    }

    var atTop = window.scrollY <= state.threshold;
    var maxScroll = getMaxScroll();
    var atBottom = window.scrollY >= maxScroll - state.threshold;

    if (state.prevArmed) {
      event.preventDefault();
      var now = Date.now();
      if (event.deltaY < -8 && state.prevTarget) {
        if (now < state.armedConfirmReadyAt) return;
        loadPage(state.prevTarget, 'wheel', 'prev');
        return;
      }
      if (event.deltaY > 10 && now >= state.armedLockUntil) {
        closePull();
      }
      return;
    }

    if (state.nextArmed) {
      event.preventDefault();
      var nowNext = Date.now();
      if (event.deltaY > 8 && state.nextTarget) {
        if (nowNext < state.nextConfirmReadyAt) return;
        loadPage(state.nextTarget, 'wheel', 'next');
        return;
      }
      if (event.deltaY < -10 && nowNext >= state.nextLockUntil) {
        closePull();
      }
      return;
    }

    if (event.deltaY < -12 && atTop && state.prevTarget) {
      event.preventDefault();
      openPrevPull();
      return;
    }

    if (event.deltaY > 12 && atBottom && state.nextTarget) {
      event.preventDefault();
      openNextPull();
      return;
    }

    if (!atTop && !atBottom) {
      closePull();
    }
  }

  function handleScroll() {
    var maxScroll = getMaxScroll();
    if (state.prevArmed) {
      if (window.scrollY > state.threshold + 2) window.scrollTo(0, 0);
      return;
    }
    if (state.nextArmed) {
      if (window.scrollY < maxScroll - state.threshold - 2) window.scrollTo(0, maxScroll);
      return;
    }
    if (window.scrollY > state.threshold + 2 && window.scrollY < maxScroll - state.threshold - 2) {
      closePull();
    }
  }

  function bindNavLinks() {
    if (!nav) return;
    var navLinks = nav.querySelectorAll('.nav a[href]');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function (event) {
        if (state.navigating) { event.preventDefault(); return; }
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        var href = link.getAttribute('href');
        if (!href) return;
        var absoluteHref = new URL(href, window.location.href).href;
        var currentHref = window.location.href.split('#')[0];
        if (absoluteHref === currentHref) return;
        event.preventDefault();
        moveNavIndicatorToLink(link);
        var direction = getNavDirection(href);
        loadPage(href, 'click', direction);
      });
    });
  }

  function handlePopState(event) {
    if (!event.state || !event.state.url) return;
    var url = event.state.url;
    if (!isPjaxTarget(url)) {
      window.location.href = url;
      return;
    }
    state.navigating = true;
    rememberCurrentNavIndicator();
    document.body.classList.add('is-leaving-click');
    fetch(url, { credentials: 'same-origin' })
      .then(function (res) { return res.text(); })
      .then(function (html) {
        var direction = 'next';
        if (event.state.page) {
          var targetIdx = PAGE_ORDER.indexOf(event.state.page);
          var currentIdx = PAGE_ORDER.indexOf(state.currentPage);
          if (targetIdx !== -1 && currentIdx !== -1 && targetIdx < currentIdx) direction = 'prev';
        }
        swapPage(html, url, 'popstate', direction);
      })
      .catch(function () { window.location.href = url; });
  }

  function init() {
    var config = window.__pageConfig || {};
    state.currentPage = config.current || 'index';
    state.prevTarget = config.prev || null;
    state.nextTarget = config.next || null;

    navActiveLink = nav ? nav.querySelector('.nav a.active') : null;

    bindNavLinks();
    animateNavIndicatorFromPrevious();
    setupRevealAnimations();

    window.addEventListener('resize', function () { syncActiveNavIndicator(true); }, { passive: true });
    if (nav) {
      nav.addEventListener('scroll', function () { syncActiveNavIndicator(true); }, { passive: true });
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { syncActiveNavIndicator(true); });
    }

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('popstate', handlePopState);

    try {
      history.replaceState({ page: state.currentPage, url: window.location.href }, '', window.location.href);
    } catch (e) {}
  }

  init();
})();
