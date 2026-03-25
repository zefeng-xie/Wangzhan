const STAT_ANIMATION_DURATION = 1200

function animateCount(el) {
  const target = Number.parseInt(el.dataset.target ?? '0', 10)
  const start = performance.now()

  function step(now) {
    const progress = Math.min((now - start) / STAT_ANIMATION_DURATION, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    el.textContent = String(Math.floor(eased * target))

    if (progress < 1) {
      requestAnimationFrame(step)
      return
    }

    el.textContent = String(target)
  }

  requestAnimationFrame(step)
}

function bindStatObserver() {
  const statsSection = document.querySelector('.stats-section')
  if (!statsSection || statsSection.dataset.observerBound === 'true') {
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return
        }

        document.querySelectorAll('.stat-count').forEach(animateCount)
        observer.disconnect()
      })
    },
    { threshold: 0.3 },
  )

  observer.observe(statsSection)
  statsSection.dataset.observerBound = 'true'
}

function bindNavbarShadow() {
  const navbar = document.querySelector('.navbar')
  if (!navbar) {
    return
  }

  window.addEventListener('scroll', () => {
    navbar.style.boxShadow =
      window.scrollY > 50
        ? '0 2px 20px rgba(0, 0, 0, 0.1)'
        : '0 1px 10px rgba(0, 0, 0, 0.05)'
  })
}

function bindFadeInObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    },
    { threshold: 0.1 },
  )

  document
    .querySelectorAll('.skill-card, .project-card, .about-content, .contact-item, .story-card')
    .forEach((el) => {
      el.classList.add('fade-in')
      observer.observe(el)
    })
}

function bindSmoothScroll() {
  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault()
      const targetId = link.getAttribute('href')
      if (!targetId) {
        return
      }

      document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth' })
    })
  })
}

function bindInteractionsOnce() {
  const root = document.documentElement
  if (root.dataset.portfolioBound === 'true') {
    return
  }

  bindNavbarShadow()
  bindFadeInObserver()
  bindSmoothScroll()

  root.dataset.portfolioBound = 'true'
}

export function initPortfolioPage() {
  bindInteractionsOnce()
  bindStatObserver()
}
