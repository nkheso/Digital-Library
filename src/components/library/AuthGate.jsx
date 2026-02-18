import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export const AuthGate = ({ children, bookType = 'free' }) => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      const returnPath = `/library/${bookType}`
      navigate(`/register?redirect=${encodeURIComponent(returnPath)}`, { replace: true })
    }
  }, [user, loading, navigate, bookType])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect above
  }

  return children
}
