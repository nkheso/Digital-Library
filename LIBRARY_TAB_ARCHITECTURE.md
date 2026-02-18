# Digital Library - React Web App Architecture
## Library Tab with Access Control & Receipt Code Redemption

---

## 1. TECHNICAL ARCHITECTURE OVERVIEW

### Component Hierarchy

```
App (Main Router)
├── TopNav (About, Library, Games, Events, Contacts)
├── LibraryTab
│   ├── BooksHub (Select book type: Free vs Coded)
│   ├── BooksList
│   │   ├── AuthGate (Redirect if unauthenticated)
│   │   ├── BookCard
│   │   │   └── DownloadModal (includes redemption for coded books)
│   │   └── RedemptionForm (Enter receipt code)
│   ├── RegistrationPage (Auth redirect target)
│   └── BookClubRegistration
```

### Data Flow Diagram

```
User Clicks "Library"
    ↓
BooksHub Component
(Choose: Free Books or Coded/Premium Books)
    ↓
    ├─→ Free Books Path
    │   ├─→ AuthGate Check
    │   │   ├─→ Authenticated? → BooksList (Free Books)
    │   │   └─→ Not Auth? → Redirect to Registration (/register?redirect=/library/free)
    │   └─→ Click "Download" → Instant download (no redemption)
    │
    └─→ Coded Books Path
        ├─→ AuthGate Check
        │   ├─→ Authenticated? → BooksList (Coded Books)
        │   └─→ Not Auth? → Redirect to Registration (/register?redirect=/library/coded)
        └─→ Click "Unlock" 
            ├─→ Check if user has valid code in redemptions table
            ├─→ Show RedemptionForm (if no code)
            ├─→ Validate receipt code against redemptions table
            ├─→ Mark book as unlocked for user
            └─→ Allow download
```

---

## 2. DATABASE SCHEMA (Supabase PostgreSQL)

### Users Table (handled by Supabase Auth, extended with profile)

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  registration_date TIMESTAMP DEFAULT NOW(),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_profiles_email ON user_profiles(email);
```

### Books Table

```sql
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  pdf_url TEXT, -- URL to downloadable PDF (signed URL for security)
  file_size_mb DECIMAL(10, 2),
  
  -- Book type & access control
  book_type VARCHAR(20) NOT NULL CHECK (book_type IN ('FREE', 'CODED', 'PREMIUM')),
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Metadata
  genre TEXT,
  publication_date DATE,
  isbn TEXT,
  
  -- For coded books: minimum requirements
  min_valid_codes_required INTEGER DEFAULT 1,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_books_type ON books(book_type);
CREATE INDEX idx_books_active ON books(is_active);
```

### Receipt Codes / Redemptions Table

```sql
CREATE TABLE receipt_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  
  -- Code validity
  is_redeemed BOOLEAN DEFAULT FALSE,
  redeemed_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  redeemed_at TIMESTAMP,
  
  -- Code expiration
  expires_at TIMESTAMP,
  max_uses INTEGER DEFAULT 1, -- NULL = unlimited
  current_uses INTEGER DEFAULT 0,
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id), -- Admin/creator
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_receipt_codes_code ON receipt_codes(code);
CREATE INDEX idx_receipt_codes_book_id ON receipt_codes(book_id);
CREATE INDEX idx_receipt_codes_redeemed ON receipt_codes(is_redeemed);
CREATE INDEX idx_receipt_codes_expires ON receipt_codes(expires_at);
```

### User Book Access Table (track what books user has access to)

```sql
CREATE TABLE user_book_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  
  -- How they got access
  access_type VARCHAR(20) NOT NULL CHECK (access_type IN ('FREE', 'REDEEMED_CODE', 'PURCHASED')),
  receipt_code_id UUID REFERENCES receipt_codes(id) ON DELETE SET NULL,
  
  -- Download tracking
  download_count INTEGER DEFAULT 0,
  last_downloaded_at TIMESTAMP,
  
  accessed_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Ensure no duplicate access for same user/book
  UNIQUE(user_id, book_id)
);

CREATE INDEX idx_user_book_access_user ON user_book_access(user_id);
CREATE INDEX idx_user_book_access_book ON user_book_access(book_id);
CREATE INDEX idx_user_book_access_type ON user_book_access(access_type);
```

### Book Club Registration Table

```sql
CREATE TABLE book_club_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  registration_date TIMESTAMP DEFAULT NOW(),
  preferred_book_genre TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_book_club_user ON book_club_registrations(user_id);
