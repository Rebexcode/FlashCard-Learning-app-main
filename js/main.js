// Enhanced Main JavaScript file with modern UI interactions

// Enhanced mobile navigation with smooth animations
document.addEventListener("DOMContentLoaded", () => {
    const navToggle = document.getElementById("navToggle");
    const navMenu = document.getElementById("navMenu");
    const navbar = document.querySelector(".navbar");

    if (navToggle && navMenu) {
        navToggle.addEventListener("click", (e) => {
            e.preventDefault();
            navMenu.classList.toggle("active");
            navToggle.classList.toggle("active");

            // Add haptic feedback on mobile
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        });

        // Close mobile menu when clicking on a link
        const navLinks = navMenu.querySelectorAll(".nav-link");
        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("active");
                navToggle.classList.remove("active");
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener("click", (event) => {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove("active");
                navToggle.classList.remove("active");
            }
        });
    }

    // Enhanced navbar scroll effect
    let lastScrollY = window.scrollY;
    const scrollThreshold = 50;

    window.addEventListener(
        "scroll",
        utils.debounce(() => {
            const currentScrollY = window.scrollY;

            if (navbar) {
                if (currentScrollY > scrollThreshold) {
                    navbar.classList.add("scrolled");
                } else {
                    navbar.classList.remove("scrolled");
                }

                // Hide/show navbar on scroll
                if (currentScrollY > lastScrollY && currentScrollY > 200) {
                    navbar.style.transform = "translateY(-100%)";
                } else {
                    navbar.style.transform = "translateY(0)";
                }
            }

            lastScrollY = currentScrollY;
        }, 10)
    );
});

// Enhanced smooth scrolling with custom easing
document.addEventListener("DOMContentLoaded", () => {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
            e.preventDefault();

            const targetId = this.getAttribute("href");
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navbarHeight = document.querySelector(".navbar")?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - navbarHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth",
                });
            }
        });
    });
});

// Advanced intersection observer with stagger animations
function observeElements() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger animation delay
                    setTimeout(() => {
                        entry.target.classList.add("fade-in");

                        // Add different animation classes based on element type
                        if (entry.target.classList.contains("feature-card")) {
                            entry.target.classList.add("slide-up");
                        } else if (entry.target.classList.contains("category-card")) {
                            entry.target.classList.add("scale-in");
                        }
                    }, index * 100);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px",
        }
    );

    // Observe all animate-able elements
    const animateElements = document.querySelectorAll(".feature-card, .category-card, .stat-card, .team-member, .stat-item");
    animateElements.forEach((el) => observer.observe(el));
}

// Initialize enhanced animations
document.addEventListener("DOMContentLoaded", observeElements);

// Parallax effect for hero section
document.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll(".floating-card");

    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + index * 0.1;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Enhanced utility functions
const utils = {
    // Improved time formatting
    formatTime: (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
        }
        return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    },

    // Get random element from array
    getRandomElement: (array) => array[Math.floor(Math.random() * array.length)],

    // Fisher-Yates shuffle algorithm
    shuffleArray: (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    // Enhanced debounce function
    debounce: (func, wait, immediate = false) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },

    // Throttle function for performance
    throttle: (func, limit) => {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    },

    // Enhanced local storage with compression
    storage: {
        get: (key, defaultValue = null) => {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.error("Error reading from localStorage:", error);
                return defaultValue;
            }
        },

        set: (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.error("Error writing to localStorage:", error);
                return false;
            }
        },

        remove: (key) => {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.error("Error removing from localStorage:", error);
                return false;
            }
        },

        clear: () => {
            try {
                localStorage.clear();
                return true;
            } catch (error) {
                console.error("Error clearing localStorage:", error);
                return false;
            }
        },
    },

    // Copy to clipboard with fallback
    copyToClipboard: async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand("copy");
                return true;
            } catch (fallbackError) {
                console.error("Failed to copy text:", fallbackError);
                return false;
            } finally {
                document.body.removeChild(textArea);
            }
        }
    },

    // Generate unique ID
    generateId: () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,

    // Format numbers with locale
    formatNumber: (num, locale = "en-US") => {
        return new Intl.NumberFormat(locale).format(num);
    },
};

// Make utils available globally
window.utils = utils;

// Enhanced theme management with system preference detection
const themeManager = {
    init: function () {
        const savedTheme = utils.storage.get("theme");
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        const theme = savedTheme || systemTheme;

        this.setTheme(theme);
        this.watchSystemTheme();
    },

    setTheme: (theme) => {
        document.documentElement.setAttribute("data-theme", theme);
        utils.storage.set("theme", theme);

        // Update theme color meta tag
        const themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (themeColorMeta) {
            themeColorMeta.content = theme === "dark" ? "#1e293b" : "#6366f1";
        }
    },

    toggleTheme: function () {
        const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
        const newTheme = currentTheme === "light" ? "dark" : "light";
        this.setTheme(newTheme);
    },

    watchSystemTheme: function () {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        mediaQuery.addEventListener("change", (e) => {
            if (!utils.storage.get("theme")) {
                this.setTheme(e.matches ? "dark" : "light");
            }
        });
    },
};

