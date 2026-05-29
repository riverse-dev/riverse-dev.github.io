/* ============================================
   Riverse Dev — Script
   Aetheric Indigo Design System
   ============================================ */

// --- DOM refs ---
const appGrid = document.getElementById("appGrid");
const yearSpan = document.getElementById("year");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

// --- Year ---
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// --- Glow colors per app ---
const glowColors = {
    uangku: "card-glow-violet",
    warungku: "card-glow-orange",
    listriku: "card-glow-cyan"
};

// --- Load Apps ---
if (appGrid) {
    fetch("apps.json")
        .then(res => res.json())
        .then(data => {
            data.forEach((app, index) => {
                const card = document.createElement("div");
                card.className = "glass-card";
                card.style.transitionDelay = `${index * 120}ms`;

                const glowClass = glowColors[app.app_id] || "card-glow-violet";

                const buttonLabel = app.is_release
                    ? "Google Play"
                    : "Daftar Penguji";

                const buttonLink = app.is_release
                    ? app.link
                    : `how_to_join.html?app=${app.app_id}`;

                const buttonTarget = app.is_release ? "_blank" : "_self";

                card.innerHTML = `
                    <div class="card-glow ${glowClass}"></div>
                    <div class="app-icon-wrapper">
                        <img src="${app.icon}" alt="${app.name}" loading="lazy">
                    </div>
                    <h3>${app.name}</h3>
                    <p class="card-desc text-body-md">${app.description || ""}</p>
                    <a class="card-link text-label-sm" href="${buttonLink}" target="${buttonTarget}">
                        ${buttonLabel}
                        <span class="material-symbols-outlined link-arrow">arrow_forward</span>
                    </a>
                `;

                appGrid.appendChild(card);
            });

            // Trigger entrance animations
            observeElements('.glass-card');
        });
}

// --- IntersectionObserver for scroll-reveal ---
function observeElements(selector) {
    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
        elements.forEach(el => el.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

// Observe step-cards on load (for how_to_join page)
document.addEventListener('DOMContentLoaded', () => {
    observeElements('.step-card');
});

// ============================================
// Theme Toggle
// ============================================

function applyTheme(theme) {
    const root = document.documentElement;

    if (theme === 'light') {
        root.classList.add('light');
    } else {
        root.classList.remove('light');
    }

    // Update icon
    if (themeIcon) {
        themeIcon.textContent = theme === 'light' ? 'light_mode' : 'dark_mode';
    }
}

// Load saved theme (default: dark)
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
    applyTheme(savedTheme);
} else {
    // Default to dark (Aetheric Indigo is dark-first)
    applyTheme("dark");
}

// Remove no-transition class after initial theme
requestAnimationFrame(() => {
    requestAnimationFrame(() => {
        document.body.classList.remove('no-transition');
    });
});

// Toggle click
if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const isLight = document.documentElement.classList.contains('light');
        const newTheme = isLight ? 'dark' : 'light';
        applyTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
