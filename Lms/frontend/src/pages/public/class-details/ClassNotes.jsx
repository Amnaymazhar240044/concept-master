import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  FileText, Clock, Eye, Search, Book, ChevronLeft, ChevronRight, 
  Folder, Download, Filter, Grid, List, Loader2, Calendar, User 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../lib/api';

export default function ClassNotes() {
    const { classId } = useParams();
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notesLoading, setNotesLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    // Fetch subjects on mount
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await api.get('/subjects');
                setSubjects(res.data || []);
            } catch (err) {
                console.error('Failed to fetch subjects:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSubjects();
    }, []);

    // Fetch notes when subject is selected
    useEffect(() => {
        const fetchNotes = async () => {
            if (!selectedSubject) return;

            setNotesLoading(true);
            try {
                const res = await api.get('/notes', {
                    params: {
                        class_id: classId,
                        subject_id: selectedSubject._id
                    }
                });
                setNotes(res.data.data || []);
            } catch (err) {
                console.error('Failed to fetch notes:', err);
            } finally {
                setNotesLoading(false);
            }
        };

        fetchNotes();
    }, [selectedSubject, classId]);

    // Group notes by chapter
    const groupedNotes = notes.reduce((acc, note) => {
        const chapterName = note.chapter_id?.title || 'General Resources';
        if (!acc[chapterName]) {
            acc[chapterName] = [];
        }
        acc[chapterName].push(note);
        return acc;
    }, {});

    const filteredSubjects = subjects.filter(sub =>
        sub.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    {selectedSubject ? (
                        <button
                            onClick={() => setSelectedSubject(null)}
                            className="flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors mb-1 group"
                        >
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span>Back to Subjects</span>
                        </button>
                    ) : null}
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        {selectedSubject ? `${selectedSubject.name} Notes` : 'Select Subject'}
                    </h2>
                    <p className="text-amber-600/70 dark:text-amber-400/70 text-sm">
                        {selectedSubject ? 'Browse notes by chapter' : 'Choose a subject to view notes'}
                    </p>
                </div>

                {!selectedSubject && (
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                            <input
                                type="text"
                                placeholder="Search subjects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2.5 rounded-xl border border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 outline-none w-full sm:w-64"
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
                )}
            </div>

            {/* Stats Bar */}
            {selectedSubject && (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{notes.length}</div>
                        <div className="text-sm text-amber-600 dark:text-amber-400">Total Notes</div>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{Object.keys(groupedNotes).length}</div>
                        <div className="text-sm text-amber-600 dark:text-amber-400">Chapters</div>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {notes.filter(n => n.downloads > 100).length}
                        </div>
                        <div className="text-sm text-amber-600 dark:text-amber-400">Popular</div>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {notes.filter(n => new Date(n.createdAt) > new Date(Date.now() - 7*24*60*60*1000)).length}
                        </div>
                        <div className="text-sm text-amber-600 dark:text-amber-400">Recent</div>
                    </div>
                </div>
            )}

            <AnimatePresence mode="wait">
                {!selectedSubject ? (
                    /* Subjects Grid */
                    <motion.div
                        key="subjects"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`grid gap-6 ${viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}
                    >
                        {filteredSubjects.map((subject, index) => (
                            <motion.div
                                key={subject._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => setSelectedSubject(subject)}
                                className="group cursor-pointer"
                            >
                                <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl border border-amber-200 dark:border-amber-800 hover:border-amber-500 dark:hover:border-amber-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${viewMode === 'list' ? 'flex items-center gap-4' : 'text-center'}`}>
                                    <div className={`${viewMode === 'list' ? 'w-16 h-16' : 'w-20 h-20 mx-auto'} bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-xl flex items-center justify-center mb-4 ${viewMode === 'list' ? 'mb-0' : ''} group-hover:scale-110 transition-transform`}>
                                        <Book className={`${viewMode === 'list' ? 'w-8 h-8' : 'w-10 h-10'} text-amber-600 dark:text-amber-400`} />
                                    </div>
                                    <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{subject.name}</h3>
                                        {viewMode === 'list' && (
                                            <p className="text-sm text-amber-600/70 dark:text-amber-400/70 line-clamp-2">
                                                Browse comprehensive notes and study materials
                                            </p>
                                        )}
                                        <div className="flex items-center justify-center gap-1 text-sm text-amber-600 dark:text-amber-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                                            <span>View Notes</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    /* Notes List (Grouped by Chapter) */
                    <motion.div
                        key="notes"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-8"
                    >
                        {notesLoading ? (
                            <div className="flex justify-center py-12">
                                <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : Object.keys(groupedNotes).length === 0 ? (
                            <div className="text-center py-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-amber-200 dark:border-amber-800">
                                <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <FileText className="w-10 h-10 text-amber-600 dark:text-amber-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">No notes yet</h3>
                                <p className="text-amber-600/70 dark:text-amber-400/70 mb-6 max-w-md mx-auto">
                                    No notes have been added for {selectedSubject.name} yet. Check back soon!
                                </p>
                                <button
                                    onClick={() => setSelectedSubject(null)}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-md"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Back to Subjects
                                </button>
                            </div>
                        ) : (
                            Object.entries(groupedNotes).map(([chapter, chapterNotes]) => (
                                <div key={chapter} className="space-y-4">
                                    <div className="flex items-center gap-3 pb-2 border-b border-amber-200 dark:border-amber-800">
                                        <Folder className="w-5 h-5 text-amber-500" />
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{chapter}</h3>
                                        <span className="text-sm text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30 px-3 py-1 rounded-full font-medium">
                                            {chapterNotes.length} notes
                                        </span>
                                    </div>

                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {chapterNotes.map((note) => (
                                            <div key={note._id} className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-amber-200 dark:border-amber-800 hover:border-amber-500 dark:hover:border-amber-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden">
                                                <div className="p-6">
                                                    {/* Note Header */}
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-200 dark:border-amber-800">
                                                            <span className="text-xs font-bold text-amber-700 dark:text-amber-300">PDF</span>
                                                        </div>
                                                        {note.downloads > 50 && (
                                                            <div className="flex items-center gap-1">
                                                                <Eye className="w-3 h-3 text-amber-500" />
                                                                <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Popular</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Note Title & Description */}
                                                    <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                                        {note.title}
                                                    </h4>
                                                    <p className="text-sm text-amber-600/70 dark:text-amber-400/70 line-clamp-2 mb-6">
                                                        {note.description || 'Comprehensive notes covering key concepts and examples.'}
                                                    </p>

                                                    {/* Note Details */}
                                                    <div className="flex items-center justify-between pt-6 border-t border-amber-100 dark:border-amber-800">
                                                        <div className="flex items-center gap-3 text-xs">
                                                            <div className="flex items-center gap-1.5 text-amber-600/70 dark:text-amber-400/70">
                                                                <Calendar className="w-3.5 h-3.5" />
                                                                <span>{new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                                            </div>
                                                            {note.pages && (
                                                                <div className="flex items-center gap-1.5 text-amber-600/70 dark:text-amber-400/70">
                                                                    <FileText className="w-3.5 h-3.5" />
                                                                    <span>{note.pages} pages</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        {/* Action Button */}
                                                        <a
                                                            href={`${import.meta.env.VITE_API_BASE_URL}${note.file_path}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1.5 text-sm font-semibold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-4 py-2 rounded-lg transition-all hover:scale-105 shadow-md"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                            View
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}