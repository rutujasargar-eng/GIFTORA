
import { useState } from 'react'

import {
  Gift,
  Heart,
  ArrowRight,
  Sparkles,
  Search,
  Menu,
  X,
  Users,
  ShieldCheck,
  Plus,
  CheckCircle,
} from 'lucide-react'

import toast, { Toaster } from 'react-hot-toast'

import CreateWish from './components/CreateWish'
import WishDetails from './components/WishDetails'

import './App.css'

// ----------------------------------
// SAMPLE WISHES
// ----------------------------------

const sampleWishes = [
  {
    id: 1,
    name: 'Priya Sharma',
    title: 'Help me get my dream laptop',
    description:
      'I need a laptop for my studies, coding and building my future.',
    category: 'Education',
    targetAmount: 50000,
    collected: 32000,
    contributors: 18,
    emoji: '💻',
  },
  {
    id: 2,
    name: 'Aarav Mehta',
    title: 'A special birthday surprise',
    description:
      'I wish to celebrate my birthday with something truly memorable.',
    category: 'Birthday',
    targetAmount: 10000,
    collected: 6500,
    contributors: 12,
    emoji: '🎂',
  },
  {
    id: 3,
    name: 'Ananya Patel',
    title: 'Books for my learning journey',
    description:
      'I want to build my own little library of books and learning resources.',
    category: 'Personal Wish',
    targetAmount: 8000,
    collected: 2400,
    contributors: 8,
    emoji: '📚',
  },
]

// ----------------------------------
// CATEGORIES
// ----------------------------------

const categories = [
  'All',
  'Birthday',
  'Education',
  'Personal Wish',
  'Celebrations',
]

// ----------------------------------
// MAIN APPLICATION
// ----------------------------------

