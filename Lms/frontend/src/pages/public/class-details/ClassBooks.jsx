import React, { useState, useEffect } from 'react';
import { useOutletContext, Link, useNavigate } from 'react-router-dom';
import { BookOpen, Star, ShoppingCart, Search, Sparkles, Award, Tag, Clock, Users, Zap, X, Plus, Minus, MessageCircle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../lib/api';

export default function ClassBooks() {
    const { classData } = useOutletContext();
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [imageError, setImageError] = useState({});
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);

    useEffect(() => {
        const fetchBooks = async () => {
            if (!classData) return;

            try {
                const mapClassToGrade = (title) => {
                    const cleanTitle = title?.toLowerCase().trim();
                    if (cleanTitle?.includes('class 9')) return '9th';
                    if (cleanTitle?.includes('class 10')) return '10th';
                    if (cleanTitle?.includes('class 11')) return '1st-year';
                    if (cleanTitle?.includes('class 12')) return '2nd-year';
                    return cleanTitle || '9th';
                };

                const grade = mapClassToGrade(classData.title || classData.name);
                let res;
                try {
                    res = await api.get('/books', { params: { grade: grade } });
                } catch (err) {
                    res = await api.get('/books', { params: { class: grade } });
                }

                const allBooks = res.data.books || res.data.data || [];
                const filteredBooks = allBooks.filter(book => {
                    if (!book.grade) return true;
                    const bookGrade = book.grade?.toLowerCase().trim() || '';
                    const targetGrade = grade.toLowerCase().trim();
                    return bookGrade === targetGrade || bookGrade.includes(targetGrade) || targetGrade.includes(bookGrade);
                });

                setBooks(filteredBooks);
            } catch (err) {
                console.error('Failed to fetch books:', err);
                try {
                    const fallbackRes = await api.get('/books');
                    setBooks(fallbackRes.data.books || fallbackRes.data.data || []);
                } catch (fallbackErr) {
                    console.error('Fallback also failed:', fallbackErr);
                    setBooks([]);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [classData]);

    const filteredBooks = books.filter(book =>
        book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleImageError = (bookId) => {
        setImageError(prev => ({ ...prev, [bookId]: true }));
    };

    const getImageUrl = (book) => {
        if (imageError[book._id]) return '/images/books/placeholder.jpg';
        if (!book.coverImage) return '/images/books/placeholder.jpg';
        if (book.coverImage.startsWith('http')) return book.coverImage;
        
        let imagePath = book.coverImage;
        if (imagePath.startsWith('/')) imagePath = imagePath.substring(1);
        if (imagePath.startsWith('uploads/')) return `${import.meta.env.VITE_API_BASE_URL}/${imagePath}`;
return `${import.meta.env.VITE_API_BASE_URL}/uploads/books/${imagePath}`;
    };

    const addToCart = (book, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        setCart(prevCart => {
            const existing = prevCart.find(item => item._id === book._id);
            if (existing) {
                return prevCart.map(item =>
                    item._id === book._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevCart, { ...book, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (bookId, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setCart(prevCart => prevCart.filter(item => item._id !== bookId));
    };

    const updateQuantity = (bookId, newQuantity, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        if (newQuantity < 1) {
            removeFromCart(bookId);
            return;
        }
        setCart(prevCart =>
            prevCart.map(item =>
                item._id === bookId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => {
            const price = item.discount 
                ? Math.round(item.price * (1 - item.discount / 100))
                : item.price;
            return total + (price * item.quantity);
        }, 0);
    };

    const getTotalItems = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    const sendToWhatsApp = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        if (cart.length === 0) {
            alert('Your cart is empty! Add some books first.');
            return;
        }

        let message = `I want to purchase the following books:\n\n`;
        
        cart.forEach((item, index) => {
            const price = item.discount 
                ? Math.round(item.price * (1 - item.discount / 100))
                : item.price;
            const total = price * item.quantity;
            
            message += `${index + 1}. ${item.title}\n`;
            message += `   Author: ${item.author}\n`;
            message += `   Quantity: ${item.quantity}\n`;
            message += `   Price per book: Rs ${price.toLocaleString()}\n`;
            message += `   Total for this book: Rs ${total.toLocaleString()}\n`;
            if (item.discount) {
                message += `   Discount: ${item.discount}% OFF\n`;
            }
            message += `   Grade: ${item.grade || 'N/A'}\n`;
            message += `   Category: ${item.category || 'N/A'}\n\n`;
        });

        message += `\n📦 Total Books: ${getTotalItems()}`;
        message += `\n💰 Grand Total: Rs ${getTotalPrice().toLocaleString()}`;
        message += `\n\nPlease confirm availability and provide payment details.`;

        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    };

    const sendSingleToWhatsApp = (book, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        const price = book.discount 
            ? Math.round(book.price * (1 - book.discount / 100))
            : book.price;
        
        const message = `I want to purchase this book:\n\n📚 Title: ${book.title}\n✍️ Author: ${book.author}\n💰 Price: Rs ${price.toLocaleString()}\n🎯 Grade: ${book.grade || 'N/A'}\n🏷️ Category: ${book.category || 'N/A'}\n\nPlease confirm availability and provide payment details.`;
        
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    };

    const handleCardClick = (bookId, e) => {
        if (!e.target.closest('button') && !e.target.closest('a')) {
            navigate(`/books/detail/${bookId}`);
        }
    };

    return (
        <div className="space-y-6">
            {/* Floating Cart Button */}
            {cart.length > 0 && (
                <button
                    onClick={() => setShowCart(true)}
                    className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
                >
                    <ShoppingCart className="w-5 h-5" />
                    <span className="font-semibold">Cart ({getTotalItems()})</span>
                    <span className="px-2 py-1 bg-white/20 rounded-lg text-sm">
                        Rs {getTotalPrice().toLocaleString()}
                    </span>
                </button>
            )}

            {/* Cart Sidebar */}
            <AnimatePresence>
                {showCart && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCart(false)}
                            className="fixed inset-0 bg-black/50 z-40"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30 }}
                            className="fixed right-0 top-0 h-full w-full max-w-md bg-gradient-to-b from-white to-amber-50/50 dark:from-gray-900 dark:to-amber-950/10 z-50 shadow-2xl border-l border-amber-200 dark:border-amber-800"
                        >
                            <div className="flex flex-col h-full">
                                <div className="p-6 border-b border-amber-200 dark:border-amber-800">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <ShoppingCart className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                            <h2 className="text-xl font-bold text-amber-900 dark:text-amber-50">Your Cart</h2>
                                        </div>
                                        <button
                                            onClick={() => setShowCart(false)}
                                            className="p-2 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                                        >
                                            <X className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                        </button>
                                    </div>
                                    <p className="text-sm text-amber-600/70 dark:text-amber-400/70 mt-2">
                                        {getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''} selected
                                    </p>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4">
                                    {cart.length === 0 ? (
                                        <div className="text-center py-12">
                                            <ShoppingCart className="w-16 h-16 text-amber-300 mx-auto mb-4" />
                                            <p className="text-amber-600/70 dark:text-amber-400/70">Your cart is empty</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {cart.map((item) => (
                                                <div key={item._id} className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                                                    <div className="flex gap-4">
                                                        <div className="w-16 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex-shrink-0">
                                                            <img
                                                                src={getImageUrl(item)}
                                                                alt={item.title}
                                                                className="w-full h-full object-cover"
                                                                onError={() => handleImageError(item._id)}
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-start">
                                                                <h4 className="font-semibold text-amber-900 dark:text-amber-50 line-clamp-2">
                                                                    {item.title}
                                                                </h4>
                                                                <button
                                                                    onClick={(e) => removeFromCart(item._id, e)}
                                                                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                                >
                                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                                </button>
                                                            </div>
                                                            <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mb-2">
                                                                by {item.author}
                                                            </p>
                                                            <div className="flex items-center justify-between">
                                                                <div className="text-lg font-bold text-amber-600 dark:text-amber-400">
                                                                    Rs {item.discount 
                                                                        ? Math.round(item.price * (1 - item.discount / 100))
                                                                        : item.price
                                                                    } × {item.quantity}
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <button
                                                                        onClick={(e) => updateQuantity(item._id, item.quantity - 1, e)}
                                                                        className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center hover:shadow-sm"
                                                                    >
                                                                        <Minus className="w-3 h-3" />
                                                                    </button>
                                                                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                                                                    <button
                                                                        onClick={(e) => updateQuantity(item._id, item.quantity + 1, e)}
                                                                        className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center hover:shadow-sm"
                                                                    >
                                                                        <Plus className="w-3 h-3" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {cart.length > 0 && (
                                    <div className="p-6 border-t border-amber-200 dark:border-amber-800">
                                        <div className="space-y-3 mb-6">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-amber-600/70 dark:text-amber-400/70">Total Items</span>
                                                <span className="font-medium text-amber-900 dark:text-amber-50">{getTotalItems()}</span>
                                            </div>
                                            <div className="flex justify-between text-lg font-bold pt-3 border-t border-amber-200 dark:border-amber-800">
                                                <span className="text-amber-900 dark:text-amber-50">Grand Total</span>
                                                <span className="text-amber-600 dark:text-amber-400">Rs {getTotalPrice().toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <button
                                                onClick={sendToWhatsApp}
                                                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg"
                                            >
                                                <MessageCircle className="w-5 h-5" />
                                                Send All to WhatsApp
                                            </button>
                                            <button
                                                onClick={() => setCart([])}
                                                className="w-full py-2 text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300"
                                            >
                                                Clear Cart
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800 shadow-lg"
            >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-md">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 dark:from-amber-200 dark:to-orange-200 bg-clip-text text-transparent">
                                Reference Books
                            </h1>
                            <p className="text-amber-600/70 dark:text-amber-400/70">
                                Curated collection for {classData?.name || classData?.title}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                            <input
                                type="text"
                                placeholder="Search books..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2.5 rounded-xl border border-amber-200 dark:border-amber-800 bg-white dark:bg-gray-800/50 text-amber-900 dark:text-amber-50 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none w-full sm:w-64 backdrop-blur-sm"
                            />
                        </div>
                        {cart.length > 0 && (
                            <button
                                onClick={() => setShowCart(true)}
                                className="relative p-2.5 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-200 dark:border-amber-800 hover:border-amber-300 transition-colors"
                            >
                                <ShoppingCart className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs rounded-full flex items-center justify-center">
                                    {getTotalItems()}
                                </span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <div className="text-lg font-bold text-amber-900 dark:text-amber-50">{books.length}</div>
                            <div className="text-sm text-amber-600/70 dark:text-amber-400/70">Total Books</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <div className="text-lg font-bold text-amber-900 dark:text-amber-50">
                                {books.filter(b => b.discount).length}
                            </div>
                            <div className="text-sm text-amber-600/70 dark:text-amber-400/70">Discounted</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                            <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <div className="text-lg font-bold text-amber-900 dark:text-amber-50">
                                {books.filter(b => b.rating >= 4).length}
                            </div>
                            <div className="text-sm text-amber-600/70 dark:text-amber-400/70">Top Rated</div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Loading State */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center mb-4">
                        <BookOpen className="w-8 h-8 text-amber-400 animate-pulse" />
                    </div>
                    <span className="text-amber-600/70 dark:text-amber-400/70">Loading books...</span>
                </div>
            ) : filteredBooks.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16 border-2 border-dashed border-amber-300 dark:border-amber-700 rounded-2xl bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10"
                >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-10 h-10 text-amber-400" />
                    </div>
                    <h3 className="text-lg font-medium text-amber-900 dark:text-amber-100 mb-2">No books found</h3>
                    <p className="text-amber-600/70 dark:text-amber-400/70 max-w-sm mx-auto mb-6">
                        {searchQuery ? 'Try a different search term' : 'Books will appear here once they are added for this class'}
                    </p>
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm font-medium hover:shadow-lg transition-all"
                        >
                            Clear Search
                        </button>
                    )}
                </motion.div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredBooks.map((book, index) => {
                        const imageUrl = getImageUrl(book);
                        const isInCart = cart.find(item => item._id === book._id);
                        
                        return (
                            <motion.div
                                key={book._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group h-full"
                                onClick={(e) => handleCardClick(book._id, e)}
                            >
                                <div className="h-full bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10 rounded-2xl border-2 border-amber-200 dark:border-amber-800 hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-300 hover:shadow-xl flex flex-col overflow-hidden relative cursor-pointer">
                                    {/* Cover Image */}
                                    <div className="aspect-[3/4] bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 relative overflow-hidden">
                                        <img
                                            src={imageUrl}
                                            alt={book.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            onError={() => handleImageError(book._id)}
                                            loading="lazy"
                                        />

                                        {/* Discount Badge */}
                                        {book.discount && (
                                            <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold shadow-lg flex items-center gap-1">
                                                <Zap className="w-3 h-3" />
                                                -{book.discount}%
                                            </div>
                                        )}

                                        {/* Rating Badge */}
                                        <div className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            {book.rating || 4.5}
                                        </div>
                                    </div>

                                    <div className="p-4 flex-1 flex flex-col">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h3 className="font-bold text-amber-900 dark:text-amber-50 line-clamp-2 group-hover:text-amber-700 transition-colors">
                                                {book.title}
                                            </h3>
                                            {book.bestseller && (
                                                <span className="px-2 py-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-300 text-xs font-medium flex-shrink-0">
                                                    Bestseller
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-sm text-amber-600/70 dark:text-amber-400/70 mb-3 line-clamp-1">
                                            by {book.author}
                                        </p>

                                        <div className="flex items-center gap-3 text-xs text-amber-600/70 dark:text-amber-400/70 mb-4">
                                            {book.pages && (
                                                <div className="flex items-center gap-1">
                                                    <BookOpen className="w-3 h-3" />
                                                    <span>{book.pages} pages</span>
                                                </div>
                                            )}
                                            {book.edition && (
                                                <div className="flex items-center gap-1">
                                                    <Tag className="w-3 h-3" />
                                                    <span>{book.edition} Ed.</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mb-4">
                                            {book.discount ? (
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                                                        Rs {Math.round(book.price * (1 - book.discount / 100)).toLocaleString()}
                                                    </span>
                                                    <span className="text-sm text-amber-600/70 dark:text-amber-400/70 line-through">
                                                        Rs {book.price?.toLocaleString()}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                                                    Rs {book.price?.toLocaleString()}
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-auto flex gap-2">
                                            {isInCart ? (
                                                <button
                                                    onClick={(e) => removeFromCart(book._id, e)}
                                                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 text-red-700 dark:text-red-300 text-sm font-medium hover:shadow-sm transition-all"
                                                >
                                                    <X className="w-4 h-4" />
                                                    Remove
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={(e) => addToCart(book, e)}
                                                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-sm font-medium hover:shadow-lg transition-all"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    Add to Cart
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => sendSingleToWhatsApp(book, e)}
                                                className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white hover:scale-110 transition-all"
                                            >
                                                <MessageCircle className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {books.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-4 border-t border-amber-200 dark:border-amber-800"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-amber-600/70 dark:text-amber-400/70">
                        <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            <span>Select multiple books and purchase via WhatsApp</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                <span>Total: {books.length} books</span>
                            </div>
                            {cart.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    <span>In Cart: {getTotalItems()} items</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                <span>Showing: {filteredBooks.length}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}