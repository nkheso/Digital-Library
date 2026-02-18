import { openDB } from 'idb'

const DB_NAME = 'digital-library'
const DB_VERSION = 1

export const localDB = {
  async init() {
    return openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Books metadata
        if (!db.objectStoreNames.contains('books')) {
          const booksStore = db.createObjectStore('books', { keyPath: 'id' })
          booksStore.createIndex('updated_at', 'updated_at')
        }

        // User library (with sync tracking)
        if (!db.objectStoreNames.contains('user_library')) {
          const libStore = db.createObjectStore('user_library', { keyPath: 'id' })
          libStore.createIndex('user_id', 'user_id')
          libStore.createIndex('sync_status', 'sync_status')
        }

        // PDF blobs (chunked for large files)
        if (!db.objectStoreNames.contains('pdfs')) {
          db.createObjectStore('pdfs', { keyPath: ['book_id', 'chunk'] })
        }

        // Sync queue (for mutations)
        if (!db.objectStoreNames.contains('sync_queue')) {
          db.createObjectStore('sync_queue', { keyPath: 'id', autoIncrement: true })
        }
      },
    })
  },

  async saveLibrary(userId, books) {
    const db = await this.init()
    for (const book of books) {
      await db.put('user_library', {
        ...book,
        cached_at: Date.now(),
      })
    }
  },

  async getLibrary(userId) {
    const db = await this.init()
    const index = db.transaction('user_library').store.index('user_id')
    return await index.getAll(userId)
  },

  async savePDFChunk(bookId, chunk, data) {
    const db = await this.init()
    await db.put('pdfs', {
      book_id: bookId,
      chunk,
      data,
      sync_status: 'downloaded',
      saved_at: Date.now(),
    })
  },

  async getPDFSize(bookId) {
    const db = await this.init()
    const tx = db.transaction('pdfs')
    const allChunks = await tx.store.getAll(IDBKeyRange.bound([bookId, 0], [bookId, Infinity], false, false))
    return allChunks.reduce((sum, chunk) => sum + chunk.data.size, 0)
  },

  async queueSync(operation) {
    const db = await this.init()
    await db.add('sync_queue', {
      ...operation,
      queued_at: Date.now(),
      status: 'pending',
    })
  },

  async getPendingSyncs() {
    const db = await this.init()
    return await db.getAll('sync_queue')
  },

  async removeSyncedItem(id) {
    const db = await this.init()
    await db.delete('sync_queue', id)
  },
}
