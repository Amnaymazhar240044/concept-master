import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShoppingCart, Star, ArrowLeft, Heart, Share2, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import api from '../../lib/api'

export default function BookDetail() {
    const { bookId } = useParams()
    const navigate = useNavigate()
    const [book, setBook] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await api.get(`/books/${bookId}`)
                setBook(response.data)
            } catch (err) {
                setError('Failed to load book details')
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchBook()
    }, [bookId])

    const handleBuyNow = () => {
        if (!book) return

        const message = `I want to buy: ${book.title}\nAuthor: ${book.author}\nPrice: Rs ${book.discount ? Math.round(book.price * (1 - book.discount / 100)).toLocaleString() : book.price.toLocaleString()}\nGrade: ${book.grade}\nCategory: ${book.category}`

        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank')
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading book details...</p>
                </div>
            </div>
        )
    }

    if (error || !book) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Book not found'}</p>
                    <button
                        onClick={() => navigate('/books')}
                        className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold transition-all"
                    >
                        Back to Books
                    </button>
                </div>
            </div>
        )
    }

    const finalPrice = book.discount
        ? Math.round(book.price * (1 - book.discount / 100))
        : book.price

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Simple Header */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-4 py-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back
                    </button>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left Column - Book Image */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Book Image */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                            <div className="relative aspect-[3/4]">
                                <img
                                    src={book.coverImage ? `http://localhost:5000${book.coverImage}` : '/images/books/placeholder.jpg'}
                                    alt={book.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = '/images/books/placeholder.jpg'
                                    }}
                                />
                                {book.discount > 0 && (
                                    <div className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                                        -{book.discount}%
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Info */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Details</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Category</span>
                                    <span className="font-medium text-amber-600 dark:text-amber-400">{book.category}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Grade</span>
                                    <span className="font-medium text-amber-600 dark:text-amber-400">{book.grade}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Author</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{book.author}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column - Book Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-6"
                    >
                        {/* Title and Author */}
                        <div>
                            <div className="mb-3">
                                <span className="inline-block px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-sm font-medium">
                                    {book.category}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                {book.title}
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400">
                                by {book.author}
                            </p>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2">
                            <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => {
                                    const filled = i < Math.round(book.rating || 4)
                                    return (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${filled ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}`}
                                            fill={filled ? 'currentColor' : 'none'}
                                        />
                                    )
                                })}
                            </div>
                            <span className="text-gray-600 dark:text-gray-400">
                                {book.rating?.toFixed(1) || '4.0'} • {book.reviews || 0} reviews
                            </span>
                        </div>

                        {/* Price */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-baseline gap-3 mb-2">
                                <span className="text-4xl font-bold text-amber-600 dark:text-amber-400">
                                    Rs {finalPrice.toLocaleString()}
                                </span>
                                {book.discount > 0 && (
                                    <>
                                        <span className="text-xl text-gray-400 line-through">
                                            Rs {book.price.toLocaleString()}
                                        </span>
                                        <span className="ml-auto px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm rounded">
                                            Save Rs {(book.price - finalPrice).toLocaleString()}
                                        </span>
                                    </>
                                )}
                            </div>
                            {book.discount > 0 && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {book.discount}% discount applied
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Description</h2>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {book.description || 'No description available for this book.'}
                            </p>
                        </div>

                        {/* Features */}
                        {book.features && book.features.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Key Features</h2>
                                <div className="space-y-2">
                                    {book.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="sticky bottom-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleBuyNow}
                                    className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    Buy Now on WhatsApp
                                </button>
                                <div className="flex gap-3">
                                    <button className="p-3.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors">
                                        <Heart className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                    </button>
                                    <button className="p-3.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors">
                                        <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}