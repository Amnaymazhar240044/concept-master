import { useEffect, useState } from 'react'
import api from '../../lib/api'
import Card from '../../components/ui/Card.jsx'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import { motion } from 'framer-motion'
import { BookOpen, Plus, Search, Trash2, AlertCircle, CheckCircle, Sparkles, Target, Award, Brain, Zap, GraduationCap } from 'lucide-react'

export default function ManageSubjects() {
  const [list, setList] = useState([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [msg, setMsg] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/subjects')
      setList(data || [])
    } catch (error) {
      console.error('Failed to load subjects:', error)
      setMsg('Failed to load subjects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const create = async () => {
    if (!name.trim()) return

    setMsg('')
    setLoading(true)
    try {
      await api.post('/subjects', { name })
      setName('')
      setMsg('Subject created successfully!')
      load()
    } catch (error) {
      setMsg(error.response?.data?.message || 'Failed to create subject')
    } finally {
      setLoading(false)
    }
  }

  const remove = async (id) => {
    if (!confirm('Are you sure you want to delete this subject?')) return
    try {
      await api.delete(`/subjects/${id}`)
      setMsg('Subject deleted successfully!')
      load()
    } catch (error) {
      setMsg('Failed to delete subject')
    }
  }

  const filteredSubjects = list.filter(subject =>
    subject.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-md">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 dark:from-amber-200 dark:to-orange-200 bg-clip-text text-transparent">
              Manage Subjects
            </h1>
            <p className="text-amber-600/70 dark:text-amber-400/70">Create and manage academic subjects</p>
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

      {/* Create Subject Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 shadow-lg">
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center shadow-sm">
                <Plus className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-50">Create New Subject</h2>
                <p className="text-sm text-amber-600/70 dark:text-amber-400/70">Add a new academic subject to organize content</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="e.g. Mathematics, Physics, Chemistry"
                  label="Subject Name *"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500"
                />
                <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-1">
                  Use standard academic subject names for consistency
                </p>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={create}
                  disabled={!name.trim() || loading}
                  loading={loading}
                  className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Create Subject
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Subjects List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 shadow-lg">
          <div className="space-y-6">
            {/* List Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center shadow-sm">
                  <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-50">Subjects</h2>
                  <p className="text-sm text-amber-600/70 dark:text-amber-400/70">
                    {filteredSubjects.length} subject{filteredSubjects.length !== 1 ? 's' : ''} found
                  </p>
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-400" />
                <input
                  type="text"
                  placeholder="Search subjects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:outline-none transition-colors text-amber-900 dark:text-amber-100 placeholder-amber-500/60 dark:placeholder-amber-400/40"
                />
              </div>
            </div>

            {/* Subjects Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="h-32 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl animate-pulse border border-amber-200 dark:border-amber-800"></div>
                ))}
              </div>
            ) : filteredSubjects.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-amber-300 dark:border-amber-700 rounded-xl bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-lg font-medium text-amber-900 dark:text-amber-100 mb-2">
                  {searchTerm ? 'No subjects found' : 'No subjects available'}
                </h3>
                <p className="text-amber-600/70 dark:text-amber-400/70">
                  {searchTerm
                    ? 'Try adjusting your search terms'
                    : 'Start by creating your first subject'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSubjects.map((subject, index) => (
                  <motion.div
                    key={subject._id || subject.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="h-full border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/10 hover:shadow-xl transition-all duration-300 hover:border-amber-300 dark:hover:border-amber-700 group">
                      <div className="space-y-4">
                        {/* Subject Icon */}
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                          <BookOpen className="w-8 h-8" />
                        </div>

                        {/* Subject Info */}
                        <div>
                          <h3 className="text-xl font-bold mb-2 text-amber-900 dark:text-amber-50 group-hover:text-amber-700 transition-colors">
                            {subject.name}
                          </h3>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-amber-600/70 dark:text-amber-400/70">
                              <GraduationCap className="w-4 h-4" />
                              <span>Academic Subject</span>
                            </div>

                            {subject.created_at && (
                              <div className="text-xs text-amber-600/50 dark:text-amber-400/50">
                                Created: {new Date(subject.created_at).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-3 pt-3 border-t border-amber-200 dark:border-amber-800">
                          <div className="flex items-center gap-1 text-xs">
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500"></div>
                            <span className="text-amber-600/70 dark:text-amber-400/70">Active</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <Brain className="w-3 h-3 text-amber-500" />
                            <span className="text-amber-600/70 dark:text-amber-400/70">Knowledge</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-amber-200 dark:border-amber-800">
                          <div className="text-xs text-amber-600/50 dark:text-amber-400/50 font-mono">
                            ID: {(subject._id || subject.id).slice(-6)}
                          </div>

                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => remove(subject._id || subject.id)}
                            className="flex items-center gap-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white border-0 shadow-sm hover:shadow-md"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Summary */}
            {filteredSubjects.length > 0 && (
              <div className="pt-4 border-t border-amber-200 dark:border-amber-800">
                <div className="flex items-center justify-between text-sm text-amber-600/70 dark:text-amber-400/70">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    <span>Organize educational content by subjects for better learning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Total: {filteredSubjects.length} subjects</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}