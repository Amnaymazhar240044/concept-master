import React, { useState, useEffect } from 'react';
import { Link, useOutletContext, useParams } from 'react-router-dom';
import { CheckCircle, PlayCircle, Clock, BookOpen, Loader2, Target, Award, Brain, Zap, Sparkles, Trophy, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';

export default function ClassQuizzes() {
    const { classId } = useParams();
    const { user } = useAuth();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                setLoading(true);
                const timestamp = Date.now();
                const response = await api.get(`/quizzes?t=${timestamp}`, {
                    params: { class_id: classId }
                });
                // Only show published MCQ quizzes (exclude short answer)
                const mcqQuizzes = (response.data.data || []).filter(q => q.status === 'published' && q.type !== 'SHORT_ANSWER');
                setQuizzes(mcqQuizzes);
            } catch (err) {
                console.error('Failed to fetch quizzes:', err);
                setError('Failed to load quizzes');
            } finally {
                setLoading(false);
            }
        };

        if (classId) {
            fetchQuizzes();
        }
    }, [classId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center mb-4">
                    <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                </div>
                <span className="text-amber-600/70 dark:text-amber-400/70">Loading quizzes...</span>
            </div>
        );
    }

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
            >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">Failed to load quizzes</h3>
                <p className="text-red-600/70 dark:text-red-400/70">Please try again later</p>
            </motion.div>
        );
    }

    if (quizzes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10 p-8 md:p-12 rounded-2xl shadow-lg max-w-lg w-full border-2 border-dashed border-amber-300 dark:border-amber-700"
                >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-amber-400" />
                    </div>

                    <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 dark:from-amber-200 dark:to-orange-200 bg-clip-text text-transparent mb-3">
                        No Quizzes Available
                    </h2>

                    <p className="text-amber-600/70 dark:text-amber-400/70 mb-6 leading-relaxed">
                        There are currently no quizzes available for this class. Check back later for updates!
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            to="/student/quizzes"
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm font-medium hover:shadow-lg transition-all"
                        >
                            Browse All Quizzes
                        </Link>
                        {user?.isPremium && (
                            <Link
                                to="/student/dashboard"
                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white text-sm font-medium hover:shadow-lg transition-all"
                            >
                                View Dashboard
                            </Link>
                        )}
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800 shadow-lg"
            >
                <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-green-600 flex items-center justify-center shadow-md">
                        <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 dark:from-amber-200 dark:to-orange-200 bg-clip-text text-transparent">
                            Practice Quizzes
                        </h1>
                        <p className="text-amber-600/70 dark:text-amber-400/70">
                            {user ? 'Test your knowledge with these interactive quizzes' : 'Log in to attempt quizzes and track your progress'}
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                            <Target className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <div className="text-lg font-bold text-amber-900 dark:text-amber-50">{quizzes.length}</div>
                            <div className="text-sm text-amber-600/70 dark:text-amber-400/70">Available Quizzes</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                            <Brain className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <div className="text-lg font-bold text-amber-900 dark:text-amber-50">MCQ Format</div>
                            <div className="text-sm text-amber-600/70 dark:text-amber-400/70">Quick Assessment</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                            <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <div className="text-lg font-bold text-amber-900 dark:text-amber-50">
                                {user?.isPremium ? 'Premium' : 'Free'}
                            </div>
                            <div className="text-sm text-amber-600/70 dark:text-amber-400/70">Access Level</div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Quizzes Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map((quiz, index) => (
                    <motion.div
                        key={quiz._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="h-full"
                    >
                        <div className="h-full bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10 rounded-2xl border-2 border-amber-200 dark:border-amber-800 p-6 hover:shadow-xl transition-all duration-300 hover:border-emerald-300 dark:hover:border-emerald-700 group">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-green-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                                <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-700 dark:text-blue-300 flex items-center gap-1">
                                    <Target className="w-3 h-3" />
                                    MCQ Quiz
                                </span>
                            </div>

                            {/* Title & Description */}
                            <h3 className="text-lg font-bold mb-2 text-amber-900 dark:text-amber-50 group-hover:text-emerald-700 transition-colors line-clamp-2">
                                {quiz.title}
                            </h3>
                            {quiz.description && (
                                <p className="text-sm text-amber-600/70 dark:text-amber-400/70 mb-4 line-clamp-2">
                                    {quiz.description}
                                </p>
                            )}

                            {/* Quiz Info */}
                            <div className="flex flex-wrap gap-4 text-sm text-amber-600/70 dark:text-amber-400/70 mb-4">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{quiz.duration_minutes || 15} min</span>
                                </div>
                                {quiz.questions_count && (
                                    <div className="flex items-center gap-1">
                                        <BookOpen className="w-4 h-4" />
                                        <span>{quiz.questions_count} questions</span>
                                    </div>
                                )}
                                {quiz.subject && (
                                    <div className="flex items-center gap-1">
                                        <Brain className="w-4 h-4" />
                                        <span>{quiz.subject.name}</span>
                                    </div>
                                )}
                            </div>

                            {/* Stats Badges */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {quiz.difficulty && (
                                    <span className={`text-xs px-3 py-1.5 rounded-lg ${quiz.difficulty === 'hard' ? 'bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 text-red-700 dark:text-red-300' :
                                        quiz.difficulty === 'medium' ? 'bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-300' :
                                            'bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 text-emerald-700 dark:text-emerald-300'
                                        }`}>
                                        {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
                                    </span>
                                )}
                                {quiz.deadline && (
                                    <span className="text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        Due: {new Date(quiz.deadline).toLocaleDateString()}
                                    </span>
                                )}
                            </div>

                            {/* Action Button */}
                            <div className="mt-auto">
                                {!user ? (
                                    <Link
                                        to="/login"
                                        className="block w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        <PlayCircle className="w-4 h-4" />
                                        Log In to Attempt
                                    </Link>
                                ) : !user.isPremium ? (
                                    <Link
                                        to="/pricing"
                                        className="block w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] group/btn"
                                    >
                                        <Zap className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                        Upgrade to Premium
                                    </Link>
                                ) : (
                                    <Link
                                        to={`/student/quiz/${quiz._id}`}
                                        className="block w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] group/btn"
                                    >
                                        <PlayCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                        Attempt Quiz
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Summary Footer */}
            {quizzes.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-4 border-t border-amber-200 dark:border-amber-800"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-amber-600/70 dark:text-amber-400/70">
                        <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4" />
                            <span>Regular practice leads to mastery and better performance</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-500"></div>
                                <span>MCQ Quizzes: {quizzes.length}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                <span>Premium: {user?.isPremium ? 'Access' : 'Required'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                <span>Interactive Learning</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}