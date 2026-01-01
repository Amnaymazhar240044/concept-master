import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../lib/api'
import { motion } from 'framer-motion'
import {
  Users, BookOpen, GraduationCap, Shield, TrendingUp, Activity,
  AlertCircle, CheckCircle, Clock, FileText, Video, Edit3, Eye,
  Database, ArrowRight, Plus, Settings, Bell, Search, MoreVertical,
  Sparkles, Target, Award, Brain, Zap, Shield as ShieldIcon
} from 'lucide-react'

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null)
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewRes, activityRes] = await Promise.all([
          api.get('/analytics/system/overview').catch(() => ({ data: null })),
          api.get('/admin/dashboard/activity').catch(() => ({ data: [] }))
        ])
        setOverview(overviewRes.data)
        setRecentActivity(activityRes.data || [])
      } catch (error) {
        console.error("Dashboard data fetch error", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const stats = [
    { 
      label: 'Total Users', 
      value: overview?.total_users || 0, 
      icon: Users, 
      color: 'text-amber-600', 
      bg: 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20',
      border: 'border-amber-200 dark:border-amber-800'
    },
    { 
      label: 'Active Students', 
      value: overview?.total_students || 0, 
      icon: GraduationCap, 
      color: 'text-orange-600', 
      bg: 'bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20',
      border: 'border-orange-200 dark:border-orange-800'
    },
    { 
      label: 'Total Content', 
      value: (overview?.total_notes || 0) + (overview?.total_lectures || 0), 
      icon: BookOpen, 
      color: 'text-amber-700', 
      bg: 'bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-900/15 dark:to-orange-900/15',
      border: 'border-amber-200/70 dark:border-amber-800/70'
    },
    { 
      label: 'System Health', 
      value: '98%', 
      icon: ShieldIcon, 
      color: 'text-emerald-600', 
      bg: 'bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20',
      border: 'border-emerald-200 dark:border-emerald-800'
    },
  ]

  const quickActions = [
    { 
      title: 'Add New User', 
      icon: Plus, 
      href: '/admin/manage-users', 
      bg: 'bg-gradient-to-r from-amber-600 to-orange-600',
      hover: 'hover:from-amber-700 hover:to-orange-700'
    },
    { 
      title: 'Upload Notes', 
      icon: FileText, 
      href: '/admin/upload-notes', 
      bg: 'bg-gradient-to-r from-amber-500 to-orange-500',
      hover: 'hover:from-amber-600 hover:to-orange-600'
    },
    { 
      title: 'Create Quiz', 
      icon: Edit3, 
      href: '/admin/create-quiz', 
      bg: 'bg-gradient-to-r from-orange-500 to-amber-500',
      hover: 'hover:from-orange-600 hover:to-amber-600'
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-orange-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-amber-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 dark:from-amber-200 dark:to-orange-200 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-amber-700 dark:text-amber-300 mt-1">Welcome back, Admin. Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 shadow-sm border border-amber-200 dark:border-amber-800 transition-all hover:shadow-md hover:scale-105">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 shadow-sm border border-amber-200 dark:border-amber-800 transition-all hover:shadow-md hover:scale-105 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
            </button>
            <Link 
              to="/settings" 
              className="p-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 shadow-sm border border-amber-200 dark:border-amber-800 transition-all hover:shadow-md hover:scale-105"
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl p-6 shadow-lg border border-amber-200 dark:border-amber-800 hover:shadow-xl transition-all duration-300 hover:border-amber-300 dark:hover:border-amber-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} border ${stat.border}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +2.5%
                </span>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-amber-900 dark:text-amber-50 mb-1">
                  {loading ? '...' : stat.value}
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Activity & Charts (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl shadow-lg border border-amber-200 dark:border-amber-800 overflow-hidden"
            >
              <div className="p-6 border-b border-amber-200 dark:border-amber-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h2 className="text-lg font-bold text-amber-900 dark:text-amber-50">Recent Activity</h2>
                </div>
                <button className="text-sm font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors">
                  View All
                </button>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex gap-4 animate-pulse">
                        <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/20 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-amber-100 dark:bg-amber-900/20 rounded w-3/4"></div>
                          <div className="h-3 bg-amber-100 dark:bg-amber-900/20 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentActivity.length > 0 ? (
                  <div className="relative border-l-2 border-amber-200 dark:border-amber-800 ml-3 space-y-8">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="relative pl-8">
                        <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${
                          activity.type === 'notes' ? 'bg-amber-500' :
                          activity.type === 'quiz' ? 'bg-orange-500' :
                          'bg-emerald-500'
                        }`}></div>
                        <div>
                          <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                            {activity.action} <span className="text-amber-600/70 dark:text-amber-400/70 font-normal">on</span> {activity.item}
                          </p>
                          <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-amber-200 dark:border-amber-800">
                      <Clock className="w-6 h-6 text-amber-400" />
                    </div>
                    <p className="text-amber-600/70 dark:text-amber-400/70 text-sm">No recent activity found</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* System Health Compact */}
            <div className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl p-6 shadow-lg border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-lg font-bold text-amber-900 dark:text-amber-50">System Status</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Database', status: 'Operational', color: 'bg-emerald-500' },
                  { label: 'API Gateway', status: 'Operational', color: 'bg-emerald-500' },
                  { label: 'Storage', status: 'Warning', color: 'bg-amber-500' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gradient-to-br from-amber-50/50 to-white dark:from-amber-900/10 dark:to-gray-800/30 rounded-xl border border-amber-200 dark:border-amber-800">
                    <span className="text-sm font-medium text-amber-900 dark:text-amber-100">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                      <span className="text-xs text-amber-600/70 dark:text-amber-400/70">{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Quick Actions (1/3) */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl shadow-lg border border-amber-200 dark:border-amber-800 p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <h2 className="text-lg font-bold text-amber-900 dark:text-amber-50">Quick Actions</h2>
              </div>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.href}
                    className="flex items-center gap-4 p-3 rounded-xl bg-gradient-to-br from-white to-amber-50 dark:from-gray-800/50 dark:to-amber-950/10 hover:from-white hover:to-amber-100 dark:hover:from-gray-800 dark:hover:to-amber-950/30 border border-amber-200 dark:border-amber-800 transition-all duration-300 hover:shadow-md hover:border-amber-300 dark:hover:border-amber-700 group"
                  >
                    <div className={`w-10 h-10 rounded-lg ${action.bg} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-100">{action.title}</h3>
                      <p className="text-xs text-amber-600/70 dark:text-amber-400/70">Manage {action.title.toLowerCase()}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-amber-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Quick Stats Widget */}
            <div className="bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl p-6 text-white shadow-lg border border-amber-500 dark:border-amber-700">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Target className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-lg">Quick Stats</h3>
                </div>
                <Award className="w-5 h-5 text-amber-200" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/20">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-200" />
                    <span className="text-sm font-medium text-amber-100">Total Notes</span>
                  </div>
                  <span className="text-xl font-bold">{overview?.total_notes || 0}</span>
                </div>
                <div className="flex items-center justify-between bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/20">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-amber-200" />
                    <span className="text-sm font-medium text-amber-100">Total Lectures</span>
                  </div>
                  <span className="text-xl font-bold">{overview?.total_lectures || 0}</span>
                </div>
                <Link 
                  to="/admin/upload-notes" 
                  className="block w-full py-3 bg-white text-amber-700 rounded-xl text-sm font-bold hover:bg-amber-50 transition-all duration-300 hover:scale-[1.02] text-center shadow-md"
                >
                  Upload New Content
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}