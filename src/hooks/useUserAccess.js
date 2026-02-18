import { supabase } from '@/services/supabaseClient'

export const useUserAccess = () => {
  const checkAccess = async (userId, bookId) => {
    if (!userId || !bookId) return false

    try {
      const { data, error } = await supabase
        .from('user_book_access')
        .select('*')
        .eq('user_id', userId)
        .eq('book_id', bookId)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      return !!data
    } catch (err) {
      console.error('Error checking access:', err)
      return false
    }
  }

  const grantAccess = async (userId, bookId, accessType = 'FREE') => {
    try {
      const { data, error } = await supabase
        .from('user_book_access')
        .insert({
          user_id: userId,
          book_id: bookId,
          access_type: accessType,
        })
        .select()
        .single()

      if (error) {
        if (error.code === '23505') {
          // Unique constraint violation - already has access
          return { success: true, message: 'Already has access' }
        }
        throw error
      }

      return { success: true, data }
    } catch (err) {
      console.error('Error granting access:', err)
      return { success: false, error: err.message }
    }
  }

  return { checkAccess, grantAccess }
}
