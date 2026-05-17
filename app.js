const loader = document.getElementById("loader");

window.addEventListener("load", () => {
  setTimeout(() => {
    loader.classList.add("hide");
  }, 700);
});

const cursorGlow = document.getElementById("cursorGlow");

window.addEventListener("mousemove", event => {
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
  cursorGlow.style.opacity = "1";
});

window.addEventListener("mouseleave", () => {
  cursorGlow.style.opacity = "0";
});

const revealTargets = document.querySelectorAll(
  ".hero-left, .hero-right, .section-heading, .glass-card, .skill-row span, .contact-box"
);

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  {
    threshold: 0.15
  }
);

revealTargets.forEach((target, index) => {
  target.style.transitionDelay = `${Math.min(index * 0.07, 0.5)}s`;
  revealObserver.observe(target);
});

const cards = document.querySelectorAll(".glass-card, .profile-card, .contact-box");

cards.forEach(card => {
  card.addEventListener("mousemove", event => {
    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * 12;
    const rotateX = ((y / rect.height) - 0.5) * -12;

    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

const magneticItems = document.querySelectorAll(".primary-btn, .secondary-btn, .cv-btn");

magneticItems.forEach(item => {
  item.classList.add("magnetic");

  item.addEventListener("mousemove", event => {
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    item.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
  });

  item.addEventListener("mouseleave", () => {
    item.style.transform = "";
  });
});

const heroTitle = document.querySelector(".hero h1");

heroTitle.style.opacity = "0";

setTimeout(() => {
  heroTitle.style.opacity = "1";
  heroTitle.animate(
    [
      { opacity: 0, transform: "translateY(45px) scale(0.94)", filter: "blur(10px)" },
      { opacity: 1, transform: "translateY(0) scale(1)", filter: "blur(0)" }
    ],
    {
      duration: 1100,
      easing: "cubic-bezier(.2,.8,.2,1)",
      fill: "forwards"
    }
  );
}, 950);

const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

let particles = [];
let mouse = {
  x: null,
  y: null,
  radius: 120
};

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener("resize", () => {
  resizeCanvas();
  createParticles();
});

window.addEventListener("mousemove", event => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

window.addEventListener("mouseout", () => {
  mouse.x = null;
  mouse.y = null;
});

function createParticles() {
  particles = [];

  const count = Math.min(95, Math.floor(window.innerWidth / 5));

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      baseX: Math.random() * canvas.width,
      baseY: Math.random() * canvas.height,
      size: Math.random() * 2.2 + 0.7,
      speedX: (Math.random() - 0.5) * 0.45,
      speedY: (Math.random() - 0.5) * 0.45,
      opacity: Math.random() * 0.55 + 0.2
    });
  }
}

createParticles();

function drawParticle(particle) {
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(186, 230, 253, ${particle.opacity})`;
  ctx.fill();
}

function connectParticles() {
  for (let a = 0; a < particles.length; a++) {
    for (let b = a + 1; b < particles.length; b++) {
      const dx = particles[a].x - particles[b].x;
      const dy = particles[a].y - particles[b].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 120) {
        const opacity = 1 - distance / 120;

        ctx.beginPath();
        ctx.strokeStyle = `rgba(125, 211, 252, ${opacity * 0.16})`;
        ctx.lineWidth = 1;
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
}

function moveParticles() {
  particles.forEach(particle => {
    particle.x += particle.speedX;
    particle.y += particle.speedY;

    if (particle.x < 0 || particle.x > canvas.width) {
      particle.speedX *= -1;
    }

    if (particle.y < 0 || particle.y > canvas.height) {
      particle.speedY *= -1;
    }

    if (mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - particle.x;
      const dy = mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius) {
        const force = (mouse.radius - distance) / mouse.radius;
        const angle = Math.atan2(dy, dx);

        particle.x -= Math.cos(angle) * force * 2.5;
        particle.y -= Math.sin(angle) * force * 2.5;
      }
    }

    drawParticle(particle);
  });
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  moveParticles();
  connectParticles();
  requestAnimationFrame(animateParticles);
}

animateParticles();

let lastScrollY = window.scrollY;
const topbar = document.querySelector(".topbar");

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY > lastScrollY && currentScrollY > 120) {
    topbar.style.transform = "translateX(-50%) translateY(-120px)";
  } else {
    topbar.style.transform = "translateX(-50%) translateY(0)";
  }

  lastScrollY = currentScrollY;
});
const showcaseProjects = [
  {
    category: "Streaming Platform",
    name: "Velorra",
    text: "A premium movie and streaming website concept with modern glass UI, category system, smooth browsing and admin panel structure.",
    tags: ["Node.js", "EJS", "Admin Panel"],
    number: "01",
    theme: "radial-gradient(circle at 20% 20%, rgba(56,189,248,0.35), transparent 30%), radial-gradient(circle at 90% 60%, rgba(139,92,246,0.28), transparent 35%), rgba(15,23,42,0.9)"
  },
  {
    category: "Business Dashboard",
    name: "Hisaber Khata",
    text: "A smart accounting dashboard concept for sales, purchase, due tracking, profit report, backup and professional business management.",
    tags: ["Dashboard", "Reports", "Business UI"],
    number: "02",
    theme: "radial-gradient(circle at 20% 20%, rgba(34,197,94,0.32), transparent 30%), radial-gradient(circle at 90% 60%, rgba(14,165,233,0.28), transparent 35%), rgba(15,23,42,0.9)"
  },
  {
    category: "Personal Brand",
    name: "Portfolio",
    text: "A luxury personal portfolio website with cinematic hero, liquid glass cards, particle animation and professional presentation.",
    tags: ["Portfolio", "Animation", "Glass UI"],
    number: "03",
    theme: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.26), transparent 30%), radial-gradient(circle at 90% 60%, rgba(56,189,248,0.34), transparent 35%), rgba(15,23,42,0.9)"
  },
  {
    category: "Sports Experience",
    name: "Sports Flay",
    text: "A sports streaming interface concept for live matches, video sections, channel browsing and mobile-first entertainment experience.",
    tags: ["Sports", "Streaming", "Mobile UI"],
    number: "04",
    theme: "radial-gradient(circle at 20% 20%, rgba(239,68,68,0.28), transparent 30%), radial-gradient(circle at 90% 60%, rgba(245,158,11,0.25), transparent 35%), rgba(15,23,42,0.9)"
  }
];

let showcaseIndex = 0;

const showcase = document.querySelector(".showcase");
const projectCategory = document.getElementById("projectCategory");
const projectName = document.getElementById("projectName");
const projectText = document.getElementById("projectText");
const projectTags = document.getElementById("projectTags");
const projectNumber = document.getElementById("projectNumber");
const deviceScreen = document.getElementById("deviceScreen");

function renderShowcase() {
  const item = showcaseProjects[showcaseIndex];

  projectCategory.textContent = item.category;
  projectName.textContent = item.name;
  projectText.textContent = item.text;
  projectNumber.textContent = item.number;
  deviceScreen.style.background = item.theme;

  projectTags.innerHTML = item.tags.map(tag => `<b>${tag}</b>`).join("");

  showcase.classList.remove("animate");
  void showcase.offsetWidth;
  showcase.classList.add("animate");
}

function nextShowcase() {
  showcaseIndex++;

  if (showcaseIndex >= showcaseProjects.length) {
    showcaseIndex = 0;
  }

  renderShowcase();
}

function prevShowcase() {
  showcaseIndex--;

  if (showcaseIndex < 0) {
    showcaseIndex = showcaseProjects.length - 1;
  }

  renderShowcase();
}

setInterval(nextShowcase, 6000);
renderShowcase();
const skillArticles = document.querySelectorAll(".skills-info article");

skillArticles.forEach((article, index) => {
  article.style.opacity = "0";
  article.style.transform = "translateX(35px)";

  setTimeout(() => {
    article.style.transition = "0.8s cubic-bezier(.2,.8,.2,1)";
  }, 100);

  revealObserver.observe(article);
});

const galaxy = document.querySelector(".skills-galaxy");

if (galaxy) {
  galaxy.addEventListener("mousemove", event => {
    const rect = galaxy.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const moveX = (x / rect.width - 0.5) * 18;
    const moveY = (y / rect.height - 0.5) * 18;

    document.querySelector(".core-circle").style.transform =
      `translate(${moveX}px, ${moveY}px)`;

    document.querySelectorAll(".orbit").forEach((orbit, index) => {
      orbit.style.marginLeft = `${moveX * (index + 1) * 0.25}px`;
      orbit.style.marginTop = `${moveY * (index + 1) * 0.25}px`;
    });
  });

  galaxy.addEventListener("mouseleave", () => {
    document.querySelector(".core-circle").style.transform = "";

    document.querySelectorAll(".orbit").forEach(orbit => {
      orbit.style.marginLeft = "";
      orbit.style.marginTop = "";
    });
  });
}
const serviceCards = document.querySelectorAll(".service-card");
const pricingCards = document.querySelectorAll(".pricing-card");

serviceCards.forEach(card => {
  card.addEventListener("mousemove", event => {
    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * 14;
    const rotateX = ((y / rect.height) - 0.5) * -14;

    card.style.transform =
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px)`;
  });

  card.addEventListener("mouseleave", () => {
    if (card.classList.contains("featured-service")) {
      card.style.transform = "scale(1.03)";
    } else {
      card.style.transform = "";
    }
  });
});

