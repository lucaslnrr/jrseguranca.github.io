document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formulario');
  if (!form) return;

  // Allow overriding the API endpoint via <meta name="contact-api"> or form[data-api]
  const API_URL =
    (document.querySelector('meta[name="contact-api"]')?.content || '') ||
    (form.getAttribute('data-api') || '') ||
    'https://mailtest.tesfire.com/api/email';

  // Prefer a page-specific submit button, but fallback gracefully
  const submitBtn = document.getElementById('contact-submit') || document.getElementById('form-submit') || form.querySelector('button[type="submit"],input[type="submit"]');

  const get = (sel) => form.querySelector(sel);
  const first = (selectors) => {
    for (const s of selectors) {
      const el = get(s);
      if (el) return el;
    }
    return null;
  };
  const val = (selectors, fallback = '') => {
    const el = first(selectors);
    const v = el && typeof el.value === 'string' ? el.value.trim() : '';
    return v || fallback;
  };

  // Use an existing success element if available, else create a status element on the fly
  let statusEl = document.getElementById('form-success') || document.getElementById('contact-status');
  if (!statusEl) {
    statusEl = document.createElement('div');
    statusEl.id = 'contact-status';
    statusEl.setAttribute('role', 'status');
    statusEl.setAttribute('aria-live', 'polite');
    statusEl.style.marginLeft = '12px';
    statusEl.hidden = true;
    // append next to the submit button if exists, otherwise at the end
    if (submitBtn && submitBtn.parentElement) {
      submitBtn.parentElement.appendChild(statusEl);
    } else {
      form.appendChild(statusEl);
    }
  }

  const setStatus = (msg, ok = true) => {
    if (!statusEl) return;
    statusEl.textContent = msg || '';
    const visible = Boolean(msg);
    statusEl.hidden = !visible;
    // apply classes with transition support
    const baseClass = ok ? 'form-success' : 'field-error';
    statusEl.className = visible ? (baseClass + ' is-visible') : baseClass;
  };

  const lock = (v) => {
    if (submitBtn) {
      submitBtn.disabled = v;
      try { submitBtn.classList.toggle('is-loading', v); } catch (_) {}
    }
  };

  const onSubmit = async (ev) => {
    try {
      // If another listener already prevented default (e.g., validation), respect it
      if (ev.defaultPrevented) return;
      // We handle submission via fetch
      ev.preventDefault();

      // Collect values (supporting both index.html and contato.html)
      const nome = val(['#nome', '#contato-nome', '[name="nome"]']);
      const empresa = val(['#empresa', '#contato-empresa', '[name="empresa"]']);
      const email = val(['#email', '#contato-email', '[name="email"]']);
      const telefone = val(['#telefone', '#contato-telefone', '[name="telefone"]']);
      const assunto = val(['#assunto', '#contato-assunto', '[name="assunto"]'], 'Contato pelo site');
      const mensagem = val(['#mensagem', '#contato-mensagem', '[name="mensagem"]']);

      // Minimal required checks if page didn't run its own validator
      if (!nome || !email || !mensagem) {
        if (typeof form.reportValidity === 'function') form.reportValidity();
        return;
      }

      const payload = {
        name: nome,
        company: empresa,
        email,
        phone: telefone,
        subject: assunto,
        message: mensagem,
        source: (window.location && window.location.pathname) ? window.location.pathname.split('/').pop() : 'unknown',
        site: (window.location && window.location.hostname) || 'localhost',
        timestamp: new Date().toISOString(),
      };

      lock(true);
      setStatus('Enviando...', true);

      // Use URL-encoded form to avoid CORS preflight and match server-side support
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 20000);

      let resp;
      try {
        resp = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'Accept': 'application/json',
          },
          body: new URLSearchParams(payload).toString(),
          signal: controller.signal,
        });
      } finally {
        window.clearTimeout(timeoutId);
      }

      const contentType = resp.headers.get && resp.headers.get('content-type');
      const isJson = contentType && contentType.toLowerCase().includes('application/json');

      let data = null;
      if (isJson) {
        try { data = await resp.json(); } catch (_) { data = null; }
      } else {
        try { data = { message: await resp.text() }; } catch (_) { data = null; }
      }

      if (!resp.ok) {
        const msg = (data && (data.message || data.error)) || `Erro ${resp.status}`;
        throw new Error(msg);
      }

      setStatus('Mensagem enviada com sucesso. Obrigado!', true);
      try { form.reset(); } catch (_) {}
      window.setTimeout(() => setStatus('', true), 6000);
    } catch (err) {
      const msg = (err && err.message) ? String(err.message) : 'Falha ao enviar. Tente novamente em instantes.';
      setStatus(msg, false);
      try { console.error('Envio de contato falhou:', err); } catch (_) {}
    } finally {
      lock(false);
    }
  };

  form.addEventListener('submit', onSubmit);
});
