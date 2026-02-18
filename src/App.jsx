import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { TopNav } from '@/components/layout/TopNav'
import { HomePage } from '@/components/pages/HomePage'
import { BooksHub } from '@/components/library/BooksHub'
import { RegistrationPage } from '@/components/auth/RegistrationPage'
import { LoginPage } from '@/components/auth/LoginPage'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/library/*" element={<BooksHub />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/login" element={<LoginPage />} />
      
      {/* Placeholder routes */}
      <Route path="/games" element={<div className="p-6"><h1 className="text-2xl">Games Coming Soon</h1></div>} />
      <Route path="/events" element={<div className="p-6"><h1 className="text-2xl">Events Coming Soon</h1></div>} />
      <Route path="/contacts" element={<div className="p-6"><h1 className="text-2xl">Contacts Coming Soon</h1></div>} />
      <Route path="/book-club-register" element={<div className="p-6"><h1 className="text-2xl">Book Club Registration Coming Soon</h1></div>} />
      <Route path="/author-register" element={<div className="p-6"><h1 className="text-2xl">Author Registration Coming Soon</h1></div>} />
    </Routes>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <TopNav />
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
