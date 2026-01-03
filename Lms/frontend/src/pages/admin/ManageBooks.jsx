import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Book, Plus, Pencil, Trash2, Upload, X, Sparkles, Award, Target, Brain, Shield, Star } from 'lucide-react'
import api from '../../lib/api'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Textarea from '../../components/ui/Textarea'

export default function ManageBooks() {
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [currentBook, setCurrentBook] = useState(null)
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        price: '',
        category: '',
        grade: '9th',
        description: '',
        features: '',
        discount: 0
    })
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)

    useEffect(() => {
        fetchBooks()
    }, [])

    const fetchBooks = async () => {
        try {
            const response = await api.get('/books')
            setBooks(response.data.books || [])
        } catch (err) {
            console.error('Error fetching books:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formDataToSend = new FormData()
        formDataToSend.append('title', formData.title)
        formDataToSend.append('author', formData.author)
        formDataToSend.append('price', formData.price)
        formDataToSend.append('category', formData.category)
        formDataToSend.append('grade', formData.grade)
        formDataToSend.append('description', formData.description)
        formDataToSend.append('features', formData.features)
        formDataToSend.append('discount', formData.discount)
        if (imageFile) {
            formDataToSend.append('coverImage', imageFile)
        }

        try {
            if (currentBook) {
                await api.put(`/books/${currentBook._id}`, formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
            } else {
                await api.post('/books', formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
            }
            fetchBooks()
            closeModal()
        } catch (err) {
            console.error('Error saving book:', err)
            alert('Failed to save book')
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this book?')) return

        try {
            await api.delete(`/books/${id}`)
            fetchBooks()
        } catch (err) {
            console.error('Error deleting book:', err)
            alert('Failed to delete book')
        }
    }

    const openModal = (book = null) => {
        if (book) {
            setCurrentBook(book)
            setFormData({
                title: book.title,
                author: book.author,
                price: book.price,
                category: book.category,
                grade: book.grade,
                description: book.description || '',
                features: book.features?.join(', ') || '',
                discount: book.discount || 0
            })
            setImagePreview(book.coverImage ? `${import.meta.env.VITE_API_BASE_URL}${book.coverImage}` : null)
        } else {
            setCurrentBook(null)
            setFormData({
                title: '',
                author: '',
                price: '',
                category: '',
                grade: '9th',
                description: '',
                features: '',
                discount: 0
            })
            setImagePreview(null)
        }
        setImageFile(null)
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setCurrentBook(null)
        setImageFile(null)
        setImagePreview(null)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-md">
                        <Book className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 dark:from-amber-200 dark:to-orange-200 bg-clip-text text-transparent">
                            Manage Books
                        </h1>
                        <p className="text-amber-600/70 dark:text-amber-400/70">Add, edit, or remove books from the library</p>
                    </div>
                </div>
                <Button 
                    onClick={() => openModal()}
                    className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Book
                </Button>
            </div>

            {/* Books Grid */}
            {loading ? (
                <div className="text-center py-16">
                    <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-amber-600/70 dark:text-amber-400/70">Loading books...</p>
                </div>
            ) : books.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-amber-300 dark:border-amber-700 rounded-2xl bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Book className="w-8 h-8 text-amber-400" />
                    </div>
                    <h3 className="text-lg font-medium text-amber-900 dark:text-amber-100 mb-2">No Books Available</h3>
                    <p className="text-amber-600/70 dark:text-amber-400/70 mb-4">Start by adding your first book to the library</p>
                    <Button 
                        onClick={() => openModal()}
                        className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Book
                    </Button>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {books.map((book) => (
                        <motion.div
                            key={book._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="overflow-hidden border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/10 hover:shadow-xl transition-all duration-300 hover:border-amber-300 dark:hover:border-amber-700">
                                <div className="aspect-[3/4] bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 relative overflow-hidden">
                                    <img
                                        src={book.coverImage ? `${import.meta.env.VITE_API_BASE_URL}${book.coverImage}` : '/images/books/placeholder.jpg'}
                                        alt={book.title}
                                        className="w-full h-full object-cover"
                                    />
                                    {book.discount > 0 && (
                                        <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                            {book.discount}% OFF
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 space-y-3">
                                    <div>
                                        <h3 className="font-bold text-amber-900 dark:text-amber-50 line-clamp-1">{book.title}</h3>
                                        <p className="text-sm text-amber-600/70 dark:text-amber-400/70">by {book.author}</p>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <div>
                                            <span className="font-semibold text-amber-700 dark:text-amber-300">
                                                Rs {book.price.toLocaleString()}
                                            </span>
                                            {book.discount > 0 && (
                                                <span className="ml-2 text-xs line-through text-amber-600/50 dark:text-amber-400/50">
                                                    Rs {(book.price * (100 + book.discount) / 100).toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                        <span className="px-2 py-1 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 text-amber-700 dark:text-amber-300 text-xs font-medium rounded-full">
                                            {book.grade}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openModal(book)}
                                            className="flex-1 px-3 py-2 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 hover:from-amber-200 hover:to-orange-200 dark:hover:from-amber-900/30 dark:hover:to-orange-900/30 text-amber-700 dark:text-amber-300 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-sm"
                                        >
                                            <Pencil className="w-4 h-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(book._id)}
                                            className="flex-1 px-3 py-2 bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900/20 dark:to-rose-900/20 hover:from-red-200 hover:to-rose-200 dark:hover:from-red-900/30 dark:hover:to-rose-900/30 text-red-600 dark:text-red-400 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-sm"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-amber-200 dark:border-amber-800"
                    >
                        <div className="sticky top-0 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 border-b border-amber-200 dark:border-amber-700 p-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                                    <Book className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-50">{currentBook ? 'Edit Book' : 'Add New Book'}</h2>
                                    <p className="text-sm text-amber-600/70 dark:text-amber-400/70">
                                        {currentBook ? 'Update book details' : 'Add a new book to the library'}
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={closeModal} 
                                className="p-2 hover:bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg text-amber-600 dark:text-amber-400"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Image Upload */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold mb-2 text-amber-700 dark:text-amber-300">Book Cover</label>
                                <div className="flex items-center gap-4">
                                    {imagePreview && (
                                        <div className="relative">
                                            <img src={imagePreview} alt="Preview" className="w-24 h-32 object-cover rounded-lg shadow-md" />
                                            {formData.discount > 0 && (
                                                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                    {formData.discount}% OFF
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <label className="flex-1 cursor-pointer">
                                        <div className="border-2 border-dashed border-amber-300 dark:border-amber-700 rounded-xl p-4 text-center hover:border-amber-500 transition-all duration-300 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10">
                                            <Upload className="w-8 h-8 mx-auto mb-2 text-amber-400" />
                                            <span className="text-sm text-amber-600/70 dark:text-amber-400/70">Click to upload image</span>
                                            <p className="text-xs text-amber-500/50 dark:text-amber-400/50 mt-1">JPG, PNG, or WebP (max 5MB)</p>
                                        </div>
                                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                    </label>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    className="border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500"
                                />
                                <Input
                                    label="Author"
                                    value={formData.author}
                                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                    required
                                    className="border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500"
                                />
                                <Input
                                    label="Price (Rs)"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                    className="border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500"
                                />
                                <Input
                                    label="Category"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    required
                                    className="border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500"
                                />
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-amber-700 dark:text-amber-300">Grade</label>
                                    <select
                                        value={formData.grade}
                                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                        className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-amber-300 dark:border-amber-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-amber-900 dark:text-amber-100"
                                    >
                                        <option value="9th">9th Class</option>
                                        <option value="10th">10th Class</option>
                                        <option value="1st-year">1st Year</option>
                                        <option value="2nd-year">2nd Year</option>
                                    </select>
                                </div>
                                <Input
                                    label="Discount (%)"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={formData.discount}
                                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                                    className="border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500"
                                />
                            </div>

                            <Textarea
                                label="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className="border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500"
                            />

                            <Input
                                label="Features (comma separated)"
                                value={formData.features}
                                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                placeholder="500+ pages, Diagrams, Practice questions"
                                className="border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500"
                            />

                            <div className="flex gap-3 pt-4">
                                <Button 
                                    type="submit" 
                                    className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl"
                                >
                                    {currentBook ? 'Update Book' : 'Add Book'}
                                </Button>
                                <Button 
                                    type="button" 
                                    onClick={closeModal} 
                                    className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    )
}