import { useState, useRef, useEffect } from 'react'
import { copyUrl, copyText, shareOnTwitter, shareOnFacebook, shareOnWhatsApp, downloadResultImage, shareResult } from '../utils/shareResult'
import AdLayout from './ads/AdLayout'

export default function Results({ 
  resultCategory, 
  quizConfig, 
  onRestart,
  accentColor = '#000000',
  backgroundColor = '#FFFFFF'
}) {
  const [shareResultTooltip, setShareResultTooltip] = useState('Share result')
  const [copyTextTooltip, setCopyTextTooltip] = useState('Copy text')
  const [downloadImageTooltip, setDownloadImageTooltip] = useState('Download image')
  const [copyUrlTooltip, setCopyUrlTooltip] = useState('Copy URL')
  const copyButtonRef = useRef(null)
  const copyUrlButtonRef = useRef(null)
  const resultsRef = useRef(null)

  const result = quizConfig?.results?.[resultCategory]
  const quizTitle = quizConfig?.title || 'Quiz'
  const quizId = quizConfig?.id || ''

  useEffect(() => {
    const button = copyButtonRef.current
    if (!button) return

    const maintainBorder = () => {
      button.style.border = `1.5px solid ${accentColor}`
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
  }, [accentColor])

  useEffect(() => {
    const button = copyUrlButtonRef.current
    if (!button) return

    const maintainBorder = () => {
      button.style.border = `1.5px solid ${accentColor}`
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
  }, [accentColor])

  const handleShareResult = async () => {
    const success = await shareResult(result?.title || '', quizTitle, quizId, resultCategory)
    if (success) {
      setShareResultTooltip('Shared!')
      setTimeout(() => setShareResultTooltip('Share result'), 2000)
    }
  }

  const handleTwitterShare = () => {
    shareOnTwitter(result?.title || '', quizTitle, quizId, resultCategory)
  }

  const handleFacebookShare = () => {
    shareOnFacebook(quizId, resultCategory)
  }

  const handleWhatsAppShare = () => {
    shareOnWhatsApp(result?.title || '', quizTitle, quizId, resultCategory)
  }

  const handleCopyText = async () => {
    const success = await copyText(result?.title || '', result?.description || '', quizTitle, quizId, resultCategory)
    if (success) {
      setCopyTextTooltip('Text copied!')
      setTimeout(() => setCopyTextTooltip('Copy text'), 2000)
    }
  }

  const handleDownloadImage = async () => {
    setDownloadImageTooltip('Downloading...')
    const success = await downloadResultImage(
      resultsRef.current,
      quizTitle,
      result?.title || 'Unknown',
      backgroundColor,
      quizId,
      accentColor
    )
    if (success) {
      setDownloadImageTooltip('Downloaded!')
      setTimeout(() => setDownloadImageTooltip('Download image'), 2000)
    } else {
      setDownloadImageTooltip('Download failed')
      setTimeout(() => setDownloadImageTooltip('Download image'), 2000)
    }
  }

  const handleCopyUrl = async () => {
    const success = await copyUrl(quizId, resultCategory)
    if (success) {
      setCopyUrlTooltip('URL copied!')
      setTimeout(() => setCopyUrlTooltip('Copy URL'), 2000)
    }
  }

  return (
    <AdLayout
      showTopBanner={true}
      showBottomBanner={true}
      showSidebars={true}
      showInterstitial={true}
      topBannerFixed={true}
    >
      <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 py-16"
      style={{ backgroundColor }}
    >
      <div className="max-w-2xl mx-auto w-full text-center">
        <div 
          ref={resultsRef}
          className="mb-8 animate-fade-in"
          style={{ animation: 'fadeIn 0.6s ease-in' }}
        >
          <h1 
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: accentColor }}
          >
            Your Result: {result?.title || 'Unknown'}
          </h1>
          <div className="text-lg md:text-xl text-gray-700 leading-relaxed whitespace-pre-line">
            {result?.description || 'No description available.'}
          </div>
        </div>

        <button
          onClick={onRestart}
          className="flex items-center gap-2 text-base font-medium transition-opacity hover:opacity-70 focus:outline-none mx-auto mb-8"
          style={{
            color: accentColor,
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
              style={{ color: accentColor }}
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
                    backgroundColor: accentColor,
                    color: backgroundColor,
                  }}
                  aria-label="Share result"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                    <polyline points="16 6 12 2 8 6"></polyline>
                    <line x1="12" y1="2" x2="12" y2="15"></line>
                  </svg>
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 rounded text-sm text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg" style={{ backgroundColor: '#333' }}>
                  {shareResultTooltip}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2" style={{ borderTop: '6px solid #333', borderLeft: '6px solid transparent', borderRight: '6px solid transparent' }}></div>
                </div>
              </div>

              <div className="relative group">
                <button
                  onClick={handleWhatsAppShare}
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    transition-all focus:outline-none
                    hover:opacity-90 hover:shadow-md
                    min-h-[48px] min-w-[48px]
                  `}
                  style={{
                    backgroundColor: '#25D366',
                    color: '#FFFFFF',
                  }}
                  aria-label="Share on WhatsApp"
                >
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 rounded text-sm text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg" style={{ backgroundColor: '#333' }}>
                  WhatsApp
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
                    backgroundColor: '#000000',
                    color: '#FFFFFF',
                  }}
                  aria-label="Share on X"
                >
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 rounded text-sm text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg" style={{ backgroundColor: '#333' }}>
                  X
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
                    borderColor: accentColor,
                    borderWidth: '1.5px',
                    borderStyle: 'solid',
                    color: accentColor,
                    backgroundColor: backgroundColor,
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.border = `1.5px solid ${accentColor}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.border = `1.5px solid ${accentColor}`;
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

              <div className="relative group">
                <button
                  onClick={handleDownloadImage}
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
                    borderColor: accentColor,
                    borderWidth: '1.5px',
                    borderStyle: 'solid',
                    color: accentColor,
                    backgroundColor: backgroundColor,
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.border = `1.5px solid ${accentColor}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.border = `1.5px solid ${accentColor}`;
                  }}
                  aria-label="Download image"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 rounded text-sm text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg" style={{ backgroundColor: '#333' }}>
                  {downloadImageTooltip}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2" style={{ borderTop: '6px solid #333', borderLeft: '6px solid transparent', borderRight: '6px solid transparent' }}></div>
                </div>
              </div>

              <div className="relative group" style={{ display: 'none' }}>
                <button
                  ref={copyUrlButtonRef}
                  onClick={handleCopyUrl}
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
                    borderColor: accentColor,
                    borderWidth: '1.5px',
                    borderStyle: 'solid',
                    color: accentColor,
                    backgroundColor: backgroundColor,
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.border = `1.5px solid ${accentColor}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.border = `1.5px solid ${accentColor}`;
                  }}
                  aria-label="Copy URL"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 rounded text-sm text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg" style={{ backgroundColor: '#333' }}>
                  {copyUrlTooltip}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2" style={{ borderTop: '6px solid #333', borderLeft: '6px solid transparent', borderRight: '6px solid transparent' }}></div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
    </AdLayout>
  )
}
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
