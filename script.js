const nav = document.querySelector(".navbar");
const revealEls = document.querySelectorAll(".reveal");
const staggerEls = document.querySelectorAll(".stagger");
const counters = document.querySelectorAll("[data-count]");

function updateNav() {
  nav.classList.toggle("scrolled", window.scrollY > 24);
}

window.addEventListener("scroll", updateNav);
updateNav();

staggerEls.forEach((el, index) => {
  el.style.setProperty("--stagger-delay", `${Math.min(index * 0.08, 0.24)}s`);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealEls.forEach((el) => revealObserver.observe(el));

function animateCounter(counter) {
  const target = Number(counter.dataset.count);
  const hasDecimal = !Number.isInteger(target);
  const duration = 1100;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    counter.textContent = hasDecimal ? value.toFixed(1) : Math.round(value);

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      counter.textContent = hasDecimal ? target.toFixed(1) : target;
    }
  }

  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.55 }
);

counters.forEach((counter) => counterObserver.observe(counter));

document.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    const menu = document.querySelector(".navbar-collapse.show");
    if (menu) {
      bootstrap.Collapse.getOrCreateInstance(menu).hide();
    }
  });
});
