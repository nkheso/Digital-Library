import { Wifi, WifiOff } from 'lucide-react'

export const LibraryHeader = ({
  isOnline,
  isSyncing,
  filters,
  onFilterChange,
  totalSize,
  offlineCount,
  totalCount,
}) => {
  return (
    <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10 shadow-sm">
      {/* Sync Status */}
      <div className="mb-3 text-sm">
        {isSyncing && (
          <div className="flex items-center gap-2 text-blue-600 font-medium">
            <div className="animate-spin">⟳</div>
            <span>Syncing...</span>
          </div>
        )}
        {!isOnline && (
          <div className="flex items-center gap-2 text-orange-600 font-medium">
            <WifiOff size={16} />
            <span>Offline Mode - {offlineCount}/{totalCount} books available</span>
          </div>
        )}
        {isOnline && !isSyncing && (
          <div className="flex items-center gap-2 text-green-600 text-xs">
            <Wifi size={16} />
            <span>Online</span>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => onFilterChange({ ...filters, showDownloadedOnly: false })}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            !filters.showDownloadedOnly
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Books
        </button>
        <button
          onClick={() => onFilterChange({ ...filters, showDownloadedOnly: true })}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            filters.showDownloadedOnly
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Downloaded ({offlineCount})
        </button>
      </div>

      {/* Storage Status */}
      <div className="text-xs text-gray-600 mb-2">
        Using {(totalSize / 1024 / 1024).toFixed(0)}MB of storage
      </div>

      {/* Sort Dropdown */}
      <select
        value={filters.sortBy}
        onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
        className="w-full p-2 border border-gray-300 rounded text-sm"
      >
        <option value="date_added">Recently Added</option>
        <option value="title">Title (A-Z)</option>
        <option value="author">Author (A-Z)</option>
        <option value="file_size">File Size</option>
      </select>
    </div>
  )
}
