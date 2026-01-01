import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { FileText, PlayCircle, CheckCircle, BookOpen, ArrowRight, Star, Sparkles, Brain, Target, Award, TrendingUp, Users, Clock, GraduationCap, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ClassOverview() {
    const { classData, loading } = useOutletContext();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center mb-4">
                    <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <span className="text-amber-600/70 dark:text-amber-400/70">Loading class details...</span>
            </div>
        );
    }

    const cards = [
        {
            title: 'Study Notes',
            description: 'Access comprehensive notes for all subjects.',
            icon: FileText,
            gradient: 'from-blue-500 to-cyan-500',
            color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
            link: 'notes',
            stats: 'Well Organized',
            statsColor: 'from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-700 dark:text-blue-300'
        },
        {
            title: 'Video Lectures',
            description: 'Watch expert-led video tutorials and lectures.',
            icon: PlayCircle,
            gradient: 'from-amber-500 to-orange-500',
            color: 'bg-gradient-to-br from-amber-500 to-orange-500',
            link: 'lectures',
            stats: 'HD Quality',
            statsColor: 'from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-300'
        },
        {
            title: 'Practice Quizzes',
            description: 'Test your knowledge with interactive quizzes.',
            icon: CheckCircle,
            gradient: 'from-emerald-500 to-green-500',
            color: 'bg-gradient-to-br from-emerald-500 to-green-500',
            link: 'quizzes',
            stats: 'AI Graded',
            statsColor: 'from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 text-emerald-700 dark:text-emerald-300'
        },
        {
            title: 'Reference Books',
            description: 'Read from our vast collection of digital books.',
            icon: BookOpen,
            gradient: 'from-purple-500 to-pink-500',
            color: 'bg-gradient-to-br from-purple-500 to-pink-500',
            link: 'books',
            stats: 'Digital Library',
            statsColor: 'from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300'
        }
    ];

    const stats = [
        { label: 'Active Students', value: '1,250+', icon: Users, color: 'text-blue-500' },
        { label: 'Success Rate', value: '94%', icon: TrendingUp, color: 'text-emerald-500' },
        { label: 'Study Hours', value: '500+', icon: Clock, color: 'text-amber-500' },
        { label: 'Expert Tutors', value: '25+', icon: GraduationCap, color: 'text-purple-500' }
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Section with Amber Theme */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg"
            >
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full -translate-y-32 translate-x-32"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full -translate-x-32 translate-y-32"></div>
                </div>

                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="max-w-2xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                                    <GraduationCap className="w-7 h-7" />
                                </div>
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                                        Welcome to {classData?.title || classData?.name}
                                    </h1>
                                    <p className="text-amber-100 text-lg">
                                        Your personalized learning journey starts here
                                    </p>
                                </div>
                            </div>
                            
                            <p className="text-amber-100/90 text-lg mb-6 leading-relaxed">
                                Access all your study materials, track your progress, and achieve your academic goals with our comprehensive learning platform.
                            </p>
                            
                            <div className="flex flex-wrap gap-3">
                                <button className="px-6 py-3 bg-white text-amber-700 rounded-xl font-bold hover:bg-amber-50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    Start Learning
                                </button>
                                <button className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-medium hover:bg-white/30 transition-colors border border-white/30">
                                    Explore Features
                                </button>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-4 min-w-[280px]">
                            {stats.map((stat, index) => (
                                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className={`p-1.5 rounded-lg bg-white/20 ${stat.color}`}>
                                            <stat.icon className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="text-2xl font-bold">{stat.value}</div>
                                    </div>
                                    <div className="text-xs text-amber-100/80">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Quick Access Grid */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 dark:from-amber-200 dark:to-orange-200 bg-clip-text text-transparent">
                            Quick Access
                        </h2>
                        <p className="text-amber-600/70 dark:text-amber-400/70">
                            Everything you need for successful learning
                        </p>
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-sm text-amber-600/70 dark:text-amber-400/70">
                        <Zap className="w-4 h-4" />
                        <span>Instant Access</span>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cards.map((card, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="h-full"
                        >
                            <Link to={card.link} className="block h-full group">
                                <div className="h-full bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10 rounded-2xl p-6 border-2 border-amber-200 dark:border-amber-800 hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                    {/* Icon */}
                                    <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center text-white shadow-md mb-4 group-hover:scale-110 transition-transform`}>
                                        <card.icon className="w-6 h-6" />
                                    </div>

                                    {/* Title & Description */}
                                    <h3 className="text-lg font-bold text-amber-900 dark:text-amber-50 mb-2 group-hover:text-amber-700 transition-colors">
                                        {card.title}
                                    </h3>
                                    <p className="text-sm text-amber-600/70 dark:text-amber-400/70 mb-4 line-clamp-2">
                                        {card.description}
                                    </p>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-amber-200 dark:border-amber-800">
                                        <span className={`text-xs font-medium px-3 py-1.5 rounded-full bg-gradient-to-r ${card.statsColor}`}>
                                            {card.stats}
                                        </span>
                                        <div className="flex items-center gap-1 text-amber-600/70 dark:text-amber-400/70 group-hover:text-amber-700 transition-colors">
                                            <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                                Access
                                            </span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>

                                    {/* Gradient accent */}
                                    <div className={`h-1 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-4 rounded-full`}></div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Call to Action */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-2xl p-6 border border-amber-200 dark:border-amber-800"
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                            <Brain className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-50 mb-1">Ready to excel?</h3>
                            <p className="text-sm text-amber-600/70 dark:text-amber-400/70">
                                Join thousands of successful students who have transformed their learning with our platform
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link 
                            to="/student/dashboard"
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm font-medium hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            View Progress
                        </Link>
                        <Link 
                            to="/student/quizzes"
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm font-medium hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Start Quiz
                        </Link>
                    </div>
                </div>
            </motion.div>

            {/* Features Summary */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-5 rounded-xl bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10 border border-amber-200 dark:border-amber-800">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                                <Target className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-amber-900 dark:text-amber-50">Goal Oriented</h4>
                                <p className="text-xs text-amber-600/70 dark:text-amber-400/70">Structured learning path</p>
                            </div>
                        </div>
                        <p className="text-sm text-amber-600/70 dark:text-amber-400/70">
                            Follow a structured learning path designed for academic success
                        </p>
                    </div>

                    <div className="p-5 rounded-xl bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10 border border-amber-200 dark:border-amber-800">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                                <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-amber-900 dark:text-amber-50">Premium Quality</h4>
                                <p className="text-xs text-amber-600/70 dark:text-amber-400/70">Expert curated content</p>
                            </div>
                        </div>
                        <p className="text-sm text-amber-600/70 dark:text-amber-400/70">
                            Access premium study materials created by subject matter experts
                        </p>
                    </div>

                    <div className="p-5 rounded-xl bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10 border border-amber-200 dark:border-amber-800">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-amber-900 dark:text-amber-50">Progress Tracking</h4>
                                <p className="text-xs text-amber-600/70 dark:text-amber-400/70">Monitor your growth</p>
                            </div>
                        </div>
                        <p className="text-sm text-amber-600/70 dark:text-amber-400/70">
                            Track your learning progress with detailed analytics and insights
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}