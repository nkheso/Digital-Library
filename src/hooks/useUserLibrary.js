import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { localDB } from '@/lib/indexedDB'

export const useUserLibrary = (userId) => {
  return useQuery({
    queryKey: ['userLibrary', userId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('user_library')
          .select(`
            id,
            book_id,
            downloaded,
            sync_status,
            downloaded_at,
            books(id, title, author, cover_url, file_size, updated_at)
          `)
          .eq('user_id', userId)

        if (error) throw error

        // Cache in IndexedDB
        await localDB.saveLibrary(userId, data)
        return data
      } catch (err) {
        console.warn('Offline: Using cached library', err)
        return await localDB.getLibrary(userId)
      }
    },
  })
}
