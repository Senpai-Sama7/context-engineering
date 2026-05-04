(function () {
  'use strict';

  var isDarkMode = true;

  function sanitize(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function updateThemeIcons() {
    var moonIcon = document.getElementById('moonIcon');
    var sunIcon = document.getElementById('sunIcon');
    var toggle = document.getElementById('themeToggle');
    if (!moonIcon || !sunIcon) return;
    if (isDarkMode) {
      moonIcon.style.display = 'block';
      sunIcon.style.display = 'none';
    } else {
      moonIcon.style.display = 'none';
      sunIcon.style.display = 'block';
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
    var firstLink = mobileNav ? mobileNav.querySelector('.nav-link') : null;
    if (firstLink) firstLink.focus();
  }

  function closeMobileMenu() {
    if (mobileNav) {
      mobileNav.classList.remove('open');
      mobileNav.setAttribute('aria-hidden', 'true');
    }
    if (overlay) overlay.classList.remove('visible');
    document.body.style.overflow = '';
    if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
    if (lastFocusedElement) lastFocusedElement.focus();
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
    });
  });

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

  function copyToClipboard(text, btn) {
    if (!text) return Promise.resolve();
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(function () {
        btn.textContent = 'Copied \u2713';
        btn.classList.add('copied');
        setTimeout(function () {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 2000);
      });
    }
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      btn.textContent = 'Copied \u2713';
      btn.classList.add('copied');
      setTimeout(function () {
        btn.textContent = 'Copy';
        btn.classList.remove('copied');
      }, 2000);
    } catch (err) {
      btn.textContent = 'Failed';
      setTimeout(function () {
        btn.textContent = 'Copy';
      }, 2000);
    }
    document.body.removeChild(textarea);
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

  function generatePrompt() {
    var sysIdentity = document.getElementById('sysIdentity');
    var sysCapabilities = document.getElementById('sysCapabilities');
    var sysConstraints = document.getElementById('sysConstraints');
    var sysScope = document.getElementById('sysScope');

    var taskDirective = document.getElementById('taskDirective');
    var taskOutput = document.getElementById('taskOutput');
    var taskEvidence = document.getElementById('taskEvidence');
    var taskSuccess = document.getElementById('taskSuccess');

    var toolIndex = document.getElementById('toolIndex');
    var toolThreshold = document.getElementById('toolThreshold');
    var toolDepth = document.getElementById('toolDepth');

    var memEpisodes = document.getElementById('memEpisodes');
    var memPlaybook = document.getElementById('memPlaybook');
    var memAnti = document.getElementById('memAnti');
    var memCompression = document.getElementById('memCompression');

    var routeCategory = document.getElementById('routeCategory');
    var routeTrigger = document.getElementById('routeTrigger');
    var routeHandoff = document.getElementById('routeHandoff');

    if (!sysIdentity || !toolThreshold || !memCompression || !routeCategory) return;

    var identity = sysIdentity.value || 'You are an expert agent';
    var capabilities = sysCapabilities.value || 'General reasoning and task completion';
    var constraints = sysConstraints.value || 'None specified';
    var scope = sysScope.value || 'General domain';

    var directive = taskDirective.value || 'Complete the assigned task to the best of your ability';
    var output = taskOutput.value || 'Plain text response';
    var evidence = taskEvidence.value || 'Standard evidentiary requirements';
    var success = taskSuccess.value || 'Task completed satisfactorily';

    var tIndex = toolIndex.value || 'No tools specified';
    var threshold = parseInt(toolThreshold.value, 10) / 100;
    var depth = toolDepth.value || '3';

    var episodes = memEpisodes.value || 'No episodic context';
    var playbook = memPlaybook.value || 'No Playbook patterns';
    var anti = memAnti.value || 'No anti-patterns specified';
    var compression = memCompression.value;

    var category = routeCategory.value;
    var trigger = routeTrigger.value || 'No sub-agent trigger specified';
    var handoff = routeHandoff.value || 'No handoff format specified';

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
      return str.split('\n').filter(function (l) { return l.trim(); }).map(function (l) { return '- ' + l.trim(); }).join('\n') || '- None specified';
    }

    function formatCSV(str) {
      return str.split(',').map(function (c) { return '- ' + c.trim(); }).join('\n');
    }

    var prompt = '=== SYSTEM PROMPT ===\n\n'
      + '## Layer 1: System\n\n'
      + '**Identity:** ' + identity + '\n\n'
      + '**Capabilities:**\n' + formatCSV(capabilities) + '\n\n'
      + '**Hard Constraints:**\n' + formatList(constraints) + '\n\n'
      + '**Domain Scope:** ' + scope + '\n\n'
      + '## Layer 2: Task\n\n'
      + '**Primary Directive:** ' + directive + '\n\n'
      + '**Output Format:** ' + output + '\n\n'
      + '**Evidentiary Standard:** ' + evidence + '\n\n'
      + '**Success Criterion:** ' + success + '\n\n'
      + '## Layer 3: Tools\n\n'
      + '**Available Tools (Index Only \u2014 full schemas loaded JIT if relevance >= ' + threshold.toFixed(2) + '):**\n' + formatList(tIndex) + '\n\n'
      + '**Max Tool Chain Depth:** ' + depth + '\n\n'
      + '## Layer 4: Memory\n\n'
      + '**Episodic Context (decays by half-life):**\n' + formatList(episodes) + '\n\n'
      + '**Playbook Patterns (pinned, persistent):**\n' + formatList(playbook) + '\n\n'
      + '**Anti-Patterns (strictly forbidden):**\n' + formatList(anti) + '\n\n'
      + '**Compression Trigger:** ' + (compressionLabels[compression] || compression) + '\n\n'
      + '## Layer 5: Routing\n\n'
      + '**Task Category:** ' + (categoryLabels[category] || category) + '\n\n'
      + '**Sub-Agent Trigger:** ' + trigger + '\n\n'
      + '**Handoff Format:** ' + handoff + '\n\n'
      + '---\n'
      + '**Context Budget:** System + Task always loaded. Tool/Memory/Routing layers loaded dynamically based on relevance threshold (' + threshold.toFixed(2) + ').';

    var outputArea = document.getElementById('outputArea');
    var generatedPrompt = document.getElementById('generatedPrompt');
    if (!outputArea || !generatedPrompt) return;

    var codeEl = generatedPrompt.querySelector('code');
    if (codeEl) codeEl.textContent = prompt;
    outputArea.style.display = 'block';
    outputArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  document.querySelectorAll('.accordion-item.open').forEach(function (item) {
    var header = item.querySelector('.accordion-header');
    if (header) header.setAttribute('aria-expanded', 'true');
  });
})();
