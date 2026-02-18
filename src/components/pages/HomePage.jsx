export const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome to Digital Library
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          Discover thousands of books. Download instantly. Read anywhere.
        </p>
        <a
          href="/library"
          className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-lg"
        >
          Explore Library →
        </a>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-bold mb-2">Vast Collection</h3>
            <p className="text-gray-600">
              Access thousands of books in various genres and languages
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">Instant Download</h3>
            <p className="text-gray-600">
              Download books instantly and start reading right away
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-xl font-bold mb-2">Secure Access</h3>
            <p className="text-gray-600">
              Premium books with secure receipt code protection
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16 mt-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Reading?</h2>
          <p className="text-lg mb-6">Join thousands of book lovers exploring our collection</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="/register"
              className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-semibold"
            >
              Create Account
            </a>
            <a
              href="/login"
              className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
