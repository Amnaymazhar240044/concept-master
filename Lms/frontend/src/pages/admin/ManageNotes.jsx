import { useEffect, useState } from 'react'
import api from '../../lib/api'
import { SERVER_ORIGIN } from '../../lib/config'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import { motion } from 'framer-motion'
import { 
  FileText, Download, Search, Filter, BookOpen, FolderOpen, 
  ArrowLeft, Calendar, User, Layers, Trash2, Plus, AlertCircle, 
  CheckCircle, GraduationCap, Sparkles, Target, Brain, Zap, 
  ArrowRight, FileUp, FolderPlus, Bookmark 
} from 'lucide-react'

export default function ManageNotes() {
    const [classId, setClassId] = useState(null)
    const [classes, setClasses] = useState([])
    const [subjects, setSubjects] = useState([])
    const [selectedSubject, setSelectedSubject] = useState(null)

    const [chapters, setChapters] = useState([])
    const [notes, setNotes] = useState([])

    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [msg, setMsg] = useState('')

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

    const deleteNote = async (id) => {
        if (!confirm('Are you sure you want to delete this note?')) return
        try {
            await api.delete(`/notes/${id}`)
            setNotes(notes.filter(n => (n._id || n.id) !== id))
            setMsg('Note deleted successfully')
            setTimeout(() => setMsg(''), 3000)
        } catch (error) {
            console.error('Failed to delete note', error)
            alert('Failed to delete note')
        }
    }

    const currentClass = classes.find(c => String(c._id || c.id) === String(classId))

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
            chapter: { title: 'Uncategorized / General', _id: 'uncategorized' },
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

        // Filter out empty groups if search term is active, or just return all
        return Object.values(grouped).sort((a, b) => {
            if (a.chapter._id === 'uncategorized') return 1
            if (b.chapter._id === 'uncategorized') return -1
            return (a.chapter.order || 0) - (b.chapter.order || 0)
        })
    }

    // 1. Class Selection View
    if (!classId) {
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
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 dark:from-amber-200 dark:to-orange-200 bg-clip-text text-transparent">
                                Manage Notes
                            </h1>
                            <p className="text-amber-600/70 dark:text-amber-400/70">Select a class to view and manage notes</p>
                        </div>
                    </div>
                </motion.div>

                {loading ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, index) => (
                            <div key={index} className="h-40 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-2xl animate-pulse border border-amber-200 dark:border-amber-800"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {classes.map((c, index) => (
                            <motion.div
                                key={c._id || c.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                onClick={() => setClassId(c._id || c.id)}
                                className="cursor-pointer"
                            >
                                <div className="group block h-full">
                                    <div className="relative overflow-hidden bg-gradient-to-br from-amber-600 to-orange-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <div className="relative z-10">
                                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                <BookOpen className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-xl font-bold mb-2">{c.title}</h3>
                                            <p className="text-sm opacity-90 mb-3">Manage notes and resources</p>
                                            <div className="flex items-center text-xs opacity-80">
                                                <span>Select to continue</span>
                                                <ArrowRight className="w-3 h-3 ml-1" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Summary Footer */}
                {classes.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-4 text-sm text-amber-600/70 dark:text-amber-400/70"
                    >
                        <FolderOpen className="w-4 h-4" />
                        <span>{classes.length} classes available for notes management</span>
                        <Sparkles className="w-4 h-4" />
                    </motion.div>
                )}
            </div>
        )
    }

    // 2. Subject Selection View
    if (!selectedSubject) {
        return (
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header with Back Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800 shadow-lg"
                >
                    <div className="flex items-center gap-4 mb-2">
                        <button 
                            onClick={() => setClassId(null)} 
                            className="p-2 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors group"
                        >
                            <ArrowLeft className="w-5 h-5 text-amber-600 dark:text-amber-400 group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-md">
                                <Bookmark className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 dark:from-amber-200 dark:to-orange-200 bg-clip-text text-transparent">
                                    Subjects – {currentClass?.title}
                                </h1>
                                <p className="text-amber-600/70 dark:text-amber-400/70">Select a subject to manage notes</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {loading ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, index) => (
                            <div key={index} className="h-40 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-2xl animate-pulse border border-amber-200 dark:border-amber-800"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {subjects.map((s, index) => (
                            <motion.div
                                key={s._id || s.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                onClick={() => setSelectedSubject(s)}
                                className="cursor-pointer"
                            >
                                <div className="group block h-full">
                                    <div className="relative overflow-hidden bg-gradient-to-br from-amber-600 to-orange-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <div className="relative z-10">
                                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                <BookOpen className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-xl font-bold mb-2">{s.name}</h3>
                                            <p className="text-sm opacity-90 mb-3">View and manage notes</p>
                                            <div className="flex items-center text-xs opacity-80">
                                                <span>Click to select</span>
                                                <ArrowRight className="w-3 h-3 ml-1" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        )
    }

    // 3. Notes & Chapters View
    const groups = groupedNotes()
    const filteredGroups = groups.filter(group => 
        group.notes.some(note =>
            note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )

    return (
        <div className="max-w-6xl mx-auto space-y-6">
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

            {/* Header with Navigation */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800 shadow-lg"
            >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <button
                            onClick={() => setSelectedSubject(null)}
                            className="p-2 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors group mt-1"
                        >
                            <ArrowLeft className="w-5 h-5 text-amber-600 dark:text-amber-400 group-hover:-translate-x-1 transition-transform" />
                        </button>

                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-md">
                                    <FileText className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 dark:from-amber-200 dark:to-orange-200 bg-clip-text text-transparent">
                                        {selectedSubject.name} Notes
                                    </h1>
                                    <p className="text-amber-600/70 dark:text-amber-400/70">
                                        {currentClass?.title} • Manage study materials and resources
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative flex-shrink-0">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-400" />
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:outline-none transition-colors text-amber-900 dark:text-amber-100 placeholder-amber-500/60 dark:placeholder-amber-400/40 w-full sm:w-64"
                        />
                    </div>
                </div>
            </motion.div>

            {loading ? (
                <div className="space-y-8">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="space-y-4">
                            <div className="h-8 w-48 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded animate-pulse border border-amber-200 dark:border-amber-800"></div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(3)].map((_, j) => (
                                    <div key={j} className="h-64 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl animate-pulse border border-amber-200 dark:border-amber-800"></div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-10">
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
                                <div className="flex items-center gap-3 pb-4 border-b border-amber-200 dark:border-amber-800">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center shadow-sm">
                                        <Layers className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <h2 className="text-xl font-bold text-amber-900 dark:text-amber-100">
                                        {group.chapter.title}
                                    </h2>
                                    <div className="ml-auto text-sm text-amber-600/70 dark:text-amber-400/70">
                                        {groupNotes.length} note{groupNotes.length !== 1 ? 's' : ''}
                                    </div>
                                </div>

                                {/* Notes Grid */}
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {groupNotes.map((note) => (
                                        <motion.div
                                            key={note._id || note.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="h-full"
                                        >
                                            <Card className="h-full hover:shadow-xl transition-all duration-300 group relative border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-sm">
                                                        <FileText className="w-6 h-6" />
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={() => deleteNote(note._id || note.id)}
                                                            className="flex items-center gap-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white border-0 shadow-sm hover:shadow-md"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                <h3 className="text-lg font-bold mb-2 text-amber-900 dark:text-amber-50 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors line-clamp-2">
                                                    {note.title}
                                                </h3>

                                                <p className="text-sm text-amber-600/70 dark:text-amber-400/70 mb-4 line-clamp-3">
                                                    {note.description || 'No description available'}
                                                </p>

                                                <div className="flex items-center justify-between mt-auto">
                                                    <div className="flex items-center gap-1 text-xs text-amber-500/60 dark:text-amber-400/50">
                                                        <Calendar className="w-3 h-3" />
                                                        <span>{note.created_at ? new Date(note.created_at).toLocaleDateString() : 'Unknown date'}</span>
                                                    </div>

                                                    <a
                                                        href={`${SERVER_ORIGIN}${note.file_path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-sm font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 shadow-sm"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        Download
                                                    </a>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )
                    })}

                    {filteredGroups.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-12 border-2 border-dashed border-amber-300 dark:border-amber-700 rounded-2xl bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10"
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-8 h-8 text-amber-400" />
                            </div>
                            <h3 className="text-lg font-medium text-amber-900 dark:text-amber-100 mb-2">
                                {searchTerm ? 'No notes found' : 'No notes available'}
                            </h3>
                            <p className="text-amber-600/70 dark:text-amber-400/70">
                                {searchTerm ? 'Try adjusting your search terms' : 'Notes will appear here once uploaded'}
                            </p>
                            <div className="flex items-center justify-center gap-2 mt-4 text-amber-500">
                                <FileUp className="w-4 h-4" />
                                <span>Upload notes to get started</span>
                            </div>
                        </motion.div>
                    )}

                    {/* Summary Footer */}
                    {filteredGroups.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="pt-4 border-t border-amber-200 dark:border-amber-800"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-amber-600/70 dark:text-amber-400/70">
                                <div className="flex items-center gap-2">
                                    <Brain className="w-4 h-4" />
                                    <span>Notes are organized by chapters for systematic learning</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    <span>Total: {notes.length} notes across {filteredGroups.length} section{filteredGroups.length !== 1 ? 's' : ''}</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            )}
        </div>
    )
}