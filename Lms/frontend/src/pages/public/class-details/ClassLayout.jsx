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
        <div className="min-h-screen flex bg-amber-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed md:fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out md:transform-none border-r border-amber-200 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl supports-[backdrop-filter]:backdrop-blur-xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} h-screen overflow-hidden`}>
                <div className="h-full flex flex-col max-h-screen">
                    {/* Sidebar Header */}
                    <div className="p-6 border-b border-amber-100 dark:border-gray-800 flex-shrink-0">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center">
                                    <GraduationCap className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <div className="font-bold text-lg leading-tight line-clamp-1">
                                        {loading ? 'Loading...' : classData?.title || classData?.name || 'Class Details'}
                                    </div>
                                    <div className="text-xs opacity-60 capitalize">Class Portal</div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="md:hidden p-2 rounded-lg hover:bg-amber-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Class Status */}
                        <Link 
                            to="/classes" 
                            className="flex items-center gap-2 text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200 mb-3 transition-colors group text-sm"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-medium">Back to Classes</span>
                        </Link>

                        <div className="flex items-center gap-2">
                            <span className="text-xs text-amber-700 dark:text-amber-300 font-medium bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">Active</span>
                            <span className="text-xs text-amber-600 dark:text-amber-400">Learning Portal</span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 overflow-y-auto p-4">
                        <nav className="space-y-1">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    end={item.end}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={({ isActive }) =>
                                        `group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                            ? 'bg-amber-600 text-white shadow-md'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-amber-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                                        }`
                                    }
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.label === 'Overview' ? 'bg-white/20' : 'bg-amber-100 dark:bg-amber-900/30'}`}>
                                        <item.icon className={`w-4 h-4 ${item.label === 'Overview' ? 'text-white' : 'text-amber-600 dark:text-amber-400'}`} />
                                    </div>
                                    <span className="flex-1">{item.label}</span>
                                    <ChevronLeft className="w-3 h-3 opacity-0 group-hover:opacity-40 -rotate-90 transition-opacity" />
                                </NavLink>
                            ))}
                        </nav>
                    </div>

                    {/* Settings Link */}
                    <div className="p-4 border-t border-amber-100 dark:border-gray-800 flex-shrink-0">
                        <Link
                            to="/settings"
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-amber-100 dark:hover:bg-gray-800 transition-colors text-sm"
                        >
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 md:ml-72">
                {/* Mobile Header */}
                <header className="md:hidden h-16 flex items-center justify-between border-b border-amber-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl supports-[backdrop-filter]:backdrop-blur-xl px-4 flex-shrink-0 z-40">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 rounded-lg hover:bg-amber-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div>
                            <span className="font-semibold text-gray-900 dark:text-white">
                                {loading ? 'Loading...' : classData?.title || classData?.name}
                            </span>
                            <div className="text-xs text-amber-600 dark:text-amber-400">Class Portal</div>
                        </div>
                    </div>
                    <Link
                        to="/settings"
                        className="p-2 rounded-xl hover:bg-amber-100 dark:hover:bg-gray-800 text-amber-600 dark:text-amber-400"
                    >
                        <Settings className="w-5 h-5" />
                    </Link>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-6 overflow-auto">
                    <Outlet context={{ classData, loading }} />
                </main>
            </div>
        </div>
    );
}