```

### Authors Registrations Table

```sql
CREATE TABLE author_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  pen_name TEXT NOT NULL,
  bio TEXT,
  website_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_authors_user ON author_registrations(user_id);
CREATE INDEX idx_authors_verified ON author_registrations(verified);
```

---

## 3. SUPABASE POLICIES (Row Level Security)

```sql
-- User Profiles: Users can only view/edit their own
CREATE POLICY "Users can view their own profile"
  ON user_profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Books: Anyone can view active books
CREATE POLICY "Anyone can view active books"
  ON books
  FOR SELECT
  USING (is_active = TRUE);

-- User Book Access: Users can only view their own access
CREATE POLICY "Users can only view their own book access"
  ON user_book_access
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert user book access"
  ON user_book_access
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Receipt Codes: Only admins can view/modify
CREATE POLICY "Admins can manage receipt codes"
  ON receipt_codes
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() AND email LIKE '%@admin%'
    )
  );
```

---

## 4. REACT COMPONENT STRUCTURE

### Component File Structure

```
src/
├── components/
│   ├── layout/
│   │   └── TopNav.jsx
│   ├── library/
│   │   ├── LibraryTab.jsx (Main container)
│   │   ├── BooksHub.jsx (Select book type)
│   │   ├── BooksList.jsx (Display books)
│   │   ├── BookCard.jsx (Individual book)
│   │   ├── AuthGate.jsx (Auth check & redirect)
│   │   ├── RedemptionForm.jsx (Enter receipt code)
│   │   ├── DownloadModal.jsx (Download/unlock dialog)
│   │   ├── BookClubRegistration.jsx
│   │   └── AuthorRegistration.jsx
│   └── auth/
│       ├── RegistrationPage.jsx
│       ├── LoginPage.jsx
│       └── ProtectedRoute.jsx
├── hooks/
│   ├── useAuth.js (Auth context)
│   ├── useBooks.js (Fetch books)
│   ├── useRedemption.js (Redeem codes)
│   └── useUserAccess.js (Check book access)
├── services/
│   ├── supabaseClient.js
│   ├── bookService.js
│   ├── authService.js
│   └── redemptionService.js
├── context/
│   └── AuthContext.jsx
└── utils/
    └── redirectUtils.js
```

---

## 5. CORE COMPONENTS & LOGIC

### 5.1 AuthGate Component

```jsx
// src/components/library/AuthGate.jsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export const AuthGate = ({ children, bookType }) => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to registration with return path
      const returnPath = `/library/${bookType}`
      navigate(`/register?redirect=${encodeURIComponent(returnPath)}`)
    }
  }, [user, loading, navigate, bookType])

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>
  }

  if (!user) {
    return null // Will redirect above
  }

  return children
}
```

### 5.2 BooksHub Component

```jsx
// src/components/library/BooksHub.jsx
import { useState } from 'react'
import { BookCard } from './BookCard'
import { useBooks } from '@/hooks/useBooks'

export const BooksHub = () => {
  const [selectedType, setSelectedType] = useState(null) // null, 'FREE', 'CODED'
  const { freeBooks, codedBooks, loading } = useBooks()

  if (loading) {
    return <div>Loading books...</div>
  }

  // Hub view: Choose book type
  if (!selectedType) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Library</h1>

        <div className="grid grid-cols-2 gap-6">
          {/* Free Books Card */}
          <div
            onClick={() => setSelectedType('FREE')}
            className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg cursor-pointer hover:shadow-lg transition-shadow border-2 border-blue-300"
          >
            <h2 className="text-2xl font-bold mb-2">📚 Free Downloads</h2>
            <p className="text-gray-700 mb-4">
              Access our collection of free downloadable books
            </p>
            <p className="text-sm text-gray-600">
              {freeBooks.length} books available
            </p>
          </div>

          {/* Coded Books Card */}
          <div
            onClick={() => setSelectedType('CODED')}
            className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg cursor-pointer hover:shadow-lg transition-shadow border-2 border-purple-300"
          >
            <h2 className="text-2xl font-bold mb-2">🔐 Premium Access</h2>
            <p className="text-gray-700 mb-4">
              Unlock exclusive books with a receipt code or access key
            </p>
            <p className="text-sm text-gray-600">
              {codedBooks.length} books available
            </p>
          </div>
        </div>

        {/* Book Club & Author Registration Links */}
        <div className="mt-12 pt-8 border-t">
          <h3 className="text-xl font-bold mb-4">Other Registration Options</h3>
          <div className="grid grid-cols-2 gap-6">
            <a
              href="/book-club-register"
              className="p-4 bg-orange-50 border border-orange-300 rounded-lg hover:bg-orange-100 transition"
            >
              Join Book Club
            </a>
            <a
              href="/author-register"
              className="p-4 bg-green-50 border border-green-300 rounded-lg hover:bg-green-100 transition"
            >
              Register as Author
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Books list view
  const books = selectedType === 'FREE' ? freeBooks : codedBooks
  const isCoded = selectedType === 'CODED'

  return (
    <div className="max-w-6xl mx-auto p-6">
      <button
        onClick={() => setSelectedType(null)}
        className="mb-6 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
      >
        ← Back to Library
      </button>

      <h1 className="text-2xl font-bold mb-6">
        {isCoded ? '🔐 Premium Books' : '📚 Free Books'}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <BookCard key={book.id} book={book} isCoded={isCoded} />
        ))}
      </div>
    </div>
  )
}
```

### 5.3 BookCard Component with Download

```jsx
// src/components/library/BookCard.jsx
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useUserAccess } from '@/hooks/useUserAccess'
import { RedemptionForm } from './RedemptionForm'

