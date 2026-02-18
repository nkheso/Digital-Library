import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '@/services/supabaseClient'

export const RegistrationPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const redirectPath = searchParams.get('redirect') || '/library'

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (authError) {
        setError(authError.message)
        return
      }

      // Create user profile (if user_profiles table exists)
      if (authData.user) {
        try {
          await supabase.from('user_profiles').insert({
            id: authData.user.id,
            email: formData.email,
            name: formData.name,
          })
        } catch (profileErr) {
          console.warn('Profile creation failed:', profileErr)
          // Continue anyway
        }
      }

      // Redirect back to original path
      navigate(redirectPath, { replace: true })
    } catch (err) {
      setError(err.message || 'An error occurred during registration')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2">Create Account</h1>
        <p className="text-gray-600 mb-6">Register to access the digital library</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 transition font-medium"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-6 text-center">
          Already have an account?{' '}
          <a
            href={`/login?redirect=${encodeURIComponent(redirectPath)}`}
            className="text-blue-500 hover:underline font-medium"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}
