import { useState, useEffect } from 'react'
import { Outlet, Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, FileText, Video, Edit3, Award, TrendingUp, Bot,
  Users, Database, BarChart3, Eye, Settings, LogOut,
  Menu, Search, Bell, User, ChevronDown, X,
  GraduationCap, Sun, Moon, ArrowRight, Crown, BookOpen, Star
} from 'lucide-react'
import Switch from '@mui/material/Switch'
import api from '../lib/api'
import Footer from './Footer.jsx'

export default function Layout() {
  const { user, logout } = useAuth()
  const [dark, setDark] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications/me')
      setNotifications(res.data.data || [])
      setUnreadCount(res.data.data.filter(n => !n.is_read).length)
    } catch (error) {
      console.error('Failed to fetch notifications', error)
    }
  }

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`)
      setNotifications(notifications.map(n => n._id === id ? { ...n, is_read: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Failed to mark notification as read', error)
      // Still update UI optimistically
      setNotifications(notifications.map(n => n._id === id ? { ...n, is_read: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }

  useEffect(() => {
    if (user) {
      fetchNotifications()
      // Poll every minute
      const interval = setInterval(fetchNotifications, 60000)
      return () => clearInterval(interval)
    }
  }, [user])

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  if (!user) return (
    <div className="min-h-screen bg-amber-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      <PublicNavbar dark={dark} setDark={setDark} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )

  return (
    <div className="min-h-screen flex bg-amber-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out md:transform-none border-r border-amber-200 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl supports-[backdrop-filter]:backdrop-blur-xl ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} h-screen overflow-hidden`}>
        <div className="h-full flex flex-col max-h-screen">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-amber-100 dark:border-gray-800 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-xl tracking-tight">Concept Master</div>
                  <div className="text-xs opacity-60 capitalize">{user?.role} Portal</div>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden p-2 rounded-lg hover:bg-amber-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-gray-800 rounded-xl">
              <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="font-semibold text-sm truncate">{user?.name}</div>
                  {user?.isPremium && (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full">
                      <Crown className="w-3 h-3 text-white" />
                      <span className="text-[10px] font-bold text-white uppercase">Pro</span>
                    </div>
                  )}
                </div>
                <div className="text-xs opacity-60 capitalize">{user?.role}</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            <NavLinks role={user?.role} />
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-amber-100 dark:border-gray-800 flex-shrink-0">
            <div className="space-y-2">
              <Link
                to="/settings"
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-amber-100 dark:hover:bg-gray-800 transition-colors text-sm"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-72">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between border-b border-amber-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl supports-[backdrop-filter]:backdrop-blur-xl px-4 lg:px-6 flex-shrink-0 z-40 md:z-[60] relative">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-lg hover:bg-amber-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search Bar */}
            <div className="hidden sm:flex items-center gap-2 bg-amber-50 dark:bg-gray-800 rounded-lg px-3 py-2 w-64 lg:w-80">
              <Search className="w-4 h-4 opacity-60" />
              <input
                type="text"
                placeholder="Search anything..."
                className="bg-transparent outline-none flex-1 text-sm placeholder-amber-500 dark:placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-lg hover:bg-amber-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setNotificationsOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-amber-200 dark:border-gray-800 z-[100] overflow-hidden"
                    >
                      <div className="p-4 border-b border-amber-200 dark:border-gray-800 flex items-center justify-between">
                        <h3 className="font-semibold">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 rounded-full font-medium">
                            {unreadCount} new
                          </span>
                        )}
                      </div>

                      <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                            <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                            <p className="text-sm">No notifications yet</p>
                          </div>
                        ) : (
                          <div className="divide-y divide-amber-100 dark:divide-gray-800">
                            {notifications.map((notification) => (
                              <div
                                key={notification._id || notification.id}
                                className={`p-4 hover:bg-amber-50 dark:hover:bg-gray-800/50 transition-colors ${!notification.is_read ? 'bg-amber-50/50 dark:bg-amber-900/10' : ''}`}
                                onClick={() => !notification.is_read && markAsRead(notification._id || notification.id)}
                              >
                                <div className="flex gap-3">
                                  <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!notification.is_read ? 'bg-amber-500' : 'bg-transparent'}`} />
                                  <div className="flex-1 space-y-1">
                                    <p className={`text-sm ${!notification.is_read ? 'font-semibold text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}`}>
                                      {notification.title}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-2">
                                      {notification.message}
                                    </p>
                                    <p className="text-[10px] text-gray-400">
                                      {new Date(notification.createdAt).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle - Single Icon */}
            <button
              onClick={() => setDark(!dark)}
              className="p-2 rounded-lg hover:bg-amber-100 dark:hover:bg-gray-800 transition-colors"
            >
              {dark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* User Avatar */}
            <div className="hidden sm:flex items-center gap-3 px-3 py-2 bg-amber-50 dark:bg-gray-800 rounded-lg">
              <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium hidden lg:block">{user?.name}</div>
                {user?.isPremium && (
                  <Crown className="w-4 h-4 text-amber-500" title="Premium User" />
                )}
              </div>
              <ChevronDown className="w-4 h-4 opacity-60" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function NavLinks({ role }) {
  const getNavItems = () => {
    const baseItems = [
      {
        title: 'Dashboard',
        href: '/dashboard',
      }
    ]

    if (role === 'student') {
      return [
        {
          items: [
            ...baseItems,
            { title: 'Books', href: '/student/books' },
            { title: 'My Notes', href: '/student/notes' },
            { title: 'Lectures', href: '/student/lectures' },
            { title: 'Quizzes', href: '/student/quizzes' },
            { title: 'Results', href: '/student/results' },
            { title: 'Performance', href: '/student/performance' },
            { title: 'Concept Master AI', href: '/student/ai-tutor' }
          ]
        }
      ]
    }

    if (role === 'admin') {
      return [
        {
          label: 'Overview',
          items: [
            ...baseItems,
            { title: 'System Overview', href: '/admin/system-overview' },
            { title: 'Analytics', href: '/admin/analytics' },
          ]
        },
        {
          label: 'Content',
          items: [
            { title: 'Upload Notes', href: '/admin/upload-notes' },
            { title: 'Upload Lectures', href: '/admin/upload-lectures' },
            { title: 'Create Quiz', href: '/admin/create-quiz' },
          ]
        },
        {
          label: 'Management',
          items: [
            { title: 'Manage Users', href: '/admin/manage-users' },
            { title: 'Manage Books', href: '/admin/manage-books' },
            { title: 'Manage Classes', href: '/admin/manage-classes' },
            { title: 'Manage Subjects', href: '/admin/manage-subjects' },
            { title: 'Manage Chapters', href: '/admin/manage-chapters' },
            { title: 'Manage Notes', href: '/admin/manage-notes' },
            { title: 'Manage Quizzes', href: '/admin/manage-quizzes' },
            { title: 'Student Attempts', href: '/admin/student-attempts' },
            { title: 'Feature Control', href: '/admin/feature-control' },
          ]
        }
      ]
    }
    return []
  }

  const navGroups = getNavItems()

  return (
    <nav className="space-y-6">
      {navGroups.map((group, groupIndex) => (
        <div key={groupIndex}>
          {group.label && (
            <h3 className="px-4 mb-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
              {group.label}
            </h3>
          )}
          <div className="space-y-1">
            {group.items.map((item, index) => (
              <NavLink
                key={index}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-amber-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }`
                }
              >
                {item.title === 'Books' && <BookOpen className="w-4 h-4" />}
                {item.title === 'Dashboard' && <Home className="w-4 h-4" />}
                {item.title === 'My Notes' && <FileText className="w-4 h-4" />}
                {item.title === 'Lectures' && <Video className="w-4 h-4" />}
                {item.title === 'Quizzes' && <Edit3 className="w-4 h-4" />}
                {item.title === 'Results' && <Award className="w-4 h-4" />}
                {item.title === 'Performance' && <TrendingUp className="w-4 h-4" />}
                {item.title === 'Concept Master AI' && <Bot className="w-4 h-4" />}
                {item.title === 'System Overview' && <Eye className="w-4 h-4" />}
                {item.title === 'Analytics' && <BarChart3 className="w-4 h-4" />}
                {item.title === 'Upload Notes' && <FileText className="w-4 h-4" />}
                {item.title === 'Upload Lectures' && <Video className="w-4 h-4" />}
                {item.title === 'Create Quiz' && <Edit3 className="w-4 h-4" />}
                {item.title === 'Manage Users' && <Users className="w-4 h-4" />}
                {item.title === 'Manage Books' && <BookOpen className="w-4 h-4" />}
                {item.title === 'Manage Classes' && <GraduationCap className="w-4 h-4" />}
                {item.title === 'Manage Subjects' && <Database className="w-4 h-4" />}
                {item.title === 'Manage Chapters' && <Database className="w-4 h-4" />}
                {item.title === 'Manage Notes' && <FileText className="w-4 h-4" />}
                {item.title === 'Manage Quizzes' && <Edit3 className="w-4 h-4" />}
                {item.title === 'Student Attempts' && <Award className="w-4 h-4" />}
                {item.title === 'Feature Control' && <Settings className="w-4 h-4" />}
                
                <span className="flex-1">{item.title}</span>
                <ChevronDown className="w-3 h-3 opacity-0 group-hover:opacity-40 -rotate-90 transition-opacity" />
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>
  )
}

function PublicNavbar({ dark, setDark }) {
  return (
    <header className=" top-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-2xl supports-[backdrop-filter]:backdrop-blur-2xl border-b border-amber-200/50 dark:border-gray-800/50 shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 h-20 flex items-center justify-between gap-4">
        {/* Website Name Only - No Logo */}
        <div>
          <span className="text-lg md:text-2xl font-black tracking-tight text-gray-900 dark:text-white block leading-none">
            Concept Master
          </span>
        </div>

        <nav className="hidden lg:flex items-center gap-2">
          {[
            { to: '/', label: 'Home' },
            { to: '/books', label: 'Books' },
            { to: '/classes', label: 'Classes' },
            { to: '/reviews', label: 'Reviews' },
            { to: '/pricing', label: 'Pricing' }
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4 flex-1 lg:flex-none">
          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-sm">
            <form action="/books" className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-400 group-focus-within:text-amber-500 transition-colors duration-200" />
              <input
                name="q"
                placeholder="Search books, classes, notes..."
                className="w-full pl-12 pr-5 py-3 rounded-xl bg-amber-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-amber-500/20 border border-amber-200 dark:border-gray-700 focus:border-amber-300 dark:focus:border-amber-600 transition-all duration-200 text-sm placeholder-amber-500 dark:placeholder-gray-400 focus:bg-white dark:focus:bg-gray-750 shadow-sm focus:shadow-md"
              />
            </form>
          </div>

          {/* Theme Toggle & Login */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle - Single Icon */}
            <button
              onClick={() => setDark(!dark)}
              className="p-2 rounded-lg hover:bg-amber-100 dark:hover:bg-gray-800 transition-colors"
            >
              {dark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <Link
              to="/login"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all duration-200 shadow-md text-sm"
            >
              <span>Login</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}