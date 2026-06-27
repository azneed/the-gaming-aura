import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
  infinite: false,
});

// Integrate Lenis with ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Ensure ScrollTrigger updates on resize
window.addEventListener('resize', () => {
  ScrollTrigger.refresh();
});

/* -----------------------------------------
   Custom Cursor with Inertia
----------------------------------------- */
const initCursor = () => {
  const cursor = document.getElementById('custom-cursor');
  const follower = document.getElementById('custom-cursor-follower');
  
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0; // Target coordinates
  let cursorX = 0, cursorY = 0; // Current cursor coordinates
  let followerX = 0, followerY = 0; // Current follower coordinates

  // Lerp factor for smooth lag/inertia
  const cursorLerp = 0.2;
  const followerLerp = 0.08;

  // Track mouse coordinates
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Animation loop for custom cursor positions
  const renderCursor = () => {
    // Cursor position calculation (fast lag)
    cursorX += (mouseX - cursorX) * cursorLerp;
    cursorY += (mouseY - cursorY) * cursorLerp;
    
    // Follower position calculation (slow lag)
    followerX += (mouseX - followerX) * followerLerp;
    followerY += (mouseY - followerY) * followerLerp;

    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;

    requestAnimationFrame(renderCursor);
  };
  renderCursor();

  // Hover target states
  const addHoverListeners = () => {
    const hoverTargets = document.querySelectorAll('.hover-target, a, button, select, input, option');
    
    hoverTargets.forEach((target) => {
      target.addEventListener('mouseenter', () => {
        document.body.classList.add('hovering-target');
      });
      target.addEventListener('mouseleave', () => {
        document.body.classList.remove('hovering-target');
      });
    });
  };
  addHoverListeners();

  // Re-run hover listener attachments when content dynamically changes or builds
  const observer = new MutationObserver(addHoverListeners);
  observer.observe(document.body, { childList: true, subtree: true });
};

/* -----------------------------------------
   Hero Section Animations
----------------------------------------- */
const initHeroAnimations = () => {
  const tl = gsap.timeline();

  // Header fade-in
  tl.fromTo('.main-header', 
    { y: -30, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 1, ease: 'power4.out' }
  );
  // Uppala Badge fade-in
  tl.to('.hero-uppala-badge', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
  }, '-=0.6');

  // Hero Title character stagger entrance
  tl.to('.hero-title .char', {
    y: '0%',
    opacity: 1,
    duration: 1.2,
    stagger: 0.03,
    ease: 'power4.out',
  }, '-=0.6');

  // Subtitle fade-in
  tl.to('.hero-subtitle', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
  }, '-=0.8');

  // CTA buttons fade-in
  tl.to('.hero-cta-group', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
  }, '-=0.6');

  // Scroll indicator reveal
  tl.to('.scroll-indicator', {
    opacity: 1,
    duration: 0.5,
  }, '-=0.2');
};

/* -----------------------------------------
   Choose Your Aura Theme Selector
----------------------------------------- */
const initAuraSelector = () => {
  const sides = document.querySelectorAll('.split-side');
  
  sides.forEach(side => {
    side.addEventListener('mouseenter', (e) => {
      const aura = e.currentTarget.getAttribute('data-aura');
      
      if (aura === 'console') {
        document.documentElement.style.setProperty('--active-glow', 'var(--aura-pink)');
        document.documentElement.style.setProperty('--active-glow-rgb', '255, 0, 127');
      } else if (aura === 'billiards') {
        document.documentElement.style.setProperty('--active-glow', 'var(--aura-green)');
        document.documentElement.style.setProperty('--active-glow-rgb', '0, 230, 118');
      }
    });

    side.addEventListener('mouseleave', () => {
      // Return to default VIP purple glow
      document.documentElement.style.setProperty('--active-glow', 'var(--aura-purple)');
      document.documentElement.style.setProperty('--active-glow-rgb', '177, 0, 255');
    });
  });
};

/* -----------------------------------------
   Digital Section Horizontal Scroll
----------------------------------------- */
const initHorizontalScroll = () => {
  const container = document.querySelector('.digital-scroll-container');
  const track = document.querySelector('.horizontal-track');
  
  if (!container || !track) return;

  const scrollWidth = track.scrollWidth;
  const viewportWidth = window.innerWidth;
  const titleSectionWidth = document.querySelector('.horizontal-title-section').offsetWidth;
  
  // Calculate total translation needed
  const totalScroll = scrollWidth - (viewportWidth - titleSectionWidth - 100);

  // Responsive logic for scroll length
  let pinDuration = '250%';
  if (window.innerWidth <= 991) {
    // Disable horizontal pinning on smaller screens, cards will stack vertically
    return;
  }

  // Pin & Scroll timeline
  gsap.to(track, {
    x: () => -totalScroll,
    ease: 'none',
    scrollTrigger: {
      trigger: container,
      pin: true,
      scrub: 1,
      start: 'top top',
      end: () => `+=${totalScroll}`,
      invalidateOnRefresh: true,
    }
  });

  // Stagger reveal card elements inside track
  gsap.from('.horizontal-card', {
    opacity: 0,
    y: 50,
    stagger: 0.1,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: container,
      start: 'top 40%',
      toggleActions: 'play none none none',
    }
  });
};

