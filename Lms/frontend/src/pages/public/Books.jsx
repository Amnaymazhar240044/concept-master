import { useState, useEffect, useMemo } from 'react'
import { Link, useParams, useSearchParams, useLocation } from 'react-router-dom' // Added useLocation
import { ShoppingCart, Star, GraduationCap, ArrowRight, Trash2, X, CheckCircle, BookOpen, Plus, Minus, Heart, Share2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../../lib/api'

const GRADE_COLORS = [
  { color: 'from-amber-500 to-orange-500', hoverColor: 'hover:from-amber-600 hover:to-orange-600', bgPattern: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20' },
  { color: 'from-amber-500 to-amber-600', hoverColor: 'hover:from-amber-600 hover:to-amber-700', bgPattern: 'from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20' },
  { color: 'from-orange-500 to-amber-500', hoverColor: 'hover:from-orange-600 hover:to-amber-600', bgPattern: 'from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20' },
  { color: 'from-amber-600 to-orange-600', hoverColor: 'hover:from-amber-700 hover:to-orange-700', bgPattern: 'from-amber-100 to-orange-100 dark:from-amber-800/20 dark:to-orange-800/20' },
  { color: 'from-orange-500 to-amber-400', hoverColor: 'hover:from-orange-600 hover:to-amber-500', bgPattern: 'from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-800/20' },
  { color: 'from-amber-400 to-orange-500', hoverColor: 'hover:from-amber-500 hover:to-orange-600', bgPattern: 'from-amber-50 to-orange-50 dark:from-amber-800/20 dark:to-orange-900/20' },
]

export default function Books() {
  const { grade } = useParams()
  const [sp] = useSearchParams()
  const location = useLocation() // Added to detect if we're in student portal
  const q = (sp.get('q') || '').toLowerCase()

  const [classes, setClasses] = useState([])
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [classesLoading, setClassesLoading] = useState(true)
  const [error, setError] = useState('')
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)

  // Detect if we're in student portal
  const isStudentPortal = location.pathname.includes('/student/')
  
  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('bookCart')
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (e) {
        console.error('Error parsing cart:', e)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('bookCart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await api.get('/classes')
        setClasses(response.data || [])
      } catch (err) {
        console.error('Error fetching classes:', err)
      } finally {
        setClassesLoading(false)
      }
    }

    fetchClasses()
  }, [])

  useEffect(() => {
    const fetchBooks = async () => {
      if (!grade) {
        setLoading(false)
        return
      }

      try {
        const response = await api.get('/books', {
          params: { grade: grade || undefined }
        })
        setBooks(response.data.books || [])
      } catch (err) {
        console.error('Error fetching books:', err)
        setError('Failed to load books')
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [grade])

  const items = useMemo(() => {
    return books.filter(b => (!grade || b.grade === grade) && [b.title, b.author].join(' ').toLowerCase().includes(q))
  }, [q, grade, books])

  // Helper function to get correct book detail URL
  const getBookDetailUrl = (bookId) => {
    // Book details are the same for public and student
    return `/books/detail/${bookId}`
  }

  // Helper function to get correct books base URL
  const getBooksBaseUrl = () => {
    return isStudentPortal ? '/student/books' : '/books'
  }

  // Cart functions...
  // [Keep all your existing cart functions as they are]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-stone-50 dark:from-gray-900 dark:via-stone-800 dark:to-gray-900">
      {/* Cart Sidebar - keep as is */}
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Cart Button (floating) - keep as is */}

        {!grade ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            {/* Header */}
            <div className="text-center space-y-6">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <h1 className="text-5xl md:text-6xl font-black text-amber-900 dark:text-amber-50 mb-6">
                  Digital Library
                </h1>
                <p className="text-2xl text-amber-700 dark:text-amber-300 font-light max-w-3xl mx-auto leading-relaxed">
                  Choose your class to explore our comprehensive collection of educational books
                </p>
              </motion.div>
            </div>

            {/* Class Cards */}
            {classesLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : classes.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-amber-700 dark:text-amber-300 text-lg mb-4">No classes found in the database.</p>
                <p className="text-amber-600 dark:text-amber-400 text-sm">Please ask an admin to add classes via the admin panel.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {classes.map((cls, index) => {
                  const colorScheme = GRADE_COLORS[index % GRADE_COLORS.length]
                  const className = cls.name || cls.class_name || cls.title || 'Unknown Class'

                  // Extract grade identifier from class name
                  const getGradeId = (name) => {
                    const match = name.match(/(\d+)(st|nd|rd|th)?/i)
                    if (match) {
                      const num = match[1]
                      if (num === '1') return '1st-year'
                      if (num === '2') return '2nd-year'
                      return `${num}th`
                    }
                    return name
                  }

                  const gradeId = getGradeId(className)

                  return (
                    <motion.div
                      key={cls._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                    >
                      {/* FIXED LINK: Use student route when in student portal */}
                      <Link
                        to={`${getBooksBaseUrl()}/${gradeId}`}
                        className="group block h-full"
                      >
                        <div className={`h-full p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br ${colorScheme.bgPattern} border-2 border-amber-200 dark:border-amber-800 hover:border-amber-500 dark:hover:border-amber-400`}>
                          <div className="flex flex-col items-center text-center space-y-4">
                            {/* Icon */}
                            <div className={`w-20 h-20 bg-gradient-to-br ${colorScheme.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                              <GraduationCap className="w-10 h-10 text-white" />
                            </div>

                            {/* Class Name */}
                            <div className="space-y-2">
                              <h3 className="text-2xl font-bold text-amber-900 dark:text-amber-100">{className}</h3>
                              <p className="text-sm text-amber-700 dark:text-amber-300">Browse available books</p>
                            </div>

                            {/* Button */}
                            <div className="pt-2">
                              <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br ${colorScheme.color} ${colorScheme.hoverColor} text-white font-semibold transition-all duration-300 hover:scale-105 shadow-md`}>
                                <BookOpen className="w-4 h-4" />
                                View Books
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Header with Cart Button */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-amber-900 dark:text-amber-50 mb-3">
                  Books – {classes.find(c => c.name === grade)?.name || grade}
                </h1>
                <p className="text-lg text-amber-700 dark:text-amber-300">
                  Browse our collection of books for {grade}
                </p>
              </div>
              <div className="flex items-center gap-4">
                {cartCount > 0 && (
                  <button
                    onClick={() => setShowCart(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Cart ({cartCount})
                  </button>
                )}
                {/* FIXED LINK: Use student route when in student portal */}
                <Link
                  to={getBooksBaseUrl()}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all duration-300 font-semibold text-amber-900 dark:text-amber-100"
                >
                  Change Class
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Books Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-amber-700 dark:text-amber-300">Loading books...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {items.map((book, index) => {
                  const isInCart = cart.find(item => item._id === book._id)
                  const finalPrice = book.discount
                    ? Math.round(book.price * (1 - book.discount / 100))
                    : book.price

                  return (
                    <motion.div
                      key={book._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1, duration: 0.8 }}
                      className="group"
                    >
                      <div className="h-full bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-amber-200 dark:border-amber-800 overflow-hidden relative">
                        {/* Book Image */}
                        <Link to={getBookDetailUrl(book._id)} className="block">
                          {/* ... rest of your book card code remains the same ... */}
                        </Link>

                        {/* Book Details */}
                        <div className="p-6 space-y-4">
                          <div>
                            <Link to={getBookDetailUrl(book._id)}>
                              <h3 className="font-bold text-lg line-clamp-2 text-amber-900 dark:text-amber-100 mb-2 hover:text-amber-700 dark:hover:text-amber-300 transition-colors">
                                {book.title}
                              </h3>
                            </Link>
                            {/* ... rest of your book details code remains the same ... */}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}