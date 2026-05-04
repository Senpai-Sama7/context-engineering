// ===========================================
// Context Engineering — App Logic
// ===========================================

// --- State (in-memory only, no localStorage) ---
let isDarkMode = true;

// --- Theme Toggle ---
const themeToggle = document.getElementById('themeToggle');
const moonIcon = document.getElementById('moonIcon');
const sunIcon = document.getElementById('sunIcon');

function updateThemeIcons() {
  if (isDarkMode) {
    moonIcon.style.display = 'block';
    sunIcon.style.display = 'none';
  } else {
    moonIcon.style.display = 'none';
    sunIcon.style.display = 'block';
  }
}

function setTheme(dark) {
  isDarkMode = dark;
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  updateThemeIcons();
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    setTheme(!isDarkMode);
  });
}

// --- Mobile Menu ---
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenuClose = document.getElementById('mobileMenuClose');
const mobileNav = document.getElementById('mobileNav');
const overlay = document.getElementById('overlay');

function openMobileMenu() {
  mobileNav.classList.add('open');
  overlay.classList.add('visible');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  mobileNav.classList.remove('open');
  overlay.classList.remove('visible');
  document.body.style.overflow = '';
}

if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileMenu);
if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);
if (overlay) overlay.addEventListener('click', closeMobileMenu);

// Close mobile menu on nav link click
mobileNav?.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// --- Accordion ---
document.querySelectorAll('.accordion-header').forEach(header => {
  header.addEventListener('click', () => {
    const item = header.parentElement;
    const isOpen = item.classList.contains('open');
    const content = header.nextElementSibling;

    // Close all others
    document.querySelectorAll('.accordion-item.open').forEach(openItem => {
      if (openItem !== item) {
        openItem.classList.remove('open');
        openItem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
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
});

// --- Scroll Reveal (IntersectionObserver) ---
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.reveal, .stagger').forEach(el => {
  revealObserver.observe(el);
});

// --- Active Section in Sidebar Nav ---
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.sidebar-nav .nav-link, .mobile-nav-drawer .nav-link');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, {
  threshold: 0.3,
  rootMargin: '-80px 0px -40% 0px'
});

sections.forEach(section => navObserver.observe(section));

// --- Copy Code Button ---
function copyCode(btn) {
  const codeBlock = btn.closest('.code-block');
  const code = codeBlock.querySelector('code').textContent;
  navigator.clipboard.writeText(code).then(() => {
    btn.textContent = 'Copied ✓';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = 'Copy';
      btn.classList.remove('copied');
    }, 2000);
  });
}

// --- Prompt Generator ---
function generatePrompt() {
  const sysIdentity = document.getElementById('sysIdentity').value || 'You are an expert agent';
  const sysCapabilities = document.getElementById('sysCapabilities').value || 'General reasoning and task completion';
  const sysConstraints = document.getElementById('sysConstraints').value || 'None specified';
  const sysScope = document.getElementById('sysScope').value || 'General domain';

  const taskDirective = document.getElementById('taskDirective').value || 'Complete the assigned task to the best of your ability';
  const taskOutput = document.getElementById('taskOutput').value || 'Plain text response';
  const taskEvidence = document.getElementById('taskEvidence').value || 'Standard evidentiary requirements';
  const taskSuccess = document.getElementById('taskSuccess').value || 'Task completed satisfactorily';

  const toolIndex = document.getElementById('toolIndex').value || 'No tools specified';
  const toolThreshold = document.getElementById('toolThreshold').value / 100;
  const toolDepth = document.getElementById('toolDepth').value || '3';

  const memEpisodes = document.getElementById('memEpisodes').value || 'No episodic context';
  const memPlaybook = document.getElementById('memPlaybook').value || 'No Playbook patterns';
  const memAnti = document.getElementById('memAnti').value || 'No anti-patterns specified';
  const memCompression = document.getElementById('memCompression').value;

  const routeCategory = document.getElementById('routeCategory').value;
  const routeTrigger = document.getElementById('routeTrigger').value || 'No sub-agent trigger specified';
  const routeHandoff = document.getElementById('routeHandoff').value || 'No handoff format specified';

  const compressionLabels = {
    'session_end': 'End of session',
    'threshold_count': 'After N interactions',
    'manual': 'Manual only',
    'realtime': 'Real-time'
  };

  const categoryLabels = {
    'code_review': 'Code Review',
    'architecture': 'Architecture Design',
    'debugging': 'Debugging',
    'documentation': 'Documentation',
    'testing': 'Testing',
    'security': 'Security Audit',
    'performance': 'Performance Analysis',
    'custom': 'Custom'
  };

  const prompt = `=== SYSTEM PROMPT ===

## Layer 1: System

**Identity:** ${sysIdentity}

**Capabilities:**
${sysCapabilities.split(',').map(c => `- ${c.trim()}`).join('\n')}

**Hard Constraints:**
${sysConstraints.split('\n').filter(l => l.trim()).map(l => `- ${l.trim()}`).join('\n') || '- None specified'}

**Domain Scope:** ${sysScope}

## Layer 2: Task

**Primary Directive:** ${taskDirective}

**Output Format:** ${taskOutput}

**Evidentiary Standard:** ${taskEvidence}

**Success Criterion:** ${taskSuccess}

## Layer 3: Tools

**Available Tools (Index Only — full schemas loaded JIT if relevance >= ${toolThreshold.toFixed(2)}):**
${toolIndex.split('\n').filter(l => l.trim()).map(l => `- ${l.trim()}`).join('\n')}

**Max Tool Chain Depth:** ${toolDepth}

## Layer 4: Memory

**Episodic Context (decays by half-life):**
${memEpisodes.split('\n').filter(l => l.trim()).map(l => `- ${l.trim()}`).join('\n')}

**Playbook Patterns (pinned, persistent):**
${memPlaybook.split('\n').filter(l => l.trim()).map(l => `- ${l.trim()}`).join('\n')}

**Anti-Patterns (strictly forbidden):**
${memAnti.split('\n').filter(l => l.trim()).map(l => `- ${l.trim()}`).join('\n')}

**Compression Trigger:** ${compressionLabels[memCompression] || memCompression}

## Layer 5: Routing

**Task Category:** ${categoryLabels[routeCategory] || routeCategory}

**Sub-Agent Trigger:** ${routeTrigger}

**Handoff Format:** ${routeHandoff}

---
**Context Budget:** System + Task always loaded. Tool/Memory/Routing layers loaded dynamically based on relevance threshold (${toolThreshold.toFixed(2)}).`;

  const outputArea = document.getElementById('outputArea');
  const generatedPrompt = document.getElementById('generatedPrompt');

  generatedPrompt.querySelector('code').textContent = prompt;
  outputArea.style.display = 'block';

  // Scroll to output
  outputArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function copyPrompt() {
  const prompt = document.getElementById('generatedPrompt').querySelector('code').textContent;
  const btn = document.getElementById('copyPromptBtn');

  navigator.clipboard.writeText(prompt).then(() => {
    btn.textContent = 'Copied ✓';
    setTimeout(() => {
      btn.textContent = 'Copy';
    }, 2000);
  });
}

// --- Smooth scroll for anchor links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// --- Init: mark first accordion as open ---
document.querySelectorAll('.accordion-item.open').forEach(item => {
  const header = item.querySelector('.accordion-header');
  if (header) header.setAttribute('aria-expanded', 'true');
});

// Expose functions globally for onclick handlers
window.copyCode = copyCode;
window.generatePrompt = generatePrompt;
window.copyPrompt = copyPrompt;