pricingCards.forEach(card => {
  card.addEventListener("mousemove", event => {
    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const moveX = (x / rect.width - 0.5) * 18;
    const moveY = (y / rect.height - 0.5) * 18;

    card.style.transform =
      `translate(${moveX}px, ${moveY}px)`;
  });

  card.addEventListener("mouseleave", () => {
    if (card.classList.contains("premium-price")) {
      card.style.transform = "scale(1.05)";
    } else {
      card.style.transform = "";
    }
  });
});
const counters = document.querySelectorAll(".counter");

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counter = entry.target;

      const target = +counter.dataset.target;
      let count = 0;

      const updateCounter = () => {
        const increment = Math.ceil(target / 80);

        count += increment;

        if (count >= target) {
          counter.innerText = target;
        } else {
          counter.innerText = count;
          requestAnimationFrame(updateCounter);
        }
      };

      updateCounter();

      counterObserver.unobserve(counter);
    }
  });
}, {
  threshold: 0.4
});

counters.forEach(counter => {
  counterObserver.observe(counter);
});

const timelineCards = document.querySelectorAll(".timeline-card");

timelineCards.forEach(card => {
  card.addEventListener("mousemove", event => {
    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * 8;
    const rotateX = ((y / rect.height) - 0.5) * -8;

    card.style.transform =
      `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateX(10px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

const achievementBoxes = document.querySelectorAll(".achievement-box");

achievementBoxes.forEach(box => {
  box.addEventListener("mousemove", event => {
    const rect = box.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const moveX = (x / rect.width - 0.5) * 12;
    const moveY = (y / rect.height - 0.5) * 12;

    box.style.transform =
      `translate(${moveX}px, ${moveY}px)`;
  });

  box.addEventListener("mouseleave", () => {
    box.style.transform = "";
  });
});
const dockItems = document.querySelectorAll(".floating-dock a");

dockItems.forEach(item => {
  item.addEventListener("mousemove", event => {
    const rect = item.getBoundingClientRect();

    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    item.style.transform =
      `translate(${x * 0.18}px, ${y * 0.18}px) scale(1.08)`;
  });

  item.addEventListener("mouseleave", () => {
    item.style.transform = "";
  });
});

const socialLinks = document.querySelectorAll(".social-links a");

socialLinks.forEach(link => {
  link.addEventListener("mousemove", event => {
    const rect = link.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const percent = x / rect.width;

    link.style.background =
      `linear-gradient(
        90deg,
        rgba(56,189,248,0.22) ${percent * 100}%,
        rgba(255,255,255,0.08) ${percent * 100}%
      )`;
  });

  link.addEventListener("mouseleave", () => {
    link.style.background = "rgba(255,255,255,0.08)";
  });
});
const dockLinks = document.querySelectorAll(".dock-link");
const pageSections = document.querySelectorAll("main[id], section[id]");

function updateActiveDock() {
  let currentSection = "home";

  pageSections.forEach(section => {
    const sectionTop = section.offsetTop - 180;

    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute("id");
    }
  });

  dockLinks.forEach(link => {
    link.classList.remove("active");

    if (link.dataset.section === currentSection) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", updateActiveDock);
updateActiveDock();

dockLinks.forEach(link => {
  link.addEventListener("click", () => {
    dockLinks.forEach(item => item.classList.remove("active"));
    link.classList.add("active");
  });
});
const performanceToggle = document.getElementById("performanceToggle");
const performanceToast = document.getElementById("performanceToast");

function showPerformanceToast(text) {
  performanceToast.textContent = text;
  performanceToast.classList.add("show");

  setTimeout(() => {
    performanceToast.classList.remove("show");
  }, 1800);
}

const savedPerformanceMode = localStorage.getItem("performanceLite");

if (savedPerformanceMode === "true") {
  document.body.classList.add("performance-lite");
  performanceToggle.textContent = "🚀";
}

performanceToggle.addEventListener("click", () => {
  document.body.classList.toggle("performance-lite");

  const isLite = document.body.classList.contains("performance-lite");

  localStorage.setItem("performanceLite", isLite);

  performanceToggle.textContent = isLite ? "🚀" : "⚡";

  showPerformanceToast(
    isLite ? "Lite Mode On — Faster Performance" : "Luxury Mode On — Full Animation"
  );
});