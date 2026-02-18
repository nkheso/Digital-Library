import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/services/supabaseClient'

export const useBooks = () => {
  const { data: freeBooks = [], isLoading: freeLoading } = useQuery({
    queryKey: ['books', 'FREE'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('book_type', 'FREE')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const { data: codedBooks = [], isLoading: codedLoading } = useQuery({
    queryKey: ['books', 'CODED'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('book_type', 'CODED')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    },
    staleTime: 1000 * 60 * 5,
  })

  return {
    freeBooks,
    codedBooks,
    isLoading: freeLoading || codedLoading,
  }
}
