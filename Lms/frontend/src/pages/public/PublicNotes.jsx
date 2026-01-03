import React, { useState, useEffect, useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { FileText, GraduationCap, ArrowRight, Download, BookOpen, Search, Filter, Grid, List, Heart, Share2, Eye, Clock, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import api from '../../lib/api'

const GRADE_COLORS = [
  { color: 'from-teal-600 via-cyan-600 to-blue-600', hoverColor: 'hover:from-teal-700 hover:via-cyan-700 hover:to-blue-700', bgPattern: 'from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20' },
  { color: 'from-blue-600 via-indigo-600 to-purple-600', hoverColor: 'hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700', bgPattern: 'from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20' },
  { color: 'from-purple-600 via-pink-600 to-rose-600', hoverColor: 'hover:from-purple-700 hover:via-pink-700 hover:to-rose-700', bgPattern: 'from-purple-50 to-rose-50 dark:from-purple-900/20 dark:to-rose-900/20' },
  { color: 'from-emerald-600 via-green-600 to-teal-600', hoverColor: 'hover:from-emerald-700 hover:via-green-700 hover:to-teal-700', bgPattern: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20' },
]

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
            params: { class_id: grade } // Assuming backend filters by class_id/grade
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

  // Helper to extract grade ID from class name (reused logic)
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {!grade ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            {/* Header */}
            <div className="text-center space-y-6">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6">
                  Study Notes
                </h1>
                <p className="text-2xl text-gray-600 dark:text-gray-400 font-light max-w-3xl mx-auto leading-relaxed">
                  Access comprehensive notes and study materials for all subjects and classes
                </p>
              </motion.div>
            </div>

            {/* Grade Cards */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
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
                        <div className="h-full p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400">
                          <div className="flex flex-col items-center text-center space-y-4">
                            {/* Icon */}
                            <div className="w-20 h-20 bg-blue-600 dark:bg-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                              <GraduationCap className="w-10 h-10 text-white" />
                            </div>

                            {/* Class Name */}
                            <div className="space-y-2">
                              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{className}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Browse available notes</p>
                            </div>

                            {/* Button */}
                            <div className="pt-2">
                              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300 hover:scale-105 shadow-md">
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
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-3">
                  Notes – {grade}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Browse our collection of notes for {grade}
                </p>
              </div>
              <Link
                to="/notes"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 font-semibold text-gray-900 dark:text-white"
              >
                Change Class
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Notes Grid */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="text-center py-16 text-red-500">{error}</div>
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
                    <div className="h-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
                      {/* Note Header */}
                      <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
                            {note.subject?.name || 'General'}
                          </div>
                        </div>

                        <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3 line-clamp-2">{note.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 line-clamp-3 text-sm">{note.description}</p>
                      </div>

                      {/* Note Details */}
                      <div className="p-6 bg-gray-50 dark:bg-gray-800/50">
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <a
                        href={`${import.meta.env.VITE_API_BASE_URL}${note.file_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
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
                <div className="text-gray-500 text-lg">No notes found for this class.</div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