export const BookCard = ({ book, isCoded }) => {
  const { user } = useAuth()
  const { hasAccess, checkAccess } = useUserAccess()
  const [showRedemption, setShowRedemption] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [bookAccess, setBookAccess] = useState(null)

  const handleDownload = async () => {
    // Check if user has access
    const access = await checkAccess(user.id, book.id)
    setBookAccess(access)

    if (!access && isCoded) {
      // Show redemption form for coded books
      setShowRedemption(true)
      return
    }

    if (access || !isCoded) {
      // Allow download
      initiateDownload()
    }
  }

  const initiateDownload = async () => {
    setIsDownloading(true)
    try {
      // Track download
      const response = await fetch('/api/download/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, bookId: book.id }),
      })

      if (response.ok) {
        // Trigger download
        window.location.href = book.pdf_url
      }
    } finally {
      setIsDownloading(false)
    }
  }

  const handleRedemptionSuccess = () => {
    setShowRedemption(false)
    setBookAccess(true)
    // Auto-download after successful redemption
    initiateDownload()
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Cover Image */}
      <div className="h-40 bg-gray-200 overflow-hidden">
        {book.cover_url ? (
          <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white">
            No Cover
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg truncate">{book.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{book.author}</p>
        <p className="text-xs text-gray-500 mb-3">{book.description}</p>

        {/* File Size */}
        <p className="text-xs text-gray-500 mb-3">
          📦 {book.file_size_mb} MB
        </p>

        {/* Badge */}
        <div className="mb-3">
          {isCoded ? (
            <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
              🔐 Premium
            </span>
          ) : (
            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
              ✓ Free
            </span>
          )}
        </div>

        {/* Redemption Form (if showing) */}
        {showRedemption && (
          <RedemptionForm
            bookId={book.id}
            onSuccess={handleRedemptionSuccess}
            onCancel={() => setShowRedemption(false)}
          />
        )}

        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 transition"
        >
          {isDownloading ? 'Downloading...' : isCoded ? 'Unlock & Download' : 'Download'}
        </button>
      </div>
    </div>
  )
}
```

### 5.4 RedemptionForm Component

```jsx
// src/components/library/RedemptionForm.jsx
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/services/supabaseClient'

