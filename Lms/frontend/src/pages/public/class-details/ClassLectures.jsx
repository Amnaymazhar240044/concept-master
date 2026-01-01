import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, Clock, Eye, Search, Book, ChevronLeft, ChevronRight, Folder, Sparkles, Layers, Download, FileDown, Brain, Calendar } from 'lucide-react';
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
            <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center mb-4">
                    <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <span className="text-amber-600/70 dark:text-amber-400/70">Loading subjects...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800 shadow-lg"
            >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-md">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            {selectedSubject ? (
                                <button
                                    onClick={() => setSelectedSubject(null)}
                                    className="flex items-center gap-2 text-amber-600/70 hover:text-amber-700 dark:text-amber-400/70 dark:hover:text-amber-300 transition-colors mb-2 group"
                                >
                                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                    <span className="text-sm">Back to Subjects</span>
                                </button>
                            ) : null}
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 dark:from-amber-200 dark:to-orange-200 bg-clip-text text-transparent">
                                {selectedSubject ? `${selectedSubject.name} Notes` : 'Study Notes'}
                            </h1>
                            <p className="text-amber-600/70 dark:text-amber-400/70">
                                {selectedSubject ? 'Browse notes by chapter' : 'Choose a subject to view study materials'}
                            </p>
                        </div>
                    </div>

                    {!selectedSubject && (
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                            <input
                                type="text"
                                placeholder="Search subjects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2.5 rounded-xl border border-amber-200 dark:border-amber-800 bg-white dark:bg-gray-800/50 text-amber-900 dark:text-amber-50 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none w-full sm:w-64 backdrop-blur-sm"
                            />
                        </div>
                    )}
                </div>

                {/* Stats */}
                {!selectedSubject && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                                <Book className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <div className="text-lg font-bold text-amber-900 dark:text-amber-50">{subjects.length}</div>
                                <div className="text-sm text-amber-600/70 dark:text-amber-400/70">Subjects</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                                <Layers className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <div className="text-lg font-bold text-amber-900 dark:text-amber-50">Comprehensive</div>
                                <div className="text-sm text-amber-600/70 dark:text-amber-400/70">Coverage</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                                <Brain className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <div className="text-lg font-bold text-amber-900 dark:text-amber-50">Easy Learning</div>
                                <div className="text-sm text-amber-600/70 dark:text-amber-400/70">Well Structured</div>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>

            <AnimatePresence mode="wait">
                {!selectedSubject ? (
                    /* Subjects Grid */
                    <motion.div
                        key="subjects"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {filteredSubjects.map((subject, index) => (
                            <motion.div
                                key={subject._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => setSelectedSubject(subject)}
                                className="group cursor-pointer h-full"
                            >
                                <div className="h-full bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10 p-6 rounded-2xl border-2 border-amber-200 dark:border-amber-800 hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-center">
                                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                                        <Book className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <h3 className="font-bold text-lg text-amber-900 dark:text-amber-50 mb-3">{subject.name}</h3>
                                    <div className="flex items-center justify-center gap-2 text-sm text-amber-600/70 dark:text-amber-400/70 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span>View Study Notes</span>
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                    
                                    {/* Bottom accent */}
                                    <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-6 rounded-full"></div>
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
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center mb-4">
                                    <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                                <span className="text-amber-600/70 dark:text-amber-400/70">Loading notes...</span>
                            </div>
                        ) : Object.keys(groupedNotes).length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-16 border-2 border-dashed border-amber-300 dark:border-amber-700 rounded-2xl bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10"
                            >
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-10 h-10 text-amber-400" />
                                </div>
                                <h3 className="text-lg font-medium text-amber-900 dark:text-amber-100 mb-2">No notes found</h3>
                                <p className="text-amber-600/70 dark:text-amber-400/70 max-w-sm mx-auto">
                                    Notes will appear here once they are uploaded for this subject
                                </p>
                            </motion.div>
                        ) : (
                            Object.entries(groupedNotes).map(([chapter, chapterNotes]) => (
                                <div key={chapter} className="space-y-4">
                                    {/* Chapter Header */}
                                    <div className="flex items-center gap-3 pb-3 border-b border-amber-200 dark:border-amber-800">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                                            <Folder className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-amber-900 dark:text-amber-50">{chapter}</h3>
                                            <div className="flex items-center gap-3 text-sm text-amber-600/70 dark:text-amber-400/70">
                                                <span>{chapterNotes.length} note{chapterNotes.length !== 1 ? 's' : ''}</span>
                                                <div className="w-1 h-1 rounded-full bg-amber-500/50"></div>
                                                <span>Study Materials</span>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-300 text-sm font-medium">
                                            {chapterNotes.length} files
                                        </span>
                                    </div>

                                    {/* Notes Grid */}
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {chapterNotes.map((note) => (
                                            <div key={note._id} className="group bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10 rounded-xl border-2 border-amber-200 dark:border-amber-800 hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-300 hover:shadow-xl overflow-hidden">
                                                <div className="p-5">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                                                            <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                                        </div>
                                                        <span className="px-2 py-1 rounded-full bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
                                                            PDF
                                                        </span>
                                                    </div>

                                                    <h4 className="font-bold text-amber-900 dark:text-amber-50 mb-2 line-clamp-2 group-hover:text-amber-700 transition-colors">
                                                        {note.title}
                                                    </h4>
                                                    <p className="text-sm text-amber-600/70 dark:text-amber-400/70 line-clamp-2 mb-4">
                                                        {note.description}
                                                    </p>

                                                    <div className="flex items-center justify-between pt-4 border-t border-amber-200 dark:border-amber-800">
                                                        <div className="flex items-center gap-2 text-xs text-amber-600/70 dark:text-amber-400/70">
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            <span>{new Date(note.createdAt).toLocaleDateString('en-US', { 
                                                                month: 'short', 
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}</span>
                                                        </div>
                                                        <a
                                                            href={`http://localhost:5000${note.file_path}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 transition-colors group/link"
                                                        >
                                                            <Eye className="w-4 h-4 group-hover/link:scale-110 transition-transform" />
                                                            View
                                                        </a>
                                                    </div>
                                                </div>
                                                
                                                {/* Download button overlay */}
                                                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <a
                                                        href={`http://localhost:5000${note.file_path}`}
                                                        download
                                                        className="p-2 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:shadow-lg transition-all"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </a>
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

            {/* Summary Footer */}
            {subjects.length > 0 && !selectedSubject && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-4 border-t border-amber-200 dark:border-amber-800"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-amber-600/70 dark:text-amber-400/70">
                        <div className="flex items-center gap-2">
                            <Brain className="w-4 h-4" />
                            <span>Comprehensive study notes for effective learning</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500"></div>
                                <span>Subjects: {subjects.length}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                <span>Available: {filteredSubjects.length}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                <span>Free Access</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}