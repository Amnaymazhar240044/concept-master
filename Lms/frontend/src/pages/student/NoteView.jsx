import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useOutletContext } from 'react-router-dom'
import api from '../../../lib/api'
import { SERVER_ORIGIN } from '../../../lib/config'
import { motion } from 'framer-motion'
import { 
  FileText, Download, Search, BookOpen, FolderOpen, 
  ArrowLeft, Calendar, User, Layers, Crown, Sparkles,
  Brain, Target, Award, School, Clock, GraduationCap,
  ChevronRight, Star, Zap, FileDown, Eye, Info, Book,
  Grid, List, Filter, TrendingUp, Users as UsersIcon,
  BarChart3, Shield, CheckCircle, Home
} from 'lucide-react'

export default function ClassNotes() {
  const { classData } = useOutletContext()
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
  const [viewMode, setViewMode] = useState('grid')

  // Get file icon based on note type
  const getFileIcon = (note) => {
    if (note.is_descriptive_only || !note.file_path) {
      return <Book className="w-6 h-6 text-blue-500" />
    }
    return <FileText className="w-6 h-6 text-amber-500" />
  }

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
        setNotes(n.data.data || n.data || [])
      } catch (e) {
        console.error("Failed to load content", e)
      }
      setLoading(false)
    }
    loadContent()
  }, [classId, selectedSubject])

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

  // 1. Subject Selection View
  if (!selectedSubject) {
    return (
      <div className="min-h-screen">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <Link
              to={`/class/${classId}`}
              className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 mb-4 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Overview</span>
            </Link>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">
              {classData?.title || classData?.name} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">Notes</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Select a subject to view study materials
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
              <input
                type="text"
                placeholder="Search subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-xl border border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 outline-none w-full lg:w-64"
              />
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{subjects.length}</div>
            <div className="text-sm text-amber-600 dark:text-amber-400">Subjects</div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {subjects.reduce((acc, sub) => acc + (sub.chapterCount || 0), 0)}
            </div>
            <div className="text-sm text-amber-600 dark:text-amber-400">Chapters</div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {subjects.reduce((acc, sub) => acc + (sub.noteCount || 0), 0)}
            </div>
            <div className="text-sm text-amber-600 dark:text-amber-400">Total Notes</div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">24/7</div>
            <div className="text-sm text-amber-600 dark:text-amber-400">Access</div>
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
            {subjects
              .filter(subject => 
                subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                subject.description?.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((subject, index) => (
              <motion.div
                key={subject._id || subject.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedSubject(subject)}
                className="cursor-pointer group"
              >
                <div className="h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-amber-200 dark:border-amber-800 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-amber-900 dark:text-amber-50 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                          {subject.name}
                        </h3>
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                          Study notes & materials
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-amber-100 dark:border-amber-800">
                      <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                        <Layers className="w-4 h-4" />
                        <span>{subject.chapterCount || 'Multiple'} chapters</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>View Notes</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Features Section */}
        <div className="mt-12 pt-8 border-t border-amber-200 dark:border-amber-800">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Premium Study Materials</h2>
            <p className="text-gray-600 dark:text-gray-400">Everything you need for academic success</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: CheckCircle, title: 'Comprehensive', desc: 'Covers all topics in detail' },
              { icon: TrendingUp, title: 'Updated', desc: 'Regularly revised content' },
              { icon: Shield, title: 'Verified', desc: 'Expert-reviewed materials' },
              { icon: BarChart3, title: 'Structured', desc: 'Organized by difficulty' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center mb-3">
                  <item.icon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // 2. Notes & Chapters View
  const groups = groupedNotes()
  const filteredGroups = groups.filter(group => 
    group.notes.some(note =>
      note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.chapter.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={() => setSelectedSubject(null)}
            className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Subjects</span>
          </button>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">
            {selectedSubject.name} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">Notes</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {classData?.title || classData?.name} • All study materials
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 rounded-xl border border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 outline-none w-full lg:w-64"
            />
          </div>
          <div className="hidden sm:flex items-center gap-1 p-1 bg-amber-50 dark:bg-gray-800 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 text-amber-600 dark:text-amber-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 text-amber-600 dark:text-amber-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              <List className="w-4 h-4" />
            </button>
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
          {filteredGroups.map((group) => {
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
                <div className="flex items-center gap-4 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-amber-200 dark:border-amber-800">
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
                <div className={`gap-6 ${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'flex flex-col'}`}>
                  {groupNotes.map((note) => {
                    const isDescriptive = note.is_descriptive_only || !note.file_path
                    const hasFile = !isDescriptive && note.file_path
                    
                    return (
                      <motion.div
                        key={note._id || note.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`${viewMode === 'list' ? 'w-full' : 'h-full'}`}
                      >
                        <div className={`h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-200 dark:border-amber-800 overflow-hidden hover:shadow-xl transition-all duration-300 ${viewMode === 'grid' ? 'hover:-translate-y-1' : ''}`}>
                          <div className="p-6 h-full flex flex-col">
                            <div className="flex items-start justify-between mb-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                isDescriptive 
                                  ? 'bg-gradient-to-br from-blue-600 to-blue-500' 
                                  : 'bg-gradient-to-br from-amber-600 to-orange-600'
                              }`}>
                                {getFileIcon(note)}
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <div className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : 
                                   note.created_at ? new Date(note.created_at).toLocaleDateString() : 'Unknown'}
                                </div>
                                {note.views > 100 && (
                                  <div className="flex items-center gap-1 text-xs text-amber-700 dark:text-amber-300">
                                    <Eye className="w-3 h-3" />
                                    <span>Popular</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <h3 className="text-lg font-bold mb-3 text-amber-900 dark:text-amber-50 line-clamp-2">
                              {note.title}
                            </h3>

                            <p className="text-sm text-amber-700/80 dark:text-amber-300/80 mb-4 flex-1 line-clamp-3">
                              {note.description || 'Comprehensive notes covering key concepts and examples.'}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-amber-100 dark:border-amber-800">
                              {note.uploaded_by?.name && (
                                <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                                  <User className="w-4 h-4" />
                                  <span>{note.uploaded_by.name}</span>
                                </div>
                              )}
                              
                              <div className="flex items-center gap-2">
                                {/* VIEW DETAILS button */}
                                <button
                                  onClick={() => navigate(`/class/${classId}/notes/view/${note._id || note.id}`)}
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl font-semibold transition-all hover:shadow-lg hover:scale-105"
                                >
                                  <Eye className="w-4 h-4" />
                                  View Details
                                </button>
                                
                                {/* DOWNLOAD button - only shown if note has a file */}
                                {hasFile && (
                                  <a
                                    href={`${import.meta.env.VITE_API_BASE_URL || SERVER_ORIGIN}/notes/${note._id || note.id}/download`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-xl font-semibold transition-all hover:shadow-lg hover:scale-105"
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

          {filteredGroups.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border-2 border-dashed border-amber-300 dark:border-amber-700"
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl flex items-center justify-center">
                <FileText className="w-10 h-10 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100 mb-2">
                {searchTerm ? 'No notes found' : 'No notes available yet'}
              </h3>
              <p className="text-amber-700/80 dark:text-amber-300/80 mb-6 max-w-md mx-auto">
                {searchTerm ? 'Try adjusting your search terms' : 'Notes will appear here once uploaded for this subject'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-md"
                >
                  <Search className="w-4 h-4" />
                  Clear Search
                </button>
              )}
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}