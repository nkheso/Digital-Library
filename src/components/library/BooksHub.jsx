import { useState } from 'react'
import { BooksList } from './BooksList'
import { useBooks } from '@/hooks/useBooks'
import { AuthGate } from './AuthGate'

export const BooksHub = () => {
  const [selectedType, setSelectedType] = useState(null) // null, 'FREE', 'CODED'
  const { freeBooks, codedBooks, isLoading } = useBooks()

  // Hub view: Choose book type
  if (!selectedType) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-2">📚 Digital Library</h1>
        <p className="text-gray-600 mb-8">Browse books and download instantly</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Free Books Card */}
          <div
            onClick={() => setSelectedType('FREE')}
            className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg cursor-pointer hover:shadow-lg transition-shadow border-2 border-blue-300"
          >
            <h2 className="text-3xl font-bold mb-2">📚 Free Downloads</h2>
            <p className="text-gray-700 mb-4">
              Access our collection of free downloadable books. No restrictions!
            </p>
            <p className="text-lg font-semibold text-blue-700">
              {freeBooks.length} books available
            </p>
          </div>

          {/* Premium Books Card */}
          <div
            onClick={() => setSelectedType('CODED')}
            className="p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg cursor-pointer hover:shadow-lg transition-shadow border-2 border-purple-300"
          >
            <h2 className="text-3xl font-bold mb-2">🔐 Premium Access</h2>
            <p className="text-gray-700 mb-4">
              Unlock exclusive premium books with a receipt code or access key
            </p>
            <p className="text-lg font-semibold text-purple-700">
              {codedBooks.length} books available
            </p>
          </div>
        </div>

        {/* Other Registration Options */}
        <div className="pt-8 border-t">
          <h3 className="text-2xl font-bold mb-6">Other Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/book-club-register"
              className="p-4 bg-orange-50 border-2 border-orange-300 rounded-lg hover:bg-orange-100 transition font-semibold"
            >
              👥 Join Book Club
            </a>
            <a
              href="/author-register"
              className="p-4 bg-green-50 border-2 border-green-300 rounded-lg hover:bg-green-100 transition font-semibold"
            >
              ✍️ Register as Author
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Books list view with auth gate
  const books = selectedType === 'FREE' ? freeBooks : codedBooks
  const isCoded = selectedType === 'CODED'
  const bookType = isCoded ? 'coded' : 'free'

  return (
    <AuthGate bookType={bookType}>
      <div className="max-w-6xl mx-auto p-6">
        <button
          onClick={() => setSelectedType(null)}
          className="mb-6 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition font-medium"
        >
          ← Back to Library
        </button>

        <h1 className="text-3xl font-bold mb-2">
          {isCoded ? '🔐 Premium Books' : '📚 Free Books'}
        </h1>
        <p className="text-gray-600 mb-6">
          {isCoded
            ? 'Access exclusive premium books with a valid receipt code'
            : 'Download any of these books free of charge'}
        </p>

        <BooksList books={books} isLoading={isLoading} isCoded={isCoded} />
      </div>
    </AuthGate>
  )
}