// Keyboard shortcuts
const keyboardShortcuts = {
    init: function () {
        document.addEventListener("keydown", (e) => {
            // Alt + T: Toggle theme
            if (e.altKey && e.key === "t") {
                e.preventDefault();
                themeManager.toggleTheme();
                this.showToast("Theme toggled");
            }

            // Escape: Close modals
            if (e.key === "Escape") {
                const activeModal = document.querySelector(".modal.active");
                if (activeModal) {
                    activeModal.classList.remove("active");
                }
            }

            // Ctrl/Cmd + K: Focus search (if exists)
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                const searchInput = document.querySelector('input[type="search"], .search-input');
                if (searchInput) {
                    searchInput.focus();
                }
            }
        });
    },

    showToast: function (message, duration = 3000) {
        const toast = document.createElement("div");
        toast.className = "toast";
        toast.textContent = message;
        toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--primary-gradient);
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      z-index: 10000;
      animation: slideIn 0.3s ease;
    `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = "slideOut 0.3s ease";
            setTimeout(() => document.body.removeChild(toast), 300);
        }, duration);
    },
};

// Performance monitoring with Web Vitals
const performanceMonitor = {
    startTime: Date.now(),

    init: function () {
        this.logPageLoad();
        this.monitorLCP();
        this.monitorFID();
        this.monitorCLS();
    },

    logPageLoad: function () {
        window.addEventListener("load", () => {
            const loadTime = Date.now() - this.startTime;
            console.log(`Page loaded in ${loadTime}ms`);

            // Log navigation timing
            if (performance.navigation) {
                const navTiming = performance.getEntriesByType("navigation")[0];
                console.log("Navigation timing:", {
                    dns: navTiming.domainLookupEnd - navTiming.domainLookupStart,
                    tcp: navTiming.connectEnd - navTiming.connectStart,
                    ttfb: navTiming.responseStart - navTiming.requestStart,
                    domReady: navTiming.domContentLoadedEventEnd - navTiming.navigationStart,
                    loadComplete: navTiming.loadEventEnd - navTiming.navigationStart,
                });
            }
        });
    },

    logInteraction: (action, element) => {
        console.log(`User interaction: ${action} on ${element}`);
    },

    monitorLCP: function () {
        if ("PerformanceObserver" in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log("LCP:", lastEntry.startTime);
            });
            observer.observe({ entryTypes: ["largest-contentful-paint"] });
        }
    },

    monitorFID: function () {
        if ("PerformanceObserver" in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    console.log("FID:", entry.processingStart - entry.startTime);
                });
            });
            observer.observe({ entryTypes: ["first-input"] });
        }
    },

    monitorCLS: function () {
        if ("PerformanceObserver" in window) {
            let clsValue = 0;
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                console.log("CLS:", clsValue);
            });
            observer.observe({ entryTypes: ["layout-shift"] });
        }
    },
};

// Enhanced accessibility features
const a11y = {
    init: function () {
        this.setupFocusTrapping();
        this.setupAriaLiveRegion();
        this.enhanceKeyboardNavigation();
    },

    setupFocusTrapping: function () {
        const modals = document.querySelectorAll(".modal");
        modals.forEach((modal) => {
            modal.addEventListener("keydown", (e) => {
                if (e.key === "Tab") {
                    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];

                    if (e.shiftKey && document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    } else if (!e.shiftKey && document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            });
        });
    },

    setupAriaLiveRegion: function () {
        const liveRegion = document.createElement("div");
        liveRegion.setAttribute("aria-live", "polite");
        liveRegion.setAttribute("aria-atomic", "true");
        liveRegion.className = "sr-only";
        liveRegion.id = "aria-live-region";
        document.body.appendChild(liveRegion);

        window.announceToScreenReader = (message) => {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = "";
            }, 1000);
        };
    },

    enhanceKeyboardNavigation: function () {
        // Add visible focus indicators
        document.addEventListener("keydown", (e) => {
            if (e.key === "Tab") {
                document.body.classList.add("keyboard-navigation");
            }
        });

        document.addEventListener("mousedown", () => {
            document.body.classList.remove("keyboard-navigation");
        });
    },
};

// Make showToast globally available immediately
window.showToast = function (message, type = "info") {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === "error" ? "#dc3545" : type === "success" ? "#28a745" : "var(--primary-gradient)"};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = "slideOut 0.3s ease";
        setTimeout(() => {
            if (toast.parentNode) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
};

// Initialize all features
document.addEventListener("DOMContentLoaded", () => {
    themeManager.init();
    keyboardShortcuts.init();
    performanceMonitor.init();
    a11y.init();
});

// Global error handling with user feedback
window.addEventListener("error", (event) => {
    console.error("JavaScript error:", event.error);

    // Show user-friendly error message
    if (keyboardShortcuts.showToast) {
        keyboardShortcuts.showToast("Something went wrong. Please refresh the page.", 5000);
    }
});

window.addEventListener("unhandledrejection", (event) => {
    console.error("Unhandled promise rejection:", event.reason);

    // Show user-friendly error message
    if (keyboardShortcuts.showToast) {
        keyboardShortcuts.showToast("A network error occurred. Please try again.", 5000);
    }
});
