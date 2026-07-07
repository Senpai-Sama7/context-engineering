/* =================================================================
   AI Spec Genesis
   Turns a vague idea into a spec-driven, context-engineered prompt
   package for AI coding agents. No technical knowledge required.
   ================================================================= */
(function () {
  'use strict';

  /* ---------- Provider registry ---------- */
  var ZEN_BASE = '/api/zen';

  var PROVIDERS = {
    google: {
      label: 'Google Gemini',
      models: ['gemini-3.5-flash', 'gemini-3.1-pro', 'gemini-3-flash'],
      defaultModel: 'gemini-3.5-flash',
      needsBaseUrl: false,
      keyPlaceholder: 'AIza…',
      keyLink: 'https://aistudio.google.com/apikey',
      keyLinkText: 'Get a Google API key →',
      testUrl: function (key) {
        return 'https://generativelanguage.googleapis.com/v1beta/models?key=' + encodeURIComponent(key);
      },
      testHeaders: function () { return {}; },
      call: function (cfg, systemPrompt, userPrompt, useJsonMode) {
        var url = 'https://generativelanguage.googleapis.com/v1beta/models/' +
          encodeURIComponent(cfg.model) + ':generateContent?key=' + encodeURIComponent(cfg.apiKey);
        var genCfg = { temperature: 0.7, maxOutputTokens: 8192 };
        if (useJsonMode) genCfg.responseMimeType = 'application/json';
        var body = {
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: genCfg
        };
        return fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        }).then(function (r) {
          if (!r.ok) return r.text().then(function (t) { throw new Error('Gemini ' + r.status + ': ' + t.slice(0, 400)); });
          return r.json();
        }).then(function (data) {
          var c = (data.candidates || [])[0] || {};
          var parts = (c.content || {}).parts || [];
          var text = parts.map(function (p) { return p.text || ''; }).join('');
          if (!text) {
            var bl = (c.finishReason || '');
            throw new Error('Gemini returned no text' + (bl ? ' (finishReason: ' + bl + ')' : ''));
          }
          return text;
        });
      }
    },
    openai: {
      label: 'OpenAI',
      models: ['gpt-5.5', 'gpt-5.4', 'gpt-5.4-mini', 'gpt-5.4-nano', 'gpt-5.3-codex'],
      defaultModel: 'gpt-5.4',
      needsBaseUrl: false,
      keyPlaceholder: 'sk-…',
      keyLink: 'https://platform.openai.com/api-keys',
      keyLinkText: 'Get an OpenAI API key →',
      testUrl: function () { return 'https://api.openai.com/v1/models'; },
      testHeaders: function (key) { return { 'Authorization': 'Bearer ' + key }; },
      call: function (cfg, systemPrompt, userPrompt, useJsonMode) {
        var body = {
          model: cfg.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 8192
        };
        if (useJsonMode) body.response_format = { type: 'json_object' };
        return fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cfg.apiKey
          },
          body: JSON.stringify(body)
        }).then(function (r) {
          if (!r.ok) return r.text().then(function (t) { throw new Error('OpenAI ' + r.status + ': ' + t.slice(0, 400)); });
          return r.json();
        }).then(function (data) {
          var text = (((data.choices || [])[0] || {}).message || {}).content || '';
          if (!text) throw new Error('OpenAI returned empty response');
          return text;
        });
      }
    },
    opencode: {
      label: 'OpenCode Zen',
      models: [
        'claude-sonnet-5', 'claude-sonnet-4-6', 'claude-sonnet-4-5', 'claude-sonnet-4',
        'claude-haiku-4-5',
        'claude-opus-4-8', 'claude-opus-4-7', 'claude-opus-4-6', 'claude-opus-4-5', 'claude-opus-4-1',
        'claude-fable-5',
        'deepseek-v4-pro', 'deepseek-v4-flash',
        'gemini-3.5-flash', 'gemini-3.1-pro', 'gemini-3-flash',
        'glm-5.2', 'glm-5.1', 'glm-5',
        'gpt-5.5', 'gpt-5.5-pro', 'gpt-5.4', 'gpt-5.4-pro', 'gpt-5.4-mini', 'gpt-5.4-nano',
        'gpt-5.3-codex-spark', 'gpt-5.3-codex',
        'gpt-5.2', 'gpt-5.2-codex', 'gpt-5.1', 'gpt-5.1-codex-max', 'gpt-5.1-codex', 'gpt-5.1-codex-mini',
        'gpt-5', 'gpt-5-codex', 'gpt-5-nano',
        'grok-build-0.1',
        'kimi-k2.7-code', 'kimi-k2.6', 'kimi-k2.5',
        'minimax-m3', 'minimax-m2.7', 'minimax-m2.5',
        'qwen3.6-plus', 'qwen3.5-plus',
        'big-pickle',
        'deepseek-v4-flash-free', 'hy3-free', 'mimo-v2.5-free', 'nemotron-3-ultra-free', 'north-mini-code-free'
      ],
      defaultModel: 'glm-5.2',
      needsBaseUrl: false,
      hardcodedBase: ZEN_BASE,
      keyPlaceholder: 'ocz_…',
      keyLink: 'https://opencode.ai/auth',
      keyLinkText: 'Get an OpenCode Zen API key →',
      testUrl: function () { return ZEN_BASE + '/models'; },
      testHeaders: function (key) { return { 'Authorization': 'Bearer ' + key }; },
      call: function (cfg, systemPrompt, userPrompt, useJsonMode) {
        var body = {
          model: cfg.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 8192
        };
        if (useJsonMode) body.response_format = { type: 'json_object' };
        return fetch(ZEN_BASE + '/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cfg.apiKey
          },
          body: JSON.stringify(body)
        }).then(function (r) {
          if (!r.ok) return r.text().then(function (t) { throw new Error('OpenCode Zen ' + r.status + ': ' + t.slice(0, 400)); });
          return r.json();
        }).then(function (data) {
          var text = (((data.choices || [])[0] || {}).message || {}).content || '';
          if (!text) throw new Error('OpenCode Zen returned empty response');
          return text;
        });
      }
    },
    custom: {
      label: 'Custom (OpenAI-compatible)',
      models: [],
      defaultModel: '',
      needsBaseUrl: true,
      keyPlaceholder: 'API key',
      keyLink: null,
      keyLinkText: null,
      testUrl: function () { return null; },
      testHeaders: function (key) { return { 'Authorization': 'Bearer ' + key }; },
      call: function (cfg, systemPrompt, userPrompt, useJsonMode) {
        var base = (cfg.baseUrl || '').replace(/\/+$/, '');
        if (!base) throw new Error('Base URL required');
        var body = {
          model: cfg.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 8192
        };
        if (useJsonMode) body.response_format = { type: 'json_object' };
        return fetch(base + '/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cfg.apiKey
          },
          body: JSON.stringify(body)
        }).then(function (r) {
          if (!r.ok) return r.text().then(function (t) { throw new Error('Custom ' + r.status + ': ' + t.slice(0, 400)); });
          return r.json();
        }).then(function (data) {
          var text = (((data.choices || [])[0] || {}).message || {}).content || '';
          if (!text) throw new Error('Custom provider returned empty response');
          return text;
        });
      }
    }
  };

  /* ---------- System prompts (the IP) ---------- */

  var DECISION_SYSTEM_PROMPT = [
    'You are an elite software architect and product strategist.',
    'A NON-TECHNICAL person has described what they want to build, in vague terms.',
    'Your job: identify the KEY technical and product decisions that must be made to turn',
    'this idea into a precise specification for an AI coding agent — and present each',
    'decision as multiple-choice options that a non-technical person can understand and choose.',
    '',
    'For EACH decision you MUST provide:',
    '- id: a slug like "d1", "d2"',
    '- question: a clear question in PLAIN language (no jargon, define any unavoidable term inline)',
    '- helper: one sentence on WHY this decision matters for THIS project',
    '- options: an array of 2 to 5 options. For EACH option:',
    '    - id: "a", "b", "c"...',
    '    - title: short label (2-5 words)',
    '    - description: what it is, plain language (1-2 sentences)',
    '    - use_cases: array of 1-3 concrete situations where this is the right pick',
    '    - pros: array of 1-3 advantages',
    '    - cons: array of 1-3 disadvantages or tradeoffs',
    '    - recommended: boolean — true for exactly ONE option per decision',
    '    - recommendation_reason: why recommended (or not), referencing the user\'s idea',
    '',
    'RULES:',
    '- Generate ONLY decisions relevant to THIS specific idea. Skip generic decisions that',
    '  do not matter for this project. Typically 4 to 7 decisions.',
    '- Exactly ONE option per decision has recommended: true.',
    '- Plain language. A non-technical person must understand every word.',
    '- Decisions are about HOW to build (architecture, stack, scale, auth, data, deployment,',
    '  UX paradigm, integrations, quality bar). Do not invent features the user did not mention.',
    '- If a core ambiguity in the idea needs clarifying, include it as a decision.',
    '',
    'Return ONLY a JSON object with this exact shape:',
    '{',
    '  "project_summary": "one sentence restating what the user wants, refined and specific",',
    '  "decisions": [ { "id": "...", "question": "...", "helper": "...", "options": [ ... ] } ]',
    '}'
  ].join('\n');

  var SPEC_SYSTEM_PROMPT = [
    'You are an elite AI engineering architect specializing in spec-driven, context-engineered',
    'prompts for AI coding agents (Claude Code, Cursor, Copilot, opencode, etc.). You produce',
    'prompt packages that enable agents to build premium, high-quality, FAANG-grade software.',
    '',
    'You will receive a user idea plus a set of decisions the user made (question + chosen option).',
    'Produce a COMPLETE specification package as JSON. Every field must be concrete and specific',
    'to THIS project. No placeholders, no "[insert X]", no vague filler.',
    '',
    'CONTEXT ENGINEERING PRINCIPLES TO APPLY:',
    '- 5-layer stratified context: System (identity, capabilities, hard constraints, domain',
    '  scope), Task (primary directive, output format, evidentiary standard, success criterion),',
    '  Tools (index-only, JIT loading, relevance threshold, max chain depth), Memory (episodic,',
    '  playbook patterns, anti-patterns, compression trigger), Routing (task category, sub-agent',
    '  triggers, handoff format).',
    '- Token budget: System+skills <=10%, Task+few-shot <=15%, Retrieved docs <=40%, Working',
    '  state <=20%, Output buffer <=15%. State the total and each percentage.',
    '- Injection order: hard constraints first (primacy zone), then task definition, few-shot',
    '  examples, background, MOST relevant context last (recency zone), then current user input.',
    '- Context rot mitigation: keep retrieved docs lean; prefer structured extraction over prose.',
    '',
    'FAANG-GRADE QUALITY BAR (bake into constraints):',
    '- Fully typed (TypeScript or equivalent), zero any/unknown escape hatches',
    '- Tested: unit + integration coverage for critical paths',
    '- Accessible (WCAG 2.2 AA for UIs), responsive, internationalized',
    '- Secure: no secrets in client, input validation everywhere, OWASP top-10 mitigated',
    '- Performant: Core Web Vitals targets for web (LCP <2.5s, INP <200ms)',
    '- Observable: structured logging, error boundaries, health checks',
    '- Documented: README, inline docstrings for public APIs only',
    '',
    'The 10-POINT prompt you generate must use XML tags for each section:',
    '<task_context>, <tone_context>, <background>, <dynamic_content>, <steps>, <examples>,',
    '<conversation_history>, <reminder>, <guardrails>, <output_format>.',
    '',
    'The HANDOFF GUIDE is critical. It is a sequenced list telling the user WHEN and HOW to',
    'deliver each artifact to their AI coding agent. Each step has: step number, when (timing/',
    'condition), what (which artifact to give), how (exact instruction — e.g. "save as',
    'CLAUDE.md in repo root" or "paste as the first message"), and file_or_prompt (the artifact',
    'name). Order matters: scaffolding first, then system prompt, then task prompts, then',
    'quality checks.',
    '',
    'Return ONLY this JSON shape:',
    '{',
    '  "project_brief": { "title": "...", "one_liner": "...", "audience": "..." },',
    '  "system_prompt": "full 5-layer stratified system prompt as markdown",',
    '  "ten_point_prompt": "full 10-point XML-tagged prompt string",',
    '  "context_budget": { "total_tokens": 200000, "system_pct": 10, "task_pct": 15, "retrieved_pct": 35, "working_pct": 25, "output_pct": 15, "notes": "..." },',
    '  "file_structure": "project tree as a string with indentation and comments",',
    '  "tech_stack": [ { "layer": "Frontend", "choice": "...", "why": "..." } ],',
    '  "handoff_guide": [ { "step": 1, "when": "...", "what": "...", "how": "...", "file_or_prompt": "..." } ],',
    '  "quality_checklist": [ "..." ]',
    '}'
  ].join('\n');

  /* ---------- State ---------- */
  var state = {
    provider: 'google',
    apiKey: '',
    baseUrl: '',
    model: '',
    decisions: [],
    selections: {},
    specPackage: null
  };

  /* ---------- DOM helpers ---------- */
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function setStatus(msg, ok) {
    var s = $('sgConnectionStatus');
    if (!s) return;
    s.textContent = msg || '';
    s.className = 'sg-status' + (ok === true ? ' ok' : ok === false ? ' err' : '');
  }

  /* ---------- JSON extraction (robust) ---------- */
  function extractJSON(text) {
    if (!text) throw new Error('Empty response from AI');
    var t = text.trim();
    // strip markdown fences
    if (t.indexOf('```') === 0) {
      t = t.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
    }
    // try direct
    try { return JSON.parse(t); } catch (e) {}
    // try finding first { ... last }
    var first = t.indexOf('{');
    var last = t.lastIndexOf('}');
    if (first !== -1 && last !== -1 && last > first) {
      return JSON.parse(t.slice(first, last + 1));
    }
    throw new Error('Could not parse JSON from AI response');
  }

  /* ---------- Provider UI ---------- */
  function initProviderUI() {
    var sel = $('sgProvider');
    var keyInput = $('sgApiKey');
    var baseUrlInput = $('sgBaseUrl');
    var baseUrlGroup = $('sgBaseUrlGroup');
    var keyLink = $('sgKeyLink');

    function populateModels() {
      var p = PROVIDERS[state.provider];
      var current = $('sgModel');
      var wrapper = current ? current.parentNode : $('sgModelGroup');
      if (!wrapper) return;
      var desired = p.models.length === 0 ? 'input' : 'select';
      var tagNow = current ? current.tagName.toLowerCase() : '';
      if (tagNow !== desired) {
        var fresh = desired === 'select'
          ? (function () { var s = document.createElement('select'); s.className = 'form-select'; s.id = 'sgModel'; return s; }())
          : (function () { var i = document.createElement('input'); i.type = 'text'; i.className = 'form-input'; i.id = 'sgModel'; return i; }());
        wrapper.replaceChild(fresh, current);
        fresh.addEventListener('input', function () { state.model = fresh.value; });
      }
      var node = $('sgModel');
      if (desired === 'select') {
        node.innerHTML = '';
        p.models.forEach(function (m) {
          var o = document.createElement('option');
          o.value = m; o.textContent = m;
          if (m === (state.model || p.defaultModel)) o.selected = true;
          node.appendChild(o);
        });
        state.model = node.value;
      } else {
        node.placeholder = 'e.g., ' + p.defaultModel;
        node.value = state.model || p.defaultModel;
      }
      baseUrlGroup.style.display = p.needsBaseUrl ? '' : 'none';
      // key placeholder + link
      keyInput.placeholder = p.keyPlaceholder || 'API key';
      if (keyLink) {
        if (p.keyLink) {
          keyLink.href = p.keyLink;
          keyLink.textContent = p.keyLinkText || '';
          keyLink.style.display = '';
        } else {
          keyLink.style.display = 'none';
        }
      }
    }

    function onProviderChange() {
      state.provider = sel.value;
      state.model = PROVIDERS[state.provider].defaultModel;
      populateModels();
      setStatus('');
    }

    sel.addEventListener('change', onProviderChange);
    keyInput.addEventListener('input', function () { state.apiKey = keyInput.value.trim(); });
    baseUrlInput.addEventListener('input', function () { state.baseUrl = baseUrlInput.value.trim(); });

    // restore from sessionStorage
    try {
      var saved = JSON.parse(sessionStorage.getItem('sg_config') || '{}');
      if (saved.provider) { sel.value = saved.provider; state.provider = saved.provider; }
      if (saved.apiKey) { keyInput.value = saved.apiKey; state.apiKey = saved.apiKey; }
      if (saved.baseUrl) { baseUrlInput.value = saved.baseUrl; state.baseUrl = saved.baseUrl; }
      if (saved.model) state.model = saved.model;
    } catch (e) {}
    populateModels();

    // save config on blur
    keyInput.addEventListener('blur', saveConfig);
    baseUrlInput.addEventListener('blur', saveConfig);

    // test connection
    var testBtn = $('sgTestBtn');
    if (testBtn) testBtn.addEventListener('click', testConnection);
  }

  function saveConfig() {
    try {
      sessionStorage.setItem('sg_config', JSON.stringify({
        provider: state.provider,
        apiKey: state.apiKey,
        baseUrl: state.baseUrl,
        model: state.model
      }));
    } catch (e) {}
  }

  function getConfig() {
    var p = PROVIDERS[state.provider];
    if (!state.apiKey) throw new Error('Enter your API key first (Step 0).');
    var cfg = { apiKey: state.apiKey, model: state.model || p.defaultModel };
    if (p.needsBaseUrl) cfg.baseUrl = state.baseUrl;
    return { provider: p, cfg: cfg };
  }

  /* ---------- Test connection ---------- */
  function testConnection() {
    var p = PROVIDERS[state.provider];
    if (!state.apiKey) { setStatus('Enter your API key first.', false); return; }
    if (p.needsBaseUrl && !state.baseUrl) { setStatus('Enter a base URL first.', false); return; }
    setStatus('Testing connection…', null);
    var url;
    var headers = {};
    if (state.provider === 'google') {
      url = p.testUrl(state.apiKey);
    } else if (state.provider === 'custom') {
      var base = (state.baseUrl || '').replace(/\/+$/, '');
      url = base + '/models';
      headers = p.testHeaders(state.apiKey);
    } else {
      url = p.testUrl();
      headers = p.testHeaders(state.apiKey);
    }
    fetch(url, { method: 'GET', headers: headers })
      .then(function (r) {
        if (!r.ok) return r.text().then(function (t) { throw new Error('HTTP ' + r.status + ': ' + t.slice(0, 200)); });
        return r.json();
      })
      .then(function () {
        saveConfig();
        setStatus('Connected! Your key works. Ready to analyze ideas.', true);
      })
      .catch(function (err) {
        var msg = err.message || 'Connection failed';
        if (msg.indexOf('Failed to fetch') !== -1 || msg.indexOf('NetworkError') !== -1) {
          var hints = {
            google: 'Make sure your Google API key is correct and the Generative Language API is enabled in your GCP project.',
            openai: 'Make sure your OpenAI API key is correct and your account has billing enabled.',
            opencode: 'For OpenCode Zen, ensure your key is from opencode.ai/auth.',
            custom: 'Make sure the base URL and API key are correct, and the server supports CORS.'
          };
          msg = 'Could not reach the API. This may be a CORS restriction or network issue.\n' + (hints[state.provider] || '');
        }
        setStatus(msg, false);
      });
  }

  /* ---------- Example chips ---------- */
  function initExamples() {
    document.querySelectorAll('.sg-example-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var idea = $('sgIdea');
        if (idea) { idea.value = chip.getAttribute('data-idea'); idea.focus(); }
      });
    });
  }

  /* ---------- Call AI (with JSON-mode fallback) ---------- */
  function callAI(systemPrompt, userPrompt) {
    var setup = getConfig();
    function attempt(useJson) {
      return setup.provider.call(setup.cfg, systemPrompt, userPrompt, useJson)
        .then(function (text) { return extractJSON(text); });
    }
    // Try with JSON mode first; if it fails (e.g. model doesn't support
    // response_format), retry without it — extractJSON parses raw text too.
    return attempt(true).catch(function (err1) {
      return attempt(false).catch(function () { throw err1; });
    });
  }

  /* ---------- Step 1: Analyze idea ---------- */
  function analyzeIdea() {
    var idea = ($('sgIdea').value || '').trim();
    if (!idea) { setStatus('Please describe your idea first.', false); return; }
    if (idea.length < 10) { setStatus('Give a bit more detail (at least a sentence).', false); return; }

    var btn = $('sgAnalyzeBtn');
    var loading = $('sgAnalyzeLoading');
    btn.disabled = true; loading.style.display = 'inline';
    setStatus('');

    callAI(DECISION_SYSTEM_PROMPT, 'USER IDEA:\n' + idea)
      .then(function (data) {
        state.decisions = (data.decisions || []).filter(function (d) { return d && d.options && d.options.length; });
        if (state.decisions.length === 0) throw new Error('AI did not return any decisions. Try rephrasing your idea.');
        // pre-select recommendations
        state.selections = {};
        state.decisions.forEach(function (d) {
          var rec = d.options.find(function (o) { return o.recommended; }) || d.options[0];
          state.selections[d.id] = rec.id;
        });
        renderSummary(data.project_summary || '');
        renderDecisions();
        showStep('decisions');
        btn.disabled = false; loading.style.display = 'none';
      })
      .catch(function (err) {
        btn.disabled = false; loading.style.display = 'none';
        setStatus(err.message || 'Analysis failed.', false);
      });
  }

  function renderSummary(text) {
    var s = $('sgProjectSummary');
    if (!s) return;
    s.innerHTML = '<strong>Project:</strong> ' + escapeHtml(text);
  }

  function renderDecisions() {
    var container = $('sgDecisionsContainer');
    container.innerHTML = '';
    state.decisions.forEach(function (d) {
      var block = el('div', 'sg-decision');
      block.appendChild(el('div', 'sg-decision-q', escapeHtml(d.question)));
      if (d.helper) block.appendChild(el('div', 'sg-decision-helper', escapeHtml(d.helper)));

      var opts = el('div', 'sg-options');
      d.options.forEach(function (o) {
        var card = el('div', 'sg-option');
        if (state.selections[d.id] === o.id) card.classList.add('selected');
        if (o.recommended) {
          var badge = el('span', 'sg-option-recommend-badge', 'AI Recommends');
          card.appendChild(badge);
        }
        card.appendChild(el('div', 'sg-option-title', escapeHtml(o.title)));
        if (o.description) card.appendChild(el('div', 'sg-option-desc', escapeHtml(o.description)));

        if (o.use_cases && o.use_cases.length) {
          card.appendChild(el('span', 'sg-option-meta-label', 'Good for'));
          card.appendChild(el('div', 'sg-option-meta', '• ' + o.use_cases.map(escapeHtml).join('<br>• ')));
        }
        if (o.pros && o.pros.length) {
          card.appendChild(el('span', 'sg-option-meta-label', 'Pros'));
          card.appendChild(el('div', 'sg-option-meta sg-option-pros', '✓ ' + o.pros.map(escapeHtml).join('<br>✓ ')));
        }
        if (o.cons && o.cons.length) {
          card.appendChild(el('span', 'sg-option-meta-label', 'Cons'));
          card.appendChild(el('div', 'sg-option-meta sg-option-cons', '✗ ' + o.cons.map(escapeHtml).join('<br>✗ ')));
        }
        if (o.recommendation_reason) {
          card.appendChild(el('div', 'sg-option-rec-reason', escapeHtml(o.recommendation_reason)));
        }

        card.addEventListener('click', function () {
          state.selections[d.id] = o.id;
          opts.querySelectorAll('.sg-option').forEach(function (c) { c.classList.remove('selected'); });
          card.classList.add('selected');
          checkAllAnswered();
        });
        opts.appendChild(card);
      });
      block.appendChild(opts);
      container.appendChild(block);
    });
    checkAllAnswered();
  }

  function checkAllAnswered() {
    var all = state.decisions.every(function (d) { return state.selections[d.id]; });
    var btn = $('sgGenerateBtn');
    if (btn) btn.disabled = !all;
  }

  /* ---------- Step 2: Generate spec ---------- */
  function generateSpec() {
    var idea = ($('sgIdea').value || '').trim();
    var btn = $('sgGenerateBtn');
    var loading = $('sgGenerateLoading');
    btn.disabled = true; loading.style.display = 'inline';
    setStatus('');

    // build a compact summary of decisions for the AI
    var chosen = state.decisions.map(function (d) {
      var sel = d.options.find(function (o) { return o.id === state.selections[d.id]; }) || d.options[0];
      return {
        question: d.question,
        chosen_option: sel.title,
        description: sel.description
      };
    });
    var userPrompt = 'USER IDEA:\n' + idea + '\n\nDECISIONS MADE:\n' +
      JSON.stringify(chosen, null, 2);

    callAI(SPEC_SYSTEM_PROMPT, userPrompt)
      .then(function (pkg) {
        state.specPackage = pkg;
        renderSpecPackage(pkg);
        showStep('output');
        btn.disabled = false; loading.style.display = 'none';
      })
      .catch(function (err) {
        btn.disabled = false; loading.style.display = 'none';
        setStatus(err.message || 'Generation failed.', false);
      });
  }

  /* ---------- Render spec package ---------- */
  function renderSpecPackage(pkg) {
    setCode('sgHandoffContent', formatHandoff(pkg.handoff_guide || []));
    setCode('sgSystemContent', pkg.system_prompt || '');
    setCode('sgTenPointContent', pkg.ten_point_prompt || '');
    setCode('sgBudgetContent', formatBudget(pkg.context_budget));
    setCode('sgFilesContent', pkg.file_structure || '');
    setCode('sgStackContent', formatStack(pkg.tech_stack || []));
    setCode('sgChecklistContent', formatChecklist(pkg.quality_checklist || []));
  }

  function setCode(elId, text) {
    var pre = $(elId);
    if (!pre) return;
    var code = pre.querySelector('code');
    if (code) code.textContent = text;
  }

  function formatHandoff(guide) {
    if (!guide.length) return '(no handoff guide generated)';
    return guide.map(function (g) {
      return 'STEP ' + g.step + ' — ' + (g.what || '') +
        '\n  When:  ' + (g.when || '') +
        '\n  How:   ' + (g.how || '') +
        '\n  Artifact: ' + (g.file_or_prompt || '');
    }).join('\n\n');
  }

  function formatBudget(b) {
    if (!b) return '(no budget specified)';
    var lines = [
      'TOTAL TOKEN BUDGET: ' + (b.total_tokens || 200000),
      '',
      '  System + skills     ' + pct(b.system_pct) + '   (limit <=10%)',
      '  Task + few-shot     ' + pct(b.task_pct) + '   (limit <=15%)',
      '  Retrieved docs      ' + pct(b.retrieved_pct) + '   (limit <=40%)',
      '  Working state       ' + pct(b.working_pct) + '   (limit <=20%)',
      '  Output buffer       ' + pct(b.output_pct) + '   (limit <=15%)'
    ];
    if (b.notes) lines.push('', 'Notes: ' + b.notes);
    return lines.join('\n');
  }

  function pct(n) { return (n != null ? String(n) : '?') + '%'; }

  function formatStack(stack) {
    if (!stack.length) return '(no tech stack specified)';
    return stack.map(function (s) {
      return (s.layer || '?').padEnd(12) + ' → ' + (s.choice || '?') + (s.why ? '\n               because: ' + s.why : '');
    }).join('\n');
  }

  function formatChecklist(items) {
    if (!items.length) return '(no checklist generated)';
    return items.map(function (item, i) { return '[ ] ' + item; }).join('\n');
  }

  /* ---------- Tabs ---------- */
  function initTabs() {
    document.querySelectorAll('.sg-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        var name = tab.getAttribute('data-tab');
        document.querySelectorAll('.sg-tab').forEach(function (t) { t.classList.remove('active'); });
        document.querySelectorAll('.sg-tab-panel').forEach(function (p) { p.classList.remove('active'); });
        tab.classList.add('active');
        var panel = document.querySelector('.sg-tab-panel[data-panel="' + name + '"]');
        if (panel) panel.classList.add('active');
      });
    });
  }

  /* ---------- Copy / Download ---------- */
  function initCopyButtons() {
    var map = {
      sgCopyHandoff: 'sgHandoffContent',
      sgCopySystem: 'sgSystemContent',
      sgCopyTenPoint: 'sgTenPointContent',
      sgCopyBudget: 'sgBudgetContent',
      sgCopyFiles: 'sgFilesContent',
      sgCopyStack: 'sgStackContent',
      sgCopyChecklist: 'sgChecklistContent'
    };
    Object.keys(map).forEach(function (btnId) {
      var b = $(btnId);
      if (b) b.addEventListener('click', function () {
        var pre = $(map[btnId]);
        var code = pre ? pre.querySelector('code') : null;
        if (code) copyText(code.textContent, b);
      });
    });

    var copyAll = $('sgCopyAllBtn');
    if (copyAll) copyAll.addEventListener('click', function () {
      var md = buildFullMarkdown();
      copyText(md, copyAll);
    });

    var dl = $('sgDownloadBtn');
    if (dl) dl.addEventListener('click', function () {
      var md = buildFullMarkdown();
      var blob = new Blob([md], { type: 'text/markdown' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'spec-package.md';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    });

    var restart = $('sgRestartBtn');
    if (restart) restart.addEventListener('click', resetAll);
  }

  function buildFullMarkdown() {
    var p = state.specPackage || {};
    var brief = p.project_brief || {};
    var out = [];
    out.push('# Spec Package: ' + (brief.title || 'Project'));
    if (brief.one_liner) out.push('\n> ' + brief.one_liner);
    if (brief.audience) out.push('\n**Audience:** ' + brief.audience);
    out.push('\n---\n');
    out.push('## Handoff Guide\n\n```');
    out.push(formatHandoff(p.handoff_guide || []));
    out.push('```\n');
    out.push('## 5-Layer System Prompt\n\n```markdown');
    out.push(p.system_prompt || '');
    out.push('```\n');
    out.push('## 10-Point Structured Prompt\n\n```xml');
    out.push(p.ten_point_prompt || '');
    out.push('```\n');
    out.push('## Context Budget\n\n```');
    out.push(formatBudget(p.context_budget));
    out.push('```\n');
    out.push('## File Structure\n\n```\n' + (p.file_structure || '') + '\n```\n');
    out.push('## Tech Stack\n\n```');
    out.push(formatStack(p.tech_stack || []));
    out.push('```\n');
    out.push('## Quality Checklist\n\n```');
    out.push(formatChecklist(p.quality_checklist || []));
    out.push('```');
    return out.join('\n');
  }

  function copyText(text, btn) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { flashBtn(btn); }, function () { fallbackCopy(text, btn); });
    } else { fallbackCopy(text, btn); }
  }
  function fallbackCopy(text, btn) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); flashBtn(btn); } catch (e) {}
    ta.remove();
  }
  function flashBtn(btn) {
    if (!btn) return;
    var orig = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(function () { btn.textContent = orig; }, 1400);
  }

  /* ---------- Utils ---------- */
  function escapeHtml(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function showStep(step) {
    var map = { decisions: ['sgStepDecisions', 'sgDivAfterIdea'],
                output: ['sgStepOutput', 'sgDivAfterDecisions'] };
    (map[step] || []).forEach(function (id) {
      var e = $(id); if (e) { e.style.display = ''; e.classList.add('visible'); }
    });
    var target = step === 'decisions' ? $('sgStepDecisions') : $('sgStepOutput');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function resetAll() {
    state.decisions = []; state.selections = {}; state.specPackage = null;
    ['sgStepDecisions', 'sgStepOutput', 'sgDivAfterIdea', 'sgDivAfterDecisions'].forEach(function (id) {
      var e = $(id); if (e) e.style.display = 'none';
    });
    var idea = $('sgIdea'); if (idea) idea.value = '';
    var c = $('sgDecisionsContainer'); if (c) c.innerHTML = '';
    setStatus('');
    var step = $('sgStepIdea'); if (step) step.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------- Wire up ---------- */
  function init() {
    initProviderUI();
    initExamples();
    initTabs();
    initCopyButtons();
    var ab = $('sgAnalyzeBtn'); if (ab) ab.addEventListener('click', analyzeIdea);
    var gb = $('sgGenerateBtn'); if (gb) gb.addEventListener('click', generateSpec);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
