/* =========================================
   contato.js — Form validation & submission
   Connect Digital
   ========================================= */

(function initContactForm() {
  const form        = document.getElementById('contactForm');
  if (!form) return;

  const nameEl    = document.getElementById('inputName');
  const emailEl   = document.getElementById('inputEmail');
  const messageEl = document.getElementById('inputMessage');
  const submitBtn = document.getElementById('submitFormBtn');
  const successEl = document.getElementById('formSuccess');
  const errName   = document.getElementById('errorName');
  const errEmail  = document.getElementById('errorEmail');
  const errMsg    = document.getElementById('errorMessage');

  const validators = {
    name:    (v) => v.trim().length >= 2 ? '' : 'Por favor, informe seu nome.',
    email:   (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Informe um e-mail válido.',
    message: (v) => v.trim().length >= 10 ? '' : 'A mensagem deve ter ao menos 10 caracteres.',
  };

  function showError(input, errEl, msg) {
    if (!errEl) return;
    errEl.textContent = msg;
    input.style.borderColor = msg ? '#FF5F57' : '';
  }

  function clearError(input, errEl) {
    showError(input, errEl, '');
  }

  // Live validation
  nameEl?.addEventListener('blur', () => {
    showError(nameEl, errName, validators.name(nameEl.value));
  });
  emailEl?.addEventListener('blur', () => {
    showError(emailEl, errEmail, validators.email(emailEl.value));
  });
  messageEl?.addEventListener('blur', () => {
    showError(messageEl, errMsg, validators.message(messageEl.value));
  });

  // Clear error on input
  [nameEl, emailEl, messageEl].forEach(el => {
    el?.addEventListener('input', () => {
      el.style.borderColor = '';
    });
  });

  // Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameErr  = validators.name(nameEl?.value || '');
    const emailErr = validators.email(emailEl?.value || '');
    const msgErr   = validators.message(messageEl?.value || '');

    showError(nameEl, errName, nameErr);
    showError(emailEl, errEmail, emailErr);
    showError(messageEl, errMsg, msgErr);

    if (nameErr || emailErr || msgErr) {
      // Focus first error
      if (nameErr) nameEl.focus();
      else if (emailErr) emailEl.focus();
      else messageEl.focus();
      return;
    }

    // Show loading state
    const btnText    = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    if (btnText)    btnText.style.display    = 'none';
    if (btnLoading) btnLoading.style.display = 'inline-flex';
    submitBtn.disabled = true;

    // Build mailto fallback (or integrate backend later)
    const service = document.getElementById('inputService')?.value || '';
    const phone   = document.getElementById('inputPhone')?.value || '';
    const name    = nameEl.value.trim();
    const email   = emailEl.value.trim();
    const message = messageEl.value.trim();

    // Simulate async (replace with actual fetch when backend is ready)
    await new Promise(r => setTimeout(r, 1200));

    // Redirect to WhatsApp with pre-filled message
    const waText = encodeURIComponent(
      `Olá! Meu nome é ${name}.\n` +
      (service ? `Interesse: ${service}\n` : '') +
      (phone   ? `WhatsApp/Tel: ${phone}\n` : '') +
      `E-mail: ${email}\n\n${message}`
    );

    // Show success
    if (btnText)    btnText.style.display    = 'inline';
    if (btnLoading) btnLoading.style.display = 'none';
    submitBtn.disabled = false;

    form.style.display = 'none';
    if (successEl) successEl.style.display = 'flex';

    // Open WhatsApp after short delay
    setTimeout(() => {
      window.open(`https://wa.me/5551991962040?text=${waText}`, '_blank', 'noopener');
    }, 800);
  });
})();

// -- Phone mask --
(function initPhoneMask() {
  const phone = document.getElementById('inputPhone');
  if (!phone) return;

  phone.addEventListener('input', () => {
    let v = phone.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    if (v.length > 10) v = v.slice(0,10) + '-' + v.slice(10);
    phone.value = v;
  });
})();