export const RedemptionForm = ({ bookId, onSuccess, onCancel }) => {
  const { user } = useAuth()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Call Supabase function to validate and redeem code
      const { data, error: supabaseError } = await supabase
        .rpc('redeem_book_code', {
          p_user_id: user.id,
          p_book_id: bookId,
          p_code: code.toUpperCase(),
        })

      if (supabaseError) {
        setError(supabaseError.message || 'Invalid or expired code')
        return
      }

      if (data.success) {
        onSuccess()
      } else {
        setError(data.message || 'Failed to redeem code')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-yellow-50 p-4 rounded-lg mb-4 border border-yellow-200">
      <label className="block text-sm font-medium mb-2">Enter Receipt Code</label>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="e.g., BOOK-ABC-123"
        className="w-full px-3 py-2 border rounded mb-3"
        disabled={loading}
      />
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          {loading ? 'Validating...' : 'Redeem Code'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
```

### 5.5 RegistrationPage with Redirect

```jsx
// src/components/auth/RegistrationPage.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '@/services/supabaseClient'

export const RegistrationPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const redirectPath = searchParams.get('redirect') || '/library'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Sign up with Supabase Auth
      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (authError) {
        setError(authError.message)
        return
      }

      // Create user profile
      const { error: profileError } = await supabase.from('user_profiles').insert({
        id: data.user.id,
        email: formData.email,
        name: formData.name,
      })

      if (profileError) {
        setError(profileError.message)
        return
      }

      // Redirect back to original path
      navigate(redirectPath, { replace: true })
    } catch (err) {
      setError('An error occurred during registration')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Register</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <p className="text-sm text-gray-600 mt-4">
        Already have an account?{' '}
        <a href={`/login?redirect=${encodeURIComponent(redirectPath)}`} className="text-blue-500">
          Sign in
        </a>
      </p>
    </div>
  )
}
```

---

## 6. CUSTOM HOOKS

### 6.1 useAuth Hook

```jsx
// src/hooks/useAuth.js
import { useEffect, useState, useContext } from 'react'
import { AuthContext } from '@/context/AuthContext'

export const useAuth = () => {
  return useContext(AuthContext)
}
```

### 6.2 useBooks Hook

```jsx
// src/hooks/useBooks.js
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/services/supabaseClient'

export const useBooks = () => {
  const { data: freeBooks = [], ...freeQuery } = useQuery({
    queryKey: ['books', 'FREE'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('book_type', 'FREE')
        .eq('is_active', true)
      if (error) throw error
      return data
    },
  })

  const { data: codedBooks = [], ...codedQuery } = useQuery({
    queryKey: ['books', 'CODED'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('book_type', 'CODED')
        .eq('is_active', true)
      if (error) throw error
      return data
    },
  })

  return {
    freeBooks,
    codedBooks,
    loading: freeQuery.isLoading || codedQuery.isLoading,
  }
}
```

### 6.3 useUserAccess Hook

```jsx
// src/hooks/useUserAccess.js
import { supabase } from '@/services/supabaseClient'

export const useUserAccess = () => {
  const checkAccess = async (userId, bookId) => {
    try {
      const { data, error } = await supabase
        .from('user_book_access')
        .select('*')
        .eq('user_id', userId)
        .eq('book_id', bookId)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error // PGRST116 = no rows returned
      }

      return !!data
    } catch (err) {
      console.error('Error checking access:', err)
      return false
    }
  }

  return { checkAccess, hasAccess: checkAccess }
}
```

### 6.4 useRedemption Hook

```jsx
// src/hooks/useRedemption.js
import { supabase } from '@/services/supabaseClient'

export const useRedemption = () => {
  const redeemCode = async (userId, bookId, code) => {
    try {
      const { data, error } = await supabase.rpc('redeem_book_code', {
        p_user_id: userId,
        p_book_id: bookId,
        p_code: code,
      })

      if (error) throw error

      return { success: true, data }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  return { redeemCode }
}
```

---

## 7. SUPABASE FUNCTIONS (PostgreSQL)

### Redeem Code Function

```sql
CREATE OR REPLACE FUNCTION redeem_book_code(
  p_user_id UUID,
  p_book_id UUID,
  p_code VARCHAR
)
RETURNS TABLE (success BOOLEAN, message TEXT) AS $$
DECLARE
  v_receipt_id UUID;
  v_expires_at TIMESTAMP;
  v_current_uses INTEGER;
  v_max_uses INTEGER;
BEGIN
  -- Find the receipt code
  SELECT id, expires_at, current_uses, max_uses
  INTO v_receipt_id, v_expires_at, v_current_uses, v_max_uses
  FROM receipt_codes
  WHERE code = UPPER(p_code) AND book_id = p_book_id LIMIT 1;

  -- Validate code exists
  IF v_receipt_id IS NULL THEN
    RETURN QUERY SELECT FALSE, 'Invalid receipt code'::TEXT;
    RETURN;
  END IF;

  -- Check if code is expired
  IF v_expires_at IS NOT NULL AND v_expires_at < NOW() THEN
    RETURN QUERY SELECT FALSE, 'Receipt code has expired'::TEXT;
    RETURN;
  END IF;

  -- Check usage limit
  IF v_max_uses IS NOT NULL AND v_current_uses >= v_max_uses THEN
    RETURN QUERY SELECT FALSE, 'Receipt code usage limit reached'::TEXT;
    RETURN;
  END IF;

  -- Check if user already has access to this book
  IF EXISTS (
    SELECT 1 FROM user_book_access 
    WHERE user_id = p_user_id AND book_id = p_book_id
  ) THEN
    RETURN QUERY SELECT FALSE, 'You already have access to this book'::TEXT;
    RETURN;
  END IF;

  -- Grant access to user
  INSERT INTO user_book_access (user_id, book_id, access_type, receipt_code_id)
  VALUES (p_user_id, p_book_id, 'REDEEMED_CODE', v_receipt_id);

  -- Update receipt code usage
  UPDATE receipt_codes
  SET 
    is_redeemed = TRUE,
    redeemed_by_user_id = p_user_id,
    redeemed_at = NOW(),
    current_uses = current_uses + 1
  WHERE id = v_receipt_id;

  RETURN QUERY SELECT TRUE, 'Code redeemed successfully'::TEXT;
END;
$$ LANGUAGE plpgsql;
```

### Grant Free Book Access Function

```sql
CREATE OR REPLACE FUNCTION grant_free_book_access(
  p_user_id UUID,
  p_book_id UUID
)
RETURNS TABLE (success BOOLEAN, message TEXT) AS $$
BEGIN
  -- Insert or ignore if already exists
  INSERT INTO user_book_access (user_id, book_id, access_type)
  VALUES (p_user_id, p_book_id, 'FREE')
  ON CONFLICT (user_id, book_id) DO NOTHING;

  RETURN QUERY SELECT TRUE, 'Access granted'::TEXT;
END;
$$ LANGUAGE plpgsql;
```

---

## 8. AUTH CONTEXT & STATE MANAGEMENT

```jsx
// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react'
import { supabase } from '@/services/supabaseClient'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check initial auth state
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (data?.session) {
        setUser(data.session.user)
      }
      setLoading(false)
    }

    checkAuth()

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null)
      }
    )

    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
