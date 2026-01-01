import { useEffect, useState } from 'react'
import api from '../../lib/api'
import Card from '../../components/ui/Card.jsx'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import { motion } from 'framer-motion'
import { GraduationCap, Plus, Search, Trash2, Edit3, AlertCircle, CheckCircle, BookOpen, Sparkles, Target, Award, Brain, Zap, Users } from 'lucide-react'

export default function ManageClasses() {
  const [list, setList] = useState([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [msg, setMsg] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/classes')
      setList(data || [])
    } catch { }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const create = async () => {
    if (!title.trim()) return

    setMsg('')
    setLoading(true)
    try {
      await api.post('/classes', { title })
      setTitle('')
      setMsg('Class created successfully!')
      load()
    } catch (error) {
      setMsg(error.response?.data?.message || 'Failed to create class')
    } finally {
      setLoading(false)
    }
  }

  const remove = async (id) => {
    if (!confirm('Are you sure you want to delete this class?')) return
    try {
      await api.delete(`/classes/${id}`)
      load()
    } catch { }
  }

  const filteredClasses = list.filter(cls =>
    cls.title?.toLowerCase().includes(searchTerm.toLowerCase())
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
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 dark:from-amber-200 dark:to-orange-200 bg-clip-text text-transparent">
              Manage Classes
            </h1>
            <p className="text-amber-600/70 dark:text-amber-400/70">Create and manage class sections</p>
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

      {/* Create Class Form */}
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
                <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-50">Create New Class</h2>
                <p className="text-sm text-amber-600/70 dark:text-amber-400/70">Add a new class section to organize content</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="e.g. Class 10A, Mathematics Section"
                  label="Class Title *"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  className="border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500"
                />
                <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-1">
                  Use descriptive names to help students find their classes
                </p>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={create}
                  disabled={!title.trim() || loading}
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
                      Create Class
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Classes List */}
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
                  <GraduationCap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-50">Classes</h2>
                  <p className="text-sm text-amber-600/70 dark:text-amber-400/70">
                    {filteredClasses.length} class{filteredClasses.length !== 1 ? 'es' : ''} found
                  </p>
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-400" />
                <input
                  type="text"
                  placeholder="Search classes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:outline-none transition-colors text-amber-900 dark:text-amber-100 placeholder-amber-500/60 dark:placeholder-amber-400/40"
                />
              </div>
            </div>

            {/* Classes Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="h-32 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl animate-pulse border border-amber-200 dark:border-amber-800"></div>
                ))}
              </div>
            ) : filteredClasses.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-amber-300 dark:border-amber-700 rounded-xl bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-lg font-medium text-amber-900 dark:text-amber-100 mb-2">
                  {searchTerm ? 'No classes found' : 'No classes available'}
                </h3>
                <p className="text-amber-600/70 dark:text-amber-400/70">
                  {searchTerm
                    ? 'Try adjusting your search terms'
                    : 'Start by creating your first class'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClasses.map((cls, index) => (
                  <motion.div
                    key={cls._id || cls.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="h-full border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/10 hover:shadow-xl transition-all duration-300 hover:border-amber-300 dark:hover:border-amber-700 group">
                      <div className="space-y-4">
                        {/* Class Icon */}
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                          <GraduationCap className="w-8 h-8" />
                        </div>

                        {/* Class Info */}
                        <div>
                          <h3 className="text-xl font-bold mb-2 text-amber-900 dark:text-amber-50 group-hover:text-amber-700 transition-colors">
                            {cls.title}
                          </h3>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-amber-600/70 dark:text-amber-400/70">
                              <BookOpen className="w-4 h-4" />
                              <span>Class Section</span>
                            </div>

                            {cls.created_at && (
                              <div className="text-xs text-amber-600/50 dark:text-amber-400/50">
                                Created: {new Date(cls.created_at).toLocaleDateString()}
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
                            <Users className="w-3 h-3 text-amber-500" />
                            <span className="text-amber-600/70 dark:text-amber-400/70">Students</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-amber-200 dark:border-amber-800">
                          <div className="text-xs text-amber-600/50 dark:text-amber-400/50 font-mono">
                            ID: {(cls._id || cls.id).slice(-6)}
                          </div>

                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => remove(cls._id || cls.id)}
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
            {filteredClasses.length > 0 && (
              <div className="pt-4 border-t border-amber-200 dark:border-amber-800">
                <div className="flex items-center justify-between text-sm text-amber-600/70 dark:text-amber-400/70">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    <span>Organize content by classes for better student experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Total: {filteredClasses.length} classes</span>
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