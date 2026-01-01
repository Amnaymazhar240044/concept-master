import { useEffect, useState } from 'react'
import api from '../../lib/api'
import { 
  Search, ChevronLeft, ChevronRight, Eye, 
  Users, TrendingUp, Award, Clock, GraduationCap,
  Sparkles, Brain, Target, AlertCircle, CheckCircle,
  BarChart3, Calendar, User
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function StudentAttempts() {
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalAttempts, setTotalAttempts] = useState(0)
  const [averageScore, setAverageScore] = useState(0)

  const fetchAttempts = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/admin/attempts', {
        params: { page, limit: 10, search }
      })
      setAttempts(data.data || [])
      setTotalPages(Math.ceil(data.total / 10))
      setTotalAttempts(data.total || 0)
      
      // Calculate average score
      if (data.data?.length > 0) {
        const avg = data.data.reduce((sum, attempt) => sum + (attempt.percentage || 0), 0) / data.data.length
        setAverageScore(Math.round(avg))
      }
    } catch (error) {
      console.error("Failed to fetch attempts", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchAttempts()
    }, 300)
    return () => clearTimeout(timeout)
  }, [page, search])

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'from-emerald-500 to-green-600'
    if (percentage >= 60) return 'from-amber-500 to-orange-600'
    return 'from-red-500 to-rose-600'
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-md">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 dark:from-amber-200 dark:to-orange-200 bg-clip-text text-transparent">
              Student Attempts
            </h1>
            <p className="text-amber-600/70 dark:text-amber-400/70">View and manage all student quiz attempts</p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gradient-to-br from-white to-amber-50 dark:from-gray-800/50 dark:to-amber-950/10 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-900 dark:text-amber-50">{totalAttempts}</div>
                <div className="text-sm text-amber-600/70 dark:text-amber-400/70">Total Attempts</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-amber-50 dark:from-gray-800/50 dark:to-amber-950/10 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-900 dark:text-amber-50">{averageScore}%</div>
                <div className="text-sm text-amber-600/70 dark:text-amber-400/70">Average Score</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-amber-50 dark:from-gray-800/50 dark:to-amber-950/10 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-900 dark:text-amber-50">{totalPages}</div>
                <div className="text-sm text-amber-600/70 dark:text-amber-400/70">Total Pages</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
          <input
            type="text"
            placeholder="Search student or quiz..."
            className="pl-9 pr-4 py-2 rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none w-full text-amber-900 dark:text-amber-100 placeholder-amber-500/60 dark:placeholder-amber-400/40"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Table Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-800 shadow-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 text-amber-600 dark:text-amber-400 font-medium border-b border-amber-200 dark:border-amber-800">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Student</th>
                <th className="px-6 py-4 text-left font-semibold">Quiz Title</th>
                <th className="px-6 py-4 text-left font-semibold">Score</th>
                <th className="px-6 py-4 text-left font-semibold">Date</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100 dark:divide-amber-800/30">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 mb-3 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-lg animate-pulse border border-amber-200 dark:border-amber-800"></div>
                      <span className="text-amber-600/70 dark:text-amber-400/70">Loading attempts...</span>
                    </div>
                  </td>
                </tr>
              ) : attempts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 mb-3 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-full flex items-center justify-center mx-auto">
                        <Eye className="w-6 h-6 text-amber-400" />
                      </div>
                      <h3 className="text-lg font-medium text-amber-900 dark:text-amber-100 mb-2">No attempts found</h3>
                      <p className="text-amber-600/70 dark:text-amber-400/70">
                        {search ? 'Try adjusting your search terms' : 'Student attempts will appear here'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                attempts.map((attempt) => (
                  <motion.tr 
                    key={attempt._id} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-orange-50/50 dark:hover:from-amber-900/10 dark:hover:to-orange-900/10 transition-all duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                          <User className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <div className="font-medium text-amber-900 dark:text-amber-50">{attempt.student_id?.name || 'Unknown'}</div>
                          <div className="text-xs text-amber-600/70 dark:text-amber-400/70">{attempt.student_id?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                          <GraduationCap className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                        </div>
                        <span className="text-amber-800 dark:text-amber-200">
                          {attempt.quiz_id?.title || 'Deleted Quiz'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getScoreColor(attempt.percentage)} text-white inline-flex items-center gap-1`}>
                        <Target className="w-3 h-3" />
                        {attempt.percentage}%
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-amber-600/70 dark:text-amber-400/70">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(attempt.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-all duration-200 group">
                        <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/10 dark:to-orange-900/10 flex items-center justify-between">
          <span className="text-sm text-amber-600/70 dark:text-amber-400/70">
            Page {page} of {totalPages} • {totalAttempts} total attempts
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-amber-300 dark:border-amber-700 disabled:opacity-50 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-600 dark:text-amber-400 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-amber-300 dark:border-amber-700 disabled:opacity-50 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-600 dark:text-amber-400 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Summary Footer */}
      {attempts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-4 border-t border-amber-200 dark:border-amber-800"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-amber-600/70 dark:text-amber-400/70">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span>Monitoring student performance helps identify learning patterns</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Showing {attempts.length} attempts on page {page}</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}