/* -----------------------------------------
   Billiards Lounge Physics Simulation
----------------------------------------- */
const initBilliardsPhysics = () => {
  const canvas = document.getElementById('physics-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  const container = canvas.parentElement;
  
  // Set canvas dimension
  let width = canvas.width = container.clientWidth;
  let height = canvas.height = container.clientHeight;

  // Handle resizing
  window.addEventListener('resize', () => {
    width = canvas.width = container.clientWidth;
    height = canvas.height = container.clientHeight;
    resetBalls();
  });

  // Ball class definition
  class Ball {
    constructor(x, y, vx, vy, radius, color, isCue = false) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.radius = radius;
      this.color = color;
      this.mass = radius * radius;
      this.isCue = isCue;
      this.friction = 0.988; // Satisfying felt friction
    }

    update() {
      // Apply velocity
      this.x += this.vx;
      this.y += this.vy;

      // Apply friction (deceleration)
      this.vx *= this.friction;
      this.vy *= this.friction;

      // Stop entirely if velocity becomes microscopic
      if (Math.abs(this.vx) < 0.02) this.vx = 0;
      if (Math.abs(this.vy) < 0.02) this.vy = 0;

      // Boundaries collision (elastic bounce)
      if (this.x - this.radius < 0) {
        this.x = this.radius;
        this.vx = -this.vx * 0.8; // Lose a little energy on walls
      } else if (this.x + this.radius > width) {
        this.x = width - this.radius;
        this.vx = -this.vx * 0.8;
      }

      if (this.y - this.radius < 0) {
        this.y = this.radius;
        this.vy = -this.vy * 0.8;
      } else if (this.y + this.radius > height) {
        this.y = height - this.radius;
        this.vy = -this.vy * 0.8;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      
      // Multi-stop radial gradients for realistic 3D sphere shading
      const grad = ctx.createRadialGradient(
        this.x - this.radius * 0.3, 
        this.y - this.radius * 0.3, 
        this.radius * 0.1, 
        this.x, 
        this.y, 
        this.radius
      );
      
      if (this.isCue) {
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.8, '#dddddd');
        grad.addColorStop(1, '#999999');
      } else {
        grad.addColorStop(0, this.color);
        grad.addColorStop(0.8, darkenColor(this.color, 40));
        grad.addColorStop(1, '#000000');
      }

      ctx.fillStyle = grad;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 5;
      ctx.fill();
      ctx.shadowColor = 'transparent'; // Reset shadows

      // Draw shiny reflection dot
      ctx.beginPath();
      ctx.arc(this.x - this.radius * 0.35, this.y - this.radius * 0.35, this.radius * 0.15, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fill();

      // Number badge for standard pool balls
      if (!this.isCue) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();

        ctx.font = `bold ${this.radius * 0.6}px var(--font-sub)`;
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('8', this.x, this.y);
      }
    }
  }

  // Utility to darken HSL colors for gradients
  function darkenColor(hex, percent) {
    const num = parseInt(hex.replace("#",""),16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) - amt,
    G = (num >> 8 & 0x00FF) - amt,
    B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R<255?R<0?0:R:255)*0x10000 + (G<255?G<0?0:G:255)*0x100 + (B<255?B<0?0:B:255)).toString(16).slice(1);
  }

  const balls = [];
  const ballRadius = window.innerWidth <= 768 ? 14 : 20;

  function resetBalls() {
    balls.length = 0;
    
    // Add white cue ball
    const cue = new Ball(width * 0.25, height * 0.5, 0, 0, ballRadius, '#ffffff', true);
    balls.push(cue);

    // Add 8-Ball pool balls in a triangle rack
    let rackStartX = width * 0.65;
    if (width < 500) {
      rackStartX = width * 0.52; // Shift left on small screens to prevent wall clipping
    }
    const rackStartY = height * 0.5;
    const spacing = ballRadius * 2.05;

    // Define colors for pool balls
    const colors = [
      '#e65100', '#0d47a1', '#b71c1c', '#4a148c', '#1b5e20',
      '#006064', '#01579b', '#f57f17', '#ff6f00', '#ff1744',
      '#2962ff', '#00c853', '#ffd600', '#aa00ff', '#3e2723'
    ];

    let colorIndex = 0;
    
    // Generate triangle matrix
    for (let col = 0; col < 5; col++) {
      const count = col + 1;
      const colX = rackStartX + col * (spacing * 0.866); // Cos(30 deg)
      
      for (let row = 0; row < count; row++) {
        const rowY = rackStartY - (col * spacing * 0.5) + row * spacing;
        
        let color = colors[colorIndex % colors.length];
        // Ensure the central ball of row index 2 is black (traditional 8-ball rule)
        let isCueBall = false;
        if (col === 2 && row === 1) {
          color = '#0c0c0c'; 
        }

        const ball = new Ball(colX, rowY, 0, 0, ballRadius, color, false);
        balls.push(ball);
        colorIndex++;
      }
    }
  }
  
  resetBalls();

  // Mouse Drag Tracking Variables
  let isDragging = false;
  let dragStartBall = null;
  let dragStartX = 0;
  let dragStartY = 0;
  let currentMouseX = 0;
  let currentMouseY = 0;

  // Track Mouse Move for hover repulsion
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    currentMouseX = mx;
    currentMouseY = my;

    // Gentle hover push if dragging is NOT active
    if (!isDragging) {
      balls.forEach(ball => {
        const dx = ball.x - mx;
        const dy = ball.y - my;
        const dist = Math.hypot(dx, dy);
        
        if (dist < ball.radius * 3) {
          const force = (ball.radius * 3 - dist) * 0.05;
          const angle = Math.atan2(dy, dx);
          ball.vx += Math.cos(angle) * force;
          ball.vy += Math.sin(angle) * force;
        }
      });
    }
  });

  // Mouse down: detect click on cue ball
  canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    // Check if cue ball (balls[0]) is clicked
    const cueBall = balls[0];
    const dx = cueBall.x - mx;
    const dy = cueBall.y - my;
    
    if (Math.hypot(dx, dy) < cueBall.radius * 1.5) {
      isDragging = true;
      dragStartBall = cueBall;
      dragStartX = cueBall.x;
      dragStartY = cueBall.y;
    }
  });

  // Mouse up: strike the ball
  window.addEventListener('mouseup', () => {
    if (isDragging && dragStartBall) {
      const dx = dragStartX - currentMouseX;
      const dy = dragStartY - currentMouseY;
      const dist = Math.hypot(dx, dy);

      // Strike ball vector scaled to drag length
      const strikePower = Math.min(dist * 0.15, 25); // Cap power limit
      const angle = Math.atan2(dy, dx);

      dragStartBall.vx = Math.cos(angle) * strikePower;
      dragStartBall.vy = Math.sin(angle) * strikePower;
    }
    isDragging = false;
    dragStartBall = null;
  });

  // Touch Support for Mobile / Tablet Devices
  function getTouchPos(touchEvent) {
    const rect = canvas.getBoundingClientRect();
    const touch = touchEvent.touches[0] || touchEvent.changedTouches[0];
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
  }

  canvas.addEventListener('touchstart', (e) => {
    const pos = getTouchPos(e);
    const mx = pos.x;
    const my = pos.y;
    currentMouseX = mx;
    currentMouseY = my;

    const cueBall = balls[0];
    const dx = cueBall.x - mx;
    const dy = cueBall.y - my;
    
    // Touch aiming drag detection (larger touch hit area for mobile screens)
    if (Math.hypot(dx, dy) < cueBall.radius * 2.5) {
      e.preventDefault(); // Prevent window scroll while aiming
      isDragging = true;
      dragStartBall = cueBall;
      dragStartX = cueBall.x;
      dragStartY = cueBall.y;
    }
  }, { passive: false });

  canvas.addEventListener('touchmove', (e) => {
    const pos = getTouchPos(e);
    const mx = pos.x;
    const my = pos.y;
    currentMouseX = mx;
    currentMouseY = my;

    if (isDragging) {
      e.preventDefault(); // Lock scrolling while dragging aim stick
    } else {
      // Repulse/scatter balls on finger swipe
      balls.forEach(ball => {
        const dx = ball.x - mx;
        const dy = ball.y - my;
        const dist = Math.hypot(dx, dy);
        
        if (dist < ball.radius * 3) {
          const force = (ball.radius * 3 - dist) * 0.05;
          const angle = Math.atan2(dy, dx);
          ball.vx += Math.cos(angle) * force;
          ball.vy += Math.sin(angle) * force;
        }
      });
    }
  }, { passive: false });

  window.addEventListener('touchend', () => {
    if (isDragging && dragStartBall) {
      const dx = dragStartX - currentMouseX;
      const dy = dragStartY - currentMouseY;
      const dist = Math.hypot(dx, dy);

      const strikePower = Math.min(dist * 0.15, 25);
      const angle = Math.atan2(dy, dx);

      dragStartBall.vx = Math.cos(angle) * strikePower;
      dragStartBall.vy = Math.sin(angle) * strikePower;
    }
    isDragging = false;
    dragStartBall = null;
  });

  // Handle elastic collision response between balls
  function resolveCollisions() {
    for (let i = 0; i < balls.length; i++) {
      for (let j = i + 1; j < balls.length; j++) {
        const b1 = balls[i];
        const b2 = balls[j];

        const dx = b2.x - b1.x;
        const dy = b2.y - b1.y;
        const dist = Math.hypot(dx, dy);

        if (dist < b1.radius + b2.radius) {
          // Calculate overlap and push apart slightly to prevent clipping
          const overlap = (b1.radius + b2.radius) - dist;
          const normalX = dx / dist;
          const normalY = dy / dist;

          b1.x -= normalX * overlap * 0.5;
          b1.y -= normalY * overlap * 0.5;
          b2.x += normalX * overlap * 0.5;
          b2.y += normalY * overlap * 0.5;

          // Elastic collision math (conservation of momentum)
          const kx = b1.vx - b2.vx;
          const ky = b1.vy - b2.vy;
          const p = 2 * (normalX * kx + normalY * ky) / (b1.mass + b2.mass);

          b1.vx -= p * b2.mass * normalX;
          b1.vy -= p * b2.mass * normalY;
          b2.vx += p * b1.mass * normalX;
          b2.vy += p * b1.mass * normalY;
        }
      }
    }
  }

  // Draw cue stick guidance line
  function drawCueStick() {
    if (isDragging && dragStartBall) {
      ctx.beginPath();
      ctx.moveTo(dragStartBall.x, dragStartBall.y);
      ctx.lineTo(currentMouseX, currentMouseY);
      
      ctx.strokeStyle = 'rgba(255, 230, 118, 0.7)';
      ctx.lineWidth = 3;
      ctx.shadowColor = 'rgba(255, 230, 118, 0.4)';
      ctx.shadowBlur = 10;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.shadowBlur = 0; // Reset

      // Aim helper circle
      const dx = dragStartX - currentMouseX;
      const dy = dragStartY - currentMouseY;
      const angle = Math.atan2(dy, dx);
      const targetX = dragStartBall.x + Math.cos(angle) * Math.hypot(dx, dy) * 1.5;
      const targetY = dragStartBall.y + Math.sin(angle) * Math.hypot(dx, dy) * 1.5;

      ctx.beginPath();
      ctx.arc(targetX, targetY, dragStartBall.radius * 0.8, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  // Animation cycle
  function loop() {
    // Felt color fill
    ctx.fillStyle = '#031409';
    ctx.fillRect(0, 0, width, height);

    // Draw borders/cushions boundaries indicator
    ctx.strokeStyle = 'rgba(0, 230, 118, 0.15)';
    ctx.lineWidth = 10;
    ctx.strokeRect(0, 0, width, height);

    resolveCollisions();

    // Update and draw
    balls.forEach(ball => {
      ball.update();
      ball.draw();
    });

    drawCueStick();

    requestAnimationFrame(loop);
  }
  loop();
};

/* -----------------------------------------
   Interactive Booking Form Simulation
----------------------------------------- */
const initBookingForm = () => {
  const form = document.getElementById('reservation-form');
  const successState = document.getElementById('booking-success');
  const loadingState = document.getElementById('booking-loading');
  const resetBtn = document.getElementById('btn-reset-booking');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Hide active form, show loading spinner
    form.classList.add('hidden');
    loadingState.classList.remove('hidden');

    // Simulate server transmission delay
    setTimeout(() => {
      loadingState.classList.add('hidden');
      successState.classList.remove('hidden');
    }, 1800);
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      // Clear form inputs
      form.reset();
      
      // Hide success, restore form
      successState.classList.add('hidden');
      form.classList.remove('hidden');
    });
  }
};

/* -----------------------------------------
   Mobile Navbar Drawer Toggle
----------------------------------------- */
const initMobileMenu = () => {
  const toggleBtn = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuLinks = document.querySelectorAll('.mobile-nav-link, .mobile-nav-btn');

  if (!toggleBtn || !mobileMenu) return;

  toggleBtn.addEventListener('click', () => {
    toggleBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });

  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.classList.remove('active');
      mobileMenu.classList.remove('active');
    });
  });
};

/* -----------------------------------------
   Main Bootstrap Lifecycle
----------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initHeroAnimations();
  initAuraSelector();
  initHorizontalScroll();
  initBilliardsPhysics();
  initBookingForm();
  initMobileMenu();
});
