(function () {
  'use strict';

  var isDarkMode = true;

  /* ========== Theme ========== */
  function updateThemeIcons() {
    var moonIcon = document.getElementById('moonIcon');
    var sunIcon = document.getElementById('sunIcon');
    var toggle = document.getElementById('themeToggle');
    if (!moonIcon || !sunIcon) return;
    if (isDarkMode) {
      moonIcon.classList.add('icon-visible');
      moonIcon.classList.remove('icon-hidden');
      sunIcon.classList.add('icon-hidden');
      sunIcon.classList.remove('icon-visible');
    } else {
      moonIcon.classList.add('icon-hidden');
      moonIcon.classList.remove('icon-visible');
      sunIcon.classList.add('icon-visible');
      sunIcon.classList.remove('icon-hidden');
    }
    if (toggle) toggle.setAttribute('aria-pressed', String(isDarkMode));
  }

  function setTheme(dark) {
    isDarkMode = dark;
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    updateThemeIcons();
  }

  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      setTheme(!isDarkMode);
    });
  }

  /* ========== Mobile Menu ========== */
  var mobileMenuBtn = document.getElementById('mobileMenuBtn');
  var mobileMenuClose = document.getElementById('mobileMenuClose');
  var mobileNav = document.getElementById('mobileNav');
  var overlay = document.getElementById('overlay');
  var lastFocusedElement = null;

  function openMobileMenu() {
    lastFocusedElement = document.activeElement;
    if (mobileNav) {
      mobileNav.classList.add('open');
      mobileNav.setAttribute('aria-hidden', 'false');
    }
    if (overlay) overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
    if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'true');
    var firstLink = mobileNav ? mobileNav.querySelector('button, a[href]') : null;
    if (firstLink) setTimeout(function () { firstLink.focus(); }, 50);
  }

  function closeMobileMenu() {
    if (mobileNav) {
      mobileNav.classList.remove('open');
      mobileNav.setAttribute('aria-hidden', 'true');
    }
    if (overlay) overlay.classList.remove('visible');
    document.body.style.overflow = '';
    if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
    if (lastFocusedElement) setTimeout(function () { lastFocusedElement.focus(); }, 50);
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileMenu);
  if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);
  if (overlay) overlay.addEventListener('click', closeMobileMenu);

  if (mobileNav) {
    mobileNav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  function trapFocus(e) {
    if (!mobileNav || !mobileNav.classList.contains('open')) return;
    var focusable = mobileNav.querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable.length === 0) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }

  if (mobileNav) mobileNav.addEventListener('keydown', trapFocus);

  /* Close drawer on resize to desktop */
  var resizeTimeout;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
      if (window.innerWidth > 1024 && mobileNav && mobileNav.classList.contains('open')) {
        closeMobileMenu();
      }
    }, 150);
  }, { passive: true });

  /* ========== Accordion ========== */
  document.querySelectorAll('.accordion-header').forEach(function (header) {
    header.addEventListener('click', function () {
      var item = header.parentElement;
      var isOpen = item.classList.contains('open');

      document.querySelectorAll('.accordion-item.open').forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove('open');
          var h = openItem.querySelector('.accordion-header');
          if (h) h.setAttribute('aria-expanded', 'false');
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        header.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        header.setAttribute('aria-expanded', 'true');
      }
    });

    header.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        var items = Array.from(document.querySelectorAll('.accordion-header'));
        var idx = items.indexOf(header);
        var next;
        if (e.key === 'ArrowDown') {
          next = items[(idx + 1) % items.length];
        } else {
          next = items[(idx - 1 + items.length) % items.length];
        }
        if (next) next.focus();
      }
      if (e.key === 'Home') {
        e.preventDefault();
        var items = document.querySelectorAll('.accordion-header');
        if (items[0]) items[0].focus();
      }
      if (e.key === 'End') {
        e.preventDefault();
        var items = document.querySelectorAll('.accordion-header');
        if (items[items.length - 1]) items[items.length - 1].focus();
      }
    });
  });

  /* ========== Scroll Reveal ========== */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.reveal, .stagger').forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ========== Active Section Nav ========== */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.sidebar-nav .nav-link, .mobile-nav-drawer .nav-link');

  var navObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.getAttribute('id');
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-80px 0px -40% 0px'
  });

  sections.forEach(function (section) {
    navObserver.observe(section);
  });

  /* ========== Clipboard ========== */
  function copyToClipboard(text, btn) {
    if (!text || !btn) return Promise.resolve();

    function onSuccess() {
      var original = btn.textContent;
      btn.textContent = 'Copied \u2713';
      btn.classList.add('copied');
      btn.setAttribute('aria-live', 'polite');
      setTimeout(function () {
        btn.textContent = original || 'Copy';
        btn.classList.remove('copied');
      }, 2000);
    }

    function onFail() {
      btn.textContent = 'Failed';
      setTimeout(function () {
        btn.textContent = 'Copy';
      }, 2000);
    }

    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(onSuccess).catch(onFail);
    }

    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      var ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (ok) { onSuccess(); } else { onFail(); }
    } catch (err) {
      document.body.removeChild(textarea);
      onFail();
    }
    return Promise.resolve();
  }

  document.querySelectorAll('.copy-btn[data-action="copy-code"]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var codeBlock = btn.closest('.code-block');
      if (!codeBlock) return;
      var codeEl = codeBlock.querySelector('code');
      if (!codeEl) return;
      copyToClipboard(codeEl.textContent, btn);
    });
  });

  /* ========== Prompt Generator ========== */
  function generatePrompt() {
    var fields = {
      sysIdentity: document.getElementById('sysIdentity'),
      sysCapabilities: document.getElementById('sysCapabilities'),
      sysConstraints: document.getElementById('sysConstraints'),
      sysScope: document.getElementById('sysScope'),
      taskDirective: document.getElementById('taskDirective'),
      taskOutput: document.getElementById('taskOutput'),
      taskEvidence: document.getElementById('taskEvidence'),
      taskSuccess: document.getElementById('taskSuccess'),
      toolIndex: document.getElementById('toolIndex'),
      toolThreshold: document.getElementById('toolThreshold'),
      toolDepth: document.getElementById('toolDepth'),
      memEpisodes: document.getElementById('memEpisodes'),
      memPlaybook: document.getElementById('memPlaybook'),
      memAnti: document.getElementById('memAnti'),
      memCompression: document.getElementById('memCompression'),
      routeCategory: document.getElementById('routeCategory'),
      routeTrigger: document.getElementById('routeTrigger'),
      routeHandoff: document.getElementById('routeHandoff')
    };

    if (!fields.sysIdentity || !fields.toolThreshold || !fields.memCompression || !fields.routeCategory) return;

    var thresholdVal = parseInt(fields.toolThreshold.value, 10) || 80;
    var threshold = thresholdVal / 100;

    var compressionLabels = {
      'session_end': 'End of session',
      'threshold_count': 'After N interactions',
      'manual': 'Manual only',
      'realtime': 'Real-time'
    };

    var categoryLabels = {
      'code_review': 'Code Review',
      'architecture': 'Architecture Design',
      'debugging': 'Debugging',
      'documentation': 'Documentation',
      'testing': 'Testing',
      'security': 'Security Audit',
      'performance': 'Performance Analysis',
      'custom': 'Custom'
    };

    function formatList(str) {
      return (str || '').split('\n').filter(function (l) { return l.trim(); }).map(function (l) { return '- ' + l.trim(); }).join('\n') || '- None specified';
    }

    function formatCSV(str) {
      return (str || '').split(',').map(function (c) { return '- ' + c.trim(); }).join('\n');
    }

    function val(field) {
      return (field && field.value) || '';
    }

    function def(field, fallback) {
      return val(field) || fallback;
    }

    var prompt = '=== SYSTEM PROMPT ===\n\n'
      + '## Layer 1: System\n\n'
      + '**Identity:** ' + def(fields.sysIdentity, 'You are an expert agent') + '\n\n'
      + '**Capabilities:**\n' + formatCSV(val(fields.sysCapabilities) || 'General reasoning and task completion') + '\n\n'
      + '**Hard Constraints:**\n' + formatList(val(fields.sysConstraints) || 'None specified') + '\n\n'
      + '**Domain Scope:** ' + def(fields.sysScope, 'General domain') + '\n\n'
      + '## Layer 2: Task\n\n'
      + '**Primary Directive:** ' + def(fields.taskDirective, 'Complete the assigned task to the best of your ability') + '\n\n'
      + '**Output Format:** ' + def(fields.taskOutput, 'Plain text response') + '\n\n'
      + '**Evidentiary Standard:** ' + def(fields.taskEvidence, 'Standard evidentiary requirements') + '\n\n'
      + '**Success Criterion:** ' + def(fields.taskSuccess, 'Task completed satisfactorily') + '\n\n'
      + '## Layer 3: Tools\n\n'
      + '**Available Tools (Index Only \u2014 full schemas loaded JIT if relevance >= ' + threshold.toFixed(2) + '):**\n' + formatList(val(fields.toolIndex) || 'No tools specified') + '\n\n'
      + '**Max Tool Chain Depth:** ' + def(fields.toolDepth, '3') + '\n\n'
      + '## Layer 4: Memory\n\n'
      + '**Episodic Context (decays by half-life):**\n' + formatList(val(fields.memEpisodes) || 'No episodic context') + '\n\n'
      + '**Playbook Patterns (pinned, persistent):**\n' + formatList(val(fields.memPlaybook) || 'No Playbook patterns') + '\n\n'
      + '**Anti-Patterns (strictly forbidden):**\n' + formatList(val(fields.memAnti) || 'No anti-patterns specified') + '\n\n'
      + '**Compression Trigger:** ' + (compressionLabels[fields.memCompression.value] || fields.memCompression.value) + '\n\n'
      + '## Layer 5: Routing\n\n'
      + '**Task Category:** ' + (categoryLabels[fields.routeCategory.value] || fields.routeCategory.value) + '\n\n'
      + '**Sub-Agent Trigger:** ' + def(fields.routeTrigger, 'No sub-agent trigger specified') + '\n\n'
      + '**Handoff Format:** ' + def(fields.routeHandoff, 'No handoff format specified') + '\n\n'
      + '---\n'
      + '**Context Budget:** System + Task always loaded. Tool/Memory/Routing layers loaded dynamically based on relevance threshold (' + threshold.toFixed(2) + ').';

    var outputArea = document.getElementById('outputArea');
    var generatedPrompt = document.getElementById('generatedPrompt');
    if (!outputArea || !generatedPrompt) return;

    var codeEl = generatedPrompt.querySelector('code');
    if (codeEl) codeEl.textContent = prompt;
    outputArea.style.display = 'block';
    outputArea.scrollIntoView({ behavior: 'smooth', block: 'start' });

    /* Update URL hash for shareability */
    history.pushState(null, '', '#blueprint');
  }

  var promptForm = document.getElementById('promptForm');
  if (promptForm) {
    promptForm.addEventListener('submit', function (e) {
      e.preventDefault();
      generatePrompt();
    });
  }

  var copyPromptBtn = document.getElementById('copyPromptBtn');
  if (copyPromptBtn) {
    copyPromptBtn.addEventListener('click', function () {
      var generatedPrompt = document.getElementById('generatedPrompt');
      if (!generatedPrompt) return;
      var codeEl = generatedPrompt.querySelector('code');
      if (!codeEl) return;
      copyToClipboard(codeEl.textContent, copyPromptBtn);
    });
  }

  /* ========== Slider ARIA ========== */
  var toolThreshold = document.getElementById('toolThreshold');
  var thresholdValue = document.getElementById('thresholdValue');
  if (toolThreshold && thresholdValue) {
    toolThreshold.addEventListener('input', function () {
      var val = (parseInt(this.value, 10) / 100).toFixed(2);
      thresholdValue.textContent = val;
      this.setAttribute('aria-valuenow', val);
      this.setAttribute('aria-valuetext', val);
    });
  }

  /* ========== Smooth Scroll + History ========== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        history.pushState(null, '', targetId);
      }
    });
  });

  /* ========== Back to Top ========== */
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    var scrollObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          backToTop.classList.add('visible');
        } else {
          backToTop.classList.remove('visible');
        }
      });
    });

    var heroSection = document.getElementById('hero');
    if (heroSection) scrollObserver.observe(heroSection);

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      history.pushState(null, '', ' ');
    });
  }

  /* ========== Init ========== */
  document.querySelectorAll('.accordion-item.open').forEach(function (item) {
    var header = item.querySelector('.accordion-header');
    if (header) header.setAttribute('aria-expanded', 'true');
  });

  /* Remove no-js class since JS loaded */
  document.documentElement.classList.remove('no-js');
})();
