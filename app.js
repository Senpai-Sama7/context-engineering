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

      syncLayerStack(item.id ? item.id.replace('layer', '') : '');
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

  /* ========== Layer Stack Diagram ========== */
  function syncLayerStack(activeLayer) {
    var stackItems = document.querySelectorAll('.layer-stack-item');
    stackItems.forEach(function (si) {
      if (si.getAttribute('data-layer') === String(activeLayer)) {
        si.classList.add('active');
      } else {
        si.classList.remove('active');
      }
    });
  }

  function activateLayerStack(item) {
    var layerNum = item.getAttribute('data-layer');
    var accordionItem = document.getElementById('layer' + layerNum);
    if (!accordionItem) return;

    var wasOpen = accordionItem.classList.contains('open');
    document.querySelectorAll('.accordion-item.open').forEach(function (openItem) {
      openItem.classList.remove('open');
      var h = openItem.querySelector('.accordion-header');
      if (h) h.setAttribute('aria-expanded', 'false');
    });

    if (!wasOpen) {
      accordionItem.classList.add('open');
      var header = accordionItem.querySelector('.accordion-header');
      if (header) header.setAttribute('aria-expanded', 'true');
    }

    syncLayerStack(wasOpen ? '' : layerNum);
    accordionItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.querySelectorAll('.layer-stack-item').forEach(function (item) {
    item.addEventListener('click', function () {
      activateLayerStack(item);
    });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activateLayerStack(item);
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

  /* ========== Animated Counters ========== */
  var counters = document.querySelectorAll('.stat-value[data-count]');
  var countedSet = new Set();

  function animateCounter(el) {
    if (countedSet.has(el)) return;
    countedSet.add(el);

    var display = el.querySelector('.counter-display');
    if (!display) display = el;

    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var isFloat = String(target).indexOf('.') !== -1;
    var duration = 1500;
    var start = performance.now();

    function step(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = target * eased;

      if (isFloat) {
        display.textContent = current.toFixed(1) + suffix;
      } else {
        display.textContent = Math.round(current) + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        display.textContent = (isFloat ? target.toFixed(1) : String(target)) + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function (c) { counterObserver.observe(c); });

  /* ========== Reading Progress Bar ========== */
  var progressBar = document.getElementById('readingProgress');

  function updateReadingProgress() {
    if (!progressBar) return;
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var percent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = percent + '%';
  }

  /* ========== Sidebar Progress ========== */
  var sidebarFill = document.getElementById('sidebarProgressFill');

  function updateSidebarProgress() {
    if (!sidebarFill) return;
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var percent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    sidebarFill.style.height = percent + '%';
  }

  window.addEventListener('scroll', function () {
    updateReadingProgress();
    updateSidebarProgress();
  }, { passive: true });

  updateReadingProgress();
  updateSidebarProgress();

  /* ========== Card Spotlight Effect ========== */
  document.querySelectorAll('.card-interactive').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', x + 'px');
      card.style.setProperty('--mouse-y', y + 'px');
    });
  });

  /* ========== Hero Particles ========== */
  var heroParticles = document.getElementById('heroParticles');
  var heroCanvas = heroParticles ? heroParticles.querySelector('canvas') : null;

  if (heroCanvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var ctx = heroCanvas.getContext('2d');
    var particles = [];
    var particleCount = 50;
    var animationId;

    function resizeCanvas() {
      var parent = heroCanvas.parentElement;
      if (!parent) return;
      heroCanvas.width = parent.offsetWidth;
      heroCanvas.height = parent.offsetHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 200);
    });

    function createParticle() {
      return {
        x: Math.random() * heroCanvas.width,
        y: Math.random() * heroCanvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.3 + 0.1
      };
    }

    for (var i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }

    function drawParticles() {
      ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);

      var r, g, b;
      if (isDarkMode) {
        r = 79; g = 152; b = 163;
      } else {
        r = 1; g = 105; b = 111;
      }

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = heroCanvas.width;
        if (p.x > heroCanvas.width) p.x = 0;
        if (p.y < 0) p.y = heroCanvas.height;
        if (p.y > heroCanvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + p.opacity + ')';
        ctx.fill();
      }

      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            var alpha = (1 - dist / 120) * 0.08;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(drawParticles);
    }

    drawParticles();
  }

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

  /* ========== Hero Typing Effect ========== */
  var heroHeadline = document.getElementById('heroHeadline');
  if (heroHeadline && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var fullText = 'The Agentic Practitioner Playbook';
    var cursor = heroHeadline.querySelector('.typing-cursor');
    heroHeadline.textContent = '';
    if (cursor) heroHeadline.appendChild(cursor);

    var charIndex = 0;
    var typingDelay = 45;

    function typeNextChar() {
      if (charIndex < fullText.length) {
        var textNode = document.createTextNode(fullText[charIndex]);
        if (cursor) {
          heroHeadline.insertBefore(textNode, cursor);
        } else {
          heroHeadline.appendChild(textNode);
        }
        charIndex++;
        setTimeout(typeNextChar, typingDelay);
      }
    }

    setTimeout(typeNextChar, 400);
  }

  /* ========== Jargon Explainer System ========== */
  var glossary = {
    'context engineering': {
      def: 'The art of deciding what information to give an AI, in what order, so it gives the best answers. Think of it like packing a backpack for a trip — you only bring what you need, organized so you can find things fast.',
      see: ['context window', 'working memory', 'token budget']
    },
    'context window': {
      def: 'The AI\'s short-term memory. It\'s like a whiteboard that can only hold so many words before old ones get erased. Once the whiteboard is full, the AI forgets what was written first.',
      see: ['working memory', 'token', 'context rot', 'attention dilution']
    },
    'working memory': {
      def: 'What the AI is actively thinking about right now — just like when you\'re solving a math problem and holding numbers in your head. Everything else is either stored elsewhere or forgotten.',
      see: ['context window', 'episodic memory', 'semantic memory']
    },
    'token': {
      def: 'A chunk of text the AI reads — roughly 3/4 of an English word. "Hello world" is about 3 tokens. Think of tokens like cents in a dollar: the AI has a budget of how many it can use in one go.',
      see: ['token budget', 'context window']
    },
    'token budget': {
      def: 'The maximum number of tokens (word-chunks) the AI can handle in one conversation. Like a gas tank — when it runs out, the AI can\'t process any more information until you start fresh.',
      see: ['token', 'context window', 'context engineering']
    },
    'agentic system': {
      def: 'An AI that doesn\'t just answer questions — it can use tools, make decisions, and complete multi-step tasks on its own. Like a robot assistant that can fetch files, run tests, and fix bugs without being told each tiny step.',
      see: ['agent', 'sub-agent', 'multi-agent orchestration']
    },
    'agent': {
      def: 'A single AI instance with a specific job. Think of it like one employee on a team — they have their own instructions, their own tools, and a clear task to finish.',
      see: ['agentic system', 'sub-agent', 'system prompt']
    },
    'sub-agent': {
      def: 'A helper AI that gets spawned (created) to do one specific piece of a bigger job. Like asking a specialist to handle one part of a group project while you work on something else. Once they finish, they report back.',
      see: ['agent', 'context isolation', 'handoff format']
    },
    'multi-agent orchestration': {
      def: 'Managing multiple AI agents working together, like a conductor leading an orchestra. The orchestrator decides who does what, passes the right information to each, and makes sure nobody steps on each other\'s toes.',
      see: ['agent', 'sub-agent', 'semantic routing', 'context isolation']
    },
    'system prompt': {
      def: 'The permanent instructions given to an AI at the start — who it is, what it can do, what it must never do. Like the rules sheet a teacher hands out on the first day of class. It stays visible the whole time.',
      see: ['prompt', 'prompt engineering', 'system layer']
    },
    'prompt': {
      def: 'The text you give an AI to tell it what to do. It can be a question, a command, or a whole set of instructions. The quality of your prompt directly determines the quality of the answer.',
      see: ['system prompt', 'prompt engineering', 'context engineering']
    },
    'prompt engineering': {
      def: 'The skill of writing good instructions for AI. Writing a prompt is like writing a recipe — if you say "make food" you get something random; if you list ingredients and steps, you get what you want.',
      see: ['prompt', 'system prompt', 'context engineering']
    },
    'ambiguity': {
      def: 'When instructions are unclear or could mean multiple things. If you tell someone "get the paper" without saying which one or from where, that\'s ambiguity. The AI guesses — and often guesses wrong.',
      see: ['distractor interference', 'context rot', 'attention dilution']
    },
    'distractor interference': {
      def: 'Too much irrelevant information drowning out what actually matters. Like trying to hear a friend in a loud cafeteria — the noise makes it hard to focus on the conversation that counts.',
      see: ['context rot', 'attention dilution', 'ambiguity', 'context window']
    },
    'context rot': {
      def: 'Instructions getting weaker over time as more conversation piles up. Like a game of telephone — the original message gets distorted the longer the chain goes. Earlier rules start getting ignored.',
      see: ['distractor interference', 'attention dilution', 'context window']
    },
    'attention dilution': {
      def: 'When an AI\'s focus spreads too thin across too much text. Like trying to read 10 books at once — you don\'t deeply understand any of them. The more you give it, the less attention each piece gets.',
      see: ['distractor interference', 'context rot', 'context window']
    },
    'just-in-time loading': {
      def: 'Only giving the AI tool instructions when it actually needs them, not all at once. Like a mechanic who only grabs the wrench they need for this specific bolt, instead of emptying their entire toolbox on the floor first.',
      see: ['tool bloat', 'retrieval threshold', 'tool layer']
    },
    'JIT': {
      def: 'Short for Just-in-Time. Means delivering something exactly when it\'s needed, not before. Like a pizza arriving right when you\'re hungry, not sitting cold on the counter for an hour.',
      see: ['just-in-time loading', 'tool layer']
    },
    'tool bloat': {
      def: 'Giving the AI way too many tool descriptions that it doesn\'t need for the current task. Like handing someone a 50-page manual when they just need to know how to turn on one machine.',
      see: ['just-in-time loading', 'retrieval threshold', 'token budget']
    },
    'retrieval threshold': {
      def: 'A cutoff score (like a test passing grade) that decides whether information is relevant enough to show the AI. If something scores below 0.75, it gets left out. Like only studying flashcards you keep getting wrong.',
      see: ['semantic similarity', 'just-in-time loading', 'relevance score']
    },
    'relevance score': {
      def: 'A number from 0 to 1 that rates how closely information matches what the AI needs right now. 0 = completely unrelated, 1 = perfect match. Like a "how useful is this?" rating.',
      see: ['retrieval threshold', 'semantic similarity', 'cosine similarity']
    },
    'semantic similarity': {
      def: 'A way to measure how related two pieces of text are based on meaning, not just matching words. "Happy" and "joyful" have high semantic similarity even though they\'re different words.',
      see: ['cosine similarity', 'embedding', 'relevance score']
    },
    'cosine similarity': {
      def: 'A math formula that measures how similar two ideas are by checking if they point in the same direction. Like two people walking toward the same mountain — even from different starting points, their paths get closer over time.',
      see: ['semantic similarity', 'embedding', 'vector database']
    },
    'embedding': {
      def: 'Converting a word or sentence into a list of numbers that captures its meaning. Like turning a song into sheet music — the notes on paper represent the sound. Similar meanings get similar numbers.',
      see: ['semantic similarity', 'vector database', 'cosine similarity']
    },
    'vector database': {
      def: 'A special kind of database that stores information by meaning, not by keywords. Instead of searching for exact words, it finds things that are conceptually similar. Like a librarian who organizes books by topic, not just by title.',
      see: ['embedding', 'vector search', 'semantic similarity']
    },
    'vector search': {
      def: 'Searching for information by meaning rather than exact words. Ask about "cars" and it also finds documents about "automobiles" and "vehicles" — even if those exact words never appear.',
      see: ['vector database', 'embedding', 'semantic similarity']
    },
    'RAG': {
      def: 'Retrieval-Augmented Generation. A technique where the AI looks up relevant facts from a knowledge base before answering, instead of just relying on its training. Like taking an open-book test instead of a closed-book test — you get to check your notes.',
      see: ['vector search', 'corrective rag', 'hybrid retrieval']
    },
    'Retrieval-Augmented Generation': {
      def: 'Same as RAG. The AI searches a database for relevant information, then uses what it found to write a better answer. Like doing research before writing an essay instead of writing from memory alone.',
      see: ['RAG', 'vector search', 'corrective rag']
    },
    'corrective rag': {
      def: 'A smarter version of RAG that double-checks whether the information it retrieved is actually useful. If the retrieved facts are low-quality, it searches again with different keywords. Like realizing your first Google search gave bad results, so you rephrase and try again.',
      see: ['RAG', 'retrieval threshold', 'hallucination']
    },
    'ACE': {
      def: 'Generator-Reflector-Curator. A three-step cycle where the AI (1) produces an answer, (2) grades its own work, and (3) saves what it learned so it does better next time. Like an athlete who watches game footage, identifies mistakes, and adjusts their training.',
      see: ['generator', 'reflector', 'curator', 'playbook']
    },
    'ACE framework': {
      def: 'Same as ACE — the Generator, Reflector, Curator improvement loop.',
      see: ['ACE', 'generator', 'reflector', 'curator']
    },
    'generator': {
      def: 'The part of the ACE system that actually produces the answer. Like a student writing an essay draft. It does the work, but doesn\'t check for errors — that\'s the Reflector\'s job.',
      see: ['ACE', 'reflector', 'curator']
    },
    'reflector': {
      def: 'The part of the ACE system that grades the Generator\'s work. It compares the output against the success criteria and flags what went wrong. Like a teacher marking a test and circling mistakes.',
      see: ['ACE', 'generator', 'curator']
    },
    'curator': {
      def: 'The part of the ACE system that learns from the Reflector\'s feedback and updates the AI\'s knowledge for future tasks. Like updating your study guide after getting quiz results so you don\'t make the same mistakes twice.',
      see: ['ACE', 'reflector', 'playbook']
    },
    'playbook': {
      def: 'A collection of proven strategies that the AI has learned from past experience. Like a chef\'s recipe book — tried-and-tested instructions for handling common situations, plus notes on what NOT to do.',
      see: ['ACE', 'curator', 'pattern', 'anti-pattern']
    },
    'pattern': {
      def: 'A reliable strategy that has worked well in the past. "When the user asks for a code review, always check test coverage first" is a pattern. Like a life hack you know will work because you\'ve used it successfully many times.',
      see: ['playbook', 'anti-pattern', 'semantic memory']
    },
    'anti-pattern': {
      def: 'A strategy that seems good but actually causes problems. "Never suggest using global variables" is an anti-pattern in coding. Like learning not to microwave metal — it looks like it should work, but it ends badly.',
      see: ['pattern', 'playbook', 'format rules']
    },
    'format rules': {
      def: 'Rules about how the output should be structured. "Use MUST, SHOULD, and MAY for requirements" is a format rule. Like a teacher specifying "essays must be double-spaced, 12pt font, with page numbers."',
      see: ['playbook', 'schema', 'handoff format']
    },
    'retrieval heuristics': {
      def: 'Smart shortcuts for finding the right information quickly. Instead of searching through everything, the system learns which strategies work best for which types of questions. Like knowing to check the index of a book rather than flipping through every page.',
      see: ['playbook', 'hybrid retrieval', 'relevance score']
    },
    'schema': {
      def: 'A blueprint that defines exactly what data should look like — which fields exist, what type they are, whether they\'re required. Like a form that says "Name (text, required), Age (number, optional), Email (text, required)."',
      see: ['format rules', 'handoff format', 'output format']
    },
    'handoff format': {
      def: 'The agreed structure for passing information between AI agents. Defines exactly what the sender includes and what the receiver expects. Like a standardized order form between a kitchen and a waiter — the waiter always fills the same fields.',
      see: ['schema', 'sub-agent', 'context fingerprint']
    },
    'context fingerprint': {
      def: 'A record of exactly what information was given to an AI agent at handoff time. If something goes wrong later, you can replay the exact same context to figure out why. Like keeping the receipt when you buy something — proof of what was exchanged.',
      see: ['handoff format', 'context isolation', 'sub-agent']
    },
    'semantic routing': {
      def: 'Sending a question to the right AI agent based on what it actually MEANS, not just which keywords it contains. "How do I fix this bug?" goes to the debugging agent, not the documentation agent. Like a hospital triage nurse sending patients to the right specialist.',
      see: ['routing', 'semantic similarity', 'classifier']
    },
    'routing': {
      def: 'The decision of which AI agent (or which set of tools) should handle a given question. Like a receptionist who decides whether to send you to billing, support, or sales based on why you walked in.',
      see: ['semantic routing', 'classifier', 'routing layer']
    },
    'classifier': {
      def: 'A program that looks at a question and decides which category it belongs to. "Is this about code? Is it about bugs? Is it about documentation?" Like sorting mail into different bins before delivering it.',
      see: ['semantic routing', 'routing', 'embedding']
    },
    'context isolation': {
      def: 'Making sure each AI agent only sees information relevant to its task, with no leakage from other tasks. Like giving each student a different version of a test — they can\'t copy answers because they each have different questions.',
      see: ['sub-agent', 'cross-contamination', 'multi-agent orchestration']
    },
    'cross-contamination': {
      def: 'When information from one task leaks into another, confusing the AI. Like if you\'re taking a biology test but keep seeing random Spanish vocabulary in the margins — it throws you off.',
      see: ['context isolation', 'sub-agent', 'distractor interference']
    },
    'progressive disclosure': {
      def: 'Revealing information in layers — starting with just a summary, and letting the AI ask for more detail when needed. Like a video game that shows you the tutorial first, then unlocks harder levels as you prove you\'re ready.',
      see: ['context engineering', 'context window', 'just-in-time loading']
    },
    'monolithic prompt': {
      def: 'One giant block of instructions that contains everything all at once. Hard to organize, hard to update, and wastes the AI\'s memory. Like trying to read a textbook by putting every page on a single scroll.',
      see: ['context engineering', 'system prompt', 'progressive disclosure']
    },
    'hallucination': {
      def: 'When an AI confidently makes up information that isn\'t true. It sounds plausible but is completely fabricated. Like someone telling you "Beijing is the capital of Japan" with total confidence — wrong, but delivered as if it\'s fact.',
      see: ['RAG', 'corrective rag', 'evidentiary standard']
    },
    'hallucinate': {
      def: 'The act of an AI inventing false information. Same as hallucination — the AI is "seeing things" that aren\'t real in the data.',
      see: ['hallucination', 'RAG', 'evidentiary standard']
    },
    'hybrid retrieval': {
      def: 'Combining multiple search methods to find the best information. The system weighs three things: (1) how well the meaning matches, (2) how recently the information was created, and (3) how important it was flagged. Like finding a restaurant by checking its rating, how close it is, AND how recently it was reviewed.',
      see: ['vector search', 'retrieval heuristics', 'episodic memory']
    },
    'hybrid search': {
      def: 'Same as hybrid retrieval — searching using multiple signals at once, not just one.',
      see: ['hybrid retrieval', 'vector search', 'retrieval heuristics']
    },
    'episodic memory': {
      def: 'The AI\'s memory of recent events and conversations — what happened in THIS session. Like your memory of what you ate for breakfast today. It naturally fades over time unless it was important.',
      see: ['working memory', 'semantic memory', 'decay', 'half-life']
    },
    'semantic memory': {
      def: 'The AI\'s long-term knowledge of patterns and rules — things that stay true across many sessions. Like knowing that fire is hot — it\'s not tied to a specific event, it\'s general knowledge that doesn\'t expire.',
      see: ['episodic memory', 'working memory', 'playbook']
    },
    'procedural memory': {
      def: 'The AI\'s knowledge of HOW to do things — workflows, tool implementations, validation logic. Like muscle memory for a basketball player — it\'s not facts you recall, it\'s processes you execute.',
      see: ['working memory', 'semantic memory', 'episodic memory']
    },
    'compression layer': {
      def: 'A system that takes long, messy conversation logs and boils them down into short, useful summaries. Like taking a 2-hour meeting and writing a one-paragraph summary of the key decisions.',
      see: ['episodic memory', 'semantic memory', 'playbook']
    },
    'decay': {
      def: 'How information fades from the AI\'s memory over time. Recent and important memories stick around; old and trivial ones disappear. Like how you remember what you did today but not what you ate for lunch three weeks ago.',
      see: ['half-life', 'episodic memory', 'memory compression']
    },
    'half-life': {
      def: 'The time it takes for a memory\'s importance to drop by half. A memory with a 7-day half-life is half as important after one week. Like radioactive material decaying — it doesn\'t disappear all at once, it fades gradually.',
      see: ['decay', 'episodic memory', 'memory compression']
    },
    'memory compression': {
      def: 'The process of converting long conversations into short, structured patterns. Instead of storing "The user said X, then I said Y, then the user said Z for 200 lines," the system stores "User prefers short answers with code examples."',
      see: ['compression layer', 'playbook', 'episodic memory']
    },
    'evidentiary standard': {
      def: 'The rule for what counts as proof. "Every claim must cite a specific line of code" is an evidentiary standard. Like a courtroom rule that says evidence must be backed by a witness or document — no guessing allowed.',
      see: ['hallucination', 'success criterion', 'RAG']
    },
    'success criterion': {
      def: 'A clear, measurable way to know when the AI has finished the job correctly. "All bugs found AND score above 80%" is a success criterion. Like a rubric for grading — you know exactly what "done" looks like.',
      see: ['evidentiary standard', 'task layer', 'reflector']
    },
    'OpenAPI': {
      def: 'A standard way to describe what a web API (an online service) can do — what requests it accepts, what data it expects, what it returns. Like a restaurant menu that lists every dish, its ingredients, and its price.',
      see: ['schema', 'tool bloat', 'just-in-time loading']
    },
    'human-in-the-loop': {
      def: 'A design where an AI pauses and asks a real person for approval before taking a high-stakes action. Like a self-driving car that slows down and hands control to the driver when it\'s unsure.',
      see: ['agentic system', 'corrective rag', 'retrieval threshold']
    },
    'routines': {
      def: 'Preconfigured Claude Code session templates that run on a schedule or event trigger — a higher-order prompt that automates recurring work like doc maintenance, CI fixes, or deploy verification.',
      see: ['claude code', 'hooks', 'trigger']
    },
    'hooks': {
      def: 'Lifecycle callbacks in agent harnesses that fire before or after tool calls, MCP execution, or session events — used for governance, validation, and policy enforcement.',
      see: ['routines', 'mcp', 'claude code']
    },
    'claude code': {
      def: 'Anthropic\'s agentic terminal coding assistant. Runs in a loop with bash, file edits, and MCP tools. Supports CLAUDE.md project memory, routines, and verification loops.',
      see: ['claude.md', 'routines', 'mcp']
    },
    'claude.md': {
      def: 'Project-level memory file read automatically at session start. Stores architecture notes, commands, style guides, and MCP config. Keep it short — long files eat context without proportional benefit.',
      see: ['claude code', 'system prompt', 'skills']
    },
    'skills': {
      def: 'Composable, on-demand context packages the model pulls in when a task needs them — domain procedures, formatting rules, specialized knowledge. Unlike system prompts, skills load only when relevant.',
      see: ['claude.md', 'system prompt', 'just-in-time loading']
    },
    'mcp': {
      def: 'Model Context Protocol — a standard for wrapping external systems (GitHub, Slack, databases) as tools agents can call. MCP servers expose capabilities without custom integration per service.',
      see: ['tools', 'claude code', 'hooks']
    },
    'hill climbing': {
      def: 'The eval improvement loop: run tests, diagnose failures by theme, make one architectural fix, re-run, repeat. Used to recover performance when agents decay from complexity bloat.',
      see: ['regression eval', 'failure mode eval', 'reflector']
    },
    'regression eval': {
      def: 'Single-turn eval tasks with defined correct responses — tests that the agent still does what it used to after changes. The "did we break anything?" suite.',
      see: ['failure mode eval', 'hill climbing']
    },
    'failure mode eval': {
      def: 'Multi-turn eval tasks that probe specific known weaknesses — inefficient paths, subagent communication breakdowns, policy conflicts in long system prompts.',
      see: ['regression eval', 'hill climbing', 'sub-agent']
    },
    'context poisoning': {
      def: 'When retrieved documents contain instructions or content that hijacks model behavior — the model follows injected directives from untrusted sources instead of your system prompt.',
      see: ['RAG', 'retrieval threshold', 'corrective rag']
    },
    'lost in the middle': {
      def: 'Attention degradation where content buried in positions 30–70% of a long context is systematically underweighted. Never place critical facts in the middle zone.',
      see: ['injection ordering', 'context window', 'attention dilution']
    },
    'injection ordering': {
      def: 'The deliberate sequence of what enters the context window — primacy zone for constraints, middle for background, recency zone for highest-signal retrieved content.',
      see: ['context engineering', 'lost in the middle', 'token budget']
    },
    'workflow': {
      def: 'Multiple models operating in a predefined control flow you mapped explicitly. Cheaper and more predictable than agents when the decision tree is tractable.',
      see: ['agent', 'agentic system', 'semantic routing']
    },
    'stock pilot': {
      def: 'Anthropic\'s workshop inventory agent demonstrating architecture decay — a 400-line system prompt and bolted-on subagents dropped eval pass rates from 83% to 62%.',
      see: ['sub-agent', 'skills', 'hill climbing']
    },
    'hill-climbing': {
      def: 'Same as hill climbing — the eval improvement loop of diagnose-by-theme, fix architecture, re-run.',
      see: ['hill climbing', 'regression eval', 'failure mode eval']
    }
  };

  var jargonEnabled = false;
  var jargonPanel, jargonPanelTerm, jargonPanelBody, jargonPanelSeeAlso, jargonPanelLinks, jargonPanelClose;
  var currentTerm = null;
  var panelTimeout = null;

  function initJargonPanel() {
    jargonPanel = document.getElementById('jargonPanel');
    jargonPanelTerm = document.getElementById('jargonPanelTerm');
    jargonPanelBody = document.getElementById('jargonPanelBody');
    jargonPanelSeeAlso = document.getElementById('jargonPanelSeeAlso');
    jargonPanelLinks = document.getElementById('jargonPanelLinks');
    jargonPanelClose = document.getElementById('jargonPanelClose');
  }

  function showJargonPanel(term, x, y) {
    if (!jargonPanel) return;
    clearTimeout(panelTimeout);
    currentTerm = term;
    var entry = glossary[term.toLowerCase()];
    if (!entry) return;

    jargonPanelTerm.textContent = term;
    jargonPanelBody.textContent = entry.def;

    if (entry.see && entry.see.length > 0) {
      jargonPanelSeeAlso.style.display = 'block';
      jargonPanelLinks.innerHTML = '';
      entry.see.forEach(function (related) {
        var a = document.createElement('a');
        a.textContent = related;
        a.setAttribute('role', 'button');
        a.setAttribute('tabindex', '0');
        a.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          var rect = jargonPanel.getBoundingClientRect();
          showJargonPanel(related, rect.left, rect.top + 10);
        });
        a.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            var rect = jargonPanel.getBoundingClientRect();
            showJargonPanel(related, rect.left, rect.top + 10);
          }
        });
        jargonPanelLinks.appendChild(a);
      });
    } else {
      jargonPanelSeeAlso.style.display = 'none';
    }

    positionPanel(x, y);
    jargonPanel.classList.add('visible');
    jargonPanel.setAttribute('aria-hidden', 'false');
  }

  function positionPanel(x, y) {
    if (!jargonPanel) return;
    var panelW = jargonPanel.offsetWidth || 340;
    var panelH = jargonPanel.offsetHeight || 200;
    var vw = window.innerWidth;
    var vh = window.innerHeight;

    var left = x + 12;
    if (left + panelW > vw - 16) left = vw - panelW - 16;
    if (left < 16) left = 16;

    var top = y - panelH - 8;
    if (top < 64) top = y + 16;

    jargonPanel.style.left = left + 'px';
    jargonPanel.style.top = top + 'px';
  }

  function hideJargonPanel() {
    panelTimeout = setTimeout(function () {
      if (!jargonPanel) return;
      jargonPanel.classList.remove('visible');
      jargonPanel.setAttribute('aria-hidden', 'true');
      currentTerm = null;
    }, 150);
  }

  function cancelHideJargonPanel() {
    clearTimeout(panelTimeout);
  }

  if (jargonPanelClose) {
    jargonPanelClose.addEventListener('click', function () {
      if (jargonPanel) {
        jargonPanel.classList.remove('visible');
        jargonPanel.setAttribute('aria-hidden', 'true');
        currentTerm = null;
      }
    });
  }

  /* --- Jargon term delegate --- */
  document.addEventListener('mouseover', function (e) {
    var termEl = e.target.closest('.jargon-term');
    if (!termEl) { hideJargonPanel(); return; }
    cancelHideJargonPanel();
    var term = termEl.getAttribute('data-term');
    if (term) showJargonPanel(term, e.clientX, e.clientY);
  });

  document.addEventListener('mouseout', function (e) {
    var termEl = e.target.closest('.jargon-term');
    var toPanel = e.relatedTarget && e.relatedTarget.closest('#jargonPanel');
    if (!termEl && !toPanel) hideJargonPanel();
  });

  document.addEventListener('focusin', function (e) {
    var termEl = e.target.closest('.jargon-term');
    if (!termEl) return;
    cancelHideJargonPanel();
    var rect = termEl.getBoundingClientRect();
    var term = termEl.getAttribute('data-term');
    if (term) showJargonPanel(term, rect.left, rect.bottom + 4);
  });

  document.addEventListener('focusout', function (e) {
    var related = e.relatedTarget;
    if (!related || (!related.closest('.jargon-term') && !related.closest('#jargonPanel'))) {
      hideJargonPanel();
    }
  });

  if (jargonPanel) {
    jargonPanel.addEventListener('mouseenter', cancelHideJargonPanel);
    jargonPanel.addEventListener('mouseleave', hideJargonPanel);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && jargonPanel && jargonPanel.classList.contains('visible')) {
      jargonPanel.classList.remove('visible');
      jargonPanel.setAttribute('aria-hidden', 'true');
      currentTerm = null;
    }
  });

  /* --- Text-node scanner --- */
  function scanAndWrapTerms(root) {
    var SKIP_TAGS = { 'SCRIPT': 1, 'STYLE': 1, 'CODE': 1, 'PRE': 1, 'NOSCRIPT': 1, 'SVG': 1, 'TEXTAREA': 1, 'INPUT': 1, 'SELECT': 1 };

    var tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node.textContent.trim()) return NodeFilter.FILTER_SKIP;
        var p = node.parentElement;
        if (!p) return NodeFilter.FILTER_SKIP;
        if (SKIP_TAGS[p.tagName]) return NodeFilter.FILTER_SKIP;
        if (p.closest('.jargon-term') || p.closest('#jargonPanel') || p.closest('.code-block') || p.closest('#generatedPrompt')) return NodeFilter.FILTER_SKIP;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    var nodes = [];
    while (tw.nextNode()) { nodes.push(tw.currentNode); }

    var termKeys = Object.keys(glossary).sort(function (a, b) { return b.length - a.length; });

    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var text = node.textContent;
      var replaced = false;

      for (var k = 0; k < termKeys.length; k++) {
        var term = termKeys[k];
        var idx = text.toLowerCase().indexOf(term.toLowerCase());
        while (idx !== -1) {
          var before = text.slice(0, idx);
          var match = text.slice(idx, idx + term.length);
          var after = text.slice(idx + term.length);

          if (before.length > 0 && /[a-zA-Z]/.test(before[before.length - 1])) { break; }
          if (after.length > 0 && /[a-zA-Z]/.test(after[0])) { break; }

          var span = document.createElement('span');
          span.className = 'jargon-term';
          span.setAttribute('data-term', term);
          span.textContent = match;

          var frag = document.createDocumentFragment();
          if (before) frag.appendChild(document.createTextNode(before));
          frag.appendChild(span);

          if (node.parentNode) {
            node.parentNode.replaceChild(frag, node);
            if (after) {
              var afterNode = document.createTextNode(after);
              frag.parentNode.insertBefore(afterNode, span.nextSibling);
              node = afterNode;
            }
          }

          replaced = true;
          text = after;
          idx = text.toLowerCase().indexOf(term.toLowerCase());
        }
        if (replaced) break;
      }
    }
  }

  /* --- Jargon Toggle --- */
  var jargonToggle = document.getElementById('jargonToggle');
  if (jargonToggle) {
    jargonToggle.addEventListener('click', function () {
      jargonEnabled = !jargonEnabled;

      if (jargonEnabled) {
        scanAndWrapTerms(document.getElementById('main-primary'));
        var sub = document.querySelector('.hero-subheadline');
        if (sub) scanAndWrapTerms(sub);
        jargonToggle.classList.add('active');
        jargonToggle.setAttribute('aria-pressed', 'true');
        jargonToggle.querySelector('.jargon-toggle-label').textContent = 'Explaining';
        if (jargonPanel) jargonPanel.style.display = '';
      } else {
        document.querySelectorAll('.jargon-term').forEach(function (el) {
          var parent = el.parentNode;
          if (parent) {
            var txt = document.createTextNode(el.textContent);
            parent.replaceChild(txt, el);
            parent.normalize();
          }
        });
        jargonToggle.classList.remove('active');
        jargonToggle.setAttribute('aria-pressed', 'false');
        jargonToggle.querySelector('.jargon-toggle-label').textContent = 'Explain';
        if (jargonPanel) {
          jargonPanel.classList.remove('visible');
          jargonPanel.setAttribute('aria-hidden', 'true');
        }
      }
    });
  }

  /* ========== Prompt Before/After Toggle ========== */
  document.querySelectorAll('.toggle-btn[data-prompt-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = btn.getAttribute('data-prompt-toggle');
      document.querySelectorAll('.toggle-btn[data-prompt-toggle]').forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      document.querySelectorAll('.prompt-compare').forEach(function (panel) {
        panel.classList.toggle('hidden', panel.getAttribute('data-prompt-version') !== target);
      });
    });
  });

  /* ========== Tool A: Agent Suitability Wizard ========== */
  function scoreWizard() {
    var complexity = parseInt(document.getElementById('wizComplexity').value, 10);
    var value = parseInt(document.getElementById('wizValue').value, 10);
    var bottlenecks = parseInt(document.getElementById('wizBottlenecks').value, 10);
    var errorCost = parseInt(document.getElementById('wizErrorCost').value, 10);

    var agentScore = 0;
    var workflowScore = 0;
    var rationale = [];

    if (complexity >= 4) { agentScore += 3; rationale.push('High ambiguity favors agentic exploration.'); }
    else if (complexity <= 2) { workflowScore += 3; rationale.push('Tractable decision tree — map it explicitly.'); }
    else { agentScore += 1; workflowScore += 1; rationale.push('Moderate complexity — hybrid may work.'); }

    if (value >= 4) { agentScore += 3; rationale.push('High task value justifies token spend.'); }
    else if (value <= 2) { workflowScore += 3; rationale.push('Low unit economics favor deterministic workflows.'); }
    else { agentScore += 1; workflowScore += 1; }

    if (bottlenecks >= 4) { workflowScore += 2; rationale.push('Critical capability gaps — simplify scope first.'); }
    else if (bottlenecks <= 2) { agentScore += 2; rationale.push('Core capabilities are derisked.'); }

    if (errorCost >= 4) { workflowScore += 3; rationale.push('High-stakes errors demand human-in-the-loop or read-only modes.'); }
    else if (errorCost <= 2) { agentScore += 2; rationale.push('Outputs are verifiable — agent autonomy is safer.'); }

    var recommendation;
    if (agentScore > workflowScore + 2) recommendation = 'Agent';
    else if (workflowScore > agentScore + 2) recommendation = 'Workflow';
    else recommendation = 'Hybrid';

    var descriptions = {
      'Agent': 'Build an agent: model + tools in a loop with environment feedback. Best when ambiguity is high, value justifies tokens, capabilities are proven, and outputs are verifiable.',
      'Workflow': 'Build a workflow: predefined control flow with explicit nodes. Best when you can enumerate the decision tree, unit economics are tight, or error cost is high.',
      'Hybrid': 'Start with a workflow for modal cases; escalate edge cases to a scoped agent with verification. Captures most value without full autonomy cost.'
    };

    var out = document.getElementById('wizardOutput');
    if (!out) return;
    out.textContent = '';
    var h4 = document.createElement('h4');
    h4.textContent = 'Recommendation: ' + recommendation;
    out.appendChild(h4);
    var p = document.createElement('p');
    p.textContent = descriptions[recommendation];
    out.appendChild(p);
    var p2 = document.createElement('p');
    p2.style.marginTop = 'var(--space-3)';
    var strong = document.createElement('strong');
    strong.textContent = 'Rationale:';
    p2.appendChild(strong);
    out.appendChild(p2);
    var ul = document.createElement('ul');
    ul.style.marginLeft = 'var(--space-4)';
    rationale.forEach(function (r) {
      var li = document.createElement('li');
      li.textContent = r;
      ul.appendChild(li);
    });
    out.appendChild(ul);
    out.style.display = 'block';
    out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  var wizardForm = document.getElementById('wizardForm');
  if (wizardForm) {
    wizardForm.addEventListener('submit', function (e) {
      e.preventDefault();
      scoreWizard();
    });
    ['wizComplexity', 'wizValue', 'wizBottlenecks', 'wizErrorCost'].forEach(function (id) {
      var el = document.getElementById(id);
      var label = document.getElementById(id + 'Val');
      if (el && label) {
        el.addEventListener('input', function () {
          var labels = ['Very Low', 'Low', 'Moderate', 'High', 'Very High'];
          label.textContent = labels[parseInt(el.value, 10) - 1];
        });
      }
    });
  }

  /* ========== Tool B: Context Budget Auditor ========== */
  var BUDGET_LIMITS = {
    system: 10,
    task: 15,
    retrieved: 40,
    working: 20,
    output: 15
  };

  function runBudgetAudit() {
    var total = parseInt(document.getElementById('auditTotal').value, 10) || 200000;
    var mode = document.getElementById('auditMode').value;
    var categories = ['system', 'task', 'retrieved', 'working', 'output'];
    var names = {
      system: 'System prompt + skills',
      task: 'Task definition + few-shot',
      retrieved: 'Retrieved documents',
      working: 'Working state / scratchpad',
      output: 'Output buffer'
    };
    var tokens = {};
    var pcts = {};
    var lines = ['CONTEXT AUDIT REPORT', '========================', 'Total budget: ' + total.toLocaleString() + ' tokens', ''];

    categories.forEach(function (cat) {
      if (mode === 'percent') {
        pcts[cat] = parseFloat(document.getElementById('audit_' + cat).value) || 0;
        tokens[cat] = Math.round(total * pcts[cat] / 100);
      } else {
        tokens[cat] = parseInt(document.getElementById('audit_' + cat).value, 10) || 0;
        pcts[cat] = total > 0 ? (tokens[cat] / total) * 100 : 0;
      }
    });

    var sumPct = categories.reduce(function (s, c) { return s + pcts[c]; }, 0);
    lines.push('ALLOCATION SUMMARY');
    lines.push('------------------');

    var flags = 0;
    categories.forEach(function (cat) {
      var limit = BUDGET_LIMITS[cat];
      var over = pcts[cat] > limit;
      if (over) flags++;
      var flag = over ? ' *** OVER LIMIT (max ' + limit + '%) ***' : ' [OK]';
      lines.push(names[cat] + ': ' + tokens[cat].toLocaleString() + ' tokens (' + pcts[cat].toFixed(1) + '%)' + flag);
    });

    lines.push('');
    lines.push('Total allocated: ' + sumPct.toFixed(1) + '%');
    if (sumPct > 100) {
      lines.push('*** WARNING: Allocation exceeds 100% — silent truncation likely ***');
      flags++;
    } else if (sumPct < 95) {
      lines.push('Note: ' + (100 - sumPct).toFixed(1) + '% unallocated — reserve for dynamic expansion.');
    }

    lines.push('');
    lines.push('INJECTION ORDER CHECK');
    lines.push('---------------------');
    lines.push('[ ] Retrieved content ordered by relevance (best at recency zone)');
    lines.push('[ ] Critical constraints in primacy zone (first ~10%)');
    lines.push('[ ] Poisoning detection on retrieved content');
    lines.push('[ ] Output buffer reserved (never 0%)');

    lines.push('');
    lines.push('FLAGS: ' + flags + ' issue(s) detected');
    if (flags === 0) lines.push('Status: PASS — allocation within standard limits');

    var out = document.getElementById('auditOutput');
    var pre = document.getElementById('auditReport');
    if (out && pre) {
      pre.textContent = lines.join('\n');
      out.style.display = 'block';
      out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  var auditForm = document.getElementById('auditForm');
  if (auditForm) {
    auditForm.addEventListener('submit', function (e) {
      e.preventDefault();
      runBudgetAudit();
    });
    var auditMode = document.getElementById('auditMode');
    if (auditMode) {
      auditMode.addEventListener('change', function () {
        var isPct = auditMode.value === 'percent';
        document.querySelectorAll('.audit-input-group').forEach(function (g) {
          g.querySelector('.audit-pct-label').style.display = isPct ? '' : 'none';
          g.querySelector('.audit-token-label').style.display = isPct ? 'none' : '';
        });
      });
    }
  }

  /* ========== Tool C: 10-Point Prompt Builder ========== */
  function generate10Point() {
    var fields = {
      taskContext: 'p10_taskContext',
      toneContext: 'p10_toneContext',
      background: 'p10_background',
      dynamic: 'p10_dynamic',
      steps: 'p10_steps',
      examples: 'p10_examples',
      history: 'p10_history',
      reminder: 'p10_reminder',
      guardrails: 'p10_guardrails',
      outputFormat: 'p10_outputFormat',
      prefill: 'p10_prefill'
    };
    function v(id) {
      var el = document.getElementById(id);
      return el && el.value ? el.value.trim() : '';
    }
    function block(tag, content) {
      if (!content) return '';
      return '<' + tag + '>\n' + content + '\n</' + tag + '>\n\n';
    }

    var prompt = block('task_context', v(fields.taskContext))
      + block('tone_context', v(fields.toneContext))
      + block('background_data', v(fields.background))
      + block('dynamic_content', v(fields.dynamic))
      + block('instructions', v(fields.steps))
      + block('examples', v(fields.examples))
      + block('conversation_history', v(fields.history))
      + block('task_reminder', v(fields.reminder))
      + block('guardrails', v(fields.guardrails))
      + block('output_format', v(fields.outputFormat));

    var prefill = v(fields.prefill);
    if (prefill) prompt += '\n<!-- Pre-fill assistant turn with: ' + prefill + ' -->';

    var out = document.getElementById('p10Output');
    var code = document.getElementById('p10Generated');
    if (out && code) {
      var codeEl = code.querySelector('code');
      if (codeEl) codeEl.textContent = prompt.trim() || '(Fill in at least one field)';
      out.style.display = 'block';
      out.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function prefill10Point() {
    var samples = {
      p10_taskContext: 'You are an expert Swedish auto insurance claims adjuster reviewing car accident report forms and sketches.',
      p10_toneContext: 'Stay factual and confident. If you cannot clearly read the form or sketch, say so — do not guess.',
      p10_background: 'The form has 17 checkbox rows across two vehicle columns (A and B). Humans may circle, scribble, or mark imperfectly.',
      p10_dynamic: '[Attach accident form image and sketch image here]',
      p10_steps: '1. Examine the form carefully — list all checked boxes for vehicle A and B.\n2. Examine the sketch in light of form findings.\n3. Reconcile both sources and determine fault with evidence.',
      p10_guardrails: 'Do not hallucinate. Base every claim on visible evidence. Admit uncertainty when information is insufficient.',
      p10_outputFormat: 'Return XML with <form_analysis>, <sketch_analysis>, and <final_verdict> sections.',
      p10_prefill: '<form_analysis>'
    };
    Object.keys(samples).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.value = samples[id];
    });
  }

  var p10Form = document.getElementById('p10Form');
  if (p10Form) {
    p10Form.addEventListener('submit', function (e) {
      e.preventDefault();
      generate10Point();
    });
  }
  var p10PrefillBtn = document.getElementById('p10PrefillBtn');
  if (p10PrefillBtn) p10PrefillBtn.addEventListener('click', prefill10Point);

  var copyP10Btn = document.getElementById('copyP10Btn');
  if (copyP10Btn) {
    copyP10Btn.addEventListener('click', function () {
      var code = document.getElementById('p10Generated');
      if (!code) return;
      var codeEl = code.querySelector('code');
      if (codeEl) copyToClipboard(codeEl.textContent, copyP10Btn);
    });
  }

  var copyAuditBtn = document.getElementById('copyAuditBtn');
  if (copyAuditBtn) {
    copyAuditBtn.addEventListener('click', function () {
      var pre = document.getElementById('auditReport');
      if (pre) copyToClipboard(pre.textContent, copyAuditBtn);
    });
  }

  /* ========== Tool D: Routine Designer ========== */
  function generateRoutine() {
    var name = (document.getElementById('routineName').value || 'my-routine').trim();
    var triggerType = document.getElementById('routineTriggerType').value;
    var triggerDetail = document.getElementById('routineTriggerDetail').value.trim();
    var repos = document.getElementById('routineRepos').value.trim();
    var connectors = document.getElementById('routineConnectors').value.trim();
    var steering = document.getElementById('routineSteering').value;
    var instructions = document.getElementById('routineInstructions').value.trim();

    var triggerLine = triggerType === 'schedule'
      ? '/schedule ' + (triggerDetail || '0 9 * * 1') + ' — ' + name
      : 'Event: ' + (triggerDetail || 'webhook/post-deploy');

    var md = '# Routine: ' + name + '\n\n'
      + '## Trigger\n'
      + '- Type: ' + triggerType + '\n'
      + '- Config: ' + triggerLine + '\n\n'
      + '## Context\n'
      + '- Repos: ' + (repos || 'main app repo') + '\n'
      + '- Connectors: ' + (connectors || 'GitHub') + '\n\n'
      + '## Steering\n'
      + '- Pattern: ' + steering + '\n\n'
      + '## Instructions\n\n'
      + (instructions || 'Describe the routine role and success criteria here.') + '\n\n'
      + '## Example Command\n\n'
      + '```\n' + triggerLine + '\n```\n';

    var out = document.getElementById('routineOutput');
    var code = document.getElementById('routineGenerated');
    if (out && code) {
      var codeEl = code.querySelector('code');
      if (codeEl) codeEl.textContent = md;
      out.style.display = 'block';
      out.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  var routineForm = document.getElementById('routineForm');
  if (routineForm) {
    routineForm.addEventListener('submit', function (e) {
      e.preventDefault();
      generateRoutine();
    });
  }

  var copyRoutineBtn = document.getElementById('copyRoutineBtn');
  if (copyRoutineBtn) {
    copyRoutineBtn.addEventListener('click', function () {
      var code = document.getElementById('routineGenerated');
      if (!code) return;
      var codeEl = code.querySelector('code');
      if (codeEl) copyToClipboard(codeEl.textContent, copyRoutineBtn);
    });
  }

  /* ========== Init ========== */
  initJargonPanel();

  document.querySelectorAll('.accordion-item.open').forEach(function (item) {
    var header = item.querySelector('.accordion-header');
    if (header) header.setAttribute('aria-expanded', 'true');
  });

  syncLayerStack('1');

  document.documentElement.classList.remove('no-js');
})();
