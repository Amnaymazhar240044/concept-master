import React, { useState, useEffect, useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { FileText, GraduationCap, ArrowRight, BookOpen, Search, Filter, Grid, List, Eye, Clock, Star, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import api from '../../lib/api'

export default function PublicNotes() {
  const { grade } = useParams()
  const [sp] = useSearchParams()
  const q = (sp.get('q') || '').toLowerCase()
  const [notes, setNotes] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch classes if we are on the main page
        if (!grade) {
          const classesResponse = await api.get('/classes')
          setClasses(classesResponse.data || [])
        }

        // Fetch notes if a grade is selected
        if (grade) {
          const notesResponse = await api.get('/notes', {
            params: { class_id: grade }
          })
          setNotes(notesResponse.data.notes || [])
        }
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load content')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [grade])

  const items = useMemo(() =>
    notes.filter(n => [n.title, n.subject?.name, n.description].join(' ').toLowerCase().includes(q))
    , [q, notes])

  const getGradeId = (name) => {
    const match = name.match(/(\d+)(st|nd|rd|th)?/i)
    if (match) {
      const num = match[1]
      if (num === '1') return '1st-year'
      if (num === '2') return '2nd-year'
      return `${num}th`
    }
    return name
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgb(245 158 11 / 0.1) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {!grade ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            {/* Header */}
            <div className="text-center space-y-6 pt-8">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6">
                  Study <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-500 dark:to-orange-500">Notes</span>
                </h1>
                <p className="text-2xl text-gray-600 dark:text-gray-400 font-light max-w-3xl mx-auto leading-relaxed">
                  Access comprehensive notes and study materials for all subjects and classes
                </p>
              </motion.div>
            </div>

            {/* Grade Cards */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {classes.map((cls, index) => {
                  const className = cls.name || cls.class_name || cls.title || 'Unknown Class'
                  const gradeId = getGradeId(className)

                  return (
                    <motion.div
                      key={cls._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                    >
                      <Link
                        to={`/notes/${gradeId}`}
                        className="group block h-full"
                      >
                        <div className="h-full p-8 rounded-2xl bg-white dark:bg-gray-800 border border-amber-200 dark:border-gray-700 hover:border-amber-500 dark:hover:border-amber-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                          <div className="flex flex-col items-center text-center space-y-4">
                            {/* Icon */}
                            <div className="w-20 h-20 bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                              <GraduationCap className="w-10 h-10 text-white" />
                            </div>

                            {/* Class Name */}
                            <div className="space-y-2">
                              <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                {className}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Browse available notes</p>
                            </div>

                            {/* Button */}
                            <div className="pt-2">
                              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold transition-all duration-300 hover:scale-105 shadow-md">
                                <FileText className="w-4 h-4" />
                                View Notes
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            )}

            {/* CTA Section */}
            {!loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="pt-16"
              >
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-3xl p-8 md:p-12 text-center border border-amber-200 dark:border-amber-800/30">
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Can't find what you're looking for?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                    Join thousands of students who are already mastering their subjects with our premium notes.
                  </p>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-full font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-md"
                  >
                    Get Full Access
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-8">
              <div>
                <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 font-semibold mb-2">
                  <Link to="/notes" className="hover:text-amber-700 dark:hover:text-amber-300 transition-colors">
                    All Classes
                  </Link>
                  <ChevronRight className="w-3 h-3" />
                  <span>{grade}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-3">
                  Notes – <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-500 dark:to-orange-500">{grade}</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Browse our collection of notes for {grade}
                </p>
              </div>
              <Link
                to="/notes"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-amber-200 dark:border-gray-600 hover:bg-amber-50 dark:hover:bg-gray-800 transition-all duration-300 font-semibold text-gray-900 dark:text-white hover:shadow-sm"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Change Class
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-amber-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{items.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Notes</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-amber-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {[...new Set(items.map(note => note.subject?.name).filter(Boolean))].length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Subjects</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-amber-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {items.filter(note => note.views > 100).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Popular</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-amber-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {items.filter(note => new Date(note.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Recent</div>
              </div>
            </div>

            {/* Notes Grid */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="text-red-500 mb-4">Failed to load notes</div>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full font-semibold hover:from-amber-700 hover:to-orange-700 transition-all"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {items.map((note, index) => (
                  <motion.div
                    key={note._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.8 }}
                    className="group"
                  >
                    <div className="h-full bg-white dark:bg-gray-800 rounded-2xl border border-amber-200 dark:border-gray-700 hover:border-amber-500 dark:hover:border-amber-400 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden flex flex-col">
                      {/* Note Header */}
                      <div className="p-6 flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-200 dark:border-amber-800">
                            <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                              {note.subject?.name || 'General'}
                            </span>
                          </div>
                          {note.views > 100 && (
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                              <span className="text-xs font-bold text-amber-700 dark:text-amber-300">Popular</span>
                            </div>
                          )}
                        </div>

                        <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          {note.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 line-clamp-3 text-sm mb-4">{note.description}</p>

                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          </div>
                          {note.pages && (
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              <span>{note.pages} pages</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Note Action */}
                      <div className="p-6 pt-0">
                        <a
                          href={`${import.meta.env.VITE_API_BASE_URL}${note.file_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02]"
                        >
                          <Eye className="w-4 h-4" />
                          View Note
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {!loading && !items.length && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-12 h-12 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No notes found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                  There are currently no notes available for {grade}. Check back later or explore other classes.
                </p>
                <Link
                  to="/notes"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold transition-all hover:scale-105 shadow-lg"
                >
                  Browse Other Classes
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            )}

            {/* Bottom CTA */}
            {items.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-16"
              >
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-3xl p-8 md:p-12 text-center border border-amber-200 dark:border-amber-800/30">
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Need more comprehensive notes?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                    Unlock premium notes with detailed explanations, practice questions, and expert tips.
                  </p>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-full font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-md"
                  >
                    Upgrade to Premium
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}