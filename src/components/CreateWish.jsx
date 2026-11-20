
import { useState } from 'react'
import { X, Gift, ImagePlus, IndianRupee, Lock, Globe } from 'lucide-react'

function CreateWish({ onClose, onCreate }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Education',
    targetAmount: '',
    privacy: 'public',
  })

  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (formData.title.trim().length < 5) {
      setError('Please enter a title with at least 5 characters.')
      return
    }

    if (formData.description.trim().length < 15) {
      setError('Please explain your wish in at least 15 characters.')
      return
    }

    if (Number(formData.targetAmount) < 1) {
      setError('Please enter a valid target amount.')
      return
    }

    const newWish = {
      id: Date.now(),
      ...formData,
      targetAmount: Number(formData.targetAmount),
      collected: 0,
      contributors: 0,
      createdAt: new Date().toISOString(),
    }

    onCreate(newWish)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="wish-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <span className="modal-eyebrow">YOUR STORY STARTS HERE</span>
            <h2>Create Your Wish</h2>
            <p>Tell people what you've been wishing for.</p>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close form"
          >
            <X size={21} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">What are you wishing for?</label>
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Example: Help me get my dream laptop"
              maxLength={100}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Tell your story</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Explain what you need and why this wish matters to you..."
              rows={4}
              maxLength={1000}
              required
            />
            <small>{formData.description.length}/1000 characters</small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option>Education</option>
                <option>Birthday</option>
                <option>Personal Wish</option>
                <option>Celebration</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="targetAmount">Target amount (₹)</label>
              <div className="amount-input">
                <IndianRupee size={17} />
                <input
                  id="targetAmount"
                  name="targetAmount"
                  type="number"
                  min="1"
                  max="10000000"
                  value={formData.targetAmount}
                  onChange={handleChange}
                  placeholder="5000"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Who can see your wish?</label>

            <div className="privacy-options">
              <button
                type="button"
                className={`privacy-option ${formData.privacy === 'public' ? 'selected' : ''}`}
                onClick={() => setFormData({ ...formData, privacy: 'public' })}
              >
                <Globe size={19} />
                <span>
                  <strong>Public</strong>
                  <small>Everyone can discover it</small>
                </span>
              </button>

              <button
                type="button"
                className={`privacy-option ${formData.privacy === 'private' ? 'selected' : ''}`}
                onClick={() => setFormData({ ...formData, privacy: 'private' })}
              >
                <Lock size={19} />
                <span>
                  <strong>Private</strong>
                  <small>Share privately with others</small>
                </span>
              </button>
            </div>
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="submit-wish-btn">
            <Gift size={18} />
            Create My Wish
          </button>

          <p className="form-note">
            This is a prototype. Creating a wish does not transfer money.
          </p>
        </form>
      </div>
    </div>
  )
}

export default CreateWish
