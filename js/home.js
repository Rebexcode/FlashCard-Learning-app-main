// Home page specific JavaScript

document.addEventListener("DOMContentLoaded", () => {
    // Animate hero stats on page load
    animateStats()
  
    // Add click handlers for category cards
    setupCategoryCards()
  
    // Initialize floating cards animation
    initFloatingCards()
  })
  
  function animateStats() {
    const statNumbers = document.querySelectorAll(".stat-number")
  
    statNumbers.forEach((stat) => {
      const finalValue = stat.textContent
      const numericValue = Number.parseInt(finalValue.replace(/\D/g, ""))
  
      if (numericValue) {
        animateNumber(stat, 0, numericValue, finalValue)
      }
    })
  }
  
  function animateNumber(element, start, end, suffix) {
    const duration = 2000 // 2 seconds
    const startTime = Date.now()
  
    function update() {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
  
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(start + (end - start) * easeOut)
  
      // Format the number with suffix
      if (suffix.includes("+")) {
        element.textContent = current.toLocaleString() + "+"
      } else if (suffix.includes("%")) {
        element.textContent = current + "%"
      } else {
        element.textContent = current.toLocaleString()
      }
  
      if (progress < 1) {
        requestAnimationFrame(update)
      }
    }
  
    requestAnimationFrame(update)
  }
  
  function setupCategoryCards() {
    const categoryCards = document.querySelectorAll(".category-card")
  
    categoryCards.forEach((card) => {
      card.addEventListener("click", function () {
        const category = this.dataset.category
        if (category) {
          // Navigate to study page with category filter
          window.location.href = `study.html?category=${category}`
        }
      })
  
      // Add hover effect
      card.addEventListener("mouseenter", function () {
        this.style.transform = "translateY(-8px) scale(1.02)"
      })
  
      card.addEventListener("mouseleave", function () {
        this.style.transform = "translateY(0) scale(1)"
      })
    })
  }
  
  function initFloatingCards() {
    const floatingCards = document.querySelectorAll(".floating-card")
  
    floatingCards.forEach((card, index) => {
      // Add random rotation and slight movement
      const randomRotation = (Math.random() - 0.5) * 10 // -5 to 5 degrees
      const randomDelay = Math.random() * 2 // 0 to 2 seconds
  
      card.style.transform = `rotate(${randomRotation}deg)`
      card.style.animationDelay = `${randomDelay}s`
  
      // Add interactive hover effect
      card.addEventListener("mouseenter", function () {
        this.style.animationPlayState = "paused"
        this.style.transform = `rotate(0deg) scale(1.1)`
      })
  
      card.addEventListener("mouseleave", function () {
        this.style.animationPlayState = "running"
        this.style.transform = `rotate(${randomRotation}deg) scale(1)`
      })
    })
  }
  
  // Parallax effect for hero section
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const hero = document.querySelector(".hero")
    const heroVisual = document.querySelector(".hero-visual")
  
    if (hero && heroVisual) {
      const rate = scrolled * -0.5
      heroVisual.style.transform = `translateY(${rate}px)`
    }
  })
  
  // Intersection Observer for feature cards animation
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("slide-up")
  
        // Stagger animation for grid items
        const siblings = Array.from(entry.target.parentNode.children)
        const index = siblings.indexOf(entry.target)
        entry.target.style.animationDelay = `${index * 0.1}s`
      }
    })
  }, observerOptions)
  
  // Observe feature cards and category cards
  document.addEventListener("DOMContentLoaded", () => {
    const animateElements = document.querySelectorAll(".feature-card, .category-card")
    animateElements.forEach((el) => observer.observe(el))
  })
  
  // Add smooth reveal animation for sections
  function revealSections() {
    const sections = document.querySelectorAll(".features, .categories-preview, .cta")
  
    sections.forEach((section) => {
      observer.observe(section)
    })
  }
  
  // Initialize section reveals
  document.addEventListener("DOMContentLoaded", revealSections)
  
  // Add typing effect to hero title
  function typeWriter() {
    const heroTitle = document.querySelector(".hero-title")
    if (!heroTitle) return
  
    const text = heroTitle.textContent
    const highlightText = heroTitle.querySelector(".highlight")
  
    if (highlightText) {
      // Simple fade-in for highlighted text
      highlightText.style.opacity = "0"
      setTimeout(() => {
        highlightText.style.transition = "opacity 1s ease-in-out"
        highlightText.style.opacity = "1"
      }, 1000)
    }
  }
  
  // Initialize typing effect
  document.addEventListener("DOMContentLoaded", typeWriter)
  
  // Add click tracking for analytics
  function trackInteraction(action, element) {
    if (window.utils && window.utils.performance) {
      window.utils.performance.logInteraction(action, element)
    }
  
    // In a real application, you might send this data to an analytics service
    console.log(`User clicked: ${element} - Action: ${action}`)
  }
  
  // Add event listeners for tracking
  document.addEventListener("DOMContentLoaded", () => {
    // Track CTA button clicks
    const ctaButtons = document.querySelectorAll(".btn-primary, .btn-secondary")
    ctaButtons.forEach((button) => {
      button.addEventListener("click", function () {
        trackInteraction("cta_click", this.textContent.trim())
      })
    })
  
    // Track category card clicks
    const categoryCards = document.querySelectorAll(".category-card")
    categoryCards.forEach((card) => {
      card.addEventListener("click", function () {
        const category = this.querySelector("h3").textContent
        trackInteraction("category_select", category)
      })
    })
  })
  