import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import api from '../../lib/api'
import { SERVER_ORIGIN } from '../../lib/config'
import { motion } from 'framer-motion'
import { 
  FileText, Download, Search, BookOpen, FolderOpen, 
  ArrowLeft, Calendar, User, Layers, Crown, Sparkles,
  Brain, Target, Award, School, Clock, GraduationCap,
  ChevronRight, Star, Zap, FileDown, Eye, Info, Book
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Notes() {
  const { user } = useAuth()
  const { classId } = useParams()
  const navigate = useNavigate()
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState(null)

  const [chapters, setChapters] = useState([])
  const [notes, setNotes] = useState([])

  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
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

  // Load Classes on mount
  useEffect(() => {
    const loadClasses = async () => {
      setLoading(true)
      try {
        const c = await api.get('/classes')
        setClasses(c.data || [])
      } catch { }
      setLoading(false)
    }
    loadClasses()
  }, [])

  // Load Subjects when Class is selected
  useEffect(() => {
    const loadSubjects = async () => {
      if (!classId) return
      setLoading(true)
      try {
        const s = await api.get('/subjects')
        setSubjects(s.data || [])
      } catch { }
      setLoading(false)
    }
    loadSubjects()
  }, [classId])

  // Load Chapters and Notes when Subject is selected
  useEffect(() => {
    const loadContent = async () => {
      if (!classId || !selectedSubject) return
      setLoading(true)
      try {
        const [c, n] = await Promise.all([
          api.get('/chapters', { params: { class_id: classId, subject_id: selectedSubject._id || selectedSubject.id } }),
          api.get('/notes', { params: { class_id: classId, subject_id: selectedSubject._id || selectedSubject.id } })
        ])
        setChapters(c.data || [])
        setNotes(n.data.data || [])
      } catch (e) {
        console.error("Failed to load content", e)
      }
      setLoading(false)
    }
    loadContent()
  }, [classId, selectedSubject])

  const currentClass = classes.find(c => String(c._id || c.id) === String(classId))

  // Check Feature Access
  const notesFeature = featureSettings.find(f => f.featureName === 'notes')
  const isLocked = notesFeature?.isPremium && !user?.isPremium

  // Handle view note details
  const handleViewNote = (noteId) => {
    navigate(`/student/notes/${classId}/view/${noteId}`)
  }

  // Get file icon based on note type
  const getFileIcon = (note) => {
    if (note.is_descriptive_only || !note.file_path) {
      return <Book className="w-6 h-6 text-blue-500" />
    }
    return <FileText className="w-6 h-6 text-amber-500" />
  }

  if (checkingFeature) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-white to-orange-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-amber-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-amber-700 dark:text-amber-300">Loading notes...</p>
        </div>
      </div>
    )
  }

  if (isLocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-white to-orange-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-amber-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-amber-200 dark:border-amber-800 p-8">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100 mb-2">
                Premium Feature
              </h2>
              <p className="text-amber-700 dark:text-amber-300">
                Study notes are available for Premium members only
              </p>
            </div>
            <div className="space-y-4">
              <Link
                to="/pricing"
                className="block w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold rounded-xl transition-all"
              >
                Upgrade to Premium
              </Link>
              <Link
                to="/dashboard"
                className="block w-full py-3 border-2 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 font-semibold rounded-xl hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Group notes by chapter
  const groupedNotes = () => {
    const grouped = {}

    // Initialize groups for all chapters
    chapters.forEach(ch => {
      grouped[ch._id || ch.id] = {
        chapter: ch,
        notes: []
      }
    })

    // Add "Uncategorized" group
    grouped['uncategorized'] = {
      chapter: { title: 'General Notes', _id: 'uncategorized' },
      notes: []
    }

    // Distribute notes
    notes.forEach(note => {
      const noteChapterId = note.chapter_id?._id || note.chapter_id
      if (noteChapterId && grouped[noteChapterId]) {
        grouped[noteChapterId].notes.push(note)
      } else {
        grouped['uncategorized'].notes.push(note)
      }
    })

    return Object.values(grouped).sort((a, b) => {
      if (a.chapter._id === 'uncategorized') return 1
      if (b.chapter._id === 'uncategorized') return -1
      return (a.chapter.order || 0) - (b.chapter.order || 0)
    })
  }

  // 1. Class Selection View
  if (!classId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-white to-orange-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-amber-950">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-black text-amber-900 dark:text-amber-50 mb-3">
              Study Notes
            </h1>
            <p className="text-lg text-amber-700 dark:text-amber-300">
              Select your class to access study materials
            </p>
          </motion.div>

          {/* Classes Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-48 bg-white dark:bg-gray-800 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map((c, index) => (
                <motion.div
                  key={c._id || c.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/student/notes/${c._id || c.id}`}
                    className="block h-full"
                  >
                    <div className="h-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-amber-200 dark:border-amber-800 overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-amber-900 dark:text-amber-50">
                              {c.title}
                            </h3>
                            <p className="text-sm text-amber-700 dark:text-amber-300">
                              View study notes
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                            <FileText className="w-4 h-4" />
                            <span>Notes available</span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-amber-500" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // 2. Subject Selection View
  if (!selectedSubject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-white to-orange-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-amber-950">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <Link
                  to="/student/notes"
                  className="inline-flex items-center gap-2 text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 mb-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Classes
                </Link>
                <h1 className="text-4xl md:text-5xl font-black text-amber-900 dark:text-amber-50 mb-3">
                  {currentClass?.title} Subjects
                </h1>
                <p className="text-lg text-amber-700 dark:text-amber-300">
                  Select a subject to view study notes
                </p>
              </div>
            </div>
          </div>

          {/* Subjects Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-48 bg-white dark:bg-gray-800 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((s, index) => (
                <motion.div
                  key={s._id || s.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedSubject(s)}
                  className="cursor-pointer"
                >
                  <div className="h-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-amber-200 dark:border-amber-800 overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-amber-900 dark:text-amber-50">
                            {s.name}
                          </h3>
                          <p className="text-sm text-amber-700 dark:text-amber-300">
                            Study notes & materials
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                          <Layers className="w-4 h-4" />
                          <span>Chapters</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-amber-500" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // 3. Notes & Chapters View
  const groups = groupedNotes()

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-white to-orange-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-amber-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <button
                onClick={() => setSelectedSubject(null)}
                className="inline-flex items-center gap-2 text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Subjects
              </button>
              <h1 className="text-4xl md:text-5xl font-black text-amber-900 dark:text-amber-50 mb-3">
                {selectedSubject.name} Notes
              </h1>
              <p className="text-lg text-amber-700 dark:text-amber-300">
                {currentClass?.title} • All study materials
              </p>
            </div>
            
            {/* Search */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Search className="w-5 h-5 text-amber-500" />
              </div>
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-amber-300 dark:border-amber-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-amber-900 dark:text-amber-100 placeholder-amber-500/60 w-full sm:w-64"
              />
            </div>
          </div>
        </div>

        {/* Notes Content */}
        {loading ? (
          <div className="space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-8 w-48 bg-white dark:bg-gray-800 rounded animate-pulse"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-64 bg-white dark:bg-gray-800 rounded-2xl animate-pulse"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {groups.map((group) => {
              // Filter notes within group based on search
              const groupNotes = group.notes.filter(note =>
                note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                note.description?.toLowerCase().includes(searchTerm.toLowerCase())
              )

              if (groupNotes.length === 0) return null

              return (
                <motion.div
                  key={group.chapter._id || group.chapter.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Chapter Header */}
                  <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-amber-200 dark:border-amber-800">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center">
                      <Layers className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-amber-900 dark:text-amber-50">
                        {group.chapter.title}
                      </h2>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        {groupNotes.length} note{groupNotes.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Notes Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupNotes.map((note) => {
                      const isDescriptive = note.is_descriptive_only || !note.file_path
                      const hasFile = !isDescriptive && note.file_path
                      
                      return (
                        <motion.div
                          key={note._id || note.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="h-full"
                        >
                          <div className="h-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-amber-200 dark:border-amber-800 overflow-hidden hover:shadow-xl transition-all duration-300">
                            <div className="p-6 h-full flex flex-col">
                              <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                  isDescriptive 
                                    ? 'bg-gradient-to-br from-blue-600 to-blue-500' 
                                    : 'bg-gradient-to-br from-amber-600 to-orange-600'
                                }`}>
                                  {getFileIcon(note)}
                                </div>
                                <div className="text-xs text-amber-600 dark:text-amber-400">
                                  <Calendar className="w-3 h-3 inline mr-1" />
                                  {note.created_at ? new Date(note.created_at).toLocaleDateString() : 'Unknown'}
                                </div>
                              </div>

                              <h3 className="text-lg font-bold mb-3 text-amber-900 dark:text-amber-50 line-clamp-2">
                                {note.title}
                              </h3>

                              <p className="text-sm text-amber-700 dark:text-amber-300 mb-4 flex-1 line-clamp-3">
                                {note.description || 'No description available'}
                              </p>

                              <div className="flex items-center justify-between pt-4 border-t border-amber-200 dark:border-amber-800">
                                {note.uploaded_by?.name && (
                                  <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                                    <User className="w-4 h-4" />
                                    <span>{note.uploaded_by.name}</span>
                                  </div>
                                )}
                                
                                <div className="flex items-center gap-2">
                                  {/* VIEW button - always shown */}
                                  <button
                                    onClick={() => handleViewNote(note._id || note.id)}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl font-semibold transition-all hover:shadow-lg"
                                  >
                                    <Eye className="w-4 h-4" />
                                    View
                                  </button>
                                  
                                  {/* DOWNLOAD button - only shown if note has a file */}
                                  {hasFile && (
                                    <a
                                      href={`${SERVER_ORIGIN}/notes/${note._id || note.id}/download`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-xl font-semibold transition-all hover:shadow-lg"
                                    >
                                      <Download className="w-4 h-4" />
                                      Download
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              )
            })}

            {groups.every(g => g.notes.filter(n => n.title.toLowerCase().includes(searchTerm.toLowerCase())).length === 0) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-amber-300 dark:border-amber-700"
              >
                <FileText className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-2">
                  {searchTerm ? 'No notes found' : 'No notes available'}
                </h3>
                <p className="text-amber-700 dark:text-amber-300">
                  {searchTerm ? 'Try adjusting your search terms' : 'Notes will appear here once uploaded'}
                </p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}