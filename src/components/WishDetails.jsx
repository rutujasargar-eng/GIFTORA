
import { useState } from 'react'

import {
  X,
  Heart,
  Users,
  Gift,
  ArrowLeft,
  IndianRupee,
  Sparkles,
  Share2,
  Copy,
  MessageCircle,
  CheckCircle,
} from 'lucide-react'

import toast from 'react-hot-toast'

function WishDetails({
  wish,
  onClose,
  onContribute,
  onDirectGift,
}) {
  const [selectedAmount, setSelectedAmount] = useState(200)
  const [customAmount, setCustomAmount] = useState('')
  const [useCustom, setUseCustom] = useState(false)
  const [showGiftConfirmation, setShowGiftConfirmation] =
    useState(false)

  const percentage = Math.min(
    (Number(wish.collected || 0) /
      Number(wish.targetAmount || 1)) * 100,
    100
  )

  const money = (value) =>
    Number(value || 0).toLocaleString('en-IN')

  const isFulfilled = Boolean(wish.fulfilled)

  // GENERATE WISH LINK
  const getWishLink = () => {
    const url = new URL(window.location.href)
    url.searchParams.set('wish', String(wish.id))
    return url.toString()
  }

  // COPY WISH LINK
  const handleCopyLink = async () => {
    const link = getWishLink()

    try {
      await navigator.clipboard.writeText(link)
      toast.success('Wish link copied!')
    } catch {
      toast.error('Unable to copy. Please try another sharing option.')
    }
  }

  // WHATSAPP SHARE
  const handleWhatsAppShare = () => {
    const link = getWishLink()

    const message =
      `Check out this wish on GIFTORA! 💛\n\n` +
      `${wish.title}\n` +
      `Help make this wish come true.\n\n` +
      `${link}`

    const whatsappURL =
      `https://wa.me/?text=${encodeURIComponent(message)}`

    window.open(whatsappURL, '_blank', 'noopener,noreferrer')
  }

  // NATIVE SHARE
  const handleNativeShare = async () => {
    const link = getWishLink()

    const shareData = {
      title: `${wish.title} | GIFTORA`,
      text: 'Help make this wish come true on GIFTORA! 💛',
      url: link,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        if (error.name !== 'AbortError') {
          toast.error('Unable to share this wish.')
        }
      }
    } else {
      handleCopyLink()
    }
  }

  // CONTRIBUTION
  const handleContribution = () => {
    const amount = useCustom
      ? Number(customAmount)
      : selectedAmount

    if (!Number.isFinite(amount) || amount < 1) {
      toast.error('Please enter a valid amount.')
      return
    }

    if (amount > 1000000) {
      toast.error('Maximum contribution is ₹10,00,000.')
      return
    }

    if (isFulfilled) {
      toast.error('This wish has already been fulfilled.')
      return
    }

    onContribute(wish.id, amount)
  }

  // CONFIRM DIRECT GIFT
  const handleDirectGift = () => {
    if (isFulfilled) {
      toast.error('This wish has already been fulfilled.')
      return
    }

    if (typeof onDirectGift !== 'function') {
      toast.error('Direct gifting setup is not connected yet.')
      return
    }

    onDirectGift(wish.id)
    setShowGiftConfirmation(false)
  }

  return (
    <div className="details-overlay" onClick={onClose}>

      <div
        className="details-modal"
        onClick={(e) => e.stopPropagation()}
      >

        <button
          className="details-close"
          onClick={onClose}
          aria-label="Close details"
        >
          <X />
        </button>

        <button className="back-link" onClick={onClose}>
          <ArrowLeft size={16} />
          Back to wishes
        </button>

        <div className="details-content">

          {/* WISH INFORMATION */}

          <div className="details-main">

            <div className="details-image">
              {wish.emoji || '🎁'}
            </div>

            <span className="details-category">
              {wish.category}
            </span>

            <h2>{wish.title}</h2>

            <p className="details-owner">
              Wish shared by {wish.name || 'GIFTORA member'}
            </p>

            <div className="details-description">
              <h3>Why this wish matters</h3>
              <p>{wish.description}</p>
            </div>

            <div className="details-supporters">
              <Users size={19} />
              <span>
                {wish.contributors || 0} people have supported this wish
              </span>
            </div>

            {/* SHARE WISH */}

            <div className="wish-share-section">

              <h3>
                <Share2 size={18} />
                Share this wish
              </h3>

              <p>
                Help spread the word and bring this wish closer to reality.
              </p>

              <div className="wish-share-buttons">

                <button
                  className="share-option copy-share"
                  onClick={handleCopyLink}
                >
                  <Copy size={17} />
                  Copy Link
                </button>

                <button
                  className="share-option whatsapp-share"
                  onClick={handleWhatsAppShare}
                >
                  <MessageCircle size={17} />
                  WhatsApp
                </button>

                <button
                  className="share-option native-share"
                  onClick={handleNativeShare}
                >
                  <Share2 size={17} />
                  More
                </button>

              </div>
            </div>

          </div>

          {/* CONTRIBUTION AND DIRECT GIFT PANEL */}

          <div className="contribution-panel">

            <span className="panel-eyebrow">
              BE PART OF THIS STORY
            </span>

            {isFulfilled ? (

              <div className="fulfilled-message">

                <CheckCircle size={38} />

                <h3>This wish has been fulfilled!</h3>

                <p>
                  Someone made this dream come true.
                  Thank you for being part of the GIFTORA community.
                </p>

              </div>

            ) : (

              <>

                <h3>Help fulfil this wish</h3>

                <div className="details-amounts">
                  <strong>
                    ₹{money(wish.collected)}
                  </strong>

                  <span>
                    raised of ₹{money(wish.targetAmount)}
                  </span>
                </div>

                <div className="details-progress">
                  <div
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <p className="details-percentage">
                  {percentage.toFixed(0)}% of the goal reached
                </p>

                {/* DIRECT GIFT */}

                <div className="direct-gift-section">

                  <span className="direct-gift-label">
                    WANT TO MAKE THE WHOLE DREAM COME TRUE?
                  </span>

                  <button
                    className="direct-gift-btn"
                    onClick={() => setShowGiftConfirmation(true)}
                  >
                    <Gift size={19} />
                    I'll Gift This Entire Wish
                  </button>

                  <p>
                    Choose to fulfil this wish directly instead
                    of making a smaller contribution.
                  </p>

                </div>

                <div className="contribution-divider">
                  <span>OR CONTRIBUTE A SMALLER AMOUNT</span>
                </div>

                <label className="contribution-label">
                  Choose your contribution
                </label>

                <div className="contribution-options">

                  {[100, 200, 500, 1000].map((amount) => (

                    <button
                      key={amount}
                      type="button"
                      className={
                        !useCustom && selectedAmount === amount
                          ? 'amount-option active'
                          : 'amount-option'
                      }
                      onClick={() => {
                        setSelectedAmount(amount)
                        setUseCustom(false)
                      }}
                    >
                      ₹{money(amount)}
                    </button>

                  ))}

                </div>

                <button
                  type="button"
                  className={
                    useCustom
                      ? 'custom-amount-toggle active'
                      : 'custom-amount-toggle'
                  }
                  onClick={() => setUseCustom(true)}
                >
                  Enter a custom amount
                </button>

                {useCustom && (

                  <div className="custom-amount-input">

                    <IndianRupee size={18} />

                    <input
                      type="number"
                      min="1"
                      max="1000000"
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={(e) =>
                        setCustomAmount(e.target.value)
                      }
                    />

                  </div>

                )}

                <button
                  className="contribute-btn"
                  onClick={handleContribution}
                >
                  <Heart size={18} />

                  Contribute ₹
                  {money(
                    useCustom
                      ? Number(customAmount || 0)
                      : selectedAmount
                  )}
                </button>

                <div className="contribution-note">
                  <Sparkles size={16} />
                  Every contribution makes a difference.
                </div>

                <p className="simulation-note">
                  Demo only. Contributions and direct gifting
                  are simulated. No real payment or purchase
                  will be made.
                </p>

              </>

            )}

          </div>

        </div>

        {/* DIRECT GIFT CONFIRMATION */}

        {showGiftConfirmation && (

          <div
            className="gift-confirm-overlay"
            onClick={() => setShowGiftConfirmation(false)}
          >

            <div
              className="gift-confirm-modal"
              onClick={(e) => e.stopPropagation()}
            >

              <button
                className="gift-confirm-close"
                onClick={() => setShowGiftConfirmation(false)}
                aria-label="Close confirmation"
              >
                <X size={20} />
              </button>

              <div className="gift-confirm-icon">
                <Gift size={32} />
              </div>

              <h3>Make this dream come true?</h3>

              <p>
                You're choosing to fulfil:
              </p>

              <strong className="gift-confirm-title">
                {wish.title}
              </strong>

              <div className="gift-confirm-amount">
                ₹{money(wish.targetAmount)}
              </div>

              <p className="gift-confirm-note">
                This is a demo action. No money will be
                collected and no actual item will be purchased.
              </p>

              <button
                className="gift-confirm-yes"
                onClick={handleDirectGift}
              >
                <Heart size={17} />
                Yes, fulfil this wish
              </button>

              <button
                className="gift-confirm-cancel"
                onClick={() => setShowGiftConfirmation(false)}
              >
                Maybe later
              </button>

            </div>

          </div>

        )}

      </div>

    </div>
  )
}

export default WishDetails
