import { useEffect, useState } from 'react'
import api from '../../lib/api'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import { motion } from 'framer-motion'
import { 
  Database, Edit3, Trash2, Eye, Clock, AlertCircle, 
  CheckCircle, Search, Filter, BarChart3, Plus, 
  Sparkles, Target, Brain, Zap, Layers, FileText,
  TrendingUp, Users, Award, BookOpen, BrainCircuit
} from 'lucide-react'

export default function ManageQuizzes() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [msg, setMsg] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const response = await api.get('/quizzes')
      setItems(response.data.data || [])
    } catch (error) {
      console.error('Failed to load quizzes:', error)
      setMsg('Failed to load quizzes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const publish = async (id) => {
    try {
      await api.patch(`/quizzes/${id}`, { status: 'published' })
      setMsg('Quiz published successfully!')
      load()
    } catch (error) {
      setMsg('Failed to publish quiz')
    }
  }

  const unpublish = async (id) => {
    try {
      await api.patch(`/quizzes/${id}`, { status: 'draft' })
      setMsg('Quiz set to draft')
      load()
    } catch (error) {
      setMsg('Failed to unpublish quiz')
    }
  }

  const remove = async (id) => {
    if (!confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) return
    try {
      await api.delete(`/quizzes/${id}`)
      setMsg('Quiz deleted successfully!')
      load()
    } catch (error) {
      setMsg('Failed to delete quiz')
    }
  }

  const filteredItems = items.filter(quiz => {
    const matchesSearch = quiz.title?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || quiz.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-gradient-to-r from-emerald-500 to-green-600'
      case 'draft': return 'bg-gradient-to-r from-amber-500 to-orange-600'
      case 'archived': return 'bg-gradient-to-r from-gray-500 to-gray-600'
      default: return 'bg-gradient-to-r from-amber-500 to-orange-600'
    }
  }

  const getStatusBorder = (status) => {
    switch (status) {
      case 'published': return 'border-emerald-200 dark:border-emerald-800'
      case 'draft': return 'border-amber-200 dark:border-amber-800'
      case 'archived': return 'border-gray-200 dark:border-gray-800'
      default: return 'border-amber-200 dark:border-amber-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'published': return <CheckCircle className="w-4 h-4 text-emerald-100" />
      case 'draft': return <Edit3 className="w-4 h-4 text-amber-100" />
      case 'archived': return <AlertCircle className="w-4 h-4 text-gray-100" />
      default: return <Database className="w-4 h-4 text-amber-100" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'published': return 'text-emerald-700 dark:text-emerald-300'
      case 'draft': return 'text-amber-700 dark:text-amber-300'
      case 'archived': return 'text-gray-700 dark:text-gray-300'
      default: return 'text-amber-700 dark:text-amber-300'
    }
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
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 dark:from-amber-200 dark:to-orange-200 bg-clip-text text-transparent">
              Manage Quizzes
            </h1>
            <p className="text-amber-600/70 dark:text-amber-400/70">Publish, edit, or delete your quiz content</p>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      {msg && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`px-4 py-3 rounded-xl border flex items-center gap-3 ${msg.includes('success')
            ? 'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-800/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
            : 'bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
            } shadow-sm`}
        >
          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${msg.includes('success')
            ? 'bg-emerald-100 dark:bg-emerald-900/30'
            : 'bg-red-100 dark:bg-red-900/30'
            }`}>
            {msg.includes('success') ? (
              <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="w-3 h-3 text-red-600 dark:text-red-400" />
            )}
          </div>
          <span>{msg}</span>
        </motion.div>
      )}

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center shadow-sm">
                <Database className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-50">Quizzes</h2>
                <p className="text-sm text-amber-600/70 dark:text-amber-400/70">
                  {filteredItems.length} quiz{filteredItems.length !== 1 ? 'zes' : ''} found
                </p>
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
                  className="pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:outline-none transition-colors text-amber-900 dark:text-amber-100 placeholder-amber-500/60 dark:placeholder-amber-400/40 w-full sm:w-64"
                />
              </div>

              {/* Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:outline-none transition-colors text-amber-900 dark:text-amber-100 appearance-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Quizzes List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div 
                key={index} 
                className="h-32 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl animate-pulse border border-amber-200 dark:border-amber-800"
              ></div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 border-2 border-dashed border-amber-300 dark:border-amber-700 rounded-2xl bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <BrainCircuit className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="text-lg font-medium text-amber-900 dark:text-amber-100 mb-2">
              {searchTerm || filterStatus !== 'all' ? 'No quizzes found' : 'No quizzes available'}
            </h3>
            <p className="text-amber-600/70 dark:text-amber-400/70 mb-4">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Start by creating your first quiz'}
            </p>
            <div className="flex items-center justify-center gap-2 mt-4 text-amber-500">
              <Plus className="w-4 h-4" />
              <span>Create a quiz to get started</span>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((quiz, index) => (
              <motion.div
                key={quiz._id || quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className={`hover:shadow-lg transition-all duration-300 group ${getStatusBorder(quiz.status)} border-2 bg-gradient-to-br from-white to-amber-50/30 dark:from-gray-800/30 dark:to-amber-950/10`}>
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Quiz Info */}
                    <div className="flex-1">
                      {/* Quiz Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-xl ${getStatusColor(quiz.status)} flex items-center justify-center shadow-sm flex-shrink-0`}>
                          {getStatusIcon(quiz.status)}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-50 group-hover:text-amber-700 transition-colors">
                              {quiz.title}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(quiz.status)} text-white`}>
                              {quiz.status || 'draft'}
                            </span>
                          </div>
                          
                          {/* Quiz Details */}
                          <div className="flex flex-wrap items-center gap-4 text-sm text-amber-600/70 dark:text-amber-400/70">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{quiz.duration_minutes || 30} min</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <BarChart3 className="w-4 h-4" />
                              <span>{quiz.questions_count || 0} questions</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{(quiz.participants_count || 0).toLocaleString()} attempts</span>
                            </div>
                          </div>

                          {/* Quiz ID & Created Date */}
                          <div className="flex flex-wrap items-center gap-4 mt-3">
                            <div className="text-xs px-2 py-1 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 text-amber-700 dark:text-amber-300 rounded-full">
                              ID: {(quiz._id || quiz.id).slice(-8)}
                            </div>
                            {quiz.created_at && (
                              <div className="text-xs text-amber-500/60 dark:text-amber-400/50">
                                Created: {new Date(quiz.created_at).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      {quiz.description && (
                        <p className="text-sm text-amber-600/70 dark:text-amber-400/70 mb-4 line-clamp-2">
                          {quiz.description}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col items-center lg:items-end gap-2 lg:ml-4 flex-shrink-0">
                      {quiz.status !== 'published' ? (
                        <Button
                          size="sm"
                          onClick={() => publish(quiz._id || quiz.id)}
                          className="flex items-center gap-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white border-0 shadow-sm hover:shadow-md"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Publish
                        </Button>
                      ) : (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => unpublish(quiz._id || quiz.id)}
                          className="flex items-center gap-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white border-0 shadow-sm hover:shadow-md"
                        >
                          <Edit3 className="w-4 h-4" />
                          Unpublish
                        </Button>
                      )}

                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => remove(quiz._id || quiz.id)}
                        className="flex items-center gap-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white border-0 shadow-sm hover:shadow-md"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Summary Footer */}
      {filteredItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-4 border-t border-amber-200 dark:border-amber-800"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-amber-600/70 dark:text-amber-400/70">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span>Quizzes help students assess their understanding and track progress</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span>Published: {items.filter(q => q.status === 'published').length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span>Draft: {items.filter(q => q.status === 'draft').length}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Total: {filteredItems.length} quizzes</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}