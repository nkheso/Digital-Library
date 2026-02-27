// src/components/pages/AboutUsPage.jsx
import { useNavigate } from 'react-router-dom';

export const AboutUsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Import fonts */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,600&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');
        @import url('https://fonts.cdnfonts.com/css/acherus-grotesque');
      `}</style>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-8 py-16">
        
        {/* Digital Library Header - Algerian/Navy Blue */}
        <div className="text-center mb-16">
          <h1 
            className="text-6xl md:text-7xl font-bold"
            style={{ 
              fontFamily: "'Cinzel', serif",
              color: '#502ecc', // Navy blue
              textTransform: 'uppercase',
              letterSpacing: '2px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            DIGITAL LIBRARY
          </h1>
        </div>

        {/* Main Card Container */}
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mb-20">
          
          <div className="grid md:grid-cols-2 relative">
            {/* LEFT SIDE - TEXT */}
            <div className="p-14 flex flex-col justify-center relative z-10">
              <span
                className="text-lg text-gray-500 mb-4 uppercase tracking-wider"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                About us
              </span>

              {/* Cloud/Bubble Shape Container */}
              <div className="relative">
                {/* Bubble shapes background */}
                <div className="absolute -left-20 -top-20 w-64 h-64 bg-blue-100 rounded-full opacity-60 blur-2xl"></div>
                <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-blue-200 rounded-full opacity-60 blur-2xl"></div>
                <div className="absolute left-10 bottom-20 w-48 h-48 bg-purple-100 rounded-full opacity-50 blur-xl"></div>
                <div className="absolute -left-10 bottom-40 w-56 h-56 bg-sky-100 rounded-full opacity-50 blur-xl"></div>
                
                {/* Paragraph inside cloud shape - Blue Italic */}
                <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50">
                  <p
                    className="leading-relaxed text-lg italic"
                    style={{ 
                      fontFamily: "'Georgia', serif",
                      color: '#1E4A8B', // Dark blue
                      fontStyle: 'italic',
                      fontWeight: 400
                    }}
                  >
                    Our Digital Library is designed to provide easy access to a wide range 
                    of digital resources, including eBooks, academic materials, research 
                    articles, learning tools, and the latest released games. It creates a 
                    convenient and user-friendly space where users can explore, discover, 
                    and study anytime and from anywhere. With organized categories and 
                    regularly updated content, the platform supports students and 
                    professionals in achieving their educational and personal goals.
                  </p>
                </div>
              </div>

              {/* Social Media Icons - Replacing Explore Library Button */}
              <div className="mt-10 flex gap-4">
                {/* LinkedIn */}
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition transform hover:scale-110 shadow-md"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>

                {/* Facebook */}
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition transform hover:scale-110 shadow-md"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.99h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.99C18.343 21.128 22 16.991 22 12z"/>
                  </svg>
                </a>

                

                {/* Twitter */}
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition transform hover:scale-110 shadow-md"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.104c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.815-5.903 13.5 13.5 0 001.245-5.178c0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>

                

            
              </div>
            </div>

            {/* RIGHT SIDE - IMAGE */}
            <div className="relative h-[600px] overflow-visible">
              {/* Image with rounded corners */}
              <img
                src="/src/components/assets/digi.jpeg"
                alt="Digital Library"
                className="w-full h-full object-cover rounded-3xl shadow-xl"
                style={{ borderRadius: '30px' }}
              />
              
              {/* Bubble shapes that overlap from left side */}
              <div className="absolute -left-20 top-40 w-80 h-80 bg-blue-300/30 rounded-full blur-3xl"></div>
              <div className="absolute -left-10 bottom-20 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl"></div>
              <div className="absolute left-0 top-60 w-48 h-48 bg-sky-300/30 rounded-full blur-2xl"></div>
              
              {/* Additional floating bubbles */}
              <div className="absolute -right-10 top-20 w-40 h-40 bg-blue-200/40 rounded-full blur-2xl"></div>
              <div className="absolute right-20 bottom-40 w-32 h-32 bg-purple-200/40 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 
              className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Why Choose Us
            </h2>
            <p className="text-lg text-gray-600" style={{ fontFamily: "'Poppins', sans-serif" }}>
              A comprehensive platform for all your digital content needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Books Card */}
            <div className="group relative">
              <div className="relative bg-gray-50 rounded-xl p-5 border border-gray-200 
                            hover:border-blue-400/50 transition-all duration-500 
                            shadow-sm hover:shadow-md transform hover:-translate-y-1">
                <div className="text-3xl mb-2">📚</div>
                <h3 className="text-lg font-bold mb-2 text-blue-600">Extensive Library</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Thousands of digital books across all genres and categories, updated regularly.
                </p>
              </div>
            </div>

            {/* Games Card */}
            <div className="group relative">
              <div className="relative bg-gray-50 rounded-xl p-5 border border-gray-200 
                            hover:border-green-400/50 transition-all duration-500 
                            shadow-sm hover:shadow-md transform hover:-translate-y-1">
                <div className="text-3xl mb-2">🎮</div>
                <h3 className="text-lg font-bold mb-2 text-green-600">Latest Games</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Discover new releases and popular games from talented developers worldwide.
                </p>
              </div>
            </div>

            {/* Creatives Card */}
            <div className="group relative">
              <div className="relative bg-gray-50 rounded-xl p-5 border border-gray-200 
                            hover:border-purple-400/50 transition-all duration-500 
                            shadow-sm hover:shadow-md transform hover:-translate-y-1">
                <div className="text-3xl mb-2">🎨</div>
                <h3 className="text-lg font-bold mb-2 text-purple-600">Creative Community</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Connect with designers, writers, and artists from around the world.
                </p>
              </div>
            </div>

            {/* Events Card */}
            <div className="group relative">
              <div className="relative bg-gray-50 rounded-xl p-5 border border-gray-200 
                            hover:border-red-400/50 transition-all duration-500 
                            shadow-sm hover:shadow-md transform hover:-translate-y-1">
                <div className="text-3xl mb-2">✨</div>
                <h3 className="text-lg font-bold mb-2 text-red-600">Regular Events</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Stay updated on launches, workshops, and creative meetups.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Values Section */}
        <div className="mb-16">
          {/* Values Statement - Two Lines */}
          <div className="max-w-4xl mx-auto text-center mb-8">
            <p className="text-base text-gray-700 leading-relaxed">
              We value <span className="font-semibold text-yellow-600">accessibility</span> by making digital content available to everyone, 
              regardless of location or background. We value <span className="font-semibold text-blue-600">innovation</span> by constantly improving 
              and evolving our platform to better serve our community. We value <span className="font-semibold text-purple-600">quality</span> by 
              curating only the best content and maintaining high standards across all offerings.
            </p><button onClick={() => navigate('/library')} className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full font-semibold hover:from-purple-600 hover:to-blue-600 transition transform hover:-translate-y-1 shadow-md hover:shadow-lg inline-flex items-center gap-2 group text-sm" > <span>Explore Library</span> <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" > <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /> </svg> </button>
          </div>
        </div>
      </div>
    </div>
  );
};