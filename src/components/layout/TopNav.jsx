import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export const TopNav = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <a href="/" className="text-2xl font-bold text-blue-600">
              📚 Library
            </a>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <a href="/" className="text-gray-700 hover:text-blue-600 transition">
              About
            </a>
            <a href="/library" className="text-gray-700 hover:text-blue-600 transition">
              Library
            </a>
            <a href="/games" className="text-gray-700 hover:text-blue-600 transition">
              Games
            </a>
            <a href="/events" className="text-gray-700 hover:text-blue-600 transition">
              Events
            </a>
            <a href="/contacts" className="text-gray-700 hover:text-blue-600 transition">
              Contacts
            </a>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Welcome, <span className="font-semibold">{user.email}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <a
                  href="/login"
                  className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition font-medium"
                >
                  Sign In
                </a>
                <a
                  href="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium"
                >
                  Register
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
