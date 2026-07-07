// ===== MY HAPPINESS - JavaScript =====
// Particle background, floating hearts, scroll reveals, gallery lightbox, quote carousel

document.addEventListener('DOMContentLoaded', () => {
    // ===== PARTICLE CANVAS BACKGROUND =====
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0, mouseY = 0;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.hue = Math.random() * 40 + 320; // Pink-ish hues
            this.pulseSpeed = Math.random() * 0.02 + 0.005;
            this.pulseOffset = Math.random() * Math.PI * 2;
        }
        update(time) {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                this.x -= dx * 0.008;
                this.y -= dy * 0.008;
            }

            // Pulse
            this.currentOpacity = this.opacity + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.2;

            // Wrap around
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, ${Math.max(0, this.currentOpacity)})`;
            ctx.fill();
        }
    }

    // Create particles
    const particleCount = Math.min(80, Math.floor(window.innerWidth / 15));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    let animTime = 0;
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animTime++;
        particles.forEach(p => {
            p.update(animTime);
            p.draw();
        });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    const opacity = (1 - dist / 120) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(232, 67, 147, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // ===== FLOATING HEARTS =====
    const heartsContainer = document.getElementById('floatingHearts');
    const heartEmojis = ['💕', '💖', '💗', '💓', '💝', '❤️', '🩷', '✨', '🌸'];

    function createFloatingHeart() {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (Math.random() * 20 + 12) + 'px';
        heart.style.animationDuration = (Math.random() * 8 + 8) + 's';
        heart.style.animationDelay = Math.random() * 2 + 's';
        heartsContainer.appendChild(heart);

        setTimeout(() => heart.remove(), 18000);
    }

    // Create hearts periodically
    setInterval(createFloatingHeart, 2000);
    // Initial batch
    for (let i = 0; i < 5; i++) {
        setTimeout(createFloatingHeart, i * 400);
    }

    // ===== INTRO SCREEN =====
    const introScreen = document.getElementById('introScreen');
    const websiteContainer = document.getElementById('websiteContainer');

    introScreen.addEventListener('click', () => {
        introScreen.classList.add('hidden');
        setTimeout(() => {
            websiteContainer.classList.add('visible');
            // Trigger reveal animations for elements in view
            checkReveals();
        }, 400);
    });

    // ===== NAVBAR =====
    const navbar = document.getElementById('navbar');
    const navMenuBtn = document.getElementById('navMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active nav link
        updateActiveNavLink();

        // Back to top
        updateBackToTop();

        // Scroll reveals
        checkReveals();
    });

    // Mobile menu toggle
    navMenuBtn.addEventListener('click', () => {
        navMenuBtn.classList.toggle('active');
        mobileNav.classList.toggle('open');
    });

    // Close mobile nav on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenuBtn.classList.remove('active');
            mobileNav.classList.remove('open');
        });
    });

    // Active nav link based on scroll position
    function updateActiveNavLink() {
        const sections = ['hero', 'about', 'gallery', 'quotes'];
        const scrollPos = window.scrollY + 150;

        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const top = section.offsetTop;
                const height = section.offsetHeight;
                if (scrollPos >= top && scrollPos < top + height) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    const activeLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
                    if (activeLink) activeLink.classList.add('active');
                }
            }
        });
    }

    // ===== SCROLL REVEAL =====
    function checkReveals() {
        const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
        const windowHeight = window.innerHeight;

        reveals.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const revealPoint = windowHeight - 100;

            if (elementTop < revealPoint) {
                el.classList.add('revealed');
            }
        });
    }

    // ===== GALLERY LIGHTBOX =====
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const caption = item.getAttribute('data-caption');
            lightboxImg.src = img.src;
            lightboxCaption.textContent = caption;
            lightbox.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    // ===== QUOTE CAROUSEL =====
    const quoteCards = document.querySelectorAll('.quote-card');
    const quoteDots = document.getElementById('quoteDots');
    const quotePrev = document.getElementById('quotePrev');
    const quoteNext = document.getElementById('quoteNext');
    let currentQuote = 0;
    let quoteAutoInterval;

    // Create dots
    quoteCards.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'quote-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goToQuote(i));
        quoteDots.appendChild(dot);
    });

    function goToQuote(index) {
        const direction = index > currentQuote ? 1 : -1;
        quoteCards[currentQuote].classList.remove('active');
        quoteCards[currentQuote].classList.add(direction > 0 ? 'exit-left' : '');

        currentQuote = index;
        if (currentQuote >= quoteCards.length) currentQuote = 0;
        if (currentQuote < 0) currentQuote = quoteCards.length - 1;

        // Remove all classes first
        quoteCards.forEach(card => {
            card.classList.remove('active', 'exit-left');
        });

        quoteCards[currentQuote].classList.add('active');

        // Update dots
        document.querySelectorAll('.quote-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentQuote);
        });

        // Reset auto-advance
        clearInterval(quoteAutoInterval);
        startQuoteAuto();
    }

    quotePrev.addEventListener('click', () => goToQuote(currentQuote - 1));
    quoteNext.addEventListener('click', () => goToQuote(currentQuote + 1));

    function startQuoteAuto() {
        quoteAutoInterval = setInterval(() => {
            goToQuote(currentQuote + 1);
        }, 5000);
    }
    startQuoteAuto();

    // ===== BACK TO TOP =====
    const backToTop = document.getElementById('backToTop');

    function updateBackToTop() {
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== PARALLAX EFFECT ON HERO =====
    const heroContent = document.querySelector('.hero-content');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            heroContent.style.opacity = 1 - scrolled / (window.innerHeight * 0.8);
        }
    });

    // ===== TILT EFFECT ON GALLERY ITEMS =====
    galleryItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / centerY * -5;
            const rotateY = (x - centerX) / centerX * 5;

            item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = '';
        });
    });

    // ===== SMOOTH CURSOR TRAIL =====
    let trail = [];
    const trailLength = 8;

    document.addEventListener('mousemove', (e) => {
        trail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
        if (trail.length > trailLength) trail.shift();
    });

    // ===== INITIAL CHECK =====
    checkReveals();
});
