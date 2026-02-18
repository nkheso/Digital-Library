import { BookCard } from './BookCard'

export const BooksList = ({ books, isLoading, isCoded }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading books...</p>
        </div>
      </div>
    )
  }

  if (!books || books.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-2xl mb-2">📭</p>
          <p className="text-gray-600">No {isCoded ? 'premium' : 'free'} books available yet</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} isCoded={isCoded} />
      ))}
    </div>
  )
}
