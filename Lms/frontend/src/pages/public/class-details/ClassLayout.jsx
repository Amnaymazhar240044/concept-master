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
    GraduationCap,
    ArrowLeft,
    Calendar,
    MessageSquare,
    Users,
    Settings
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
                const res = await api.get(`/classes/${classId}`);
                setClassData(res.data.data || res.data);
            } catch (err) {
                console.error('Failed to fetch class details:', err);
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
        { to: `/class/${classId}/assignments`, label: 'Assignments', icon: Calendar },
        { to: `/class/${classId}/discussions`, label: 'Discussions', icon: MessageSquare },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-stone-50 dark:from-gray-900 dark:via-stone-800 dark:to-gray-900 flex">
            {/* Background Pattern */}
            <div className="absolute inset-0">
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 1px 1px, rgb(245 158 11 / 0.1) 1px, transparent 0)',
                        backgroundSize: '40px 40px'
                    }}
                ></div>
            </div>

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
                className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-gradient-to-b from-amber-50 to-orange-50 dark:from-amber-950/80 dark:to-orange-950/40 border-r border-amber-200 dark:border-amber-800 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-100/50 to-orange-100/30 dark:from-amber-900/30 dark:to-orange-900/20">
                        <Link 
                            to="/" 
                            className="flex items-center gap-2 text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200 mb-6 transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-medium">Back to Home</span>
                        </Link>

                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                                <GraduationCap className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="font-bold text-gray-900 dark:text-white text-lg leading-tight line-clamp-1">
                                    {loading ? 'Loading...' : classData?.title || classData?.name || 'Class Details'}
                                </h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-amber-700 dark:text-amber-300 font-medium bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">Active</span>
                                    <span className="text-xs text-amber-600 dark:text-amber-400">Learning Portal</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                onClick={() => setIsSidebarOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group border ${isActive
                                        ? 'bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/30 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 font-semibold shadow-sm'
                                        : 'text-gray-700 dark:text-gray-300 border-transparent hover:bg-gradient-to-r from-amber-50 to-orange-50 dark:hover:from-gray-800/50 dark:hover:to-gray-800/30 hover:border-amber-200 dark:hover:border-amber-800 hover:text-gray-900 dark:hover:text-white'
                                    }`
                                }
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.label === 'Overview' ? 'bg-gradient-to-br from-amber-500 to-orange-500' : 'bg-amber-100 dark:bg-amber-900/30'}`}>
                                    <item.icon className={`w-4 h-4 ${item.label === 'Overview' ? 'text-white' : 'text-amber-600 dark:text-amber-400'}`} />
                                </div>
                                <span className="flex-1">{item.label}</span>
                                <div className={`w-2 h-2 rounded-full ${item.label === 'Overview' || item.label === 'Notes' ? 'bg-amber-500' : 'bg-transparent'}`}></div>
                            </NavLink>
                        ))}
                    </nav>

                    {/* User Progress Section */}
                    <div className="p-4 border-t border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-100/30 to-orange-100/20 dark:from-amber-900/20 dark:to-orange-900/10">
                        <div className="mb-2 flex justify-between items-center">
                            <span className="text-sm font-medium text-amber-800 dark:text-amber-200">Your Progress</span>
                            <span className="text-xs font-bold text-amber-700 dark:text-amber-300">65%</span>
                        </div>
                        <div className="w-full bg-amber-200 dark:bg-amber-900/30 rounded-full h-2 mb-3">
                            <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full w-[65%]"></div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-amber-600 dark:text-amber-400">12/20 completed</span>
                            <span className="text-amber-700 dark:text-amber-300 font-medium">Keep going!</span>
                        </div>
                    </div>

                   
                        
                      
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 relative z-10">
                {/* Mobile Header */}
                <div className="lg:hidden sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-amber-200 dark:border-amber-800 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 rounded-xl hover:bg-amber-100 dark:hover:bg-gray-800 text-amber-600 dark:text-amber-400"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div>
                            <span className="font-semibold text-gray-900 dark:text-white">
                                {loading ? 'Loading...' : classData?.title || classData?.name}
                            </span>
                            <div className="text-xs text-amber-600 dark:text-amber-400">Class Portal</div>
                        </div>
                    </div>
                    <button className="p-2 rounded-xl hover:bg-amber-100 dark:hover:bg-gray-800 text-amber-600 dark:text-amber-400">
                        <Settings className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    <Outlet context={{ classData, loading }} />
                </div>
            </main>
        </div>
    );
}