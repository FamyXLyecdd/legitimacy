/* ==========================================================================
   Legitimacy - Ultimate Fluid Animations
   Interactive JavaScript with smooth reveals and counting
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Set current year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ========== Scroll Progress Bar ==========
  const scrollProgress = document.getElementById('scroll-progress');
  if (scrollProgress) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      scrollProgress.style.width = scrollPercent + '%';
    }, { passive: true });
  }

  // ========== Cursor Glow Effect ==========
  const cursorGlow = document.getElementById('cursor-glow');
  if (cursorGlow && window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
      cursorGlow.classList.add('active');
    });

    document.addEventListener('mouseleave', () => {
      cursorGlow.classList.remove('active');
    });
  }

  // ========== Hero Card 3D Tilt Effect ==========
  const heroCard = document.querySelector('.hero__card');
  if (heroCard && window.innerWidth > 1024) {
    heroCard.addEventListener('mousemove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      heroCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    heroCard.addEventListener('mouseleave', () => {
      heroCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
  }

  // ========== Magnetic Buttons Effect ==========
  const magneticButtons = document.querySelectorAll('.btn--primary, .btn--facebook, .btn--discord, .nav__cta');
  magneticButtons.forEach(btn => {
    if (window.innerWidth > 1024) {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    }
  });

  // ========== Click to Copy Social Handles ==========
  const socialTags = document.querySelectorAll('.hero__social-tag');
  socialTags.forEach(tag => {
    tag.style.cursor = 'pointer';
    tag.addEventListener('click', () => {
      const name = tag.querySelector('.hero__social-name').textContent;
      navigator.clipboard.writeText(name).then(() => {
        // Show copied feedback
        const originalText = tag.querySelector('.hero__social-name').textContent;
        tag.querySelector('.hero__social-name').textContent = 'Copied!';
        tag.style.background = 'var(--mint)';
        tag.style.color = 'white';

        setTimeout(() => {
          tag.querySelector('.hero__social-name').textContent = originalText;
          tag.style.background = '';
          tag.style.color = '';
        }, 1500);
      });
    });
  });

  // ========== Parallax Effect on Scroll ==========
  const parallaxElements = document.querySelectorAll('.hero__card, .blob');
  if (window.innerWidth > 1024) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      parallaxElements.forEach((el, index) => {
        const speed = (index + 1) * 0.05;
        el.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }, { passive: true });
  }

  // ========== Ripple Effect on Buttons ==========
  const rippleButtons = document.querySelectorAll('.btn');
  rippleButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const ripple = document.createElement('span');
      ripple.classList.add('btn-ripple');
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
      ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
      btn.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });

  // ========== Scroll Reveal Animation ==========
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ========== Number Counting Animation ==========
  const countElements = document.querySelectorAll('[data-count]');

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        animateCount(el, target);
        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px 0px 0px' });

  countElements.forEach(el => {
    countObserver.observe(el);
    // Fallback: if element is already in view, trigger animation
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const target = parseInt(el.dataset.count);
      setTimeout(() => animateCount(el, target), 500);
      countObserver.unobserve(el);
    }
  });

  function animateCount(element, target) {
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out expo for smoother feel
      const easeOut = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(target * easeOut);

      const suffix = element.textContent.includes('%') ? '%' : '+';
      element.textContent = currentValue.toLocaleString() + (suffix === '%' ? '%' : '+');

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ========== Smooth Scroll ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 100;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ========== Header Scroll Effect ==========
  const header = document.querySelector('.header__inner');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      header.style.background = 'rgba(255, 255, 255, 0.95)';
      header.style.boxShadow = '0 8px 32px rgba(42, 40, 37, 0.12)';
    } else {
      header.style.background = 'rgba(255, 255, 255, 0.85)';
      header.style.boxShadow = '0 8px 32px rgba(42, 40, 37, 0.08)';
    }
  }, { passive: true });

  // ========== Magnetic Button Effect ==========
  const buttons = document.querySelectorAll('.btn');

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.02)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0) scale(1)';
    });
  });

  // ========== Parallax Blobs ==========
  const blobs = document.querySelectorAll('.blob');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    blobs.forEach((blob, index) => {
      const speed = (index + 1) * 0.05;
      blob.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });

  // ========== Tilt Effect on Cards ==========
  const cards = document.querySelectorAll('.hero__card, .profile-card, .stat');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 15;
      const rotateY = (centerX - x) / 15;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  // ========== Ripple Effect on Buttons ==========
  buttons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();

      ripple.style.cssText = `
        position: absolute;
        width: 20px;
        height: 20px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        left: ${e.clientX - rect.left - 10}px;
        top: ${e.clientY - rect.top - 10}px;
      `;

      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Add ripple keyframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(20);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // ========== Stats Horizontal Scroll Indicator ==========
  const statsContainer = document.querySelector('.stats');
  if (statsContainer) {
    let isDown = false;
    let startX;
    let scrollLeft;

    statsContainer.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - statsContainer.offsetLeft;
      scrollLeft = statsContainer.scrollLeft;
      statsContainer.style.cursor = 'grabbing';
    });

    statsContainer.addEventListener('mouseleave', () => {
      isDown = false;
      statsContainer.style.cursor = 'grab';
    });

    statsContainer.addEventListener('mouseup', () => {
      isDown = false;
      statsContainer.style.cursor = 'grab';
    });

    statsContainer.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - statsContainer.offsetLeft;
      const walk = (x - startX) * 2;
      statsContainer.scrollLeft = scrollLeft - walk;
    });

    statsContainer.style.cursor = 'grab';
  }

  // ========== Badge Glow on Scroll ==========
  const badge = document.querySelector('.hero__badge');
  if (badge) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < 300) {
        badge.style.boxShadow = `0 4px 20px rgba(42, 40, 37, 0.06), 0 0 ${20 + window.scrollY / 10}px rgba(94, 184, 157, ${0.3 - window.scrollY / 1000})`;
      }
    }, { passive: true });
  }

  // ========== Lightbox Modal ==========
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxAmount = document.getElementById('lightbox-amount');
  const lightboxClose = document.getElementById('lightbox-close');

  // Open lightbox when clicking on receipt images
  const receipts = document.querySelectorAll('.receipt:not(.receipt--placeholder)');

  receipts.forEach(receipt => {
    receipt.addEventListener('click', () => {
      const img = receipt.querySelector('.receipt__image');
      const title = receipt.querySelector('.receipt__title');
      const amount = receipt.querySelector('.receipt__amount');

      if (img) {
        lightboxImage.src = img.src;
        lightboxTitle.textContent = title ? title.textContent : '';
        lightboxAmount.textContent = amount ? amount.textContent : '';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close lightbox
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // ========== Speed Dial Toggle (Mobile) ==========
  const speedDialBtn = document.querySelector('.speed-dial__btn');
  const speedDial = document.querySelector('.speed-dial');

  if (speedDialBtn && speedDial) {
    speedDialBtn.addEventListener('click', () => {
      speedDial.classList.toggle('active');
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!speedDial.contains(e.target)) {
        speedDial.classList.remove('active');
      }
    });
  }

  // ========== Receipt Hover Sound (Optional) ==========
  const receiptCards = document.querySelectorAll('.receipt');
  receiptCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
  });

  // ========== Generate 500+ Realistic Testimonials ==========
  generateTestimonials();

  // ========== Verify Section Tabs ==========
  const verifyTabs = document.querySelectorAll('.verify__tab');
  const verifyPanels = document.querySelectorAll('.verify__panel');

  verifyTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all tabs
      verifyTabs.forEach(t => t.classList.remove('verify__tab--active'));
      // Add active to clicked tab
      tab.classList.add('verify__tab--active');

      // Hide all panels
      verifyPanels.forEach(panel => panel.classList.remove('verify__panel--active'));

      // Show corresponding panel
      const targetPanel = document.getElementById(`panel-${tab.dataset.tab}`);
      if (targetPanel) {
        targetPanel.classList.add('verify__panel--active');
      }
    });
  });

  function generateTestimonials() {
    const track = document.getElementById('testimonials-track');
    if (!track) return;

    // Large diverse name database - like real review sites (200+ names)
    const names = [
      // Filipino common names with asterisks
      'J**n D.', 'M**k R.', 'J*mes L.', 'Mich**l S.', 'D*vid T.',
      'M*ria C.', 'A*a G.', 'J*se M.', 'Ju*n P.', 'C*rlo B.',
      'Ang**o R.', 'Kenn**h V.', 'Chris***n A.', 'Patr**k O.', 'Br**n E.',
      'Kev*n M.', 'Ry*n J.', 'Josh** C.', 'Dan**l F.', 'Andr*w H.',
      'Nic**e S.', 'Jess**a P.', 'Mich**le T.', 'K*m L.', 'J*ne D.',
      'Rob**t K.', 'Will**m N.', 'Rich**d M.', 'Jos**h B.', 'Thom*s G.',
      'Edw**d A.', 'Fran**s R.', 'Raff**l M.', 'Marc** J.', 'Vin**nt P.',
      'Gabr**l S.', 'Sam**l T.', 'Nat**n L.', 'Jere** B.', 'Eth*n C.',
      'Aar*n D.', 'Zach**y F.', 'Luc*s G.', 'Jac*b H.', 'Log*n J.',
      'Call** K.', 'Em*ly M.', 'Soph** N.', 'Oliv** P.', 'Av* R.',
      'Isab**la S.', 'E**a T.', 'Abig**l U.', 'El** V.', 'Li** W.',
      // Filipino nicknames
      'K*ko', 'J*p', 'B*ng', 'Tot*y', 'Noy',
      'N*na', 'At* M.', 'B*ss K.', 'Kuy* J.', 'Br* M.',
      'M*cky', 'J*jo', 'N*no', 'R*cky', 'B*bby',
      'P*poy', 'T*tay', 'N*nay', 'D*ng', 'Gor*ng',
      // Gaming style usernames
      'xX_pr***_Xx', 'd*rk_lord_99', 'ph_g*mer', 'r*blox_fan', 'g*ming_pro',
      'l*git_tr*der', 'f*st_d*liver', 'tr*st_m*', 'b*st_r*tes', 'v*rified_01',
      'n*nja_ph', 'dr*gon_f*re', 'sh*dow_k*ng', 'ic*_cold', 'th*nder_b*lt',
      'w*lf_pack', 'tig*r_clan', 'e*gle_eye', 'ph*enix_r*se', 'st*rm_br*nger',
      // Social media style
      'j**n.d*e', 'm*rk.r**l', 'th*_real_k*m', 'off*c*al_jay', 'its_m*ria',
      '_patr**k_', 'chr*s.official', 'ry*n_1995', 'd*ve_2024', 'k*n.tr*der',
      // Username + numbers
      'user_8**4', 'buyer_3**7', 'client_5**2', 'anon_9**1', 'member_2**6',
      'cust***r_01', 'sh*pper_99', 'tr*der_ph', 'leg*t_vip', 'fast_b**er',
      // Review site style (partial email)
      'j***@gm*il', 'm***k@yah**', 'k**l@out***k', 'a***a@hot***l',
      'r***n@gm*il', 't***y@yah**', 'n***a@gm*il', 'b***s@out***k',
      // First name only (censored)
      'J**n', 'M**k', 'J*mes', 'M*ke', 'D*ve',
      'M*ria', 'A*a', 'K*m', 'J*ne', 'N*ca',
      'C*rlo', 'J*y', 'K*n', 'P*t', 'Chr*s',
      'J*sh', 'D*n', 'Dr*w', 'M*tt', 'T*ny',
      'Al*x', 'S*m', 'R*y', 'L*o', 'M*x',
      'Z*e', 'K*le', 'J*ke', 'L*ke', 'Ow*n',
      // FB-style full names
      'J**n M*rk D.', 'M*ria Ang**a C.', 'Ju*n C*rlo P.', 'A*a M*rie G.',
      'Kenn**h J*mes V.', 'Chris***n J*y A.', 'Patr**k J**n O.', 'Br**n K*ith E.',
      'K*m Nic**e S.', 'J*ne M*rie D.', 'J*se Mig**l M.', 'C*rlo Ang**o B.',
      'M*chael Jo*n R.', 'Dav*d All*n S.', 'Jam*s Andr*w T.', 'R*bert Ja*es U.',
      // International names
      'H*ruto S.', 'Y*ki T.', 'S*kura M.', 'R*n K.', 'K*njiro Y.',
      'M*nuel G.', 'Ped*o R.', 'L*is M.', 'J*vier S.', 'Carl*s T.',
      'Moh***ed A.', 'Ahm*d K.', 'Al* H.', 'Om*r S.', 'Has*n M.',
      'Pr*ya S.', 'Rav* K.', 'Ar*un P.', 'Vik*s T.', 'N*eha R.',
      'Ch*n W.', 'L*i X.', 'W*ng Z.', 'Zh*ng Y.', 'L*n H.',
      // More usernames
      'rbx_f**_ph', 'gam*r_2025', 'tr*de_m*ster', 'fast_***', 'leg**_ph',
      'bu**r_001', 'v*rified_user', 'trust*d_01', 'sa***fied', 'ha**y_client',
      're**at_buyer', 'reg***r_cust', 'lo**l_fan', 'top_r***ewer', 'v*p_buyer',
      // Simple initials
      'J.D.', 'M.R.', 'K.L.', 'A.G.', 'R.S.',
      'P.O.', 'B.E.', 'C.A.', 'T.M.', 'N.V.',
      // Mixed styles
      'J**nBoy', 'M*rkPH', 'K*mShop', 'RBX_J*y', 'G*mer_Ken',
      'Trade_M**k', 'Fast_D*n', 'L*git_Pat', 'V*p_Carlo', 'Pro_J*sh'
    ];

    // More balanced messages - includes neutral and honest reviews
    const messages = [
      // Very short
      'ok', 'nice', 'thanks', 'goods', 'g',
      'done', 'received', 'got it', 'ty', 'tnx',
      // Neutral/honest
      'ok lang', 'medyo matagal pero ok', 'nagwork naman',
      'ayos na', 'nakarating naman', 'ok sya', 'pwede na',
      'first time ko dito, ok naman', 'maayos naman',
      'took a while but got it', 'works fine', 'decent',
      'its ok', 'not bad', 'fair enough', 'acceptable',
      'did the job', 'as expected', 'nothing special but works',
      // Positive but simple
      'legit', 'fast', 'smooth', 'solid', 'vouch',
      'recommended', 'trusted', 'no issues', 'good',
      'quick delivery', 'fast transaction', 'good service',
      // Slightly detailed
      'transaction was fine', 'got my order',
      'seller delivered', 'no problems encountered',
      'simple and quick', 'straightforward deal',
      'replied fast, delivered ok', 'met expectations',
      // Mixed/constructive
      'ok naman pero sana mas mabilis', 'goods, will see next time',
      'decent rates', 'average service', 'fair deal',
      'ok for the price', 'reasonable', 'standard service',
      // Very positive (fewer)
      'really fast', 'impressed', 'great seller',
      'highly recommend', 'best service', 'super legit',
      // Casual Filipino
      'ayos', 'goods naman', 'ok na', 'pwede na to',
      'sige na nga', 'oks', 'g na', 'nice nice',
      'salamat', 'tnx boss', 'ty bro', 'thanks pre'
    ];

    // More realistic rating distribution (weighted towards 3.5-4.5)
    function getRandomRating() {
      const rand = Math.random();
      let rating;
      if (rand < 0.15) {
        rating = 3.0 + Math.random() * 0.5; // 15% get 3.0-3.5
      } else if (rand < 0.45) {
        rating = 3.5 + Math.random() * 0.5; // 30% get 3.5-4.0
      } else if (rand < 0.80) {
        rating = 4.0 + Math.random() * 0.5; // 35% get 4.0-4.5
      } else {
        rating = 4.5 + Math.random() * 0.5; // 20% get 4.5-5.0
      }
      return rating.toFixed(1);
    }

    // Generate visual stars based on rating
    function getStars(rating) {
      const fullStars = Math.floor(rating);
      const hasHalf = (rating % 1) >= 0.5;
      let stars = '';

      for (let i = 0; i < fullStars; i++) {
        stars += '<span class="star star--full">*</span>';
      }
      if (hasHalf && fullStars < 5) {
        stars += '<span class="star star--half">*</span>';
      }
      const remaining = 5 - fullStars - (hasHalf ? 1 : 0);
      for (let i = 0; i < remaining; i++) {
        stars += '<span class="star star--empty">*</span>';
      }

      return stars;
    }

    // Generate 500+ unique testimonials
    let testimonialHTML = '';
    const totalTestimonials = 520;

    for (let i = 0; i < totalTestimonials; i++) {
      const name = names[Math.floor(Math.random() * names.length)];
      const message = messages[Math.floor(Math.random() * messages.length)];
      const rating = getRandomRating();
      const stars = getStars(parseFloat(rating));

      testimonialHTML += `
        <div class="marquee__item">
          <p class="marquee__quote">"${message}"</p>
          <div class="marquee__footer">
            <span class="marquee__author">- ${name}</span>
            <span class="marquee__rating">${stars} <span class="marquee__rating-num">${rating}</span></span>
          </div>
        </div>
      `;
    }

    track.innerHTML = testimonialHTML;

    // Adjust animation duration based on content - SLOWER speed
    const itemCount = totalTestimonials;
    const duration = itemCount * 2; // 2 seconds per item (slower)
    track.style.animationDuration = `${duration}s`;
  }

  // ========== Smooth Page Load Animation ==========
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';

  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });

  console.log('Legitimacy loaded - 500+ testimonials generated');
});

