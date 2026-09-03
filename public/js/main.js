/* ==========================================================================
   BITWISE SCHOOL OF TECHNOLOGY - CLIENT-SIDE NEURAL CORE (JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initTerminal();
  initAiAssistant();
  initApplicationWizard();
  initIsaCalculator();
  initHackathonCountdowns();
  initProjectUpvoting();
  initMobileMenu();
  initAudioFx();
});

// ==========================================================================
// 1. NEURAL PARTICLE & CONNECTING GRID CANVAS
// ==========================================================================
function initParticleCanvas() {
  const canvas = document.getElementById('cyber-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = 45;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.4 ? 'rgba(0, 240, 255, 0.5)' : 'rgba(157, 78, 221, 0.5)';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting neural lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.15 * (1 - dist / 140)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Update and draw particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

// ==========================================================================
// 2. INTERACTIVE HERO TERMINAL (CLI)
// ==========================================================================
function initTerminal() {
  const terminalInput = document.getElementById('terminal-cli-input');
  const terminalBody = document.getElementById('terminal-cli-body');
  const chips = document.querySelectorAll('.cmd-chip');

  if (!terminalInput || !terminalBody) return;

  terminalInput.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      const command = terminalInput.value.trim();
      if (!command) return;

      terminalInput.value = '';
      await executeCommand(command);
    }
  });

  chips.forEach(chip => {
    chip.addEventListener('click', async () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) {
        await executeCommand(cmd);
      }
    });
  });

  async function executeCommand(command) {
    if (command.toLowerCase() === 'clear') {
      terminalBody.innerHTML = `
        <div class="terminal-line"><span class="terminal-prompt">bitwise@guest:~$</span> <span class="terminal-output">Buffer cleared. Type 'help' for instructions.</span></div>
      `;
      return;
    }

    // Append user input line
    const userLine = document.createElement('div');
    userLine.className = 'terminal-line';
    userLine.innerHTML = `<span class="terminal-prompt">bitwise@guest:~$</span> ${escapeHtml(command)}`;
    terminalBody.appendChild(userLine);

    try {
      const res = await fetch('/api/terminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command })
      });
      const data = await res.json();

      const outputLine = document.createElement('div');
      outputLine.className = 'terminal-line terminal-output';
      outputLine.innerText = data.output;
      terminalBody.appendChild(outputLine);

      if (data.action === 'redirect_apply') {
        setTimeout(() => {
          window.location.href = '/apply';
        }, 1500);
      }
    } catch (err) {
      const errLine = document.createElement('div');
      errLine.className = 'terminal-line terminal-output';
      errLine.style.color = '#ff0055';
      errLine.innerText = '⚠️ Terminal connection gateway timed out.';
      terminalBody.appendChild(errLine);
    }

    terminalBody.scrollTop = terminalBody.scrollHeight;
  }
}

// ==========================================================================
// 3. BITWISE AI NAVIGATOR CHATBOT
// ==========================================================================
function initAiAssistant() {
  const trigger = document.getElementById('ai-bot-trigger');
  const drawer = document.getElementById('ai-bot-drawer');
  const closeBtn = document.getElementById('ai-bot-close');
  const chatBody = document.getElementById('ai-bot-messages');
  const input = document.getElementById('ai-bot-input');
  const sendBtn = document.getElementById('ai-bot-send');
  const chips = document.querySelectorAll('.ai-prompt-chip');

  if (!trigger || !drawer) return;

  trigger.addEventListener('click', () => {
    drawer.classList.toggle('active');
    if (drawer.classList.contains('active') && input) {
      input.focus();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      drawer.classList.remove('active');
    });
  }

  async function sendMessage(text) {
    if (!text.trim()) return;

    // Append user message
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble chat-bubble-user';
    userBubble.innerText = text;
    chatBody.appendChild(userBubble);
    chatBody.scrollTop = chatBody.scrollHeight;

    // Show typing state
    const typingBubble = document.createElement('div');
    typingBubble.className = 'chat-bubble chat-bubble-bot';
    typingBubble.innerText = '⚡ Synthesizing neural response...';
    chatBody.appendChild(typingBubble);
    chatBody.scrollTop = chatBody.scrollHeight;

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text })
      });
      const data = await res.json();
      typingBubble.innerText = data.reply;
    } catch (err) {
      typingBubble.innerText = "I'm experiencing high neural load. Please try asking about admissions or the H100 GPU cluster.";
    }

    chatBody.scrollTop = chatBody.scrollHeight;
  }

  if (sendBtn && input) {
    sendBtn.addEventListener('click', () => {
      const text = input.value.trim();
      if (text) {
        sendMessage(text);
        input.value = '';
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const text = input.value.trim();
        if (text) {
          sendMessage(text);
          input.value = '';
        }
      }
    });
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-prompt');
      if (prompt) {
        sendMessage(prompt);
      }
    });
  });
}

// ==========================================================================
// 4. MULTI-STEP ADMISSIONS APPLICATION WIZARD
// ==========================================================================
function initApplicationWizard() {
  const form = document.getElementById('admissions-wizard-form');
  if (!form) return;

  const panels = document.querySelectorAll('.step-panel');
  const stepItems = document.querySelectorAll('.step-item');
  const nextBtns = document.querySelectorAll('.btn-next-step');
  const prevBtns = document.querySelectorAll('.btn-prev-step');
  let currentStep = 1;

  function updateSteps(step) {
    currentStep = step;
    panels.forEach(p => {
      p.classList.remove('active');
      if (p.getAttribute('data-step') === String(step)) {
        p.classList.add('active');
      }
    });

    stepItems.forEach(item => {
      const s = Number(item.getAttribute('data-step'));
      item.classList.remove('active', 'completed');
      if (s === step) item.classList.add('active');
      else if (s < step) item.classList.add('completed');
    });

    window.scrollTo({ top: form.offsetTop - 100, behavior: 'smooth' });
  }

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Validate current panel required fields
      const activePanel = document.querySelector(`.step-panel[data-step="${currentStep}"]`);
      const inputs = activePanel.querySelectorAll('input[required], select[required], textarea[required]');
      let valid = true;

      inputs.forEach(input => {
        if (!input.value.trim()) {
          valid = false;
          input.style.borderColor = '#ff0055';
          input.addEventListener('input', () => { input.style.borderColor = ''; }, { once: true });
        }
      });

      if (!valid) {
        alert('Please complete all required fields in this step before proceeding.');
        return;
      }

      if (currentStep < panels.length) {
        updateSteps(currentStep + 1);
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 1) {
        updateSteps(currentStep - 1);
      }
    });
  });
}

// ==========================================================================
// 5. INTERACTIVE INCOME SHARE AGREEMENT (ISA) CALCULATOR
// ==========================================================================
function initIsaCalculator() {
  const salarySlider = document.getElementById('isa-salary-slider');
  const salaryDisplay = document.getElementById('isa-salary-val');
  const monthlyPaymentDisplay = document.getElementById('isa-monthly-payment');
  const totalRepaymentDisplay = document.getElementById('isa-total-repayment');
  const thresholdAlert = document.getElementById('isa-threshold-alert');

  if (!salarySlider) return;

  function calculate() {
    const annualSalaryLakhs = parseFloat(salarySlider.value); // In Lakhs INR (e.g. 25 = 25 LPA)
    const annualSalary = annualSalaryLakhs * 100000;

    salaryDisplay.innerText = `₹${annualSalaryLakhs} LPA ($${Math.round(annualSalary / 84).toLocaleString()})`;

    // Bitwise ISA terms: 12% of monthly salary for 36 months if salary > 18 LPA, capped at ₹15 Lakhs total
    if (annualSalaryLakhs < 18) {
      monthlyPaymentDisplay.innerText = '₹0 / month';
      totalRepaymentDisplay.innerText = '₹0 (Under Minimum Threshold)';
      if (thresholdAlert) thresholdAlert.style.display = 'block';
    } else {
      if (thresholdAlert) thresholdAlert.style.display = 'none';
      const monthlySalary = annualSalary / 12;
      const monthlyRate = 0.12; // 12%
      const rawMonthlyPayment = monthlySalary * monthlyRate;
      const totalRaw = rawMonthlyPayment * 36;
      const cap = 1500000; // 15 Lakhs Max Cap
      const finalTotal = Math.min(totalRaw, cap);
      const finalMonthly = Math.round(finalTotal / 36);

      monthlyPaymentDisplay.innerText = `₹${finalMonthly.toLocaleString('en-IN')} / month`;
      totalRepaymentDisplay.innerText = `₹${Math.round(finalTotal).toLocaleString('en-IN')} (Max Capped)`;
    }
  }

  salarySlider.addEventListener('input', calculate);
  calculate();
}

// ==========================================================================
// 6. HACKATHON LIVE COUNTDOWNS
// ==========================================================================
function initHackathonCountdowns() {
  const countdownEls = document.querySelectorAll('.hackathon-countdown[data-end]');

  countdownEls.forEach(el => {
    const targetDate = new Date(el.getAttribute('data-end')).getTime();

    function update() {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        el.innerHTML = '<div style="color: var(--neon-rose); font-weight: 700; font-family: var(--font-mono)">SPRINT IN JUDGING PHASE</div>';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const daysEl = el.querySelector('.c-days');
      const hoursEl = el.querySelector('.c-hours');
      const minsEl = el.querySelector('.c-mins');
      const secsEl = el.querySelector('.c-secs');

      if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
      if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
      if (minsEl) minsEl.innerText = String(minutes).padStart(2, '0');
      if (secsEl) secsEl.innerText = String(seconds).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
  });
}

// ==========================================================================
// 7. AJAX PROJECT UPVOTING (LAUNCHPAD)
// ==========================================================================
function initProjectUpvoting() {
  const upvoteBtns = document.querySelectorAll('.project-upvote-btn');

  upvoteBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-id');
      if (!projectId) return;

      try {
        const res = await fetch(`/launchpad/${projectId}/upvote`, {
          method: 'POST',
          headers: { 'Accept': 'application/json' }
        });
        const data = await res.json();

        if (data.success) {
          const countEl = btn.querySelector('.upvote-count');
          if (countEl) countEl.innerText = data.upvotes;
          if (data.hasUpvoted) {
            btn.classList.add('upvoted');
          } else {
            btn.classList.remove('upvoted');
          }
        }
      } catch (err) {
        console.error('Error toggling upvote:', err);
      }
    });
  });
}

// ==========================================================================
// 8. MOBILE NAVIGATION MENU
// ==========================================================================
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-toggle');
  const links = document.getElementById('nav-links');

  if (btn && links) {
    btn.addEventListener('click', () => {
      links.classList.toggle('mobile-open');
    });
  }
}

// ==========================================================================
// 9. SUBTLE WEB AUDIO SYNTHESIZER FOR CYBER INTERACTIONS
// ==========================================================================
function initAudioFx() {
  let audioCtx = null;

  function playCyberBeep(freq = 600, type = 'sine', duration = 0.05) {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio context policy fallback
    }
  }

  document.querySelectorAll('.btn, .cmd-chip, .filter-btn').forEach(el => {
    el.addEventListener('mouseenter', () => playCyberBeep(800, 'sine', 0.03));
    el.addEventListener('click', () => playCyberBeep(1200, 'triangle', 0.08));
  });
}

// Helper: Escape HTML
function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}