function App() {
  // NAVIGATION
  const [mobileMenu, setMobileMenu] = useState(false)

  // MODALS
  const [showCreateWish, setShowCreateWish] = useState(false)
  const [selectedWishId, setSelectedWishId] = useState(null)

  // SEARCH AND FILTERS
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // LOAD CREATED WISHES
  const [wishes, setWishes] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem('giftora-wishes') || '[]'
      )

      return Array.isArray(saved) ? saved : []
    } catch {
      return []
    }
  })

  // LOAD CONTRIBUTION AND FULFILMENT DATA
  const [wishOverrides, setWishOverrides] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem('giftora-wish-overrides') || '{}'
      )

      return saved && typeof saved === 'object' && !Array.isArray(saved)
        ? saved
        : {}
    } catch {
      return {}
    }
  })

  // LOAD WISH LIKES
  const [wishLikes, setWishLikes] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem('giftora-likes') || '{}'
      )

      return saved && typeof saved === 'object' && !Array.isArray(saved)
        ? saved
        : {}
    } catch {
      return {}
    }
  })

  // COMBINE CREATED WISHES AND SAMPLE WISHES
  const allWishes = [...wishes, ...sampleWishes].map((wish) => ({
    ...wish,
    ...(wishOverrides[wish.id] || {}),
  }))

  // ----------------------------------
  // SEARCH AND FILTER LOGIC
  // ----------------------------------

  const filteredWishes = allWishes.filter((wish) => {
    const search = searchTerm.trim().toLowerCase()

    const matchesSearch =
      !search ||
      wish.title?.toLowerCase().includes(search) ||
      wish.description?.toLowerCase().includes(search) ||
      wish.name?.toLowerCase().includes(search) ||
      wish.category?.toLowerCase().includes(search)

    const matchesCategory =
      selectedCategory === 'All' ||
      wish.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // ----------------------------------
  // FORMAT INDIAN CURRENCY
  // ----------------------------------

  const formatCurrency = (amount) =>
    Number(amount || 0).toLocaleString('en-IN')

  // ----------------------------------
  // CREATE WISH
  // ----------------------------------

  const handleCreateWish = (newWish) => {
    const updatedWishes = [newWish, ...wishes]

    setWishes(updatedWishes)

    localStorage.setItem(
      'giftora-wishes',
      JSON.stringify(updatedWishes)
    )

    setShowCreateWish(false)

    setSearchTerm('')
    setSelectedCategory('All')

    toast.success('Your wish has been created!')

    setTimeout(() => {
      document.getElementById('wishes')?.scrollIntoView({
        behavior: 'smooth',
      })
    }, 300)
  }

  // ----------------------------------
  // CONTRIBUTE TO WISH
  // ----------------------------------

  const handleContribute = (wishId, amount) => {
    const currentWish = allWishes.find(
      (wish) => wish.id === wishId
    )

    if (!currentWish) {
      toast.error('Wish not found.')
      return
    }

    if (currentWish.fulfilled) {
      toast.error('This wish has already been fulfilled.')
      return
    }

    const numericAmount = Number(amount)

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0 ||
      numericAmount > 1000000
    ) {
      toast.error('Please enter a valid amount.')
      return
    }

    if (currentWish.collected >= currentWish.targetAmount) {
      toast.error('This wish has already reached its target.')
      return
    }

    const remaining =
      currentWish.targetAmount - currentWish.collected

    const acceptedAmount = Math.min(numericAmount, remaining)

    const updatedOverrides = {
      ...wishOverrides,

      [wishId]: {
        ...(wishOverrides[wishId] || {}),

        collected:
          Number(currentWish.collected || 0) + acceptedAmount,

        contributors:
          Number(currentWish.contributors || 0) + 1,
      },
    }

    setWishOverrides(updatedOverrides)

    localStorage.setItem(
      'giftora-wish-overrides',
      JSON.stringify(updatedOverrides)
    )

    setSelectedWishId(null)

    toast.success(
      `Simulated contribution of ₹${formatCurrency(acceptedAmount)} added!`
    )
  }

  // ----------------------------------
  // DIRECT GIFT / FULFIL WISH
  // ----------------------------------

  const handleDirectGift = (wishId) => {
    const currentWish = allWishes.find(
      (wish) => wish.id === wishId
    )

    if (!currentWish) {
      toast.error('Wish not found.')
      return
    }

    if (currentWish.fulfilled) {
      toast.error('This wish has already been fulfilled.')
      return
    }

    const updatedOverrides = {
      ...wishOverrides,

      [wishId]: {
        ...(wishOverrides[wishId] || {}),
        fulfilled: true,
        fulfilledAt: new Date().toISOString(),
      },
    }

    setWishOverrides(updatedOverrides)

    localStorage.setItem(
      'giftora-wish-overrides',
      JSON.stringify(updatedOverrides)
    )

    setSelectedWishId(null)

    toast.success('This wish has been marked as fulfilled! 🎁')
  }

  // ----------------------------------
  // LIKE OR UNLIKE A WISH
  // ----------------------------------

  const handleToggleLike = (wishId) => {
    const currentLike = wishLikes[wishId] || {
      liked: false,
      count: 0,
    }

    const updatedLikes = {
      ...wishLikes,

      [wishId]: {
        liked: !currentLike.liked,

        count: Math.max(
          0,
          Number(currentLike.count || 0) +
            (currentLike.liked ? -1 : 1)
        ),
      },
    }

    setWishLikes(updatedLikes)

    localStorage.setItem(
      'giftora-likes',
      JSON.stringify(updatedLikes)
    )

    toast.success(
      currentLike.liked
        ? 'Wish unliked'
        : 'You liked this wish!'
    )
  }

  // ----------------------------------
  // OPEN CREATE WISH
  // ----------------------------------

  const openCreateWish = () => {
    setShowCreateWish(true)
    setMobileMenu(false)
  }

  // ----------------------------------
  // EXPLORE WISHES
  // ----------------------------------

  const scrollToWishes = () => {
    document.getElementById('wishes')?.scrollIntoView({
      behavior: 'smooth',
    })

    setMobileMenu(false)
  }

  // ----------------------------------
  // CLEAR FILTERS
  // ----------------------------------

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('All')
  }

  // ----------------------------------
  // MAIN UI
  // ----------------------------------

  return (
    <div className="giftora">

      <Toaster position="top-right" />

      {/* NAVBAR */}

      <nav className="navbar">

        <a href="#home" className="brand">

          <span className="brand-icon">
            <Gift size={23} />
          </span>

          <span>
            GIFTORA<span className="brand-dot">.</span>
          </span>

        </a>

        <div className={`nav-links ${mobileMenu ? 'mobile-open' : ''}`}>

          <a href="#home" onClick={() => setMobileMenu(false)}>
            Home
          </a>

          <a href="#wishes" onClick={scrollToWishes}>
            Explore Wishes
          </a>

          <a
            href="#how-it-works"
            onClick={() => setMobileMenu(false)}
          >
            How It Works
          </a>

        </div>

        <div className="nav-actions">

          <button
            className="nav-create"
            onClick={openCreateWish}
          >
            <Plus size={17} />
            Create a Wish
          </button>

        </div>

        <button
          className="mobile-toggle"
          onClick={() => setMobileMenu(!mobileMenu)}
          aria-label="Toggle navigation"
        >
          {mobileMenu ? <X /> : <Menu />}
        </button>

      </nav>

      <main id="home">

        {/* HERO */}

        <section className="hero">

          <div className="hero-content">

            <div className="hero-label">
              <Sparkles size={15} />
              A LITTLE WISH CAN MEAN A LOT
            </div>

            <h1>
              Don't guess the gift.
              <br />
              <span>Fulfil the wish.</span>
            </h1>

            <p className="hero-description">
              Everyone has something they've been wishing for.
              Share yours with the people who care, and let them
              make it happen together.
            </p>

            <div className="hero-buttons">

              <button
                className="primary-btn"
                onClick={openCreateWish}
              >
                Create Your Wish
                <ArrowRight size={18} />
              </button>

              <button
                className="secondary-btn"
                onClick={scrollToWishes}
              >
                <Search size={18} />
                Explore Wishes
              </button>

            </div>

            <div className="hero-trust">

              <span>
                <Heart size={15} />
                Meaningful gifting
              </span>

              <span>
                <Users size={15} />
                Together is better
              </span>

              <span>
                <ShieldCheck size={15} />
                Wishes with purpose
              </span>

            </div>

          </div>

          {/* HERO ILLUSTRATION */}

          <div className="hero-visual">

            <div className="hero-circle"></div>

            <div className="floating-card floating-top">
              <span>✨</span>

              <div>
                <strong>A little kindness</strong>
                <small>Can fulfil a big dream</small>
              </div>

            </div>

            <div className="gift-illustration">

              <div className="gift-glow"></div>

              <div className="gift-box">
                <div className="gift-ribbon-vertical"></div>
                <div className="gift-ribbon-horizontal"></div>
                <div className="gift-bow">🎀</div>
              </div>

              <div className="gift-caption">
                Made with
                <Heart size={14} fill="currentColor" />
                love
              </div>

            </div>

            <div className="floating-card floating-bottom">

              <span>💛</span>

              <div>
                <strong>Dreams come true</strong>
                <small>One contribution at a time</small>
              </div>

            </div>

          </div>

        </section>

        {/* CATEGORIES */}

        <section className="categories">

          <div className="section-heading">
            <span>EXPLORE POSSIBILITIES</span>
            <h2>Every wish has a story.</h2>
          </div>

          <div className="category-grid">

            <a
              href="#wishes"
              className="category-card"
              onClick={() => setSelectedCategory('Birthday')}
            >
              <span>🎂</span>
              <strong>Birthdays</strong>
              <small>Make celebrations special</small>
            </a>

            <a
              href="#wishes"
              className="category-card"
              onClick={() => setSelectedCategory('Education')}
            >
              <span>🎓</span>
              <strong>Education</strong>
              <small>Support learning dreams</small>
            </a>

            <a
              href="#wishes"
              className="category-card"
              onClick={() => setSelectedCategory('Personal Wish')}
            >
              <span>💝</span>
              <strong>Personal Wishes</strong>
              <small>Make little dreams happen</small>
            </a>

            <a
              href="#wishes"
              className="category-card"
              onClick={() => setSelectedCategory('Celebrations')}
            >
              <span>🎉</span>
              <strong>Celebrations</strong>
              <small>Share joyful moments</small>
            </a>

          </div>

        </section>

        {/* EXPLORE WISHES */}

        <section className="wishes-section" id="wishes">

          <div className="wishes-heading">

            <div className="section-heading">

              <span>WISHES WAITING TO BE FULFILLED</span>

              <h2>Someone's dream. Your kindness.</h2>

              <p>
                Discover wishes and become part of someone's happy story.
              </p>

            </div>

            <button className="text-btn" onClick={clearFilters}>
              Explore all wishes
              <ArrowRight size={17} />
            </button>

          </div>

          {/* SEARCH BAR */}

          <div className="wish-filters">

            <div className="wish-search">

              <Search size={19} />

              <input
                type="text"
                placeholder="Search wishes, people or dreams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {searchTerm && (
                <button onClick={() => setSearchTerm('')}>
                  Clear
                </button>
              )}

            </div>

            {/* CATEGORY FILTERS */}

            <div className="filter-buttons">

              {categories.map((category) => (

                <button
                  key={category}
                  className={
                    selectedCategory === category ? 'active' : ''
                  }
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>

              ))}

            </div>

            <p className="results-count">
              Showing {filteredWishes.length}{' '}
              {filteredWishes.length === 1 ? 'wish' : 'wishes'}
            </p>

          </div>

          {/* WISH CARDS */}

          <div className="wish-grid">

            {filteredWishes.map((wish) => {

              const percentage = Math.min(
                (Number(wish.collected || 0) /
                  Number(wish.targetAmount || 1)) * 100,
                100
              )

              const emoji =
                wish.emoji ||
                (wish.category === 'Education'
                  ? '🎓'
                  : wish.category === 'Birthday'
                    ? '🎂'
                    : '💝')

              const isLiked = Boolean(wishLikes[wish.id]?.liked)

              const likeCount = Number(
                wishLikes[wish.id]?.count || 0
              )

              return (

                <article className="wish-card" key={wish.id}>

                  <div className="wish-image">

                    <span className="wish-emoji">
                      {emoji}
                    </span>

                    <span className="wish-category">
                      {wish.category}
                    </span>

                    {/* FULFILLED STATUS */}

                    {wish.fulfilled && (
                      <span className="wish-fulfilled-badge">
                        <CheckCircle size={13} />
                        Fulfilled
                      </span>
                    )}

                    {/* LIKE BUTTON */}

                    <button
                      className={`wish-heart ${isLiked ? 'liked' : ''}`}
                      aria-label={
                        isLiked ? 'Unlike wish' : 'Like wish'
                      }
                      aria-pressed={isLiked}
                      onClick={() => handleToggleLike(wish.id)}
                    >

                      <Heart
                        size={19}
                        fill={isLiked ? 'currentColor' : 'none'}
                      />

                      <span>{likeCount}</span>

                    </button>

                  </div>

                  <div className="wish-body">

                    <small className="wish-owner">
                      {wish.name || 'GIFTORA member'}
                    </small>

                    <h3>{wish.title}</h3>

                    <p>{wish.description}</p>

                    <div className="wish-progress-info">

                      <strong>
                        ₹{formatCurrency(wish.collected)}
                      </strong>

                      <span>
                        of ₹{formatCurrency(wish.targetAmount)}
                      </span>

                    </div>

                    <div className="progress-track">

                      <div
                        className="progress-fill"
                        style={{ width: `${percentage}%` }}
                      />

                    </div>

                    <div className="wish-footer">

                      <span>
                        <Users size={15} />
                        {wish.contributors || 0} supporters
                      </span>

                      <button
                        onClick={() => setSelectedWishId(wish.id)}
                      >
                        View Wish
                        <ArrowRight size={15} />
                      </button>

                    </div>

                  </div>

                </article>

              )

            })}

          </div>

          {/* NO RESULTS */}

          {filteredWishes.length === 0 && (

            <div className="no-wishes">

              <span>🔍</span>
              <h3>No wishes found</h3>
              <p>Try another search or category.</p>

              <button onClick={clearFilters}>
                Clear Filters
              </button>

            </div>

          )}

        </section>

        {/* HOW IT WORKS */}

        <section className="how-section" id="how-it-works">

          <div className="section-heading">
            <span>SIMPLE. MEANINGFUL. TOGETHER.</span>
            <h2>Three steps. One beautiful feeling.</h2>
          </div>

          <div className="steps-grid">

            <div className="step-card">
              <span className="step-number">01</span>
              <Gift size={28} />
              <h3>Share your wish</h3>
              <p>
                Tell the world what you genuinely want or need.
              </p>
            </div>

            <div className="step-card">
              <span className="step-number">02</span>
              <Heart size={28} />
              <h3>People come together</h3>
              <p>
                Friends and family contribute or gift directly.
              </p>
            </div>

            <div className="step-card">
              <span className="step-number">03</span>
              <Sparkles size={28} />
              <h3>Fulfil the wish</h3>
              <p>
                Turn a shared wish into a beautiful reality.
              </p>
            </div>

          </div>

        </section>

        {/* CREATE WISH CTA */}

        <section className="create-section" id="create">

          <div>
            <span>YOUR WISH DESERVES A CHANCE</span>

            <h2>
              What's something you've always wished for?
            </h2>

            <p>
              It could be closer to reality than you think.
            </p>
          </div>

          <button
            className="primary-btn"
            onClick={openCreateWish}
          >
            Create Your First Wish
            <ArrowRight size={18} />
          </button>

        </section>

      </main>

      {/* FOOTER */}

      <footer className="footer">

        <a href="#home" className="brand">

          <span className="brand-icon">
            <Gift size={21} />
          </span>

          GIFTORA<span className="brand-dot">.</span>

        </a>

        <p>Don't guess the gift. Fulfil the wish.</p>

        <span className="footer-copy">
          © 2026 GIFTORA. Made with love.
        </span>

      </footer>

      {/* CREATE WISH MODAL */}

      {showCreateWish && (

        <CreateWish
          onClose={() => setShowCreateWish(false)}
          onCreate={handleCreateWish}
        />

      )}

      {/* WISH DETAILS MODAL */}

      {selectedWishId !== null && (

        <WishDetails
          wish={allWishes.find(
            (wish) => wish.id === selectedWishId
          )}
          onClose={() => setSelectedWishId(null)}
          onContribute={handleContribute}
          onDirectGift={handleDirectGift}
        />

      )}

    </div>
  )
}

export default App
