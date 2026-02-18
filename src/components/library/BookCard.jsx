import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useUserAccess } from '@/hooks/useUserAccess'
import { RedemptionForm } from './RedemptionForm'
import { Download, Lock } from 'lucide-react'

export const BookCard = ({ book, isCoded }) => {
  const { user } = useAuth()
  const { checkAccess, grantAccess } = useUserAccess()
  const [showRedemption, setShowRedemption] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)
  const [checking, setChecking] = useState(isCoded)

  // Check access on mount for coded books
  useEffect(() => {
    const checkUserAccess = async () => {
      if (isCoded && user?.id && book?.id) {
        const access = await checkAccess(user.id, book.id)
        setHasAccess(access)
        setChecking(false)
      }
    }
    checkUserAccess()
  }, [isCoded, user, book, checkAccess])

  const handleDownload = async () => {
    if (!isCoded) {
      // Free book - grant access and download
      if (user?.id && book?.id && !hasAccess) {
        await grantAccess(user.id, book.id, 'FREE')
        setHasAccess(true)
      }
      initiateDownload()
      return
    }

    // Coded book - check access or show redemption
    if (hasAccess) {
      initiateDownload()
    } else {
      setShowRedemption(true)
    }
  }

  const initiateDownload = async () => {
    setIsDownloading(true)
    try {
      // In a real app, call your backend to generate a signed download URL
      // For now, we'll just use the pdf_url directly
      if (book.pdf_url) {
        window.open(book.pdf_url, '_blank')
      } else {
        alert('Download link not available')
      }
    } catch (err) {
      console.error('Download error:', err)
      alert('Failed to download book')
    } finally {
      setIsDownloading(false)
    }
  }

  const handleRedemptionSuccess = () => {
    setShowRedemption(false)
    setHasAccess(true)
    // Auto-download after successful redemption
    initiateDownload()
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      {/* Cover Image */}
      <div className="h-40 bg-gray-200 overflow-hidden relative">
        {book.cover_url ? (
          <img
            src={book.cover_url}
            alt={book.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm">
            📚 No Cover
          </div>
        )}
        {isCoded && !hasAccess && (
          <div className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded">
            <Lock size={16} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-lg truncate">{book.title}</h3>
        <p className="text-sm text-gray-600 mb-2 truncate">{book.author}</p>
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{book.description || 'No description'}</p>

        {/* File Size */}
        <p className="text-xs text-gray-500 mb-3">
          📦 {book.file_size_mb || '?'} MB
        </p>

        {/* Badge */}
        <div className="mb-3">
          {isCoded ? (
            <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded font-medium">
              🔐 Premium
            </span>
          ) : (
            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-medium">
              ✓ Free
            </span>
          )}
        </div>

        {/* Redemption Form (if showing) */}
        {showRedemption && (
          <RedemptionForm
            bookId={book.id}
            onSuccess={handleRedemptionSuccess}
            onCancel={() => setShowRedemption(false)}
          />
        )}

        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={isDownloading || checking}
          className="mt-auto w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 transition font-medium flex items-center justify-center gap-2"
        >
          <Download size={16} />
          {isDownloading ? 'Downloading...' : isCoded ? (hasAccess ? 'Download' : 'Unlock & Download') : 'Download'}
        </button>
      </div>
    </div>
  )
}
