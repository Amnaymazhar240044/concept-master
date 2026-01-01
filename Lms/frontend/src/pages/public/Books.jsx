import { useState, useEffect, useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
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
  const q = (sp.get('q') || '').toLowerCase()

  const [classes, setClasses] = useState([])
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [classesLoading, setClassesLoading] = useState(true)
  const [error, setError] = useState('')
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)

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

  // Cart functions
  const addToCart = (book, e) => {
    e.preventDefault()
    e.stopPropagation()
    
    setCart(prev => {
      const existingItem = prev.find(item => item._id === book._id)
      if (existingItem) {
        return prev.map(item =>
          item._id === book._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        const finalPrice = book.discount
          ? Math.round(book.price * (1 - book.discount / 100))
          : book.price
        return [...prev, {
          ...book,
          quantity: 1,
          finalPrice
        }]
      }
    })
  }

  const removeFromCart = (bookId, e) => {
    e?.preventDefault()
    e?.stopPropagation()
    setCart(prev => prev.filter(item => item._id !== bookId))
  }

  const updateQuantity = (bookId, newQuantity, e) => {
    e?.preventDefault()
    e?.stopPropagation()
    if (newQuantity < 1) {
      removeFromCart(bookId)
      return
    }
    setCart(prev =>
      prev.map(item =>
        item._id === bookId
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.finalPrice * item.quantity), 0)
  }, [cart])

  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }, [cart])

  const handleBuyNow = () => {
    if (cart.length === 0) return

    let message = `I want to buy the following books:\n\n`
    
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.title} by ${item.author}\n`
      message += `   Grade: ${item.grade}\n`
      message += `   Category: ${item.category}\n`
      message += `   Quantity: ${item.quantity}\n`
      message += `   Price: Rs ${item.finalPrice.toLocaleString()} each\n`
      message += `   Subtotal: Rs ${(item.finalPrice * item.quantity).toLocaleString()}\n\n`
    })

    message += `\n📦 Total Books: ${cartCount}\n`
    message += `💰 Total Amount: Rs ${cartTotal.toLocaleString()}`

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  // Quick buy function (for single book buy button)
  const quickBuy = (book, e) => {
    e.preventDefault()
    e.stopPropagation()
    
    const finalPrice = book.discount
      ? Math.round(book.price * (1 - book.discount / 100))
      : book.price
    const message = `I want to buy:\n\n📚 ${book.title}\n✍️ by ${book.author}\n🏫 Grade: ${book.grade}\n📂 Category: ${book.category}\n💰 Price: Rs ${finalPrice.toLocaleString()}\n📦 Quantity: 1`
    
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-stone-50 dark:from-gray-900 dark:via-stone-800 dark:to-gray-900">
      {/* Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Cart Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto"
            >
              <div className="h-full flex flex-col">
                {/* Cart Header */}
                <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-amber-200 dark:border-amber-800 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-amber-900 dark:text-amber-100">Shopping Cart</h2>
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                          {cartCount} {cartCount === 1 ? 'item' : 'items'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowCart(false)}
                      className="p-2 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-amber-700 dark:text-amber-300" />
                    </button>
                  </div>
                </div>

                {/* Cart Items */}
                <div className="flex-1 p-6 overflow-y-auto">
                  {cart.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCart className="w-16 h-16 mx-auto text-amber-300 dark:text-amber-700 mb-4" />
                      <p className="text-amber-700 dark:text-amber-300 font-medium mb-2">Your cart is empty</p>
                      <p className="text-sm text-amber-600 dark:text-amber-400">
                        Add books from the collection
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <motion.div
                          key={item._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex gap-4 p-4 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800"
                        >
                          {/* Book Image */}
                          <div className="flex-shrink-0 w-20 h-24 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-800 dark:to-orange-800 rounded-lg overflow-hidden">
                            {item.coverImage && (
                              <img
                                src={`http://localhost:5000${item.coverImage}`}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>

                          {/* Book Details */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-amber-900 dark:text-amber-100 line-clamp-2 mb-1">
                              {item.title}
                            </h3>
                            <p className="text-sm text-amber-700 dark:text-amber-300 mb-2">
                              by {item.author}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              {/* Quantity Controls */}
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => updateQuantity(item._id, item.quantity - 1, e)}
                                  className="w-7 h-7 flex items-center justify-center bg-white dark:bg-gray-800 border border-amber-300 dark:border-amber-700 rounded hover:bg-amber-50 dark:hover:bg-amber-900/30"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-8 text-center font-medium text-amber-900 dark:text-amber-100">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={(e) => updateQuantity(item._id, item.quantity + 1, e)}
                                  className="w-7 h-7 flex items-center justify-center bg-white dark:bg-gray-800 border border-amber-300 dark:border-amber-700 rounded hover:bg-amber-50 dark:hover:bg-amber-900/30"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              {/* Price and Remove */}
                              <div className="text-right">
                                <div className="font-bold text-amber-700 dark:text-amber-300">
                                  Rs {(item.finalPrice * item.quantity).toLocaleString()}
                                </div>
                                <button
                                  onClick={(e) => removeFromCart(item._id, e)}
                                  className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 flex items-center gap-1 mt-1"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cart Footer */}
                <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-amber-200 dark:border-amber-800 p-6">
                  {/* Order Summary */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-amber-700 dark:text-amber-300">Subtotal</span>
                      <span className="text-lg font-bold text-amber-900 dark:text-amber-100">
                        Rs {cartTotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-amber-700 dark:text-amber-300">Total Books</span>
                      <span className="font-medium text-amber-900 dark:text-amber-100">
                        {cartCount} {cartCount === 1 ? 'book' : 'books'}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleBuyNow}
                      disabled={cart.length === 0}
                      className={`w-full py-3.5 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                        cart.length === 0
                          ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white hover:shadow-xl'
                      }`}
                    >
                      <CheckCircle className="w-5 h-5" />
                      Order Now on WhatsApp
                    </button>

                    {cart.length > 0 && (
                      <button
                        onClick={clearCart}
                        className="w-full py-3 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
                      >
                        Clear Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Cart Button (floating) */}
        {grade && cartCount > 0 && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={() => setShowCart(true)}
            className="fixed right-6 bottom-6 z-30 flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 font-semibold"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Cart ({cartCount})</span>
            <span className="ml-2 px-2 py-1 bg-white/20 rounded text-sm">
              Rs {cartTotal.toLocaleString()}
            </span>
          </motion.button>
        )}

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
                      <Link
                        to={`/books/${gradeId}`}
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
                <Link
                  to="/books"
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
                        <Link to={`/books/detail/${book._id}`} className="block">
                          <div className="relative aspect-[4/3] bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800 overflow-hidden flex items-center justify-center">
                            {book.coverImage ? (
                              <img
                                src={`http://localhost:5000${book.coverImage}`}
                                alt={book.title}
                                loading="lazy"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                onError={(e) => {
                                  console.error('Image load error for:', e.target.src)
                                  e.target.style.display = 'none'
                                }}
                              />
                            ) : (
                              <div className="text-amber-600 dark:text-amber-400 text-center p-4">
                                <BookOpen className="w-16 h-16 mx-auto mb-2 opacity-70" />
                                <p className="text-sm">No cover image</p>
                              </div>
                            )}

                            {/* Discount Badge */}
                            {book.discount && (
                              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm font-bold shadow-lg">
                                -{book.discount}%
                              </div>
                            )}

                            {/* Category Badge */}
                            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 dark:bg-gray-900/80 border border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-300 text-sm font-semibold">
                              {book.category}
                            </div>

                            {/* Cart Status Badge */}
                            {isInCart && (
                              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-bold shadow-lg flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                In Cart ({isInCart.quantity})
                              </div>
                            )}
                          </div>
                        </Link>

                        {/* Book Details */}
                        <div className="p-6 space-y-4">
                          <div>
                            <Link to={`/books/detail/${book._id}`}>
                              <h3 className="font-bold text-lg line-clamp-2 text-amber-900 dark:text-amber-100 mb-2 hover:text-amber-700 dark:hover:text-amber-300 transition-colors">
                                {book.title}
                              </h3>
                            </Link>
                            <p className="text-sm text-amber-700 dark:text-amber-300">by {book.author}</p>
                          </div>

                          {/* Rating */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => {
                                const filled = i < Math.round(book.rating || 4)
                                return (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${filled ? 'text-amber-500' : 'text-amber-300 dark:text-amber-700'}`}
                                    fill={filled ? 'currentColor' : 'none'}
                                    strokeWidth={filled ? 0 : 2}
                                  />
                                )
                              })}
                            </div>
                            <span className="text-sm text-amber-600 dark:text-amber-400">({book.reviews || 0})</span>
                          </div>

                          {/* Features */}
                          <div className="grid grid-cols-2 gap-2">
                            {book.features?.slice(0, 4).map((feature, idx) => (
                              <div key={idx} className="text-xs text-amber-700 dark:text-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 px-2 py-1 rounded border border-amber-200 dark:border-amber-800">
                                {feature}
                              </div>
                            ))}
                          </div>

                          {/* Price and CTA */}
                          <div className="flex items-center justify-between pt-2">
                            <div>
                              {book.discount ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-xl font-bold text-amber-700 dark:text-amber-300">
                                    Rs {finalPrice.toLocaleString()}
                                  </span>
                                  <span className="text-sm text-amber-500 dark:text-amber-600 line-through">
                                    Rs {book.price.toLocaleString()}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-xl font-bold text-amber-700 dark:text-amber-300">
                                  Rs {book.price.toLocaleString()}
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              {isInCart ? (
                                <button
                                  onClick={(e) => removeFromCart(book._id, e)}
                                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold transition-all duration-300 hover:scale-105 shadow-md"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Remove
                                </button>
                              ) : (
                                <button
                                  onClick={(e) => addToCart(book, e)}
                                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold transition-all duration-300 hover:scale-105 shadow-md"
                                >
                                  <ShoppingCart className="w-4 h-4" />
                                  Add to Cart
                                </button>
                              )}
                              <button
                                onClick={(e) => quickBuy(book, e)}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20 text-amber-700 dark:text-amber-300 font-semibold transition-all duration-300 hover:scale-105"
                              >
                                <BookOpen className="w-4 h-4" />
                                Quick Buy
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}

            {!items.length && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="text-amber-600 dark:text-amber-400 text-lg">No books match your search.</div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}