import { useEffect, useState } from 'react'
import api from '../../lib/api'
import Card from '../../components/ui/Card.jsx'
import { motion } from 'framer-motion'
import { 
  CheckCircle, Clock, Calendar, FileText, Award, TrendingUp, 
  Brain, Target, Sparkles, BrainCircuit, Trophy, GraduationCap,
  BarChart3, Zap, Star, Rocket, Users, TargetIcon
} from 'lucide-react'

export default function Results() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    bestScore: 0,
    recentAttempts: 0
  })

  useEffect(() => {
    api.get('/results/students/me/attempts')
      .then(r => {
        const data = r.data.data || []
        setItems(data)
        
        // Calculate statistics
        const totalQuizzes = data.length
        const averageScore = totalQuizzes > 0
          ? (data.reduce((sum, item) => sum + (item.percentage || 0), 0) / totalQuizzes).toFixed(1)
          : 0
        const bestScore = totalQuizzes > 0
          ? Math.max(...data.map(item => item.percentage || 0))
          : 0
        
        setStats({
          totalQuizzes,
          averageScore: parseFloat(averageScore),
          bestScore,
          recentAttempts: data.filter(item => {
            const date = item.completed_at || item.started_at
            if (!date) return false
            const daysDiff = (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24)
            return daysDiff <= 7 // Last 7 days
          }).length
        })
      })
      .catch(() => { })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800 shadow-lg"
        >
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center mb-6">
              <BrainCircuit className="w-8 h-8 text-amber-400 animate-spin" />
            </div>
            <span className="text-amber-600/70 dark:text-amber-400/70">Loading your results...</span>
          </div>
        </motion.div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-md">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 dark:from-amber-200 dark:to-orange-200 bg-clip-text text-transparent">
                My Results
              </h1>
              <p className="text-amber-600/70 dark:text-amber-400/70">Track your quiz performance and progress</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 border-2 border-dashed border-amber-300 dark:border-amber-700 rounded-2xl bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-amber-400" />
          </div>
          <h3 className="text-lg font-medium text-amber-900 dark:text-amber-100 mb-2">
            No Quiz Results Yet
          </h3>
          <p className="text-amber-600/70 dark:text-amber-400/70 mb-4">
            Complete quizzes to see your results here
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-amber-500">
            <Brain className="w-4 h-4" />
            <span>Start with quizzes to track your progress</span>
          </div>
        </motion.div>
      </div>
    )
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
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 dark:from-amber-200 dark:to-orange-200 bg-clip-text text-transparent">
              My Results
            </h1>
            <p className="text-amber-600/70 dark:text-amber-400/70">Track your quiz performance and progress</p>
          </div>
        </div>
      </motion.div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 shadow-lg h-full">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600/70 dark:text-amber-400/70">Total Quizzes</p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.totalQuizzes}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                <FileText className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="border border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-white to-emerald-50/50 dark:from-gray-800 dark:to-emerald-950/20 shadow-lg h-full">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600/70 dark:text-emerald-400/70">Average Score</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.averageScore}%</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 shadow-lg h-full">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600/70 dark:text-amber-400/70">Best Score</p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.bestScore}%</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                <Star className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 shadow-lg h-full">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600/70 dark:text-amber-400/70">This Week</p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.recentAttempts}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                <Zap className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Results List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Card className="border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center shadow-sm">
                <BarChart3 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-50">Quiz History</h3>
                <p className="text-sm text-amber-600/70 dark:text-amber-400/70">Your complete quiz attempt history</p>
              </div>
            </div>

            <div className="space-y-4">
              {items.map(attempt => {
                const percentage = attempt.percentage || 0
                const isGoodScore = percentage >= 70
                const completedDate = attempt.completed_at || attempt.started_at

                return (
                  <motion.div
                    key={attempt._id || attempt.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`rounded-xl p-4 transition-all duration-200 hover:shadow-lg border-2 ${isGoodScore
                      ? 'border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50/50 to-green-50/50 dark:from-emerald-900/10 dark:to-green-900/10'
                      : 'border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-900/10 dark:to-orange-900/10'
                      }`}
                  >
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-lg font-semibold text-amber-900 dark:text-amber-50 truncate">
                              {attempt.quiz_id?.title || attempt.quiz?.title || 'Quiz'}
                            </h4>
                            {(attempt.quiz_id?.type || attempt.quiz?.type) === 'SHORT_ANSWER' && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-300">
                                AI Graded
                              </span>
                            )}
                          </div>
                          {(attempt.quiz_id?.description || attempt.quiz?.description) && (
                            <p className="text-sm text-amber-600/70 dark:text-amber-400/70 mt-1 line-clamp-2">
                              {attempt.quiz_id?.description || attempt.quiz?.description}
                            </p>
                          )}
                        </div>

                        {/* Score Badge */}
                        <div className={`flex-shrink-0 px-4 py-2 rounded-xl font-bold text-lg shadow-sm ${isGoodScore
                          ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white'
                          : 'bg-gradient-to-r from-amber-600 to-orange-600 text-white'
                          }`}>
                          {percentage}%
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Score */}
                        <div className="flex items-center gap-2 text-sm">
                          <Award className={`w-4 h-4 ${isGoodScore ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`} />
                          <span className="text-amber-700 dark:text-amber-300">
                            Score: <span className="font-semibold">{attempt.score}</span>
                          </span>
                        </div>

                        {/* Quiz Type */}
                        {(attempt.quiz_id?.type || attempt.quiz?.type) && (
                          <div className="flex items-center gap-2 text-sm">
                            <Brain className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                            <span className="text-amber-700 dark:text-amber-300">
                              Type: <span className="font-semibold">
                                {(attempt.quiz_id?.type || attempt.quiz?.type) === 'SHORT_ANSWER' ? 'Short Answer' : 'MCQ'}
                              </span>
                            </span>
                          </div>
                        )}

                        {/* Date */}
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          <span className="text-amber-700 dark:text-amber-300">
                            {completedDate
                              ? new Date(completedDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })
                              : 'No date'}
                          </span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center justify-between pt-3 border-t border-amber-200 dark:border-amber-800">
                        <div className="flex items-center gap-2">
                          <CheckCircle className={`w-4 h-4 ${isGoodScore ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`} />
                          <span className={`text-sm font-medium ${isGoodScore ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'}`}>
                            {isGoodScore ? 'Great Job!' : 'Keep Practicing'}
                          </span>
                        </div>

                        {completedDate && (
                          <div className="flex items-center gap-1 text-xs text-amber-600/70 dark:text-amber-400/70">
                            <Clock className="w-3 h-3" />
                            <span>
                              {new Date(completedDate).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Performance Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
        className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center shadow-sm">
            <BrainCircuit className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-50">Performance Insights</h3>
            <p className="text-sm text-amber-600/70 dark:text-amber-400/70">Tips to improve your learning journey</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/30 dark:from-gray-800/30 dark:to-amber-950/10">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-amber-900 dark:text-amber-50">Set Goals</span>
            </div>
            <p className="text-sm text-amber-600/70 dark:text-amber-400/70">
              Aim for a 5% improvement in your average score each week
            </p>
          </div>
          
          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/30 dark:from-gray-800/30 dark:to-amber-950/10">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-medium text-amber-900 dark:text-amber-50">Review Mistakes</span>
            </div>
            <p className="text-sm text-amber-600/70 dark:text-amber-400/70">
              Focus on questions you got wrong and learn from them
            </p>
          </div>
        </div>
      </motion.div>

      {/* Summary Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-4 border-t border-amber-200 dark:border-amber-800"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-amber-600/70 dark:text-amber-400/70">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Regular practice and review are key to continuous improvement</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <TargetIcon className="w-4 h-4" />
              <span>Target: 85% Average</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Top {Math.round((stats.averageScore / 100) * 100)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4" />
              <span>Keep Going!</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}