import { FixedSizeList as List } from 'react-window'
import { BookCard } from './BookCard'

export const VirtualLibraryList = ({ books, height, itemCount, isOnline }) => {
  const Row = ({ index, style }) => (
    <div style={style} className="px-4 py-2">
      <BookCard
        book={books[index]}
        onDownload={async (bookId) => {
          console.log('Download initiated for book:', bookId)
          // TODO: Implement actual download logic
        }}
        isOnline={isOnline}
      />
    </div>
  )

  return (
    <List
      height={height}
      itemCount={itemCount}
      itemSize={360}
      width="100%"
      layout="vertical"
    >
      {Row}
    </List>
  )
}