```

---

## 9. ROUTING STRUCTURE

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import TopNav from '@/components/layout/TopNav'
import LibraryTab from '@/components/library/LibraryTab'
import RegistrationPage from '@/components/auth/RegistrationPage'
import LoginPage from '@/components/auth/LoginPage'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <TopNav />
          <Routes>
            <Route path="/library/*" element={<LibraryTab />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/login" element={<LoginPage />} />
            {/* Other routes */}
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
```

---

## 10. IMPLEMENTATION CHECKLIST

### Phase 1: Setup (Week 1)
- [ ] Create Supabase tables and RLS policies
- [ ] Set up React project with routing
- [ ] Implement AuthContext and authentication
- [ ] Create basic component structure

### Phase 2: Library UI (Week 2)
- [ ] Build BooksHub component
- [ ] Build BooksList and BookCard components
- [ ] Integrate TanStack Query for data fetching
- [ ] Style with Tailwind CSS

### Phase 3: Access Control (Week 3)
- [ ] Implement AuthGate component
- [ ] Create RegistrationPage with redirect logic
- [ ] Implement useUserAccess hook
- [ ] Test auth flows

### Phase 4: Redemption System (Week 4)
- [ ] Build RedemptionForm component
- [ ] Implement `redeem_book_code` Supabase function
- [ ] Test code validation and redemption
- [ ] Add error handling and feedback

### Phase 5: Additional Features (Week 5)
- [ ] Build BookClubRegistration component
- [ ] Build AuthorRegistration component
- [ ] Add download tracking
- [ ] Implement analytics

---

## 11. KEY FEATURES SUMMARY

| Feature | Implementation |
|---------|-----------------|
| **Auth Gate** | AuthGate wrapper component with redirect logic |
| **Book Types** | BooksHub selects FREE vs CODED paths |
| **Free Books** | Direct download after auth check |
| **Coded Books** | Requires receipt code validation via Supabase function |
| **User Registration** | Supabase Auth + user_profiles table |
| **Code Redemption** | Receipt code validated, tracked, and limited |
| **Access Tracking** | user_book_access table tracks all access |
| **Redirect After Auth** | Query param in URL preserved throughout flow |
| **Book Club Join** | Separate registration flow |
| **Author Registration** | Author profile management |

---

## 12. SECURITY CONSIDERATIONS

1. **RLS Policies**: Ensure users can only access their own data
2. **Receipt Code Validation**: Always validate on backend (Supabase function)
3. **Download Tracking**: Log all downloads for audit trail
4. **Code Expiration**: Automatic expiration checks
5. **Usage Limits**: Prevent code reuse beyond max_uses
6. **Environment Variables**: Keep Supabase keys in .env.local

