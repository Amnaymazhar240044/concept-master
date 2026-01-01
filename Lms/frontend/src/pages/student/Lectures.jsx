import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../../lib/api'
import { SERVER_ORIGIN } from '../../lib/config'
import Card from '../../components/ui/Card.jsx'
import { 
  Lock, Crown, Video, Link as LinkIcon, BookOpen, 
  GraduationCap, PlayCircle, Users, Sparkles, 
  Brain, Award, Target, ArrowLeft, Layers, 
  School, FolderOpen, Clock, UsersIcon
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { motion } from 'framer-motion'

export default function Lectures() {
  const { user } = useAuth()
  const { classId } = useParams()
  const [items, setItems] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const c = await api.get('/classes')
        setClasses(c.data || [])
      } catch { }
    }
    loadClasses()
  }, [])

  useEffect(() => {
    const loadLectures = async () => {
      setLoading(true)
      if (!classId) { 
        setItems([]); 
        setLoading(false)
        return 
      }
      try {
        const r = await api.get('/lectures', { params: { class_id: classId } })
        const lectures = r.data.data || []
        setItems(lectures)
      } catch (err) {
        console.error('Failed to load lectures:', err)
      } finally {
        setLoading(false)
      }
    }
    loadLectures()
  }, [classId])

  // Group items by Subject -> Chapter
  const grouped = items.reduce((acc, item) => {
    const subName = item.subject_id?.name || item.Subject?.name || 'Uncategorized Subject'
    const chapTitle = item.chapter_id?.title || item.Chapter?.title || 'Uncategorized Chapter'

    if (!acc[subName]) acc[subName] = {}
    if (!acc[subName][chapTitle]) acc[subName][chapTitle] = []

    acc[subName][chapTitle].push(item)
    return acc
  }, {})

  const currentClass = classes.find(x => String(x._id || x.id) === String(classId))

  if (!classId) {
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
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 dark:from-amber-200 dark:to-orange-200 bg-clip-text text-transparent">
                Video Lectures
              </h1>
              <p className="text-amber-600/70 dark:text-amber-400/70">Choose your class to view lectures</p>
            </div>
          </div>
        </motion.div>

        {/* Classes Grid - 2x2 Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {classes.map((c, index) => (
            <motion.div
              key={c._id || c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="h-full"
            >
              <Link
                to={`/student/lectures/${c._id || c.id}`}
                className="group block h-full"
              >
                <div className="relative overflow-hidden bg-gradient-to-br from-amber-600 to-orange-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full min-h-[180px] flex flex-col">
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10 flex-1 flex flex-col p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <div className="flex items-center gap-1 text-xs opacity-80 bg-white/10 px-2 py-1 rounded-full">
                        <UsersIcon className="w-3 h-3" />
                        <span>Class</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-xl font-bold mb-2">{c.title}</h3>
                      <p className="text-sm opacity-90 mb-4">Access all video lectures and study materials</p>
                      
                      <div className="mt-auto pt-4 border-t border-white/20">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 opacity-80">
                            <Video className="w-4 h-4" />
                            <span>Lectures</span>
                          </div>
                          <div className="flex items-center gap-1 opacity-80 group-hover:translate-x-1 transition-transform">
                            <span>View</span>
                            <Sparkles className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom accent */}
                  <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Classes Stats */}
        {classes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                <Layers className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-50">Available Classes</h3>
                <p className="text-sm text-amber-600/70 dark:text-amber-400/70">{classes.length} classes ready for learning</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                  <School className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-amber-900 dark:text-amber-50">Total Classes</div>
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{classes.length}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                  <FolderOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-amber-900 dark:text-amber-50">Lecture Access</div>
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">24/7</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-amber-900 dark:text-amber-50">Updated</div>
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">Regularly</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header with Back Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800 shadow-lg"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <Link
              to="/student/lectures"
              className="p-2 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors group mt-1"
            >
              <ArrowLeft className="w-5 h-5 text-amber-600 dark:text-amber-400 group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-md">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 dark:from-amber-200 dark:to-orange-200 bg-clip-text text-transparent">
                    Video Lectures
                  </h1>
                  <p className="text-amber-600/70 dark:text-amber-400/70">
                    {currentClass?.title} • Access all lectures and study materials
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gradient-to-br from-white to-amber-50 dark:from-gray-800/50 dark:to-amber-950/10 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-900 dark:text-amber-50">
                  {Object.keys(grouped).length}
                </div>
                <div className="text-sm text-amber-600/70 dark:text-amber-400/70">Subjects</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-amber-50 dark:from-gray-800/50 dark:to-amber-950/10 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                <Brain className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-900 dark:text-amber-50">
                  {Object.values(grouped).reduce((acc, chapters) => acc + Object.keys(chapters).length, 0)}
                </div>
                <div className="text-sm text-amber-600/70 dark:text-amber-400/70">Chapters</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-amber-50 dark:from-gray-800/50 dark:to-amber-950/10 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                <PlayCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-900 dark:text-amber-50">
                  {items.length}
                </div>
                <div className="text-sm text-amber-600/70 dark:text-amber-400/70">Total Lectures</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-amber-400 animate-pulse" />
          </div>
          <span className="text-amber-600/70 dark:text-amber-400/70">Loading lectures...</span>
        </div>
      ) : !items.length ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 border-2 border-dashed border-amber-300 dark:border-amber-700 rounded-2xl bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-amber-400" />
          </div>
          <h3 className="text-lg font-medium text-amber-900 dark:text-amber-100 mb-2">No lectures found</h3>
          <p className="text-amber-600/70 dark:text-amber-400/70">
            Lectures will appear here once they are uploaded for this class
          </p>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([subject, chapters], subjectIndex) => (
            <motion.div
              key={subject}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: subjectIndex * 0.1 }}
              className="space-y-6"
            >
              {/* Subject Header */}
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center shadow-sm">
                  <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-amber-900 dark:text-amber-50">{subject}</h3>
                  <p className="text-sm text-amber-600/70 dark:text-amber-400/70">
                    {Object.keys(chapters).length} chapter{Object.keys(chapters).length !== 1 ? 's' : ''} • {Object.values(chapters).reduce((acc, lectures) => acc + lectures.length, 0)} lectures
                  </p>
                </div>
              </div>

              {/* Chapters */}
              <div className="space-y-8 pl-0 md:pl-4">
                {Object.entries(chapters).map(([chapter, lectures], chapterIndex) => (
                  <motion.div
                    key={chapter}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: (subjectIndex * 0.2) + (chapterIndex * 0.1) }}
                    className="space-y-4"
                  >
                    {/* Chapter Header */}
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-br from-amber-500 to-orange-500"></div>
                      <h4 className="text-lg font-semibold text-amber-900 dark:text-amber-100">{chapter}</h4>
                      <span className="text-sm text-amber-600/70 dark:text-amber-400/70">
                        • {lectures.length} lecture{lectures.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Lectures Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {lectures.map((lecture, lectureIndex) => {
                        const isLocked = lecture.isPremium && !user?.isPremium
                        return (
                          <motion.div
                            key={lecture._id || lecture.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: lectureIndex * 0.05 }}
                          >
                            <Card className="h-full border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10 hover:shadow-xl transition-all duration-300 group">
                              <div className="h-full flex flex-col">
                                {/* Card Header */}
                                <div className="flex items-start justify-between gap-3 mb-4">
                                  <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-50 group-hover:text-amber-700 transition-colors line-clamp-2">
                                      {lecture.title}
                                    </h3>
                                    {lecture.description && (
                                      <p className="text-sm text-amber-600/70 dark:text-amber-400/70 mt-1 line-clamp-2">
                                        {lecture.description}
                                      </p>
                                    )}
                                  </div>
                                  {lecture.isPremium && (
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 flex-shrink-0 ${isLocked
                                      ? 'bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-300'
                                      : 'bg-gradient-to-r from-amber-600 to-orange-600 text-white'
                                      }`}>
                                      {isLocked ? <Lock className="w-3 h-3" /> : <Crown className="w-3 h-3" />}
                                      Premium
                                    </span>
                                  )}
                                </div>

                                {/* Video Preview */}
                                {lecture.type === 'file' && !isLocked ? (
                                  <div className="relative rounded-xl overflow-hidden mb-4 bg-amber-100 dark:bg-amber-900/20 aspect-video">
                                    <video 
                                      src={`${SERVER_ORIGIN}${lecture.file_path}`} 
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                        <PlayCircle className="w-6 h-6 text-white" />
                                      </div>
                                    </div>
                                  </div>
                                ) : lecture.type === 'file' && isLocked ? (
                                  <div className="relative rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-amber-200 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30 aspect-video flex items-center justify-center">
                                    <div className="absolute inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center">
                                      <div className="text-center p-6">
                                        <Lock className="w-12 h-12 text-white/80 mx-auto mb-3" />
                                        <p className="text-white/90 font-medium mb-2">Premium Content</p>
                                        <p className="text-white/70 text-sm">Upgrade to access this lecture</p>
                                      </div>
                                    </div>
                                  </div>
                                ) : null}

                                {/* Actions */}
                                <div className="mt-auto pt-4 border-t border-amber-200 dark:border-amber-800">
                                  {isLocked ? (
                                    <div className="relative group">
                                      <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-300 text-sm font-semibold w-full justify-center">
                                        <Lock className="w-4 h-4" />
                                        Premium Only
                                      </div>
                                      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-amber-900 text-white text-sm rounded-lg px-4 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 w-64 text-center">
                                        <Crown className="w-4 h-4 inline mr-2 mb-1" />
                                        Upgrade to Premium to access this content
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-amber-900"></div>
                                      </div>
                                    </div>
                                  ) : lecture.type === 'link' ? (
                                    <a
                                      href={lecture.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-sm font-semibold transition-all duration-300 hover:scale-[1.02] w-full justify-center"
                                    >
                                      <LinkIcon className="w-4 h-4" />
                                      Open Video Link
                                    </a>
                                  ) : (
                                    <div className="flex items-center justify-center gap-2 text-sm text-amber-600/70 dark:text-amber-400/70">
                                      <Video className="w-4 h-4" />
                                      <span>Video lecture available</span>
                                    </div>
                                  )}
                                </div>

                                {/* Type Badge */}
                                <div className="mt-4 flex items-center justify-between">
                                  <div className="flex items-center gap-2 text-xs text-amber-600/70 dark:text-amber-400/70">
                                    {lecture.type === 'file' ? (
                                      <>
                                        <Video className="w-3 h-3" />
                                        <span>Video File</span>
                                      </>
                                    ) : (
                                      <>
                                        <LinkIcon className="w-3 h-3" />
                                        <span>External Link</span>
                                      </>
                                    )}
                                  </div>
                                  {!lecture.isPremium && (
                                    <span className="px-2 py-1 rounded-full bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
                                      Free Access
                                    </span>
                                  )}
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        )
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
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
              <span>Video lectures enhance understanding through visual learning</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span>Free: {items.filter(l => !l.isPremium).length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span>Premium: {items.filter(l => l.isPremium).length}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Total: {items.length} lectures</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}