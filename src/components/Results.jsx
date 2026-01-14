import { useState, useRef, useEffect } from 'react'
import { copyUrl, copyText, shareOnTwitter, shareOnFacebook } from '../utils/shareResult'

export default function Results({ 
  resultCategory, 
  quizConfig, 
  onRestart,
  primaryColor = '#000000',
  backgroundColor = '#FFFFFF'
}) {
  const [shareResultTooltip, setShareResultTooltip] = useState('Share result')
  const [copyTextTooltip, setCopyTextTooltip] = useState('Copy text')
  const copyButtonRef = useRef(null)

  const result = quizConfig?.results?.[resultCategory]
  const quizTitle = quizConfig?.title || 'Quiz'
  const quizId = quizConfig?.id || ''

  useEffect(() => {
    const button = copyButtonRef.current
    if (!button) return

    const maintainBorder = () => {
      button.style.border = `1.5px solid ${primaryColor}`
    }

    button.addEventListener('focus', maintainBorder)
    button.addEventListener('blur', maintainBorder)
    button.addEventListener('mousedown', maintainBorder)
    button.addEventListener('mouseup', maintainBorder)
    button.addEventListener('click', maintainBorder)

    return () => {
      button.removeEventListener('focus', maintainBorder)
      button.removeEventListener('blur', maintainBorder)
      button.removeEventListener('mousedown', maintainBorder)
      button.removeEventListener('mouseup', maintainBorder)
      button.removeEventListener('click', maintainBorder)
    }
  }, [primaryColor])

  const handleShareResult = async () => {
    const success = await copyUrl(quizId)
    if (success) {
      setShareResultTooltip('URL copied!')
      setTimeout(() => setShareResultTooltip('Share result'), 2000)
    }
  }

  const handleTwitterShare = () => {
    shareOnTwitter(result?.title || '', quizTitle, quizId)
  }

  const handleFacebookShare = () => {
    shareOnFacebook(quizId)
  }

  const handleCopyText = async () => {
    const success = await copyText(result?.title || '', result?.description || '')
    if (success) {
      setCopyTextTooltip('Text copied!')
      setTimeout(() => setCopyTextTooltip('Copy text'), 2000)
    }
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 py-16"
      style={{ backgroundColor }}
    >
      <div className="max-w-2xl mx-auto w-full text-center">
        <div 
          className="mb-8 animate-fade-in"
          style={{ animation: 'fadeIn 0.6s ease-in' }}
        >
          <h1 
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: primaryColor }}
          >
            Your Result: {result?.title || 'Unknown'}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            {result?.description || 'No description available.'}
          </p>
        </div>

        <button
          onClick={onRestart}
          className="flex items-center gap-2 text-base font-medium transition-opacity hover:opacity-70 focus:outline-none mx-auto mb-8"
          style={{
            color: primaryColor,
            backgroundColor: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
          }}
          aria-label="Retake quiz"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
            <path d="M21 3v5h-5"></path>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
            <path d="M3 21v-5h5"></path>
          </svg>
          <span>Retake Quiz</span>
        </button>

        <div className="flex flex-col gap-6 justify-center items-center mt-8">
          <div className="flex flex-col gap-3 justify-center items-center">
            <h2 
              className="text-xl md:text-2xl font-semibold"
              style={{ color: primaryColor }}
            >
              Share Your Result!
            </h2>
            <div className="flex flex-wrap gap-4 justify-center items-center">
              <div className="relative group">
                <button
                  onClick={handleShareResult}
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    transition-all focus:outline-none
                    hover:opacity-90 hover:shadow-md
                    min-h-[48px] min-w-[48px]
                  `}
                  style={{
                    backgroundColor: primaryColor,
                    color: backgroundColor,
                  }}
                  aria-label="Share result"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 rounded text-sm text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg" style={{ backgroundColor: '#333' }}>
                  {shareResultTooltip}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2" style={{ borderTop: '6px solid #333', borderLeft: '6px solid transparent', borderRight: '6px solid transparent' }}></div>
                </div>
              </div>

              <div className="relative group">
                <button
                  onClick={handleTwitterShare}
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    transition-all focus:outline-none
                    hover:opacity-90 hover:shadow-md
                    min-h-[48px] min-w-[48px]
                  `}
                  style={{
                    backgroundColor: '#1DA1F2',
                    color: '#FFFFFF',
                  }}
                  aria-label="Share on Twitter"
                >
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 rounded text-sm text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg" style={{ backgroundColor: '#333' }}>
                  Twitter
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2" style={{ borderTop: '6px solid #333', borderLeft: '6px solid transparent', borderRight: '6px solid transparent' }}></div>
                </div>
              </div>

              <div className="relative group">
                <button
                  onClick={handleFacebookShare}
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    transition-all focus:outline-none
                    hover:opacity-90 hover:shadow-md
                    min-h-[48px] min-w-[48px]
                  `}
                  style={{
                    backgroundColor: '#1877F2',
                    color: '#FFFFFF',
                  }}
                  aria-label="Share on Facebook"
                >
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 rounded text-sm text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg" style={{ backgroundColor: '#333' }}>
                  Facebook
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2" style={{ borderTop: '6px solid #333', borderLeft: '6px solid transparent', borderRight: '6px solid transparent' }}></div>
                </div>
              </div>

              <div className="relative group">
                <button
                  ref={copyButtonRef}
                  onClick={handleCopyText}
                  className="copy-text-button"
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                    outline: 'none',
                    minHeight: '48px',
                    minWidth: '48px',
                    borderColor: primaryColor,
                    borderWidth: '1.5px',
                    borderStyle: 'solid',
                    color: primaryColor,
                    backgroundColor: backgroundColor,
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.border = `1.5px solid ${primaryColor}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.border = `1.5px solid ${primaryColor}`;
                  }}
                  aria-label="Copy text"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 rounded text-sm text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg" style={{ backgroundColor: '#333' }}>
                  {copyTextTooltip}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2" style={{ borderTop: '6px solid #333', borderLeft: '6px solid transparent', borderRight: '6px solid transparent' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-in;
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
