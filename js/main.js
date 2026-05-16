document.addEventListener("DOMContentLoaded", () => {
  initParticleBackground();

  const navMenu = document.getElementById("navMenu");
  const menuToggle = document.getElementById("mobileMenuToggle");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const sections = Array.from(document.querySelectorAll("main .section"));
  const scrollTopBtn = document.getElementById("scrollTopBtn");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("active");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      const icon = menuToggle.querySelector("i");
      if (icon) {
        icon.classList.toggle("fa-bars", !isOpen);
        icon.classList.toggle("fa-xmark", isOpen);
      }
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;

      event.preventDefault();
      const headerOffset = 82;
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: "smooth" });

      navMenu?.classList.remove("active");
      menuToggle?.setAttribute("aria-expanded", "false");
      const icon = menuToggle?.querySelector("i");
      icon?.classList.add("fa-bars");
      icon?.classList.remove("fa-xmark");
    });
  });

  const updateActiveNavigation = () => {
    const scrollPosition = window.scrollY + 140;
    let activeId = sections[0]?.id || "";

    sections.forEach((section) => {
      if (scrollPosition >= section.offsetTop) {
        activeId = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`);
    });

    scrollTopBtn?.classList.toggle("visible", window.scrollY > 480);
  };

  window.addEventListener("scroll", updateActiveNavigation, { passive: true });
  updateActiveNavigation();

  scrollTopBtn?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const animatedElements = document.querySelectorAll("[data-animate]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -80px 0px" }
  );

  animatedElements.forEach((element) => observer.observe(element));
});

function initParticleBackground() {
  const mount = document.getElementById("particle-background");
  const three = window.THREE;
  if (!mount || !three) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scene = new three.Scene();
  const camera = new three.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 1, 1200);
  camera.position.z = 320;

  const renderer = new three.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  mount.appendChild(renderer.domElement);

  const particleCount = window.innerWidth < 700 ? 120 : 220;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const colorA = new three.Color("#8b5cf6");
  const colorB = new three.Color("#22d3ee");

  for (let index = 0; index < particleCount; index += 1) {
    const offset = index * 3;
    positions[offset] = (Math.random() - 0.5) * 980;
    positions[offset + 1] = (Math.random() - 0.5) * 620;
    positions[offset + 2] = (Math.random() - 0.5) * 620;

    const mixed = colorA.clone().lerp(colorB, Math.random());
    colors[offset] = mixed.r;
    colors[offset + 1] = mixed.g;
    colors[offset + 2] = mixed.b;
  }

  const geometry = new three.BufferGeometry();
  geometry.setAttribute("position", new three.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new three.BufferAttribute(colors, 3));

  const material = new three.PointsMaterial({
    size: 2.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.68,
    blending: three.AdditiveBlending,
    depthWrite: false
  });

  const particles = new three.Points(geometry, material);
  scene.add(particles);

  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener("resize", onResize, { passive: true });

  const render = () => {
    renderer.render(scene, camera);
  };

  if (reducedMotion) {
    particles.rotation.x = 0.18;
    particles.rotation.y = -0.12;
    render();
    return;
  }

  const animate = () => {
    particles.rotation.x += 0.00045;
    particles.rotation.y += 0.00072;
    particles.position.y = Math.sin(Date.now() * 0.00025) * 10;
    render();
    window.requestAnimationFrame(animate);
  };

  animate();
}
