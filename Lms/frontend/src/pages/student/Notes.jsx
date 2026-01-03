import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import api from '../../lib/api'
import { motion } from 'framer-motion'
import { 
  FileText, Search, BookOpen, 
  ArrowLeft, Calendar, User, Layers, Crown,
  ChevronRight, Eye
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Notes() {
  const { user } = useAuth()
  const { classId } = useParams()
  const navigate = useNavigate()
  
  // State management
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [chapters, setChapters] = useState([])
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [featureSettings, setFeatureSettings] = useState([])
  const [checkingFeature, setCheckingFeature] = useState(true)

  const currentClass = classes.find(c => String(c._id || c.id) === String(classId))

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

  // Load Classes
  useEffect(() => {
    const loadClasses = async () => {
      setLoading(true)
      try {
        const response = await api.get('/classes')
        setClasses(response.data || [])
      } catch (error) {
        console.error('Failed to load classes:', error)
      }
      setLoading(false)
    }
    loadClasses()
  }, [])

  // Load Subjects
  useEffect(() => {
    const loadSubjects = async () => {
      if (!classId) return
      setLoading(true)
      try {
        const response = await api.get('/subjects')
        setSubjects(response.data || [])
      } catch (error) {
        console.error('Failed to load subjects:', error)
      }
      setLoading(false)
    }
    loadSubjects()
  }, [classId])

  // Load Chapters and Notes
  useEffect(() => {
    const loadContent = async () => {
      if (!classId || !selectedSubject) return
      setLoading(true)
      try {
        const [chaptersResponse, notesResponse] = await Promise.all([
          api.get('/chapters', { 
            params: { 
              class_id: classId, 
              subject_id: selectedSubject._id || selectedSubject.id 
            } 
          }),
          api.get('/notes', { 
            params: { 
              class_id: classId, 
              subject_id: selectedSubject._id || selectedSubject.id 
            } 
          })
        ])
        setChapters(chaptersResponse.data || [])
        setNotes(notesResponse.data.data || [])
      } catch (error) {
        console.error('Failed to load content:', error)
      }
      setLoading(false)
    }
    loadContent()
  }, [classId, selectedSubject])

  // Check Feature Access
  const notesFeature = featureSettings.find(f => f.featureName === 'notes')
  const isLocked = notesFeature?.isPremium && !user?.isPremium

  // Navigation handlers
  const handleViewNote = (noteId) => {
    navigate(`/student/notes/${classId}/view/${noteId}`)
  }

  const handleBackToSubjects = () => {
    setSelectedSubject(null)
  }

  const handleBackToClasses = () => {
    navigate('/student/notes')
  }

  // Group notes by chapter
  const groupNotesByChapter = () => {
    const grouped = {}
    
    // Initialize with chapters
    chapters.forEach(chapter => {
      grouped[chapter._id || chapter.id] = {
        chapter,
        notes: []
      }
    })
    
    // Add uncategorized group
    grouped.uncategorized = {
      chapter: { 
        title: 'General Notes', 
        _id: 'uncategorized'
      },
      notes: []
    }
    
    // Distribute notes
    notes.forEach(note => {
      const chapterId = note.chapter_id?._id || note.chapter_id
      if (chapterId && grouped[chapterId]) {
        grouped[chapterId].notes.push(note)
      } else {
        grouped.uncategorized.notes.push(note)
      }
    })
    
    // Convert to array and sort
    return Object.values(grouped)
      .filter(group => group.notes.length > 0)
      .sort((a, b) => {
        if (a.chapter._id === 'uncategorized') return 1
        if (b.chapter._id === 'uncategorized') return -1
        return (a.chapter.order || 0) - (b.chapter.order || 0)
      })
  }

  // Filter notes based on search term
  const filterNotes = (notesList) => {
    if (!searchTerm.trim()) return notesList
    
    const term = searchTerm.toLowerCase()
    return notesList.filter(note => 
      note.title?.toLowerCase().includes(term) ||
      note.description?.toLowerCase().includes(term)
    )
  }

  // Loading Component
  const LoadingSpinner = () => (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-white to-orange-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-amber-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-amber-700 dark:text-amber-300">Loading notes...</p>
      </div>
    </div>
  )

  // Premium Locked Component
  const PremiumLockedView = () => (
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

  // 1. Class Selection View
  const ClassSelectionView = () => (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-white to-orange-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-amber-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
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

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="h-48 bg-white dark:bg-gray-800 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls, index) => (
              <motion.div
                key={cls._id || cls.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/student/notes/${cls._id || cls.id}`}
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
                            {cls.title}
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

  // 2. Subject Selection View
  const SubjectSelectionView = () => (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-white to-orange-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-amber-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <button
                onClick={handleBackToClasses}
                className="inline-flex items-center gap-2 text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Classes
              </button>
              <h1 className="text-4xl md:text-5xl font-black text-amber-900 dark:text-amber-50 mb-3">
                {currentClass?.title} Subjects
              </h1>
              <p className="text-lg text-amber-700 dark:text-amber-300">
                Select a subject to view study notes
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="h-48 bg-white dark:bg-gray-800 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject, index) => (
              <motion.div
                key={subject._id || subject.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedSubject(subject)}
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
                          {subject.name}
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

  // 3. Notes View - ONLY VIEW BUTTON, NO DOWNLOAD
  const NotesView = () => {
    const groupedNotes = groupNotesByChapter()
    const hasSearchResults = groupedNotes.some(group => 
      filterNotes(group.notes).length > 0
    )

    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-white to-orange-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-amber-950">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                {/* Back Button */}
                <button
                  onClick={handleBackToSubjects}
                  className="inline-flex items-center gap-2 text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 mb-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Subjects
                </button>
                
                {/* Main Title */}
                <h1 className="text-4xl md:text-5xl font-black text-amber-900 dark:text-amber-50 mb-3">
                  {selectedSubject.name} Notes
                </h1>
                <p className="text-lg text-amber-700 dark:text-amber-300">
                  {currentClass?.title} • All study materials
                </p>
              </div>
              
              {/* Search Bar */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Search className="w-5 h-5 text-amber-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search anything..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-amber-300 dark:border-amber-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-amber-900 dark:text-amber-100 placeholder-amber-500/60 w-full sm:w-64"
                />
              </div>
            </div>
          </div>

          {/* Loading State */}
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
              {/* Notes by Chapter */}
              {groupedNotes.map((group) => {
                const filteredNotes = filterNotes(group.notes)
                if (filteredNotes.length === 0) return null

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
                          {filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    {/* Notes Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredNotes.map((note) => (
                        <motion.div
                          key={note._id || note.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="h-full"
                        >
                          <div className="h-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-amber-200 dark:border-amber-800 overflow-hidden hover:shadow-xl transition-all duration-300">
                            <div className="p-6 h-full flex flex-col">
                              {/* Note Header with Date */}
                              <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center">
                                  <FileText className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-xs text-amber-600 dark:text-amber-400">
                                  <Calendar className="w-3 h-3 inline mr-1" />
                                  {note.created_at ? new Date(note.created_at).toLocaleDateString() : 'Unknown'}
                                </div>
                              </div>

                              {/* Note Title */}
                              <h3 className="text-lg font-bold mb-3 text-amber-900 dark:text-amber-50 line-clamp-2">
                                {note.title || 'Untitled Note'}
                              </h3>

                              {/* Note Description */}
                              <p className="text-sm text-amber-700 dark:text-amber-300 mb-4 flex-1 line-clamp-3">
                                {note.description || 'No description available'}
                              </p>

                              {/* Note Footer - ONLY VIEW BUTTON */}
                              <div className="flex items-center justify-between pt-4 border-t border-amber-200 dark:border-amber-800">
                                {/* Author Info */}
                                <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                                  <User className="w-4 h-4" />
                                  <span>
                                    {note.uploaded_by?.name || 'System Administrator'}
                                  </span>
                                </div>
                                
                                {/* ONLY VIEW BUTTON - NO DOWNLOAD */}
                                <button
                                  onClick={() => handleViewNote(note._id || note.id)}
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl font-semibold transition-all hover:shadow-lg"
                                >
                                  <Eye className="w-4 h-4" />
                                  View
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )
              })}

              {/* Empty State */}
              {!hasSearchResults && (
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

  // Main render logic
  if (checkingFeature) return <LoadingSpinner />
  if (isLocked) return <PremiumLockedView />
  if (!classId) return <ClassSelectionView />
  if (!selectedSubject) return <SubjectSelectionView />
  return <NotesView />
}