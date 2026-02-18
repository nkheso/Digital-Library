# Digital Library

A mobile-first, offline-first digital library for data-constrained environments. Built with React, Vite, Supabase, and TanStack Query.

## Features

- 📚 Browse and search books with minimal data usage
- 📴 Offline-first architecture with IndexedDB caching
- 🔄 Automatic sync with background service workers
- 📱 Mobile-optimized with virtual scrolling
- ⚡ Battery-aware data sync and rendering
- 🔍 Full-text search with Supabase PostgreSQL
- 💾 Resumable PDF downloads with chunking

## Tech Stack

- **Frontend**: React 18 + Vite
- **State Management**: TanStack Query (React Query)
- **Database**: Supabase PostgreSQL
- **Local Storage**: IndexedDB (via idb library)
- **Styling**: Tailwind CSS
- **Offline**: Service Workers
- **Virtualization**: react-window
- **Icons**: lucide-react

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   cd Digital-Library
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:5173 in your browser

## Project Structure

```
src/
├── components/        # React components
│   ├── BookCard.jsx   # Individual book display
│   ├── LibraryHeader.jsx # Header with filters
│   └── VirtualLibraryList.jsx # Virtualized list
├── hooks/            # Custom React hooks
│   ├── useUserLibrary.js # Fetch user's library
│   └── useOnlineStatus.js # Network status detection
├── lib/              # Utilities and config
│   ├── supabase.js    # Supabase client
│   ├── indexedDB.js   # IndexedDB operations
│   └── queryClient.js # TanStack Query config
├── styles/           # CSS files
├── App.jsx           # Main app component
└── main.jsx          # Entry point
public/
├── sw.js             # Service Worker
└── manifest.json     # PWA manifest
```

## Development

### Build for production:
```bash
npm run build
```

### Preview production build:
```bash
npm run preview
```

### Run linter:
```bash
npm run lint
```

## Configuration

### Supabase Setup

1. Create a new Supabase project
2. Create the following tables:

```sql
-- Books table
CREATE TABLE books (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  cover_url TEXT,
  file_size INTEGER,
  updated_at TIMESTAMP
);

-- User library
CREATE TABLE user_library (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  book_id UUID NOT NULL REFERENCES books(id),
  downloaded BOOLEAN DEFAULT FALSE,
  sync_status TEXT DEFAULT 'pending',
  updated_at TIMESTAMP
);
```

3. Update your `.env.local` with Supabase credentials

## Performance Optimization

- **Virtual Scrolling**: Only renders visible items to reduce memory usage
- **Image Lazy Loading**: Images load when visible via Intersection Observer
- **IndexedDB Caching**: Local cache prevents redundant network requests
- **Service Worker**: Offline support and background sync
- **Debounced Search**: Reduces API calls during typing
- **Battery Awareness**: Reduces animations and sync frequency on low power mode

## Contributing

Contributions are welcome! Please read our contributing guidelines first.

## License

MIT

## Resources

- [TanStack Query Docs](https://tanstack.com/query)
- [Supabase Docs](https://supabase.com/docs)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [IndexedDB Guide](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
