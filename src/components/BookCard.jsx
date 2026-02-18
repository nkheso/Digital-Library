import { Wifi, WifiOff, Download, CheckCircle, AlertCircle } from 'lucide-react'
import { useState } from 'react'

export const BookCard = ({ book, onDownload, isOnline }) => {
  const [isDownloading, setIsDownloading] = useState(false)

  const getStatusIcon = () => {
    if (isDownloading) {
      return <div className="animate-spin"><Download size={20} /></div>
    }
    if (book.downloaded) {
      return <CheckCircle size={20} className="text-green-500" />
    }
    if (book.sync_status === 'failed') {
      return <AlertCircle size={20} className="text-red-500" />
    }
    return null
  }

  const getStorageInfo = () => {
    if (book.downloaded) {
      return `Saved • ${(book.file_size / 1024 / 1024).toFixed(1)}MB`
    }
    return `${(book.file_size / 1024 / 1024).toFixed(1)}MB`
  }

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      await onDownload(book.id)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="book-card border border-gray-200 rounded-lg p-4 bg-white hover:shadow-lg transition-shadow">
      {/* Cover Image */}
      <div className="relative mb-3">
        <div className="w-full h-48 bg-gray-200 rounded overflow-hidden">
          {book.cover_url ? (
            <img
              src={book.cover_url}
              alt={book.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 text-white text-sm text-center p-2">
              No Cover
            </div>
          )}
        </div>
        <div className="absolute top-2 right-2 p-2 bg-white rounded-full shadow">
          {getStatusIcon()}
        </div>
        <div className="absolute top-2 left-2">
          {isOnline ? (
            <Wifi size={16} className="text-blue-500" />
          ) : (
            <WifiOff size={16} className="text-gray-400" />
          )}
        </div>
      </div>

      {/* Content */}
      <h3 className="font-bold text-sm truncate">{book.title}</h3>
      <p className="text-xs text-gray-600 truncate">{book.author}</p>

      {/* Status Text */}
      <p className="text-xs text-gray-500 mt-2">{getStorageInfo()}</p>

      {/* Actions */}
      <button
        onClick={handleDownload}
        disabled={isDownloading || !isOnline || book.downloaded}
        className="mt-3 w-full py-2 bg-blue-500 text-white rounded text-sm font-medium disabled:bg-gray-300 transition-colors"
      >
        {book.downloaded ? 'Open' : isDownloading ? 'Downloading...' : 'Download'}
      </button>

      {/* Retry Button */}
      {book.sync_status === 'failed' && (
        <button
          className="mt-2 w-full py-2 bg-yellow-500 text-white rounded text-sm font-medium"
          onClick={handleDownload}
        >
          Retry
        </button>
      )}
    </div>
  )
}
