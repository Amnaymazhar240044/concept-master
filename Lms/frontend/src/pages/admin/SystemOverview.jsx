import { useEffect, useState } from 'react'
import api from '../../lib/api'
import { motion } from 'framer-motion'
import { Users, GraduationCap, BookOpen, FileText, Video, Database, Activity, TrendingUp, Sparkles, Target, Award, Brain, Zap, Clock } from 'lucide-react'

export default function SystemOverview() {
  const [overview, setOverview] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => { 
    api.get('/analytics/system/overview')
      .then(r => {
        setOverview(r.data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      }) 
  }, [])

  const statConfig = {
    total_users: {
      label: 'Total Users',
      icon: Users,
      color: 'from-amber-600 to-orange-600',
      bg: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20',
      trend: '+12.5%'
    },
    total_students: {
      label: 'Active Students',
      icon: GraduationCap,
      color: 'from-amber-500 to-orange-500',
      bg: 'from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20',
      trend: '+8.2%'
    },
    total_teachers: {
      label: 'Teachers',
      icon: Users,
      color: 'from-amber-700 to-orange-700',
      bg: 'from-amber-50/80 to-orange-50/80 dark:from-amber-900/15 dark:to-orange-900/15',
      trend: '+3.1%'
    },
    total_notes: {
      label: 'Study Notes',
      icon: FileText,
      color: 'from-amber-600 to-orange-600',
      bg: 'from-amber-50/60 to-orange-50/60 dark:from-amber-900/10 dark:to-orange-900/10',
      trend: '+24.7%'
    },
    total_lectures: {
      label: 'Video Lectures',
      icon: Video,
      color: 'from-orange-500 to-amber-500',
      bg: 'from-orange-50/80 to-amber-50/80 dark:from-orange-900/15 dark:to-amber-900/15',
      trend: '+18.3%'
    },
    total_quizzes: {
      label: 'Quizzes',
      icon: BookOpen,
      color: 'from-amber-600/80 to-orange-600/80',
      bg: 'from-amber-50/40 to-orange-50/40 dark:from-amber-900/5 dark:to-orange-900/5',
      trend: '+15.6%'
    },
    avg_score: {
      label: 'Avg. Score',
      icon: TrendingUp,
      color: 'from-emerald-500 to-green-500',
      bg: 'from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20',
      trend: '+5.8%'
    },
    active_sessions: {
      label: 'Active Now',
      icon: Activity,
      color: 'from-amber-600 to-orange-600',
      bg: 'from-amber-100/50 to-orange-100/50 dark:from-amber-900/25 dark:to-orange-900/25',
      trend: 'Live'
    }
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl p-6 shadow-lg border border-amber-200 dark:border-amber-800">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
            <Database className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 dark:from-amber-200 dark:to-orange-200 bg-clip-text text-transparent">
            System Overview
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl border border-amber-200 dark:border-amber-800"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!overview) {
    return (
      <div className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl p-6 shadow-lg border border-amber-200 dark:border-amber-800">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
            <Database className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 dark:from-amber-200 dark:to-orange-200 bg-clip-text text-transparent">
            System Overview
          </h2>
        </div>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-amber-200 dark:border-amber-800">
            <Database className="w-8 h-8 text-amber-400" />
          </div>
          <p className="text-amber-600/70 dark:text-amber-400/70">Unable to load system overview data</p>
        </div>
      </div>
    )
  }

  // Filter out unwanted keys and sort by importance
  const entries = Object.entries(overview)
    .filter(([key]) => statConfig[key])
    .sort(([keyA], [keyB]) => {
      const order = ['total_users', 'total_students', 'total_teachers', 'total_notes', 'total_lectures', 'total_quizzes', 'avg_score', 'active_sessions']
      return order.indexOf(keyA) - order.indexOf(keyB)
    })

  return (
    <div className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl p-6 shadow-lg border border-amber-200 dark:border-amber-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
            <Database className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 dark:from-amber-200 dark:to-orange-200 bg-clip-text text-transparent">
              System Overview
            </h2>
            <p className="text-sm text-amber-600/70 dark:text-amber-400/70 mt-1">Real-time platform statistics</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            <Sparkles className="w-3 h-3 mr-1" />
            Live Data
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full border border-amber-200 dark:border-amber-800">
            <Clock className="w-3 h-3 mr-1" />
            Updated just now
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {entries.map(([key, value], index) => {
          const config = statConfig[key]
          const Icon = config.icon

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br ${config.bg} rounded-xl p-4 border border-amber-200 dark:border-amber-800 hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-300 hover:shadow-lg cursor-default group`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {config.trend}
                </span>
              </div>
              
              <div className="mb-4">
                <div className="text-2xl font-bold text-amber-900 dark:text-amber-50 mb-1">
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </div>
                <p className="text-sm text-amber-700/80 dark:text-amber-300/80 font-medium">
                  {config.label}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="relative h-2 bg-amber-100 dark:bg-amber-900/30 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((value / 1000) * 100, 100)}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className={`absolute top-0 left-0 h-full bg-gradient-to-r ${config.color} rounded-full`}
                />
              </div>
              
              {/* Additional Info */}
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-amber-600/60 dark:text-amber-400/60">
                  {value > 1000 ? 'High Activity' : 'Normal Activity'}
                </span>
                <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                  {typeof value === 'number' ? `${Math.round((value / 1000) * 100)}%` : '100%'}
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Summary Footer */}
      <div className="mt-6 pt-6 border-t border-amber-200 dark:border-amber-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-600/70 dark:text-amber-400/70 text-sm">
            <Target className="w-4 h-4" />
            <span>{entries.length} key metrics monitored</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500"></div>
              <span className="text-xs text-amber-600/70 dark:text-amber-400/70">High Growth</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-300 to-orange-300"></div>
              <span className="text-xs text-amber-600/70 dark:text-amber-400/70">Stable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}