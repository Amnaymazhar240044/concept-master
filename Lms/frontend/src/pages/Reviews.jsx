import React, { useState, useEffect } from 'react';
import { Star, Send, Sparkles } from 'lucide-react';
import ReviewCard from '../components/ReviewCard';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        rating: 5,
        comment: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const fetchReviews = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/reviews`);
            if (!response.ok) throw new Error('Failed to fetch reviews');
            const data = await response.json();
            setReviews(data);
        } catch (err) {
            console.error(err);
            setError('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to submit review');

            const newReview = await response.json();
            setReviews([newReview, ...reviews]);
            setFormData({ name: '', rating: 5, comment: '' });
        } catch (err) {
            setError('Failed to submit review. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50/50 to-stone-50/50 dark:from-gray-900 dark:via-stone-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-200 dark:border-amber-800 mb-6">
                        <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">Student Voices</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-amber-900 dark:text-amber-50 mb-4">
                        Student Reviews
                    </h1>
                    <p className="text-lg text-amber-700 dark:text-amber-300 max-w-2xl mx-auto">
                        Hear what our students are saying about their learning experience at Concept Master.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Reviews List */}
                    <div className="lg:col-span-2">
                        {loading ? (
                            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-amber-200 dark:border-amber-800">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-600 border-t-transparent mx-auto"></div>
                                <p className="mt-4 text-amber-700 dark:text-amber-300">Loading reviews...</p>
                            </div>
                        ) : reviews.length > 0 ? (
                            <div className="grid gap-6">
                                {reviews.map((review) => (
                                    <ReviewCard key={review._id} review={review} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-amber-200 dark:border-amber-800 shadow-sm">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                                    <Star className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                                </div>
                                <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100 mb-2">
                                    No Reviews Yet
                                </h3>
                                <p className="text-amber-700 dark:text-amber-300 mb-6">
                                    Be the first to share your experience!
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Add Review Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800 shadow-sm p-6 sticky top-8">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                                    <Send className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-amber-900 dark:text-amber-100">
                                    Share Your Experience
                                </h2>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm rounded-lg">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-amber-700 dark:text-amber-300 mb-2">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-amber-300 dark:border-amber-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-amber-900 dark:text-amber-100 placeholder-amber-500/60 dark:placeholder-amber-400/40"
                                        placeholder="Enter your name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-amber-700 dark:text-amber-300 mb-2">
                                        Your Rating
                                    </label>
                                    <div className="flex space-x-3">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, rating: star })}
                                                className="focus:outline-none transform hover:scale-110 transition-transform duration-200"
                                            >
                                                <Star
                                                    size={28}
                                                    className={`${star <= formData.rating
                                                            ? 'text-amber-500 fill-amber-500'
                                                            : 'text-amber-300 dark:text-amber-700'
                                                        } transition-colors duration-150`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    <div className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                                        Selected: {formData.rating} out of 5 stars
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-amber-700 dark:text-amber-300 mb-2">
                                        Your Review
                                    </label>
                                    <textarea
                                        required
                                        rows={5}
                                        value={formData.comment}
                                        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-amber-300 dark:border-amber-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-amber-900 dark:text-amber-100 placeholder-amber-500/60 dark:placeholder-amber-400/40 resize-none"
                                        placeholder="Share your learning experience, what you liked, and how we can improve..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Submitting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send size={18} />
                                            <span>Submit Review</span>
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Trust Message */}
                            <div className="mt-6 pt-6 border-t border-amber-200 dark:border-amber-800">
                                <p className="text-sm text-amber-600 dark:text-amber-400 text-center">
                                    Your feedback helps us improve and serve you better.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reviews;