import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useParams, Link } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    PlayCircle,
    CheckCircle,
    BookOpen,
    Menu,
    X,
    ChevronLeft,
    GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../lib/api';

export default function ClassLayout() {
    const { classId } = useParams();
    const [classData, setClassData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchClassDetails = async () => {
            try {
                // Assuming there is an endpoint to get a single class by ID
                // If not, we might need to fetch all and find one, or update backend
                // For now, let's try fetching specific class if endpoint exists, or fallback
                const res = await api.get(`/classes/${classId}`);
                setClassData(res.data.data || res.data);
            } catch (err) {
                console.error('Failed to fetch class details:', err);
                // Fallback or error handling
            } finally {
                setLoading(false);
            }
        };

        if (classId) {
            fetchClassDetails();
        }
    }, [classId]);

    const navItems = [
        { to: `/class/${classId}`, end: true, label: 'Overview', icon: LayoutDashboard },
        { to: `/class/${classId}/notes`, label: 'Notes', icon: FileText },
        { to: `/class/${classId}/lectures`, label: 'Lectures', icon: PlayCircle },
        { to: `/class/${classId}/quizzes`, label: 'Quizzes', icon: CheckCircle },
        { to: `/class/${classId}/books`, label: 'Books', icon: BookOpen },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6 transition-colors">
                            <ChevronLeft className="w-4 h-4" />
                            <span className="text-sm font-medium">Back to Home</span>
                        </Link>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="font-bold text-gray-900 dark:text-white text-lg leading-tight line-clamp-1">
                                    {loading ? 'Loading...' : classData?.title || classData?.name || 'Class Details'}
                                </h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Student Portal</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                onClick={() => setIsSidebarOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                                    }`
                                }
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-4 text-white text-center">
                            <p className="text-sm font-medium mb-2">Need Help?</p>
                            <button className="text-xs bg-white/20 hover:bg-white/30 transition-colors px-3 py-1.5 rounded-lg w-full">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
                {/* Mobile Header */}
                <div className="lg:hidden sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <span className="font-semibold text-gray-900 dark:text-white">
                            {loading ? 'Loading...' : classData?.title || classData?.name}
                        </span>
                    </div>
                </div>

                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    <Outlet context={{ classData, loading }} />
                </div>
            </main>
        </div>
    );
}
