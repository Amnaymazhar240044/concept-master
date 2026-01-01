import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../../lib/api'
import Card from '../../components/ui/Card.jsx'
import { motion } from 'framer-motion'
import { Clock, BookOpen, PlayCircle, CheckCircle, AlertCircle, Filter, Search, TrendingUp, GraduationCap, Calendar, Tag, FolderOpen, ArrowLeft, Lock, Crown, Sparkles, Brain, Target, Award, Zap, Users } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function QuizList() {
  const { user } = useAuth()
  const { classId } = useParams()
  const [items, setItems] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [featureSettings, setFeatureSettings] = useState([])
  const [checkingFeature, setCheckingFeature] = useState(true)

  // Fetch Feature Settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/feature-control')
        setFeatureSettings(res.data.data || [])
      } catch (error) {
        console.error('Failed to fetch feature settings', error)
      } finally {
        setCheckingFeature(false)
      }
    }
    fetchSettings()
  }, [])

  useEffect(() => {
    const loadClasses = async () => {
      setLoading(true)
      try {
        const timestamp = Date.now()
        const c = await api.get(`/classes?t=${timestamp}`)
        setClasses(c.data || [])
      } catch (e) {
        console.error('QuizList - Classes error:', e)
      }
      setLoading(false)
    }
    loadClasses()
  }, [])

  useEffect(() => {
    const loadQuizzes = async () => {
      if (!classId) { setItems([]); return }
      setLoading(true)
      try {
        const timestamp = Date.now()
        const r = await api.get(`/quizzes?t=${timestamp}`, { params: { class_id: classId } })
        setItems(r.data.data || [])
      } catch (e) {
        console.error('QuizList - Quizzes error:', e)
      }
      setLoading(false)
    }
    loadQuizzes()
  }, [classId])

  const filteredItems = items.filter(quiz => {
    const matchesSearch = quiz.title?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || quiz.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const currentClass = classes.find(c => String(c._id || c.id) === String(classId))

  // Check Feature Access
  const quizzesFeature = featureSettings.find(f => f.featureName === 'quizzes')
  const shortAnswerFeature = featureSettings.find(f => f.featureName === 'shortAnswerQuiz')
  const isLocked = quizzesFeature?.isPremium && !user?.isPremium && user?.role !== 'admin'

  if (checkingFeature) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center mb-4">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <span className="text-amber-600/70 dark:text-amber-400/70">Checking access...</span>
      </div>
    )
  }

  if (isLocked) {
    return (
      <div className="max-w-4xl mx-auto mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10 rounded-2xl p-8 md:p-12 border-2 border-amber-200 dark:border-amber-800 shadow-2xl text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full shadow-lg mb-6 bg-gradient-to-br from-amber-600 to-orange-600">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 dark:from-amber-200 dark:to-orange-200 bg-clip-text text-transparent mb-4">
            Premium Feature
          </h1>
          <p className="text-lg text-amber-600/70 dark:text-amber-400/70 mb-8 max-w-2xl mx-auto">
            Access to interactive quizzes is available exclusively for Premium members. Upgrade now to test your knowledge.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/pricing"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
            >
              <Crown className="w-5 h-5" />
              Upgrade to Premium
            </Link>
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold border transition-all bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10 text-amber-900 dark:text-amber-50 hover:text-amber-700 dark:hover:text-amber-300 border-amber-200 dark:border-amber-800 hover:border-amber-300 dark:hover:border-amber-700"
            >
              Back to Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'from-emerald-500 to-green-500'
      case 'draft': return 'from-gray-500 to-gray-600'
      case 'archived': return 'from-red-500 to-pink-500'
      default: return 'from-blue-500 to-cyan-500'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'published': return <CheckCircle className="w-4 h-4" />
      case 'draft': return <AlertCircle className="w-4 h-4" />
      case 'archived': return <AlertCircle className="w-4 h-4" />
      default: return <BookOpen className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {!classId ? (
        <div className="space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-md">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 dark:from-amber-200 dark:to-orange-200 bg-clip-text text-transparent">Available Quizzes</h1>
                  <p className="text-amber-600/70 dark:text-amber-400/70 mt-1">Choose your class to view available quizzes</p>
                </div>
              </div>

              {classes.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-amber-600/70 dark:text-amber-400/70">
                  <FolderOpen className="w-4 h-4" />
                  <span>{classes.length} classes available</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Stats Summary */}
          {classes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-amber-900 dark:text-amber-50">Interactive</div>
                    <div className="text-sm text-amber-600/70 dark:text-amber-400/70">Learning</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                    <Target className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-amber-900 dark:text-amber-50">MCQ & Short</div>
                    <div className="text-sm text-amber-600/70 dark:text-amber-400/70">Answer Formats</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-amber-900 dark:text-amber-50">Instant</div>
                    <div className="text-sm text-amber-600/70 dark:text-amber-400/70">Grading</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Classes Grid */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="h-32 rounded-xl animate-pulse bg-gradient-to-br from-amber-100/50 to-orange-100/50 dark:from-amber-900/10 dark:to-orange-900/10"></div>
              ))}
            </div>
          ) : classes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 border-2 border-dashed border-amber-300 dark:border-amber-700 rounded-2xl bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="w-10 h-10 text-amber-400" />
              </div>
              <h3 className="text-lg font-medium text-amber-900 dark:text-amber-100 mb-2">No Classes Available</h3>
              <p className="text-amber-600/70 dark:text-amber-400/70">Please contact your administrator to add classes.</p>
            </motion.div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {classes.map((c, index) => (
                <motion.div
                  key={c._id || c.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    to={`/student/quizzes/${c._id || c.id}`}
                    className="block h-full group"
                  >
                    <div className="h-full bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10 rounded-2xl p-6 border-2 border-amber-200 dark:border-amber-800 hover:shadow-xl transition-all duration-300 hover:border-amber-300 dark:hover:border-amber-700 hover:-translate-y-1">
                      <div className="flex flex-col h-full">
                        <div className="flex-1">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-110 transition-transform">
                            <GraduationCap className="w-6 h-6" />
                          </div>
                          <h3 className="text-lg font-bold mb-2 text-amber-900 dark:text-amber-50 group-hover:text-amber-700 transition-colors">
                            {c.title}
                          </h3>
                          <p className="text-sm text-amber-600/70 dark:text-amber-400/70 mb-4">
                            View and attempt quizzes for this class
                          </p>
                        </div>
                        <div className="flex items-center text-amber-600 dark:text-amber-400 text-sm font-medium group-hover:text-amber-700 transition-colors">
                          <span>View Quizzes</span>
                          <BookOpen className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                      
                      {/* Bottom accent */}
                      <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-4 rounded-full"></div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header with Back Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800 shadow-lg"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Link
                  to="/student/quizzes"
                  className="p-2 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-200 dark:border-amber-800 hover:border-amber-300 transition-colors group"
                >
                  <ArrowLeft className="w-5 h-5 text-amber-600 dark:text-amber-400 group-hover:-translate-x-1 transition-transform" />
                </Link>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-md">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 dark:from-amber-200 dark:to-orange-200 bg-clip-text text-transparent">
                        {currentClass ? `${currentClass.title} Quizzes` : 'Class Quizzes'}
                      </h1>
                      <p className="text-amber-600/70 dark:text-amber-400/70">
                        {currentClass ? `Available quizzes for ${currentClass.title}` : 'Test your knowledge with interactive quizzes'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-400" />
                  <input
                    type="text"
                    placeholder="Search quizzes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-xl bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10 border-2 border-amber-200 dark:border-amber-800 focus:border-amber-400 focus:outline-none transition-colors text-amber-900 dark:text-amber-50"
                  />
                </div>

                {/* Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-xl bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10 border-2 border-amber-200 dark:border-amber-800 focus:border-amber-400 focus:outline-none transition-colors text-amber-900 dark:text-amber-50 appearance-none"
                  >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <div className="text-lg font-bold text-amber-900 dark:text-amber-50">{items.length}</div>
                  <div className="text-sm text-amber-600/70 dark:text-amber-400/70">Total Quizzes</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                  <Target className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <div className="text-lg font-bold text-amber-900 dark:text-amber-50">
                    {items.filter(q => q.status === 'published').length}
                  </div>
                  <div className="text-sm text-amber-600/70 dark:text-amber-400/70">Available</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <div className="text-lg font-bold text-amber-900 dark:text-amber-50">Ready</div>
                  <div className="text-sm text-amber-600/70 dark:text-amber-400/70">to Attempt</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-48 rounded-xl animate-pulse bg-gradient-to-br from-amber-100/50 to-orange-100/50 dark:from-amber-900/10 dark:to-orange-900/10"></div>
              ))}
            </div>
          )}

          {/* Quiz Grid */}
          {!loading && (
            <>
              {filteredItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12 border-2 border-dashed border-amber-300 dark:border-amber-700 rounded-2xl bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-10 h-10 text-amber-400" />
                  </div>
                  <h3 className="text-lg font-medium text-amber-900 dark:text-amber-100 mb-2">
                    {searchTerm || filterStatus !== 'all' ? 'No quizzes found' : 'No quizzes available'}
                  </h3>
                  <p className="text-amber-600/70 dark:text-amber-400/70">
                    {searchTerm || filterStatus !== 'all'
                      ? 'Try adjusting your search or filter criteria'
                      : 'Check back later for new quizzes'}
                  </p>
                </motion.div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((quiz, index) => (
                    <motion.div
                      key={quiz._id || quiz.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="h-full border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10 hover:shadow-xl transition-all duration-300 group hover:border-amber-300 dark:hover:border-amber-700">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getStatusColor(quiz.status)} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                            {getStatusIcon(quiz.status)}
                          </div>
                          <div className="flex flex-col gap-2">
                            <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(quiz.status).replace('from-', 'bg-gradient-to-r from-')} text-white`}>
                              {quiz.status || 'active'}
                            </span>
                            {quiz.type && (
                              <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 ${quiz.type === 'SHORT_ANSWER'
                                ? 'bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-300'
                                : 'bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-700 dark:text-blue-300'
                                }`}>
                                {quiz.type === 'SHORT_ANSWER' ? 'Short Answer' : 'MCQ'}
                              </span>
                            )}
                          </div>
                        </div>

                        <h3 className="text-lg font-bold mb-2 text-amber-900 dark:text-amber-50 group-hover:text-amber-700 transition-colors line-clamp-2">
                          {quiz.title}
                        </h3>

                        {quiz.description && (
                          <p className="text-sm text-amber-600/70 dark:text-amber-400/70 mb-3 line-clamp-2">
                            {quiz.description}
                          </p>
                        )}

                        <div className="space-y-2 mb-4">
                          {/* Class Info */}
                          {quiz.class && (
                            <div className="flex items-center gap-2 text-sm">
                              <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center">
                                <GraduationCap className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                              </div>
                              <span className="font-medium text-amber-900 dark:text-amber-50">{quiz.class.title}</span>
                            </div>
                          )}

                          {/* Subject Info */}
                          {quiz.subject && (
                            <div className="flex items-center gap-2 text-sm">
                              <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
                                <Tag className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                              </div>
                              <span className="text-amber-600/70 dark:text-amber-400/70">{quiz.subject.name}</span>
                            </div>
                          )}

                          {/* Deadline */}
                          {quiz.deadline && (
                            <div className="flex items-center gap-2 text-sm">
                              <div className={`w-6 h-6 rounded flex items-center justify-center ${new Date(quiz.deadline) < new Date()
                                ? 'bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30'
                                : 'bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30'
                                }`}>
                                <Calendar className={`w-3 h-3 ${new Date(quiz.deadline) < new Date()
                                  ? 'text-red-600 dark:text-red-400'
                                  : 'text-amber-600 dark:text-amber-400'
                                  }`} />
                              </div>
                              <span className={`font-medium ${new Date(quiz.deadline) < new Date()
                                ? 'text-red-600 dark:text-red-400'
                                : 'text-amber-600 dark:text-amber-400'
                                }`}>
                                Due: {new Date(quiz.deadline).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-amber-600/70 dark:text-amber-400/70 mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{quiz.duration_minutes || 0} min</span>
                          </div>
                          {quiz.questions_count && (
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              <span>{quiz.questions_count} questions</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-xs text-amber-600/70 dark:text-amber-400/70">
                            Created: {quiz.created_at ? new Date(quiz.created_at).toLocaleDateString() : 'Unknown'}
                          </div>

                          {quiz.type === 'SHORT_ANSWER' && shortAnswerFeature?.isPremium && !user?.isPremium && user?.role !== 'admin' ? (
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 text-sm font-medium cursor-not-allowed relative group">
                              <Lock className="w-4 h-4" />
                              Premium Only
                              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-amber-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                <Crown className="w-3 h-3 inline mr-1" />
                                Upgrade to access short answer quizzes
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-amber-900"></div>
                              </div>
                            </div>
                          ) : (
                            <Link
                              to={`/student/quiz/${quiz._id || quiz.id}`}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-sm font-medium hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group/btn"
                            >
                              <PlayCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                              View Details
                            </Link>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Summary Footer */}
          {items.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-4 border-t border-amber-200 dark:border-amber-800"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-amber-600/70 dark:text-amber-400/70">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  <span>Regular practice leads to mastery and better performance</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-500"></div>
                    <span>Available: {items.filter(q => q.status === 'published').length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span>Total: {items.length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Showing: {filteredItems.length}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}