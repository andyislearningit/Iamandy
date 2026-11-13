/**
 * ===================================================================
 * I AM ANDY | ANDY67 — OFFICIAL JAVASCRIPT ENGINE
 * Vanilla JavaScript • Beginner-Friendly • Fully Featured
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =================================================================
  // 1. SOUND FX SYNTHESIZER (WEB AUDIO API)
  // Zero external MP3 files needed! High-tech sound effects built-in.
  // =================================================================
  let audioCtx = null;
  let sfxEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  const sfxToggleBtn = document.getElementById('sfx-toggle');
  if (sfxToggleBtn) {
    sfxToggleBtn.addEventListener('click', () => {
      initAudio();
      sfxEnabled = !sfxEnabled;
      sfxToggleBtn.classList.toggle('muted', !sfxEnabled);
      const icon = sfxToggleBtn.querySelector('.sfx-icon');
      if (icon) icon.textContent = sfxEnabled ? '🔊' : '🔇';
      if (sfxEnabled) playTone(720, 'sine', 0.1);
    });
  }

  function playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.15) {
    if (!sfxEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  function playBlip() {
    playTone(880, 'triangle', 0.08, 0.12);
  }

  function playSuccessChord() {
    if (!sfxEnabled) return;
    const chords = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    chords.forEach((note, idx) => {
      setTimeout(() => playTone(note, 'sine', 0.25, 0.18), idx * 80);
    });
  }

  function playRocketWhoosh() {
    if (!sfxEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 1.2);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.4);
    } catch (e) {}
  }

  // Play blip on interactive buttons
  document.querySelectorAll('.cyber-btn, .filter-btn, .gfilter-btn, .interactive-btn').forEach(btn => {
    btn.addEventListener('click', () => playBlip());
  });

  // =================================================================
  // 2. INTERACTIVE CYBER BACKGROUND PARTICLES CANVAS
  // =================================================================
  const canvas = document.getElementById('cyber-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 16000), 75);

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.7;
        this.speedY = (Math.random() - 0.5) * 0.7;
        // Red or Blue
        this.color = Math.random() > 0.5 ? '#00f0ff' : '#ff0055';
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let mouse = { x: null, y: null };
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      // Connect particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.15 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Connect to mouse cursor
        if (mouse.x && mouse.y) {
          const mdx = particles[i].x - mouse.x;
          const mdy = particles[i].y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 140) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(255, 0, 85, ${0.3 * (1 - mdist / 140)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        particles[i].update();
        particles[i].draw();
      }

      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  // =================================================================
  // 3. NAVIGATION, HEADER SCROLL & ACTIVE SCROLL-SPY
  // =================================================================
  const header = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], footer[id]');

  window.addEventListener('scroll', () => {
    // Header scrolled style
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active link highlighting
    let currentSection = '';
    const scrollPos = window.scrollY + 160;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Drawer Toggle
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const closeDrawerBtn = document.getElementById('close-drawer-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleDrawer(open) {
    if (mobileNav) {
      mobileNav.classList.toggle('open', open);
      mobileNav.setAttribute('aria-hidden', !open);
      if (mobileBtn) mobileBtn.setAttribute('aria-expanded', open);
    }
  }

  if (mobileBtn) {
    mobileBtn.addEventListener('click', () => toggleDrawer(true));
  }
  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener('click', () => toggleDrawer(false));
  }
  mobileNavLinks.forEach((lnk) => {
    lnk.addEventListener('click', () => toggleDrawer(false));
  });

  // =================================================================
  // 4. ANDY'S AVATAR PHOTO SWITCHER
  // =================================================================
  const avatarImg = document.getElementById('andy-avatar-img');
  const photoBtns = document.querySelectorAll('.photo-btn');

  photoBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      photoBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const newSrc = btn.getAttribute('data-src');
      if (avatarImg && newSrc) {
        avatarImg.style.opacity = '0';
        setTimeout(() => {
          avatarImg.src = newSrc;
          avatarImg.style.opacity = '1';
        }, 150);
      }
    });
  });

  // =================================================================
  // 5. FAVORITES CATEGORY FILTER
  // =================================================================
  const favFilterBtns = document.querySelectorAll('.filter-btn');
  const favCards = document.querySelectorAll('.fav-card');

  favFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      favFilterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');

      favCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hide');
        } else {
          card.classList.add('hide');
        }
      });
    });
  });

  // =================================================================
  // 6. GALLERY FILTERS & LIGHTBOX MODAL
  // =================================================================
  const galleryFilterBtns = document.querySelectorAll('.gfilter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const modal = document.getElementById('gallery-modal');
  const modalImg = document.getElementById('modal-img');
  const modalCat = document.getElementById('modal-cat');
  const modalTitle = document.getElementById('modal-title');
  const modalClose = document.getElementById('modal-close-btn');
  const modalPrev = document.getElementById('modal-prev-btn');
  const modalNext = document.getElementById('modal-next-btn');

  let currentGalleryIndex = 0;
  const visibleGalleryItems = () => Array.from(galleryItems).filter((item) => !item.classList.contains('hide'));

  // Filtering
  galleryFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      galleryFilterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-gfilter');

      galleryItems.forEach((item) => {
        const cat = item.getAttribute('data-gcat');
        if (filter === 'all' || cat === filter) {
          item.classList.remove('hide');
        } else {
          item.classList.add('hide');
        }
      });
    });
  });

  // Open Lightbox
  function openLightbox(index) {
    const items = visibleGalleryItems();
    if (index < 0) index = items.length - 1;
    if (index >= items.length) index = 0;
    currentGalleryIndex = index;

    const item = items[index];
    if (!item) return;

    const img = item.querySelector('.gallery-thumb');
    const cat = item.querySelector('.gallery-cat');
    const title = item.querySelector('h4');

    if (modalImg && img) modalImg.src = img.src;
    if (modalCat && cat) modalCat.textContent = cat.textContent;
    if (modalTitle && title) modalTitle.textContent = title.textContent;

    if (modal) {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
    }
    playBlip();
  }

  function closeLightbox() {
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const items = visibleGalleryItems();
      const idx = items.indexOf(item);
      openLightbox(idx);
    });
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const items = visibleGalleryItems();
        openLightbox(items.indexOf(item));
      }
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeLightbox);
  if (modalPrev) modalPrev.addEventListener('click', () => openLightbox(currentGalleryIndex - 1));
  if (modalNext) modalNext.addEventListener('click', () => openLightbox(currentGalleryIndex + 1));

  // Modal backdrop click
  if (modal) {
    modal.querySelector('.modal-backdrop').addEventListener('click', closeLightbox);
  }

  // Keyboard navigation for Lightbox
  window.addEventListener('keydown', (e) => {
    if (!modal || !modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') openLightbox(currentGalleryIndex - 1);
    if (e.key === 'ArrowRight') openLightbox(currentGalleryIndex + 1);
  });

  // =================================================================
  // 7. FUN ZONE — ALL INTERACTIVE BUTTONS & GAMES
  // =================================================================

  // --- A. FUNNY BUTTON ---
  const btnFunny = document.getElementById('btn-funny');
  const funnyOutput = document.getElementById('funny-output');
  const funnyJokes = [
    'Why did the Creeper cross the road? To blow up the other side! 💥💣',
    'Why do cats make the best gamers? Because they already have 9 lives! 🐾🎮',
    'Why does Iron Man sleep with a nightlight? Because he is terrified of rust! 🤖⚡',
    'What do Minecraft zombies put on their hot dogs? Ghast-ard and relish! 🌭🧟',
    'Why was the computer cold? Because it left its Windows open! 💻❄️',
    'How does Ant-Man play basketball? By doing a quantum slam dunk! 🏀🐜',
    'Why can you never trust an atom? Because they make up everything! ⚛️😄'
  ];
  let jokeIndex = 0;

  if (btnFunny && funnyOutput) {
    btnFunny.addEventListener('click', () => {
      funnyOutput.textContent = funnyJokes[jokeIndex];
      funnyOutput.classList.remove('bounce-anim');
      void funnyOutput.offsetWidth; // Trigger reflow
      funnyOutput.classList.add('bounce-anim');
      jokeIndex = (jokeIndex + 1) % funnyJokes.length;
      playTone(550, 'sawtooth', 0.15, 0.15);
    });
  }

  // --- B. MAGIC BUTTON ---
  const btnMagic = document.getElementById('btn-magic');
  const quickThemeBtn = document.getElementById('quick-theme-btn');
  const magicOutput = document.getElementById('magic-output');
  const themes = [
    { class: 'theme-default', name: 'Cyber Crimson & Cyan (Default)', color: '⚡ Red & Blue' },
    { class: 'theme-matrix', name: 'Matrix Emerald Overdrive', color: '🟢 Cyber Green' },
    { class: 'theme-purple', name: 'Quantum Multiverse Purple', color: '🟣 Neon Purple' },
    { class: 'theme-gold', name: 'Solar Reactor Gold', color: '🟡 Cyber Gold' }
  ];
  let themeIndex = 0;

  function cycleTheme() {
    themeIndex = (themeIndex + 1) % themes.length;
    document.body.classList.remove('theme-matrix', 'theme-purple', 'theme-gold');

    if (themes[themeIndex].class !== 'theme-default') {
      document.body.classList.add(themes[themeIndex].class);
    }

    if (magicOutput) {
      magicOutput.innerHTML = `<strong>✨ Magic Spell Cast!</strong><br>Activated: ${themes[themeIndex].name}`;
      magicOutput.classList.remove('bounce-anim');
      void magicOutput.offsetWidth;
      magicOutput.classList.add('bounce-anim');
    }
    playTone(784, 'sine', 0.3, 0.2);
    launchConfetti(25);
  }

  if (btnMagic) btnMagic.addEventListener('click', cycleTheme);
  if (quickThemeBtn) quickThemeBtn.addEventListener('click', cycleTheme);

  // --- C. SURPRISE BUTTON ---
  const btnSurprise = document.getElementById('btn-surprise');
  const surpriseOutput = document.getElementById('surprise-output');
  const surpriseQuotes = [
    '💥 POWER BOOST: Iron Man Arc Reactor recharged to 300%! "I am Iron Man!"',
    '🌟 SUPERPOWER UNLOCKED: Pym Particle Micro-Agility! You can shrink to sneak past homework!',
    '🪄 MYSTIC ARTIFACT FOUND: Doctor Strange gave you the Eye of Agamotto!',
    '💎 MINECRAFT JACKPOT: You struck a vein of 64 Ancient Debris in the Nether!',
    '🏆 ROBLOX BADGE: ANDY67 invited you to the Ultimate VIP Server!'
  ];

  if (btnSurprise && surpriseOutput) {
    btnSurprise.addEventListener('click', () => {
      const randomQuote = surpriseQuotes[Math.floor(Math.random() * surpriseQuotes.length)];
      surpriseOutput.innerHTML = `<strong>🎉 SURPRISE!</strong><br>${randomQuote}`;
      surpriseOutput.classList.remove('bounce-anim');
      void surpriseOutput.offsetWidth;
      surpriseOutput.classList.add('bounce-anim');
      launchConfetti(45);
      playSuccessChord();
    });
  }

  // --- D. CLICK COUNTER ---
  const btnClicker = document.getElementById('btn-clicker');
  const clickCountDisplay = document.getElementById('click-count');
  const clickRankDisplay = document.getElementById('click-rank');
  let clickCount = parseInt(localStorage.getItem('andy_click_count') || '0', 10);

  function getRank(count) {
    if (count >= 100) return '👑 Cyber Titan ANDY67';
    if (count >= 50) return '🚀 Iron Man Overclock';
    if (count >= 25) return '⛏️ Redstone Master';
    if (count >= 10) return '⚡ Power Cadet';
    return '🌱 Novice Cadet';
  }

  function updateClickDisplay() {
    if (clickCountDisplay) clickCountDisplay.textContent = clickCount;
    if (clickRankDisplay) clickRankDisplay.textContent = getRank(clickCount);
  }
  updateClickDisplay();

  if (btnClicker) {
    btnClicker.addEventListener('click', (e) => {
      clickCount++;
      localStorage.setItem('andy_click_count', clickCount.toString());
      updateClickDisplay();

      // Spawn floating click point
      const rect = btnClicker.getBoundingClientRect();
      const particle = document.createElement('div');
      particle.className = 'click-particle';
      particle.textContent = `+1`;
      particle.style.left = `${e.clientX || rect.left + rect.width / 2}px`;
      particle.style.top = `${e.clientY || rect.top}px`;
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 900);

      playTone(400 + Math.min(clickCount * 10, 800), 'sine', 0.08, 0.1);

      if (clickCount === 10 || clickCount === 25 || clickCount === 50 || clickCount === 100) {
        launchConfetti(35);
        playSuccessChord();
      }
    });
  }

  // --- E. SECRET BUTTON ---
  const btnSecret = document.getElementById('btn-secret');
  const secretOutput = document.getElementById('secret-output');

  if (btnSecret && secretOutput) {
    btnSecret.addEventListener('click', () => {
      secretOutput.innerHTML = `
        <div class="secret-vault-box">
          YOU FOUND ANDY'S SECRET WORLD! 🎉<br>
          <small style="font-weight:400; color:#00f0ff;">Classified Room 67: You unlocked the "Honorary Andy Buddy" Golden Trophy! 🏆</small>
        </div>
      `;
      secretOutput.classList.remove('bounce-anim');
      void secretOutput.offsetWidth;
      secretOutput.classList.add('bounce-anim');
      launchConfetti(80);
      playSuccessChord();
    });
  }

  // --- F. ROCKET BUTTON ---
  const btnRocket = document.getElementById('btn-rocket');
  const rocketOutput = document.getElementById('rocket-output');
  const rocketStage = document.getElementById('rocket-stage');

  if (btnRocket) {
    btnRocket.addEventListener('click', () => {
      if (rocketOutput) {
        rocketOutput.innerHTML = '<strong>🚀 BLASTOFF!</strong><br>Rocket is cruising through the cyber atmosphere!';
        rocketOutput.classList.remove('bounce-anim');
        void rocketOutput.offsetWidth;
        rocketOutput.classList.add('bounce-anim');
      }

      playRocketWhoosh();

      // Create Rocket Element
      const rocket = document.createElement('div');
      rocket.className = 'flying-rocket';
      rocket.textContent = '🚀';
      rocket.style.left = '-100px';
      rocket.style.bottom = '-100px';
      if (rocketStage) rocketStage.appendChild(rocket);

      // Animate trajectory across the whole screen
      requestAnimationFrame(() => {
        const destX = window.innerWidth + 200;
        const destY = -window.innerHeight - 200;
        rocket.style.transform = `translate(${destX}px, ${destY}px) rotate(45deg)`;
      });

      // Cleanup
      setTimeout(() => {
        rocket.remove();
      }, 2400);
    });
  }

  // --- G. BONUS ARCADE MINI-GAME: TARGET REFLEX ---
  const btnStartGame = document.getElementById('btn-start-game');
  const gameOverlay = document.getElementById('game-overlay');
  const gameStage = document.getElementById('arcade-stage');
  const timerDisplay = document.getElementById('game-timer');
  const scoreDisplay = document.getElementById('game-score');
  const highDisplay = document.getElementById('game-high');

  let gameScore = 0;
  let gameTimeLeft = 15;
  let gameInterval = null;
  let isGameActive = false;
  let highScore = parseInt(localStorage.getItem('andy_target_high') || '0', 10);
  if (highDisplay) highDisplay.textContent = highScore;

  function spawnTarget() {
    if (!isGameActive || !gameStage) return;
    const existing = gameStage.querySelector('.arcade-target');
    if (existing) existing.remove();

    const target = document.createElement('div');
    target.className = 'arcade-target';
    target.textContent = '🎯';

    const stageWidth = gameStage.clientWidth - 70;
    const stageHeight = gameStage.clientHeight - 70;

    const randX = Math.max(10, Math.floor(Math.random() * stageWidth));
    const randY = Math.max(10, Math.floor(Math.random() * stageHeight));

    target.style.left = `${randX}px`;
    target.style.top = `${randY}px`;

    target.addEventListener('click', (e) => {
      e.stopPropagation();
      gameScore += 10;
      if (scoreDisplay) scoreDisplay.textContent = gameScore;
      playTone(900, 'triangle', 0.08, 0.2);
      spawnTarget();
    });

    gameStage.appendChild(target);
  }

  function startMiniGame() {
    isGameActive = true;
    gameScore = 0;
    gameTimeLeft = 15;
    if (scoreDisplay) scoreDisplay.textContent = '0';
    if (timerDisplay) timerDisplay.textContent = '15';
    if (gameOverlay) gameOverlay.style.display = 'none';

    spawnTarget();

    gameInterval = setInterval(() => {
      gameTimeLeft--;
      if (timerDisplay) timerDisplay.textContent = gameTimeLeft;

      if (gameTimeLeft <= 0) {
        endMiniGame();
      }
    }, 1000);
  }

  function endMiniGame() {
    isGameActive = false;
    clearInterval(gameInterval);
    const existing = gameStage ? gameStage.querySelector('.arcade-target') : null;
    if (existing) existing.remove();

    if (gameScore > highScore) {
      highScore = gameScore;
      localStorage.setItem('andy_target_high', highScore.toString());
      if (highDisplay) highDisplay.textContent = highScore;
      launchConfetti(50);
      playSuccessChord();
    }

    if (gameOverlay) {
      gameOverlay.innerHTML = `
        <h4>MISSION COMPLETE! 🏆</h4>
        <p>Your Final Score: <strong style="color:#00f0ff; font-size:1.3rem;">${gameScore} pts</strong></p>
        <p>${gameScore >= 100 ? '🔥 LEGENDARY REFLEXES! Andy is super proud!' : '⚡ Great job! Can you beat your score?'}</p>
        <button id="btn-restart-game" class="cyber-btn btn-neon-red">
          <span class="btn-icon">🔄</span>
          <span class="btn-text">PLAY AGAIN</span>
        </button>
      `;
      gameOverlay.style.display = 'flex';
      const restartBtn = document.getElementById('btn-restart-game');
      if (restartBtn) restartBtn.addEventListener('click', startMiniGame);
    }
  }

  if (btnStartGame) {
    btnStartGame.addEventListener('click', startMiniGame);
  }

  // =================================================================
  // 8. REAL CONFETTI ENGINE (CANVAS)
  // =================================================================
  const confettiCanvas = document.getElementById('confetti-canvas');
  let confettiCtx = confettiCanvas ? confettiCanvas.getContext('2d') : null;
  let confettiPieces = [];

  if (confettiCanvas) {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
    });
  }

  function launchConfetti(count = 40) {
    if (!confettiCtx) return;
    const colors = ['#ff0055', '#00f0ff', '#ffd60a', '#a855f7', '#ffffff'];

    for (let i = 0; i < count; i++) {
      confettiPieces.push({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        r: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.8) * 16,
        gravity: 0.35,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1
      });
    }
  }

  function renderConfetti() {
    if (!confettiCtx) return;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    for (let i = 0; i < confettiPieces.length; i++) {
      const p = confettiPieces[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.012;

      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate((p.rotation * Math.PI) / 180);
      confettiCtx.fillStyle = p.color;
      confettiCtx.globalAlpha = Math.max(p.opacity, 0);
      confettiCtx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.5);
      confettiCtx.restore();
    }

    confettiPieces = confettiPieces.filter((p) => p.opacity > 0);
    requestAnimationFrame(renderConfetti);
  }

  renderConfetti();

  // =================================================================
  // 9. IMAGE FALLBACK ERROR HANDLING
  // Ensures no broken images ever show up!
  // =================================================================
  document.querySelectorAll('img').forEach((img) => {
    img.addEventListener('error', function () {
      this.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect fill="%23131726" width="600" height="400"/><text fill="%2300f0ff" font-family="sans-serif" font-size="20" font-weight="bold" x="50%" y="50%" text-anchor="middle">ANDY67 CYBER IMAGE</text></svg>';
    });
  });

  console.log('%c🚀 I AM ANDY | ANDY67 Portfolio Ready!', 'color: #00f0ff; font-size: 16px; font-weight: bold; background: #0d0f17; padding: 6px 12px; border: 1px solid #ff0055;');
});
