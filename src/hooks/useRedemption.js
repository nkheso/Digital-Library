import { supabase } from '@/services/supabaseClient'

export const useRedemption = () => {
  const redeemCode = async (userId, bookId, code) => {
    if (!userId || !bookId || !code) {
      return { success: false, error: 'Missing required parameters' }
    }

    try {
      const { data, error } = await supabase.rpc('redeem_book_code', {
        p_user_id: userId,
        p_book_id: bookId,
        p_code: code.toUpperCase(),
      })

      if (error) throw error

      return { success: data?.success || false, message: data?.message || 'Redemption failed' }
    } catch (err) {
      console.error('Redemption error:', err)
      return { success: false, error: err.message }
    }
  }

  return { redeemCode }
}
